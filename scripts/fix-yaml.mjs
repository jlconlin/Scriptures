// Authoring helper: quote single-line YAML values that contain ": " (which YAML would
// otherwise read as a nested mapping). Scripture phrases often contain colons.
// Usage: node scripts/fix-yaml.mjs [files...]      quote just those files
//        node scripts/fix-yaml.mjs --book <slug>   every chapter of one book
//        node scripts/fix-yaml.mjs --all           every chapter of every book (what `npm run build` runs)
//        node scripts/fix-yaml.mjs                 same as --book isaiah, as before books were added
// It only touches lines that need quoting, so running it again changes nothing.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { discoverBooks, DEFAULT_BOOK } from '../src/lib/books.mjs';

const args = process.argv.slice(2);
const chapterFiles = async (book) => (await readdir(path.join(book.dir, 'chapters'))).filter((f) => f.endsWith('.yaml')).map((f) => path.join(book.dir, 'chapters', f));
const bookAt = args.indexOf('--book');
let files = args.filter((a, i) => !a.startsWith('--') && i !== bookAt + 1);
if (!files.length) {
  const books = await discoverBooks(new URL('..', import.meta.url).pathname);
  const slug = bookAt >= 0 ? args[bookAt + 1] : DEFAULT_BOOK;
  const chosen = args.includes('--all') ? books : books.filter((b) => b.slug === slug);
  if (!chosen.length) throw new Error(`No book “${slug}”. Books: ${books.map((b) => b.slug).join(', ')}`);
  files = (await Promise.all(chosen.map(chapterFiles))).flat();
}

const KEYS = /^(\s*(?:- )?(?:phrase|title|heading|tagline|when|ref|note|range)): (.*)$/;
let changed = 0;
for (const file of files) {
  const lines = (await readFile(file, 'utf8')).split('\n');
  let touched = false;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(KEYS);
    if (!m) continue;
    const value = m[2];
    if (/^['"|>]/.test(value) || !/: |#\s/.test(value)) continue;
    lines[i] = `${m[1]}: '${value.replace(/'/g, "''")}'`;
    touched = true;
    changed++;
  }
  if (touched) await writeFile(file, lines.join('\n'));
}
if (changed) console.log(`fix-yaml: quoted ${changed} value(s)`);
