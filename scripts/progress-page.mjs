// A one-page picture of where a book's writing run stands, for the author to open as an artifact while
// batches run: every chapter as a cell (finished, written and waiting for the language pass, being written,
// not started), the counts, what is running now, and the questions waiting. Read from the repository, like
// status.mjs: chapter files, commit subjects (“… language pass …”), OPEN-QUESTIONS.md.
// Usage: node scripts/progress-page.mjs <book> [--writing 94-105] [--pass 85,88-93] [--note "text"]
//   --writing / --pass  the chapters a write-chapters or codex-pass run has in hand right now
//   writes .cache/progress/<book>.html (publish it with the Artifact tool; same path = same link)
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import YAML from 'yaml';
import { findBook } from '../src/lib/books.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const argv = process.argv.slice(2);
const slug = argv[0];
const opt = (name) => { const i = argv.indexOf(name); return i < 0 ? '' : argv[i + 1] ?? ''; };
const list = (s) => s.split(',').filter(Boolean).flatMap((p) => { const [a, b] = p.split('-').map(Number); return Array.from({ length: (b ?? a) - a + 1 }, (_, i) => a + i); });
const book = await findBook(ROOT, slug);
const total = JSON.parse(readFileSync(path.join(ROOT, `data/kjv/${slug}.json`), 'utf8')).chapters.length;
const pad = (n) => String(n).padStart(2, '0');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' });

const committed = new Set(git('ls-files', `content/${slug}/chapters`).split('\n').map((f) => +path.basename(f, '.yaml')).filter(Boolean));
const passed = new Set([...git('log', '--format=%s', '--grep', 'language pass', '--', `content/${slug}/chapters`).matchAll(/^\S+ (\d+): language pass/gm)].map((m) => +m[1]));
const writing = new Set(list(opt('--writing'))), inPass = new Set(list(opt('--pass')));
const unit = book.unit?.singular ?? 'Chapter', units = book.unit?.plural ?? 'chapters';

let notes = 0, words = 0;
const titles = {};
for (const n of committed) {
  try { const c = YAML.parse(readFileSync(path.join(book.dir, 'chapters', `${pad(n)}.yaml`), 'utf8')); titles[n] = c.title; for (const x of c.notes ?? []) { notes++; if (x.kind === 'words') words++; } } catch { /* a file being edited */ }
}
const state = (n) => (committed.has(n) ? (passed.has(n) ? 'done' : inPass.has(n) ? 'passing' : 'written') : writing.has(n) ? 'writing' : 'todo');
const count = (s) => Array.from({ length: total }, (_, i) => state(i + 1)).filter((x) => x === s).length;
const LABEL = { done: 'Finished', passing: 'In the language pass', written: 'Written and reviewed', writing: 'Being written', todo: 'Not started' };

