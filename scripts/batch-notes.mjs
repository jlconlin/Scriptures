// Reads the reviewers' results from a write-chapters workflow run (.claude/workflows/write-chapters.js) and
// files what they reported: reader questions no source answered go to the book's OPEN-QUESTIONS.md, topics that
// run across chapters to its THEME-CANDIDATES.md. Prints what needs the author and what blocked a reviewer.
// Usage: node scripts/batch-notes.mjs <book> <the run's journal.jsonl> [--dry]
import { readFileSync, appendFileSync } from 'node:fs';
import path from 'node:path';
import { findBook, bookArg } from '../src/lib/books.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const argv = process.argv.slice(2);
const dry = argv.includes('--dry');
const journal = argv.find((a) => a.endsWith('.jsonl'));
const { slug } = bookArg(argv.filter((a) => a !== journal && !a.startsWith('--')));
const book = await findBook(ROOT, slug);
if (!journal) throw new Error('Give the path to the workflow run’s journal.jsonl');

// The journal has a “started” line (agent id, label such as review:12) and a “result” line for each agent.
const lines = readFileSync(journal, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const label = new Map(lines.filter((e) => e.type === 'started').map((e) => [e.agentId, e.label]));
const reviews = lines
  .filter((e) => e.type === 'result' && e.result && typeof e.result === 'object' && /^review:\d+$/.test(label.get(e.agentId) ?? ''))
  .map((e) => ({ chapter: +label.get(e.agentId).split(':')[1], ...e.result }))
  .sort((a, b) => a.chapter - b.chapter);
if (!reviews.length) throw new Error('No reviewer results in that journal');

const tidy = (s) => s.replace(/\s+/g, ' ').replace(/[.;]$/, '').trim();
const unanswered = reviews.filter((r) => r.unanswered?.length).map((r) => `- **${r.chapter}:** ${r.unanswered.map(tidy).join('; ')}.\n`).join('');
const themes = `\n## Reported by chapters ${reviews[0].chapter}–${reviews.at(-1).chapter} (not yet sorted)\n\n` +
  reviews.flatMap((r) => (r.themeCandidates ?? []).map((t) => `- (${r.chapter}) ${tidy(t)}.\n`)).join('');
if (!dry) {
  appendFileSync(path.join(book.dir, 'OPEN-QUESTIONS.md'), unanswered);
  appendFileSync(path.join(book.dir, 'THEME-CANDIDATES.md'), themes);
}
console.log(reviews.map((r) => `${r.chapter}: ${r.ready ? 'ready' : 'NOT READY'}`).join(', '));
for (const r of reviews) for (const q of r.authorQuestions ?? []) console.log(`\nFor the author, chapter ${r.chapter}: ${q}`);
for (const r of reviews) if (r.problems?.trim()) console.log(`\nReviewer of ${r.chapter}: ${r.problems.trim()}`);
