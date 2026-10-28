import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import { parseProseReviews, proseSourceHash } from '../scripts/prose-review.mjs';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'prose-review-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (file, content) => { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), content); };
  for (const name of ['batch-commit.mjs', 'codex-read.mjs', 'status.mjs', 'prose-review.mjs']) put(`scripts/${name}`, fs.readFileSync(path.join(project, 'scripts', name)));
  put('package.json', '{"type":"module"}');
  put('src/lib/books.mjs', `import path from 'node:path';
export const findBook = async (root, slug) => ({slug,name:'Demo',dir:path.join(root,'content',slug),status:'preview'});
export const discoverBooks = async root => [await findBook(root,'demo')];
export const discoverVolumes = () => [];`);
  put('scripts/check-docs.mjs', "export const driftLine = () => 'fixture';");
  put('scripts/check-chapter.mjs', "import fs from 'node:fs'; if(fs.existsSync('fail-check')) { console.log('Failed'); process.exit(1); } console.log('Every check passed');");
  put('STANDARDS.md', '# Standard\n\n## 2. Audience\nReaders.\n\n## 3. Voice\nConnected explanation.\n\n## 4. Sources\nEvidence.\n');
  put('data/kjv/demo.json', '{"chapters":[["A verse."]]}');
  put('content/demo/chapters/01.yaml', 'chapter: 1\nsetting: Background\nthread: Explanation\nnotes: []\n');
  put('content/demo/evidence/01.yaml', 'chapter: 1\nclaims: []\n');
  put('bin/codex', `#!/usr/bin/env node
import fs from 'node:fs';
process.stdin.setEncoding('utf8'); for await (const chunk of process.stdin) {}
fs.appendFileSync('codex-calls','called\\n');
const output=process.argv[process.argv.indexOf('-o')+1];
fs.writeFileSync(output,fs.existsSync('empty-reader') ? '' : 'No findings.\\n');
if(fs.existsSync('fail-reader'))process.exit(1);
`);
  fs.chmodSync(path.join(root, 'bin/codex'), 0o755);
  const env = { ...process.env, PATH: `${path.join(root, 'bin')}${path.delimiter}${process.env.PATH}` };
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '-q');
  git('config', 'user.name', 'Review Test'); git('config', 'user.email', 'review@example.invalid');
  git('config', 'commit.gpgsign', 'false'); git('config', 'core.hooksPath', '/dev/null');
  git('add', '.'); git('commit', '-qm', 'Fixture');
  const run = (script, ...args) => spawnSync(process.execPath, [`scripts/${script}`, ...args], { cwd: root, env, encoding: 'utf8', maxBuffer: 1 << 24 });
  return { root, put, git, run, calls: () => fs.existsSync(path.join(root, 'codex-calls')) ? fs.readFileSync(path.join(root, 'codex-calls'), 'utf8').trim().split('\n').length : 0 };
}

test('no-edit completion is recorded, unrelated staging is preserved, and later edits invalidate it', (t) => {
  const f = fixture(t);
  f.put('unrelated.txt', 'Unrelated staged work.'); f.git('add', 'unrelated.txt');
  const written = f.run('batch-commit.mjs', 'demo', 'written', '1');
  assert.equal(written.status, 0, written.stderr); assert.equal(f.git('rev-list', '--count', 'HEAD'), '1');
  const tree = f.git('rev-parse', 'HEAD^{tree}');
  const pass = f.run('batch-commit.mjs', 'demo', 'pass', '1');
  assert.equal(pass.status, 0, pass.stderr); assert.equal(f.git('rev-list', '--count', 'HEAD'), '2');
  assert.equal(f.git('rev-parse', 'HEAD^{tree}'), tree, 'no source change should be required to record a pass');
  assert.match(f.git('status', '--porcelain'), /A  unrelated\.txt/);
  const records = parseProseReviews(f.git('log', '--format=%B%x00'));
  assert.equal(records.get('demo/1').source, proseSourceHash(path.join(f.root, 'content/demo/chapters/01.yaml')));
  const current = f.run('status.mjs', 'demo');
  assert.equal(current.status, 0, current.stderr); assert.match(current.stdout, /language pass every chapter/); assert.match(current.stdout, /prose check v1 recorded for 1/);
  fs.appendFileSync(path.join(f.root, 'content/demo/chapters/01.yaml'), '# changed after review\n');
  const stale = f.run('status.mjs', 'demo');
  assert.equal(stale.status, 0, stale.stderr); assert.match(stale.stdout, /language pass not recorded for 1/); assert.match(stale.stdout, /not current for 1/);
});

