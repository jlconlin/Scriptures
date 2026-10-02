// The five volumes of the standard works. The Scriptures menu always lists all five, and each gets a
// page (/old-testament/ and so on) listing its books that are on the site. A book's volume comes from
// its book.yaml `abbr`, looked up in the scripture-reference table in refs.mjs.
import { BOOK_ORDER } from './refs.mjs';

export const VOLUMES = [
  { key: 'ot', slug: 'old-testament', name: 'Old Testament', gospelLibrary: 'ot' },
  { key: 'nt', slug: 'new-testament', name: 'New Testament', gospelLibrary: 'nt' },
  { key: 'bofm', slug: 'book-of-mormon', name: 'Book of Mormon', gospelLibrary: 'bofm' },
  { key: 'dc-testament', slug: 'doctrine-and-covenants', name: 'Doctrine and Covenants', gospelLibrary: 'dc-testament' },
  { key: 'pgp', slug: 'pearl-of-great-price', name: 'Pearl of Great Price', gospelLibrary: 'pgp' },
];

/** The volume key and canonical position of a book, from its book.yaml `abbr` (such as `isa`). */
export function placeOf(abbr) {
  for (const [vol, books] of Object.entries(BOOK_ORDER)) {
    const i = books.indexOf(abbr);
    if (i >= 0 && VOLUMES.some((v) => v.key === vol)) return { vol, index: i };
  }
  return null;
}

export const gospelLibraryVolume = (v) => `https://www.churchofjesuschrist.org/study/scriptures/${v.gospelLibrary}?lang=eng`;
