// Says which verses of a book on the site (data/kjv/<book>.json) are found word for word, letters only,
// somewhere in one or more plain-text files (OCR of other printings), and lists the verses found in none.
// It goes with scripts/compare-edition.mjs: a verse found whole in an old printing needs no further look.
// Usage: node scripts/find-verses.mjs <book> <text file> [<text file> …]
import { readFileSync } from 'node:fs';
const [book, ...files] = process.argv.slice(2);
if (!book || !files.length) { console.error('Usage: node scripts/find-verses.mjs <book> <text file> [<text file> …]'); process.exit(1); }
const letters = (s) => s.replace(/-\s*\n\s*/g, '').toLowerCase().replace(/[^a-z]+/g, '');
const streams = files.map((f) => letters(readFileSync(f, 'utf8')));
const ours = JSON.parse(readFileSync(`data/kjv/${book}.json`, 'utf8')).chapters;
const not = [], count = files.map(() => 0);
ours.forEach((ch, c) => ch.forEach((text, v) => {
  const i = streams.findIndex((s) => s.includes(letters(text)));
  if (i < 0) not.push(`${c + 1}:${v + 1}`); else count[i]++;
}));
files.forEach((f, i) => console.log(`${count[i]} verse(s) first found whole in ${f}`));
console.log(`${not.length} of ${ours.flat().length} verse(s) found whole in none:\n${not.join(' ')}`);
