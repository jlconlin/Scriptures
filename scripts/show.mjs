// Print chapters of a book's KJV text with verse numbers (authoring aid).
// Usage: node scripts/show.mjs [book] 1 2 3   (book defaults to isaiah)
import { readFileSync } from 'node:fs';
import { findBook, bookArg } from '../src/lib/books.mjs';

const root = new URL('..', import.meta.url).pathname;
const { slug, rest } = bookArg(process.argv.slice(2));
const book = await findBook(root, slug);
const { chapters } = JSON.parse(readFileSync(`${root}data/kjv/${slug}.json`));
for (const c of rest) {
  console.log(`\n=== ${book.name} ${c} ===`);
  chapters[c - 1].forEach((v, i) => console.log(`${i + 1} ${v}`));
}
