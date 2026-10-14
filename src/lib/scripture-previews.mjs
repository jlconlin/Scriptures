// The build supplies the site's local scripture text once. Each page embeds only its short references.
const booksByPath = new Map();

export function configureScripturePreviews(books) {
  booksByPath.clear();
  for (const book of books) booksByPath.set(book.gospelLibrary, book);
}

export function scripturePreviewData(html) {
  const previews = {};
  for (const [, key] of html.matchAll(/data-scripture="([^"]+)"/g)) {
    if (previews[key]) continue;
    const [vol, abbr, chapter, range] = key.split('/');
    const book = booksByPath.get(`${vol}/${abbr}`);
    const [first, last] = range.split('-').map(Number);
    if (first < 1 || last < first || last - first > 2) continue;
    const verses = book?.kjv.chapters[Number(chapter) - 1]?.slice(first - 1, last);
    if (!verses || verses.length !== last - first + 1 || verses.some((text) => !text)) continue;
    previews[key] = { title: `${book.name} ${chapter}:${first}${last === first ? '' : `–${last}`}`, first, verses };
  }
  return Object.keys(previews).length ? previews : null;
}
