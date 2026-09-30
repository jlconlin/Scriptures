// Finding the books on the site. A book is a directory content/<slug>/ that has a book.yaml
// and a chapters/ directory. Used by the build and by the scripts, so they agree on what exists.
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

export const DEFAULT_BOOK = 'isaiah';

/**
 * Every book under <root>/content, ordered by `order:` in its book.yaml (lowest first; books
 * without one go last), then by slug. Each result is the parsed book.yaml plus `dir`.
 */
export async function discoverBooks(root) {
  const content = path.join(root, 'content');
  const books = [];
  for (const e of await readdir(content, { withFileTypes: true })) {
    const dir = path.join(content, e.name);
    const file = path.join(dir, 'book.yaml');
    if (!e.isDirectory() || !existsSync(file) || !existsSync(path.join(dir, 'chapters'))) continue;
    let book;
    try {
      book = YAML.parse(await readFile(file, 'utf8'));
    } catch (err) {
      throw new Error(`${path.relative(root, file)}: ${err.message}`);
    }
    if (book.slug !== e.name) throw new Error(`${path.relative(root, file)}: slug “${book.slug}” must match the directory name “${e.name}”`);
    books.push({ ...book, dir });
  }
  return books.sort((a, b) => (a.order ?? 1e9) - (b.order ?? 1e9) || a.slug.localeCompare(b.slug));
}

/** One book by slug, or an error that lists the books that exist. */
export async function findBook(root, slug) {
  const books = await discoverBooks(root);
  const book = books.find((b) => b.slug === slug);
  if (!book) throw new Error(`No book “${slug}” in content/. Books: ${books.map((b) => b.slug).join(', ')}`);
  return book;
}

/** Split script arguments into an optional book slug (anything non-numeric) and the rest. */
export function bookArg(args) {
  const slug = args.find((a) => !/^\d/.test(a) && !a.includes('/') && !a.startsWith('-'));
  return { slug: slug ?? DEFAULT_BOOK, rest: args.filter((a) => a !== slug) };
}
