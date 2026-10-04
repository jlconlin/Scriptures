// Prints a page's readable text, verbatim (tags stripped, entities decoded, nothing paraphrased), so a ledger quote can be
// copied from it, and so an agent reads only the paragraphs it needs instead of the whole page. Pages come through the
// shared cache (src/lib/pages.mjs), so a page fetched by anyone today is fetched once. Reads the Gospel Library (scripture
// chapters, Bible Dictionary, manuals, talks, with their footnotes), Scripture Central KnoWhys (from the API), Joseph Smith
// Papers transcripts, PDFs with a text layer (one paragraph per page), Bible Hub, rsc.byu.edu, byustudies.byu.edu,
// archive.org full texts, and any other page. If a page reads badly, curl is the fallback (STANDARDS.md §9).
// Usage: node scripts/source.mjs <url>                  title, size, and an outline: headings with the paragraph numbers under each
//        node scripts/source.mjs <url> --find "words"   the paragraphs that contain all the words (case-insensitive), with number and heading
//        node scripts/source.mjs <url> --para 12-20     those paragraphs (a list works: 3,7,12-20); --all prints everything
//        node scripts/source.mjs <url> --notes          the footnotes or endnotes: marker, the paragraphs citing it, text, links
//        --max N     most paragraphs --find prints (default 20)      --fresh   refetch
// A long paragraph (a PDF page) is shown as a window around the match with … at a cut; the … is not on the page.
import { readPage } from '../src/lib/pages.mjs';

