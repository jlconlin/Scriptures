// Compares data/kjv/<book>.json verse by verse with the Gospel Library edition and prints every difference:
// spellings, hyphenated names, punctuation, and LORD or GOD in small capitals (the divine name) against
// Lord or God. Fix what it finds in LDS_SPELLINGS in scripts/fetch-kjv.mjs and import again.
// Usage: node scripts/check-kjv.mjs <book> [chapter numbers...]   (--fresh ignores the cached pages)
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { findBook, bookArg } from '../src/lib/books.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const argv = process.argv.slice(2);
const fresh = argv.includes('--fresh');
const { slug, rest } = bookArg(argv.filter((a) => !a.startsWith('--')));
const book = await findBook(ROOT, slug);
const only = rest.map(Number);
const kjv = JSON.parse(readFileSync(path.join(ROOT, `data/kjv/${slug}.json`), 'utf8')).chapters;
const CACHE = path.join(ROOT, '.cache/kjv');
mkdirSync(CACHE, { recursive: true });
// The Church's site gives a different page without a browser User-Agent.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';

const clean = (s) =>
  s
    .replace(/<span class="(?:small-caps|uppercase)">(.*?)<\/span>/g, (_, t) => t.toUpperCase())
    .replace(/<sup[^>]*>.*?<\/sup>/gs, '')
    .replace(/<span class="verse-number">.*?<\/span>/gs, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&#x([0-9a-f]+);/gi, (_, x) => String.fromCodePoint(parseInt(x, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/¶\s*/g, '').replace(/\s+/g, ' ').trim();
const norm = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

let diffs = 0;
for (let c = 1; c <= kjv.length; c++) {
  if (only.length && !only.includes(c)) continue;
  const file = path.join(CACHE, `${slug}-${c}.html`);
  // The site drops out for a moment now and then, so try a few times before giving a chapter up.
  for (let attempt = 0; (fresh || !existsSync(file)) && attempt < 4; attempt++) {
    try {
      const html = execFileSync('curl', ['-sL', '-m', '60', '-A', UA, `https://www.churchofjesuschrist.org/study/scriptures/${book.gospelLibrary}/${c}?lang=eng`], { maxBuffer: 64e6 });
      if (html.length > 2000) { writeFileSync(file, html); break; }
    } catch {}
    await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
  }
  if (!existsSync(file)) { diffs++; console.log(`!! ${book.name} ${c}: could not fetch the Gospel Library page`); continue; }
  const verses = existsSync(file) ? [...readFileSync(file, 'utf8').matchAll(/<p[^>]*\bid="p(\d+)"[^>]*>(.*?)<\/p>/gs)].map((m) => [+m[1], clean(m[2])]) : [];
  if (verses.length !== kjv[c - 1].length) console.log(`!! ${book.name} ${c}: ${verses.length} verses in the Gospel Library, ${kjv[c - 1].length} in the file`);
  for (const [v, theirs] of verses) {
    const a = norm(theirs).split(' '), b = norm(kjv[c - 1][v - 1] ?? '').split(' ');
    const i = a.findIndex((w, j) => w !== b[j]);
    if (i < 0 && a.length === b.length) continue;
    diffs++;
    const at = i < 0 ? a.length : i;
    console.log(`${c}:${v} Gospel Library “${a.slice(Math.max(0, at - 1), at + 3).join(' ')}” / file “${b.slice(Math.max(0, at - 1), at + 3).join(' ')}”`);
  }
}
console.log(`${diffs} verse(s) differ.`);
process.exit(diffs ? 1 : 0);
