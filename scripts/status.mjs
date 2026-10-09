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
import { discoverBooks } from '../src/lib/books.mjs';

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
    const id = line.match(/^- \*\*([A-Za-z]+-?[A-Z0-9]*)\. /);
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
  const facsimiles = await list(path.join(book.dir, 'facsimiles'), '.yaml');
  const done = passed(book);
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
  console.log(`  pages         ${themes.length} theme, ${guides.length} guide${facsimiles.length ? `, ${facsimiles.length} facsimile` : ''}`);
  console.log(`  illustration  ${book.visual ? book.visual.status ?? 'no status' : 'none'}`);
  console.log(`  for the author ${(waiting[book.name.toLowerCase()] ?? []).join(', ') || 'nothing'}`);
  if (unpushed || dirty) console.log(`  not pushed    ${unpushed} commit${unpushed === 1 ? '' : 's'}${dirty ? `; ${dirty} file${dirty === 1 ? '' : 's'} changed and not committed` : ''}`);
}
const site = waiting['the site'];
if (!only && site) console.log(`\nThe site: for the author ${site.join(', ')}`);
console.log('\nA book’s own decisions and state are in content/<book>/BRIEF.md; its history is `git log -- content/<book>`.');
