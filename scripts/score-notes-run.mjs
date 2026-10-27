#!/usr/bin/env node
// Run calibrated prose ratings in fresh, single-book Luna High contexts.
// This coordinates the reader and validates saved checkpoints; it assigns no ratings.
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdir, readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECKPOINT_ROOT = path.join(ROOT, '.cache/review/book-reviews');
const CALIBRATION = path.join(ROOT, '.cache/review/calibration.json');
const RUBRIC_VERSION = 'prose-v1-calibrated-1';
const MODEL = 'gpt-6-luna';
const REASONING = 'high';
const args = process.argv.slice(2);
let selectedBook = null, batchSize = 5, maxBatches = Infinity, printOnly = false, shard = null;
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--book') {
    if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error('--book needs a book slug');
    selectedBook = args[++i];
  } else if (arg === '--batch-size') {
    batchSize = positiveInteger(args[++i], '--batch-size');
  } else if (arg === '--max-batches') {
    maxBatches = positiveInteger(args[++i], '--max-batches');
  } else if (arg === '--shard') {
    const match = String(args[++i] ?? '').match(/^(\d+)\/(\d+)$/);
    if (!match || +match[1] < 1 || +match[1] > +match[2]) throw new Error('--shard needs an index/count such as 1/3');
    shard = { index: +match[1], count: +match[2] };
  } else if (arg === '--print') printOnly = true;
  else if (arg === '--help' || arg === '-h') {
    console.log('Usage: node scripts/score-notes-run.mjs [--book <slug>] [--batch-size 5] [--max-batches N] [--shard 1/3] [--print]');
    process.exit(0);
  } else throw new Error(`Unknown argument: ${arg}`);
}
if (shard && selectedBook) throw new Error('--book and --shard cannot be combined');
const RUN_DIR = path.join(ROOT, '.cache/review/run', ...(shard ? [`shard-${shard.index}-of-${shard.count}`] : []));
function positiveInteger(value, flag) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) throw new Error(`${flag} needs a positive integer`);
  return n;
}
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const pad = (n) => String(n).padStart(2, '0');
const readText = (file) => readFile(file, 'utf8');
const list = async (dir) => {
  try { return await readdir(dir, { withFileTypes: true }); }
  catch (e) { if (e.code === 'ENOENT') return []; throw e; }
};
const atomicJson = async (file, data) => {
  await mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  await writeFile(temp, `${JSON.stringify(data, null, 2)}\n`);
  await rename(temp, file);
};

const calibrationBytes = await readFile(CALIBRATION);
const calibrationSha = hash(calibrationBytes);
const calibration = JSON.parse(calibrationBytes.toString('utf8'));
if (calibration.rubric_version !== 'prose-v1') throw new Error('calibration.json has an unexpected rubric_version');

async function chapterFiles(book) {
  const dir = path.join(ROOT, 'content', book, 'chapters');
  return (await list(dir))
    .filter((f) => f.isFile() && /^\d+\.yaml$/.test(f.name))
    .map((f) => Number(f.name.replace(/\.yaml$/, '')))
    .sort((a, b) => a - b);
}

async function booksToReview() {
  const dirs = (await list(path.join(ROOT, 'content'))).filter((d) => d.isDirectory());
  const books = [];
  for (const d of dirs) {
    if (selectedBook && d.name !== selectedBook) continue;
    const chapters = await chapterFiles(d.name);
    if (chapters.length) books.push({ book: d.name, chapters });
  }
  if (selectedBook && !books.length) throw new Error(`No existing chapter YAML files found for ${selectedBook}`);
  books.sort((a, b) => a.chapters.length - b.chapters.length || a.book.localeCompare(b.book));
  return shard ? books.filter((_, index) => index % shard.count === shard.index - 1) : books;
}

