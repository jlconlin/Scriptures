// Static site generator for Line upon Line.
// Reads content/ and data/, writes a complete static site to dist/.
import { readFile, writeFile, mkdir, readdir, cp, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import YAML from 'yaml';
import { md, plain, unknownRefs } from '../src/lib/markdown.mjs';
import { applyCitations, stripCitations } from '../src/lib/citations.mjs';
import { configureScripturePreviews } from '../src/lib/scripture-previews.mjs';
import { renderChapter, range, chapterLabel } from '../src/templates/chapter.mjs';
// A note's reference as a reader sees it; verse 0 is a psalm's title.
const noteRef = (book, chapter, ref) => (String(ref) === '0' ? `${chapterLabel(book, chapter)}, title` : `${chapterLabel(book, chapter)}:${ref}`);
import { renderFacsimile, facsimileUrl } from '../src/templates/facsimile.mjs';
import { discoverBooks, discoverVolumes } from '../src/lib/books.mjs';
import { VOLUMES, placeOf } from '../src/lib/canon.mjs';
import { SITE, LIBRARY, VOLUMES_WITH_GUIDES } from '../src/site.mjs';
import { renderHome, renderVolume, renderBookIndex, renderGuidesIndex, renderGuide, renderPage, renderSearch, render404, chapterGuide, offlinePanel, teaserText, COLLECTIONS } from '../src/templates/pages.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
// BUILD_OUT=<dir> writes the site somewhere other than dist/, so several agents can each run the
// build as a check without overwriting one another's output.
const OUT = process.env.BUILD_OUT ? path.resolve(process.env.BUILD_OUT) : path.join(ROOT, 'dist');
const r = (...p) => path.join(ROOT, ...p);

// PREVIEW=1 (set by npm run dev) also builds books whose book.yaml says `status: preview`, and so
// does a Cloudflare build of any branch but main (the dev site, scriptures-dev.conlin.io). The live
// site leaves them out entirely.
const PREVIEW = process.env.PREVIEW === '1' || (!!process.env.WORKERS_CI_BRANCH && process.env.WORKERS_CI_BRANCH !== 'main');
const run = promisify(execFile);

const warnings = [];
const warn = (m) => warnings.push(m);

async function write(rel, content) {
  const file = path.join(OUT, rel);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
}

// Content pages carry the last commit that changed their own source file, rather than the date of
// a site-wide deploy. An uncommitted file still gets a useful date in a local preview.
async function lastRevised(file) {
  const rel = path.relative(ROOT, file);
  try {
    const { stdout } = await run('git', ['log', '-1', '--format=%cs', '--', rel], { cwd: ROOT });
    const date = stdout.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  } catch {
    // A source archive may omit Git history; use the source file's timestamp in that case.
  }
  return (await stat(file)).mtime.toISOString().slice(0, 10);
}

// The offline copy (DEVELOPMENT.md, “Reading offline”): every file a reader's device saves, as its URL and a
// hash of its contents, so that the service worker (public/sw.js) fetches only what changed since the last save.
// A page's ?v= stamp changes with every build, so it is left out of the hash: the saved copy answers assets
// without their query, and an unchanged page is not fetched again for a new stamp.
const OFFLINE_SKIP = /^(sw\.js|offline\.json|sitemap\.xml|robots\.txt|manifest\.webmanifest)$/;
async function writeOfflineList() {
  const walk = async (d) => (await Promise.all((await readdir(d, { withFileTypes: true })).map((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])))).flat();
  const files = {};
  let bytes = 0;
  for (const f of (await walk(OUT)).sort()) {
    const rel = path.relative(OUT, f).split(path.sep).join('/');
    if (OFFLINE_SKIP.test(rel)) continue;
    let body = await readFile(f);
    bytes += body.length;
    if (rel.endsWith('.html')) body = body.toString('utf8').replaceAll(`?v=${SITE.version}`, '');
    const url = `/${rel}`.replace(/(^|\/)index\.html$/, '$1');
    files[url] = createHash('sha1').update(body).digest('hex').slice(0, 12);
  }
  await write('offline.json', JSON.stringify({ built: new Date().toISOString().slice(0, 10), bytes, files }));
}

