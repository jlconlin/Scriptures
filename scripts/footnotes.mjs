// What the Gospel Library puts beside a chapter, so a writer starts from it and a note does not repeat it (STANDARDS.md §1):
// the Church's chapter heading, every footnote by verse (with the Joseph Smith Translation readings marked), and the
// Scripture Helps chapter that covers it, found from the manual's contents page, with its section headings and every endnote
// (the work it cites and its link). Pages come through the shared cache (src/lib/pages.mjs); to read more of any of them use
// scripts/source.mjs on the URL printed here.
// With --compare, for a chapter that is written (the checker's comparison, “don't replicate the Gospel Library”): for each note,
// the Church's footnotes on its verses beside the note's own [[references]], with which of those references are already in the
// footnotes (a footnote's links are read, so “Gen. 24:15” and a link to it agree); and for each Scripture Helps section on its verses
// the section's heading and text, and each of its endnotes with every link: whether that page is readable (text found, or blocked,
// not found, a PDF with no text layer, almost no text) and whether a ledger row of the chapter cites that URL. Whether a note says
// more than the footnote or the section stays the checker's judgment; this gives it the overlap. A section's text is shown once.
// Usage: node scripts/footnotes.mjs <book> <chapter> [--compare [--long]]   (book = the directory under content/, such as genesis)
//        --fresh refetches; --long shows a Scripture Helps section's whole text (otherwise about 1,500 characters of it)
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { readPage, fetchPage, glContent, decode, parseOrEmpty, pageProblems } from '../src/lib/pages.mjs';
import { findBook } from '../src/lib/books.mjs';
import { parseRef } from '../src/lib/refs.mjs';
import { normUrl, pad, versesOf } from '../src/lib/ledger.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); }); // piped into head
const argv = process.argv.slice(2);
const fresh = argv.includes('--fresh'), compare = argv.includes('--compare'), long = argv.includes('--long');
const [slug, chapterArg] = argv.filter((a) => !a.startsWith('--'));
if (!slug || !/^\d+$/.test(chapterArg ?? '')) { console.error('Usage: node scripts/footnotes.mjs <book> <chapter> [--compare [--long]]   (book = a directory under content/, such as genesis)'); process.exit(1); }
const chapter = +chapterArg;
const book = await findBook(ROOT, slug);
const CHURCH = 'https://www.churchofjesuschrist.org/study';
const MANUAL = { ot: 'scripture-helps-old-testament', nt: 'scripture-helps-new-testament' };
const short = (s, n = 100) => (s.length > n ? `${s.slice(0, n - 1).trim()}…` : s);

// ---------- the chapter's own footnotes ----------
const url = `${CHURCH}/scriptures/${book.gospelLibrary}/${chapter}?lang=eng`;
const page = await readPage(url, { fresh });
if (page.error) { console.error(`${page.error}: ${url}`); process.exit(1); }
console.log(`${page.title || `${book.name} ${chapter}`}: ${url}\n`);
const summary = page.heads.find((h) => h.level === 2) ?? page.heads.at(-1), bookHead = page.heads.find((h) => h.level === 1 && h !== summary);
if (bookHead) console.log(`Book heading: ${bookHead.text}`);
console.log(`Chapter heading: ${summary?.text ?? '(none)'}\n`);
const jst = page.notes.filter((n) => n.jst);
console.log(`Footnotes: ${page.notes.length}${jst.length ? `; Joseph Smith Translation: ${jst.length} (${jst.map((n) => n.marker).join(', ')})` : '; no Joseph Smith Translation footnotes'}`);
const byVerse = new Map();
for (const n of page.notes) for (const v of n.at.length ? n.at.slice(0, 1) : [0]) (byVerse.get(v) ?? byVerse.set(v, []).get(v)).push(n);
if (!compare)
  for (const [v, notes] of [...byVerse].sort((a, b) => a[0] - b[0])) {
    console.log(`\nVerse ${v || '(not tied to a verse)'}`);
    for (const n of notes) {
      console.log(`  ${n.marker}${n.context ? ` “${n.context}”` : ''}: ${n.jst ? '★ JST  ' : ''}${n.text}`);
      if (n.jst) for (const l of n.links) console.log(`      → ${l.text}  ${l.href}`);
    }
  }

