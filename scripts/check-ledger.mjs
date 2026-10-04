// Reopens every row of an evidence ledger and checks that its quote is on the page at its URL
// (a web page, its embedded footnotes, a raw text or XML file, or a PDF with a text layer).
// This is the mechanical half of reviewing a chapter or a theme page (STANDARDS.md §5, §8): it proves the quotes are real,
// not that they support the claims. Pages are fetched and cached by src/lib/pages.mjs (curl, kept in
// .cache/ledger/ for a day, shared with scripts/source.mjs), which also holds the comparison.
// Usage: node scripts/check-ledger.mjs [book] [chapter numbers...]   the chapters' ledgers, content/<book>/evidence/NN.yaml
//        node scripts/check-ledger.mjs <book> themes | guides        every ledger in content/<book>/evidence/themes/ (or guides/)
//        node scripts/check-ledger.mjs <book> <page>                 one page's ledger, by its file name (cup-of-fury, with or without .yaml or .md)
//        With nothing after the book: every chapter, then every theme and guide ledger. Book defaults to isaiah.
//        --fresh ignores the cache; --quiet prints only the summary lines.
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { discoverBooks, bookArg } from '../src/lib/books.mjs';
import { fetchPage, pageText, onPage, parseOrEmpty, pageProblems } from '../src/lib/pages.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const argv = process.argv.slice(2);
const fresh = argv.includes('--fresh');
const quiet = argv.includes('--quiet');
const { slug, rest } = bookArg(argv.filter((a) => !a.startsWith('--')));
const books = await discoverBooks(ROOT);
const book = books.find((b) => b.slug === slug);
if (!book) throw new Error(`No book “${slug}”. Books: ${books.map((b) => b.slug).join(', ')}`);

// What was asked for: chapter numbers, themes, guides, or one page's file name; nothing means all of them.
const chapters = rest.filter((a) => /^\d+$/.test(a)).map(Number);
const kinds = rest.filter((a) => a === 'themes' || a === 'guides');
const pageNames = rest.filter((a) => !/^\d+$/.test(a) && a !== 'themes' && a !== 'guides').map((a) => a.replace(/\.(?:yaml|md)$/, ''));
const everything = !rest.length;

const pages = new Map(); // url -> { text, num } | { error }
async function checkPage(url) {
  if (!pages.has(url)) {
    const got = await fetchPage(url, { fresh });
    pages.set(url, got.error ? got : pageText(got.raw));
  }
  return pages.get(url);
}

const dir = path.join(book.dir, 'evidence');
const ls = async (d) => (existsSync(d) ? (await readdir(d)).filter((f) => f.endsWith('.yaml')).sort() : []);
// The ledgers to check: { label, file }, chapters first, then themes, then guides.
const todo = [];
if (everything || chapters.length)
  for (const f of (await ls(dir)).filter((f) => /^\d+\.yaml$/.test(f))) if (!chapters.length || chapters.includes(parseInt(f, 10))) todo.push({ label: `${book.name} ${parseInt(f, 10)}`, file: path.join(dir, f) });
for (const sub of ['themes', 'guides'])
  if (everything || kinds.includes(sub) || pageNames.length)
    for (const f of await ls(path.join(dir, sub))) if (!pageNames.length || kinds.includes(sub) || pageNames.includes(f.replace(/\.yaml$/, ''))) todo.push({ label: `${book.name} ${sub === 'themes' ? 'theme' : 'guide'} ${f.replace(/\.yaml$/, '')}`, file: path.join(dir, sub, f) });
for (const name of pageNames) if (!todo.some((t) => t.file.endsWith(`/${name}.yaml`))) { console.error(`No ledger for “${name}” in ${path.relative(ROOT, dir)}/themes/ or guides/.`); process.exit(1); }
if (!todo.length) { console.error(`No ledgers to check for ${book.name} (${rest.join(' ') || 'everything'}).`); process.exit(1); }

let totalOk = 0, totalMissing = 0, totalUnfetched = 0;
for (const { label, file } of todo) {
  const ledger = YAML.parse(await readFile(file, 'utf8'));
  let ok = 0, missing = 0, unfetched = 0;
  for (const row of ledger.claims ?? []) {
    const page = await checkPage(row.url);
    if (page.error) { unfetched++; if (!quiet) console.log(`  ? ${label} ${row.where} [${row.key}]: ${page.error}: ${row.url}`); continue; }
    if (onPage(page, row.quote)) ok++;
    else {
      // A page that is blocked, not there, or empty is that, not a quote that is missing from the page.
      const got = await fetchPage(row.url, { fresh }), bad = got.error ? [] : pageProblems(got.raw, parseOrEmpty(got.raw, row.url));
      if (bad.length) { unfetched++; if (!quiet) console.log(`  ? ${label} ${row.where} [${row.key}]: ${bad.join("; ")}: ${row.url}`); continue; }
      missing++; if (!quiet) console.log(`  ✗ ${label} ${row.where} [${row.key}]: quote not on page: “${String(row.quote).slice(0, 80)}” ${row.url}`);
    }
  }
  totalOk += ok; totalMissing += missing; totalUnfetched += unfetched;
  console.log(`${label}: ${ok} rows confirmed, ${missing} quote(s) not on page, ${unfetched} page(s) not fetched or not readable`);
}
console.log(`\n${totalOk} confirmed, ${totalMissing} not on page, ${totalUnfetched} not fetched or not readable.`);
process.exit(totalMissing || totalUnfetched ? 1 : 0);
