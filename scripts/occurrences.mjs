// Every place a word, a phrase, or a Hebrew word occurs in a book, so a theme page starts from the full list and not from what a
// reader happened to notice (STANDARDS.md §8: “List every occurrence, including those that don't fit, before calling something a
// pattern, and check a repeated English word in the original language”).
// Usage: node scripts/occurrences.mjs <book> "<word or phrase>" ["more words" …] [--stem] [--books]
//          every verse of the book's King James text (data/kjv/<book>.json) that has the phrase (case-insensitive, whole words),
//          with its text, a count by chapter, and the total. With several phrases each verse says which it matched.
//          --stem: a word and its regular endings (gather finds gathered, gathereth, gathering, gathers; remembered finds remember,
//          remembereth); an irregular form (begat, spake) is a phrase of its own. --books (or the book “all”): every book in data/kjv/.
//        node scripts/occurrences.mjs <book> --hebrew <strongs>
//          every verse of the book where that Hebrew word occurs in the Westminster Leningrad Codex (src/lib/hebrew.mjs, the reading
//          scripts/hebrew.mjs uses), with the King James verse of the same number beside it, so the one Hebrew word can be seen in
//          each of its English renderings. Hebrew verse numbers sometimes differ from the King James Version's, so a verse beside
//          the Hebrew may be the neighbor of the one that translates it.
//        node scripts/occurrences.mjs <book> "<word or phrase>" --site [all]
//          what the site already says: every note, and each chapter's setting, thread, christ and explore, and each theme and guide
//          page in content/<book>/ (content/ for every book with `--site all`) whose text has the phrase, as book, chapter, verse,
//          note title, and the sentence that has it. --stem works here too.
//        --fresh refetches the Hebrew text.   The modes can be combined (--hebrew with --site); without either, the King James text.
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { discoverBooks } from '../src/lib/books.mjs';
import { wlcFile, loadWlc, parseStrongs, wordHits, WLC_NOTE } from '../src/lib/hebrew.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); }); // piped into head
const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); return i < 0 ? false : (argv.splice(i, 1), true); };
const value = (name) => { const i = argv.indexOf(name); if (i < 0) return null; const v = argv[i + 1]; argv.splice(i, 2); return v ?? ''; };
const usage = (msg) => {
  console.error(`${msg ? `${msg}\n` : ''}Usage: node scripts/occurrences.mjs <book|all> "<word or phrase>" ["more words" …] [--stem] [--books]\n` +
    '       node scripts/occurrences.mjs <book> --hebrew <strongs>\n       node scripts/occurrences.mjs <book> "<word or phrase>" --site [all]');
  process.exit(1);
};
const fresh = flag('--fresh'), stem = flag('--stem'), booksFlag = flag('--books');
const hebrew = value('--hebrew');
// `--site all` searches every book; but a phrase that is just “all” stays a phrase when it is the only one.
const siteAt = argv.indexOf('--site');
let site = false, siteAll = false;
if (siteAt >= 0) {
  site = true; argv.splice(siteAt, 1);
  if (argv[siteAt] === 'all' && argv.filter((a) => !a.startsWith('--')).length > 2) { siteAll = true; argv.splice(siteAt, 1); }
}
if (hebrew === '' || (hebrew !== null && !parseStrongs(hebrew))) usage('--hebrew takes a Strong\'s number, such as 2142.');
const [bookArg, ...phrases] = argv.filter((a) => !a.startsWith('--'));
if (!bookArg) usage();
if (hebrew === null && !phrases.length) usage('Give a word or phrase to look for.');
const allBooks = booksFlag || bookArg.toLowerCase() === 'all';

// ---------- matching ----------