process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); }); // piped into head
const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); return i < 0 ? null : (argv.splice(i, 1), true); };
const value = (name) => { const i = argv.indexOf(name); if (i < 0) return null; const v = argv[i + 1]; argv.splice(i, 2); return v ?? ''; };
const fresh = flag('--fresh'), all = flag('--all'), notesOnly = flag('--notes');
const find = value('--find'), paraArg = value('--para'), max = Number(value('--max')) || 20;
const url = argv.find((a) => /^https?:\/\//.test(a));
if (!url || (find === '' || paraArg === '')) {
  console.error('Usage: node scripts/source.mjs <url> [--find "words" | --para 12-20 | --all | --notes] [--max N] [--fresh]');
  process.exit(1);
}

const page = await readPage(url, { fresh });
if (page.error) { console.error(`${page.error}: ${url}`); process.exit(1); }
if (!page.paras.length && !page.notes.length) { console.error(`No readable text found at ${url} (a page that needs a browser?). Use curl.`); process.exit(1); }

const unit = (p) => (p.label ?? `${p.n}`);
const short = (s, n = 90) => (s.length > n ? `${s.slice(0, n - 1).trim()}…` : s);
const fold = (s) => s.normalize('NFKD').replace(/[̀-֑ͯ-ׇ]/g, '').toLowerCase();
const heading = (p) => (p.head ? ` § ${short(p.head, 70)}` : '');
const show = (p, text = p.text) => `[${unit(p)}]${heading(p)}\n${text}`;

// A window of about `width` characters around the place where the words come closest together.
function around(text, words, width = 700) {
  let f = '';
  const map = []; // index in the folded text -> index in the text
  for (let i = 0; i < text.length; ) {
    const ch = String.fromCodePoint(text.codePointAt(i)), g = fold(ch);
    for (let k = 0; k < g.length; k++) map.push(i);
    f += g; i += ch.length;
  }
  const at = words.map((w) => { const r = []; for (let i = f.indexOf(w); i >= 0; i = f.indexOf(w, i + 1)) r.push(map[i]); return r; });
  let best = null;
  for (const i of at[0]) {
    const span = at.map((r) => r.reduce((b, j) => (Math.abs(j - i) < Math.abs(b - i) ? j : b)));
    const lo = Math.min(...span), hi = Math.max(...span);
    if (!best || hi - lo < best.hi - best.lo) best = { lo, hi };
  }
  const mid = (best.lo + best.hi) / 2;
  let from = Math.max(0, Math.floor(Math.min(best.lo - 100, mid - width / 2))), to = Math.min(text.length, Math.ceil(Math.max(best.hi + 200, mid + width / 2)));
  if (from > 0) from = text.indexOf(' ', from) + 1 || from;
  if (to < text.length) to = text.lastIndexOf(' ', to) > from ? text.lastIndexOf(' ', to) : to;
  return `${from > 0 ? '… ' : ''}${text.slice(from, to).trim()}${to < text.length ? ' …' : ''}`;
}

const heads = `${page.title || url}${page.kind === 'knowhy' ? ` (${page.info})` : ''}\n${url}`; // a KnoWhy's number and date go with its title
const sizeLine = `${page.kind}: ${page.chars.toLocaleString('en-US')} characters of text in ${page.paras.length} paragraphs${page.notes.length ? `, ${page.notes.length} notes` : ''} (the page is ${page.rawLength.toLocaleString('en-US')} characters raw)`;

if (notesOnly) {
  const words = find ? fold(find).split(/\s+/).filter(Boolean) : [];
  const notes = page.notes.filter((n) => words.every((w) => fold(`${n.context} ${n.text} ${n.links.map((l) => l.text).join(' ')}`).includes(w)));
  console.log(`${heads}\n${notes.length} of ${page.notes.length} notes${words.length ? ` containing ${find}` : ''}\n`);
  for (const n of notes) {
    console.log(`${n.marker}${n.jst ? ' [JST]' : ''}${n.at?.length ? ` (cited at ${n.at.join(', ')})` : ''}${n.context ? ` “${n.context}”` : ''}: ${n.text}`);
    for (const l of n.links) console.log(`    → ${l.text}  ${l.href}`);
  }
  if (!notes.length) console.log(page.notes.length || page.kind === 'gl' ? '(none)' : '(none found: some pages keep their notes as ordinary paragraphs near the end; see the outline)');
} else if (find) {
  const words = fold(find).split(/\s+/).filter(Boolean);
  const hits = page.paras.filter((p) => { const f = fold(p.text); return words.every((w) => f.includes(w)); });
  console.log(`${heads}\n${hits.length} of ${page.paras.length} paragraphs contain ${words.map((w) => `“${w}”`).join(' and ')}${hits.length > max ? `; first ${max} shown (--max N for more)` : ''}\n`);
  for (const p of hits.slice(0, max)) console.log(show(p, p.text.length > 1500 ? around(p.text, words) : p.text) + '\n');
  if (!hits.length && words.length > 1) console.log(`Paragraphs with each word alone: ${words.map((w) => `${w} ${page.paras.filter((p) => fold(p.text).includes(w)).length}`).join(', ')}`);
} else if (paraArg || all) {
  const want = new Set();
  for (const part of String(paraArg ?? '').split(',')) { const [a, b] = part.split(/[–-]/).map(Number); if (a) for (let i = a; i <= (b || a); i++) want.add(i); }
  const picked = all ? page.paras : page.paras.filter((p) => want.has(p.n));
  console.log(`${heads}\n`);
  let last = null;
  for (const p of picked) { console.log(all && p.head === last ? `[${unit(p)}]\n${p.text}\n` : `${show(p)}\n`); last = p.head; }
  if (!picked.length) console.log(`No such paragraph. Numbers on this page run from ${page.paras[0]?.n} to ${page.paras.at(-1)?.n}.`);
} else {
  console.log(`${heads}\n${sizeLine}${page.info && page.kind !== 'knowhy' ? `\n${page.info}` : ''}\n`);
  if (page.heads.length) {
    console.log('Outline (paragraph numbers in brackets):');
    for (const h of page.heads) console.log(`${'  '.repeat(Math.min(Math.max(h.level - 1, 0), 3))}${h.from == null ? '' : h.from === h.to ? `[${h.from}] ` : `[${h.from}–${h.to}] `}${short(h.text, 110)}`);
  } else if (page.kind === 'pdf') console.log('A PDF: one paragraph per page, numbered by page.');
  else console.log(`No headings. Paragraphs are numbered ${page.paras[0]?.n} to ${page.paras.at(-1)?.n}.`);
  console.log('\nRead part of it: --find "words", --para 12-20, --notes, or --all.');
}
