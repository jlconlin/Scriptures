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
  studied: { title: 'I’ve studied {chapter}' },
};
export const sectionTitle = (key, chapter = '') => SECTIONS[key].title.replace('{chapter}', chapter);

// How each kind of note is labelled and colored throughout the site.
export const KINDS = {
  words: { label: 'Word & Language', short: 'Words', blurb: 'What a word or phrase meant in Isaiah’s Hebrew or in 1611 English.' },
  history: { label: 'History & Setting', short: 'History', blurb: 'The people, places, and events behind the text.' },
  symbol: { label: 'Imagery & Symbol', short: 'Imagery', blurb: 'What Isaiah’s pictures would have meant to his first hearers.' },
  christ: { label: 'Witness of Christ', short: 'Christ', blurb: 'Where the passage points to Jesus Christ and His Atonement.' },
  restoration: { label: 'Restoration Insight', short: 'Restoration', blurb: 'Light from the Book of Mormon, the Doctrine and Covenants, and modern prophets.' },
  bom: { label: 'Book of Mormon Reading', short: 'BoM', blurb: 'Verses where Nephi’s text of Isaiah reads differently from the King James Version. Shown automatically.' },
  liken: { label: 'Liken It', short: 'Liken', blurb: 'How the passage speaks to disciples today (1 Nephi 19:23).' },
};
