// One-time import of the public-domain King James Version text.
// Source: https://github.com/aruljohn/Bible-kjv (KJV 1769, public domain).
// Usage: node scripts/fetch-kjv.mjs Isaiah
import { writeFile, mkdir } from 'node:fs/promises';

const book = process.argv[2] ?? 'Isaiah';
const url = `https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/${book}.json`;

// Spellings in the Latter-day Saint edition of the KJV (checked word-for-word against the
// Gospel Library) that differ from the source file.
const LDS_SPELLINGS = [
  [/Shearjashub/g, 'Shear-jashub'],
  [/Mahershalalhashbaz/g, 'Maher-shalal-hash-baz'],
  [/\bvail(s?)\b/g, 'veil$1'],
  [/\bday time\b/g, 'daytime'],
  [/standard-bearer/g, 'standardbearer'],
  [/Beerelim/g, 'Beer-elim'],
  [/Kirhareseth/g, 'Kir-hareseth'],
  [/Kirharesh\b/g, 'Kir-haresh'],
  [/\bintreated\b/g, 'entreated'],
  [/\benquire\b/g, 'inquire'],
  [/Esarhaddon/g, 'Esar-haddon'],
  [/\bplaister\b/g, 'plaster'],
  [/Merodachbaladan/g, 'Merodach-baladan'],
  [/\bmorter\b/g, 'mortar'],
  [/\brereward\b/g, 'rearward'],
  [/\bnoon day\b/g, 'noonday'],
  [/Hephzibah/g, 'Hephzi-bah'],
  [/\s+([?!;:,.])/g, '$1'], // stray spaces before punctuation in the source
];

const res = await fetch(url);
if (!res.ok) throw new Error(`${res.status} fetching ${url}`);
const src = await res.json();

const chapters = src.chapters.map((c) =>
  c.verses.map((v) => LDS_SPELLINGS.reduce((t, [re, s]) => t.replace(re, s), v.text.trim())),
);

await mkdir('data/kjv', { recursive: true });
const out = `data/kjv/${book.toLowerCase()}.json`;
await writeFile(out, JSON.stringify({ book, source: url, chapters }, null, 1) + '\n');
console.log(`Wrote ${out}: ${chapters.length} chapters, ${chapters.flat().length} verses`);
