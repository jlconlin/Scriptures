// Static site generator for Line upon Line.
// Reads content/ and data/, writes a complete static site to dist/.
import { readFile, writeFile, mkdir, readdir, cp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { md, plain, unknownRefs } from '../src/lib/markdown.mjs';
import { applyCitations, stripCitations } from '../src/lib/citations.mjs';
import { renderChapter, range } from '../src/templates/chapter.mjs';
import { renderHome, renderBookIndex, renderGuidesIndex, renderGuide, renderPage, renderSearch, render404, COLLECTIONS } from '../src/templates/pages.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'dist');
const r = (...p) => path.join(ROOT, ...p);

const warnings = [];
const warn = (m) => warnings.push(m);

async function write(rel, content) {
  const file = path.join(OUT, rel);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
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

export async function build({ quiet = false } = {}) {
  warnings.length = 0;
  unknownRefs.clear();
  const t0 = Date.now();

  const sources = await readYaml(r('content/sources.yaml'));
  const book = await readYaml(r('content/isaiah/book.yaml'));
  const kjv = JSON.parse(await readFile(r('data/kjv/isaiah.json'), 'utf8'));
  const bomParallels = JSON.parse(await readFile(r('data/bom/isaiah-parallels.json'), 'utf8')).chapters;

  // Chapters: every chapter gets a page; authored YAML fills in the commentary.
  const chDir = r('content/isaiah/chapters');
  const files = existsSync(chDir) ? (await readdir(chDir)).filter((f) => f.endsWith('.yaml')) : [];
  const authored = new Map();
  for (const f of files) {
    const ch = await readYaml(path.join(chDir, f));
    authored.set(ch.chapter, ch);
  }
  book.chapters = kjv.chapters.map((_, i) => {
    const n = i + 1;
    return authored.get(n) ?? { chapter: n, title: book.titles?.[n] ?? `Isaiah ${n}`, draft: true };
  });

  // Validate source keys
  for (const ch of book.chapters) {
    const keys = [...(ch.sources ?? []), ...(ch.notes ?? []).flatMap((n) => n.sources ?? [])];
    for (const k of keys) {
      const key = String(k).split(/,\s*/)[0];
      if (/^[a-z0-9-]+$/.test(key) && !sources[key]) warn(`Isaiah ${ch.chapter}: unknown source key “${key}”`);
    }
  }

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  // Static assets
  await cp(r('public'), OUT, { recursive: true });
  await cp(r('src/assets'), path.join(OUT, 'assets'), { recursive: true });
  const fonts = {
    'literata.woff2': '@fontsource-variable/literata/files/literata-latin-wght-normal.woff2',
    'literata-italic.woff2': '@fontsource-variable/literata/files/literata-latin-wght-italic.woff2',
    'figtree.woff2': '@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2',
    'fraunces.woff2': '@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2',
    'fraunces-italic.woff2': '@fontsource-variable/fraunces/files/fraunces-latin-full-italic.woff2',
  };
  await mkdir(path.join(OUT, 'assets/fonts'), { recursive: true });
  for (const [to, from] of Object.entries(fonts)) await cp(r('node_modules', from), path.join(OUT, 'assets/fonts', to));

  // Chapter pages
  const search = [];
  const chapterWrites = book.chapters.map((ch, i) => {
    const verses = kjv.chapters[i];
    const html = renderChapter({
      book,
      ch,
      verses,
      sources,
      prev: book.chapters[i - 1],
      next: book.chapters[i + 1],
      warn: (m) => warn(`Isaiah ${ch.chapter}: ${m}`),
      bom: bomParallels[ch.chapter],
    });
    search.push({ t: 'chapter', r: `Isaiah ${ch.chapter}`, h: plain(ch.title), u: `/isaiah/${ch.chapter}/`, x: plain(`${ch.tagline ?? ''} ${ch.setting ?? ''} ${ch.thread ?? ''}`).slice(0, 1200) });
    verses.forEach((v, j) => search.push({ t: 'verse', r: `Isaiah ${ch.chapter}:${j + 1}`, u: `/isaiah/${ch.chapter}/#v${j + 1}`, x: v }));
    (ch.notes ?? []).forEach((n) =>
      search.push({ t: 'note', k: n.kind, r: `Isaiah ${ch.chapter}:${n.ref}`, h: plain(n.title ?? n.phrase ?? ''), u: `/isaiah/${ch.chapter}/#${n.id}`, x: plain(n.body) }),
    );
    return write(`isaiah/${ch.chapter}/index.html`, html);
  });
  await Promise.all(chapterWrites);

  // Guides and theme pages: Markdown files with front matter, one page each plus an index.
  const buildCollection = async (key, searchLabel) => {
    const collection = COLLECTIONS[key];
    const dir = r(`content/isaiah/${collection.path}`);
    if (!existsSync(dir)) return [];
    const pages = [];
    for (const f of (await readdir(dir)).filter((f) => f.endsWith('.md')).sort()) {
      const g = await readMd(path.join(dir, f));
      g.slug = f.replace(/^\d+-/, '').replace(/\.md$/, '');
      const cited = applyCitations(g.body, sources, (m) => warn(`${collection.path}/${f}: ${m}`));
      g.html = md(cited.body);
      g.refs = cited.refs;
      pages.push(g);
      search.push({ t: 'guide', r: searchLabel, h: g.title, u: `/isaiah/${collection.path}/${g.slug}/`, x: plain(stripCitations(g.body)).slice(0, 3000) });
    }
    for (const g of pages) await write(`isaiah/${collection.path}/${g.slug}/index.html`, renderGuide({ book, guide: g, guides: pages, sources, collection }));
    if (pages.length) await write(`isaiah/${collection.path}/index.html`, renderGuidesIndex({ book, guides: pages, collection }));
    return pages;
  };
  const guides = await buildCollection('guides', 'Guide');
  const themes = await buildCollection('themes', 'Theme');

  // Book index, home, misc
  await write('isaiah/index.html', renderBookIndex({ book, guides, themes, sources }));
  const allNotes = book.chapters.flatMap((ch) => (ch.notes ?? []).filter((n) => n.phrase && n.phrase.length < 60).map((n) => ({ ...n, chapter: ch.chapter })));
  const featured = [];
  const pool = [...allNotes];
  while (featured.length < 3 && pool.length) featured.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  await write('index.html', renderHome({ book, featured }));
  const about = await readMd(r('content/about.md'));
  await write('about/index.html', renderPage({ title: about.title, blurb: about.blurb, html: md(about.body), path: '/about/' }));
  await write('search/index.html', renderSearch());
  await write('404.html', render404());
  await write('search.json', JSON.stringify(search));
  await write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['/', '/isaiah/', '/isaiah/guides/', '/about/', ...guides.map((g) => `/isaiah/guides/${g.slug}/`), ...(themes.length ? ['/isaiah/themes/', ...themes.map((t) => `/isaiah/themes/${t.slug}/`)] : []), ...book.chapters.map((c) => `/isaiah/${c.chapter}/`)]
      .map((u) => `<url><loc>https://scriptures.conlin.io${u}</loc></url>`)
      .join('\n')}\n</urlset>\n`,
  );
  await write('robots.txt', 'User-agent: *\nAllow: /\nSitemap: https://scriptures.conlin.io/sitemap.xml\n');

  for (const u of unknownRefs) warn(`unrecognized scripture reference: [[${u}]]`);
  const drafts = book.chapters.filter((c) => c.draft).map((c) => c.chapter);
  if (!quiet) {
    const notes = book.chapters.reduce((a, c) => a + (c.notes?.length ?? 0), 0);
    console.log(`Built ${book.chapters.length} chapters, ${notes} notes, ${guides.length} guides in ${Date.now() - t0} ms → dist/`);
    if (drafts.length) console.log(`Chapters without commentary yet: ${drafts.join(', ')}`);
    warnings.forEach((w) => console.warn(`  ⚠ ${w}`));
  }
  return { warnings, drafts };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { warnings } = await build();
  if (warnings.length && process.argv.includes('--strict')) process.exit(1);
}
