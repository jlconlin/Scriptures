// Runs every check on one chapter that an agent runs by hand, prints a one-line result for each and, under it, only the lines
// that concern this chapter (the build writes about every chapter of every book), and exits 1 if any fails (author, 2026-10-04: a
// step an agent repeats mechanically is a script). In order:
//   fix-yaml      scripts/fix-yaml.mjs on the chapter's file (quotes values with “: ”); fails if the file does not parse after it
//   build         PREVIEW=1 BUILD_OUT=.cache/batch/<book>/dist-NN node scripts/build.mjs, so a book in preview is built and no other agent's
//                 output is touched; fails on a warning that names this chapter or its [[references]] (“unknown source key” for a key in
//                 the proposed file is expected and only listed)
//   check-quotes  scripture quotations against the scripture (scripts/check-quotes.mjs)
//   check-content sourcing, the ledger's form and coverage, and the writing rules, with the chapter's proposed sources added in memory
//                 when .cache/batch/<book>/proposed/NN.yaml exists (scripts/check-content.mjs); fails on an error, lists the warnings
//   check-ledger  reopens every ledger row's URL and confirms the quote is on the page (scripts/check-ledger.mjs; slow when the pages
//                 are not in the cache)
// Usage: node scripts/check-chapter.mjs <book> <chapter> [--skip ledger,quotes,...] [--fresh]
//   --skip names checks to leave out (fix-yaml, build, quotes, content, ledger); --fresh passes --fresh to check-ledger.
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import YAML from 'yaml';
import { findBook } from '../src/lib/books.mjs';
import { SCRIPT_ROOT as ROOT, pad, readProposed } from '../src/lib/ledger.mjs';

const argv = process.argv.slice(2);
const skipAt = argv.indexOf('--skip');
const skip = skipAt >= 0 ? (argv.splice(skipAt, 2)[1] ?? '').split(',') : [];
const fresh = argv.includes('--fresh');
const [slug, chapterArg] = argv.filter((a) => !a.startsWith('--'));
if (!slug || !/^\d+$/.test(chapterArg ?? '')) { console.error('Usage: node scripts/check-chapter.mjs <book> <chapter> [--skip ledger,quotes,build,content,fix-yaml] [--fresh]'); process.exit(1); }
const n = +chapterArg, nn = pad(n);
const book = await findBook(ROOT, slug);
const file = path.join('content', slug, 'chapters', `${nn}.yaml`);
if (!existsSync(path.join(ROOT, file))) { console.error(`No chapter file ${file}.`); process.exit(1); }
const hasLedger = existsSync(path.join(ROOT, 'content', slug, 'evidence', `${nn}.yaml`));

// Runs node with the arguments, both output streams together, in order; { out, code }.
const run = (args, env = {}) => {
  const r = spawnSync('sh', ['-c', 'exec "$@" 2>&1', 'sh', 'node', ...args], { cwd: ROOT, env: { ...process.env, ...env }, encoding: 'utf8', maxBuffer: 512e6 });
  return { out: r.stdout ?? '', code: r.status };
};
const lines = (out) => out.split('\n').map((l) => l.trimEnd()).filter(Boolean);
const results = []; // { name, ok, summary, details }
const done = (name, ok, summary, details = []) => {
  results.push({ name, ok });
  console.log(`${ok ? '✓' : '✗'} ${name.padEnd(13)} ${summary}`);
  for (const d of details) console.log(`    ${d.trim()}`);
};
const want = (name) => !skip.includes(name) && !(name === 'ledger' && !hasLedger);
console.log(`${book.name} ${n} (${file}${hasLedger ? '' : '; no ledger yet'})\n`);

