#!/usr/bin/env node
// Exports the data behind the author's dashboard “Theme page review” (DEVELOPMENT.md; STANDARDS.md §8, “Where a page stands”):
//   review-tasks.json    one row per theme page or guide whose front matter carries `review:` (unread, read or old-form)
//   review-commits.json  one row per commit since 2026-10-25 that rewrote or deleted a theme page
// Usage: node scripts/review-dashboard.mjs [outDir]   (default .cache/batch/dashboard)
// After running it, the session uploads the two files as the artifact's blobs and points its `datasets/tasks` and
// `datasets/commits` documents at them. Nothing here records history: a page's state is in its own front matter, and
// the commits come from git.
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { discoverBooks, discoverVolumes } from '../src/lib/books.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const outDir = process.argv[2] || '.cache/batch/dashboard';
mkdirSync(outDir, { recursive: true });

// ---- pages: every theme page and guide with a `review:` line
const tasks = [];
const scan = (owner, kind, dir) => {
  if (!existsSync(dir)) return;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.md')).sort()) {
    const head = readFileSync(join(dir, f), 'utf8').split(/\n---\n/)[0];
    const m = head.match(/^review:\s*(unread|read|old-form)\b/m);
    if (!m) continue;
    const title = (head.match(/^title:\s*(.+)$/m) || [])[1]?.replace(/^["“']|["”']$/g, '') ?? f;
    tasks.push({ kind, owner, item: `${owner} / ${f.replace(/\.md$/, '')}`, title, state: m[1] });
  }
};
for (const b of await discoverBooks(ROOT)) { scan(b.slug, 'theme page', join(b.dir, 'themes')); scan(b.slug, 'guide', join(b.dir, 'guides')); }
for (const v of await discoverVolumes(ROOT)) scan(v.slug, 'guide', join(v.dir, 'guides'));
writeFileSync(join(outDir, 'review-tasks.json'), JSON.stringify(tasks, null, 1));

// ---- commits
const log = execSync("git log --since=2026-10-25 --format='%ad%x09%s' --date=short", { encoding: 'utf8', cwd: ROOT });
const commits = [];
for (const line of log.split('\n')) {
  if (!line) continue;
  const [date, subject] = line.split('\t');
  // Codex's follow-up readings ("X theme page: Codex's reading applied to …") are not page commits; since
  // 2026-10-29 a page commit itself ends "Codex’s reading applied", so match only the follow-up's form.
  if (!/theme page|essay/i.test(subject) || /: codex['’]s readings? applied/i.test(subject)) continue;
  const m = subject.match(/^(\w+) theme page: [“"](.+?)[”"]/);
  if (!m) continue; // commits about the plan or the files are not page commits
  // Before 2026-10-27 the subjects did not say "essay"; every rewritten page then was an essay.
  const kind = /deleted/i.test(subject) ? 'deleted' : /shorter page/i.test(subject) ? 'shorter page' : 'essay';
  commits.push({ date, book: m[1], title: m[2], kind });
}
writeFileSync(join(outDir, 'review-commits.json'), JSON.stringify(commits, null, 1));

const n = (k, s) => tasks.filter((r) => r.kind === k && r.state === s).length;
console.log(`${tasks.length} pages with a review line → ${join(outDir, 'review-tasks.json')}; theme pages unread ${n('theme page', 'unread')}, read ${n('theme page', 'read')}, old form ${n('theme page', 'old-form')}; guides old form ${n('guide', 'old-form')}`);
console.log(`${commits.length} page commits → ${join(outDir, 'review-commits.json')}`);