const tokens = (s) => String(s).toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []; // “LORD’s” is lord, s
// --stem: a word with its regular endings. The word may be given inflected (remembered): the ending is taken off first.
const ENDINGS = ['', 'e', 's', 'es', 'ed', 'd', 'eth', 'th', 'est', 'st', 'ing', 'er', 'ers'];
const TAKE_OFF = ['eth', 'est', 'ers', 'ing', 'es', 'ed', 's'];
function predicate(word) {
  if (!stem || word.length <= 3) return (t) => t === word;
  let base = word;
  for (const e of TAKE_OFF) if (word.endsWith(e) && word.length - e.length >= 3) { base = word.slice(0, -e.length); break; }
  const bases = new Set([base]);
  if (base.endsWith('e')) bases.add(base.slice(0, -1)); // love, loving
  if (base.endsWith('y')) bases.add(`${base.slice(0, -1)}i`); // cry, cried
  const re = new RegExp(`^(?:${[...bases].join('|')})(?:${ENDINGS.join('|')})$`);
  return (t) => re.test(t);
}
const compiled = phrases.map((p) => ({ phrase: p, words: tokens(p).map(predicate) }));
for (const c of compiled) if (!c.words.length) usage(`“${c.phrase}” has no words in it.`);
/** The places in a text where each phrase occurs: `[{ phrase, found: ['gathered', …] }]`, only the phrases that occur. */
function find(text) {
  const t = tokens(text), out = [];
  for (const c of compiled) {
    const found = [];
    for (let i = 0; i + c.words.length <= t.length; i++) if (c.words.every((ok, j) => ok(t[i + j]))) found.push(t.slice(i, i + c.words.length).join(' '));
    if (found.length) out.push({ phrase: c.phrase, found });
  }
  return out;
}
// Which phrases a verse matched, and with --stem the forms found: [gather (gathered, gathereth); cup], or [gathered, gathereth] for one phrase
const forms = (h) => [...new Set(h.found)].join(', ');
const tag = (hits) => `[${hits.map((h) => (!stem ? h.phrase : compiled.length === 1 ? forms(h) : `${h.phrase} (${forms(h)})`)).join('; ')}]`;
const showTag = compiled.length > 1 || stem;

// ---------- the King James text ----------

const kjvDir = path.join(ROOT, 'data/kjv');
const kjvSlugs = (await readdir(kjvDir)).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5));
const order = (await discoverBooks(ROOT)).map((b) => b.slug);
kjvSlugs.sort((a, b) => (order.indexOf(a) + 1 || 1e9) - (order.indexOf(b) + 1 || 1e9) || a.localeCompare(b));
const pickBooks = (list) => (allBooks ? list : list.filter((s) => s === bookArg.toLowerCase().replace(/\s+/g, '')));
const kjvBooks = pickBooks(kjvSlugs);
if (!kjvBooks.length && (hebrew !== null || !site)) usage(`No King James text for “${bookArg}” in data/kjv/. Books with text: ${kjvSlugs.join(', ')}.`);
const kjv = new Map();
const loadKjv = async (slug) => (kjv.has(slug) ? kjv : kjv.set(slug, JSON.parse(await readFile(path.join(kjvDir, `${slug}.json`), 'utf8')))).get(slug);
const byChapter = (rows, pick) => {
  const m = new Map();
  for (const r of rows) m.set(pick(r), (m.get(pick(r)) ?? 0) + 1);
  return [...m].sort((a, b) => a[0] - b[0]).map(([c, n]) => `${c} (${n})`).join(', ');
};
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

if (hebrew === null && !site) {
  let grand = 0;
  for (const slug of kjvBooks) {
    const j = await loadKjv(slug);
    const rows = [];
    j.chapters.forEach((verses, c) => verses.forEach((text, v) => { const hits = find(text); if (hits.length) rows.push({ c: c + 1, v: v + 1, text, hits, n: hits.reduce((s, h) => s + h.found.length, 0) }); }));
    grand += rows.length;
    console.log(`${j.book} (King James text, data/kjv/${slug}.json): ${compiled.map((c) => `“${c.phrase}”`).join(', ')}${stem ? ' with its endings' : ''}\n`);
    for (const r of rows) console.log(`${j.book} ${r.c}:${r.v}${showTag ? `  ${tag(r.hits)}` : ''}  ${r.text}`);
    if (!rows.length) console.log('(no verse has it)');
    console.log(`\nBy chapter (verses): ${byChapter(rows, (r) => r.c) || 'none'}`);
    const per = compiled.length > 1 ? `; ${compiled.map((c) => `“${c.phrase}” in ${plural(rows.filter((r) => r.hits.some((h) => h.phrase === c.phrase)).length, 'verse')}`).join(', ')}` : '';
    console.log(`Total: ${plural(rows.length, 'verse')}, ${plural(rows.reduce((s, r) => s + r.n, 0), 'occurrence')}, in ${plural(new Set(rows.map((r) => r.c)).size, 'chapter')}${per}\n`);
  }
  if (kjvBooks.length > 1) console.log(`All ${kjvBooks.length} books: ${plural(grand, 'verse')}.`);
}

