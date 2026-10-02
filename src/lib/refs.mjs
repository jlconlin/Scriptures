// Scripture reference parsing and linking.
// In content, write references as [[2 Ne. 25:4]], [[Isa. 53:4–6]], [[Matt. 1:23; Luke 4:18]],
// or with custom display text: [[Mosiah 14|Abinadi’s reading]].
// References into chapters this site covers link internally; everything else links to
// the Gospel Library on churchofjesuschrist.org.

import { LIBRARY } from '../site.mjs';

const CHURCH = 'https://www.churchofjesuschrist.org/study/scriptures';

// display abbreviation (normalized: lowercase, no periods/spaces) -> [volume, slug]
const BOOKS = {};
// Each volume's books in canonical order (Gospel Library slugs), for ordering books on the site.
export const BOOK_ORDER = {};
const add = (vol, pairs) =>
  pairs.forEach(([keys, slug]) => {
    (BOOK_ORDER[vol] ??= []).includes(slug) || BOOK_ORDER[vol].push(slug);
    keys.split('|').forEach((k) => (BOOKS[k] = [vol, slug]));
  });

add('ot', [
  ['gen|genesis', 'gen'], ['ex|exod|exodus', 'ex'], ['lev|leviticus', 'lev'], ['num|numbers', 'num'],
  ['deut|deuteronomy', 'deut'], ['josh|joshua', 'josh'], ['judg|judges', 'judg'], ['ruth', 'ruth'],
  ['1sam|1samuel', '1-sam'], ['2sam|2samuel', '2-sam'], ['1kgs|1kings', '1-kgs'], ['2kgs|2kings', '2-kgs'],
  ['1chr|1chronicles', '1-chr'], ['2chr|2chronicles', '2-chr'], ['ezra', 'ezra'], ['neh|nehemiah', 'neh'],
  ['esth|esther', 'esth'], ['job', 'job'], ['ps|psalm|psalms', 'ps'], ['prov|proverbs', 'prov'],
  ['eccl|ecclesiastes', 'eccl'], ['song|songofsolomon', 'song'], ['isa|isaiah', 'isa'], ['jer|jeremiah', 'jer'],
  ['lam|lamentations', 'lam'], ['ezek|ezekiel', 'ezek'], ['dan|daniel', 'dan'], ['hosea', 'hosea'],
  ['joel', 'joel'], ['amos', 'amos'], ['obad|obadiah', 'obad'], ['jonah', 'jonah'], ['micah', 'micah'],
  ['nahum', 'nahum'], ['hab|habakkuk', 'hab'], ['zeph|zephaniah', 'zeph'], ['hag|haggai', 'hag'],
  ['zech|zechariah', 'zech'], ['mal|malachi', 'mal'],
]);
add('nt', [
  ['matt|matthew', 'matt'], ['mark', 'mark'], ['luke', 'luke'], ['john', 'john'], ['acts', 'acts'],
  ['rom|romans', 'rom'], ['1cor|1corinthians', '1-cor'], ['2cor|2corinthians', '2-cor'], ['gal|galatians', 'gal'],
  ['eph|ephesians', 'eph'], ['philip|philippians', 'philip'], ['col|colossians', 'col'],
  ['1thes|1thess|1thessalonians', '1-thes'], ['2thes|2thess|2thessalonians', '2-thes'],
  ['1tim|1timothy', '1-tim'], ['2tim|2timothy', '2-tim'], ['titus', 'titus'], ['philem|philemon', 'philem'],
  ['heb|hebrews', 'heb'], ['james', 'james'], ['1pet|1peter', '1-pet'], ['2pet|2peter', '2-pet'],
  ['1jn|1john', '1-jn'], ['2jn|2john', '2-jn'], ['3jn|3john', '3-jn'], ['jude', 'jude'], ['rev|revelation', 'rev'],
]);
add('bofm', [
  ['1ne|1nephi', '1-ne'], ['2ne|2nephi', '2-ne'], ['jacob', 'jacob'], ['enos', 'enos'], ['jarom', 'jarom'],
  ['omni', 'omni'], ['wofm|wordsofmormon', 'w-of-m'], ['mosiah', 'mosiah'], ['alma', 'alma'],
  ['hel|helaman', 'hel'], ['3ne|3nephi', '3-ne'], ['4ne|4nephi', '4-ne'], ['morm|mormon', 'morm'],
  ['ether', 'ether'], ['moro|moroni', 'moro'],
]);
add('dc-testament', [['d&c|dc|doctrineandcovenants', 'dc'], ['od', 'od']]);
add('pgp', [
  ['moses', 'moses'], ['abr|abraham', 'abr'], ['js—m|js-m|jsm', 'js-m'], ['js—h|js-h|jsh', 'js-h'],
  ['aofF|aoff|articlesoffaith', 'a-of-f'],
]);
add('jst', [['jst,isa|jstisa', 'jst-isa'], ['jst,gen|jstgen', 'jst-gen'], ['jst,matt|jstmatt', 'jst-matt']]);

