// After a write-chapters batch: writes the reviewers' decisions into the book's brief, under
// “Decided while writing”, by chapter, and prints each reviewer's verdict, checks, questions for the
// author and problems, shortened. scripts/batch-notes.mjs does the reader questions and theme candidates.
// Usage: node scripts/batch-decided.cjs <book> <the run's journal.jsonl> [--date 2026-10-06] [--dry]
const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); return i < 0 ? null : argv[i + 1]; };
const [book, journal] = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--date');
if (!book || !journal) { console.error('Usage: node scripts/batch-decided.cjs <book> <journal.jsonl> [--date YYYY-MM-DD] [--dry]'); process.exit(1); }
const date = flag('--date') ?? new Date().toISOString().slice(0, 10);
const short = (s, n) => { s = String(s ?? '').replace(/\s+/g, ' '); return s.length > n ? `${s.slice(0, n)}…` : s; };

const reviews = [];
for (const line of fs.readFileSync(journal, 'utf8').split('\n').filter(Boolean)) {
  let o; try { o = JSON.parse(line); } catch { continue; }
  if (o.type !== 'result') continue;
  let v = o.result ?? o.value;
  if (typeof v === 'string') { try { v = JSON.parse(v); } catch { continue; } }
  if (!v || typeof v !== 'object' || !('ready' in v)) continue;
  // A reviewer's summary begins with the book and chapter (“Moses 1 is ready…”).
  const chapter = Number(String(v.summary ?? '').match(/\b(\d+)\b/)?.[1]);
  reviews.push({ chapter, ...v });
}
reviews.sort((a, b) => a.chapter - b.chapter);

for (const r of reviews) {
  console.log(`\n== ${book} ${r.chapter}: ${r.ready ? 'ready' : 'NOT READY'}`);
  console.log(`   ${short(r.summary, 500)}`);
  console.log(`   checks: ${short(r.checks, 300)}`);
  for (const q of r.authorQuestions ?? []) console.log(`   FOR THE AUTHOR: ${q}`);
  if (r.problems) console.log(`   problems: ${short(r.problems, 600)}`);
}

const brief = path.join('content', book, 'BRIEF.md');
const text = fs.readFileSync(brief, 'utf8');
const heading = '## Decided while writing';
const at = text.indexOf(heading);
if (at < 0) { console.error(`\n${brief} has no “${heading}” section`); process.exit(1); }
const next = text.indexOf('\n## ', at + heading.length);
let section = text.slice(at + heading.length, next < 0 ? undefined : next).replace(/\*\(Reviewers' decisions go here, by chapter\.\)\*\n?/, '').trimEnd();
if (!/Settled by the reviewers/.test(section)) section += `\n\nSettled by the reviewers on ${date}, by the standard and this brief, without the author; any of them can be overturned.`;
let added = 0;
for (const r of reviews) {
  if (!(r.decided ?? []).length || section.includes(`**Chapter ${r.chapter}**`)) continue;
  section += `\n\n**Chapter ${r.chapter}**\n\n${r.decided.map((d) => `- ${d.replace(/&amp;/g, '&')}`).join('\n')}`;
  added++;
}
if (!argv.includes('--dry')) fs.writeFileSync(brief, `${text.slice(0, at + heading.length)}${section}\n${next < 0 ? '' : text.slice(next)}`);
console.log(`\n${added} chapter(s) of decisions ${argv.includes('--dry') ? 'would be' : ''} added to ${brief}.`);
