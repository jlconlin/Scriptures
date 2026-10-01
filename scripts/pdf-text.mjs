// Print the text of a PDF, page by page, so a ledger quote can be copied from it.
// Usage: node scripts/pdf-text.mjs <file.pdf | https://…pdf> [first-page [last-page]]
import { readFile } from 'node:fs/promises';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const [src, first, last] = process.argv.slice(2);
if (!src) { console.error('Usage: node scripts/pdf-text.mjs <file.pdf | url> [first-page [last-page]]'); process.exit(1); }
const data = /^https?:\/\//.test(src)
  ? new Uint8Array(await (await fetch(src)).arrayBuffer())
  : new Uint8Array(await readFile(src));
const doc = await getDocument({ data, verbosity: 0 }).promise;
const from = Math.max(1, Number(first) || 1);
const to = Math.min(doc.numPages, Number(last) || doc.numPages);
for (let i = from; i <= to; i++) {
  const { items } = await (await doc.getPage(i)).getTextContent();
  const text = items.map((t) => t.str).join(' ').replace(/\s+/g, ' ').trim();
  console.log(`\n--- page ${i} of ${doc.numPages} ---\n${text || '(no text layer: a scanned image)'}`);
}
