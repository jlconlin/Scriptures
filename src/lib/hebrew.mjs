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
export const WLC_NOTE = 'verse numbers are the King James Version\'s, with the Hebrew\'s beside them where they differ (the Open Scriptures verse map)';

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

// ---------- King James and Hebrew verse numbers ----------
// The King James Version's numbering is what the site and its agents use; the Hebrew text's differs in whole chapters (Malachi 4 is Hebrew
// 3:19–24, Joel 2:28–32 is Hebrew 3:1–5 and Joel 3 is Hebrew 4), at the ends of chapters, and in the Psalms, where a title is verse 1 or
// 2 in the Hebrew and has no number in the King James. The table is the Open Scriptures Hebrew Bible's own (morphhb/wlc/VerseMap.xml, 1,978
// verses of the 39 books, “based on the notes to the WLC”), from the same repository as the text.

/** The verse map: `{ toKjv: Map(Hebrew id -> [{ id, partial }]), toHebrew: Map(KJV id -> [{ id, partial }]) }`, or `{ error }`. A partial verse is half of one. */
export async function loadVerseMap({ fresh = false } = {}) {
  const url = 'https://raw.githubusercontent.com/openscriptures/morphhb/master/wlc/VerseMap.xml';
  const got = await fetchPage(url, { fresh, tries: 5, wait: 4000 });
  if (got.error) return { url, error: got.error };
  const toKjv = new Map(), toHebrew = new Map();
  for (const m of got.raw.matchAll(/<verse wlc="([^"]+)" kjv="([^"]+)" type="([a-z]+)"\s*\/>/g)) {
    const [w, k] = [m[1], m[2]].map((x) => x.replace(/!.*$/, ''));
    const partial = m[3] === 'partial' || /!/.test(m[1] + m[2]);
    (toKjv.get(w) ?? toKjv.set(w, []).get(w)).push({ id: k, partial });
    (toHebrew.get(k) ?? toHebrew.set(k, []).get(k)).push({ id: w, partial });
  }
  return { url, toKjv, toHebrew };
}

/** The King James verses of a Hebrew verse id ('Mal.3.23' -> [{ id: 'Mal.4.5' }]; two for a verse that is split); [{ title: true }] for a psalm's title, which the King James leaves unnumbered. */
export function hebrewToKjv(map, id) {
  if (map.toKjv.has(id)) return map.toKjv.get(id);
  return [map.toHebrew.has(id) ? { title: true } : { id }]; // a King James verse of the same number that something else fills means this is a title
}
/** The Hebrew verses (ids present in `have`, a Set) of a King James verse id: `[{ id, partial }]`, empty if the file has none. */
export function kjvToHebrew(map, have, id) {
  const m = map.toHebrew.get(id) ?? (have.has(id) ? [{ id }] : []);
  return m.filter((x) => have.has(x.id));
}
/** The Hebrew verse that is a psalm's title, for a King James chapter whose verse 1 is the Hebrew verse 2 ('Ps.3' -> 'Ps.3.1'), or null. */
export function titleOf(map, have, book, chapter) {
  const t = `${book}.${chapter}.1`;
  return have.has(t) && map.toHebrew.has(t) && !map.toKjv.has(t) ? t : null;
}
/** Where a King James chapter is in the Hebrew, for a plain warning: 'KJV Mal 4 is Hebrew Mal 3:19–24', or '' if the chapter is numbered alike. */
export function chapterNote(map, book, chapter) {
  const rows = [...map.toHebrew].filter(([k]) => k.startsWith(`${book}.${chapter}.`)).flatMap(([, v]) => v.map((x) => x.id.split('.').map(Number)));
  if (!rows.length) return '';
  const by = new Map();
  for (const [, c, v] of rows) (by.get(c) ?? by.set(c, []).get(c)).push(v);
  return `the King James chapter ${chapter} is, in the Hebrew, ${[...by].map(([c, vs]) => `${book} ${c}:${Math.min(...vs)}${Math.max(...vs) > Math.min(...vs) ? `–${Math.max(...vs)}` : ''}`).join(' and ')} (verse map)`;
}
/** 'Mal.4.5' -> 'Mal 4:5', with the Hebrew beside it when it differs: 'Mal 4:5 (Hebrew 3:23)'. */
export const refText = (kjvId, hebrewIds = []) => {
  const h = hebrewIds.filter((x) => x && x !== kjvId);
  return `${verseName(kjvId)}${h.length ? ` (Hebrew ${h.map((x) => verseName(x).replace(/^\w+ /, '')).join(', ')})` : ''}`;
};

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
