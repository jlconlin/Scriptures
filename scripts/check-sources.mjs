// Opens every URL of the sources.yaml entries a chapter proposes (or of the entries named) and puts the entry's title, author,
// and pub beside the page's own title and first heading, so the comparison STANDARDS.md §4 rule 10 asks for (“it must load a page
// with the right title”) is read in one place and not made by hand three times (writer, checker, coordinator). Pages come through
// the shared cache (src/lib/pages.mjs). It flags: a page that did not load, or is a block or challenge page, a not-found page,
// or has almost no text; a Bible Dictionary, Guide to the Scriptures, or Topical Guide URL whose page heading is not the entry's
// title (a missing entry still returns a page, headed only “Bible Dictionary”); a wiki or popular-history host; a PDF with no
// text layer; a title that shares no significant word with the page's title or first heading (a page with no title of its own:
// with its first paragraphs). An author whose surname is not on the page is noted, not flagged: not every page names it.
// Exit code 1 if anything is flagged. Reading the pages still has to be done by the one who cites them.
// Usage: node scripts/check-sources.mjs <book> <chapter numbers...>   the entries in .cache/batch/<book>/proposed/NN.yaml
//        node scripts/check-sources.mjs --keys a,b,c                  entries of content/sources.yaml (also with a book and chapters:
//                                                                     the proposed entries too)
//        node scripts/check-sources.mjs --all                         every entry of content/sources.yaml (several hundred pages)
//        --fresh   refetch, ignoring the cache
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { fetchPage, parseOrEmpty, pageProblems, letters } from '../src/lib/pages.mjs';
import { SCRIPT_ROOT as ROOT, readProposed, isWiki } from '../src/lib/ledger.mjs';

process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); }); // piped into head
const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); return i < 0 ? false : (argv.splice(i, 1), true); };
const value = (name) => { const i = argv.indexOf(name); if (i < 0) return null; const v = argv[i + 1] ?? ''; argv.splice(i, 2); return v; };
const fresh = flag('--fresh'), all = flag('--all'), keysArg = value('--keys');
const book = argv.find((a) => !/^\d+$/.test(a) && !a.startsWith('--')), chapters = argv.filter((a) => /^\d+$/.test(a)).map(Number);
if (keysArg === '' || (!all && keysArg === null && !(book && chapters.length))) {
  console.error('Usage: node scripts/check-sources.mjs <book> <chapters...> | --keys a,b,c | --all   [--fresh]');
  process.exit(1);
}

const sources = YAML.parse(await readFile(path.join(ROOT, 'content/sources.yaml'), 'utf8'));
// What to check: { key, entry, from }.
const todo = [];
if (book && chapters.length)
  for (const n of chapters) {
    let proposed;
    try { proposed = await readProposed(book, n); } catch (e) { console.log(`✗ ${e.message}`); process.exitCode = 1; continue; }
    if (!Object.keys(proposed).length) console.log(`${book} ${n}: no proposed entries (no file, or it is empty)`);
    for (const [key, entry] of Object.entries(proposed)) todo.push({ key, entry, from: `${book} ${n} proposed${key in sources ? '; the key is already in sources.yaml' : ''}` });
  }
if (keysArg) for (const key of keysArg.split(',').filter(Boolean)) todo.push({ key, entry: sources[key], from: 'sources.yaml' });
if (all) for (const [key, entry] of Object.entries(sources)) todo.push({ key, entry, from: 'sources.yaml' });

const STOP = new Set(['the', 'and', 'for', 'are', 'was', 'not', 'but', 'all', 'its', 'how', 'why', 'who', 'one', 'you', 'his', 'her', 'our', 'out', 'can', 'did', 'has', 'had', 'new', 'old', 'with', 'from', 'that', 'this', 'what', 'were', 'have', 'been', 'which', 'into', 'about', 'their', 'they', 'them', 'your', 'does', 'will', 'when', 'where', 'there', 'upon', 'than', 'then', 'chapter', 'part', 'lesson', 'volume', 'section', 'book', 'entry', 'page', 'pages']);
// The words that count in a title: three letters or more, not a common one, and numbers of three digits or more (a Strong's number, a year).
const words = (s) => [...new Set((String(s).normalize('NFKD').toLowerCase().replace(/[̀-ͯ]/g, '').match(/[a-z]{3,}|\d{3,}/g) ?? []).filter((w) => !STOP.has(w)))];
const same = (a, b) => a === b || (a.length >= 5 && b.length >= 5 && a.slice(0, 5) === b.slice(0, 5));
const clean = (s) => String(s ?? '').replace(/[*_]/g, '').replace(/\s+/g, ' ').trim();
const short = (s, n = 110) => (s.length > n ? `${s.slice(0, n - 1).trim()}…` : s);
const surname = (author) => { const a = clean(author).split(/,| and | & |;/)[0].trim().split(/\s+/); return a.at(-1) ?? ''; };