// ---------- Scripture Helps ----------
if (!compare) console.log('\n--- Scripture Helps ---');
const vol = book.gospelLibrary.split('/')[0], manual = MANUAL[vol];
let helps = []; // the Scripture Helps chapters that cover this one, read: { e, man }
const none = (msg) => { if (!compare) console.log(msg); else console.log(`\nScripture Helps: ${msg}`); };
async function findHelps() {
  if (!manual) return none(`This script knows Scripture Helps only for the Old and New Testaments; there is none to look up for ${book.name}.`);
  const tocUrl = `${CHURCH}/manual/${manual}?lang=eng`;
  const toc = await fetchPage(tocUrl, { fresh, tries: 5, wait: 4000 });
  if (toc.error) { console.error(`${toc.error}: ${tocUrl}`); process.exit(1); }
  const entries = [...(glContent(toc.raw)?.content.body ?? '').matchAll(/<a href="([^"]*)"[^>]*><p class="title">([^<]*)<\/p>/g)].map((m) => ({ href: new URL(decode(m[1]), CHURCH).href, title: decode(m[2]) }));
  // A title lists passages: "Genesis 6–11; Moses 8", "Exodus 19–20; 24; 31–34", "Ruth; 1 Samuel 1–7". A part with no book name belongs to the one before; a part with no number is the whole book.
  function covers(title) {
    let name = null, hit = false;
    for (const part of title.split(';').map((p) => p.trim())) {
      const m = part.match(/^(?:(.*?)\s+)?(\d+)(?:\s*[–-]\s*(\d+))?$/);
      if (m?.[1]) name = m[1]; else if (!m) name = part;
      if (name && parseRef(`${name} 1`)?.slug === book.abbr && (!m || (chapter >= +m[2] && chapter <= +(m[3] ?? m[2])))) hit = true;
    }
    return hit;
  }
  const mine = entries.filter((e) => covers(e.title));
  if (!mine.length) {
    const near = entries.filter((e) => /\d/.test(e.title) || /^[A-Z]/.test(e.title)).filter((e) => e.title.split(';').some((p) => parseRef(`${p.trim().replace(/\s+\d.*$/, '')} 1`)?.slug === book.abbr)).map((e) => e.title);
    return none(`No Scripture Helps chapter covers ${book.name} ${chapter}. ${near.length ? `Its chapters on ${book.name}: ${near.join(' | ')}.` : `Its chapters name no part of ${book.name}.`} (Contents: ${tocUrl})`);
  }
  for (const e of mine) {
    const man = await readPage(e.href, { fresh });
    if (man.error) { console.log(`${e.title}: ${man.error}: ${e.href}`); continue; }
    helps.push({ e, man });
  }
}
await findHelps();

// A section's label, “Genesis 22:1–14”, as the chapters and verses it covers: { c1, v1, c2, v2 } (a verse is null when the label gives none), or null.
const labelSpan = (text) => {
  const label = text.match(/^(.*?\d): /)?.[1];
  const m = label?.match(/^(.*?)\s+(\d+)(?::(\d+))?(?:\s*[–-]\s*(?:(\d+):)?(\d+))?/);
  if (!m || parseRef(`${m[1]} 1`)?.slug !== book.abbr) return null;
  const c1 = +m[2];
  return m[3] ? { c1, v1: +m[3], c2: m[4] ? +m[4] : c1, v2: +(m[5] ?? m[3]) } : { c1, v1: null, c2: m[5] ? +m[5] : c1, v2: null };
};
const spanCovers = (s, c, v) => s && c >= s.c1 && c <= s.c2 && !(v != null && c === s.c1 && s.v1 != null && v < s.v1) && !(v != null && c === s.c2 && s.v2 != null && v > s.v2);
const labelCovers = (text) => spanCovers(labelSpan(text), chapter, null);

if (!compare) {
  for (const { e, man } of helps) {
    console.log(`\n${man.title || e.title} (the chapter that covers ${book.name} ${chapter}): ${e.href}`);
    console.log(`${man.notes.length} endnotes; read the text with: node scripts/source.mjs "${e.href}" --find "words"`);
    console.log('\nSections (► covers this chapter):');
    for (const h of man.heads) if (h.level >= 2 || /\d: /.test(h.text)) console.log(`  ${labelCovers(h.text) ? '►' : ' '} ${h.from == null ? '' : `[${h.from}${h.to > h.from ? `–${h.to}` : ''}] `}${short(h.text, 120)}`);
    const headOf = new Map(man.paras.map((p) => [p.n, p.head]));
    console.log('\nEndnotes:');
    for (const n of man.notes) {
      const where = [...new Set(n.at.map((a) => headOf.get(a)).filter(Boolean))].map((h) => short(h, 50));
      const mark = n.at.some((a) => labelCovers(headOf.get(a) ?? '')) ? '►' : ' ';
      console.log(`  ${mark} ${n.marker} ${n.text}${where.length ? `  [in ${where.join('; ')}]` : ''}`);
      for (const l of n.links) console.log(`        → ${l.text}  ${l.href}`);
    }
  }
  process.exit(0);
}

