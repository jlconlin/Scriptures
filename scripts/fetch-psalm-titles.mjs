// The titles above the psalms (“A Psalm of David, when he fled from Absalom his son.”) and the Hebrew
// letters that head the stanzas of Psalm 119. The King James source that fetch-kjv.mjs imports has
// neither, so they are read from the Gospel Library edition, whose pages check-kjv.mjs keeps in
// .cache/kjv/ (a page not there is fetched). The wording is the King James Version's (public domain).
// Usage: node scripts/fetch-psalm-titles.mjs [slug]     writes data/kjv/<slug>.titles.json
//   { titles: { "3": "A Psalm of David, …" }, stanzas: { "119": { "1": { letter: "א", name: "Aleph" }, … } } }
// A title is the psalm's verse 0 on the site: a note with `ref: 0` hangs on its words (STANDARDS.md §6).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { findBook } from '../src/lib/books.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const slug = process.argv[2] ?? 'psalms';
const book = await findBook(ROOT, slug);
const count = JSON.parse(readFileSync(path.join(ROOT, `data/kjv/${slug}.json`), 'utf8')).chapters.length;
const CACHE = path.join(ROOT, '.cache/kjv');
mkdirSync(CACHE, { recursive: true });
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';

const clean = (s) =>
  s
    .replace(/<span class="(?:small-caps|uppercase)">(.*?)<\/span>/g, (_, t) => t.toUpperCase())
    .replace(/<sup[^>]*>.*?<\/sup>/gs, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&#x([0-9a-f]+);/gi, (_, x) => String.fromCodePoint(parseInt(x, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ').trim();

const titles = {}, stanzas = {};
for (let c = 1; c <= count; c++) {
  const file = path.join(CACHE, `${slug}-${c}.html`);
  if (!existsSync(file)) {
    const res = await fetch(`https://www.churchofjesuschrist.org/study/scriptures/${book.gospelLibrary}/${c}?lang=eng`, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`${book.name} ${c}: HTTP ${res.status}`);
    writeFileSync(file, await res.text());
  }
  const html = readFileSync(file, 'utf8').replace(/\\"/g, '"').replace(/\\n/g, '\n');
  const intro = html.match(/<p class="intro"[^>]*>(.*?)<\/p>/s);
  if (intro) titles[c] = clean(intro[1]);
  // A stanza heading stands before the verse it opens: <p class="usx-qa">…letter… …name…</p> … <p class="verse" … id="pN">
  for (const m of html.matchAll(/<p class="usx-qa"[^>]*><span class="language"[^>]*>(.*?)<\/span>\s*<span class="translit"[^>]*>(.*?)<\/span><\/p>(?:(?!<p class="verse").)*?<p class="verse"[^>]*id="p(\d+)"/gs)) {
    (stanzas[c] ??= {})[m[3]] = { letter: clean(m[1]), name: clean(m[2]) };
  }
}
const out = path.join(ROOT, `data/kjv/${slug}.titles.json`);
writeFileSync(out, JSON.stringify({ book: book.name, source: 'The Gospel Library edition of the King James Version (the titles and stanza letters are the King James Version’s)', titles, stanzas }, null, 1) + '\n');
console.log(`Wrote ${path.relative(ROOT, out)}: ${Object.keys(titles).length} titles; stanza letters in ${Object.entries(stanzas).map(([c, s]) => `${book.name} ${c} (${Object.keys(s).length})`).join(', ') || 'no chapter'}`);
