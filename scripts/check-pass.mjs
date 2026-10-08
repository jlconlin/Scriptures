#!/usr/bin/env node
// After the language pass (the codex-pass workflow) and before committing: what did the edits add?
// The pass may cut, merge and reword but add nothing, so for each chapter this sets the working file beside the
// last commit and lists new [[references]] (only pointers to another note are expected), new quoted passages
// (a re-punctuated old one shows here too), ledger rows added (none are expected), and the change in words.
//   node scripts/check-pass.mjs <book> <chapters…>     exit 1 if a ledger row was added
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const [book, ...nums] = process.argv.slice(2);
if (!book || !nums.length) { console.error('usage: node scripts/check-pass.mjs <book> <chapters…>'); process.exit(1); }
const pad = (n) => String(n).padStart(2, '0');
const head = (f) => { try { return execFileSync('git', ['show', `HEAD:${f}`], { encoding: 'utf8', maxBuffer: 1 << 26 }); } catch { return null; } };
const refs = (s) => new Set(s.match(/\[\[[^\]]+\]\]/g) ?? []);
const quotes = (s) => new Set(s.match(/“[^”]{15,}”/g) ?? []);
const words = (s) => s.split(/\s+/).filter(Boolean).length;
const rows = (s) => (s.match(/^\s*-\s+(where|claim):/gm) ?? []).length;
let bad = false;
for (const n of nums.map(Number)) {
  const c = `content/${book}/chapters/${pad(n)}.yaml`;
  const e = `content/${book}/evidence/${pad(n)}.yaml`;
  const was = head(c);
  if (was == null || !fs.existsSync(c)) { console.log(`${book} ${n}: not committed yet, or no file`); continue; }
  const now = fs.readFileSync(c, 'utf8');
  if (was === now) { console.log(`${book} ${n}: unchanged since the last commit`); continue; }
  const newRefs = [...refs(now)].filter((r) => !refs(was).has(r));
  const newQuotes = [...quotes(now)].filter((q) => !quotes(was).has(q));
  const wasRows = rows(head(e) ?? ''), nowRows = fs.existsSync(e) ? rows(fs.readFileSync(e, 'utf8')) : 0;
  if (nowRows > wasRows) bad = true;
  console.log(`${book} ${n}: ${words(was)} → ${words(now)} words; ledger rows ${wasRows} → ${nowRows}${nowRows > wasRows ? '  ✗ rows were added' : ''}`);
  if (newRefs.length) console.log(`   new references (should be pointers to a note): ${newRefs.join(' ')}`);
  for (const q of newQuotes) console.log(`   new or changed quotation: ${q.slice(0, 90)}`);
}
process.exit(bad ? 1 : 0);
