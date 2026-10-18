// The build supplies the site's local scripture text once. Each page embeds only its short references.
const booksByPath = new Map();

export function configureScripturePreviews(books) {
  booksByPath.clear();
  for (const book of books) booksByPath.set(book.gospelLibrary, book);
}

// A key is vol/book/chapter/first-last, or vol/book/chapter/first-chapter2:last for a passage that runs into the next
// chapter. Each preview is a list of parts, one per chapter: { chapter, first, verses }.
export function scripturePreviewData(html) {
  const previews = {};
  for (const [, key] of html.matchAll(/data-scripture="([^"]+)"/g)) {
    if (previews[key]) continue;
    const [vol, abbr, chapterText, range] = key.split('/');
    const book = booksByPath.get(`${vol}/${abbr}`);
    if (!book) continue;
    const chapter = Number(chapterText);
    const [firstText, lastText] = range.split('-');
    const first = Number(firstText);
    const [endChapter, last] = lastText.includes(':') ? lastText.split(':').map(Number) : [chapter, Number(lastText)];
    if (first < 1 || endChapter < chapter || (endChapter === chapter && last < first)) continue;
    const parts = [];
    for (let c = chapter; c <= endChapter; c++) {
      const text = book.kjv.chapters[c - 1];
      if (!text) break;
      const from = c === chapter ? first : 1, to = c === endChapter ? last : text.length;
      const verses = text.slice(from - 1, to);
      if (verses.length !== to - from + 1 || verses.some((v) => !v)) break;
      parts.push({ chapter: c, first: from, verses });
    }
    if (parts.length !== endChapter - chapter + 1) continue;
    const span = endChapter === chapter ? `${chapter}:${first}${last === first ? '' : `–${last}`}` : `${chapter}:${first}–${endChapter}:${last}`;
    previews[key] = { title: `${book.name} ${span}`, book: book.name, parts };
  }
  return Object.keys(previews).length ? previews : null;
}
