// Reading the Greek text of a New Testament book: Maurice Robinson's Textus Receptus (the Greek text behind the King James Version),
// with Strong's numbers and parsing codes, kept in the shared page cache (src/lib/pages.mjs). Shared by scripts/greek.mjs (a verse's words,
// or where a word occurs) and scripts/occurrences.mjs (--greek).
//
// TEXT   The Textus Receptus as Robinson edited it, from https://github.com/byztxt/greektext-textus-receptus (parsed/*.UTR).
//        License: Public Domain (the repository's README: "Public Domain. Copy freely."). Where the file gives two readings, “| A | B |”,
//        A is Stephanus 1550 and B is Scrivener 1894 (the repository's own identification, from comparison with the printed editions).
//        The King James translators read Stephanus (1550), Beza (1598) and the Complutensian/Erasmian family; Scrivener's 1894 text
//        reconstructs the Greek that underlies the King James Version. So the text here can differ from what the translators read
//        where Beza and Stephanus differ, and in the few verses where the King James follows the Latin Vulgate or Erasmus's own
//        wording (1 John 5:7–8 and Revelation 22:19 are well-known places). Counts and verses use Scrivener's reading unless Stephanus is asked for.
//        The file carries no accents or breathings (Robinson's transliteration, “logov”), so the Greek is printed unaccented.
// LEMMAS The Robinson file has none; the lemma printed is the headword of the word's Strong's entry, from Open Scriptures' Strong's Greek
//        dictionary (https://github.com/openscriptures/strongs, CC BY-SA 3.0, a digitisation of Strong's 1890 concordance, itself in the public domain). Fetched at run time, not copied here.
// VERSES The file numbers verses as the King James Version does (checked against data/kjv/ for the four Gospels).
import { fetchPage } from './pages.mjs';
import { parseRef } from './refs.mjs';

export const GREEK_NOTE = 'Textus Receptus, Robinson edition, public domain; where the file gives two readings, Scrivener 1894 and Stephanus 1550; Strong\'s numbers; verse numbers are the King James Version\'s';
const BASE = 'https://raw.githubusercontent.com/byztxt/greektext-textus-receptus/master/parsed';
const DICT = 'https://raw.githubusercontent.com/openscriptures/strongs/master/greek/strongs-greek-dictionary.js';

// refs.mjs slug -> [name printed, file in the repository]
export const BOOKS = {
  matt: ['Matthew', 'MT'], mark: ['Mark', 'MR'], luke: ['Luke', 'LU'], john: ['John', 'JOH'], acts: ['Acts', 'AC'], rom: ['Romans', 'RO'],
  '1-cor': ['1 Corinthians', '1CO'], '2-cor': ['2 Corinthians', '2CO'], gal: ['Galatians', 'GA'], eph: ['Ephesians', 'EPH'], philip: ['Philippians', 'PHP'],
  col: ['Colossians', 'COL'], '1-thes': ['1 Thessalonians', '1TH'], '2-thes': ['2 Thessalonians', '2TH'], '1-tim': ['1 Timothy', '1TI'], '2-tim': ['2 Timothy', '2TI'],
  titus: ['Titus', 'TIT'], philem: ['Philemon', 'PHM'], heb: ['Hebrews', 'HEB'], james: ['James', 'JAS'], '1-pet': ['1 Peter', '1PE'], '2-pet': ['2 Peter', '2PE'],
  '1-jn': ['1 John', '1JO'], '2-jn': ['2 John', '2JO'], '3-jn': ['3 John', '3JO'], jude: ['Jude', 'JUDE'], rev: ['Revelation', 'RE'],
};

/** The book's slug (the refs.mjs one: matt, 1-cor) for a name or abbreviation (matthew, matt, 1 cor, rev) or its directory under content/; null if it is not a New Testament book. */
export function greekSlug(book) {
  const ref = parseRef(`${String(book).replace(/-/g, ' ')} 1`);
  return ref && ref.vol === 'nt' && BOOKS[ref.slug] ? ref.slug : null;
}

const BETA = { a: 'α', b: 'β', g: 'γ', d: 'δ', e: 'ε', z: 'ζ', h: 'η', q: 'θ', i: 'ι', k: 'κ', l: 'λ', m: 'μ', n: 'ν', x: 'ξ', o: 'ο', p: 'π', r: 'ρ', s: 'σ', v: 'ς', t: 'τ', u: 'υ', f: 'φ', c: 'χ', y: 'ψ', w: 'ω' };
/** Robinson's letters (“logov”) as Greek (λογος), unaccented; anything it does not know is left as it is. */
export const toGreek = (s) => [...s.toLowerCase()].map((c) => BETA[c] ?? c).join('');

