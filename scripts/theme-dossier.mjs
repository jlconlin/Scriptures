// Starts a theme page's research dossier with the parts a script can fill exactly, so that the researcher
// (STANDARDS.md §8, step 1) begins from them instead of running the same commands one at a time:
//   1. every occurrence of the key words in the King James text (occurrences.mjs, with --stem if asked) and,
//      for each Strong's number given, every verse where that Hebrew word occurs with the King James beside it;
//   2. the same phrases in every other book on the site (occurrences.mjs --books);
//   the Church's heading, footnotes and Scripture Helps for each key verse's chapter (footnotes.mjs), under section 2;
//   6. what the site already says (occurrences.mjs --site).
// Sections 3, 4 and 5 (Church sources, faithful scholarship, older commentary) are left for the researcher.
// Usage: node scripts/theme-dossier.mjs <book> <dossier path> --words "comfort,comforter" [--stem] [--hebrew H5162,H5150]
//        [--verses "1:2,1:9,2:13"] [--site all]
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { findBook } from '../src/lib/books.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); return i < 0 ? null : argv[i + 1]; };
const has = (name) => argv.includes(name);
const [slug, out] = argv.filter((a, i) => !a.startsWith('--') && !['--words', '--hebrew', '--verses', '--site'].includes(argv[i - 1]));
const words = (flag('--words') ?? '').split(',').map((w) => w.trim()).filter(Boolean);
const hebrew = (flag('--hebrew') ?? '').split(',').map((w) => w.trim()).filter(Boolean);
const verses = (flag('--verses') ?? '').split(',').map((w) => w.trim()).filter(Boolean);
if (!slug || !out || !words.length) { console.error('Usage: node scripts/theme-dossier.mjs <book> <dossier path> --words "w1,w2" [--stem] [--hebrew H1,H2] [--verses "c:v,…"] [--site all]'); process.exit(1); }
const book = await findBook(ROOT, slug);

const run = (...a) => {
  const cmd = `node scripts/${a[0]} ${a.slice(1).map((x) => (/\s/.test(x) ? `"${x}"` : x)).join(' ')}`;
  let text;
  try { text = execFileSync(process.execPath, [path.join(ROOT, 'scripts', a[0]), ...a.slice(1)], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }); }
  catch (e) { text = `${e.stdout ?? ''}${e.stderr ?? ''}`.trim() || `(failed: ${e.message})`; }
  return `\`${cmd}\`\n\n\`\`\`\n${text.trim()}\n\`\`\``;
};
const stem = has('--stem') ? ['--stem'] : [];
const site = flag('--site') === 'all' ? ['--site', 'all'] : ['--site'];
const chapters = [...new Set(verses.map((v) => v.split(':')[0]))];

const parts = [];
parts.push(`# Dossier: ${book.name}, ${words.join(' / ')}\n\nStarted by \`scripts/theme-dossier.mjs\` on ${new Date().toISOString().slice(0, 10)}: the sections a script fills exactly are below, with the commands that made them, so a reviewer can run them again. Sections 3–5 are the researcher's. Every row the researcher adds: **claim** / source key / exact URL / verbatim quote (STANDARDS.md §8, §4).`);
parts.push(`## 1. Every occurrence in the text\n\n${run('occurrences.mjs', book.slug, ...words, ...stem)}`);
for (const h of hebrew) parts.push(run('occurrences.mjs', book.slug, '--hebrew', h));
parts.push(`*The researcher adds, for each occurrence that carries the theme: who speaks and who or what is described, from the verse itself; and marks the occurrences that do not fit (a literal or everyday use). Then the theme passages in book order, one neutral line each.*`);
parts.push(`## 2. Scripture that quotes or explains these passages\n\n${run('occurrences.mjs', 'all', ...words, ...stem, '--books')}`);
for (const c of chapters) parts.push(`### The Church's heading, footnotes and *Scripture Helps* for chapter ${c}\n\n${run('footnotes.mjs', book.slug, c)}`);
parts.push(`*The researcher adds the rest of scripture where it is plainly the background or the fulfilment, the Joseph Smith Translation notes, and Book of Mormon wording that differs (data/bom/).*`);
parts.push(`## 3. Church sources\n\n*The researcher's.*`);
parts.push(`## 4. Faithful scholarship\n\n*The researcher's: Scripture Central, the Religious Studies Center, BYU Studies' chapter lists, the Interpreter journal (STANDARDS.md §9).*`);
parts.push(`## 5. Older commentary\n\n*The researcher's, from what the brief lists as readable.*`);
parts.push(`## 6. What the site already says\n\n${words.map((w) => run('occurrences.mjs', book.slug, w, ...site)).join('\n\n')}`);
parts.push(`## Sites or sources that failed\n\n## Things I looked for and did not find\n\n## Proposed sources.yaml entries\n`);

mkdirSync(path.dirname(path.resolve(ROOT, out)), { recursive: true });
if (existsSync(path.resolve(ROOT, out))) { console.error(`${out} exists; delete it first`); process.exit(1); }
const text = parts.join('\n\n');
writeFileSync(path.resolve(ROOT, out), text);
console.log(`${out}: ${text.split('\n').length} lines, sections 1, 2 (in part) and 6 filled; 3–5 for the researcher.`);
