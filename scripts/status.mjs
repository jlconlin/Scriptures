#!/usr/bin/env node
// Where every book stands, read from the repository itself, so no document has to be kept in
// step with it: chapters written, ledgers, theme and guide pages, preview or live, the
// illustration, the language pass (from the commit messages), and what waits for the author
// (the ids under the book's heading in OPEN-QUESTIONS.md).
//
//   node scripts/status.mjs [book]
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { driftLine } from './check-docs.mjs';
import { discoverBooks, discoverVolumes } from '../src/lib/books.mjs';
import { parseProseReviews, proseSourceHash, PROSE_REVIEW_VERSION } from './prose-review.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const only = process.argv[2];

const list = async (dir, ext) => (existsSync(dir) ? (await readdir(dir)).filter((f) => f.endsWith(ext)) : []);
const git = (...args) => {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' });
  } catch {
    return '';
  }
};

// The ids waiting under each book's heading in OPEN-QUESTIONS.md ("## Genesis" … "- **G1. …").
const waiting = {};
if (existsSync(path.join(root, 'OPEN-QUESTIONS.md'))) {
  let heading = '';
  for (const line of (await readFile(path.join(root, 'OPEN-QUESTIONS.md'), 'utf8')).split('\n')) {
    const h = line.match(/^## (.+)/);
    if (h) heading = h[1].trim().toLowerCase();
    const id = line.match(/^- \*\*([A-Za-z]+-?[A-Z0-9]*)\.(?:\*\*)? /); // “- **G1. Title.** …”, or “- **Ps18.** …” as batch-finish.mjs appends them
    if (id) (waiting[heading] ??= []).push(id[1]);
  }
}

// Chapters whose language pass a commit records ("Hosea 4: language pass (…)").
const passed = (book) => {
  const subjects = git('log', '--format=%s', '-i', '--grep=language pass', '--', `content/${book.slug}/chapters`);
  const done = new Set();
  for (const s of subjects.split('\n')) {
    const m = s.match(/^[\w ]+? (\d+)(?:[–-](\d+))?: language pass/i);
    if (!m) continue;
    for (let n = +m[1]; n <= +(m[2] ?? m[1]); n++) done.add(n);
  }
  return done;
};

const ranges = (nums) => {
  const out = [];
  for (const n of [...nums].sort((a, b) => a - b)) {
    const last = out.at(-1);
    if (last && last[1] === n - 1) last[1] = n;
    else out.push([n, n]);
  }
  return out.map(([a, b]) => (a === b ? `${a}` : `${a}–${b}`)).join(', ');
};

const pushed = git('rev-parse', '--verify', '-q', 'origin/main').trim();
const proseReviews = parseProseReviews(git('log', '--format=%B%x00', '--grep=^Prose-Review:'));

for (const book of await discoverBooks(root)) {
  if (only && book.slug !== only) continue;
  const text = JSON.parse(await readFile(path.join(root, 'data/kjv', `${book.slug}.json`), 'utf8'));
  const total = text.chapters.length;
  const written = (await list(path.join(book.dir, 'chapters'), '.yaml')).map((f) => parseInt(f, 10));
  const ledgers = new Set((await list(path.join(book.dir, 'evidence'), '.yaml')).map((f) => parseInt(f, 10)));
  const bare = [];
  for (const n of written) {
    const src = await readFile(path.join(book.dir, 'chapters', `${String(n).padStart(2, '0')}.yaml`), 'utf8');
    if (!/^setting:/m.test(src)) bare.push(n);
  }
  const themes = await list(path.join(book.dir, 'themes'), '.md');
  const guides = await list(path.join(book.dir, 'guides'), '.md');
  const review = await reviewOf([[path.join(book.dir, 'themes'), themes], [path.join(book.dir, 'guides'), guides]]);
  const facsimiles = await list(path.join(book.dir, 'facsimiles'), '.yaml');
  const done = passed(book);
  const proseDone = [], proseStale = [];
  for (const n of written) {
    const record = proseReviews.get(`${book.slug}/${n}`);
    if (!record) continue; // Historical passes are not retroactively certified.
    if (record.version === PROSE_REVIEW_VERSION && record.source === proseSourceHash(path.join(book.dir, 'chapters', `${String(n).padStart(2, '0')}.yaml`))) {
      done.add(n);
      proseDone.push(n);
    } else {
      done.delete(n);
      proseStale.push(n);
    }
  }
  const noPass = written.filter((n) => !done.has(n));
  const noLedger = written.filter((n) => !ledgers.has(n));
  const unpushed = pushed ? git('log', '--oneline', `${pushed}..HEAD`, '--', `content/${book.slug}`).trim().split('\n').filter(Boolean).length : 0;
  const dirty = git('status', '--short', '--', `content/${book.slug}`).trim().split('\n').filter(Boolean).length;

  console.log(`\n${book.name}  (${book.status === 'preview' ? 'in preview' : 'live'})`);
  console.log(`  chapters      ${written.length} of ${total} written${bare.length ? `; bare: ${ranges(bare)}` : ''}`);
  if (written.length < total) {
    const missing = Array.from({ length: total }, (_, i) => i + 1).filter((n) => !written.includes(n));
    if (missing.length <= 20 || written.length > total / 2) console.log(`                not written: ${ranges(missing)}`);
  }
  console.log(`  ledgers       ${noLedger.length ? `none for ${ranges(noLedger)}` : 'every chapter'}`);
  console.log(`  language pass ${noPass.length ? `not recorded for ${ranges(noPass)}` : 'every chapter'}`);
  if (proseDone.length || proseStale.length) console.log(`  prose check v${PROSE_REVIEW_VERSION} ${proseDone.length ? `recorded for ${ranges(proseDone)}` : 'none current'}${proseStale.length ? `; not current for ${ranges(proseStale)}` : ''}`);
  console.log(`  pages         ${themes.length} theme, ${guides.length} guide${facsimiles.length ? `, ${facsimiles.length} facsimile` : ''}${review}`);
  console.log(`  illustration  ${book.visual ? book.visual.status ?? 'no status' : 'none'}`);
  console.log(`  for the author ${(waiting[book.name.toLowerCase()] ?? []).join(', ') || 'nothing'}`);
  if (unpushed || dirty) console.log(`  not pushed    ${unpushed} commit${unpushed === 1 ? '' : 's'}${dirty ? `; ${dirty} file${dirty === 1 ? '' : 's'} changed and not committed` : ''}`);
}
const site = waiting['the site'];
if (!only && site) console.log(`\nThe site: for the author ${site.join(', ')}`);
// Where a theme page or guide stands in the review of the pages written before 2026-10-25 (STANDARDS.md §8,
// “Where a page stands”): `review: unread` (rewritten, live, not yet read by the author), `review: read`,
// `review: old-form` (kept, rewritten when the author's study reaches the book). Returns the text for a pages line.
async function reviewOf(dirs) {
  const by = { unread: [], read: [], 'old-form': [] };
  for (const [dir, files] of dirs) for (const f of files) {
    const head = (await readFile(path.join(dir, f), 'utf8')).split(/\n---\n/)[0];
    const m = head.match(/^review:\s*(unread|read|old-form)\b/m);
    if (m) by[m[1]].push(f.replace(/^\d+-|\.md$/g, ''));
  }
  const parts = [];
  if (by.unread.length) parts.push(`unread by the author: ${by.unread.join(', ')}`);
  if (by['old-form'].length) parts.push(`old form: ${by['old-form'].join(', ')}`);
  if (by.read.length) parts.push(`read: ${by.read.length}`);
  return parts.length ? `; ${parts.join('; ')}` : '';
}

// A volume's guides (content/volumes/<slug>/guides/), and those whose front matter still says `status: preview`.
for (const v of discoverVolumes(root)) {
  if (!v.hasGuides || (only && only !== v.slug)) continue;
  const names = await list(path.join(v.dir, 'guides'), '.md');
  const preview = [];
  for (const f of names) if (/^status:\s*preview\b/m.test((await readFile(path.join(v.dir, 'guides', f), 'utf8')).split(/\n---\n/)[0])) preview.push(f.replace(/^\d+-|\.md$/g, ''));
  const ledgers = await list(path.join(v.dir, 'evidence/guides'), '.yaml');
  const noLedger = names.filter((f) => !ledgers.includes(f.replace(/\.md$/, '.yaml'))).map((f) => f.replace(/^\d+-|\.md$/g, ''));
  const review = await reviewOf([[path.join(v.dir, 'guides'), names]]);
  console.log(`\n${v.name} (volume)\n  pages         ${names.length} guide${preview.length ? `; in preview: ${preview.join(', ')}` : ''}${noLedger.length ? `; no ledger: ${noLedger.join(', ')}` : ''}${review}`);
}
console.log(`\n${driftLine()}`);
console.log('A book’s own decisions and state are in content/<book>/BRIEF.md; its history is `git log -- content/<book>`.');
