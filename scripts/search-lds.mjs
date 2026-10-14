// One search across the Latter-day Saint study sites a book's first research starts from (AUTHORING.md, “A book's first research
// includes Scripture Central and the Interpreter Foundation”; STANDARDS.md §9), printing titles and addresses as knowhys.mjs does
// for KnoWhys. Each site is searched the way it answers a script (tested 2026-10-13):
//   Religious Studies Center   its own full-text search (rsc.byu.edu/search/<words>), with the passage around the match
//   BYU Studies                its sitemap: the words must all be in an article's address (so, in its title)
//   Interpreter (journal)      its journal sitemap: the same
//   Scripture Central          KnoWhys through knowhys.mjs's listing; its library (scripturecentral.org/archive) answers only a
//                              browser, so the script says so and prints the web search to make instead
// A sitemap search finds titles only: an article that treats the subject under another title is found by a web search limited to
// the site, which the last lines print. Read what is found with: node scripts/source.mjs <url> --find "words".
// Usage: node scripts/search-lds.mjs "<words>" [--max N] [--site rsc,byustudies,interpreter,sc] [--fresh]
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { curl, decode } from '../src/lib/pages.mjs';
import { SCRIPT_ROOT as ROOT } from '../src/lib/ledger.mjs';

process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); });
const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); return i < 0 ? false : (argv.splice(i, 1), true); };
const value = (name) => { const i = argv.indexOf(name); if (i < 0) return null; const v = argv[i + 1] ?? ''; argv.splice(i, 2); return v; };
const fresh = flag('--fresh'), max = Number(value('--max')) || 12, only = value('--site')?.split(',');
if (argv.length !== 1) { console.error('Usage: node scripts/search-lds.mjs "<words>" [--max N] [--site rsc,byustudies,interpreter,sc] [--fresh]'); process.exit(1); }
const query = argv[0], words = query.toLowerCase().split(/\s+/).filter(Boolean);
const wants = (site) => !only || only.includes(site);
const text = (html) => decode(String(html).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const shown = (n) => (n > max ? `; the first ${max} are shown (--max N for more)` : '');

// A sitemap, kept for a day: the addresses in it.
const DIR = path.join(ROOT, '.cache/search-lds');
async function sitemap(name, url) {
  const file = path.join(DIR, `${name}.txt`);
  if (!fresh && existsSync(file) && Date.now() - statSync(file).mtimeMs < 86400e3) return (await readFile(file, 'utf8')).split('\n').filter(Boolean);
  const locs = [...curl(url).toString().matchAll(/<loc>([^<]+)/g)].map((m) => m[1].trim());
  if (locs.length) { await mkdir(DIR, { recursive: true }); await writeFile(file, locs.join('\n')); }
  return locs;
}
// The addresses whose last part has every word as a whole word (“amos” is not found in “famous”).
const bySlug = (locs) => locs.filter((u) => { const parts = u.split('/').pop().toLowerCase().split(/[^a-z0-9]+/); return words.every((w) => parts.includes(w)); });
const titled = (u) => u.split('/').pop().replace(/-/g, ' ');

if (wants('rsc')) {
  // The Religious Studies Center prints a book chapter again under each place it was published; one line each, by title.
  let html = '';
  try { html = curl(`https://rsc.byu.edu/search/${encodeURIComponent(query)}`).toString(); } catch {}
  const total = /(\d+) results? found/.exec(html)?.[1];
  const hits = [...html.matchAll(/<h4>\s*<a href="([^"]+)">([\s\S]*?)<\/a>\s*<\/h4>\s*<p>([\s\S]*?)<\/p>/g)].map((m) => ({ url: `https://rsc.byu.edu${m[1]}`, title: text(m[2]), passage: text(m[3]) }));
  const seen = new Map();
  for (const h of hits) { const k = h.title.toLowerCase().replace(/\s+/g, ' '); if (seen.has(k)) seen.get(k).also.push(h.url); else seen.set(k, { ...h, also: [] }); }
  const list = [...seen.values()];
  console.log(`Religious Studies Center (its own search, full text): ${total ?? (html ? 0 : 'no answer;')} results${total > hits.length ? `; its first page has ${hits.length}, ${list.length} titles` : ''}${shown(list.length)}.`);
  if (!html) console.log('  The site did not answer. Search the web instead: site:rsc.byu.edu ' + query);
  for (const h of list.slice(0, max)) console.log(`  ${h.title}\n      ${h.url}${h.also.length ? `  (and ${h.also.length} other printing${h.also.length > 1 ? 's' : ''})` : ''}\n      “${h.passage.slice(0, 260)}”`);
  if (total > hits.length) console.log(`  More: https://rsc.byu.edu/search/${encodeURIComponent(query)}?page=1`);
  console.log('');
}

for (const [site, label, name, url] of [
  ['byustudies', 'BYU Studies', 'byustudies', 'https://byustudies.byu.edu/sitemap.xml'],
  ['interpreter', 'Interpreter (the journal)', 'interpreter', 'https://interpreterfoundation.org/journal-sitemap.xml'],
]) {
  if (!wants(site)) continue;
  let locs = [];
  try { locs = await sitemap(name, url); } catch {}
  const hits = bySlug(locs);
  console.log(`${label} (titles only, from its list of ${locs.length} addresses): ${hits.length}${shown(hits.length)}.`);
  if (!locs.length) console.log('  The list did not load.');
  for (const u of hits.slice(0, max)) console.log(`  ${titled(u)}\n      ${u}`);
  console.log(`  Not searched: the articles' text. Search the web: site:${new URL(url).hostname} ${query}\n`);
}

if (wants('sc')) {
  console.log('Scripture Central:');
  try { console.log(execFileSync('node', [path.join(ROOT, 'scripts/knowhys.mjs'), query, '--max', String(max)], { maxBuffer: 64e6 }).toString().trim().replace(/^/gm, '  ')); } catch { console.log('  The KnoWhy listing did not answer.'); }
  console.log(`  Not searched: its library of articles and book chapters (scripturecentral.org/archive answers only a browser, and archive.bookofmormoncentral.org did not load). Search the web: site:scripturecentral.org ${query}  and  site:archive.bookofmormoncentral.org ${query}`);
}
