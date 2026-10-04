// Reading the Hebrew text of a book: the Westminster Leningrad Codex, from the Open Scriptures Hebrew Bible (morphhb), kept in the
// shared page cache (src/lib/pages.mjs). Shared by scripts/hebrew.mjs (a verse's words, or where a word occurs) and
// scripts/occurrences.mjs (--hebrew: where a word occurs, with the King James verse beside it).
// Hebrew verse numbers sometimes differ from the King James Version's (most often in the Psalms, where a title may be verse 1,
// and at the ends of chapters).
import { fetchPage } from './pages.mjs';
import { parseRef } from './refs.mjs';

// Gospel Library book code (src/lib/refs.mjs) -> the file's name in morphhb/wlc
const FILE = {
  gen: 'Gen', ex: 'Exod', lev: 'Lev', num: 'Num', deut: 'Deut', josh: 'Josh', judg: 'Judg', ruth: 'Ruth', '1-sam': '1Sam', '2-sam': '2Sam', '1-kgs': '1Kgs', '2-kgs': '2Kgs',
  '1-chr': '1Chr', '2-chr': '2Chr', ezra: 'Ezra', neh: 'Neh', esth: 'Esth', job: 'Job', ps: 'Ps', prov: 'Prov', eccl: 'Eccl', song: 'Song', isa: 'Isa', jer: 'Jer', lam: 'Lam',
  ezek: 'Ezek', dan: 'Dan', hosea: 'Hos', joel: 'Joel', amos: 'Amos', obad: 'Obad', jonah: 'Jonah', micah: 'Mic', nahum: 'Nah', hab: 'Hab', zeph: 'Zeph', hag: 'Hag', zech: 'Zech', mal: 'Mal',
};
export const WLC_NOTE = 'Hebrew verse numbers sometimes differ from the King James Version\'s';

/** The morphhb file name for a book's name or abbreviation (genesis, gen, 1 sam, isa) or its directory under content/; null if it is not an Old Testament book. */
export function wlcFile(book) {
  const ref = parseRef(`${book} 1`);
  return ref && ref.vol === 'ot' ? FILE[ref.slug] ?? null : null;
}

// A verse's words in order. A word the scribes wrote one way and read another (ketiv and qere) comes as both.
export function parseVerses(xml) {
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

/** A book's Hebrew text from the cache: `{ file, url, verses: [{ id: 'Gen.8.1', words }] }`, or `{ file, url, error }`. */
export async function loadWlc(file, { fresh = false } = {}) {
  const url = `https://raw.githubusercontent.com/openscriptures/morphhb/master/wlc/${file}.xml`;
  const got = await fetchPage(url, { fresh, tries: 5, wait: 4000 });
  return got.error ? { file, url, error: got.error } : { file, url, verses: parseVerses(got.raw) };
}

/** A verse id as the scripts print it: 'Gen.8.1' -> 'Gen 8:1'. */
export const verseName = (id) => id.replace(/^(\w+)\.(\d+)\.(\d+)$/, '$1 $2:$3');

/** Strong's number as the scripts take it (2142, H2142, 1961a) -> { n, suffix }, or null if it is not one. */
export function parseStrongs(s) {
  const m = String(s ?? '').replace(/^H/i, '').toLowerCase().match(/^(\d+)([a-z]?)$/);
  return m ? { n: m[1], suffix: m[2] } : null;
}

/** The verses of a book that have a word, with only the matching words kept: `[{ id, words }]`. */
export function wordHits(verses, { n, suffix }) {
  return verses.map((v) => ({ ...v, words: v.words.filter((w) => w.n === n && (!suffix || w.suffix === suffix) && !w.again) })).filter((v) => v.words.length);
}
