// One-time import of a book's text from the Gospel Library, for books that are not in the King James
// Version (the Book of Mormon, the Doctrine and Covenants, the Pearl of Great Price). It writes the same
// file the build reads for every book, data/kjv/<slug>.json, with LORD and GOD in capitals where the
// Church edition prints small capitals. For a book of the Bible use scripts/fetch-kjv.mjs.
// Usage: node scripts/fetch-gl.mjs <slug> <Gospel Library path> <chapters> ["Book name"]
//   node scripts/fetch-gl.mjs moses pgp/moses 8
// Then node scripts/check-kjv.mjs <slug> reads the pages again and should report no difference.
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
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
const extra = {};
for (let c = 1; c <= Number(count); c++) {
  const url = `https://www.churchofjesuschrist.org/study/scriptures/${glPath}/${c}?lang=eng`;
  let verses = [];
  // The site drops out for a moment now and then, so try a few times before giving a chapter up.
  for (let attempt = 0; !verses.length && attempt < 4; attempt++) {
    try {
      const html = execFileSync('curl', ['-sL', '-m', '60', '-A', UA, url], { maxBuffer: 64e6 }).toString();
      // A numbered verse has class="verse". Other numbered paragraphs (Oliver Cowdery's account after
      // Joseph Smith—History 1:75, the signature under the Articles of Faith) are not verses: they are kept apart.
      const paras = [...html.matchAll(/<p([^>]*\bid="p(\d+)"[^>]*)>(.*?)<\/p>/gs)];
      verses = paras.filter((m) => /\bclass="[^"]*\bverse\b/.test(m[1])).map((m, i) => [i + 1, clean(m[3])]);
      extra[c] = [];
      let before = 0;
      for (const m of paras) {
        if (/\bclass="[^"]*\bverse\b/.test(m[1])) before++;
        else extra[c].push({ after: before, text: clean(m[3]) });
      }
    } catch {}
    if (!verses.length) await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
  }
  if (!verses.length) throw new Error(`No verses read from ${url}`);
  chapters.push(verses.map(([, text]) => text));
}

// data/kjv/<slug>.edition.json lists where a public-domain edition's wording differs from the current one; the site
// prints the older wording (author, 2026-10-06), so each change must find its words in its verse.
const editionFile = `data/kjv/${slug}.edition.json`;
if (existsSync(editionFile)) {
  const { changes } = JSON.parse(await readFile(editionFile, 'utf8'));
  for (const ch of changes) {
    // “1:75+” is a paragraph after verse 75 that is not a verse (Oliver Cowdery's account, from the 1902 edition).
    if (ch.ref.endsWith('+')) {
      const [c, v] = ch.ref.slice(0, -1).split(':').map(Number);
      const para = extra[c]?.find((x) => x.after === v && x.text.includes(ch.current));
      if (!para) throw new Error(`${editionFile}: “${ch.current}” is not in a paragraph after ${ch.ref.slice(0, -1)}`);
      para.text = para.text.replace(ch.current, ch.edition);
      continue;
    }
    const [c, v] = ch.ref.split(':').map(Number);
    if (!chapters[c - 1]?.[v - 1]?.includes(ch.current)) throw new Error(`${editionFile}: “${ch.current}” is not in ${ch.ref}`);
    chapters[c - 1][v - 1] = chapters[c - 1][v - 1].replace(ch.current, ch.edition);
  }
  console.log(`Applied ${changes.length} reading(s) from ${editionFile}`);
}

await mkdir('data/kjv', { recursive: true });
// Paragraphs of the chapter that are not verses, with the verse each follows: data/kjv/<slug>.extra.json.
const extras = Object.fromEntries(Object.entries(extra).filter(([, list]) => list.length));
if (Object.keys(extras).length) {
  await writeFile(`data/kjv/${slug}.extra.json`, JSON.stringify(extras, null, 1));
  console.log(`Wrote data/kjv/${slug}.extra.json: ${Object.values(extras).flat().length} paragraph(s) that are not verses`);
}
const bookName = name ?? slug[0].toUpperCase() + slug.slice(1);
await writeFile(`data/kjv/${slug}.json`, JSON.stringify({ book: bookName, source: `https://www.churchofjesuschrist.org/study/scriptures/${glPath}?lang=eng`, chapters }));
console.log(`Wrote data/kjv/${slug}.json: ${chapters.length} chapters, ${chapters.reduce((n, c) => n + c.length, 0)} verses`);
