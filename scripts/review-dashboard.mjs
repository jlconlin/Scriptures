#!/usr/bin/env node
// Exports the data behind the theme-page review dashboard (REVIEW.md):
//   review-tasks.json    one row per line of REVIEW-TASKS.md
//   review-commits.json  one row per commit since 2026-10-25 that wrote an essay or a shorter page
// Usage: node scripts/review-dashboard.mjs [outDir]   (default .cache/batch/dashboard)
// The dashboard itself is a claude.ai Artifact; after running this, the session uploads the two
// files as the artifact's blobs and points its `datasets/tasks` and `datasets/commits` documents at them.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const outDir = process.argv[2] || '.cache/batch/dashboard';
mkdirSync(outDir, { recursive: true });

// ---- tasks
const md = readFileSync('REVIEW-TASKS.md', 'utf8').split('\n');
const tasks = [];
let section = '', bin = '';
const binOf = (h) => /^A\b/.test(h) ? 'A' : /^B\b/.test(h) ? 'B' : /^C\b/.test(h) ? 'C' : /^D\b/.test(h) ? 'D' : /^Guides/.test(h) ? 'Guides' : 'Other';
const stateOf = (t) => {
  const s = t.toLowerCase();
  if (s === 'done' || s === 'todo' || s === 'later' || s === 'deleted') return s;
  if (s.startsWith('merged')) return 'merged';
  if (s.startsWith('author')) return 'author';
  if (s.startsWith('after')) return 'after';
  if (s.startsWith('before')) return 'before';
  return 'other';
};
for (const line of md) {
  const h = line.match(/^## (.+)/);
  if (h) { section = h[1].trim(); bin = binOf(section); continue; }
  if (!line.startsWith('| ') || /^\|\s*(Page|Task)\s*\|/.test(line) || /^\|---/.test(line)) continue;
  const cells = line.split('|').slice(1, -1).map((c) => c.trim());
  if (cells.length < 2) continue;
  const [item, stateText, thesis = ''] = cells;
  tasks.push({ bin, section, item, book: item.split(' / ')[0], state: stateOf(stateText), state_text: stateText, thesis });
}
writeFileSync(join(outDir, 'review-tasks.json'), JSON.stringify(tasks, null, 1));

// ---- commits
const log = execSync("git log --since=2026-10-25 --format='%ad%x09%s' --date=short", { encoding: 'utf8' });
const commits = [];
for (const line of log.split('\n')) {
  if (!line) continue;
  const [date, subject] = line.split('\t');
  // Codex's follow-up readings ("X theme page: Codex's reading applied to …") are not page commits; since
  // 2026-10-29 a page commit itself ends "Codex’s reading applied", so match only the follow-up's form.
  if (!/theme page|essay/i.test(subject) || /: codex['’]s readings? applied/i.test(subject)) continue;
  const m = subject.match(/^(\w+) theme page: [“"](.+?)[”"]/);
  if (!m) continue; // the plan's own commits (REVIEW.md) are not page commits
  // Before 2026-10-27 the subjects did not say "essay"; every rewritten page then was a bin A essay.
  const kind = /deleted/i.test(subject) ? 'deleted' : /shorter page/i.test(subject) ? 'shorter page' : 'essay';
  commits.push({ date, book: m[1], title: m[2], kind });
}
writeFileSync(join(outDir, 'review-commits.json'), JSON.stringify(commits, null, 1));

const n = (b, s) => tasks.filter((r) => r.bin === b && r.state === s).length;
console.log(`${tasks.length} task rows → ${join(outDir, 'review-tasks.json')}; A done ${n('A', 'done')} merged ${n('A', 'merged')}; B done ${n('B', 'done')} todo ${n('B', 'todo')} merged ${n('B', 'merged')}; C later ${n('C', 'later')}`);
console.log(`${commits.length} page commits → ${join(outDir, 'review-commits.json')}`);
