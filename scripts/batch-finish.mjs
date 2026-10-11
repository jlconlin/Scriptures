// The coordinator's steps after a write-chapters run, in one command (DEVELOPMENT.md, “Writing a book in batches”):
//   batch-notes (unanswered questions into UNANSWERED.md, theme candidates),
//   merge-sources --write, the reviewers' questions for the author appended to OPEN-QUESTIONS.md under the book's
//   heading and numbered on from the last (<prefix>15, <prefix>16 …), one commit for those documents, then
//   batch-commit (check-chapter on each chapter; one commit for each that passes).
// It prints one line a step and whatever needs a person: a chapter not ready, a source to settle by hand,
// a chapter whose checks fail. The questions are appended in the reviewers' own words: read them afterwards.
// Usage: node scripts/batch-finish.mjs <book> <the run's journal.jsonl> <question prefix, e.g. Ps>
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { findBook } from '../src/lib/books.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const [slug, journal, prefix] = process.argv.slice(2);
if (!slug || !journal?.endsWith('.jsonl') || !prefix) { console.error('Usage: node scripts/batch-finish.mjs <book> <journal.jsonl> <question prefix>'); process.exit(1); }
const book = await findBook(ROOT, slug);
const run = (script, ...a) => { try { return execFileSync(process.execPath, [path.join(ROOT, 'scripts', script), ...a], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { return `${e.stdout ?? ''}${e.stderr ?? ''}`; } };
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' });

const lines = readFileSync(journal, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const label = new Map(lines.filter((e) => e.type === 'started').map((e) => [e.agentId, e.label]));
const reviews = lines
  .filter((e) => e.type === 'result' && e.result && typeof e.result === 'object' && /^review:\d+$/.test(label.get(e.agentId) ?? ''))
  .map((e) => ({ chapter: +label.get(e.agentId).split(':')[1], ...e.result }))
  .sort((a, b) => a.chapter - b.chapter);
if (!reviews.length) throw new Error('No reviewer results in that journal');
const chapters = reviews.map((r) => String(r.chapter));
const notReady = reviews.filter((r) => !r.ready);
console.log(`${reviews.length} chapters reviewed: ${chapters.join(', ')}${notReady.length ? `\nNOT READY: ${notReady.map((r) => `${r.chapter} (${String(r.summary).slice(0, 300)})`).join('; ')}` : '; all ready'}`);

// The reviewers' decisions are not logged any more (author, 2026-10-11: “We don't have to record every decision of every verse”).
// `node scripts/batch-decided.cjs <book> <journal> --dry` still prints them for a coordinator who wants to read one.
run('batch-notes.mjs', slug, journal);
const merged = run('merge-sources.mjs', slug, ...chapters, '--write');
console.log(merged.split('\n').filter((l) => /^✗|^ {4}(have|new)|new source\(s\)/.test(l)).map((l) => l.slice(0, 200)).join('\n'));

// The reviewers' questions, numbered on from the last one under the book's heading in OPEN-QUESTIONS.md.
const oqFile = path.join(ROOT, 'OPEN-QUESTIONS.md');
let oq = readFileSync(oqFile, 'utf8');
const head = oq.indexOf(`\n## ${book.name}\n`);
if (head < 0) throw new Error(`OPEN-QUESTIONS.md has no “## ${book.name}” heading`);
const next = oq.indexOf('\n## ', head + 1);
const end = next < 0 ? oq.length : next;
const section = oq.slice(head, end);
let n = Math.max(0, ...[...section.matchAll(new RegExp(`\\*\\*${prefix}(\\d+)\\.`, 'g'))].map((m) => +m[1]));
const tidy = (s) => String(s).replace(/\s+/g, ' ').trim();
const added = reviews.flatMap((r) => (r.authorQuestions ?? []).map((q) => `- **${prefix}${++n}.** ${tidy(q)}\n`));
if (added.length) {
  oq = oq.slice(0, end).replace(/\n*$/, '\n') + added.join('') + oq.slice(end);
  writeFileSync(oqFile, oq);
}
console.log(`${added.length} question(s) for the author appended to OPEN-QUESTIONS.md${added.length ? `: ${added.map((a) => a.match(/\*\*(\w+)\./)[1]).join(', ')}` : ''}`);
for (const a of added) console.log(`  ${a.trim().slice(0, 260)}`);

git('add', 'content/sources.yaml', 'OPEN-QUESTIONS.md', `content/${slug}/BRIEF.md`, `content/${slug}/THEME-CANDIDATES.md`);
try { git('add', `content/${slug}/UNANSWERED.md`); } catch { /* none written yet */ }
if (git('diff', '--cached', '--name-only').trim()) git('commit', '-q', '-m', `${book.name} ${chapters[0]}–${chapters.at(-1)}: sources, the reviewers' decisions, questions and theme candidates\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`);
console.log(run('batch-commit.mjs', slug, 'written', ...chapters).trim());
// A brief too long to read whole is read in part: agents take its first few hundred lines (Psalms, 2026-10-11).
const briefSize = readFileSync(path.join(ROOT, `content/${slug}/BRIEF.md`)).length;
if (briefSize > 60000) console.log(`\n⚠ content/${slug}/BRIEF.md is ${Math.round(briefSize / 1000)} KB: too long for an agent to read whole. Move a log or a list out of it (content/${slug}/DECIDED.md) before the next batch.`);
