// Reopens every row of a chapter's evidence ledger and checks that its quote is on the page at its URL
// (a web page, its embedded footnotes, a raw text or XML file, or a PDF with a text layer).
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
// NFKD splits an accented letter into the letter and its mark (â → a) and a ligature into its letters (ﬁ → fi),
// so a quote and a page agree however each wrote them.
const letters = (s) => String(s).normalize('NFKD').toLowerCase().replace(/[^a-zא-תͰ-Ͽ]+/g, '');
// A quote with hardly any letters (a footnote's cross-reference, “Ex. 4:22 (22–23)”) is compared with its digits kept.
const alnum = (s) => String(s).normalize('NFKD').toLowerCase().replace(/[^a-z0-9א-תͰ-Ͽ]+/g, '');
const entities = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&([a-z])(?:acute|grave|circ|uml|tilde|cedil|ring|caron|slash);/gi, '$1') // &acirc; → a
    .replace(/&[a-z]+\d*;/gi, ' '); // &mdash; &rsquo; &nbsp; and the rest
const visible = (html) =>
  entities(
    html
      .replace(/<sup[^>]*>.*?<\/sup>/gs, '')
      .replace(/<span class="verse-number">.*?<\/span>/gs, '')
      .replace(/<[^>]+>/g, ' '),
  );
// The Gospel Library keeps a chapter's footnotes in a block of data in the page, not in its visible text.
const embedded = (html) => {
  const m = html.match(/window\.__INITIAL_STATE__="([A-Za-z0-9+/=]+)"/);
  if (!m) return '';
  const out = [];
  const walk = (v) => { if (typeof v === 'string') out.push(v); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
  try { walk(JSON.parse(Buffer.from(m[1], 'base64').toString('utf8'))); } catch { return ''; }
  return visible(out.join(' '));
};
// What a quote is looked for in: the page as a reader sees it, its embedded data, and the file as it is
// (a quote from the Hebrew text's XML carries the markup).
// (and with what is in superscript kept, since a lexicon page sets its first reference that way).
const pageText = (html) => { const forms = [visible(html), entities(html.replace(/<[^>]+>/g, ' ')), embedded(html), html]; return { text: forms.map(letters).join('|'), num: forms.map(alnum).join('|') }; };
const PDF_TEXT = '%TEXT-OF-PDF\n'; // a cached PDF is kept as its text, under this first line
async function pdfText(buf) {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await getDocument({ data: new Uint8Array(buf), verbosity: 0 }).promise;
  const out = [];
  for (let i = 1; i <= doc.numPages; i++) out.push((await (await doc.getPage(i)).getTextContent()).items.map((t) => t.str).join(' '));
  return out.join(' ');
}
// A quote is on the page when every part of it between elisions is.
// Brackets in a quote may be the writer's annotation ([7725], a Strong's number) or the page's own
// (“noun [masculine]”); a capital in parentheses may be a translation's cross-reference mark, “(M)”, which the
// page keeps in superscript, or a lexicon's own, “Genesis 1:2 (P)”. So each is tried with and without.
const variants = (quote) => {
  const q = entities(String(quote)); // a quote copied from a page's source may carry an entity (D&amp;C)
  const noBrackets = (t) => t.replace(/\[[^\]]*\]/g, ''), noMarks = (t) => t.replace(/\(\s*[A-Z]{1,2}\s*\)/g, ' ');
  return [q, noBrackets(q), noMarks(q), noMarks(noBrackets(q))];
};
const onPage = (page, quote) =>
  variants(quote).some((q) => {
    // Letters only, unless the part is short and has digits (a cross-reference), which is compared with them kept.
    const parts = q.split(/…|\.\.\./).map((p) => (letters(p).length >= 6 || alnum(p) === letters(p) ? [page.text, letters(p)] : [page.num, alnum(p)])).filter(([, p]) => p.length >= (/[א-ת]/.test(p) ? 2 : 3));
    return parts.length > 0 && parts.every(([where, p]) => where.includes(p));
  });

const pages = new Map(); // url -> { text } | { error }
async function fetchPage(url) {
  if (pages.has(url)) return pages.get(url);
  const file = path.join(CACHE, createHash('sha1').update(url).digest('hex'));
  let html = null;
  if (!fresh && existsSync(file) && Date.now() - statSync(file).mtimeMs < 86400e3) html = await readFile(file, 'utf8');
  if (html !== null && (html.length <= 200 || html.startsWith('%PDF-'))) html = null; // an empty page, or a PDF cached before this script could read one
  for (let attempt = 0; html === null && attempt < 3; attempt++) {
    try {
      const out = execFileSync('curl', ['-sgL', '-m', '120', '-A', 'Mozilla/5.0', url], { maxBuffer: 256e6 });
      if (out.subarray(0, 5).toString() === '%PDF-') html = PDF_TEXT + (await pdfText(out));
      else if (out.length > 200) html = out.toString();
    } catch {}
    if (html === null) await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
  }
  const pdf = html?.startsWith(PDF_TEXT) ? html.slice(PDF_TEXT.length) : null;
  const result = html === null ? { error: 'could not fetch' } : pdf !== null ? { text: letters(pdf), num: alnum(pdf) } : pageText(html);
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
    if (onPage(page, row.quote)) ok++;
    else { missing++; if (!quiet) console.log(`  ✗ ${book.name} ${n} ${row.where} [${row.key}]: quote not on page: “${String(row.quote).slice(0, 80)}” ${row.url}`); }
  }
  totalOk += ok; totalMissing += missing; totalUnfetched += unfetched;
  console.log(`${book.name} ${n}: ${ok} rows confirmed, ${missing} quote(s) not on page, ${unfetched} page(s) not fetched`);
}
console.log(`\n${totalOk} confirmed, ${totalMissing} not on page, ${totalUnfetched} not fetched.`);
process.exit(totalMissing || totalUnfetched ? 1 : 0);