// ---------- --hebrew ----------

if (hebrew !== null) {
  const want = parseStrongs(hebrew);
  let grand = 0;
  for (const slug of kjvBooks) {
    const file = wlcFile(slug), j = await loadKjv(slug);
    if (!file) { console.log(`${j.book}: no Hebrew text (not an Old Testament book).\n`); continue; }
    const wlc = await loadWlc(file, { fresh });
    if (wlc.error) { console.error(`${wlc.error}: ${wlc.url}`); process.exit(1); }
    const hits = wordHits(wlc.verses, want);
    const count = hits.reduce((n, v) => n + v.words.length, 0);
    grand += count;
    console.log(`${j.book}: H${hebrew.replace(/^H/i, '')} (https://biblehub.com/hebrew/${want.n}.htm) in the Westminster Leningrad Codex (${wlc.url}): ${plural(count, 'occurrence')} in ${plural(hits.length, 'verse')}.`);
    console.log(`${WLC_NOTE}; each Hebrew verse is shown with the King James verse of the same number.\n`);
    const rows = hits.map((v) => { const [, c, vs] = v.id.split('.').map(Number); return { c, v: vs, hebrew: v.words.map((w) => w.text + (w.note ? ` (${w.note})` : '')).join('  '), text: j.chapters[c - 1]?.[vs - 1] }; });
    for (const r of rows) console.log(`${j.book} ${r.c}:${r.v}  ${r.hebrew}\n    ${r.text ?? '(no such verse in the King James text: the verse numbers differ here)'}`);
    if (!rows.length) console.log('(none: a number the file does not use, or a word that carries another number)');
    console.log(`\nBy chapter (verses): ${byChapter(rows, (r) => r.c) || 'none'}`);
    console.log(`Total: ${plural(count, 'occurrence')} in ${plural(rows.length, 'verse')}.\n`);
  }
  if (kjvBooks.length > 1) console.log(`All ${kjvBooks.length} books: ${plural(grand, 'occurrence')}.`);
}

// ---------- --site ----------