const oq = readFileSync(path.join(ROOT, 'OPEN-QUESTIONS.md'), 'utf8');
const head = oq.indexOf(`\n## ${book.name}\n`), next = oq.indexOf('\n## ', head + 1);
const questions = head < 0 ? [] : [...oq.slice(head, next < 0 ? undefined : next).matchAll(/^- \*\*(\w+)\.\*?\*? ?(.*)$/gm)].map((m) => ({ id: m[1], text: m[2].replace(/\*\*/g, '').replace(/[`*]/g, '') }));

const divisions = book.divisions.map((d) => {
  const cells = Array.from({ length: d.range[1] - d.range[0] + 1 }, (_, i) => d.range[0] + i)
    .map((n) => `<span class="cell ${state(n)}" title="${esc(`${unit} ${n}${titles[n] ? `: ${titles[n]}` : ''} · ${LABEL[state(n)]}`)}">${n}</span>`).join('');
  const fin = Array.from({ length: d.range[1] - d.range[0] + 1 }, (_, i) => state(d.range[0] + i)).filter((s) => s === 'done').length;
  return `<section class="division"><h3>${esc(d.name)} <small>${d.range[0]}–${d.range[1]} · ${fin} of ${d.range[1] - d.range[0] + 1} finished</small></h3><div class="cells">${cells}</div></section>`;
}).join('\n');

const now = new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const running = [writing.size ? `Writing and reviewing ${units} ${opt('--writing')}` : '', inPass.size ? `Language pass on ${opt('--pass')}` : ''].filter(Boolean);
const done = count('done'), wr = count('written') + count('passing');
const html = `<title>${esc(book.name)} Progress</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,600&family=Figtree:wght@400;600;700&display=swap">
<style>
/* One column: the count, what is running, then the book as a grid of its ${units} by division. */
:root { --bg: #f6f3ee; --surface: #fffdf9; --ink: #25283a; --ink-2: #5d6072; --line: #ddd6c9; --done: #2f6f5e; --written: #b08a2e; --writing: #3b6ea8; --todo: #e7e1d6; --todo-ink: #8d8a80; --on: #fffdf9;
  --read: 'Literata', Georgia, serif; --ui: 'Figtree', system-ui, sans-serif; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #17181f; --surface: #20222c; --ink: #ece6da; --ink-2: #a9a69c; --line: #353846; --done: #58b79c; --written: #d9b45a; --writing: #7fb0e6; --todo: #2a2c38; --todo-ink: #7d7f8c; --on: #17181f; color-scheme: dark } }
:root[data-theme="dark"] { --bg: #17181f; --surface: #20222c; --ink: #ece6da; --ink-2: #a9a69c; --line: #353846; --done: #58b79c; --written: #d9b45a; --writing: #7fb0e6; --todo: #2a2c38; --todo-ink: #7d7f8c; --on: #17181f; color-scheme: dark }
body { background: var(--bg); color: var(--ink); font: 16px/1.5 var(--ui); }
main { max-width: 860px; margin: 0 auto; padding-inline: 20px; padding-block: 28px 56px; display: grid; gap: 28px; }
h1 { font: 600 2rem/1.15 var(--read); margin: 0; text-wrap: balance; }
h2 { font: 700 .78rem/1 var(--ui); letter-spacing: .09em; text-transform: uppercase; color: var(--ink-2); margin: 0 0 10px; }
h3 { font: 600 1.05rem/1.3 var(--read); margin: 0 0 8px; }
h3 small { font: 400 .8rem var(--ui); color: var(--ink-2); margin-left: 6px; }
.asof { color: var(--ink-2); margin: 6px 0 0; }
.bar { display: flex; height: 14px; border-radius: 7px; overflow: hidden; background: var(--todo); }
.bar i { display: block; }
.bar .done { background: var(--done); } .bar .written { background: var(--written); } .bar .writing { background: var(--writing); }
.figures { display: flex; flex-wrap: wrap; gap: 10px 28px; margin-top: 12px; font-variant-numeric: tabular-nums; }
.figures b { font: 600 1.6rem/1 var(--read); display: block; }
.figures span { color: var(--ink-2); font-size: .9rem; }
.running { background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px; }
.running ul { margin: 0; padding-left: 18px; } .running p { margin: 0; }
.legend { display: flex; flex-wrap: wrap; gap: 6px 16px; font-size: .85rem; color: var(--ink-2); }
.legend i { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 6px; vertical-align: -1px; }
.grid { display: grid; gap: 18px; }
.cells { display: grid; grid-template-columns: repeat(auto-fill, minmax(34px, 1fr)); gap: 4px; }
.cell { font: 600 .74rem/1 var(--ui); font-variant-numeric: tabular-nums; text-align: center; padding: 9px 0; border-radius: 5px; }
.cell.done, i.done { background: var(--done); color: var(--on); }
.cell.written, .cell.passing, i.written { background: var(--written); color: var(--on); }
.cell.writing, i.writing { background: var(--writing); color: var(--on); }
.cell.todo, i.todo { background: var(--todo); color: var(--todo-ink); }
.questions { margin: 0; padding: 0; list-style: none; display: grid; gap: 8px; }
.questions li { display: grid; grid-template-columns: 3.2em 1fr; gap: 8px; font: 400 .95rem/1.45 var(--read); min-width: 0; }
.questions b { font: 700 .8rem/1.7 var(--ui); color: var(--ink-2); }
details summary { cursor: pointer; font-weight: 600; }
details[open] summary { margin-bottom: 12px; }
</style>
<main>
  <header>
    <h1>${esc(book.name)}: ${done} of ${total} ${esc(units)} finished</h1>
    <p class="asof">As of ${esc(now)}. ${book.status === 'preview' ? 'The book is in preview; nothing is on the live site.' : 'The book is live.'}</p>
  </header>
  <section>
    <div class="bar" role="img" aria-label="${done} finished, ${wr} written and waiting for the language pass, ${count('writing')} being written, of ${total}"><i class="done" style="width:${(100 * done) / total}%"></i><i class="written" style="width:${(100 * wr) / total}%"></i><i class="writing" style="width:${(100 * count('writing')) / total}%"></i></div>
    <div class="figures">
      <div><b>${done}</b><span>finished: written, checked, reviewed, language pass</span></div>
      <div><b>${wr}</b><span>written and reviewed, language pass to come</span></div>
      <div><b>${count('writing')}</b><span>being written now</span></div>
      <div><b>${count('todo')}</b><span>not started</span></div>
    </div>
  </section>
  <section class="running">
    <h2>Running now</h2>
    ${running.length ? `<ul>${running.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>` : '<p>Nothing is running.</p>'}
    ${opt('--note') ? `<p style="margin-top:10px">${esc(opt('--note'))}</p>` : ''}
  </section>
  <section>
    <h2>Every ${esc(unit.toLowerCase())}</h2>
    <p class="legend"><span><i class="done"></i>Finished</span><span><i class="written"></i>Written and reviewed</span><span><i class="writing"></i>Being written</span><span><i class="todo"></i>Not started</span></p>
    <div class="grid" style="margin-top:14px">${divisions}</div>
  </section>
  <section>
    <h2>In the finished ${esc(units)}</h2>
    <div class="figures" style="margin-top:0">
      <div><b>${notes.toLocaleString('en-US')}</b><span>notes in ${committed.size} ${esc(units)}</span></div>
      <div><b>${notes ? Math.round((100 * words) / notes) : 0}%</b><span>of them are Language notes</span></div>
      <div><b>${questions.length}</b><span>questions waiting for you</span></div>
    </div>
  </section>
  <section>
    <h2>Waiting for you</h2>
    ${questions.length ? `<details><summary>${questions.length} questions in OPEN-QUESTIONS.md, to answer by number whenever you read</summary><ul class="questions">${questions.map((q) => `<li><b>${esc(q.id)}</b><span>${esc(q.text.length > 300 ? `${q.text.slice(0, 300)}…` : q.text)}</span></li>`).join('')}</ul></details>` : '<p>Nothing.</p>'}
  </section>
</main>
`;
const out = path.join(ROOT, '.cache/progress');
mkdirSync(out, { recursive: true });
writeFileSync(path.join(out, `${slug}.html`), html);
console.log(`Wrote .cache/progress/${slug}.html: ${done} finished, ${wr} written, ${count('writing')} being written, ${count('todo')} not started; ${questions.length} questions`);