// ---------- fix-yaml ----------
if (want('fix-yaml')) {
  const before = await readFile(path.join(ROOT, file), 'utf8');
  const r = run(['scripts/fix-yaml.mjs', file]);
  const after = await readFile(path.join(ROOT, file), 'utf8');
  let parses = true, why = '';
  try { YAML.parse(after); } catch (e) { parses = false; why = e.message.split('\n')[0]; }
  done('fix-yaml', r.code === 0 && parses, !parses ? `the file does not parse: ${why}` : r.code ? 'failed' : before === after ? 'nothing to quote' : `quoted ${after.split('\n').filter((l, i) => l !== before.split('\n')[i]).length} line(s)`, r.code ? lines(r.out).slice(-5) : []);
}

// ---------- build ----------
if (want('build')) {
  const dir = `.cache/batch/${slug}/dist-${nn}`;
  const r = run(['scripts/build.mjs'], { PREVIEW: '1', BUILD_OUT: dir });
  const text = await readFile(path.join(ROOT, file), 'utf8');
  let proposed = {};
  try { proposed = await readProposed(slug, n); } catch {}
  const mine = [], expected = [];
  for (const l of lines(r.out)) {
    const m = l.match(/^\s*⚠ (.*)$/);
    if (m) {
      const w = m[1], ref = w.match(/^unrecognized scripture reference: \[\[(.*)\]\]$/);
      if (w.startsWith(`${book.name} ${n}:`) || (ref && text.includes(`[[${ref[1]}`))) {
        const key = w.match(/unknown source key “([^”]+)”/)?.[1];
        (key && key in proposed ? expected : mine).push(w);
      }
    } else if (new RegExp(`^${book.name}: Unwritten chapters .*: (?:.*, )?${n}(?:,|$)`).test(l)) mine.push(`${book.name} ${n} is listed as unwritten: the build found no usable chapter file`);
  }
  done('build', r.code === 0 && !mine.length, r.code ? `the build failed (exit ${r.code})` : mine.length ? `${mine.length} warning(s) name this chapter` : `no warning names this chapter${expected.length ? `; ${expected.length} “unknown source key” for proposed keys (expected)` : ''}`, r.code ? lines(r.out).slice(-8) : [...mine, ...expected.map((w) => `(expected) ${w}`)]);
}

// ---------- check-quotes ----------
if (want('quotes')) {
  const r = run(['scripts/check-quotes.mjs', slug, String(n)]);
  const l = lines(r.out);
  done('check-quotes', r.code === 0, `${l.find((x) => /^Checked/.test(x)) ?? l.at(-1) ?? 'no output'}${r.code ? ' Some are not in the scripture they cite.' : ''}`, r.code ? l.filter((x) => !/^Checked/.test(x)) : []);
}

// ---------- check-content ----------
if (want('content')) {
  const r = run(['scripts/check-content.mjs', slug, String(n)]);
  const l = lines(r.out), summary = l.at(-1) ?? '', rest = l.filter((x) => x !== summary && x !== 'Global checks');
  done('check-content', r.code === 0, summary.replace(/^\d+ chapter\(s\) in \d+ book\(s\); /, ''), rest);
}

// ---------- check-ledger ----------
if (want('ledger')) {
  const r = run(['scripts/check-ledger.mjs', slug, String(n), ...(fresh ? ['--fresh'] : [])]);
  const l = lines(r.out), line = l.find((x) => /rows confirmed/.test(x)) ?? l.at(-1) ?? 'no output';
  done('check-ledger', r.code === 0, line.replace(/^.*?: /, ''), l.filter((x) => /^\s*[✗?] /.test(x)));
} else if (!skip.includes('ledger')) console.log('- check-ledger   skipped: the chapter has no ledger yet');

const failed = results.filter((r) => !r.ok).map((r) => r.name);
console.log(`\n${failed.length ? `Failed: ${failed.join(', ')}.` : 'Every check passed.'} (${results.length} run${skip.length ? `; left out: ${skip.join(', ')}` : ''}. Warnings under check-content are for the writer or reviewer to decide.)`);
process.exit(failed.length ? 1 : 0);