async function readSource(book, chapter) {
  const file = path.join(ROOT, 'content', book, 'chapters', `${pad(chapter)}.yaml`);
  const bytes = await readFile(file);
  const chapterYaml = YAML.parse(bytes.toString('utf8'));
  if (chapterYaml.chapter !== chapter) throw new Error(`${book} ${chapter}: chapter identity mismatch in source`);
  const scriptureFile = path.join(ROOT, 'data/kjv', `${book}.json`);
  const scripture = JSON.parse(await readText(scriptureFile));
  const verses = scripture.chapters?.[chapter - 1];
  if (!Array.isArray(verses)) throw new Error(`${book} ${chapter}: no scripture chapter in ${path.relative(ROOT, scriptureFile)}`);
  return { file, bytes, chapterYaml, verses };
}

async function checkpointState(book, chapter) {
  const file = path.join(CHECKPOINT_ROOT, book, 'checkpoints', book, `${pad(chapter)}.json`);
  let cp;
  try { cp = JSON.parse(await readText(file)); }
  catch (e) { if (e.code === 'ENOENT') return { file, done: false }; throw new Error(`${path.relative(ROOT, file)}: invalid JSON (${e.message})`); }
  const { bytes, chapterYaml } = await readSource(book, chapter);
  const commonMatch = cp.schema_version === 1 && cp.book === book && cp.chapter === chapter &&
    cp.status === 'complete' && cp.rubric_version === RUBRIC_VERSION && cp.chapter_sha256 === hash(bytes) &&
    cp.model === MODEL && cp.reasoning === REASONING;
  // Haggai's accepted first-stage files predate calibration_sha256. They were reviewed with the
  // original three anchors and retained after the author confirmed the new revision candidate.
  const acceptedLegacyHaggai = book === 'haggai' && cp.calibration_sha256 === undefined;
  if (commonMatch && (cp.calibration_sha256 === calibrationSha || acceptedLegacyHaggai)) {
    try {
      await repairEvidence(cp, chapterYaml, file);
      validateCheckpoint(cp, chapterYaml, file, { calibrationRequired: !acceptedLegacyHaggai });
      return { file, done: true, legacy: acceptedLegacyHaggai };
    } catch (error) {
      return { file, done: false, existing: cp, invalid: error.message };
    }
  }
  return { file, done: false, existing: cp };
}

