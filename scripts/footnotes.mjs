// What the Gospel Library puts beside a chapter, so a writer starts from it and a note does not repeat it (STANDARDS.md §1):
// the Church's chapter heading, every footnote by verse (with the Joseph Smith Translation readings marked), and the
// Scripture Helps chapter that covers it, found from the manual's contents page, with its section headings and every endnote
// (the work it cites and its link). Pages come through the shared cache (src/lib/pages.mjs); to read more of any of them use
// scripts/source.mjs on the URL printed here.
// Usage: node scripts/footnotes.mjs <book> <chapter>      (book = the directory under content/, such as genesis; --fresh refetches)
import { readPage, fetchPage, glContent, decode } from '../src/lib/pages.mjs';
import { findBook } from '../src/lib/books.mjs';
import { parseRef } from '../src/lib/refs.mjs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); }); // piped into head
const argv = process.argv.slice(2);
const fresh = argv.includes('--fresh');
const [slug, chapterArg] = argv.filter((a) => !a.startsWith('--'));
if (!slug || !/^\d+$/.test(chapterArg ?? '')) { console.error('Usage: node scripts/footnotes.mjs <book> <chapter>   (book = a directory under content/, such as genesis)'); process.exit(1); }
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
for (const [v, notes] of [...byVerse].sort((a, b) => a[0] - b[0])) {
  console.log(`\nVerse ${v || '(not tied to a verse)'}`);
  for (const n of notes) {
    console.log(`  ${n.marker}${n.context ? ` “${n.context}”` : ''}: ${n.jst ? '★ JST  ' : ''}${n.text}`);
    if (n.jst) for (const l of n.links) console.log(`      → ${l.text}  ${l.href}`);
  }
}

// ---------- Scripture Helps ----------
console.log('\n--- Scripture Helps ---');
const vol = book.gospelLibrary.split('/')[0], manual = MANUAL[vol];
if (!manual) { console.log(`This script knows Scripture Helps only for the Old and New Testaments; there is none to look up for ${book.name}.`); process.exit(0); }
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
  console.log(`No Scripture Helps chapter covers ${book.name} ${chapter}. ${near.length ? `Its chapters on ${book.name}: ${near.join(' | ')}.` : `Its chapters name no part of ${book.name}.`} (Contents: ${tocUrl})`);
  process.exit(0);
}
// A section's label, “Genesis 22:1–14”, tells whether it covers this chapter.
const labelCovers = (text) => {
  const label = text.match(/^(.*?\d): /)?.[1];
  const m = label?.match(/^(.*?)\s+(\d+)(:\d+)?(?:\s*[–-]\s*(\d+)(:\d+)?)?/);
  if (!m || parseRef(`${m[1]} 1`)?.slug !== book.abbr) return false;
  const c1 = +m[2], c2 = m[3] ? (m[5] ? +m[4] : c1) : +(m[4] ?? c1);
  return chapter >= c1 && chapter <= c2;
};
for (const e of mine) {
  const man = await readPage(e.href, { fresh });
  if (man.error) { console.log(`${e.title}: ${man.error}: ${e.href}`); continue; }
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
