// Fetch the Book of Mormon’s quotations of Isaiah from the Gospel Library and keep
// only the verses whose wording differs from the KJV. The result powers the
// “Book of Mormon reading” markers on chapter pages.
// Isaiah only: the chapter map below is Isaiah's. Output: data/bom/isaiah-parallels.json. The build
// reads data/bom/<book slug>-parallels.json when a book has one; other books need no such file.
// Usage: node scripts/fetch-bom-parallels.mjs
import { readFile, writeFile } from 'node:fs/promises';

// Isaiah chapter -> Book of Mormon passage(s). `from`/`to` are Isaiah verses; `start` is the first BoM verse.
const BOOK = 'isaiah';
const MAP = [
  ...Array.from({ length: 13 }, (_, i) => ({ isa: i + 2, ref: '2-ne', ch: i + 12, label: `2 Ne. ${i + 12}` })),
  { isa: 48, ref: '1-ne', ch: 20, label: '1 Ne. 20' },
  { isa: 49, ref: '1-ne', ch: 21, label: '1 Ne. 21' },
  { isa: 50, ref: '2-ne', ch: 7, label: '2 Ne. 7' },
  { isa: 51, ref: '2-ne', ch: 8, label: '2 Ne. 8' },
  { isa: 52, ref: '2-ne', ch: 8, label: '2 Ne. 8', from: 1, to: 2, start: 24 },
  { isa: 52, ref: 'mosiah', ch: 12, label: 'Mosiah 12', from: 7, to: 10, start: 21 },
  { isa: 53, ref: 'mosiah', ch: 14, label: 'Mosiah 14' },
  { isa: 54, ref: '3-ne', ch: 22, label: '3 Ne. 22' },
];

const kjv = JSON.parse(await readFile(new URL(`../data/kjv/${BOOK}.json`, import.meta.url))).chapters;

const decode = (s) =>
  s
    .replace(/<sup[^>]*>.*?<\/sup>/gs, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&#x27;|&#39;/g, '’')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;| /g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const cache = new Map();
async function chapterVerses(book, ch) {
  const key = `${book}/${ch}`;
  if (cache.has(key)) return cache.get(key);
  const url = `https://www.churchofjesuschrist.org/study/scriptures/bofm/${book}/${ch}?lang=eng`;
  const html = await (await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (study site build script)' } })).text();
  const verses = {};
  for (const m of html.matchAll(/<p[^>]*\bid="p(\d+)"[^>]*>(.*?)<\/p>/gs)) {
    verses[m[1]] = decode(m[2]).replace(/^\d+\s+/, '');
  }
  cache.set(key, verses);
  await new Promise((r) => setTimeout(r, 400)); // be polite
  return verses;
}

export const words = (s) =>
  s
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

const out = {};
for (const m of MAP) {
  const bom = await chapterVerses(m.ref, m.ch);
  const from = m.from ?? 1;
  const to = m.to ?? kjv[m.isa - 1].length;
  const start = m.start ?? 1;
  let differ = 0;
  for (let v = from; v <= to; v++) {
    const bv = bom[start + (v - from)];
    if (!bv) {
      console.warn(`missing ${m.label}:${start + (v - from)} for Isaiah ${m.isa}:${v}`);
      continue;
    }
    if (words(bv).join(' ') === words(kjv[m.isa - 1][v - 1]).join(' ')) continue;
    out[m.isa] ??= { passages: [], verses: {} };
    out[m.isa].verses[v] = { ref: `${m.label}:${start + (v - from)}`, text: bv };
    differ++;
  }
  out[m.isa] ??= { passages: [], verses: {} };
  out[m.isa].passages.push(m.from ? `${m.label}:${start}–${start + (to - from)}` : m.label);
  console.log(`Isaiah ${m.isa} ↔ ${m.label}: ${differ} verse(s) differ`);
}

await writeFile(
  new URL(`../data/bom/${BOOK}-parallels.json`, import.meta.url),
  JSON.stringify(
    {
      note: 'Book of Mormon verses (current edition, Gospel Library) whose wording differs from the KJV text of Isaiah. Quoted for non-commercial study.',
      chapters: out,
    },
    null,
    1,
  ) + '\n',
);
