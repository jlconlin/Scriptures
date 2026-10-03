// Reopens every row of a chapter's evidence ledger and checks that its quote is on the page at its URL.
// This is the mechanical half of reviewing a chapter (STANDARDS.md §5): it proves the quotes are real,
// not that they support the claims. Pages are fetched with curl (Node's fetch gets a different page
// from churchofjesuschrist.org) and cached in .cache/ledger/ for a day.
// Usage: node scripts/check-ledger.mjs [book] [chapter numbers...]   (book defaults to isaiah)
//        --fresh ignores the cache; --quiet prints only the summary lines.
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import YAML from 'yaml';
import { discoverBooks, bookArg } from '../src/lib/books.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CACHE = path.join(ROOT, '.cache/ledger');
await mkdir(CACHE, { recursive: true });

const argv = process.argv.slice(2);
const fresh = argv.includes('--fresh');
const quiet = argv.includes('--quiet');
const { slug, rest } = bookArg(argv.filter((a) => !a.startsWith('--')));
const books = await discoverBooks(ROOT);
const book = books.find((b) => b.slug === slug);
if (!book) throw new Error(`No book “${slug}”. Books: ${books.map((b) => b.slug).join(', ')}`);
const only = rest.map(Number);

// Compare on letters only: the sites put footnote markers, links, and verse numbers inside the text,
// and ledger quotes may carry Strong's numbers in brackets or morpheme slashes from the WLC. Digits are
// ignored because a quote copied across a verse break carries the verse number, which the page keeps in
// its own element.
const letters = (s) => String(s).replace(/&amp;/g, '&').toLowerCase().replace(/[^a-zא-תͰ-Ͽ]+/g, '');
const pageText = (html) =>
  letters(
    html
      .replace(/<sup[^>]*>.*?<\/sup>/gs, '')
      .replace(/<span class="verse-number">.*?<\/span>/gs, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)),
  );
const quoteParts = (q) =>
  String(q)
    .replace(/\[[^\]]*\]/g, '') // [7725] Strong's annotations
    .split(/…|\.\.\./)
    .map(letters)
    .filter((p) => p.length >= 3);

const pages = new Map(); // url -> { text } | { error }
async function fetchPage(url) {
  if (pages.has(url)) return pages.get(url);
  const file = path.join(CACHE, createHash('sha1').update(url).digest('hex'));
  let html = null;
  if (!fresh && existsSync(file) && Date.now() - statSync(file).mtimeMs < 86400e3) html = await readFile(file, 'utf8');
  for (let attempt = 0; html === null && attempt < 3; attempt++) {
    try {
      const out = execFileSync('curl', ['-sgL', '-m', '60', '-A', 'Mozilla/5.0', url], { maxBuffer: 64e6 }).toString();
      if (out.length > 200) html = out;
    } catch {}
    if (html === null) await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
  }
  const result = html === null ? { error: 'could not fetch' } : { text: pageText(html) };
  if (html !== null) await writeFile(file, html);
  pages.set(url, result);
  return result;
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
    const page = await fetchPage(row.url);
    if (page.error) { unfetched++; if (!quiet) console.log(`  ? ${book.name} ${n} ${row.where} [${row.key}]: ${page.error}: ${row.url}`); continue; }
    const parts = quoteParts(row.quote);
    if (parts.length && parts.every((p) => page.text.includes(p))) ok++;
    else { missing++; if (!quiet) console.log(`  ✗ ${book.name} ${n} ${row.where} [${row.key}]: quote not on page: “${String(row.quote).slice(0, 80)}” ${row.url}`); }
  }
  totalOk += ok; totalMissing += missing; totalUnfetched += unfetched;
  console.log(`${book.name} ${n}: ${ok} rows confirmed, ${missing} quote(s) not on page, ${unfetched} page(s) not fetched`);
}
console.log(`\n${totalOk} confirmed, ${totalMissing} not on page, ${totalUnfetched} not fetched.`);
process.exit(totalMissing || totalUnfetched ? 1 : 0);
