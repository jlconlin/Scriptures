// Compares a book's text on the site (data/kjv/<book>.json) with the plain text of another printing,
// such as archive.org's OCR of a public-domain edition, verse by verse and word by word, and prints the
// words that differ. It is for finding where a current edition departs from an old one; OCR noise shows
// up as differences too, so the list is read by a person.
// Usage: node scripts/compare-edition.mjs <book> <text file> --from <line> --to <line>
//   --from and --to are the lines of the text file that hold the book (its first “CHAPTER 1” to its end).
// The printing must mark chapters “CHAPTER 3.” and begin each verse “12. ” at the start of a line.
// Words the old printing adds in a run of more than three are taken to be its footnotes or page
// headings, which OCR leaves in the middle of a verse, and are not reported.
import { readFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const opt = (n) => { const i = argv.indexOf(n); return i < 0 ? null : argv[i + 1]; };
const [book, file] = argv.filter((a, i) => !a.startsWith('--') && !['--from', '--to'].includes(argv[i - 1]));
if (!book || !file) { console.error('Usage: node scripts/compare-edition.mjs <book> <text file> --from <line> --to <line>'); process.exit(1); }
const ours = JSON.parse(readFileSync(`data/kjv/${book}.json`, 'utf8')).chapters;
const lines = readFileSync(file, 'utf8').split('\n').slice((+opt('--from') || 1) - 1, +opt('--to') || undefined);

// The old printing, as chapter → verse → text. A line that ends in a hyphen is joined to the next.
const theirs = {};
let c = 0, v = 0;
for (const raw of lines) {
  const line = raw.trim();
  const ch = line.match(/^CHAPTER (\d+)/);
  if (ch) { c = +ch[1]; v = 0; theirs[c] = {}; continue; }
  if (!c) continue;
  const vs = line.match(/^(\d{1,3})[.,] ?([\p{Lu}(].*)$/u);
  // A verse begins with one of the next few numbers and a capital letter, so a footnote that begins with a number
  // does not start one, and a verse number the scan lost costs only that verse (reported as not found).
  if (vs && +vs[1] > v && +vs[1] <= v + 3) { v = +vs[1]; theirs[c][v] = vs[2]; continue; }
  if (v) theirs[c][v] += theirs[c][v].endsWith('-') ? line : ` ${line}`;
}

const words = (s) => s.replace(/(\p{L})-\s*(\p{L})/gu, '$1$2').toLowerCase().replace(/[’']/g, '').replace(/[^\p{L}]+/gu, ' ').trim().split(' ').filter(Boolean);
// The edits that turn a into b, by the longest common subsequence of their words.
function diff(a, b) {
  const n = a.length, m = b.length, t = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) t[i][j] = a[i] === b[j] ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
  const out = []; let i = 0, j = 0, cur = null;
  const push = (kind, w) => { if (!cur) out.push((cur = { ours: [], theirs: [], at: i })); cur[kind].push(w); };
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) { cur = null; i++; j++; }
    else if (j < m && (i === n || t[i][j + 1] >= t[i + 1][j])) push('theirs', b[j++]);
    else push('ours', a[i++]);
  }
  return out;
}

let found = 0, missing = 0;
ours.forEach((chapter, ci) => chapter.forEach((text, vi) => {
  const ref = `${ci + 1}:${vi + 1}`, other = theirs[ci + 1]?.[vi + 1];
  if (other === undefined) { missing++; console.log(`${ref}  not found in the other printing`); return; }
  const a = words(text);
  for (const d of diff(a, words(other))) {
    if (!d.ours.length && d.theirs.length > 3) continue; // a footnote or page heading inside the verse
    found++;
    console.log(`${ref}  site “${[a[d.at - 1] ?? '', ...d.ours].join(' ').trim()}” / other “${[a[d.at - 1] ?? '', ...d.theirs.slice(0, 8)].join(' ').trim()}${d.theirs.length > 8 ? ' …' : ''}”`);
  }
}));
console.log(`\n${found} difference(s) in ${ours.flat().length} verses; ${missing} verse(s) not found.`);
