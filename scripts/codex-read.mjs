#!/usr/bin/env node
// A second reader from another model family, for language only (author, 2026-10-07, as a trial): Codex reads
// finished, reviewed chapters and writes a list of findings. It edits nothing (the sandbox is read-only), opens
// no source, and does not judge the citations; whoever coordinates decides the findings and reruns the checks.
//   node scripts/codex-read.mjs <book> <chapter>            one chapter → .cache/batch/<book>/reports/NN-codex.md
//   node scripts/codex-read.mjs <book> <from>-<to> --across  the chapters read together, for what repeats or
//                                                            disagrees between them → reports/NN-NN-codex.md
//   node scripts/codex-read.mjs <book> book                  the book page's own words (book.yaml) → reports/book-codex.md
//   node scripts/codex-read.mjs <book> <page file name>      a theme or guide page → reports/<name>-codex.md
//   node scripts/codex-read.mjs <book> facsimile-<n>         a facsimile page → reports/facsimile-<n>-codex.md
//   node scripts/codex-read.mjs --file <path>                any other page (content/about.md, content/volumes/…)
//                                                            → .cache/codex/<name>-codex.md
// Every page the site gains is read this way before the author sees it (author, 2026-10-07).
//   --model <codex model>   --print (the prompt only)
//   --inline   one chapter only: the standard's two sections, the chapter's verses and the chapter file are put in
//              the prompt, so Codex opens nothing. A reading then costs about a third of Codex's allowance
//              (it took some 34,000 tokens a page when Codex opened the files itself; author's limit, 2026-10-08).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i < 0 ? null : args.splice(i, 2)[1]; };
const has = (name) => { const i = args.indexOf(name); if (i < 0) return false; args.splice(i, 1); return true; };
const model = flag('--model');
const across = has('--across');
const print = has('--print');
const inline = has('--inline');
const file = flag('--file');
const [book, range] = args;
if (!file && (!book || !range)) { console.error('usage: node scripts/codex-read.mjs <book> <chapter | from-to --across | book | page file name> | --file <path>  [--model <codex model>] [--print]'); process.exit(1); }
const pad = (n) => String(n).padStart(2, '0');
const isChapters = !file && /^\d+(-\d+)?$/.test(range);
const [from, to = from] = isChapters ? range.split('-').map(Number) : [];
const files = [];
let page = null; // a page that is not a chapter: { path, kind, name }
if (isChapters) {
  for (let n = from; n <= to; n++) {
    const f = `content/${book}/chapters/${pad(n)}.yaml`;
    if (fs.existsSync(f)) files.push(f);
  }
  if (!files.length) { console.error(`no written chapter of ${book} in ${range}`); process.exit(1); }
} else if (file) {
  if (!fs.existsSync(file)) { console.error(`no file ${file}`); process.exit(1); }
  page = { path: file, kind: 'page', name: path.basename(file).replace(/\.[^.]+$/, '') };
} else if (range === 'book') {
  page = { path: `content/${book}/book.yaml`, kind: 'book', name: 'book' };
} else {
  const name = range.replace(/\.md$/, '');
  const fac = name.replace(/^facsimile-/, '');
  const found = ['themes', 'guides'].map((d) => `content/${book}/${d}/${name}.md`).find((f) => fs.existsSync(f))
    ?? [`content/${book}/facsimiles/${fac}.yaml`].find((f) => fs.existsSync(f));
  if (!found) { console.error(`no theme, guide or facsimile page “${name}” in content/${book}/`); process.exit(1); }
  page = { path: found, kind: found.endsWith('.yaml') ? 'facsimile' : 'page', name };
}

const shared = `You are a careful copy editor reading commentary on scripture for a study site. You change no file: you write a list of findings and nothing else. Read STANDARDS.md sections 2 and 3 (audience and voice) first; they are the rules. The chapter files are YAML: verses are in data/kjv/<book>.json, and the commentary is in the fields setting, thread, christ, explore, each section's plain, and each note's title and body.

Out of scope, do not report: whether a claim is true or its citation right (others have checked every source); the choice of which verses have notes; YAML layout; [[references]] and their format; spelling the King James text uses.

Never suggest adding a fact, a cross-reference, an interpretation, or a connection: the writers may say only what a source they read says. A suggested wording must say exactly what the sentence already says, in fewer or plainer words, and must leave every passage inside quotation marks untouched.`;

const one = `${shared}

Read ${files[0]} and report, in the order of the file:
1. A sentence that is hard to follow, ambiguous, or longer than it needs to be; a paragraph that says the same thing twice.
2. A note whose first sentence does not say what the note is about (the site shows it as the note's preview), or that opens with a hook or a label.
3. A source announced in running text (“the manual says”, “one commentator notes”) or a modern scholar named.
4. A technical term or Hebrew word used without being explained the first time; Hebrew detail that does not change the meaning for a reader.
5. A claim worded more firmly than the words around it support (“clearly”, “certainly”, “the point is”), or a reading presented as fact.
6. Two notes, or a note and the setting, thread, christ or explore, that say the same thing; two places that contradict each other.
7. A “plain” paraphrase that says something its verses do not, or adds an interpretation.
8. Anything preachy, or an application to the reader's life made in the writer's own voice.
9. Typos, grammar, inconsistent names or terms.

For each finding give: where (the field, and the verse and note title for a note), the words quoted exactly, what is wrong in one sentence, and a suggested wording when one helps. Number them. Put the ten that matter most first under “Most worth fixing”, then the rest. If a category has nothing, don't mention it. End with one line: how the chapter reads as a whole, and whether it is too long for what it says.`;

