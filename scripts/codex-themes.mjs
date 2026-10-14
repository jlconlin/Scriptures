// Codex's review of a finished book's theme candidates (author, 2026-10-13: “Send the list of Theme candidates to Codex.
// Ask it to review the list, propose some ideas of its own then return that list. I will review and approve the final
// list”; and “We should make this an automatic step at the end of a book generation. It can happen while I'm approving
// the image”). batch-finish.mjs runs it once every chapter of the book is written; it can also be run by hand.
// Codex reads STANDARDS.md §8, the book's THEME-CANDIDATES.md, the reviewers' leads (.cache/batch/<book>/theme-leads.md),
// the brief and the chapters, read-only; judges each candidate; proposes arcs of its own, marked as its own; and returns
// a ranked list of three to six pages with a “Not recommended” section. Nothing is chosen until the author approves:
// the coordinator shows the list, and only the author's choice goes into THEME-CANDIDATES.md.
// Writes .cache/batch/<book>/reports/themes-codex.md; skipped if that file exists (--force to run again).
// Usage: node scripts/codex-themes.mjs <book> [--model <codex model>] [--force] [--print]
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { findBook } from '../src/lib/books.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const argv = process.argv.slice(2);
const flag = (n) => { const i = argv.indexOf(n); return i < 0 ? false : (argv.splice(i, 1), true); };
const value = (n) => { const i = argv.indexOf(n); if (i < 0) return null; const v = argv[i + 1]; argv.splice(i, 2); return v; };
const force = flag('--force'), print = flag('--print'), model = value('--model');
if (argv.length !== 1) { console.error('Usage: node scripts/codex-themes.mjs <book> [--model <codex model>] [--force] [--print]'); process.exit(1); }
const book = await findBook(ROOT, argv[0]);
const scratch = path.join(ROOT, '.cache/batch', book.slug);
const out = path.join(scratch, 'reports/themes-codex.md');
if (fs.existsSync(out) && !force && !print) { console.log(`Already written: ${path.relative(ROOT, out)} (--force to run again)`); process.exit(0); }
const leadsFile = path.join(scratch, 'theme-leads.md');
const leads = fs.existsSync(leadsFile) ? fs.readFileSync(leadsFile, 'utf8').trim() : '(none were reported)';
const dir = `content/${book.slug}`;

const prompt = `You are helping choose theme pages for the book of ${book.name} on a Latter-day Saint scripture study site. You are working read-only in the site's repository. Edit nothing.

Read first:
- STANDARDS.md section 8, "Guides and theme pages", especially "What earns a theme page" and "Where the meaning comes from". A theme page is an arc across several chapters that points to Jesus Christ; it is short (well under 1,000 words); a book gets a handful; a topic that lives in one chapter belongs in that chapter's notes; a theme page may make connections of its own, but they must rest on words a reader can check, and must add no doctrine.
- ${dir}/THEME-CANDIDATES.md: the candidates proposed so far, and any the author has already chosen or written (don't propose those again).
- The chapters themselves: ${dir}/chapters/*.yaml (the text is in data/kjv/${book.slug}.json). Read them, so your judgment rests on what the book and the site's notes actually say. Pages already written are in ${dir}/themes/.
- Skim ${dir}/BRIEF.md for the book's approach.

Here are further leads the chapter reviewers reported (unsorted, many overlap):
${leads}

Your task:
1. Review the existing candidates and the reviewers' leads against the standard. For each, say briefly whether it earns a page and why: is it an arc (does something change from the first passage to the last), does it run across several chapters, and does it lead to Jesus Christ from scripture? Merge leads that are the same arc.
2. Propose ideas of your own: arcs in ${book.name} the list above misses, including connections to Christ or to Restoration scripture that a careful reader could check in the text. Say which ideas are yours.
3. Return a final recommended list of 3 to 6 theme pages, ranked. For each give: a short title (a phrase from the text is good); the key passages in order; the arc in two or three sentences (what changes from first to last); how it points to Christ; and why it is more than chapter notes.
4. After the list, a short section "Not recommended" naming the leads you set aside, each with one line of reason.

Write plainly and briefly. The author will read your list and choose.`;

if (print) { console.log(prompt); process.exit(0); }
fs.mkdirSync(path.dirname(out), { recursive: true });
const run = spawnSync('codex', ['exec', ...(model ? ['-m', model] : []), '--sandbox', 'read-only', '--ephemeral', '-C', ROOT, '-o', out, '-'],
  { input: prompt, encoding: 'utf8', stdio: ['pipe', 'ignore', 'pipe'], maxBuffer: 64e6, timeout: 1800e3 });
if (run.status !== 0 || !fs.existsSync(out)) { console.error(`codex exec ended with status ${run.status} and ${fs.existsSync(out) ? 'a' : 'no'} list`); process.exit(1); }
console.log(`Codex's theme list for ${book.name}: ${path.relative(ROOT, out)} (${fs.statSync(out).size} characters). Show it to the author; only their choice goes into THEME-CANDIDATES.md.`);
