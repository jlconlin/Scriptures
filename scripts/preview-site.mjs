// Builds the site with preview books included and rewrites it so it works from any folder: every
// root-absolute link, asset path, CSS url() and fetch becomes relative. This is the copy that is published
// to the private claude.ai preview artifact (AUTHORING.md, “Showing a change”).
// Usage: node scripts/preview-site.mjs [out dir]   (default .cache/preview/dist)
// Writes <out dir>/../files.json: every file but index.html and the fonts, as [{ path }], for publishing.
import { readdirSync, readFileSync, writeFileSync, statSync, rmSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dist = path.resolve(process.argv[2] ?? path.join(ROOT, '.cache/preview/dist'));
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
const built = execFileSync('node', [path.join(ROOT, 'scripts/build.mjs')], { cwd: ROOT, env: { ...process.env, PREVIEW: '1', BUILD_OUT: dist } }).toString();
console.log(built.split('\n').filter((l) => /Built|⚠/.test(l)).join('\n'));

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
      .replace(/\b(href|src|action)="\/(?!\/)([^"]*)"/g, (_, a, p) => `${a}="${fix(p, pre)}"`)
      // site.js builds the menu's and the home page's links as data-root + path + data-index
      .replace(/data-root="\/"/g, `data-root="${pre}"`)
      .replace(/data-index=""/g, 'data-index="index.html"');
    writeFileSync(f, h);
  } else if (f.endsWith('.css')) {
    writeFileSync(f, readFileSync(f, 'utf8').replace(/url\('\/assets\//g, "url('"));
  } else if (f.endsWith('site.js')) {
    // The search page is one folder down; its results carry root-absolute URLs.
    const s = readFileSync(f, 'utf8')
      .replace(`fetch('/search.json')`, `fetch('../search.json')`)
      .replace('<li><a href="${d.u}">', `<li><a href="\${'..' + d.u.replace(/\\/(#|$)/, '/index.html$1')}">`);
    if (!s.includes(`'..' + d.u.replace`)) throw new Error('site.js: the search result link was not rewritten (the template changed)');
    if (/fetch\('\//.test(s)) throw new Error('site.js: a root-absolute fetch is left');
    writeFileSync(f, s);
  }
}
const skip = /^(index\.html$|assets\/fonts\/|favicon|robots)/;
const list = files.map((f) => path.relative(dist, f).split(path.sep).join('/')).filter((p) => !skip.test(p));
writeFileSync(path.join(dist, '..', 'files.json'), JSON.stringify(list.map((p) => ({ path: p }))));
console.log(`${files.length} files in ${path.relative(ROOT, dist)}; ${list.length} listed in files.json`);