// ---------- --compare: each note of the written chapter beside what the Gospel Library has ----------
const chFile = path.join(book.dir, 'chapters', `${pad(chapter)}.yaml`);
if (!existsSync(chFile)) { console.error(`\n--compare needs the written chapter, and there is no ${path.relative(ROOT, chFile)}.`); process.exit(1); }
const ch = YAML.parse(await readFile(chFile, 'utf8'));
const ledgerFile = path.join(book.dir, 'evidence', `${pad(chapter)}.yaml`);
const ledger = existsSync(ledgerFile) ? (YAML.parse(await readFile(ledgerFile, 'utf8')).claims ?? []) : [];
const registry = YAML.parse(await readFile(path.join(ROOT, 'content/sources.yaml'), 'utf8'));
const cites = (href) => {
  const rows = ledger.filter((r) => r.url && normUrl(r.url) === normUrl(href));
  if (rows.length) return `cited by ledger row${rows.length > 1 ? 's' : ''}: ${rows.slice(0, 3).map((r) => `[${r.key}] ${short(String(r.where), 40)}`).join('; ')}${rows.length > 3 ? ` and ${rows.length - 3} more` : ''}`;
  const key = Object.keys(registry).find((k) => registry[k]?.url && normUrl(registry[k].url) === normUrl(href));
  return key ? `no ledger row cites it (sources.yaml has it as ${key}${(ch.sources ?? []).includes(key) ? ', which the chapter lists' : ''})` : 'no ledger row cites it';
};

// The scripture a link points to: { vol, slug, chapter, ranges } (ranges: the verses of its `id`, or null for the whole chapter), or null for anything else.
function linkRef(href) {
  let u;
  try { u = new URL(href); } catch { return null; }
  const segs = u.pathname.split('/').filter(Boolean), i = segs.indexOf('scriptures');
  const [v, s, c] = segs.slice(i + 1);
  if (i < 0 || !['ot', 'nt', 'bofm', 'dc-testament', 'pgp', 'jst'].includes(v) || !/^\d+$/.test(c ?? '')) return null;
  const ranges = (u.searchParams.get('id') ?? '').split(',').map((p) => p.match(/^p(\d+)(?:-p(\d+))?$/)).filter(Boolean).map((m) => [+m[1], +(m[2] ?? m[1])]);
  return { vol: v, slug: s, chapter: +c, ranges: ranges.length ? ranges : null };
}
const overlaps = (a, b) => !a || !b || a.some(([x, y]) => b.some(([p, q]) => x <= q && p <= y)); // a verse range list, or null for the whole chapter
// The note's [[references]], each as { text, r }.
function noteRefs(body) {
  const out = [];
  for (const m of String(body ?? '').matchAll(/\[\[([^\]]+)\]\]/g)) {
    let prev;
    for (const part of m[1].split('|')[0].split(';')) {
      const r = parseRef(part, prev);
      if (r) { prev = r.book; out.push({ text: part.trim(), r }); }
    }
  }
  return out;
}
const fnRefs = (n) => n.links.map((l) => linkRef(l.href)).filter(Boolean);

// Is a link's page readable? Scripture chapters are not fetched (the footnote is the Church's own); anything else is.
const readable = new Map();
async function status(href) {
  if (linkRef(href)) return 'scripture (not fetched)';
  if (!readable.has(href)) {
    const got = await fetchPage(href, { fresh, tries: 3, wait: 2000 });
    if (got.error) readable.set(href, 'NOT READABLE: not fetched (blocked, gone, or no answer)');
    else {
      const p = parseOrEmpty(got.raw, href), bad = pageProblems(got.raw, p), chars = p.paras.reduce((n, q) => n + q.text.length, 0);
      readable.set(href, bad.length ? `NOT READABLE: ${bad.join('; ')}` : `readable (${chars.toLocaleString('en-US')} characters of text${p.title ? `; “${short(p.title, 60)}”` : ''})`);
    }
  }
  return readable.get(href);
}

