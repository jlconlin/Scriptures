// Tests the offline copy (DEVELOPMENT.md, “Reading offline”) in a real browser: saves the site from the About page,
// checks that a second save fetches nothing, that a page changed on the server is shown fresh while online, and
// then stops the server and opens pages, an illustration, the fonts, search and a missing page with no network.
// Playwright's own offline switch doesn't reach a service worker's requests, so the server is stopped instead.
// Usage: npm run build && node scripts/test-offline.mjs [--port 4398]
// Needs Playwright (the project's devDependencies don't carry it: npm i -g playwright, or npx playwright install).
import http from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.argv[process.argv.indexOf('--port') + 1]) || 4398;
const B = `http://localhost:${PORT}`;
const { chromium } = await import('playwright').catch(() => import(path.join(execSync('npm root -g').toString().trim(), 'playwright/index.mjs')))
  .catch(() => { console.error('test-offline: Playwright is not installed (npm i -g playwright)'); process.exit(2); });

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json' };
let requests = 0;
// no-store, so that only the saved copy, not the browser's own cache, can answer once the server is stopped
const server = http.createServer(async (req, res) => {
  requests++;
  let f = path.join(DIST, decodeURIComponent(new URL(req.url, B).pathname));
  try {
    if ((await stat(f)).isDirectory()) f = path.join(f, 'index.html');
    res.writeHead(200, { 'cache-control': 'no-store', 'content-type': TYPES[path.extname(f)] ?? 'application/octet-stream' }).end(await readFile(f));
  } catch {
    res.writeHead(404, { 'content-type': TYPES['.html'] }).end(await readFile(path.join(DIST, '404.html')));
  }
});
await new Promise((r) => server.listen(PORT, r));

let failed = 0;
const check = (ok, what, detail = '') => { if (!ok) failed++; console.log(`${ok ? '✓' : '✗'} ${what}${detail ? ` (${detail})` : ''}`); };
const browser = await chromium.launch();
const page = await (await browser.newContext()).newPage();
page.on('pageerror', (e) => check(false, 'no script error', e.message));
const status = () => page.textContent('.offline-status');
const until = (re, timeout = 300000) => page.waitForFunction((s) => new RegExp(s).test(document.querySelector('.offline-status').textContent), re.source, { timeout });
const about = path.join(DIST, 'about/index.html');
const original = await readFile(about, 'utf8');

try {
  const installed = () => page.evaluate(() => navigator.serviceWorker.getRegistrations().then((r) => r.length));
  await page.goto(`${B}/about/#reading-offline`);
  await until(/Nothing is saved|Saved on/);
  check(!(await installed()), 'nothing installed by opening the About page', await status());
  await page.click('[data-offline="save"]');
  await until(/Saved on/);
  check(true, 'saved', await status());
  const before = requests;
  await page.click('[data-offline="save"]');
  await until(/Saved on/);
  await page.waitForFunction(() => !document.querySelector('[data-offline="save"]').disabled);
  check(requests - before <= 2, 'a second save fetches only the list', `${requests - before} requests`);

  await writeFile(about, original.replace('<title>', '<title>CHANGED '));
  await page.goto(`${B}/about/`);
  check((await page.title()).startsWith('CHANGED'), 'online, a changed page comes from the server');

  await new Promise((r) => server.close(r));
  server.closeAllConnections?.();
  for (const u of ['/about/', '/', '/psalms/23/', '/isaiah/53', '/genesis/', '/old-testament/guides/', '/abraham/facsimile-2/']) {
    const res = await page.goto(`${B}${u}`).catch(() => null);
    const title = res && (await page.title());
    check(res?.status() === 200 && title && !/not found/i.test(title) && !title.startsWith('CHANGED'), `offline: ${u}`, title ?? 'no page');
  }
  await page.goto(`${B}/genesis/`);
  const art = await page.evaluate(() => [...document.images].filter((i) => i.src.includes('book-art')).map((i) => i.naturalWidth));
  check(art.length && art.every((w) => w > 0), 'offline: the book illustration');
  check((await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter((f) => f.status === 'loaded').length; })) > 0, 'offline: the fonts');
  await page.goto(`${B}/search/?q=wings%20as%20eagles`);
  await page.waitForSelector('.search-results li', { timeout: 10000 }).catch(() => {});
  check((await page.locator('.search-results li').count()) > 0, 'offline: search');
  await page.goto(`${B}/nowhere/`);
  check(/not found/i.test(await page.title()), 'offline: a page not on the site gets the saved 404 page');

  server.listen(PORT);
  await page.goto(`${B}/about/`);
  await until(/Saved on/);
  await page.click('[data-offline="remove"]');
  await until(/Nothing is saved/);
  await page.waitForTimeout(500);
  check(!(await installed()) && !(await page.evaluate(() => caches.keys())).length, 'removing the copy deletes it and uninstalls the worker');
} catch (e) {
  check(false, 'the test ran to the end', e.message);
} finally {
  await writeFile(about, original);
  await browser.close();
  server.close();
}
console.log(failed ? `${failed} failed` : 'All passed');
process.exit(failed ? 1 : 0);
