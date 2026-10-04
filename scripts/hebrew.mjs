// Hebrew lookups in the Westminster Leningrad Codex, from the Open Scriptures Hebrew Bible (morphhb), so an agent reads
// a verse or counts a word with a script instead of fetching a lexicon page and a whole book's XML. The file is fetched
// through the shared cache (src/lib/pages.mjs). Hebrew verse numbers sometimes differ from the King James Version's
// (most often in the Psalms, where a title may be verse 1, and at the ends of chapters).
// Usage: node scripts/hebrew.mjs <book> <chapter>:<verse>[-<verse>]   each word in order: the Hebrew (a slash divides a prefix or
//                                                                      suffix from the word), its Strong's number, its morphology
//                                                                      code, its lemma as written in the file, and its lexicon page
//        node scripts/hebrew.mjs <book> --word <strongs>              every verse of the book where that Strong's number occurs, with the count
//        <book> is a book's name or abbreviation (genesis, gen, 1 sam, isa) or its directory under content/.   --fresh refetches
import { wlcFile, loadWlc, verseName, parseStrongs, wordHits, WLC_NOTE } from '../src/lib/hebrew.mjs';

process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); }); // piped into head
const argv = process.argv.slice(2);
const fresh = argv.includes('--fresh');
const wordAt = argv.indexOf('--word');
const strongs = wordAt >= 0 ? (argv[wordAt + 1] ?? '').replace(/^H/i, '').toLowerCase() : null;
const rest = argv.filter((a, i) => !a.startsWith('--') && wordAt < 0 || i !== wordAt + 1);
const usage = () => { console.error('Usage: node scripts/hebrew.mjs <book> <chapter>:<verse>[-<verse>]\n       node scripts/hebrew.mjs <book> --word <strongs>'); process.exit(1); };
if (!rest.length || (wordAt >= 0 && !parseStrongs(strongs))) usage();

const file = wlcFile(rest[0]);
if (!file) { console.error(`“${rest[0]}” is not an Old Testament book I know.`); process.exit(1); }
const wlc = await loadWlc(file, { fresh });
if (wlc.error) { console.error(`${wlc.error}: ${wlc.url}`); process.exit(1); }
const all = wlc.verses, name = verseName;
const head = `${file} (Westminster Leningrad Codex, Open Scriptures Hebrew Bible; ${WLC_NOTE})`;

if (strongs) {
  const want = parseStrongs(strongs);
  const hits = wordHits(all, want);
  const count = hits.reduce((n, v) => n + v.words.length, 0);
  console.log(`${head}\nH${strongs} (https://biblehub.com/hebrew/${want.n}.htm): ${count} occurrence${count === 1 ? '' : 's'}, in ${hits.length} of the book's ${all.length} verses\n`);
  for (const v of hits) console.log(`${name(v.id)}  ${v.words.map((w) => w.text + (w.note ? ` (${w.note})` : '')).join('  ')}`);
  if (!hits.length) console.log('(none: a number the file does not use, or a word that carries another number)');
} else {
  const m = (rest[1] ?? '').match(/^(\d+):(\d+)(?:[–-](\d+))?$/);
  if (!m) usage();
  const [c, v1, v2] = [+m[1], +m[2], +(m[3] ?? m[2])];
  const picked = all.filter((v) => { const p = v.id.split('.'); return +p[1] === c && +p[2] >= v1 && +p[2] <= v2; });
  if (!picked.length) { console.error(`${file} ${c}:${v1}${v2 > v1 ? `-${v2}` : ''} is not in the file (it has ${all.filter((v) => +v.id.split('.')[1] === c).length} verses in chapter ${c}).`); process.exit(1); }
  console.log(`${head}\nMorphology codes: https://hb.openscriptures.org/parsing/HebrewMorphologyCodes.html\n`);
  for (const v of picked) {
    console.log(name(v.id));
    v.words.forEach((w, i) => console.log(`  ${String(i + 1).padStart(2)}  ${w.text}  ${w.n ? `H${w.n}${w.suffix}` : '-'}  ${w.morph}  lemma ${w.lemma}${w.n ? `  https://biblehub.com/hebrew/${w.n}.htm` : ''}${w.note ? `  (${w.note})` : ''}`));
    console.log();
  }
}