test('failed chapter checks do not create a completion record', (t) => {
  const f = fixture(t); f.put('fail-check', 'fail');
  const r = f.run('batch-commit.mjs', 'demo', 'pass', '1');
  assert.equal(r.status, 1); assert.equal(f.git('rev-list', '--count', 'HEAD'), '1');
  assert.equal(parseProseReviews(f.git('log', '--format=%B%x00')).size, 0);
});

test('reader cache follows sources and criteria; preview never calls a model; failures leave no usable stale report', (t) => {
  const f = fixture(t), read = (...extra) => f.run('codex-read.mjs', 'demo', '1', '--batch', ...extra);
  let r = read(); assert.equal(r.status, 0, r.stderr); assert.equal(f.calls(), 1);
  r = read(); assert.equal(r.status, 0, r.stderr); assert.equal(f.calls(), 1);
  fs.appendFileSync(path.join(f.root, 'content/demo/chapters/01.yaml'), '# changed\n');
  r = read(); assert.equal(r.status, 0, r.stderr); assert.equal(f.calls(), 2);
  const standard = path.join(f.root, 'STANDARDS.md');
  fs.writeFileSync(standard, fs.readFileSync(standard, 'utf8').replace('Connected explanation.', 'Connected explanation and relevant evidence.'));
  r = read(); assert.equal(r.status, 0, r.stderr); assert.equal(f.calls(), 3);
  const report = path.join(f.root, '.cache/batch/demo/reports/01-codex.md');
  fs.rmSync(`${report}.meta.json`);
  r = read(); assert.equal(r.status, 0, r.stderr); assert.equal(f.calls(), 4, 'older reports without current metadata must be reread');
  r = read('--force'); assert.equal(r.status, 0, r.stderr); assert.equal(f.calls(), 5);
  r = read('--print'); assert.equal(r.status, 0, r.stderr); assert.equal(f.calls(), 5); assert.match(r.stdout, /answer, progression and integration/);
  fs.writeFileSync(report, 'Tampered findings.');
  r = read(); assert.equal(r.status, 0, r.stderr); assert.equal(f.calls(), 6);
  f.put('fail-reader', 'fail');
  r = read('--force'); assert.equal(r.status, 1); assert.equal(f.calls(), 7);
  assert.equal(fs.existsSync(report), false); assert.equal(fs.existsSync(`${report}.meta.json`), false);
  assert.ok(fs.readdirSync(path.dirname(report)).some((n) => n.includes('.previous-')), 'previous findings remain available for audit');
  fs.rmSync(path.join(f.root, 'fail-reader')); f.put('empty-reader', 'empty');
  r = read(); assert.equal(r.status, 1); assert.equal(fs.existsSync(report), false, 'an empty output must not certify a review');
});

test('workflow keeps writer findings open and never marks missing or blocked chapters ready', async () => {
  const source = fs.readFileSync(path.join(project, '.claude/workflows/codex-pass.js'), 'utf8').replace('export const meta =', 'const meta =');
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const evaluate = new AsyncFunction('args', 'agent', 'parallel', source);
  const clean = { findings: 0, applied: 0, declined: [], needsWriter: [], words: 'same', checks: 'passed', problems: '' };
  const writer = { where: 'note 1:1', evidence: 'Two disconnected claims.', repairNeeded: 'Explain the missing relationship with sourced reasoning.' };
  const responses = [{ ...clean, chapter: 999 }, { ...clean, findings: 1, needsWriter: [writer] }, { ...clean, problems: 'Checks failed.' }, null];
  const result = await evaluate({ book: 'demo', chapters: [1, 2, 3, 4] }, async (_prompt, options) => responses[Number(options.label.split(':')[1]) - 1], (jobs) => Promise.all(jobs.map((job) => job())));
  assert.equal(result.ready, false); assert.deepEqual(result.readyChapters, [1]); assert.deepEqual(result.notReady, [2, 3, 4]); assert.deepEqual(result.missing, [4]);
  assert.deepEqual(result.needsWriter, [{ chapter: 2, findings: [writer] }]); assert.deepEqual(result.results.find((r) => r.chapter === 2).declined, []);
  const allReady = await evaluate({ book: 'demo', chapters: [1] }, async () => ({ ...clean }), (jobs) => Promise.all(jobs.map((job) => job())));
  assert.equal(allReady.ready, true); assert.deepEqual(allReady.readyChapters, [1]);
});
