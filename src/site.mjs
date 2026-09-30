export const SITE = {
  name: 'Line upon Line',
  tagline: 'A companion for understanding the scriptures',
  description:
    'Phrase-by-phrase help for understanding the scriptures, beginning with Isaiah. Grounded in the restored gospel of Jesus Christ, with history, Hebrew, symbolism, and references.',
  url: 'https://scriptures.conlin.io',
  author: 'Jeremy Lloyd Conlin',
  repo: 'https://github.com/jlconlin/Scriptures',
  year: new Date().getFullYear(),
  version: Date.now().toString(36),
};

// Headings for the parts of every chapter page. Change a heading here and it changes on every
// chapter of every book, and wherever the site describes these sections. {chapter} becomes the
// book and chapter, such as “Isaiah 53”.
export const SECTIONS = {
  setting: { title: 'Background', icon: 'compass' },
  thread: { title: 'The thread through the chapter', icon: 'sparkle' },
  plain: { title: 'In plain words' },
  christ: { title: 'Seeing Christ in {chapter}', icon: 'christ' },
  liken: { title: 'Liken it to yourself', icon: 'liken' },
  explore: { title: 'Worth exploring next', icon: 'key' },
  parallels: { title: 'This chapter elsewhere in scripture' },
  sources: { title: 'Sources & further reading' },
  cited: { title: 'Sources' },
  further: { title: 'Further reading' },
  studied: { title: 'I’ve studied {chapter}' },
};
export const sectionTitle = (key, chapter = '') => SECTIONS[key].title.replace('{chapter}', chapter);

// How each kind of note is labelled and colored throughout the site. The same set serves every book.
// `legacy` kinds are the pre-2026-09-30 set: they still render so old notes keep working, but they are
// left out of the legend and the About page until every note using them has been re-sorted.
export const KINDS = {
  words: { label: 'Language', short: 'Language', blurb: 'What a word or phrase meant in its original language or in 1611 English.' },
  history: { label: 'Context', short: 'Context', blurb: 'The people, places, and events behind the text.' },
  symbol: { label: 'Imagery', short: 'Imagery', blurb: 'What the text’s images would have meant to its first hearers.' },
  christ: { label: 'Witness of Christ', short: 'Christ', blurb: 'Where the passage points to Jesus Christ and His Atonement.' },
  scripture: { label: 'Related Scriptures', short: 'Scriptures', blurb: 'Other scripture that quotes, explains, or fulfills the passage.' },
  prophets: { label: 'Latter-day Prophets', short: 'Prophets', blurb: 'What latter-day prophets and apostles have taught about the passage.' },
  structure: { label: 'Literary Structure', short: 'Structure', blurb: 'How the passage is built, where the structure points to its main message.' },
  bom: { label: 'BoM Comparison', short: 'BoM', blurb: 'Verses where the Book of Mormon’s text reads differently from the King James Version. Shown automatically.' },
  restoration: { label: 'Restoration Insight', short: 'Restoration', blurb: 'Not yet re-sorted into Related Scriptures or Latter-day Prophets.', legacy: true },
  liken: { label: 'Liken It', short: 'Liken', blurb: 'Not yet re-sorted into another kind.', legacy: true },
};
