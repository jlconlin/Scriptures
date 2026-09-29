// One-time import of the public-domain King James Version text.
// Source: https://github.com/aruljohn/Bible-kjv (KJV 1769, public domain).
// Usage: node scripts/fetch-kjv.mjs Isaiah
import { writeFile, mkdir } from 'node:fs/promises';

const book = process.argv[2] ?? 'Isaiah';
const url = `https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/${book}.json`;

// Spellings in the Latter-day Saint edition of the KJV that differ from the source file.
const LDS_SPELLINGS = [
  [/Shearjashub/g, 'Shear-jashub'],
  [/Mahershalalhashbaz/g, 'Maher-shalal-hash-baz'],
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
