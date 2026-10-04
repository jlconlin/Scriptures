// Reopens every row of a chapter's evidence ledger and checks that its quote is on the page at its URL
// (a web page, its embedded footnotes, a raw text or XML file, or a PDF with a text layer).
// This is the mechanical half of reviewing a chapter (STANDARDS.md §5): it proves the quotes are real,
// not that they support the claims. Pages are fetched and cached by src/lib/pages.mjs (curl, kept in
// .cache/ledger/ for a day, shared with scripts/source.mjs), which also holds the comparison.
// Usage: node scripts/check-ledger.mjs [book] [chapter numbers...]   (book defaults to isaiah)
//        --fresh ignores the cache; --quiet prints only the summary lines.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { discoverBooks, bookArg } from '../src/lib/books.mjs';
import { fetchPage, pageText, onPage } from '../src/lib/pages.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const argv = process.argv.slice(2);
const fresh = argv.includes('--fresh');
const quiet = argv.includes('--quiet');
const { slug, rest } = bookArg(argv.filter((a) => !a.startsWith('--')));
const books = await discoverBooks(ROOT);
const book = books.find((b) => b.slug === slug);
if (!book) throw new Error(`No book “${slug}”. Books: ${books.map((b) => b.slug).join(', ')}`);
const only = rest.map(Number);

const pages = new Map(); // url -> { text, num } | { error }
async function checkPage(url) {
  if (!pages.has(url)) {
    const got = await fetchPage(url, { fresh });
    pages.set(url, got.error ? got : pageText(got.raw));
  }
  return pages.get(url);
}

const dir = path.join(book.dir, 'evidence');
const files = (await readdir(dir)).filter((f) => /^\d+\.yaml$/.test(f)).sort();
let totalOk = 0, totalMissing = 0, totalUnfetched = 0;
for (const f of files) {
  const n = parseInt(f, 10);
  if (only.length && !only.includes(n)) continue;
  const ledger = YAML.parse(await readFile(path.join(dir, f), 'utf8'));
  let ok = 0, missing = 0, unfetched = 0;
  for (const row of ledger.claims ?? []) {
    const page = await checkPage(row.url);
    if (page.error) { unfetched++; if (!quiet) console.log(`  ? ${book.name} ${n} ${row.where} [${row.key}]: ${page.error}: ${row.url}`); continue; }
    if (onPage(page, row.quote)) ok++;
    else { missing++; if (!quiet) console.log(`  ✗ ${book.name} ${n} ${row.where} [${row.key}]: quote not on page: “${String(row.quote).slice(0, 80)}” ${row.url}`); }
  }
  totalOk += ok; totalMissing += missing; totalUnfetched += unfetched;
  console.log(`${book.name} ${n}: ${ok} rows confirmed, ${missing} quote(s) not on page, ${unfetched} page(s) not fetched`);
}
console.log(`\n${totalOk} confirmed, ${totalMissing} not on page, ${totalUnfetched} not fetched.`);
process.exit(totalMissing || totalUnfetched ? 1 : 0);