let flagged = 0;
for (const { key, entry, from } of todo) {
  const flags = [], notes = [];
  console.log(`\n${key}  (${entry?.type ?? '?'}; ${from})`);
  if (!entry) { console.log('  ⚑ not in sources.yaml'); flagged++; continue; }
  console.log(`  entry: ${clean(entry.title)}${entry.author ? ` | ${clean(entry.author)}` : ''}${entry.pub ? ` | ${clean(entry.pub)}` : ''}`);
  if (!entry.url) { console.log('  no URL: nothing to open (a printed work, a museum object)'); continue; }
  console.log(`  ${entry.url}`);
  if (isWiki(entry.url)) flags.push('a wiki or popular-history host: not a source (STANDARDS.md §4 rule 7)');
  const got = await fetchPage(entry.url, { fresh, tries: 4, wait: 3000 });
  if (got.error) flags.push(`the page did not load (${got.error})`);
  else {
    const page = parseOrEmpty(got.raw, entry.url);
    const first = page.heads.find((h) => h.level === 1) ?? page.heads[0];
    const chars = page.paras.reduce((n, p) => n + p.text.length, 0);
    console.log(`  page:  ${short(page.title || '(no title)')}${first && first.text !== page.title ? ` | ${short(first.text)}` : ''}  [${page.kind}, ${chars.toLocaleString('en-US')} characters]`);
    flags.push(...pageProblems(got.raw, page));
    // A Bible Dictionary, Guide to the Scriptures, or Topical Guide entry that is not there still returns a page.
    if (/\/study\/scriptures\/(?:bd|gs|tg)\/[^/?#]+/.test(entry.url)) {
      const head = letters(first?.text ?? page.title), want = letters(entry.title);
      const little = flags.findIndex((f) => f.startsWith('almost no text'));
      if (little >= 0) flags.splice(little, 1); // said better below
      if (!chars) flags.push(`the page has no text under the heading “${first?.text ?? page.title}”: the entry is not there`);
      else if (!head || !want || (head !== want && !head.includes(want) && !want.includes(head))) flags.push(`the page heading “${first?.text ?? page.title}” is not the entry's title “${clean(entry.title)}”`);
    } else if (!flags.length) {
      // Any other page: some significant word of the title is in the page's title or first heading.
      const mine = words(clean(entry.title));
      const onPage = words([page.title, first?.text].join(' '));
      const pool = onPage.length ? onPage : words(page.paras.slice(0, 3).map((p) => p.text.slice(0, 700)).join(' '));
      if (!mine.length) notes.push('the title has no word long enough to compare');
      else if (!mine.some((w) => pool.some((v) => same(w, v)))) flags.push(`no significant word of the entry's title (${mine.slice(0, 5).join(', ')}) is in the page's title${onPage.length ? ' or first heading' : ' (it has none: its first paragraphs were read)'}`);
    }
    if (entry.author && !flags.length && !/Central|Church|Institute|Museum|Center|Society|Press|Staff|Foundation|University/i.test(entry.author)) {
      const s = letters(surname(entry.author));
      if (s.length >= 3 && !letters(page.paras.slice(0, 30).map((p) => p.text).join(' ') + page.title).includes(s)) notes.push(`the author's surname (${surname(entry.author)}) is not in the page's first paragraphs; the page may not name its author`);
    }
  }
  for (const f of flags) console.log(`  ⚑ ${f}`);
  for (const n of notes) console.log(`  note: ${n}`);
  if (flags.length) flagged++;
}
console.log(`\n${todo.length} entr${todo.length === 1 ? 'y' : 'ies'} checked, ${flagged} flagged.${flagged ? ' Open each flagged page, and correct the entry or leave the source out.' : ' Titles agree; authors, dates, and page numbers in `pub` are still read from the page by whoever cites it.'}`);
if (flagged) process.exitCode = 1;
