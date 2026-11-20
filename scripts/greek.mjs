// Greek lookups in the Textus Receptus (the Greek behind the King James Version), from Maurice Robinson's text with Strong's numbers and
// parsing (public domain; https://github.com/byztxt/greektext-textus-receptus), so an agent reads a verse or counts a word with a script
// instead of fetching a lexicon page. Files are fetched through the shared cache (src/lib/pages.mjs). The text is the Textus Receptus
// (Scrivener 1894, with Stephanus 1550 where Robinson's file gives two readings); the King James translators read Stephanus and Beza, so it can
// differ from what they read in a few places (1 John 5:7–8, Revelation 22:19 and the like). Verse numbers are the King James Version's. The file has
// no accents or breathings, so the Greek is printed without them. The lemma is the headword of the word's Strong's entry (Open Scriptures, CC BY-SA 3.0).
// Usage: node scripts/greek.mjs <book> <chapter>:<verse>[-<verse>]   each word in order: the Greek, its Strong's number, its parsing code, its lemma,
//                                                                    and its lexicon page (Thayer's lexicon is on it)
//        node scripts/greek.mjs <book> --word <strongs>              every verse of the book where that Strong's number occurs, with the count
//        node scripts/greek.mjs --nt --word <strongs>                the count across the whole New Testament, book by book (no verse list)
//        <book> is a book's name or abbreviation (matthew, matt, 1 cor, rev) or its directory under content/.   --fresh refetches
//        --stephanus  read Stephanus 1550 where the text gives two readings (Scrivener 1894 is the default)
import { greekSlug, BOOKS, loadGreek, loadLemmas, parseStrongs, readingOf, wordHits, GREEK_NOTE } from '../src/lib/greek.mjs';

process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); }); // piped into head
const argv = process.argv.slice(2);
const fresh = argv.includes('--fresh'), stephanus = argv.includes('--stephanus'), nt = argv.includes('--nt');
const wordAt = argv.indexOf('--word');
const want = wordAt >= 0 ? parseStrongs(argv[wordAt + 1]) : null;
const rest = argv.filter((a, i) => !a.startsWith('--') && !(wordAt >= 0 && i === wordAt + 1));
const usage = () => { console.error('Usage: node scripts/greek.mjs <book> <chapter>:<verse>[-<verse>] [--stephanus]\n       node scripts/greek.mjs <book> --word <strongs>\n       node scripts/greek.mjs --nt --word <strongs>'); process.exit(1); };
if (wordAt >= 0 && !want) usage();
if (nt && wordAt < 0) usage();
const opts = { stephanus }, edition = stephanus ? 'Stephanus 1550' : 'Scrivener 1894';
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const link = (n) => `https://biblehub.com/greek/${n}.htm`;

const lem = await loadLemmas({ fresh });
if (lem.error) console.error(`WARNING: no lemmas (${lem.error}: ${lem.url}); the lemma column will be empty.`);
const lemma = (n) => lem.lemma?.(n) || '';

if (nt) {
  let total = 0, versesTotal = 0;
  console.log(`New Testament (${GREEK_NOTE}; reading used: ${edition})\nG${want} ${lemma(want)} (${link(want)})\n`);
  for (const slug of Object.keys(BOOKS)) {
    const g = await loadGreek(slug, { fresh });
    if (g.error) { console.error(`${g.error}: ${g.url}`); process.exit(1); }
    const hits = wordHits(g.verses, want, opts), count = hits.reduce((n, v) => n + v.words.length, 0);
    total += count; versesTotal += hits.length;
    if (count) console.log(`${g.name.padEnd(16)} ${String(count).padStart(4)}  in ${plural(hits.length, 'verse')}`);
  }
  console.log(`\nTotal: ${plural(total, 'occurrence')} in ${plural(versesTotal, 'verse')}.`);
  process.exit(0);
}

if (!rest.length) usage();
if (/^[123]$/.test(rest[0]) && rest[1] && !/^\d+:/.test(rest[1])) rest.splice(0, 2, `${rest[0]} ${rest[1]}`); // 1 john 5:7 without quotes
const slug = greekSlug(rest[0]);
if (!slug) { console.error(`“${rest[0]}” is not a New Testament book I know.`); process.exit(1); }
const g = await loadGreek(slug, { fresh });
if (g.error) { console.error(`${g.error}: ${g.url}`); process.exit(1); }
const head = `${g.name} (${GREEK_NOTE}; reading used: ${edition})`;

if (want) {
  const hits = wordHits(g.verses, want, opts), count = hits.reduce((n, v) => n + v.words.length, 0);
  console.log(`${head}\nG${want} ${lemma(want)} (${link(want)}): ${plural(count, 'occurrence')}, in ${plural(hits.length, 'verse')} of the book's ${g.verses.length}\n`);
  for (const v of hits) console.log(`${g.name} ${v.id}  ${v.words.map((w) => w.text + (w.only ? ` (${w.only} only)` : '')).join('  ')}`);
  if (!hits.length) console.log('(none: a number the file does not use, or a word that carries another number)');
} else {
  const m = (rest[1] ?? '').match(/^(\d+):(\d+)(?:[–-](\d+))?$/);
  if (!m) usage();
  const [c, v1, v2] = [+m[1], +m[2], +(m[3] ?? m[2])];
  const picked = g.verses.filter((v) => v.c === c && v.v >= v1 && v.v <= v2);
  for (let k = v1; k <= v2; k++) if (!picked.some((v) => v.v === k)) console.error(`WARNING: ${g.name} ${c}:${k} is not in the Greek file (chapter ${c} has ${g.verses.filter((v) => v.c === c).length} verses there).`);
  if (!picked.length) process.exit(1);
  console.log(`${head}\nParsing codes (Robinson): https://github.com/byztxt/greektext-textus-receptus (the README); a word marked “only” is in one edition's reading, not the other's\n`);
  for (const v of picked) {
    console.log(`${g.name} ${v.id}`);
    v.words.forEach((w, i) => {
      const flag = w.only && ((w.only === 'stephanus') === stephanus ? `  (${w.only} only)` : `  (${w.only} only; not in the ${edition} reading)`);
      const first = w.n.split(' ')[0];
      console.log(`  ${String(i + 1).padStart(2)}  ${w.text}  ${w.n ? w.n.split(' ').map((n) => `G${n}`).join('+') : '-'}  ${w.morph || '-'}  lemma ${w.n ? lemma(first) : '-'}${w.n ? `  ${link(first)}` : ''}${flag ?? ''}`);
    });
    console.log();
  }
}