console.log(`\nWritten chapter: ${(ch.notes ?? []).length} notes. Each is shown with the Church's footnotes on its verses and the Scripture Helps sections that cover them.`);
const shownSection = new Map(); // a section's heading -> the note it was first shown under
const tally = { notes: 0, withFootnote: 0, allIn: 0, inHelps: 0 };
for (const note of ch.notes ?? []) {
  tally.notes++;
  const [a, b] = versesOf(note.ref) ?? [0, 0], label = `${chapter}:${a}${b > a ? `–${b}` : ''}`;
  console.log(`\n${'='.repeat(78)}\nNote ${label} “${note.title}” [${note.kind}] on “${note.phrase}”`);
  const fns = page.notes.filter((n) => n.at.length && n.at[0] >= a && n.at[0] <= b);
  if (fns.length) tally.withFootnote++;
  console.log(fns.length ? 'Church footnotes on this verse:' : 'No Church footnote on this verse.');
  for (const n of fns) console.log(`  ${n.marker}${n.context ? ` “${n.context}”` : ''}: ${n.jst ? '★ JST  ' : ''}${n.text}`);
  // The Scripture Helps sections that cover these verses, and their endnotes.
  const secs = helps.flatMap(({ e, man }) => man.heads.filter((h) => /\d: /.test(h.text) && h.from != null && [...Array(b - a + 1)].some((_, i) => spanCovers(labelSpan(h.text), chapter, a + i))).map((h) => ({ e, man, h, notes: man.notes.filter((n) => n.at.some((p) => p >= h.from && p <= h.to)) })));
  const refs = noteRefs(note.body);
  const sameRef = (f, r) => f.slug === r.slug && f.chapter === r.chapter && overlaps(f.ranges, r.verses && [r.verses]);
  if (refs.length) {
    const found = [];
    for (const { text, r } of refs) {
      if (r.slug === book.abbr && r.chapter === chapter) { found.push(`${text} (this chapter)`); continue; }
      const hit = fns.filter((n) => fnRefs(n).some((f) => sameRef(f, r)));
      const other = !hit.length && page.notes.filter((n) => !fns.includes(n)).filter((n) => fnRefs(n).some((f) => sameRef(f, r)));
      const helped = !hit.length && secs.flatMap((s) => s.notes.filter((n) => fnRefs(n).some((f) => sameRef(f, r))).map((n) => n.marker.replace(/\.$/, '')));
      found.push(`${text} ${hit.length ? `✓ in footnote ${hit.map((n) => n.marker).join(', ')}` : other.length ? `– not on this verse; in footnote ${other.slice(0, 3).map((n) => `${n.marker} (verse ${n.at[0]})`).join(', ')}` : '–'}${helped.length ? ` (Scripture Helps endnote ${helped.join(', ')})` : ''}`);
    }
    const inFn = found.filter((f) => f.includes('✓')).length, outside = refs.filter(({ r }) => !(r.slug === book.abbr && r.chapter === chapter)).length;
    if (inFn === outside && outside) tally.allIn++;
    console.log(`The note's references: ${found.join('; ')}\n  ${inFn} of ${outside} references to other chapters are already in the footnotes on this verse.`);
  } else console.log("The note has no [[references]].");
  for (const { e, man, h, notes } of secs) {
    tally.inHelps++;
    const first = shownSection.get(h.text);
    console.log(`\nScripture Helps § ${h.text}  [¶${h.from}${h.to > h.from ? `–${h.to}` : ''}]`);
    if (first) { console.log(`  (text and endnotes shown under note ${first})`); continue; }
    shownSection.set(h.text, label);
    const text = man.paras.filter((p) => p.n >= h.from && p.n <= h.to).map((p) => p.text).join('\n  ');
    console.log(`  ${long || text.length <= 1500 ? text : `${text.slice(0, text.lastIndexOf(' ', 1500))} … (${text.length.toLocaleString('en-US')} characters; --long, or source.mjs "${e.href}" --para ${h.from}-${h.to})`}`);
    for (const n of notes) {
      const scripture = n.links.filter((l) => linkRef(l.href)), others = n.links.filter((l) => !linkRef(l.href));
      console.log(`  endnote ${n.marker.replace(/\.$/, '')}: ${short(n.text, 300)}${scripture.length && !others.length ? '  (scripture)' : ''}`);
      for (const l of others) console.log(`      → ${l.text}  ${l.href}\n        ${await status(l.href)}; ${cites(l.href)}`);
      if (!n.links.length) console.log(`      (no link${/\b(?:19|20)\d\d\b|ed\.|vol\./.test(n.text) ? ': a printed work or article; to be found and cited only if read' : ''})`);
    }
  }
}
console.log(`\n${tally.notes} notes: ${tally.withFootnote} have a Church footnote on their verse; ${tally.allIn} have every reference to another chapter already in the footnotes; ${tally.inHelps} note-and-section pairs in Scripture Helps (${shownSection.size} sections).`);
