// Searches Scripture Central's KnoWhys (STANDARDS.md §9) so a writer finds the ones that bear on a chapter or a word without paging
// through the API by hand. It reads the whole listing from the API (100 a page, several pages, with curl -g; the public pages need
// a browser), keeps it in .cache/knowhys/list.json for a day, and searches it here: by title, main reference, summary and body.
// Each KnoWhy found is printed with its number, title, date, main reference, public URL (cite it as sc-knowhy-<number>), and the
// sentence around the match. Read one with: node scripts/source.mjs <public URL> --find "words".
// Usage: node scripts/knowhys.mjs "<words>"        the KnoWhys that have every word, in any order (case-insensitive; “mandrakes”, “Moriah sacrifice”)
//        node scripts/knowhys.mjs <book> <chapter> the KnoWhys whose main reference is in that chapter, then those that name it in the title or text
//        --max N   most KnoWhys printed (default 15)      --fresh   fetch the listing again
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { curl, decode } from '../src/lib/pages.mjs';
import { findBook } from '../src/lib/books.mjs';
import { parseRef } from '../src/lib/refs.mjs';
import { SCRIPT_ROOT as ROOT } from '../src/lib/ledger.mjs';

process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); }); // piped into head
const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); return i < 0 ? false : (argv.splice(i, 1), true); };
const value = (name) => { const i = argv.indexOf(name); if (i < 0) return null; const v = argv[i + 1] ?? ''; argv.splice(i, 2); return v; };
const fresh = flag('--fresh'), max = Number(value('--max')) || 15;
const bookMode = argv.length === 2 && /^\d+$/.test(argv[1]) && !/\s/.test(argv[0]);
if (!argv.length || (argv.length > 1 && !bookMode)) { console.error('Usage: node scripts/knowhys.mjs "<words>"   |   node scripts/knowhys.mjs <book> <chapter>   [--max N] [--fresh]'); process.exit(1); }

// ---------- the listing ----------
const FILE = path.join(ROOT, '.cache/knowhys/list.json');
const API = 'https://admin.scripturecentral.org/api/knowhys';
const FIELDS = ['title', 'slug', 'number', 'publicationDate', 'mainReference', 'summary', 'body'].map((f, i) => `fields[${i}]=${f}`).join('&');
const plain = (html) => decode(String(html ?? '').replace(/<a [^>]*class="see-footnote"[^>]*>[\s\S]*?<\/a>/g, '').replace(/<\/(?:p|h\d|li|div|blockquote)>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
async function listing() {
  if (!fresh && existsSync(FILE) && Date.now() - statSync(FILE).mtimeMs < 86400e3) return JSON.parse(await readFile(FILE, 'utf8'));
  const all = [];
  for (let page = 1, pages = 1; page <= pages; page++) {
    let json;
    for (let attempt = 0; !json && attempt < 3; attempt++) try { json = JSON.parse(curl(`${API}?${FIELDS}&sort[0]=number:asc&pagination[pageSize]=100&pagination[page]=${page}`).toString()); } catch {}
    if (!json?.data) { console.error(`The Scripture Central API did not answer for page ${page}.`); process.exit(1); }
    pages = json.meta?.pagination?.pageCount ?? 1;
    for (const { attributes: a } of json.data) all.push({ number: a.number, title: plain(a.title), slug: a.slug, date: a.publicationDate, ref: plain(a.mainReference), summary: plain(a.summary), body: plain(a.body) });
  }
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(all));
  return all;
}
const all = await listing();

// ---------- searching ----------
const sentences = (text) => text.split(/(?<=[.!?”"])\s+(?=[A-Z“"‘'(])/);
// The sentence of `text` around the first match of `re`, or around where the most of `words` come together; null if none.
const around = (text, re) => {
  const m = re.exec(text);
  if (!m) return null;
  let at = 0;
  for (const s of sentences(text)) { if (m.index < at + s.length) return s.length > 360 ? `…${s.slice(Math.max(0, m.index - at - 150), m.index - at + 200).trim()}…` : s; at += s.length + 1; }
  return null;
};
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let hits, heading;
if (bookMode) {
  const book = await findBook(ROOT, argv[0]), chapter = +argv[1];
  const inRef = (ref) => { let prev; return ref.split(';').some((p) => { const r = parseRef(p.replace(/^\s*cf\.\s*/i, ''), prev); if (r) prev = r.book; return r && r.slug === book.abbr && r.chapter === chapter; }); };
  // “Genesis 22:2” or “Gen. 22” in the title or text.
  const name = [esc(book.name), /^[a-z]+$/.test(book.abbr) ? `${esc(book.abbr[0].toUpperCase() + book.abbr.slice(1))}\\.?` : null].filter(Boolean).join('|');
  const re = new RegExp(`\\b(?:${name})\\s+${chapter}\\b(?!\\d)`, 'g');
  heading = `${book.name} ${chapter}`;
  hits = [];
  for (const k of all) {
    const main = inRef(k.ref);
    re.lastIndex = 0;
    const text = [k.title, k.summary, k.body].find((t) => { re.lastIndex = 0; return re.test(t); });
    if (!main && !text) continue;
    re.lastIndex = 0;
    hits.push({ k, main, count: (`${k.title} ${k.summary} ${k.body}`.match(re) ?? []).length, sentence: text ? around(text, re) : null });
  }
  hits.sort((x, y) => Number(y.main) - Number(x.main) || y.count - x.count || y.k.number - x.k.number); // main reference first, then the most mentions
} else {
  const words = argv[0].toLowerCase().split(/\s+/).filter(Boolean);
  heading = `“${argv[0]}”`;
  hits = [];
  for (const k of all) {
    const hay = [k.title, k.ref, k.summary, k.body].join(' \n ').toLowerCase();
    if (!words.every((w) => hay.includes(w))) continue;
    const phrase = new RegExp(esc(words.join(' ')).replace(/ /g, '\\s+'), 'i'), first = new RegExp(esc(words[0]), 'i');
    // Prefer the sentence with the whole phrase, then the first word.
    const order = [k.body, k.summary, k.title, k.ref], text = order.find((t) => phrase.test(t)) ?? order.find((t) => first.test(t));
    hits.push({ k, main: [k.title, k.ref].some((t) => phrase.test(t)), sentence: text ? around(text, phrase.test(text) ? phrase : first) : null });
  }
  hits.sort((x, y) => Number(y.main) - Number(x.main) || y.k.number - x.k.number);
}

console.log(`${heading}: ${hits.length} of ${all.length} KnoWhys${hits.length > max ? `; the first ${max} are shown (--max N for more)` : ''}${bookMode ? `; ${hits.filter((h) => h.main).length} have it as their main reference` : ''}.\n`);
for (const { k, main, sentence } of hits.slice(0, max)) {
  console.log(`#${k.number}  ${k.title} (${k.date ?? 'undated'})${main ? bookMode ? '  [main reference]' : '' : ''}`);
  console.log(`      main reference: ${k.ref || 'none'}\n      https://scripturecentral.org/knowhy/${k.slug}  (cite as sc-knowhy-${k.number})`);
  if (sentence) console.log(`      “${sentence}”`);
  console.log('');
}