// Chapters with study pages on this site: the Gospel Library slug above (book.yaml `abbr`) and a
// chapter -> site path. Unwritten chapters of a book on the site still link to the Gospel Library.
const internalPath = (abbr, chapter) => { const b = LIBRARY.find((x) => x.abbr === abbr); return b?.written.has(chapter) && `/${b.slug}/${chapter}`; };

const norm = (b) => b.toLowerCase().replace(/[.\s]/g, '');

/** Parse "2 Ne. 25:1–8" -> {book, vol, slug, chapter, verses:[first,last]|null}. `prevBook` lets "13:4" inherit. */
export function parseRef(text, prevBook) {
  const m = text.trim().match(/^(.*?)\s*(\d+)(?::\s*(\d+)(?:\s*[–-]\s*(\d+)(:\d+)?)?(?:\s*,.*)?)?(?:\s*[–-]\s*(\d+))?$/);
  if (!m) return null;
  let [, bookText, chapter, v1, v2, crossChapter] = m;
  if (crossChapter) v2 = undefined; // e.g. 9:8–10:4 links to 9:8
  bookText = bookText.trim();
  const book = bookText || prevBook;
  if (!book) return null;
  const entry = BOOKS[norm(book)];
  if (!entry) return null;
  return {
    book,
    vol: entry[0],
    slug: entry[1],
    chapter: Number(chapter),
    verses: v1 ? [Number(v1), Number(v2 ?? v1)] : null,
  };
}

export function refUrl(r) {
  const internal = internalPath(r.slug, r.chapter);
  if (internal) return `${internal}/${r.verses ? `#v${r.verses[0]}` : ''}`;
  const path = r.vol === 'dc-testament' ? `dc-testament/${r.slug}` : `${r.vol}/${r.slug}`;
  let url = `${CHURCH}/${path}/${r.chapter}?lang=eng`;
  if (r.verses) {
    const [a, b] = r.verses;
    const id = a === b ? `p${a}` : `p${a}-p${b}`;
    url += `&id=${id}#p${a}`;
  }
  return url;
}

export const isInternal = (url) => url.startsWith('/');

/** Replace every [[ref; ref|label]] in a string with <a> tags. Unknown refs are left as plain text and reported. */
export function linkRefs(str, onUnknown = () => {}) {
  const anchor = (r, raw) => {
    const url = refUrl(r);
    const text = raw.replace(/&(?!amp;)/g, '&amp;');
    return isInternal(url)
      ? `<a class="ref ref-internal" href="${url}">${text}</a>`
      : `<a class="ref" href="${url}" target="_blank" rel="noopener">${text}</a>`;
  };
  return str.replace(/\[\[([^\]]+)\]\]/g, (_, inner) => {
    const [refText, label] = inner.replace(/&amp;/g, '&').split('|');
    let prev;
    const parts = refText.split(';').map((part) => {
      const p = part.trim();
      const r = parseRef(p, prev);
      if (!r) onUnknown(p);
      else prev = r.book;
      return { p, r };
    });
    // A labelled reference links the label to the first reference.
    if (label) return parts[0].r ? anchor(parts[0].r, label) : label;
    return parts.map(({ p, r }) => (r ? anchor(r, p) : p)).join('; ');
  });
}