// Recover the unique source span for typography/whitespace differences or a
// fragment's added final punctuation. Never change words or ratings; retain
// the original excerpt for audit. Unmatched revision evidence fails validation;
// keep/polish records may instead carry a labeled source opening for reference.
function normalizedSpan(text) {
  let normalized = '', offsets = [], ends = [], offset = 0;
  for (const char of text) {
    let next = (/\s/u.test(char) ? ' ' : char.replace(/[‘’]/u, "'").replace(/[“”]/u, '"')).toLowerCase();
    if (!(next === ' ' && normalized.endsWith(' '))) {
      normalized += next;
      for (let i = 0; i < next.length; i++) { offsets.push(offset); ends.push(offset + char.length); }
    }
    offset += char.length;
  }
  return { normalized, offsets, ends };
}
async function repairEvidence(cp, ch, file) {
  let changed = false;
  const items = [
    ...(cp.notes ?? []).map((n) => [n, String(ch.notes?.[n.index]?.body ?? '')]),
    ...['setting', 'thread'].map((field) => [cp.sections?.[field], String(ch[field] ?? '')]),
  ];
  for (const [item, body] of items) {
    if (!item || !body) continue;
    if (typeof item.evidence !== 'string') item.evidence = '';
    if (item.evidence.trim() && body.includes(item.evidence)) continue;
    const source = normalizedSpan(body);
    let replacement = null;
    for (const fragment of [item.evidence, item.evidence.replace(/[.!?;:…“”"'‘’()[\]]+$/u, '').trimEnd()]) {
      const target = normalizedSpan(fragment).normalized;
      const at = source.normalized.indexOf(target);
      if (target.length < 24 || at < 0 || at !== source.normalized.lastIndexOf(target)) continue;
      replacement = body.slice(source.offsets[at], source.ends[at + target.length - 1]);
      break;
    }
    if (!replacement && item.rating < 2) {
      // Only revision findings require reviewer-selected supporting evidence.
      // Keep/polish records can carry a clearly labeled opening for reference;
      // do not spend another model run repairing a nonessential quotation.
      const opening = body.trimStart();
      const limit = opening.length > 200 ? opening.lastIndexOf(' ', 200) : opening.length;
      replacement = opening.slice(0, limit > 0 ? limit : Math.min(200, opening.length));
      item.evidence_basis = 'Coordinator-supplied opening excerpt for reference, not reviewer-selected support';
    }
    if (!replacement) continue;
    item.evidence_original ??= item.evidence;
    item.evidence = replacement;
    changed = true;
  }
  if (changed) await atomicJson(file, cp);
}

function validateCheckpoint(cp, ch, file, { calibrationRequired = true } = {}) {
  const fail = (message) => { throw new Error(`${path.relative(ROOT, file)}: ${message}`); };
  if (cp.schema_version !== 1 || cp.status !== 'complete' || cp.rubric_version !== RUBRIC_VERSION) fail('schema, completion status, or rubric mismatch');
  if (calibrationRequired && cp.calibration_sha256 !== calibrationSha) fail('calibration fingerprint mismatch');
  if (!cp.model || !cp.reasoning || !cp.reviewed_at) fail('missing review provenance');
  if (!Array.isArray(cp.notes) || cp.notes.length !== (ch.notes ?? []).length) fail('incomplete note coverage');
  const indices = new Set();
  for (const n of cp.notes) {
    if (!Number.isInteger(n.index) || indices.has(n.index) || !ch.notes?.[n.index]) fail('duplicate or invalid note index');
    indices.add(n.index);
    const original = ch.notes[n.index];
    for (const key of ['ref', 'title', 'kind']) if (n[key] !== original[key]) fail(`note ${n.index}: ${key} mismatch`);
    rate(n, String(original.body ?? ''), file, `note ${n.index}`);
  }
  for (const field of ['setting', 'thread']) {
    if (!String(ch[field] ?? '').trim()) {
      if (cp.sections?.[field]?.status !== 'missing') fail(`${field}: missing section must be labeled missing`);
    } else rate(cp.sections?.[field], String(ch[field]), file, field);
  }
}

function rate(r, body, file, label) {
  const fail = (message) => { throw new Error(`${path.relative(ROOT, file)}: ${label}: ${message}`); };
  if (!r || !Number.isInteger(r.rating) || r.rating < 0 || r.rating > 3) fail('invalid rating');
  if (typeof r.reason !== 'string' || !r.reason.trim()) fail('missing explanation');
  if (typeof r.evidence !== 'string' || !r.evidence.trim() || !body.includes(r.evidence)) fail('evidence is not an exact source excerpt');
  if (r.rating >= 2 && (typeof r.revision_needed !== 'string' || !r.revision_needed.trim())) fail('missing revision needed');
}

async function pendingForBook(book, chapters) {
  const pending = [];
  for (const chapter of chapters) if (!(await checkpointState(book, chapter)).done) pending.push(chapter);
  return pending;
}

async function buildPrompt(book, chapters) {
  const [authoring, standards, brief, rubricText] = await Promise.all([
    readText(path.join(ROOT, 'AUTHORING.md')),
    readText(path.join(ROOT, 'STANDARDS.md')),
    readText(path.join(ROOT, 'content', book, 'BRIEF.md')),
    readText(path.join(ROOT, 'REVIEW-codex-scoring.md')),
  ]);
  const anchorNotes = [];
  for (const anchor of calibration.anchors) {
    const source = await readSource(anchor.book, anchor.chapter);
    if (hash(source.bytes) !== anchor.chapter_sha256) throw new Error(`Calibration anchor source changed: ${anchor.book} ${anchor.chapter}`);
    const note = source.chapterYaml.notes?.[anchor.index];
    if (!note || note.title !== anchor.title) throw new Error(`Calibration anchor note missing: ${anchor.book} ${anchor.chapter} “${anchor.title}”`);
    anchorNotes.push({ ...anchor, note });
  }
  const inputs = [];
  const destinations = [];
  for (const chapter of chapters) {
    const source = await readSource(book, chapter);
    const scripture = source.verses.map((v, i) => `${i + 1} ${v}`).join('\n');
    destinations.push(`chapter ${chapter}: .cache/review/book-reviews/${book}/checkpoints/${book}/${pad(chapter)}.json`);
    inputs.push(`===== ${path.relative(ROOT, source.file)} (SHA-256 ${hash(source.bytes)}) =====\nExpected note count: ${(source.chapterYaml.notes ?? []).length}. Required inventory: ${JSON.stringify((source.chapterYaml.notes ?? []).map((n, index) => ({ index, ref: n.ref, title: n.title, kind: n.kind })))}\n\n${source.bytes.toString('utf8')}\n\n===== data/kjv/${book}.json chapter ${chapter} =====\n${scripture}`);
  }
  return `You are the prose reviewer for a scripture study site. Read the materials and assigned chapter text below, then rate only the assigned chapters. This is an editorial reading, not a source audit, doctrinal audit, content edit, or mechanical scoring task. Do not edit content, documents, scripts, or any file except the assigned checkpoint JSON files listed below. Do not use web search, other agents, or source-audit tools.

Use GPT-6 Luna with High reasoning. The runner will validate that your saved checkpoints identify this model and reasoning setting.

Read AUTHORING.md for the site's authoring approach, STANDARDS.md for the prose standard, content/${book}/BRIEF.md for this book's decisions, and REVIEW-codex-scoring.md for the complete rubric and workflow. Read the calibration.json and all four complete author calibration anchors below. Carry those judgments into this review. Rate setting and thread separately; do not rate christ or explore. Evaluate each note in its scripture context, using the answer, progression, and integration questions in the rubric. For every 2 or 3, quote an exact short excerpt from that note and state the substantive repair needed; explain the missing reasoning or connection, not merely the number of quotations. Treat legitimate uncertainty, necessary qualifications, and useful repetition fairly. Do not infer factual errors or propose content changes.

Write one complete JSON checkpoint per assigned chapter, atomically (temporary file in the same directory, then rename), and finish saving/validating each checkpoint before starting the next chapter. Exact destinations: ${destinations.join('; ')}. The runner expects this schema: {"schema_version":1,"rubric_version":"${RUBRIC_VERSION}","model":"${MODEL}","reasoning":"${REASONING}","calibration_sha256":"${calibrationSha}","book":"${book}","chapter":N,"chapter_sha256":"source SHA-256 shown below","status":"complete","notes":[{"index":0,"ref":1,"title":"exact source title","kind":"exact source kind","rating":0,"evidence":"exact nonempty excerpt from note body","reason":"why this rating is right","revision_needed":"empty for 0–1; specific repair for 2–3"}],"sections":{"setting":{"rating":0,"evidence":"exact excerpt","reason":"why this rating is right","revision_needed":""},"thread":{"rating":0,"evidence":"exact excerpt","reason":"why this rating is right","revision_needed":""}},"substantive_issues":[],"reviewed_at":"ISO timestamp"}. The ratings are integers 0–3. Include every note once, in source order, including notes whose kind is christ. Only the separate top-level christ and explore fields are excluded. Use the YAML parser to assert saved note count and every index/ref/title/kind match the required inventory before completing each checkpoint. If setting or thread is absent, use {"status":"missing"}. Give a short exact evidence excerpt for every rated item and section. Use the source note's ref, title, and kind exactly. Never rate christ or explore. Do not write partial checkpoints.

Only these chapters are assigned: ${chapters.join(', ')}. Write no other checkpoint and do not modify anything else. If you cannot finish all assigned chapters or cannot write a valid checkpoint, state that plainly in your final response; the runner will retain valid completed chapters and stop.

===== AUTHORING.md =====
${authoring}

===== STANDARDS.md =====
${standards}

===== content/${book}/BRIEF.md =====
${brief}

===== REVIEW-codex-scoring.md =====
${rubricText}

===== .cache/review/calibration.json =====
${calibrationBytes.toString('utf8')}

===== Complete author anchor notes =====
${anchorNotes.map((a) => `--- ${a.book} ${a.chapter}, note ${a.index}: ${a.title} ---\n${JSON.stringify(a, null, 2)}`).join('\n\n')}

===== Assigned chapter text and scripture =====
${inputs.join('\n\n')}
`;
}

async function runCodex(prompt, book, chapters) {
  const logsDir = path.join(ROOT, '.cache/review/run/logs');
  await mkdir(logsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const log = path.join(logsDir, `${stamp}-${book}-${pad(chapters[0])}-${pad(chapters.at(-1))}.log`);
  const { createWriteStream } = await import('node:fs');
  const fd = createWriteStream(log, { flags: 'wx' });
  const start = Date.now();
  const cliArgs = ['exec', '-m', MODEL, '-c', 'model_reasoning_effort="high"', '--sandbox', 'workspace-write', '--ephemeral', '-C', ROOT, '-'];
  const status = await new Promise((resolve, reject) => {
    const child = spawn('codex', cliArgs, { cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'] });
    child.stdout.pipe(fd, { end: false });
    child.stderr.pipe(fd, { end: false });
    child.on('error', reject);
    child.on('close', (code, signal) => resolve({ code, signal }));
    child.stdin.on('error', () => {}); // an early CLI failure is reported by its exit status/log
    child.stdin.end(prompt);
  }).finally(() => new Promise((resolve) => fd.end(resolve)));
  const logText = await readText(log);
  const usage = [...logText.matchAll(/(?:input|output|total|cached)[ _-]?tokens?\s*[:=]\s*([\d,]+)/gi)].map((m) => m[0]).slice(-4);
  return { log, elapsedSeconds: Math.round((Date.now() - start) / 1000), usage, ...status };
}

async function saveQueue(books, state) {
  const queueFile = path.join(RUN_DIR, 'queue.json');
  const remaining = [];
  for (const item of books) {
    const chapters = await pendingForBook(item.book, item.chapters);
    if (chapters.length) remaining.push({ book: item.book, chapters });
  }
  await atomicJson(queueFile, { rubric_version: RUBRIC_VERSION, calibration_sha256: calibrationSha, shard, updated_at: new Date().toISOString(), state: remaining.length ? state : { ...state, outcome: 'complete' }, remaining });
  return remaining;
}

const books = await booksToReview();
if (printOnly) {
  for (const item of books) {
    const pending = await pendingForBook(item.book, item.chapters);
    if (!pending.length) continue;
    const chapters = pending.slice(0, batchSize);
    process.stdout.write(await buildPrompt(item.book, chapters));
    process.exit(0);
  }
  console.log('No pending chapters.');
  process.exit(0);
}

// A previous batch may have saved valid chapters before a later item failed.
// Refresh their book report on resume even when no new model call is needed.
for (const item of books) {
  if ((await pendingForBook(item.book, item.chapters)).length) continue;
  const result = spawnSync(process.execPath, [path.join(ROOT, 'scripts/score-notes.mjs'), item.book, '--out', path.join(CHECKPOINT_ROOT, item.book), '--rubric', RUBRIC_VERSION], { cwd: ROOT, encoding: 'utf8' });
  if (result.error || result.status !== 0) throw new Error(`Cannot refresh ${item.book}: ${result.stderr || result.error?.message}`);
}

let batches = 0;
await mkdir(RUN_DIR, { recursive: true });
await writeFile(path.join(RUN_DIR, 'calibration.json'), calibrationBytes);
while (batches < maxBatches) {
  let picked = null;
  for (const item of books) {
    const pending = await pendingForBook(item.book, item.chapters);
    if (pending.length) { picked = { book: item.book, chapters: pending.slice(0, batchSize), all: item.chapters }; break; }
  }
  if (!picked) break;
  const { book, chapters, all } = picked;
  const prompt = await buildPrompt(book, chapters);
  const batchName = `${book} ${chapters.map(pad).join(', ')}`;
  console.log(`Starting ${batchName} (${batches + 1}${Number.isFinite(maxBatches) ? `/${maxBatches}` : ''})`);
  const run = await runCodex(prompt, book, chapters).catch((error) => ({ error: error.message, code: null }));
  if (run.error || run.code !== 0) {
    const state = { outcome: 'stopped', batch: batchName, error: run.error ?? `codex exited ${run.code ?? run.signal}`, log: run.log ?? null, elapsed_seconds: run.elapsedSeconds ?? null };
    await saveQueue(books, state);
    console.error(`Stopped on ${batchName}: ${state.error}${run.log ? ` (log: ${path.relative(ROOT, run.log)})` : ''}`);
    process.exit(1);
  }
  try {
    for (const chapter of chapters) {
      const file = path.join(CHECKPOINT_ROOT, book, 'checkpoints', book, `${pad(chapter)}.json`);
      const cp = JSON.parse(await readText(file));
      const source = await readSource(book, chapter);
      if (cp.book !== book || cp.chapter !== chapter || cp.chapter_sha256 !== hash(source.bytes)) throw new Error(`${book} ${chapter}: checkpoint identity or source fingerprint mismatch`);
      if (cp.calibration_sha256 !== calibrationSha) throw new Error(`${book} ${chapter}: checkpoint calibration fingerprint mismatch`);
      if (cp.model !== MODEL || cp.reasoning !== REASONING) throw new Error(`${book} ${chapter}: unexpected model provenance`);
      await repairEvidence(cp, source.chapterYaml, file);
      validateCheckpoint(cp, source.chapterYaml, file);
    }
    const outDir = path.join(CHECKPOINT_ROOT, book);
    const validation = spawnSync(process.execPath, [path.join(ROOT, 'scripts/score-notes.mjs'), book, '--out', outDir, '--rubric', RUBRIC_VERSION], { cwd: ROOT, encoding: 'utf8' });
    if (validation.error || validation.status !== 0) throw new Error(`score-notes validator failed: ${(validation.stderr || validation.error?.message || '').trim()}`);
    const stillPending = await pendingForBook(book, all);
    if (chapters.some((chapter) => stillPending.includes(chapter))) throw new Error('assigned chapters did not all pass completion checks');
    batches++;
    const remaining = await saveQueue(books, { outcome: 'saved', batch: batchName, log: path.relative(ROOT, run.log), elapsed_seconds: run.elapsedSeconds, validated: chapters });
    const usage = run.usage.length ? `; ${run.usage.join(', ')}` : '';
    console.log(`Saved ${book} ${chapters.map(pad).join(', ')}; ${run.elapsedSeconds}s${usage}; ${remaining.reduce((sum, x) => sum + x.chapters.length, 0)} chapters remain.`);
  } catch (error) {
    await saveQueue(books, { outcome: 'stopped', batch: batchName, log: path.relative(ROOT, run.log), elapsed_seconds: run.elapsedSeconds, error: error.message });
    console.error(`Stopped after ${batchName}: ${error.message}. Valid checkpoints are retained; see ${path.relative(ROOT, run.log)}.`);
    process.exit(1);
  }
}
const remaining = await saveQueue(books, { outcome: 'paused-at-limit', batches_run: batches, max_batches: Number.isFinite(maxBatches) ? maxBatches : null });
const total = remaining.reduce((sum, x) => sum + x.chapters.length, 0);
console.log(total ? `Stopped at batch limit; ${total} chapters remain. Queue: ${path.relative(ROOT, path.join(RUN_DIR, 'queue.json'))}` : 'All selected chapter files have matching calibrated checkpoints.');
