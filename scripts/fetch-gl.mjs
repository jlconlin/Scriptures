// One-time import of a book's text from the Gospel Library, for books that are not in the King James
// Version (the Book of Mormon, the Doctrine and Covenants, the Pearl of Great Price). It writes the same
// file the build reads for every book, data/kjv/<slug>.json, with LORD and GOD in capitals where the
// Church edition prints small capitals. For a book of the Bible use scripts/fetch-kjv.mjs.
// Usage: node scripts/fetch-gl.mjs <slug> <Gospel Library path> <chapters> ["Book name"]
//   node scripts/fetch-gl.mjs moses pgp/moses 8
// Then node scripts/check-kjv.mjs <slug> reads the pages again and should report no difference.
import { writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const [slug, glPath, count, name] = process.argv.slice(2);
if (!slug || !glPath || !Number(count)) throw new Error('Usage: node scripts/fetch-gl.mjs <slug> <Gospel Library path> <chapters> ["Book name"]');
// The Church's site gives a different page without a browser User-Agent.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';

// The same reading of a verse as scripts/check-kjv.mjs.
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

const chapters = [];
for (let c = 1; c <= Number(count); c++) {
  const url = `https://www.churchofjesuschrist.org/study/scriptures/${glPath}/${c}?lang=eng`;
  let verses = [];
  // The site drops out for a moment now and then, so try a few times before giving a chapter up.
  for (let attempt = 0; !verses.length && attempt < 4; attempt++) {
    try {
      const html = execFileSync('curl', ['-sL', '-m', '60', '-A', UA, url], { maxBuffer: 64e6 }).toString();
      verses = [...html.matchAll(/<p[^>]*\bid="p(\d+)"[^>]*>(.*?)<\/p>/gs)].map((m) => [+m[1], clean(m[2])]);
    } catch {}
    if (!verses.length) await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
  }
  if (!verses.length) throw new Error(`No verses read from ${url}`);
  verses.forEach(([n], i) => { if (n !== i + 1) throw new Error(`${url}: verse ${i + 1} is numbered ${n}`); });
  chapters.push(verses.map(([, text]) => text));
}

await mkdir('data/kjv', { recursive: true });
const bookName = name ?? slug[0].toUpperCase() + slug.slice(1);
await writeFile(`data/kjv/${slug}.json`, JSON.stringify({ book: bookName, source: `https://www.churchofjesuschrist.org/study/scriptures/${glPath}?lang=eng`, chapters }));
console.log(`Wrote data/kjv/${slug}.json: ${chapters.length} chapters, ${chapters.reduce((n, c) => n + c.length, 0)} verses`);
