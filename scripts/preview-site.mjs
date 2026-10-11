// Builds the site with preview books included and rewrites it so it works from any folder: every
// root-absolute link, asset path, CSS url() and fetch becomes relative. This is the copy that is published
// to the private claude.ai preview artifact (AUTHORING.md, “Showing a change”).
// Usage: node scripts/preview-site.mjs [out dir] [--all]   (default .cache/preview/dist)
// The artifact holds at most 511 files, and the whole site passed that when Psalms was written (535). So the
// preview carries only the books still in preview: a live book's pages are left out, and every link to one goes
// to the live site (https://scriptures.conlin.io), where the author can already read it. --all keeps every book.
// Writes <out dir>/../files.json: every file but index.html and the fonts, as [{ path }], for publishing.
import { readdirSync, readFileSync, writeFileSync, statSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const all = args.includes('--all');
const dist = path.resolve(args.find((a) => !a.startsWith('--')) ?? path.join(ROOT, '.cache/preview/dist'));
const LIVE_SITE = 'https://scriptures.conlin.io';
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
const built = execFileSync('node', [path.join(ROOT, 'scripts/build.mjs')], { cwd: ROOT, env: { ...process.env, PREVIEW: '1', BUILD_OUT: dist } }).toString();
console.log(built.split('\n').filter((l) => /Built|⚠/.test(l)).join('\n'));

// The live books: a directory under content/ with a book.yaml that does not say `status: preview`.
const live = all ? [] : readdirSync(path.join(ROOT, 'content'), { withFileTypes: true })
  .filter((e) => e.isDirectory() && existsSync(path.join(ROOT, 'content', e.name, 'book.yaml')) && !/^status:\s*preview\b/m.test(readFileSync(path.join(ROOT, 'content', e.name, 'book.yaml'), 'utf8')))
  .map((e) => e.name);
for (const slug of live) rmSync(path.join(dist, slug), { recursive: true, force: true });
const isLive = (p) => live.includes(p.split(/[/#?]/)[0]);

const walk = (d) => readdirSync(d).flatMap((f) => { const p = path.join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(dist);
// A site path (no leading slash) as a path relative to the page: folders get their index.html.
const fix = (p, pre) => {
  const [base, hash = ''] = p.split('#');
  const [pth, q = ''] = base.split('?');
  const out = pth === '' || pth.endsWith('/') ? `${pth}index.html` : pth;
  return `${pre}${out}${q ? '?' + q : ''}${hash ? '#' + hash : ''}`;
};
for (const f of files) {
  const depth = path.relative(dist, f).split(path.sep).length - 1;
  const pre = depth ? '../'.repeat(depth) : './';
  if (f.endsWith('.html')) {
    const h = readFileSync(f, 'utf8')
      .replace(/\b(href|src|action)="\/(?!\/)([^"]*)"/g, (_, a, p) => (isLive(p) ? `${a}="${LIVE_SITE}/${p}"` : `${a}="${fix(p, pre)}"`))
      // site.js builds the menu's and the home page's links as data-root + path + data-index
      .replace(/data-root="\/"/g, `data-root="${pre}"`)
      .replace(/data-index=""/g, 'data-index="index.html"');
    writeFileSync(f, h);
  } else if (f.endsWith('.css')) {
    writeFileSync(f, readFileSync(f, 'utf8').replace(/url\('\/assets\//g, "url('"));
  } else if (f.endsWith('site.js')) {
    // The search page is one folder down; its results carry root-absolute URLs.
    const url = "const url = (p) => `${sm.dataset.root}${p}${sm.dataset.index}`;";
    const src = readFileSync(f, 'utf8');
    if (!src.includes(url)) throw new Error('site.js: the menu link builder was not found (the template changed)');
    const s = `var PREVIEW_LIVE = ${JSON.stringify(live)};\n` + src
      // a live book's links go to the live site (the menu, the home page's library and its teasers)
      .replace(url, "const url = (p) => (PREVIEW_LIVE.includes(p.split('/')[0]) ? `" + LIVE_SITE + "/${p}` : `${sm.dataset.root}${p}${sm.dataset.index}`);")
      .replace(`fetch('/search.json')`, `fetch('../search.json')`)
      .replace('<li><a href="${d.u}">', `<li><a href="\${PREVIEW_LIVE.includes(d.b) ? '${LIVE_SITE}' + d.u : '..' + d.u.replace(/\\/(#|$)/, '/index.html$1')}">`);
    if (!s.includes(`'..' + d.u.replace`)) throw new Error('site.js: the search result link was not rewritten (the template changed)');
    if (/fetch\('\//.test(s)) throw new Error('site.js: a root-absolute fetch is left');
    writeFileSync(f, s);
  }
}
const skip = /^(index\.html$|assets\/fonts\/|favicon|robots)/;
const list = files.map((f) => path.relative(dist, f).split(path.sep).join('/')).filter((p) => !skip.test(p));
writeFileSync(path.join(dist, '..', 'files.json'), JSON.stringify(list.map((p) => ({ path: p }))));
console.log(`${files.length} files in ${path.relative(ROOT, dist)}; ${list.length} listed in files.json`);
