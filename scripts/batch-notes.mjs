// Reads the reviewers' results from a write-chapters workflow run (.claude/workflows/write-chapters.js) and
// files what they reported: reader questions no source answered go to content/<book>/UNANSWERED.md, topics that run across chapters to .cache/batch/<book>/theme-leads.md (working notes, not committed).
// Prints what the reviewers left for the author, to be settled or added by hand to OPEN-QUESTIONS.md at the
// top of the repository, and what blocked a reviewer.
// Usage: node scripts/batch-notes.mjs <book> <the run's journal.jsonl> [--dry]
import { readFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs';
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
  // The unanswered questions go to content/<book>/UNANSWERED.md, never into the brief, which stays brief.
  const file = path.join(book.dir, 'UNANSWERED.md');
  if (!existsSync(file)) appendFileSync(file, `# ${book.name}: reader questions no source answered\n\nQuestions a reader would ask that no source read answered, by chapter: a list for a later deepening pass. Kept out of \`BRIEF.md\` so the brief stays brief.\n\n`);
  appendFileSync(file, unanswered);
  // The reviewers' theme leads are no longer appended to THEME-CANDIDATES.md (author, 2026-10-11, of Psalms' file: “way too much
  // stuff in there”). They are written to the batch's working folder for the coordinator, who proposes a few arcs after the book is written.
  mkdirSync(path.join(ROOT, '.cache/batch', book.slug), { recursive: true });
  appendFileSync(path.join(ROOT, '.cache/batch', book.slug, 'theme-leads.md'), themes);
}
console.log(reviews.map((r) => `${r.chapter}: ${r.ready ? 'ready' : 'NOT READY'}`).join(', '));
for (const r of reviews) for (const q of r.authorQuestions ?? []) console.log(`\nFor the author, chapter ${r.chapter}: ${q}`);
for (const r of reviews) if (r.problems?.trim()) console.log(`\nReviewer of ${r.chapter}: ${r.problems.trim()}`);
