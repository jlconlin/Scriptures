// Checks the project's own documents against the repository, so that an instruction file can't quietly go
// stale: every `scripts/<name>` a document names exists; every `STANDARDS.md` §n it cites exists; every quoted
// path under content/, data/, scripts/, src/ or .claude/ exists; every script is named in some document;
// AGENTS.md is a copy of CLAUDE.md. Then it says how far the instruction files have drifted since the last
// review (a tag `review-YYYY-MM-DD`): commits that touched them and their change in size, so that an expensive
// review is run when the drift warrants one and not on a calendar (author, 2026-10-11).
// Run by `npm run check` (exit 1 on a stale reference) and by status.mjs for the drift line (`--drift`).
// Usage: node scripts/check-docs.mjs [--drift]
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const git = (...a) => { try { return execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return ''; } }; // quiet: a file newer than the review tag is not an error

// The instruction files: what a session or an agent reads before working.
export const DOCS = [
  'CLAUDE.md', 'AGENTS.md', 'AUTHORING.md', 'STANDARDS.md', 'DEVELOPMENT.md', 'README.md', 'DECISIONS.md', 'IDEAS.md', 'OPEN-QUESTIONS.md',
  ...readdirSync(path.join(ROOT, '.claude/agents')).filter((f) => f.endsWith('.md')).map((f) => `.claude/agents/${f}`),
  ...readdirSync(path.join(ROOT, '.claude/workflows')).filter((f) => f.endsWith('.js')).map((f) => `.claude/workflows/${f}`),
].filter((f) => existsSync(path.join(ROOT, f)));

export function staleReferences() {
  const problems = [];
  const scripts = new Set(readdirSync(path.join(ROOT, 'scripts')));
  const sections = new Set([...readFileSync(path.join(ROOT, 'STANDARDS.md'), 'utf8').matchAll(/^## (\d+)\./gm)].map((m) => m[1]));
  const named = new Set();
  for (const doc of DOCS) {
    const text = readFileSync(path.join(ROOT, doc), 'utf8');
    for (const m of text.matchAll(/scripts\/([\w-]+\.(?:mjs|cjs|js|sh))/g)) {
      named.add(m[1]);
      if (!scripts.has(m[1])) problems.push(`${doc}: names scripts/${m[1]}, which does not exist`);
    }
    for (const m of text.matchAll(/§(\d+)/g)) if (!sections.has(m[1])) problems.push(`${doc}: cites STANDARDS.md §${m[1]}, which does not exist`);
    // A quoted path with no placeholder (<book>, NN, *) must exist.
    for (const m of text.matchAll(/`((?:content|data|scripts|src|\.claude)\/[\w./-]+)`/g)) {
      if (/[<>*]|NN/.test(m[1])) continue;
      if (!existsSync(path.join(ROOT, m[1]))) problems.push(`${doc}: names ${m[1]}, which does not exist`);
    }
  }
  for (const s of scripts) if (!named.has(s) && !/^\./.test(s)) problems.push(`scripts/${s} is named in no document (DEVELOPMENT.md should say what it is for)`);
  if (existsSync(path.join(ROOT, 'AGENTS.md')) && readFileSync(path.join(ROOT, 'AGENTS.md'), 'utf8') !== readFileSync(path.join(ROOT, 'CLAUDE.md'), 'utf8')) problems.push('AGENTS.md differs from CLAUDE.md (it is meant to be a copy)');
  // package.json scripts must exist too.
  const pkg = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  for (const [name, cmd] of Object.entries(pkg.scripts ?? {})) for (const m of cmd.matchAll(/scripts\/([\w-]+\.(?:mjs|cjs|js))/g)) if (!scripts.has(m[1])) problems.push(`package.json "${name}" runs scripts/${m[1]}, which does not exist`);
  return problems;
}

// How much the instruction files have changed since the last review tag.
export function drift() {
  const tags = git('tag', '--list', 'review-*').trim().split('\n').filter(Boolean).sort();
  const last = tags.at(-1);
  if (!last) return { last: null };
  const files = DOCS.filter((f) => f !== 'OPEN-QUESTIONS.md');
  const commits = git('rev-list', '--count', `${last}..HEAD`, '--', ...files).trim();
  const sizeAt = (ref) => files.reduce((n, f) => n + Buffer.byteLength(git('show', `${ref}:${f}`)), 0);
  const before = sizeAt(last);
  const now = files.reduce((n, f) => n + Buffer.byteLength(readFileSync(path.join(ROOT, f))), 0);
  const chapters = git('rev-list', '--count', `${last}..HEAD`, '--grep=written, checked and reviewed').trim();
  return { last, commits: Number(commits), before, now, chapters: Number(chapters) };
}

export function driftLine() {
  const d = drift();
  if (!d.last) return 'Instruction files: no review tag yet (git tag review-YYYY-MM-DD after a review).';
  const grown = d.before ? Math.round(((d.now - d.before) / d.before) * 100) : 0;
  const due = d.commits >= 40 || grown >= 25 || d.chapters >= 50;
  return `Instruction files since ${d.last}: ${d.commits} commit${d.commits === 1 ? '' : 's'}, ${grown >= 0 ? '+' : ''}${grown}% in size, ${d.chapters} chapters written.${due ? ' A review is due (DEVELOPMENT.md, “Reviewing the instructions”).' : ''}`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  if (process.argv.includes('--drift')) { console.log(driftLine()); process.exit(0); }
  const problems = staleReferences();
  for (const p of problems) console.log(`✗ ${p}`);
  console.log(problems.length ? `${problems.length} stale reference(s) in the documents.` : '✓ The documents name only scripts, sections and paths that exist.');
  console.log(driftLine());
  process.exit(problems.length ? 1 : 0);
}
