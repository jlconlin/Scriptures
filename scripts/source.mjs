// Prints a page's readable text, verbatim (tags stripped, entities decoded, nothing paraphrased), so a ledger quote can be
// copied from it, and so an agent reads only the paragraphs it needs instead of the whole page. Pages come through the shared
// cache (src/lib/pages.mjs), so a page fetched by anyone today is fetched once. Reads the Gospel Library (scripture
// chapters, Bible Dictionary, manuals, talks, with their footnotes), Scripture Central KnoWhys (from the API), Joseph Smith
// Papers transcripts, PDFs with a text layer (one paragraph per page), Bible Hub, rsc.byu.edu, byustudies.byu.edu,
// archive.org full texts, and any other page. If a page reads badly, curl is the fallback (STANDARDS.md §9).
// A page that is not there (the site's own not-found page), a block or challenge page, or a page with no readable text is said to be
// that, on standard error, and the exit code is 1.
// On a scripture chapter paragraphs are numbered by verse and printed “v. 36” (the Church's own paragraph ids run ahead of the verse
// numbers when a chapter has a headnote), and --para takes verse numbers; the headnote, chapter heading and subtitle are paragraphs of their
// own, labelled (--para headnote). A manual's contents page is the list of its chapters with their addresses; a table is one paragraph
// per row, its cells separated by “ | ”.
// Usage: node scripts/source.mjs <url>                  title, size, and an outline: headings with the paragraph numbers under each
//        node scripts/source.mjs <url> --find "words"   the paragraphs that contain all the words (case-insensitive), with number and heading,
//                                                       and the headings that do; --find may be given more than once (a paragraph with
//                                                       all the words of any of them, saying which)
//        node scripts/source.mjs <url> --para 12-20     those paragraphs (a list works: 3,7,12-20; on a scripture chapter, verses;
//                                                       --verse is the same; a label works: --para headnote); --all prints everything
//        node scripts/source.mjs <url> --notes          the footnotes or endnotes: marker, the paragraphs citing it, text, links
//        --max N     most paragraphs --find prints (default 20)      --fresh   refetch
// A long paragraph (a PDF page) is shown as a window around the match with … at a cut; the … is not on the page.
import { readPage } from '../src/lib/pages.mjs';

