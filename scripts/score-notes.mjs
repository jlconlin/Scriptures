#!/usr/bin/env node
// Aggregate reader judgments; this script never assigns prose-quality ratings.
// node scripts/score-notes.mjs [book ...] [--out .cache/review]
// Checkpoints: <out>/checkpoints/<book>/NN.json. See REVIEW-codex-scoring.md.
import { readdir, readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import YAML from 'yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2), books = new Set();
let out = path.join(ROOT, '.cache/review');
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out') {
    if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error('--out needs a directory');
    out = path.resolve(args[++i]);
  } else if (/^[a-z0-9-]+$/.test(args[i])) books.add(args[i]);
  else throw new Error(`Unknown argument: ${args[i]}`);
}
const RUBRIC = 'prose-v1';
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const list = async (dir) => {
  try { return await readdir(dir, { withFileTypes: true }); }
  catch (e) { if (e.code === 'ENOENT') return []; throw e; }
};
const fail = (file, message) => { throw new Error(`${path.relative(ROOT, file)}: ${message}`); };
const rate = (r, body, file, label) => {
  if (!r || !Number.isInteger(r.rating) || r.rating < 0 || r.rating > 3) fail(file, `${label}: invalid rating`);
  if (typeof r.reason !== 'string' || !r.reason.trim()) fail(file, `${label}: missing explanation`);
  if (typeof r.evidence !== 'string' || !r.evidence.trim() || !body.includes(r.evidence)) fail(file, `${label}: evidence is not an exact body excerpt`);
  if (r.rating >= 2 && (typeof r.revision_needed !== 'string' || !r.revision_needed.trim())) fail(file, `${label}: missing revision needed`);
};
const checkpoints = [], pending = [];
const dirs = await list(path.join(out, 'checkpoints'));
for (const dir of dirs.filter((d) => d.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
  if (books.size && !books.has(dir.name)) continue;
  for (const entry of (await list(path.join(out, 'checkpoints', dir.name))).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isFile() || !/^\d+\.json$/.test(entry.name)) continue;
    const file = path.join(out, 'checkpoints', dir.name, entry.name);
    const r = JSON.parse(await readFile(file, 'utf8'));
    if (r.book !== dir.name || !Number.isInteger(r.chapter) || r.chapter < 1 || Number(entry.name.replace('.json', '')) !== r.chapter) fail(file, 'chapter identity mismatch');
    if (r.schema_version !== 1 || r.rubric_version !== RUBRIC) fail(file, 'schema or rubric version mismatch; reassess before aggregating');
    if (r.status !== 'complete') { pending.push(`${r.book} ${r.chapter}: ${r.status ?? 'unreviewed'}`); continue; }
    const source = path.join(ROOT, 'content', r.book, 'chapters', `${String(r.chapter).padStart(2, '0')}.yaml`);
    const bytes = await readFile(source);
    if (hash(bytes) !== r.chapter_sha256) fail(file, 'chapter changed; reassess before aggregating');
    const ch = YAML.parse(bytes.toString('utf8'));
    if (ch.chapter !== r.chapter) fail(file, 'source chapter identity mismatch');
    if (!Array.isArray(r.notes) || r.notes.length !== (ch.notes ?? []).length) fail(file, 'incomplete note coverage');
    if (!r.model || !r.reasoning || !r.reviewed_at) fail(file, 'missing review provenance');
    const indices = new Set();
    for (const n of r.notes) {
      if (!Number.isInteger(n.index) || indices.has(n.index) || !ch.notes?.[n.index]) fail(file, 'duplicate or invalid note index');
      indices.add(n.index);
      const original = ch.notes[n.index];
      for (const key of ['ref', 'title', 'kind']) if (n[key] !== original[key]) fail(file, `note ${n.index}: ${key} mismatch`);
      rate(n, String(original.body ?? ''), file, n.title);
    }
    for (const field of ['setting', 'thread']) {
      if (!String(ch[field] ?? '').trim()) {
        if (r.sections?.[field]?.status !== 'missing') fail(file, `${field}: missing section must be labeled missing`);
      } else rate(r.sections?.[field], String(ch[field]), file, field);
    }
    if (checkpoints.some((c) => c.book === r.book && c.chapter === r.chapter)) fail(file, 'duplicate chapter checkpoint');
    checkpoints.push(r);
  }
}
if (!checkpoints.length) throw new Error('No completed checkpoints found for the requested books');
for (const book of books) if (!checkpoints.some((r) => r.book === book) && !pending.some((r) => r.startsWith(`${book} `))) throw new Error(`No checkpoints found for ${book}`);
const notes = checkpoints.flatMap((r) => r.notes.map((n) => ({ book: r.book, chapter: r.chapter, ...n, model: r.model, reasoning: r.reasoning, rubric_version: r.rubric_version })));
const chapterRows = checkpoints.map((r) => {
  const counts = [0, 1, 2, 3].map((k) => r.notes.filter((n) => n.rating === k).length);
  return [r.book, r.chapter, `${r.notes.length}/${r.notes.length}`, counts[2], counts[3], counts[2] + counts[3], r.notes.length ? ((counts[2] + counts[3]) * 100 / r.notes.length).toFixed(1) : 'N/A', r.sections.setting.rating ?? 'missing', r.sections.thread.rating ?? 'missing'];
});
const bookRows = await Promise.all([...new Set(checkpoints.map((r) => r.book))].map(async (book) => {
  const ns = notes.filter((n) => n.book === book), counts = [0, 1, 2, 3].map((k) => ns.filter((n) => n.rating === k).length);
  const total = (await list(path.join(ROOT, 'content', book, 'chapters'))).filter((f) => f.isFile() && /^\d+\.yaml$/.test(f.name)).length;
  const reviewed = checkpoints.filter((r) => r.book === book).length;
  return [book, `${reviewed}/${total}`, total - reviewed, ns.length, ...counts, ns.length ? ((counts[2] + counts[3]) * 100 / ns.length).toFixed(1) : 'N/A'];
}));
const mdCell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
const table = (headers, rows) => [headers, headers.map(() => '---'), ...rows].map((row) => `| ${row.map(mdCell).join(' | ')} |`).join('\n');
const csv = (rows) => rows.map((row) => row.map((s) => `"${String(s ?? '').replace(/"/g, '""')}"`).join(',')).join('\n') + '\n';
const chapterHeaders = ['Book', 'Ch.', 'Notes reviewed / total', 'Revise (2)', 'Rebuild (3)', 'Needs revision (2–3)', 'Needs revision %', 'Setting', 'Thread'];
const bookHeaders = ['Book', 'Chapters reviewed / available', 'Chapters remaining', 'Notes reviewed', 'Keep (0)', 'Polish (1)', 'Revise (2)', 'Rebuild (3)', 'Needs revision %'];
const flagged = notes.filter((n) => n.rating >= 2).sort((a, b) => b.rating - a.rating || a.book.localeCompare(b.book) || a.chapter - b.chapter || a.index - b.index);
const report = [
  '# Chapter prose review', '',
  `Generated ${new Date().toISOString()}. Rubric ${RUBRIC}.`, '',
  '0 Keep: connected answer; 1 Polish: explanation works with local weaknesses; 2 Revise: reader must assemble the explanation; 3 Rebuild: no clear answer or progression.', '',
  'Editorial judgments, not mechanical scores or a doctrinal/source audit. Quotations, length, multiple witnesses, and legitimate uncertainty are not faults by themselves. Counts describe reviewed chapters only and are not estimates for unreviewed books or the site. Setting and thread are separate from note counts. No content revisions are authorized by these ratings.', '',
  '## Coverage', '', `Completed chapters: ${checkpoints.length}; notes: ${notes.length}; needs revision: ${flagged.length} (${notes.length ? (flagged.length * 100 / notes.length).toFixed(1) : 'N/A'}%).`, '',
  pending.length ? `Partial/unreviewed checkpoints: ${pending.join('; ')}.` : 'No partial checkpoints found. Chapters without checkpoints remain unreviewed.', '',
  'Pilot decisions, validation status, remaining chapters, and the next-stage handoff are recorded in HANDOFF.md alongside this report.', '',
  '## Notes needing revision', '',
  table(['Book', 'Ch.', 'Ref', 'Note (title)', 'Kind', 'Rating', 'Evidence passage', 'Revision needed'], flagged.map((n) => [n.book, n.chapter, n.ref, n.title, n.kind, n.rating, n.evidence, n.revision_needed])), '',
  '## Chapters', '', table(chapterHeaders, chapterRows), '',
  '## Books (reviewed chapters only)', '', table(bookHeaders, bookRows), '',
  '## Chapter sections', '', table(['Book', 'Ch.', 'Section', 'Rating', 'Evidence', 'Reason', 'Revision needed'], checkpoints.flatMap((r) => ['setting', 'thread'].map((field) => [r.book, r.chapter, field, r.sections[field].rating ?? 'missing', r.sections[field].evidence, r.sections[field].reason, r.sections[field].revision_needed]))), '',
  '## Suspected substantive issues (unverified)', '',
  ...checkpoints.flatMap((r) => (r.substantive_issues ?? []).map((issue) => `- ${r.book} ${r.chapter}: ${typeof issue === 'string' ? issue : JSON.stringify(issue)}`)), '',
].join('\n');
await mkdir(out, { recursive: true });
const atomic = async (name, data) => {
  const dest = path.join(out, name), temp = `${dest}.${process.pid}.tmp`;
  await writeFile(temp, data); await rename(temp, dest);
};
const fields = ['book', 'chapter', 'index', 'ref', 'title', 'kind', 'rating', 'evidence', 'reason', 'revision_needed', 'model', 'reasoning', 'rubric_version'];
await atomic('note-scores.md', report);
await atomic('note-scores.csv', csv([fields, ...notes.map((n) => fields.map((f) => n[f]))]));
await atomic('chapter-priorities.csv', csv([chapterHeaders, ...chapterRows]));
console.log(table(bookHeaders, bookRows));
console.log(`\n${checkpoints.length} chapters; ${notes.length} notes; ${flagged.length} need revision. Partial checkpoints: ${pending.length}.`);
