#!/usr/bin/env node
// Appends one sentence (a link to a theme page) to the end of a chapter note's body, without reformatting the file.
// usage: node scripts/link-theme.mjs <book> <chapter> <verse> "<note title>" "<sentence>"
import { readFile, writeFile } from 'node:fs/promises';
const [book, ch, verse, title, sentence] = process.argv.slice(2);
if (!sentence) { console.error('usage: node scripts/link-theme.mjs <book> <chapter> <verse> "<note title>" "<sentence>"'); process.exit(1); }
const file = `content/${book}/chapters/${String(ch).padStart(2, '0')}.yaml`;
const lines = (await readFile(file, 'utf8')).split('\n');
const norm = (s) => s.replace(/[^\p{L}\p{N}]+/gu, ' ').trim().toLowerCase();
let start = -1;
for (let i = 0; i < lines.length; i++) {
  if (!/^\s*title:/.test(lines[i]) || !norm(lines[i]).includes(norm(title))) continue;
  // the note this title belongs to starts at the nearest “- ref:” above
  let j = i; while (j >= 0 && !/^\s*- ref:/.test(lines[j])) j--;
  if (j >= 0 && new RegExp(`^\\s*- ref: ${verse}\\s*$`).test(lines[j])) { start = j; break; }
}
if (start < 0) { console.error(`${file}: no note at verse ${verse} titled “${title}”`); process.exit(1); }
let body = -1, end = lines.length;
for (let i = start + 1; i < lines.length; i++) {
  if (/^\s*- ref:/.test(lines[i]) || /^\S/.test(lines[i])) { end = i; break; }
  if (/^\s*body:\s*[|>]/.test(lines[i])) body = i;
}
if (body < 0) { console.error(`${file}: the note’s body is not a block scalar`); process.exit(1); }
const indent = lines[body + 1].match(/^\s*/)[0];
// the body ends where a line indented less than the body's own text begins (the note's `sources:`)
let last = body + 1;
for (let i = body + 1; i < end; i++) { if (lines[i].trim() && !lines[i].startsWith(indent)) break; if (lines[i].trim()) last = i; }
if (lines.slice(body, last + 1).some((l) => l.includes(sentence.slice(0, 40)))) { console.log(`${file}: already linked`); process.exit(0); }
lines.splice(last + 1, 0, '', indent + sentence);
await writeFile(file, lines.join('\n'));
console.log(`${file}: linked from the note at ${ch}:${verse}`);
