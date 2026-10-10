// The coordinator's last step for a batch: run every check on each chapter and commit the ones that pass,
// one commit a chapter with its ledger (STANDARDS.md §11, step 8). A chapter that fails is left uncommitted
// and its failing lines are printed.
// Usage: node scripts/batch-commit.mjs <book> written|pass <chapters…>
//   written  “<Unit> <n>: written, checked and reviewed”
//   pass     “<Book> <n>: language pass (Codex's findings, applied by Opus)”   (the wording status.mjs reads)
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { findBook } from '../src/lib/books.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const [slug, kind, ...chapters] = process.argv.slice(2);
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
  const msg = kind === 'written' ? `${book.unit?.singular ?? book.name} ${n}: written, checked and reviewed` : `${book.name} ${n}: language pass (Codex's findings, applied by Opus)`;
  git('commit', '-q', '-m', `${msg}\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`, '--', ...files);
  console.log(`✓ ${book.name} ${n}: committed${warnings.length ? `  (${warnings.join('; ')})` : ''}`);
}
process.exit(failed ? 1 : 0);