const readYaml = async (p) => {
  try {
    return YAML.parse(await readFile(p, 'utf8'));
  } catch (e) {
    throw new Error(`${path.relative(ROOT, p)}: ${e.message}`);
  }
};

/** Parse a markdown file with optional YAML front matter. */
async function readMd(p) {
  const raw = await readFile(p, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  return m ? { ...YAML.parse(m[1]), body: m[2] } : { body: raw };
}

// BUILD_SEED makes the home page's random teasers repeatable (for comparing two builds).
function random() {
  let a = process.env.BUILD_SEED === undefined ? null : Number(process.env.BUILD_SEED) >>> 0;
  if (a === null) return Math.random;
  return () => { // mulberry32
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Division colors for books whose book.yaml gives `color` (and optionally `darkColor`) per division.
// Isaiah's are in site.css; this appends a block for the others, so they need no CSS edit.
async function writeBookColors(books, css) {
  const light = [], dark = [];
  for (const b of books)
    for (const d of b.divisions) {
      if (d.color) {
        light.push(`--div-${d.key}: ${d.color};`);
        dark.push(`--div-${d.key}: ${d.darkColor ?? d.color};`);
      } else if (!css.includes(`--div-${d.key}:`)) b.warn(`division “${d.key}” has no color in book.yaml and no --div-${d.key} in site.css`);
    }
  if (!light.length) return;
  const file = path.join(OUT, 'assets/site.css');
  await writeFile(
    file,
    `${css}\n/* Division colors from book.yaml (generated by build.mjs) */\n:root { ${light.join(' ')} }\n@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) { ${dark.join(' ')} } }\n:root[data-theme='dark'] { ${dark.join(' ')} }\n`,
  );
}

// The pages of a guides/ or themes/ directory that this build publishes. A page whose front matter says
// `status: preview` is left out of the live build, as a book in preview is.
async function pageFiles(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const f of (await readdir(dir)).filter((f) => f.endsWith('.md')).sort()) {
    const file = path.join(dir, f);
    const page = await readMd(file);
    if (page.status !== 'preview' || PREVIEW) out.push({ f, file, page });
  }
  return out;
}

export async function build({ quiet = false } = {}) {
  warnings.length = 0;
  unknownRefs.clear();
  const t0 = Date.now();
  const rand = random();

  const sources = await readYaml(r('content/sources.yaml'));
  // The Old Testament's periods, which a chapter's Context link opens (content/volumes/old-testament/CONTEXT.md).
  const periods = await readYaml(r('content/volumes/old-testament/periods.yaml'));
  const books = (await discoverBooks(ROOT)).filter((b) => (b.status ?? 'live') === 'live' || PREVIEW);
  if (!books.length) throw new Error('No books: expected content/<slug>/book.yaml and content/<slug>/chapters/');

  // A volume owns the guides that are true of more than one of its books (content/volumes/<slug>/guides/).
  const volumes = discoverVolumes(ROOT);
  VOLUMES_WITH_GUIDES.clear();
  for (const v of volumes) if ((await pageFiles(path.join(v.dir, 'guides'))).length) VOLUMES_WITH_GUIDES.add(v.key);

  // Chapters: every chapter gets a page; authored YAML fills in the commentary.
  for (const book of books) {
    const kjvFile = r(`data/kjv/${book.slug}.json`);
    if (!existsSync(kjvFile)) throw new Error(`content/${book.slug}: missing data/kjv/${book.slug}.json (node scripts/fetch-kjv.mjs)`);
    book.kjv = JSON.parse(await readFile(kjvFile, 'utf8'));
    // The titles above the psalms and Psalm 119's stanza letters (scripts/fetch-psalm-titles.mjs); optional.
    const titlesFile = r(`data/kjv/${book.slug}.titles.json`);
    const titleData = existsSync(titlesFile) ? JSON.parse(await readFile(titlesFile, 'utf8')) : {};
    book.kjv.titles = titleData.titles ?? {};
    book.kjv.stanzas = titleData.stanzas ?? {};
    // Book of Mormon comparison data is optional; chapters without it simply have no BoM panel.
    const bomFile = r(`data/bom/${book.slug}-parallels.json`);
    book.bomParallels = existsSync(bomFile) ? JSON.parse(await readFile(bomFile, 'utf8')).chapters : {};
    book.warn = (m) => warn(`${book.name}: ${m}`);

    const chDir = path.join(book.dir, 'chapters');
    const files = (await readdir(chDir)).filter((f) => f.endsWith('.yaml'));
    const authored = new Map();
    for (const f of files) {
      const file = path.join(chDir, f);
      const ch = await readYaml(file);
      ch.updated = await lastRevised(file);
      authored.set(ch.chapter, ch);
    }
    // A chapter without a YAML file is unwritten: it gets no page, and the book page, chapter strip,
    // and [[…]] references send readers to the Gospel Library for it.
    book.chapters = book.kjv.chapters.map((_, i) => {
      const n = i + 1;
      return authored.get(n) ?? { chapter: n, title: book.titles?.[n], draft: true };
    });
    book.written = book.chapters.filter((c) => !c.draft);
    // A book with every chapter written is due its illustration (DEVELOPMENT.md, “Book illustration workflow”).
    if (book.written.length === book.chapters.length) {
      const v = book.visual;
      if (!v) book.warn('every chapter is written but there is no visual.yaml: run .claude/workflows/create-book-art.js');
      else if (v.status !== 'approved') book.warn(`visual.yaml is “${v.status ?? 'without a status'}”: the book page shows the placeholder until the author approves an image`);
      else if (!v.asset || !v.alt) book.warn('visual.yaml is approved but lacks asset or alt, so the book page shows the placeholder');
      else if (!existsSync(r('src', v.asset))) book.warn(`visual.yaml names ${v.asset}, which is not in src/assets/`);
    }
    // Facsimiles (the Book of Abraham has three): the explanations are in data/kjv/<slug>.facsimiles.json,
    // and content/<slug>/facsimiles/<n>.yaml gives each plate its title, image, introduction and notes.
    book.facsimiles = [];
    const facFile = r(`data/kjv/${book.slug}.facsimiles.json`);
    if (existsSync(facFile)) {
      for (const text of JSON.parse(await readFile(facFile, 'utf8')).facsimiles) {
        const file = path.join(book.dir, 'facsimiles', `${text.n}.yaml`);
        if (!existsSync(file)) continue;
        const fac = { ...text, ...(await readYaml(file)), updated: await lastRevised(file) };
        if (!existsSync(r('src', fac.image))) book.warn(`facsimile ${fac.n} names ${fac.image}, which is not in src/assets/`);
        for (const k of [...(fac.sources ?? []), ...(fac.notes ?? []).flatMap((n) => n.sources ?? [])]) {
          const key = String(k).split(/,\s*/)[0];
          if (/^[a-z0-9-]+$/.test(key) && !sources[key]) book.warn(`facsimile ${fac.n}: unknown source key “${key}”`);
        }
        book.facsimiles.push(fac);
      }
    }
    book.place = placeOf(book.abbr);
    // A chapter's period, from the ranges in book.yaml's `periods:`: the guide its Context link opens. A range may name
    // a guide of its own (`guide:`); otherwise the period's guide, or until that is written the timeline at its era.
    for (const p of book.periods ?? []) if (!periods[p.period]) book.warn(`periods: unknown period “${p.period}” (content/volumes/old-testament/periods.yaml)`);
    book.periodOf = (n) => {
      const p = (book.periods ?? []).find((x) => { const [a, b = a] = String(x.chapters).split(/[-–]/).map(Number); return n >= a && n <= b; });
      const era = p && periods[p.period];
      return era ? { title: era.title, href: p.guide ?? era.guide ?? `/old-testament/guides/israels-story/#${era.timeline}` } : null;
    };
    if (!book.place) throw new Error(`content/${book.slug}/book.yaml: abbr “${book.abbr}” is not a book of the standard works (see src/lib/refs.mjs)`);
    // A book has a Guides page only when it has guides of its own; it does not inherit its volume's (author, 2026-10-18).
    book.hasGuides = existsSync(path.join(book.dir, 'guides'));
    book.hasThemes = existsSync(path.join(book.dir, 'themes'));

    // Validate source keys
    for (const ch of book.chapters) {
      const keys = [...(ch.sources ?? []), ...(ch.notes ?? []).flatMap((n) => n.sources ?? [])];
      for (const k of keys) {
        const key = String(k).split(/,\s*/)[0];
        if (/^[a-z0-9-]+$/.test(key) && !sources[key]) warn(`${book.name} ${ch.chapter}: unknown source key “${key}”`);
      }
    }
  }

  // Templates and reference links read LIBRARY, so it is filled before anything is rendered.
  configureScripturePreviews(books);
  LIBRARY.length = 0;
  LIBRARY.push(
    ...books.map((b) => ({
      name: b.name, slug: b.slug, abbr: b.abbr, vol: b.place.vol, index: b.place.index, hasGuides: b.hasGuides, hasThemes: b.hasThemes,
      gospelLibrary: `https://www.churchofjesuschrist.org/study/scriptures/${b.gospelLibrary}`,
      total: b.chapters.length, written: new Set(b.written.map((c) => c.chapter)),
    })),
  );

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  // Static assets
  await cp(r('public'), OUT, { recursive: true });
  await cp(r('src/assets'), path.join(OUT, 'assets'), { recursive: true });
  await writeBookColors(books, await readFile(r('src/assets/site.css'), 'utf8'));
  const fonts = {
    'literata.woff2': '@fontsource-variable/literata/files/literata-latin-wght-normal.woff2',
    'literata-italic.woff2': '@fontsource-variable/literata/files/literata-latin-wght-italic.woff2',
    'figtree.woff2': '@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2',
    'fraunces.woff2': '@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2',
    'fraunces-italic.woff2': '@fontsource-variable/fraunces/files/fraunces-latin-full-italic.woff2',
  };
  await mkdir(path.join(OUT, 'assets/fonts'), { recursive: true });
  for (const [to, from] of Object.entries(fonts)) await cp(r('node_modules', from), path.join(OUT, 'assets/fonts', to));

  const search = [];
  const built = []; // { book, guides, themes } for each book, in site order

  // Guides and theme pages: Markdown files with front matter, one page each. The owner is a book or a volume.
  const buildCollection = async (owner, key, searchLabel, entries = search) => {
    const collection = COLLECTIONS[key];
    const pages = [];
    for (const { f, file, page: g } of await pageFiles(path.join(owner.dir, collection.path))) {
      g.updated = await lastRevised(file);
      g.slug = f.replace(/^\d+-/, '').replace(/\.md$/, '');
      const cited = applyCitations(g.body, sources, (m) => warn(`${owner.slug}/${collection.path}/${f}: ${m}`));
      g.html = md(cited.body);
      g.refs = cited.refs;
      pages.push(g);
      entries.push({ t: 'guide', b: owner.slug, r: searchLabel, h: g.title, u: `/${owner.slug}/${collection.path}/${g.slug}/`, x: plain(stripCitations(g.body)).slice(0, 3000) });
    }
    for (const g of pages) await write(`${owner.slug}/${collection.path}/${g.slug}/index.html`, renderGuide({ owner, guide: g, guides: pages, sources, collection }));
    return pages;
  };
  // The volumes' guides first, since a book's Guides page lists them; their search entries go after the books'.
  const volumeSearch = [];
  const volumeGuides = []; // { volume, guides } for each volume that has guides
  for (const volume of volumes) {
    const guides = await buildCollection(volume, 'guides', 'Guide', volumeSearch);
    if (!guides.length) continue;
    await write(`${volume.slug}/guides/index.html`, renderGuidesIndex({ owner: volume, guides }));
    volumeGuides.push({ volume, guides });
  }
  for (const book of books) {
    const { slug, kjv } = book;

    // Chapter pages, for written chapters only; the pager skips unwritten ones.
    const chapterWrites = book.written.map((ch, i) => {
      const verses = kjv.chapters[ch.chapter - 1];
      const html = renderChapter({
        book,
        ch,
        verses,
        sources,
        prev: book.written[i - 1],
        next: book.written[i + 1],
        warn: (m) => warn(`${book.name} ${ch.chapter}: ${m}`),
        bom: book.bomParallels[ch.chapter],
        title: kjv.titles[ch.chapter],
        stanzas: kjv.stanzas[ch.chapter],
      });
      search.push({ t: 'chapter', b: slug, r: chapterLabel(book, ch.chapter), h: plain(ch.title), u: `/${slug}/${ch.chapter}/`, x: plain(`${ch.tagline ?? ''} ${ch.setting ?? ''} ${ch.thread ?? ''}`).slice(0, 1200) });
      if (kjv.titles[ch.chapter]) search.push({ t: 'verse', b: slug, r: `${chapterLabel(book, ch.chapter)}, title`, u: `/${slug}/${ch.chapter}/#v0`, x: kjv.titles[ch.chapter] });
      verses.forEach((v, j) => search.push({ t: 'verse', b: slug, r: `${chapterLabel(book, ch.chapter)}:${j + 1}`, u: `/${slug}/${ch.chapter}/#v${j + 1}`, x: v }));
      (ch.notes ?? []).forEach((n) =>
        search.push({ t: 'note', b: slug, k: n.kind, r: noteRef(book, ch.chapter, n.ref), h: plain(n.title ?? n.phrase ?? ''), u: `/${slug}/${ch.chapter}/#${n.id}`, x: plain(n.body) }),
      );
      return write(`${slug}/${ch.chapter}/index.html`, html);
    });
    await Promise.all(chapterWrites);

    for (const fac of book.facsimiles) {
      await write(`${slug}/facsimile-${fac.n}/index.html`, renderFacsimile({ book, fac, sources, warn: (m) => warn(`${book.name}, facsimile ${fac.n}: ${m}`) }));
      search.push({ t: 'chapter', b: slug, r: `${book.name}, Facsimile ${fac.n}`, h: plain(fac.title), u: facsimileUrl(book, fac.n), x: plain(`${fac.tagline ?? ''} ${fac.figures.map((f) => f.text).join(' ')}`).slice(0, 1200) });
      (fac.notes ?? []).forEach((n) => search.push({ t: 'note', b: slug, k: n.kind, r: `${book.name}, Facsimile ${fac.n}, fig. ${n.ref}`, h: plain(n.title ?? n.phrase ?? ''), u: `${facsimileUrl(book, fac.n)}#${n.id}`, x: plain(n.body) }));
    }

    const guides = await buildCollection(book, 'guides', 'Guide');
    const themes = await buildCollection(book, 'themes', 'Theme');
    if (themes.length) await write(`${slug}/themes/index.html`, renderGuidesIndex({ owner: book, guides: themes, collection: COLLECTIONS.themes }));
    // The book's Guides page: its own guides and its themes beside them; never its volume's (author, 2026-10-18).
    book.guidesPage = Boolean(guides.length);
    if (book.guidesPage) await write(`${slug}/guides/index.html`, renderGuidesIndex({ owner: book, guides, themes: guides.length ? themes : [] }));
    await write(`${slug}/index.html`, renderBookIndex({ book, guides, themes, sources }));
    built.push({ book, guides, themes });
  }

  // Home, misc
  const allNotes = books.flatMap((book) => book.chapters.flatMap((ch) => (ch.notes ?? []).filter((n) => n.phrase && n.phrase.length < 60).map((n) => ({ ...n, chapter: ch.chapter, book }))));
  const featured = [];
  const pool = [...allNotes];
  while (featured.length < 3 && pool.length) featured.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
  await write('index.html', renderHome({ books, featured }));
  // Every note, with just what a teaser card needs, for the home page's “Show three more” button.
  // c: chapter, r: verse ref, i: id, k: kind, p: phrase, x: opening text.
  const noteList = books.map((book) => ({
    b: book.slug,
    n: book.unit?.singular ?? book.name,
    notes: book.chapters.flatMap((ch) => (ch.notes ?? []).map((n) => ({ c: ch.chapter, r: n.ref, i: n.id, k: n.kind, p: n.phrase, x: teaserText(n) }))),
  }));
  await write('notes.json', JSON.stringify(noteList));
  // A page for each volume, listing its books on the site.
  // Its introduction, when one is written, is the body of content/volumes/<slug>/volume.md
  // (or content/volumes/<slug>.md, for a volume that has no directory yet).
  for (const v of volumes) {
    const introFile = [path.join(v.dir, 'volume.md'), r(`content/volumes/${v.slug}.md`)].find(existsSync);
    const intro = introFile ? await readMd(introFile) : { body: '' };
    const html = intro.body.trim() ? md(intro.body) : '';
    await write(`${v.slug}/index.html`, renderVolume({ volume: v, books: books.filter((b) => b.place.vol === v.key), html, guides: volumeGuides.find((x) => x.volume.key === v.key)?.guides ?? [] }));
  }
  search.push(...volumeSearch);
  const about = await readMd(r('content/about.md'));
  await write('about/index.html', renderPage({ title: about.title, blurb: about.blurb, html: md(about.body).replace('<!-- chapter-guide -->', chapterGuide()).replace('<!-- offline -->', offlinePanel()), path: '/about/', updated: await lastRevised(r('content/about.md')) }));
  await write('search/index.html', renderSearch());
  await write('404.html', render404());
  await write('search.json', JSON.stringify(search));
  const urls = [
    '/',
    ...built.flatMap(({ book }) => [`/${book.slug}/`, ...(book.guidesPage ? [`/${book.slug}/guides/`] : [])]),
    ...VOLUMES.map((v) => `/${v.slug}/`),
    ...volumeGuides.flatMap(({ volume, guides }) => [`/${volume.slug}/guides/`, ...guides.map((g) => `/${volume.slug}/guides/${g.slug}/`)]),
    '/about/',
    ...built.flatMap(({ book, guides, themes }) => [
      ...guides.map((g) => `/${book.slug}/guides/${g.slug}/`),
      ...(themes.length ? [`/${book.slug}/themes/`, ...themes.map((t) => `/${book.slug}/themes/${t.slug}/`)] : []),
      ...book.written.map((c) => `/${book.slug}/${c.chapter}/`),
      ...book.facsimiles.map((f) => facsimileUrl(book, f.n)),
    ]),
  ];
  await write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>https://scriptures.conlin.io${u}</loc></url>`).join('\n')}\n</urlset>\n`,
  );
  await write('robots.txt', SITE.noindex ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\nSitemap: https://scriptures.conlin.io/sitemap.xml\n');
  await writeOfflineList();

  for (const u of unknownRefs) warn(`unrecognized scripture reference: [[${u}]]`);
  if (!quiet) {
    for (const { book, guides } of built) {
      const notes = book.chapters.reduce((a, c) => a + (c.notes?.length ?? 0), 0);
      const drafts = book.chapters.filter((c) => c.draft).map((c) => c.chapter);
      const label = books.length > 1 ? `${book.name}: ` : '';
      console.log(`${label}Built ${book.written.length < book.chapters.length ? `${book.written.length} of ${book.chapters.length}` : book.chapters.length} chapters, ${notes} notes, ${guides.length} guides in ${Date.now() - t0} ms → dist/`);
      if (drafts.length) console.log(`${label}Unwritten chapters (no page; links go to the Gospel Library): ${drafts.join(', ')}`);
    }
    warnings.forEach((w) => console.warn(`  ⚠ ${w}`));
  }
  const drafts = books.flatMap((b) => b.chapters.filter((c) => c.draft).map((c) => c.chapter));
  return { warnings, drafts };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { warnings } = await build();
  if (warnings.length && process.argv.includes('--strict')) process.exit(1);
}