// The running text of a page, as a reader sees it: the Markdown, the [@key] citations, the [[reference|label]] links and the tags go.
const plain = (s) => String(s ?? '')
  .replace(/\[@[^\]]*\]/g, '').replace(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (_, ref, label) => label ?? ref).replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/<[^>]+>/g, '').replace(/^\s*>\s?/gm, '').replace(/^\s*\|?[-:| ]+\|?\s*$/gm, '').replace(/\s*\|\s*/g, ' · ').replace(/[*_`]+/g, '').replace(/\s+/g, ' ').replace(/^[\s·]+|[\s·]+$/g, '');
const ABBREVIATION = /(?:\b(?:B\.C|A\.D|ca|cf|e\.g|i\.e|vs|vv?|ch|Gen|Ex|Exod|Lev|Num|Deut|Josh|Judg|Sam|Kgs|Chr|Neh|Esth|Ps|Prov|Eccl|Isa|Jer|Lam|Ezek|Dan|Hos|Obad|Mic|Nah|Hab|Zeph|Hag|Zech|Mal|Matt|Rom|Cor|Gal|Eph|Philip|Col|Thes|Tim|Heb|Pet|Jn|Rev|Ne|Morm|Moro|Hel|St|Dr|Mt)|D&C|J\.S)\.$/;
// Paragraphs, list items and table rows are cut apart first; then each is cut into sentences at . ! ? followed by a capital letter or a quotation mark.
function sentences(text) {
  const out = [];
  for (const para of String(text ?? '').split(/\n\s*\n|\n(?=\s*(?:[-*]\s|\d+\.\s|\|))/))
    for (const piece of plain(para).split(/(?<=[.!?][”"’)\]]?)\s+(?=[“"‘A-Z])/)) {
      if (out.length && ABBREVIATION.test(out.at(-1))) out[out.length - 1] += ` ${piece}`; else if (piece) out.push(piece);
    }
  return out;
}
const clip = (s, n = 600) => {
  if (s.length <= n) return s;
  const at = Math.max(0, s.toLowerCase().indexOf((tokens(compiled[0].phrase)[0] ?? '')) - n / 2);
  return `${at > 0 ? '… ' : ''}${s.slice(at, at + n).trim()} …`;
};
const KIND_PLURAL = { note: 'notes', setting: 'settings', thread: 'threads', christ: 'christ sections', explore: 'explore sections', 'theme page': 'theme page sections', 'guide page': 'guide page sections' };
const sentenceHits = (text) => sentences(text).map((s) => ({ s, hits: find(s) })).filter((x) => x.hits.length);

if (site) {
  const books = (await discoverBooks(ROOT)).filter((b) => siteAll || allBooks || b.slug === bookArg.toLowerCase().replace(/\s+/g, ''));
  if (!books.length) usage(`No book “${bookArg}” in content/.`);
  const read = async (f) => YAML.parse(await readFile(f, 'utf8'));
  const ls = async (d, ext) => (existsSync(d) ? (await readdir(d)).filter((f) => f.endsWith(ext)).sort() : []);
  console.log(`What the site already says: ${compiled.map((c) => `“${c.phrase}”`).join(', ')}${stem ? ' with its endings' : ''} in ${books.map((b) => b.name).join(', ')}\n`);
  let grand = 0;
  for (const book of books) {
    const found = []; // { label, kind, hits: [{ s, hits }] }
    const add = (label, kind, text, extra) => { const hs = sentenceHits(text); if (hs.length) found.push({ label, kind, hits: hs, extra }); };
    for (const f of await ls(path.join(book.dir, 'chapters'), '.yaml')) {
      const n = parseInt(f, 10), ch = await read(path.join(book.dir, 'chapters', f));
      for (const part of ['setting', 'thread']) add(`${book.name} ${n}`, part, ch[part]);
      for (const note of ch.notes ?? []) {
        const verse = String(note.ref ?? '').match(/(\d+)(?:\s*[–-]\s*\d+)?\s*$/)?.[0] ?? '?';
        const title = String(note.title ?? '');
        const body = sentenceHits(note.body);
        if (body.length) found.push({ label: `${book.name} ${n}:${verse}`, kind: 'note', title, hits: body });
        else if (find(title).length) found.push({ label: `${book.name} ${n}:${verse}`, kind: 'note', title, hits: [{ s: '(in the note\'s title)', hits: find(title) }] });
      }
      for (const part of ['christ', 'explore']) add(`${book.name} ${n}`, part, ch[part]);
    }
    for (const sub of ['themes', 'guides'])
      for (const f of await ls(path.join(book.dir, sub), '.md')) {
        const text = (await readFile(path.join(book.dir, sub, f), 'utf8')).replace(/^---\n[\s\S]*?\n---/, '');
        let heading = 'opening', chunk = [];
        const flush = () => { if (chunk.length) add(`${book.name}`, sub === 'themes' ? 'theme page' : 'guide page', chunk.join('\n'), `${f.replace(/\.md$/, '')} § ${heading}`); chunk = []; };
        for (const line of text.split('\n')) {
          const h = line.match(/^#{1,3}\s+(.*)$/) ?? line.match(/^<h[1-6][^>]*>(.*?)<\/h[1-6]>/);
          if (h) { flush(); heading = plain(h[1]); } else chunk.push(line);
        }
        flush();
      }
    for (const f of found) {
      console.log(`${f.label}  ${f.kind}${f.title !== undefined ? ` “${f.title}”` : ''}${f.extra ? ` ${f.extra}` : ''}`);
      for (const h of f.hits) console.log(`    ${showTag ? `${tag(h.hits)} ` : ''}${clip(h.s)}`);
    }
    if (!found.length) console.log(`${book.name}: nothing on the site has it.`);
    const kinds = new Map();
    for (const f of found) kinds.set(f.kind, (kinds.get(f.kind) ?? 0) + 1);
    grand += found.length;
    console.log(`\n${book.name}: ${plural(found.length, 'place')}${found.length ? ` (${[...kinds].map(([k, n]) => `${KIND_PLURAL[k]} ${n}`).join(', ')})` : ''}.${found.some((f) => f.kind === 'note') ? ` By chapter (notes): ${byChapter(found.filter((f) => f.kind === 'note'), (f) => +f.label.match(/ (\d+)(?::|$)/)[1])}.` : ''}\n`);
  }
  if (books.length > 1) console.log(`All ${books.length} books: ${plural(grand, 'place')}.`);
}
