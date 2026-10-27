#!/usr/bin/env node
// Calibrated independent readings, then adjudication of recorded prose diagnoses.
// Models judge prose; this script selects, fingerprints, validates and reports.
import { readFile, writeFile, mkdir, rename, readdir } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '.cache/review/second-pass');
const MODEL = 'gpt-6.1-sol', PROTOCOL = 'calibrated-adjudication-v1';
const args = process.argv.slice(2);
let prepareOnly = false, reportOnly = false, shard = { index: 1, count: 1 }, batchSize = 8, maxBatches = Infinity, retryAt = null;
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--prepare') prepareOnly = true;
  else if (arg === '--report') reportOnly = true;
  else if (arg === '--shard') {
    const m = String(args[++i]).match(/^(\d+)\/(\d+)$/);
    if (!m || +m[1] < 1 || +m[1] > +m[2]) throw Error('--shard needs index/count');
    shard = { index: +m[1], count: +m[2] };
  } else if (['--batch-size', '--max-batches', '--retry-at'].includes(arg)) {
    const n = Number(args[++i]);
    if (!Number.isInteger(n) || n < 1) throw Error(`${arg} needs a positive integer`);
    if (arg === '--batch-size') batchSize = n;
    else if (arg === '--max-batches') maxBatches = n;
    else retryAt = n * 1000;
  } else if (arg === '--help') {
    console.log('Usage: node scripts/refine-note-scores.mjs [--prepare | --report] [--shard 1/3] [--batch-size 8] [--max-batches N] [--retry-at <verified reset epoch seconds>]');
    process.exit(0);
  } else throw Error(`Unknown argument ${arg}`);
}
const text = (f) => readFile(f, 'utf8');
const json = async (f) => JSON.parse(await text(f));
const sha = (v) => createHash('sha256').update(v).digest('hex');
const pad = (n) => String(n).padStart(2, '0');
const key = (n) => `${n.book}/${n.chapter}/${n.index}`;
const stem = (n) => `${n.book}-${pad(n.chapter)}-${pad(n.index)}`;
const atomic = async (file, value) => {
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`);
  await rename(tmp, file);
};
const optional = async (f) => { try { return await json(f); } catch (e) { if (e.code === 'ENOENT') return null; throw e; } };
const calibrationBytes = await readFile(path.join(ROOT, '.cache/review/calibration.json'));
const calibration = JSON.parse(calibrationBytes.toString());
const calibrationSha = sha(calibrationBytes);
const [authoring, standards] = await Promise.all(['AUTHORING.md', 'STANDARDS.md'].map((f) => text(path.join(ROOT, f))));
const sources = new Map(), briefs = new Map();
async function source(book, chapter) {
  const id = `${book}/${chapter}`;
  if (!sources.has(id)) {
    const bytes = await readFile(path.join(ROOT, 'content', book, 'chapters', `${pad(chapter)}.yaml`));
    const parsed = YAML.parse(bytes.toString());
    if (parsed.chapter !== chapter) throw Error(`${id}: source identity mismatch`);
    sources.set(id, { bytes, ch: parsed, hash: sha(bytes) });
  }
  return sources.get(id);
}
async function brief(book) {
  if (!briefs.has(book)) briefs.set(book, await text(path.join(ROOT, 'content', book, 'BRIEF.md')));
  return briefs.get(book);
}
const anchors = [];
for (const a of calibration.anchors) {
  const s = await source(a.book, a.chapter);
  if (s.hash !== a.chapter_sha256 || s.ch.notes[a.index]?.title !== a.title) throw Error('Author anchor source changed');
  anchors.push({ ...a, note: s.ch.notes[a.index] });
}
const rubric = `Read the scripture companion for an academically trained non-specialist. Judge answer (does the note answer its question and explain evidence), progression (sentences develop the explanation), and integration (quotations and alternatives have clear relationships). Describe a necessary repair BEFORE assigning its rating. 0 Keep: connected answer, no necessary repair. 1 Polish: the explanation works with local wording, repetition or transition weaknesses. 2 Revise: useful material but substantive missing reasoning, organization, disconnected evidence or off-topic material obstructs the explanation. 3 Rebuild: source findings without a clear answer or progression. An improvement that could be made does not establish a necessary repair. Do not penalize length, useful symbolic repetition, multiple witnesses, legitimate uncertainty or qualifications alone. Do not demand every inference be spelled out, or force a conclusion between legitimate readings. Name the actual missing connection or answer and check whether the note already supplies it. Material relevant to the surrounding episode can still be off-topic for the particular note. A subtle transition is not a substantive gap when the explanation already works. Use the author's four anchors below. This is a prose review, not a source or doctrinal audit. Edit no commentary, and do not propose deleting notes or chapter sections.`;

async function originalRecords() {
  const records = [];
  const dir = path.join(ROOT, '.cache/review/book-reviews');
  for (const book of (await readdir(dir)).sort()) {
    let files;
    try { files = await readdir(path.join(dir, book, 'checkpoints', book)); }
    catch (e) { if (e.code === 'ENOENT') continue; throw e; }
    for (const f of files.filter((v) => /^\d+\.json$/.test(v)).sort()) {
      const cp = await json(path.join(dir, book, 'checkpoints', book, f));
      const s = await source(book, cp.chapter);
      if (cp.book !== book || Number(f.replace('.json', '')) !== cp.chapter || cp.model !== 'gpt-6-luna' || cp.reasoning !== 'high' || cp.rubric_version !== 'prose-v1-calibrated-1' || cp.status !== 'complete' || cp.chapter_sha256 !== s.hash || !Array.isArray(cp.notes) || cp.notes.length !== (s.ch.notes ?? []).length || new Set(cp.notes.map((n) => n.index)).size !== cp.notes.length) throw Error(`${book} ${f}: original review stale or incomplete`);
      for (const n of cp.notes) {
        const actual = s.ch.notes[n.index];
        if (!actual || ['ref', 'title', 'kind'].some((k) => n[k] !== actual[k]) || !Number.isInteger(n.rating) || n.rating < 0 || n.rating > 3) throw Error('Invalid original note');
        const original = { rating: n.rating, reason: n.reason, revision_needed: n.revision_needed, evidence: n.evidence };
        records.push({ book, chapter: cp.chapter, index: n.index, ref: n.ref, title: n.title, kind: n.kind, chapter_sha256: s.hash, original, original_sha256: sha(JSON.stringify(original)) });
      }
    }
  }
  return records;
}

await mkdir(OUT, { recursive: true });
let manifest = await optional(path.join(OUT, 'manifest.json'));
const originals = await originalRecords();
if (!manifest) {
  if (!prepareOnly) throw Error('Run --prepare once before starting workers');
  const candidates = originals.filter((n) => n.original.rating >= 2).map((n) => ({ ...n, scope: 'candidate' }));
  if (candidates.length !== 289) throw Error(`Expected the approved 289 candidates; found ${candidates.length}`);
  const prior = await json(path.join(ROOT, '.cache/review/sol-trial/manifest.json'));
  const excluded = new Set(prior.targets.map(key));
  const audit = [];
  for (const kind of [...new Set(originals.map((n) => n.kind))].sort()) {
    const pool = originals.filter((n) => n.kind === kind && n.original.rating < 2 && !excluded.has(key(n)))
      .sort((a, b) => sha(`second-pass-audit-2026-10-27:${key(a)}`).localeCompare(sha(`second-pass-audit-2026-10-27:${key(b)}`)));
    if (pool.length < 2) throw Error(`Insufficient fresh ${kind} audit notes`);
    audit.push(...pool.slice(0, 2).map((n) => ({ ...n, scope: 'audit' })));
  }
  manifest = { schema_version: 1, protocol_version: PROTOCOL, model: MODEL, reasoning: 'high', calibration_sha256: calibrationSha,
    authorized: '2026-10-27: go do the second pass; author will check in later. No content edits, purchases, reset credits or recurring schedule.',
    method: 'Two fresh contexts per batch: calibrated independent reading with original verdict withheld, then adjudication after the original diagnosis is revealed. Reuse matching completed trial adjudications with their different initial calibration conditions explicitly retained. Sixteen new unflagged audit notes, two per kind, selected by deterministic SHA-256 ordering; not proportional or population-random sampling.',
    created_at: new Date().toISOString(), targets: [...candidates, ...audit] };
  await atomic(path.join(OUT, 'manifest.json'), manifest);
  await atomic(path.join(OUT, 'calibration.json'), calibrationBytes.toString());
}
if (manifest.protocol_version !== PROTOCOL || manifest.calibration_sha256 !== calibrationSha || manifest.model !== MODEL) throw Error('Manifest protocol/model/calibration changed');
for (const n of manifest.targets) {
  const actual = originals.find((v) => key(v) === key(n));
  if (!actual || actual.chapter_sha256 !== n.chapter_sha256 || actual.original_sha256 !== n.original_sha256) throw Error(`${key(n)}: source or original judgment changed; reassess explicitly`);
}

function rawPath(phase, n) { return path.join(OUT, 'raw', phase, `${stem(n)}.json`); }
function cpPath(n) { return path.join(OUT, 'checkpoints', `${stem(n)}.json`); }
async function inputHash(phase, n, reading) {
  return sha(JSON.stringify({ protocol: PROTOCOL, phase, source: n.chapter_sha256, calibration: calibrationSha, guidance: sha(authoring + standards + await brief(n.book)), original: phase === 'adjudicated' ? n.original_sha256 : null, reading: reading ?? null }));
}
function validateJudgment(r, n, s, final = false) {
  if (!r || !Number.isInteger(r.rating) || r.rating < 0 || r.rating > 3 || typeof r.reason !== 'string' || !r.reason.trim() || typeof r.repair_diagnosis !== 'string' || !r.repair_diagnosis.trim()) throw Error(`${key(n)}: invalid diagnosis/rating`);
  if (typeof r.evidence !== 'string' || !r.evidence.trim() || !s.ch.notes[n.index].body.includes(r.evidence)) throw Error(`${key(n)}: evidence not an exact source excerpt`);
  if (r.rating >= 2 && (typeof r.revision_needed !== 'string' || !r.revision_needed.trim())) throw Error(`${key(n)}: missing substantive repair`);
  if (final) {
    if (!['clear_revision', 'polish_keep', 'unresolved'].includes(r.decision) || (r.decision === 'clear_revision' && r.rating < 2) || (r.decision === 'polish_keep' && r.rating >= 2)) throw Error(`${key(n)}: inconsistent grouping`);
    for (const field of ['diagnosis_assessment', 'change_from_reading']) if (typeof r[field] !== 'string' || !r[field].trim()) throw Error(`${key(n)}: missing ${field}`);
    if (r.decision === 'unresolved' && (typeof r.unresolved_question !== 'string' || !r.unresolved_question.trim())) throw Error(`${key(n)}: missing unresolved alternatives`);
    if (!['none', 'relevance', 'missing_connection', 'missing_answer', 'organization', 'local_wording'].includes(r.issue_category)) throw Error(`${key(n)}: invalid issue category`);
  }
}
async function validRaw(phase, n, reading = null) {
  let r;
  try { r = await optional(rawPath(phase, n)); }
  catch (e) { if (e instanceof SyntaxError) return null; throw e; }
  if (!r) return null;
  try {
    for (const field of ['book', 'chapter', 'index', 'ref', 'title', 'kind', 'chapter_sha256']) if (r[field] !== n[field]) throw Error(`identity ${field}`);
    if (r.schema_version !== 1 || r.protocol_version !== PROTOCOL || r.phase !== phase || r.model !== MODEL || r.reasoning !== 'high' || r.calibration_sha256 !== calibrationSha || r.input_sha256 !== await inputHash(phase, n, reading) || !r.reviewed_at) throw Error('provenance/input fingerprint');
    validateJudgment(r, n, await source(n.book, n.chapter), phase === 'adjudicated');
    return r;
  } catch (e) { return null; }
}
async function complete(n) {
  const cp = await optional(cpPath(n));
  if (!cp) return null;
  if (cp.protocol_version !== PROTOCOL || cp.calibration_sha256 !== calibrationSha || cp.original_sha256 !== n.original_sha256 || cp.chapter_sha256 !== n.chapter_sha256 || key(cp) !== key(n) || cp.status !== 'complete' || cp.model !== MODEL || cp.reasoning !== 'high' || ['ref', 'title', 'kind'].some((field) => cp[field] !== n[field])) throw Error(`${key(n)}: stale or invalid completed checkpoint`);
  validateJudgment(cp.adjudication, n, await source(n.book, n.chapter), true);
  if (cp.provenance === 'sol-trial') return cp;
  const reading = await validRaw('reading', n), final = reading && await validRaw('adjudicated', n, reading);
  if (!reading || !final || sha(JSON.stringify(final)) !== cp.final_sha256) return null;
  return cp;
}
async function importTrial() {
  const trial = await optional(path.join(ROOT, '.cache/review/sol-trial/comparison.json'));
  if (!trial) return;
  const trialPrompt = await text(path.join(ROOT, '.cache/review/sol-trial/prompt-adjudicated-1.txt'));
  if (!trialPrompt.includes(JSON.stringify(anchors, null, 2))) throw Error('Trial did not use the current complete author anchors; do not import it');
  for (const n of manifest.targets.filter((v) => v.scope === 'candidate')) {
    if (await optional(cpPath(n))) continue;
    const t = trial.notes.find((v) => key(v) === key(n) && v.chapter_sha256 === n.chapter_sha256);
    if (!t) continue;
    const mapped = { ...t, change_from_reading: t.change_from_blind, issue_category: t.rating >= 2 ? (n.kind === 'history' ? 'relevance' : 'missing_connection') : t.rating === 1 ? 'local_wording' : 'none' };
    validateJudgment(mapped, n, await source(n.book, n.chapter), true);
    await atomic(cpPath(n), { ...n, schema_version: 1, protocol_version: PROTOCOL, calibration_sha256: calibrationSha, model: MODEL, reasoning: 'high', status: 'complete', provenance: 'sol-trial',
      provenance_note: 'Accepted completed small trial; its blind stage withheld author verdicts and its final stage used all four anchors. Not claimed to follow the new calibrated first-reading protocol.',
      author_confirmed: t.author_rating !== undefined, reading: { rating: t.blind_rating }, adjudication: mapped, reviewed_at: t.reviewed_at });
  }
}
if (prepareOnly) await importTrial();

const csv = (rows) => rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n') + '\n';
const table = (heads, rows) => [heads, heads.map(() => '---'), ...rows].map((r) => `| ${r.map((v) => String(v ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')).join(' | ')} |`).join('\n');
async function report() {
  const all = [];
  for (const n of manifest.targets) all.push({ n, cp: await complete(n) });
  const candidates = all.filter(({ n }) => n.scope === 'candidate'), audits = all.filter(({ n }) => n.scope === 'audit');
  const done = candidates.filter(({ cp }) => cp), auditDone = audits.filter(({ cp }) => cp);
  const group = (list, decision) => list.filter(({ cp }) => cp?.adjudication.decision === decision);
  const retained = group(done, 'clear_revision'), dropped = group(done, 'polish_keep'), unresolved = group(done, 'unresolved');
  const heads = ['book', 'chapter', 'index', 'ref', 'title', 'kind', 'scope', 'status', 'initial_rating', 'reading_rating', 'final_rating', 'decision', 'issue_category', 'evidence', 'repair_diagnosis', 'revision_needed', 'diagnosis_assessment', 'change_from_reading', 'unresolved_question', 'author_confirmed', 'provenance'];
  const rows = all.map(({ n, cp }) => { const a = cp?.adjudication; return [n.book, n.chapter, n.index, n.ref, n.title, n.kind, n.scope, cp ? 'complete' : 'unreviewed', n.original.rating, cp?.reading.rating, a?.rating, a?.decision, a?.issue_category, a?.evidence, a?.repair_diagnosis, a?.revision_needed, a?.diagnosis_assessment, a?.change_from_reading, a?.unresolved_question, cp?.author_confirmed ?? false, cp?.provenance]; });
  const render = (list) => table(['Book', 'Ch.', 'Ref', 'Note', 'Rating', 'Evidence', 'Needed repair / judgment'], list.map(({ n, cp }) => [n.book, n.chapter, n.ref, n.title, cp.adjudication.rating, cp.adjudication.evidence, cp.adjudication.revision_needed || cp.adjudication.reason]));
  const byBook = [...new Set(candidates.map(({ n }) => n.book))].sort().map((book) => { const list = candidates.filter(({ n }) => n.book === book), completed = list.filter(({ cp }) => cp); return [book, `${completed.length}/${list.length}`, group(completed, 'clear_revision').length, group(completed, 'polish_keep').length, group(completed, 'unresolved').length]; });
  const changes = done.filter(({ cp }) => cp.reading.rating !== undefined && (cp.reading.rating >= 2) !== (cp.adjudication.rating >= 2));
  const newChanges = changes.filter(({ cp }) => cp.provenance === 'two-stage-second-pass');
  const md = ['# Second pass on chapter-note revision candidates', '', `Generated ${new Date().toISOString()}. Model ${MODEL}, High. Protocol ${PROTOCOL}.`, '',
    `Candidate coverage: **${done.length}/${candidates.length}**. Clear revision recommendations: **${retained.length}**; polish/keep: **${dropped.length}**; unresolved: **${unresolved.length}**. Unreviewed: ${candidates.length - done.length}.`, '',
    `Fresh unflagged audit: ${auditDone.length}/${audits.length}; newly recommended revisions: ${group(auditDone, 'clear_revision').length}; unresolved: ${group(auditDone, 'unresolved').length}. Audit findings are separate from the original 289 candidates.`, '',
    'Editorial judgments, not verified defects or rewrite authorization. Original corpus ratings remain unchanged. Each new batch has a calibrated independent reading with the original objection withheld, followed by adjudication after that objection is revealed. Matching completed trial judgments are reused with their distinct conditions recorded. Agreement after revelation is not independent validation. The small stratified audit cannot estimate a site-wide omission rate. No commentary edits, source audit, setting/thread re-review, or volume drift check are included.', '',
    `Threshold changes between calibrated first reading and adjudication in new candidate readings: ${newChanges.length}. Changes among reused trial readings, whose first phase lacked author verdicts: ${changes.length - newChanges.length}. Imported trial controls are known author judgments; reproducing them is not validation. See manifest.json, raw/, checkpoints/ and HANDOFF.md for provenance and resuming.`, '',
    '## Clear revision recommendations', '', render(retained), '',
    '## Polish or keep', '', render(dropped), '',
    '## Unresolved cases, grouped by issue', '',
    ...['relevance', 'missing_connection', 'missing_answer', 'organization', 'local_wording', 'none'].flatMap((category) => { const list = unresolved.filter(({ cp }) => cp.adjudication.issue_category === category); return list.length ? [`### ${category}`, '', table(['Book', 'Ch.', 'Note', 'Choice to settle'], list.map(({ n, cp }) => [n.book, n.chapter, n.title, cp.adjudication.unresolved_question])), ''] : []; }),
    '## Fresh audit of unflagged notes', '', render(auditDone), '',
    '## Coverage by book', '', table(['Book', 'Reviewed / candidates', 'Clear revision', 'Polish/keep', 'Unresolved'], byBook), '',
    'Full identities, both ratings, diagnoses, changes and original objections are preserved in results.csv and the structured checkpoints. Unreviewed notes have blank second-pass ratings, never zero.', ''].join('\n');
  await atomic(path.join(OUT, 'results.csv'), csv([heads, ...rows]));
  await atomic(path.join(OUT, 'REPORT.md'), md);
  const chapters = new Map();
  for (const { n, cp } of candidates) { const id = `${n.book}/${n.chapter}`; if (!chapters.has(id)) chapters.set(id, { book: n.book, chapter: n.chapter, total: 0, reviewed: 0, clear: 0, polish: 0, unresolved: 0 }); const c = chapters.get(id); c.total++; if (cp) { c.reviewed++; if (cp.adjudication.decision === 'clear_revision') c.clear++; else if (cp.adjudication.decision === 'polish_keep') c.polish++; else c.unresolved++; } }
  await atomic(path.join(OUT, 'chapter-priorities.csv'), csv([['book', 'chapter', 'original_candidates', 'candidates_reviewed', 'clear_revision', 'polish_keep', 'unresolved'], ...[...chapters.values()].map((c) => [c.book, c.chapter, c.total, c.reviewed, c.clear, c.polish, c.unresolved])]));
  const summary = { candidate_total: candidates.length, candidate_complete: done.length, clear_revision: retained.length, polish_keep: dropped.length, unresolved: unresolved.length, audit_total: audits.length, audit_complete: auditDone.length, audit_new_flags: group(auditDone, 'clear_revision').length, audit_unresolved: group(auditDone, 'unresolved').length, threshold_changes: changes.length, new_threshold_changes: newChanges.length, trial_threshold_changes: changes.length - newChanges.length, updated_at: new Date().toISOString() };
  await atomic(path.join(OUT, 'summary.json'), summary);
  return summary;
}
if (prepareOnly || reportOnly) { console.log(JSON.stringify(await report())); process.exit(0); }

// Whole books are assigned by deterministic greedy load balancing; workers never
// share targets. Keep the same shard count when resuming a concurrent run.
const bookSizes = [...new Set(manifest.targets.map((n) => n.book))].map((book) => ({ book, size: manifest.targets.filter((n) => n.book === book).length })).sort((a, b) => b.size - a.size || a.book.localeCompare(b.book));
const buckets = Array.from({ length: shard.count }, () => ({ size: 0, books: [] }));
for (const b of bookSizes) { const bucket = buckets.reduce((a, c) => c.size < a.size ? c : a); bucket.books.push(b.book); bucket.size += b.size; }
const selected = manifest.targets.filter((n) => buckets[shard.index - 1].books.includes(n.book)).sort((a, b) => a.book.localeCompare(b.book) || a.chapter - b.chapter || a.index - b.index);
const runDir = path.join(OUT, 'run', `shard-${shard.index}-of-${shard.count}`);
await mkdir(runDir, { recursive: true });
async function queue(state) {
  const pending = [];
  for (const n of selected) if (!await complete(n)) pending.push(key(n));
  await atomic(path.join(runDir, 'queue.json'), { shard, protocol: PROTOCOL, updated_at: new Date().toISOString(), ...state, remaining: pending });
  return pending;
}
async function buildPrompt(phase, batch, readings) {
  const book = batch[0].book;
  const expected = [];
  for (const n of batch) expected.push({ book: n.book, chapter: n.chapter, index: n.index, ref: n.ref, title: n.title, kind: n.kind, chapter_sha256: n.chapter_sha256, input_sha256: await inputHash(phase, n, readings?.get(key(n)) ?? null), destination: path.relative(ROOT, rawPath(phase, n)) });
  const context = [];
  for (const chapter of [...new Set(batch.map((n) => n.chapter))]) {
    const s = await source(book, chapter);
    const verses = (await json(path.join(ROOT, 'data/kjv', `${book}.json`))).chapters[chapter - 1];
    context.push(`===== content/${book}/chapters/${pad(chapter)}.yaml (SHA-256 ${s.hash}) =====\n${s.bytes.toString()}\nSCRIPTURE\n${verses.map((v, i) => `${i + 1} ${v}`).join('\n')}`);
  }
  const revealed = phase === 'adjudicated' ? batch.map((n) => ({ book: n.book, chapter: n.chapter, index: n.index, sealed_reading: readings.get(key(n)), original_assessment: n.original })) : null;
  return `You are the authorized GPT-6.1 Sol High prose reviewer. This is a small assigned batch from a staged second pass. Use ONLY the supplied material. Do not inspect any earlier review files, logs, calibration history, git history or unassigned checkpoints. No web, agents, source audits, content edits or document edits. Write only the exact per-note JSON destinations below, atomically (temporary file then rename). Prepare the small assigned batch, then use one local execution call to validate and atomically save its completed per-note records. Do not make separate execution calls for each note: those calls resend the long context and waste allowance. The one call may read only the assigned source YAML files to check exact excerpts; save each record atomically. If unable to finish the batch, save its completed records together. No other file may be edited.\n\nPHASE: ${phase}\n${phase === 'reading' ? 'The original verdicts and selection strata are withheld. Judge the source independently under the supplied author anchors. Do not guess which notes were previously flagged.' : 'The independent calibrated reading is sealed. Now assess the original objection against the source. Do not vote or defer to a verdict merely because it was recorded. Explain whether the specific objection holds or fails and whether the supposedly missing relationship is already present. Explain any change from the sealed reading. The author anchors settle their own notes and guide the standard, but do not mechanically determine other labels.'}\n\nRUBRIC\n${rubric}\n\nAUTHOR ANCHORS\n${JSON.stringify(anchors, null, 2)}\n\nEXACT ASSIGNMENTS\n${JSON.stringify(expected, null, 2)}\n\nOUTPUT SCHEMA per destination\n{schema_version:1,protocol_version:'${PROTOCOL}',phase:'${phase}',model:'${MODEL}',reasoning:'high',calibration_sha256:'${calibrationSha}',input_sha256:'exact assignment hash',book,chapter,index,ref,title,kind,chapter_sha256,repair_diagnosis,rating,evidence,reason,revision_needed,reviewed_at:'ISO timestamp'${phase === 'adjudicated' ? ",decision,issue_category,diagnosis_assessment,change_from_reading,unresolved_question" : ',uncertainty'}}. Preserve every assignment identity exactly. Include a substantive repair diagnosis BEFORE rating integer 0..3; say no necessary repair if appropriate. Evidence must be a SHORT EXACT contiguous source body excerpt, copied without ellipses, changed URLs or punctuation. For 2/3 state what a substantive repair must accomplish. For 0 revision_needed is empty; 1 may name local polish. ${phase === 'adjudicated' ? "decision is 'clear_revision' for a definite 2/3, 'polish_keep' for 0/1, or 'unresolved' for a genuine unresolved author taste/standard choice. Disagreement alone is not a question: decide what the anchors and standard settle. For unresolved_question specify the two wording/standard alternatives and a recommendation, otherwise empty. issue_category is one of none, relevance, missing_connection, missing_answer, organization, local_wording. diagnosis_assessment must explain concretely why the original objection holds or fails; change_from_reading must explain any changed judgment or state unchanged. Do not mistake contextual relevance for a contribution to the particular note, and do not demand a link the text already supplies." : 'uncertainty names an actual ambiguity or is empty; do not evade a judgment.'}\n\n${revealed ? `SEALED READING AND ORIGINAL OBJECTIONS\n${JSON.stringify(revealed, null, 2)}\n\n` : ''}AUTHORING\n${authoring}\n\nSTANDARDS\n${standards}\n\nBOOK BRIEF\n${await brief(book)}\n\nFULL CHAPTERS AND SCRIPTURE\n${context.join('\n\n')}\n\nSave exactly ${batch.length} per-note records at the assigned destinations. Validate identities and exact excerpt membership locally using only the provided source text. If unable to finish, save completed notes and state the limitation. Do not touch the original scores or commentary.`;
}
async function callModel(prompt, phase, batch) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const log = path.join(runDir, `${stamp}-${phase}-${stem(batch[0])}.log`);
  const fd = createWriteStream(log, { flags: 'wx' });
  const start = Date.now();
  const code = await new Promise((resolve, reject) => {
    const child = spawn('codex', ['exec', '-m', MODEL, '-c', 'model_reasoning_effort="high"', '--sandbox', 'workspace-write', '--ephemeral', '-C', ROOT, '-'], { cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'] });
    child.stdout.pipe(fd, { end: false }); child.stderr.pipe(fd, { end: false });
    child.on('error', reject); child.on('close', resolve); child.stdin.on('error', () => {}); child.stdin.end(prompt);
  }).finally(() => new Promise((resolve) => fd.end(resolve)));
  return { code, log: path.relative(ROOT, log), seconds: Math.round((Date.now() - start) / 1000) };
}

let batches = 0;
const repairAttempts = new Map();
try {
  while (batches < maxBatches) {
    const pending = [];
    for (const n of selected) if (!await complete(n)) pending.push(n);
    if (!pending.length) break;
    const book = pending[0].book;
    const batch = pending.filter((n) => n.book === book).slice(0, batchSize);
    const readings = new Map();
    for (const n of batch) { const r = await validRaw('reading', n); if (r) readings.set(key(n), r); }
    const phase = readings.size === batch.length ? 'adjudicated' : 'reading';
    const assigned = phase === 'reading' ? batch.filter((n) => !readings.has(key(n))) : [];
    if (phase === 'adjudicated') for (const n of batch) if (!await validRaw('adjudicated', n, readings.get(key(n)))) assigned.push(n);
    if (assigned.length) {
      const prompt = await buildPrompt(phase, assigned, readings);
      console.log(`Starting ${phase}: ${book}, ${assigned.length} notes (${batches + 1})`);
      const result = await callModel(prompt, phase, assigned);
      if (result.code !== 0) {
        const logText = await text(path.join(ROOT, result.log));
        if (/hit your usage limit|usage_limit_reached/i.test(logText)) {
          const verifiedReset = retryAt && retryAt + 30000 > Date.now();
          const nextCheck = verifiedReset ? retryAt + 30000 : Date.now() + 30 * 60000;
          await queue({ state: 'waiting-for-natural-reset', retry_at: new Date(nextCheck).toISOString(), verified_reset: Boolean(verifiedReset), ...result });
          await report();
          console.log(verifiedReset
            ? `Usage blocked; retaining progress until verified natural reset ${new Date(nextCheck).toISOString()}`
            : `Usage blocked; progress saved. Checking ordinary availability again after ${new Date(nextCheck).toISOString()}; no reset credits or purchases.`);
          while (Date.now() < nextCheck) await new Promise((resolve) => setTimeout(resolve, Math.min(60000, nextCheck - Date.now())));
          continue;
        }
        throw Error(`CLI failed; see ${result.log}`);
      }
      let invalid = false;
      for (const n of assigned) if (!await validRaw(phase, n, phase === 'adjudicated' ? readings.get(key(n)) : null)) {
        const id = `${phase}:${key(n)}`, attempts = (repairAttempts.get(id) ?? 0) + 1;
        repairAttempts.set(id, attempts);
        if (attempts > 2) throw Error(`Persistent validation failure ${id}; see ${result.log}`);
        invalid = true;
        console.log(`Invalid ${id}; preserving valid notes and retrying the failed record.`);
      }
      await queue({ state: invalid ? 'retry-invalid' : 'saved-phase', phase, book, assigned: assigned.map(key), ...result });
    }
    if (phase === 'adjudicated') {
      for (const n of batch) {
        const final = await validRaw('adjudicated', n, readings.get(key(n)));
        if (!final) continue;
        await atomic(cpPath(n), { ...n, schema_version: 1, protocol_version: PROTOCOL, calibration_sha256: calibrationSha, model: MODEL, reasoning: 'high', status: 'complete', provenance: 'two-stage-second-pass', author_confirmed: false, reading: readings.get(key(n)), adjudication: final, final_sha256: sha(JSON.stringify(final)), reviewed_at: final.reviewed_at });
      }
      batches++;
      const remaining = await queue({ state: 'saved-batch', book, batches });
      await report();
      console.log(`Saved ${book} adjudications; ${remaining.length} assigned notes remain.`);
    }
  }
  const remaining = await queue({ state: 'complete-or-batch-limit', batches });
  await report();
  console.log(remaining.length ? `Stopped at batch limit; ${remaining.length} assigned notes remain.` : 'All assigned second-pass notes are complete.');
} catch (e) {
  await queue({ state: 'stopped', error: e.message }).catch(() => {});
  console.error(e.message);
  process.exitCode = 1;
}
