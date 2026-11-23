// Lists the parts of a chapter (a note, `setting`, `thread`, `christ`, a section's plain words) whose only outside sources are
// commentaries that go verse by verse: Talmage's *Jesus the Christ*, Ellicott, the Expositor's Greek Testament, Meyer, the
// Cambridge Bible, the Pulpit Commentary, Keil, Brown's *Testimony of Luke*, Huntsman and Hatch's *Greater Love Hath No Man*,
// Huntsman's translation of John, Edersheim. A writer reaches for these because they answer nearly any question in one call, and
// in Matthew (Talmage), Luke (Brown) and John (Ellicott) one of them came to carry the book (GOSPELS.md, “Talmage is opened last”).
// Each listed part is a finding for the reviewer: recast it from the studies of the passage, scripture and the prophets, or say why
// nothing else answers its question. It is a list of notes, not a count to meet (author, 2026-11-20: no count of any source in
// the rules or the checks); the total at the end is for the coordinator's measurement after a batch.
// Scripture, the JST, the Greek and Hebrew texts and lexicons, and the Bible Dictionary are not counted as outside sources.
// Usage: node scripts/sole-commentary.mjs <book> [chapter ...] [--quiet]
//   --quiet prints only the totals line.
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { SCRIPT_ROOT as ROOT, pad } from '../src/lib/ledger.mjs';

// The commentaries that cover every verse in order (keys, or the address of the work for keys named otherwise).
export const VERSE_BY_VERSE_KEY = /^(?:talmage-jesus-christ|ellicott-|egt-|meyer-|cambridge-|pulpit-|keil-|brown-testimony-luke|huntsman-john-rendition|edersheim)/;
export const VERSE_BY_VERSE_URL = /rsc\.byu\.edu\/greater-love-hath-no-man\//;
// Not outside sources: the text itself and the tools for reading it (check-content.mjs's REFERENCE_KEY, with the Bible Dictionary).
const REFERENCE_KEY = /^(?:lds-scriptures|greek-nt|biblehub-interlinear|lxx-|nrsv|niv$|esv$|kjv|oshb|tahot|bdb|halot|strongs|webster|thayer|jst-|mt-sefaria|bd-|.*-heading$)/;

const isCommentary = (r) => VERSE_BY_VERSE_KEY.test(String(r.key ?? '')) || VERSE_BY_VERSE_URL.test(String(r.url ?? ''));

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