process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); }); // piped into head
const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); return i < 0 ? null : (argv.splice(i, 1), true); };
const values = (name) => { const out = []; for (let i; (i = argv.indexOf(name)) >= 0; ) { out.push(argv[i + 1] ?? ''); argv.splice(i, 2); } return out; };
const fresh = flag('--fresh'), all = flag('--all'), notesOnly = flag('--notes');
const finds = values('--find'), paraArg = [...values('--para'), ...values('--verse')][0] ?? null, max = Number(values('--max')[0]) || 20;
const url = argv.find((a) => /^https?:\/\//.test(a));
if (!url || finds.includes('') || paraArg === '') {
  console.error('Usage: node scripts/source.mjs <url> [--find "words" ... | --para 12-20 | --verse 36-39 | --all | --notes] [--max N] [--fresh]');
  process.exit(1);
}

const page = await readPage(url, { fresh });
if (page.error) { console.error(`${page.error}: ${url}`); process.exit(1); }
const named = page.title || page.heads?.[0]?.text || '';
if (page.problems?.some((p) => /not-found/.test(p))) { console.error(`Not found: ${url} is the site's own not-found page (“${named}”), not the page.`); process.exit(1); }
if (page.problems?.some((p) => /block or challenge/.test(p))) { console.error(`Blocked: ${url} answered with a block or challenge page (“${named}”); a script can't read it. Open it in a browser, or cite only what its abstract page says.`); process.exit(1); }
if (page.problems?.some((p) => /no text layer/.test(p))) { console.error(`No text layer: ${url} is a PDF with no text (a scan); it can't be read here.`); process.exit(1); }
if (!page.paras.length && !page.notes.length) { console.error(`No readable text found at ${url}${page.unreadable ? ` (${page.unreadable})` : ' (a page that needs a browser?)'}. Use curl.`); process.exit(1); }

const unit = (p) => (p.label ?? `${p.n}`);
const short = (s, n = 90) => (s.length > n ? `${s.slice(0, n - 1).trim()}…` : s);
const fold = (s) => s.normalize('NFKD').replace(/[̀-֑ͯ-ׇ]/g, '').toLowerCase();
const heading = (p) => (p.head ? ` § ${short(p.head, 70)}` : '');
const show = (p, text = p.text) => `[${unit(p)}]${heading(p)}\n${text}`;
const scripture = page.paras.some((p) => /^v\. \d+$/.test(p.label ?? ''));

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
const searches = finds.map((f) => ({ find: f, words: fold(f).split(/\s+/).filter(Boolean) })).filter((s) => s.words.length);
const has = (text, s) => { const t = fold(text); return s.words.every((w) => t.includes(w)); };
const range = (h) => (h.from == null ? '' : h.to > h.from ? ` [${h.from}–${h.to}]` : ` [${h.from}]`);

if (notesOnly) {
  const notes = page.notes.filter((n) => !searches.length || searches.some((s) => has(`${n.context} ${n.text} ${n.links.map((l) => l.text).join(' ')}`, s)));
  console.log(`${heads}\n${notes.length} of ${page.notes.length} notes${finds.length ? ` containing ${finds.join(' or ')}` : ''}\n`);
  for (const n of notes) {
    console.log(`${n.marker}${n.jst ? ' [JST]' : ''}${n.at?.length ? ` (cited at ${n.at.join(', ')})` : ''}${n.context ? ` “${n.context}”` : ''}: ${n.text}`);
    for (const l of n.links) console.log(`    → ${l.text}  ${l.href}`);
  }
  if (!notes.length) console.log(page.notes.length || page.kind === 'gl' ? '(none)' : '(none found: some pages keep their notes as ordinary paragraphs near the end; see the outline)');
} else if (searches.length) {
  const many = searches.length > 1;
  const hits = page.paras.map((p) => ({ p, s: searches.filter((s) => has(p.text, s)) })).filter((h) => h.s.length);
  const hitHeads = page.heads.filter((h) => searches.some((s) => has(h.text, s)));
  const quoted = (list) => list.map((s) => `“${s.find}”`).join(' or ');
  console.log(`${heads}\n${hits.length} of ${page.paras.length} paragraphs contain ${searches.map((s) => s.words.map((w) => `“${w}”`).join(' and ')).join(' or ')}${hitHeads.length ? `; ${hitHeads.length} heading${hitHeads.length > 1 ? 's do' : ' does'}` : ''}${hits.length > max ? `; first ${max} shown (--max N for more)` : ''}\n`);
  for (const h of hitHeads.slice(0, max)) console.log(`§ ${short(h.text, 120)}${range(h)}${many ? `  (heading; matches ${quoted(searches.filter((s) => has(h.text, s)))})` : '  (heading)'}`);
  if (hitHeads.length) console.log('');
  for (const { p, s } of hits.slice(0, max)) {
    const words = s[0].words;
    console.log(show(p, p.text.length > 1500 ? around(p.text, words) : p.text) + (many ? `\n(matches ${quoted(s)})` : '') + '\n');
  }
  if (!hits.length && !hitHeads.length && searches.length === 1 && searches[0].words.length > 1) console.log(`Paragraphs with each word alone: ${searches[0].words.map((w) => `${w} ${page.paras.filter((p) => fold(p.text).includes(w)).length}`).join(', ')}`);
} else if (paraArg || all) {
  // Numbers (3,7,12-20; on a scripture chapter, verses) and labels (headnote, subtitle, chapter heading, v. 36).
  const want = new Set(), words = [];
  for (const part of String(paraArg ?? '').split(',').map((x) => x.trim()).filter(Boolean)) {
    if (/^v?\.?\s*\d+(?:\s*[–-]\s*\d+)?$/.test(part)) { const [a, b] = part.replace(/^v\.?\s*/, '').split(/\s*[–-]\s*/).map(Number); for (let i = a; i <= (b || a); i++) want.add(i); }
    else words.push(part.toLowerCase());
  }
  const picked = all ? page.paras : page.paras.filter((p) => (want.has(p.n) && (!scripture || p.n > 0)) || words.some((w) => unit(p).toLowerCase().includes(w)));
  console.log(`${heads}\n`);
  let last = null;
  for (const p of picked) { console.log(all && p.head === last ? `[${unit(p)}]\n${p.text}\n` : `${show(p)}\n`); last = p.head; }
  const nums = page.paras.filter((p) => p.n > 0);
  if (!picked.length) console.log(`No such ${scripture ? 'verse' : 'paragraph'}. ${scripture ? 'Verses' : 'Numbers on this page'} run from ${nums[0]?.n} to ${nums.at(-1)?.n}${scripture && page.paras.some((p) => !p.n) ? `; the text before verse 1 is ${[...new Set(page.paras.filter((p) => !p.n).map(unit))].map((l) => `“${l}”`).join(', ')}` : ''}.`);
} else {
  console.log(`${heads}\n${sizeLine}${page.info && page.kind !== 'knowhy' ? `\n${page.info}` : ''}\n`);
  if (page.heads.length) {
    console.log(`Outline (${scripture ? 'verse' : 'paragraph'} numbers in brackets):`);
    for (const h of page.heads) console.log(`${'  '.repeat(Math.min(Math.max(h.level - 1, 0), 3))}${h.from == null ? '' : h.from === h.to ? `[${h.from}] ` : `[${h.from}–${h.to}] `}${short(h.text, 110)}`);
  } else if (page.kind === 'pdf') console.log('A PDF: one paragraph per page, numbered by page.');
  else console.log(`No headings. Paragraphs are numbered ${page.paras[0]?.n} to ${page.paras.at(-1)?.n}.`);
  console.log(`\nRead part of it: --find "words", ${scripture ? '--para 36-39 (verses), ' : '--para 12-20, '}--notes, or --all.`);
}