const isTense = (n) => +n >= 5624 && +n <= 5800; // Robinson's second number, the Strong's-style code for tense and voice of a verb (only after a Strong's number: ὠφέλιμος is G5624)

/**
 * A book's words by verse. Each word is `{ text, n, tense, morph, only }`: `n` the Strong's number(s) ('1510'; '3588 1161' if two), `morph` the parsing code
 * ('V-IAI-3S'), `only` 'stephanus' or 'scrivener' for a word in one reading only, '' for a word in both.
 */
export function parseGreek(raw) {
  const verses = [], tokens = raw.split(/\s+/).filter(Boolean);
  let verse = null, group = null, targets = [];
  const add = (w) => { verse.words.push(w); return w; };
  for (let t of tokens) {
    let m;
    if (/^\(\d+:\d+\)$/.test(t)) continue; // Robinson's note of another edition's verse number, “(17:15)”, not a word
    t = t.replace(/^\[|\]$/g, ''); // [brackets] mark words Robinson doubts; the word is read without them
    if (!t) continue;
    if ((m = t.match(/^(\d+):(\d+)$/))) { verse = { id: `${+m[1]}:${+m[2]}`, c: +m[1], v: +m[2], words: [] }; verses.push(verse); targets = []; group = null; continue; }
    if (!verse) continue;
    if (t === '|') {
      if (!group) group = { pipes: 1, side: 'stephanus', words: [] };
      else if (++group.pipes === 2) group.side = 'scrivener';
      else { targets = group.words.filter((w) => !w.n); group = null; }
      continue;
    }
    if (/^\{.*\}$/.test(t)) { for (const w of targets) w.morph = t.slice(1, -1); continue; }
    if (/^\d+$/.test(t)) {
      if (+t === 0) continue; // “0” is the file's mark for no number (Luke 2:25, “simewn 0 4826”)
      for (const w of targets) { if (w.n && isTense(t)) w.tense = t; else if (!w.n.split(' ').includes(t)) w.n = w.n ? `${w.n} ${t}` : t; }
      continue;
    }
    const w = add({ text: toGreek(t), raw: t, n: '', tense: '', morph: '', only: group ? group.side : '' });
    group?.words.push(w);
    targets = [w];
  }
  return verses;
}

/** A book's Greek text from the cache: `{ slug, name, url, verses: [{ id: '1:23', c, v, words }] }`, or `{ slug, url, error }`. */
export async function loadGreek(slug, { fresh = false } = {}) {
  const [name, file] = BOOKS[slug], url = `${BASE}/${file}.UTR`;
  const got = await fetchPage(url, { fresh, tries: 5, wait: 4000 });
  return got.error ? { slug, name, url, error: got.error } : { slug, name, url, verses: parseGreek(got.raw) };
}

/** Strong's Greek dictionary headwords: `{ url, lemma(n) }` (n like '1510'), or `{ url, error }`. */
export async function loadLemmas({ fresh = false } = {}) {
  const got = await fetchPage(DICT, { fresh, tries: 5, wait: 4000 });
  if (got.error) return { url: DICT, error: got.error };
  const a = got.raw.indexOf('var strongsGreekDictionary = ') + 'var strongsGreekDictionary = '.length, b = got.raw.lastIndexOf('}; module.exports');
  let dict;
  try { dict = JSON.parse(got.raw.slice(a, b + 1)); } catch { return { url: DICT, error: 'could not read the dictionary file' }; }
  return { url: DICT, lemma: (n) => dict[`G${n}`]?.lemma ?? '' };
}

/** Strong's number as the scripts take it (26, G26, g5368) -> '26', or null if it is not one. */
export const parseStrongs = (s) => { const m = String(s ?? '').match(/^G?(\d+)$/i); return m ? String(+m[1]) : null; };

/** The words of a verse in one reading: Scrivener's by default, or Stephanus's (`stephanus: true`). */
export const readingOf = (verse, { stephanus = false } = {}) => verse.words.filter((w) => w.only !== (stephanus ? 'scrivener' : 'stephanus'));

/** The verses that have a word (by Strong's number), with only the matching words kept: `[{ ...verse, words }]`, in the chosen reading. */
export function wordHits(verses, n, opts) {
  return verses.map((v) => ({ ...v, words: readingOf(v, opts).filter((w) => w.n.split(' ').includes(n)) })).filter((v) => v.words.length);
}
