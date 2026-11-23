// Lists the parts of a chapter (a note, `setting`, `thread`, `christ`, a section's plain words) whose only outside sources are
// commentaries that go through a book of scripture verse by verse. The class is defined by what a work is, not by a list of
// names (author, 2026-11-22: “We shouldn't be limited to just a handful of them”): every commentary on Bible Hub (any address
// under biblehub.com/commentaries/: Ellicott, Barnes, Gill, Clarke, Keil, the Pulpit Commentary and the rest), and any entry
// in content/sources.yaml or the chapter's proposed file marked "verseByVerse": true (Talmage's *Jesus the Christ*, Brown's
// *Testimony of Luke*, Huntsman and Hatch's day-by-day chapters of *Greater Love Hath No Man*). check-sources.mjs asks for the mark
// when such an entry is proposed. A writer reaches for these because they answer nearly any question in one call, and in
// Matthew (Talmage), Luke (Brown) and John (Ellicott) one of them came to carry the book (GOSPELS.md, “Why one source keeps
// coming to carry a book”). Each listed part is a finding for the reviewer: recast it from the studies of the passage, scripture
// and the prophets, or say why nothing else answers its question. It is a list of notes, not a count to meet (author,
// 2026-11-20: no count of any source in the rules or the checks); the total at the end is the coordinator's measurement.
// Scripture, the JST, the Greek and Hebrew texts and lexicons, and the Bible Dictionary are not counted as outside sources.
// Usage: node scripts/sole-commentary.mjs <book> [chapter ...] [--quiet]
//   --quiet prints only the totals line.
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { SCRIPT_ROOT as ROOT, pad, readProposed } from '../src/lib/ledger.mjs';

// The commentaries that go verse by verse: any Bible Hub commentary by its address, and any entry marked verseByVerse.
export const VERSE_BY_VERSE_URL = /biblehub\.com\/commentaries\//;
export const isVerseByVerse = (entry, url) => Boolean(entry?.verseByVerse) || VERSE_BY_VERSE_URL.test(String(url ?? '')) || VERSE_BY_VERSE_URL.test(String(entry?.url ?? ''));
// Not outside sources: the text itself and the tools for reading it (check-content.mjs's REFERENCE_KEY, with the Bible Dictionary).
const REFERENCE_KEY = /^(?:lds-scriptures|greek-nt|biblehub-interlinear|lxx-|nrsv|niv$|esv$|kjv|oshb|tahot|bdb|halot|strongs|webster|thayer|jst-|mt-sefaria|bd-|.*-heading$)/;


const argv = process.argv.slice(2);
const quiet = argv.includes('--quiet');
const [book, ...rest] = argv.filter((a) => !a.startsWith('--'));
if (!book) { console.error('Usage: node scripts/sole-commentary.mjs <book> [chapter ...] [--quiet]'); process.exit(1); }
const dir = path.join(ROOT, 'content', book, 'evidence');
if (!existsSync(dir)) { console.error(`No ledgers in content/${book}/evidence.`); process.exit(1); }
let chapters = rest.map(Number).filter(Boolean);
if (!chapters.length) {
  const { readdir } = await import('node:fs/promises');
  chapters = (await readdir(dir)).map((f) => f.match(/^(\d+)\.yaml$/)?.[1]).filter(Boolean).map(Number).sort((a, b) => a - b);
}

const sources = YAML.parse(await readFile(path.join(ROOT, 'content/sources.yaml'), 'utf8')) ?? {};
let parts = 0, listed = 0;
for (const n of chapters) {
  const file = path.join(dir, `${pad(n)}.yaml`);
  if (!existsSync(file)) continue;
  const doc = YAML.parse(await readFile(file, 'utf8')) ?? {};
  const rows = Array.isArray(doc) ? doc : (doc.claims ?? []);
  const byWhere = new Map();
  for (const r of rows) {
    const w = String(r.where ?? '?');
    if (!byWhere.has(w)) byWhere.set(w, []);
    byWhere.get(w).push(r);
  }
  let proposed = {};
  try { proposed = await readProposed(book, n); } catch {}
  const isCommentary = (r) => isVerseByVerse(proposed[r.key] ?? sources[r.key], r.url);
  const hits = [];
  for (const [where, rs] of byWhere) {
    parts++;
    const outside = rs.filter((r) => !REFERENCE_KEY.test(String(r.key ?? '')));
    if (outside.length && outside.every(isCommentary)) hits.push({ where, keys: [...new Set(outside.map((r) => r.key))], rows: outside.length });
  }
  listed += hits.length;
  if (quiet || !hits.length) continue;
  console.log(`${book} ${n}: ${hits.length} part(s) whose only outside sources go verse by verse`);
  for (const h of hits) console.log(`  ${h.where}  [${h.keys.join(', ')}; ${h.rows} row(s)]`);
}
console.log(`${listed} of ${parts} part(s) in ${chapters.length} chapter(s) rest only on a verse-by-verse commentary besides scripture and the reference works.`);