const many = `${shared}

Read these chapters of one book together: ${files.join(', ')}. Each was written and reviewed by agents that saw only its own chapter. Report only what can be seen by reading them side by side:
1. The same thing explained in two or more chapters (a term, a person, a place, a custom, a date, a refrain) where one explanation and a pointer would do. Say which chapter should keep it.
2. Two chapters that disagree: a date, an identification, the meaning given for a word or an image, how a name is spelled or a term is used.
3. The same sentence, quotation, or near-identical paragraph in more than one chapter.
4. A chapter that points to something as explained elsewhere when it is not, or that assumes what an earlier chapter never said.
5. Differences of voice or length between chapters that a reader going straight through would notice.

For each finding give the chapters and verses, the words quoted exactly from each, and what you would do. Number them, most important first. End with a short paragraph on how the chapters read in sequence.`;

const rules = `1. A sentence that is hard to follow, ambiguous, or longer than it needs to be; a paragraph or section that says the same thing twice.
2. A source announced in running text (“the manual says”, “one commentator notes”) or a modern scholar named.
3. A technical term or Hebrew word used without being explained the first time.
4. A claim worded more firmly than the words around it support, or a reading presented as fact.
5. Two places that say the same thing, or that contradict each other.
6. Anything preachy, or an application to the reader's life made in the writer's own voice.
7. Typos, grammar, inconsistent names or terms.`;
const report = `For each finding give: where (the heading or field), the words quoted exactly, what is wrong in one sentence, and a suggested wording when one helps. Number them, the ones that matter most first. If a category has nothing, don't mention it. End with one line on how the page reads as a whole and whether it is too long for what it says.`;
const pageAsk = page && (page.kind === 'book'
  ? `${shared}

Read ${page.path}: the words of one book's landing page on the site (heroQuote, description, divisionsBlurb, home.blurb, intro, each division's name and blurb, the beloved verses, any titles). A reader meets these before any chapter. Report:
${rules}
8. A blurb that would not tell a newcomer what that part of the book holds, or two blurbs that say the same thing.
9. A quotation in heroQuote or beloved that is not word for word in data/kjv/${book}.json at the verse given (do check these against that file).

${report}`
  : `${shared}

Read ${page.path}: one page of the site${page.kind === 'facsimile' ? ' (YAML: the commentary is in about and in each note’s title and body)' : ' (Markdown; a marker like [@key] is a citation and [[Isa. 53:4]] a scripture link: leave both alone)'}. Report, in the order of the page:
${rules}
8. A section whose heading does not say what it holds, an opening that does not say what the page is about, or a section that does not follow from the one before.

${report}`);
const inlined = () => {
  const std = fs.readFileSync('STANDARDS.md', 'utf8');
  const sections = std.slice(std.indexOf('\n## 2.'), std.indexOf('\n## 4.'));
  const verses = JSON.parse(fs.readFileSync(`data/kjv/${book}.json`, 'utf8')).chapters[from - 1] ?? [];
  return `${one}

Everything you need is below. Do not open any file and do not run any command; answer from this text alone.

===== STANDARDS.md, sections 2 and 3 =====
${sections.trim()}

===== The verses of the chapter (data/kjv/${book}.json) =====
${verses.map((v, i) => `${i + 1} ${v}`).join('\n')}

===== ${files[0]} =====
${fs.readFileSync(files[0], 'utf8')}`;
};
const ask = page ? pageAsk : across ? many : inline && from === to ? inlined() : one;
if (print) { console.log(ask); process.exit(0); }
const outDir = file ? '.cache/codex' : `.cache/batch/${book}/reports`;
fs.mkdirSync(outDir, { recursive: true });
const out = path.resolve(outDir, page ? `${page.name}-codex.md` : across ? `${pad(from)}-${pad(to)}-codex.md` : `${pad(from)}-codex.md`);
const run = spawnSync('codex', ['exec', ...(model ? ['-m', model] : []), '--sandbox', 'read-only', '--ephemeral', '-C', process.cwd(), '-o', out, '-'],
  { input: ask, stdio: ['pipe', 'ignore', 'inherit'], timeout: 30 * 60 * 1000 });
if (run.error) { console.error(run.error.code === 'ENOENT' ? 'the codex CLI is not installed or not on PATH' : run.error.message); process.exit(1); }
if (run.status !== 0 || !fs.existsSync(out)) { console.error(`codex exec ended with status ${run.status} and ${fs.existsSync(out) ? 'a' : 'no'} findings file`); process.exit(1); }
console.log(`${path.relative(process.cwd(), out)}: ${fs.readFileSync(out, 'utf8').length} characters`);
