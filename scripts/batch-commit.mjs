// The coordinator's last step for a batch: run every check on each chapter and commit the ones that pass,
// one commit a chapter with its ledger (STANDARDS.md §11, step 8). A chapter that fails is left uncommitted
// and its failing lines are printed.
// Usage: node scripts/batch-commit.mjs <book> written|pass <chapters…> [--applied-by Sonnet]   (the model that applied Codex's findings; Opus by default)
//   written  “<Unit> <n>: written, checked and reviewed”
//   pass     “<Book> <n>: language pass (Codex's findings, applied by Opus)”   (the wording status.mjs reads)
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { findBook } from '../src/lib/books.mjs';
// The commit's attribution line: the model that ran the batch, from CLAUDE_MODEL_NAME (set by the coordinator), else a generic one.
const coauthor = () => `Co-Authored-By: ${process.env.CLAUDE_MODEL_NAME ?? 'Claude Code'} <noreply@anthropic.com>`;

const ROOT = new URL('..', import.meta.url).pathname;
const argv = process.argv.slice(2);
const byAt = argv.indexOf('--applied-by');
const appliedBy = byAt >= 0 ? argv.splice(byAt, 2)[1] : 'Opus';
const [slug, kind, ...chapters] = argv;
if (!slug || !['written', 'pass'].includes(kind) || !chapters.length) { console.error('Usage: node scripts/batch-commit.mjs <book> written|pass <chapters…>'); process.exit(1); }
const book = await findBook(ROOT, slug);
const pad = (n) => String(n).padStart(2, '0');
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' });
let failed = 0;
for (const n of chapters) {
  let out = '', ok = true;
  try { out = execFileSync(process.execPath, [path.join(ROOT, 'scripts/check-chapter.mjs'), slug, n], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { ok = false; out = `${e.stdout ?? ''}${e.stderr ?? ''}`; }
  if (!ok || !/Every check passed/.test(out)) {
    failed++;
    console.log(`✗ ${book.name} ${n}: not committed\n${out.split('\n').filter((l) => /✗|⚠|Failed/.test(l)).map((l) => `    ${l.trim().slice(0, 240)}`).join('\n')}`);
    continue;
  }
  const warnings = out.split('\n').filter((l) => /⚠/.test(l)).map((l) => l.trim().slice(0, 160));
  const files = [`content/${slug}/chapters/${pad(n)}.yaml`, `content/${slug}/evidence/${pad(n)}.yaml`];
  git('add', ...files);
  if (!git('diff', '--cached', '--name-only').trim()) { console.log(`– ${book.name} ${n}: nothing to commit`); continue; }
  const msg = kind === 'written' ? `${book.unit?.singular ?? book.name} ${n}: written, checked and reviewed` : `${book.name} ${n}: language pass (Codex's findings, applied by ${appliedBy})`;
  git('commit', '-q', '-m', `${msg}\n\n${coauthor()}`, '--', ...files);
  console.log(`✓ ${book.name} ${n}: committed${warnings.length ? `  (${warnings.join('; ')})` : ''}`);
}
process.exit(failed ? 1 : 0);
