// Hebrew lookups in the Westminster Leningrad Codex, from the Open Scriptures Hebrew Bible (morphhb), so an agent reads
// a verse or counts a word with a script instead of fetching a lexicon page and a whole book's XML. The file is fetched
// through the shared cache (src/lib/pages.mjs). Hebrew verse numbers sometimes differ from the King James Version's
// (most often in the Psalms, where a title may be verse 1, and at the ends of chapters).
// Usage: node scripts/hebrew.mjs <book> <chapter>:<verse>[-<verse>]   each word in order: the Hebrew (a slash divides a prefix or
//                                                                      suffix from the word), its Strong's number, its morphology
//                                                                      code, its lemma as written in the file, and its lexicon page
//        node scripts/hebrew.mjs <book> --word <strongs>              every verse of the book where that Strong's number occurs, with the count
//        <book> is a book's name or abbreviation (genesis, gen, 1 sam, isa) or its directory under content/.   --fresh refetches
import { fetchPage } from '../src/lib/pages.mjs';
import { parseRef } from '../src/lib/refs.mjs';

// Gospel Library book code (src/lib/refs.mjs) -> the file's name in morphhb/wlc
const FILE = {
  gen: 'Gen', ex: 'Exod', lev: 'Lev', num: 'Num', deut: 'Deut', josh: 'Josh', judg: 'Judg', ruth: 'Ruth', '1-sam': '1Sam', '2-sam': '2Sam', '1-kgs': '1Kgs', '2-kgs': '2Kgs',
  '1-chr': '1Chr', '2-chr': '2Chr', ezra: 'Ezra', neh: 'Neh', esth: 'Esth', job: 'Job', ps: 'Ps', prov: 'Prov', eccl: 'Eccl', song: 'Song', isa: 'Isa', jer: 'Jer', lam: 'Lam',
  ezek: 'Ezek', dan: 'Dan', hosea: 'Hos', joel: 'Joel', amos: 'Amos', obad: 'Obad', jonah: 'Jonah', micah: 'Mic', nahum: 'Nah', hab: 'Hab', zeph: 'Zeph', hag: 'Hag', zech: 'Zech', mal: 'Mal',
};
process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); }); // piped into head
const argv = process.argv.slice(2);
const fresh = argv.includes('--fresh');
const wordAt = argv.indexOf('--word');
const strongs = wordAt >= 0 ? (argv[wordAt + 1] ?? '').replace(/^H/i, '').toLowerCase() : null;
const rest = argv.filter((a, i) => !a.startsWith('--') && wordAt < 0 || i !== wordAt + 1);
const usage = () => { console.error('Usage: node scripts/hebrew.mjs <book> <chapter>:<verse>[-<verse>]\n       node scripts/hebrew.mjs <book> --word <strongs>'); process.exit(1); };
if (!rest.length || (wordAt >= 0 && !/^\d+[a-z]?$/.test(strongs ?? ''))) usage();

const ref = parseRef(`${rest[0]} 1`);
const file = ref && ref.vol === 'ot' ? FILE[ref.slug] : null;
if (!file) { console.error(`“${rest[0]}” is not an Old Testament book I know.`); process.exit(1); }
const url = `https://raw.githubusercontent.com/openscriptures/morphhb/master/wlc/${file}.xml`;
const got = await fetchPage(url, { fresh, tries: 5, wait: 4000 });
if (got.error) { console.error(`${got.error}: ${url}`); process.exit(1); }

// A verse's words in order. A word the scribes wrote one way and read another (ketiv and qere) comes as both.
function verses(xml) {
  const out = [];
  for (const v of xml.matchAll(/<verse osisID="([^"]+)">([\s\S]*?)<\/verse>/g)) {
    const words = [];
    let qere = false;
    for (const m of v[2].matchAll(/<w\b([^>]*)>([^<]*)<\/w>|<rdg\b([^>]*)>|<\/rdg>/g)) {
      if (m[0].startsWith('<rdg')) { qere = true; continue; }
      if (m[0] === '</rdg>') { qere = false; continue; }
      const a = Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map((x) => [x[1], x[2]]));
      const num = (a.lemma ?? '').split('/').map((p) => p.match(/^(\d+)\+?(?: ([a-z]))?$/)).find(Boolean);
      const w = { text: m[2].trim(), lemma: a.lemma ?? '', morph: a.morph ?? '', n: num?.[1] ?? '', suffix: num?.[2] ?? '', note: qere ? 'qere, the reading' : a.type === 'x-ketiv' ? 'ketiv, as written' : '' };
      w.again = qere && words.at(-1)?.note.startsWith('ketiv') && words.at(-1).n === w.n; // the reading of a word already counted as written
      words.push(w);
    }
    out.push({ id: v[1], words });
  }
  return out;
}
const all = verses(got.raw);
const name = (id) => id.replace(/^(\w+)\.(\d+)\.(\d+)$/, '$1 $2:$3');
const head = `${file} (Westminster Leningrad Codex, Open Scriptures Hebrew Bible; Hebrew verse numbers sometimes differ from the King James Version's)`;

if (strongs) {
  const want = strongs.match(/^(\d+)([a-z]?)$/);
  const hits = all.map((v) => ({ ...v, words: v.words.filter((w) => w.n === want[1] && (!want[2] || w.suffix === want[2]) && !w.again) })).filter((v) => v.words.length);
  const count = hits.reduce((n, v) => n + v.words.length, 0);
  console.log(`${head}\nH${strongs} (https://biblehub.com/hebrew/${want[1]}.htm): ${count} occurrence${count === 1 ? '' : 's'}, in ${hits.length} of the book's ${all.length} verses\n`);
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
