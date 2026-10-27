#!/usr/bin/env node
// Mechanical persistence for model-supplied judgments. Prints no prior scores.
// node scripts/save-refined-records.mjs --phase reading|adjudicated [--check] < records.json
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, '.cache/review/second-pass');
const phase = process.argv[2] === '--phase' ? process.argv[3] : null;
const checkOnly = process.argv[4] === '--check';
if (!['reading', 'adjudicated'].includes(phase) || process.argv.length !== (checkOnly ? 5 : 4)) throw Error('Use --phase reading|adjudicated [--check] and supply a JSON array on stdin');
let input = '';
process.stdin.setEncoding('utf8');
for await (const chunk of process.stdin) input += chunk;
const records = JSON.parse(input);
if (!Array.isArray(records) || !records.length) throw Error('Expected a nonempty JSON array');
const manifest = JSON.parse(await readFile(path.join(out, 'manifest.json'), 'utf8'));
const sha = (v) => createHash('sha256').update(v).digest('hex');
const pad = (n) => String(n).padStart(2, '0');
const seen = new Set(), writes = [];
const guidance = (await readFile(path.join(root, 'AUTHORING.md'), 'utf8')) + (await readFile(path.join(root, 'STANDARDS.md'), 'utf8'));
for (const r of records) {
  const key = `${r.book}/${r.chapter}/${r.index}`;
  if (seen.has(key)) throw Error(`${key}: duplicate record`);
  seen.add(key);
  const n = manifest.targets.find((t) => t.book === r.book && t.chapter === r.chapter && t.index === r.index);
  if (!n) throw Error(`${key}: unassigned identity`);
  for (const field of ['ref', 'title', 'kind', 'chapter_sha256']) if (r[field] !== n[field]) throw Error(`${key}: ${field} mismatch`);
  if (r.schema_version !== 1 || r.protocol_version !== manifest.protocol_version || r.phase !== phase || r.model !== manifest.model || r.reasoning !== 'high' || r.calibration_sha256 !== manifest.calibration_sha256 || !/^[0-9a-f]{64}$/.test(r.input_sha256 ?? '') || !r.reviewed_at) throw Error(`${key}: provenance mismatch`);
  const reading = phase === 'adjudicated' ? JSON.parse(await readFile(path.join(out, 'raw', 'reading', `${n.book}-${pad(n.chapter)}-${pad(n.index)}.json`), 'utf8')) : null;
  const brief = await readFile(path.join(root, 'content', n.book, 'BRIEF.md'), 'utf8');
  const expectedInput = sha(JSON.stringify({ protocol: manifest.protocol_version, phase, source: n.chapter_sha256, calibration: manifest.calibration_sha256, guidance: sha(guidance + brief), original: phase === 'adjudicated' ? n.original_sha256 : null, reading }));
  if (r.input_sha256 !== expectedInput) throw Error(`${key}: input fingerprint mismatch`);
  if (!Number.isInteger(r.rating) || r.rating < 0 || r.rating > 3) throw Error(`${key}: invalid rating`);
  for (const field of ['repair_diagnosis', 'reason', 'evidence']) if (typeof r[field] !== 'string' || !r[field].trim()) throw Error(`${key}: missing ${field}`);
  if (r.rating >= 2 && (typeof r.revision_needed !== 'string' || !r.revision_needed.trim())) throw Error(`${key}: missing substantive repair`);
  if (phase === 'adjudicated') {
    if (!['clear_revision', 'polish_keep', 'unresolved'].includes(r.decision) || (r.decision === 'clear_revision' && r.rating < 2) || (r.decision === 'polish_keep' && r.rating >= 2)) throw Error(`${key}: inconsistent decision`);
    for (const field of ['diagnosis_assessment', 'change_from_reading']) if (typeof r[field] !== 'string' || !r[field].trim()) throw Error(`${key}: missing ${field}`);
    if (r.decision === 'unresolved' && !r.unresolved_question?.trim()) throw Error(`${key}: missing unresolved alternatives`);
    if (!['none', 'relevance', 'missing_connection', 'missing_answer', 'organization', 'local_wording'].includes(r.issue_category)) throw Error(`${key}: invalid issue category`);
  }
  const bytes = await readFile(path.join(root, 'content', n.book, 'chapters', `${pad(n.chapter)}.yaml`));
  if (sha(bytes) !== n.chapter_sha256) throw Error(`${key}: source changed`);
  const ch = YAML.parse(bytes.toString());
  if (!ch.notes[n.index].body.includes(r.evidence)) throw Error(`${key}: evidence is not an exact source body excerpt`);
  writes.push({ file: path.join(out, 'raw', phase, `${n.book}-${pad(n.chapter)}-${pad(n.index)}.json`), record: r });
}
// Validate the whole small batch before publishing any record; every file is
// then replaced atomically. Ratings and explanations are never synthesized.
for (const { file, record } of checkOnly ? [] : writes) {
  await mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  await writeFile(temp, `${JSON.stringify(record, null, 2)}\n`);
  await rename(temp, file);
}
console.log(`Validated ${writes.length} ${phase} records${checkOnly ? ' without writing' : ' and atomically saved them'}. Prior scores remain hidden.`);
