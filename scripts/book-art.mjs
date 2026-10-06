// The wide illustration on a book's landing page (DEVELOPMENT.md, “Book illustration workflow”).
// The prompt is built here from content/visual-style.yaml and content/<book>/visual.yaml, so no
// model rewrites the house style; Codex only draws. Nothing is published until `approve` is run.
// Usage:
//   node scripts/book-art.mjs prompt <book>      print the prompt Codex is given
//   node scripts/book-art.mjs generate <book> [--model <codex model>]
//                                                one candidate, drawn by Codex (the codex CLI, signed
//                                                in), saved as .cache/book-art/<book>/candidate-N.png;
//                                                --model picks the Codex model that calls the image tool,
//                                                for when the configured one is at capacity
//   node scripts/book-art.mjs approve <book> [--from <candidate.png>] [--force]
//                                                after the author approves: copies the candidate (the
//                                                newest one by default) to src/assets/<book>-book-art.png
//                                                and sets asset and status: approved in visual.yaml
import { copyFile, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import YAML from 'yaml';
import { findBook } from '../src/lib/books.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const rel = (f) => path.relative(ROOT, f);
const fail = (m) => { console.error(`book-art: ${m}`); process.exit(1); };

const argv = process.argv.slice(2);
const opt = (name) => argv.includes(name) ? argv[argv.indexOf(name) + 1] : null;
const from = opt('--from'), model = opt('--model');
const [command, slug] = argv.filter((a) => !a.startsWith('--') && a !== from && a !== model);
if (!['prompt', 'generate', 'approve'].includes(command) || !slug) fail('usage: node scripts/book-art.mjs prompt|generate|approve <book> [--model <codex model>] [--from <candidate.png>] [--force]');

const book = await findBook(ROOT, slug).catch((e) => fail(e.message));
const visualFile = path.join(book.dir, 'visual.yaml');
const brief = book.visual;
if (!brief?.summary || !brief.motifs?.length) fail(`${rel(visualFile)} needs a summary and motifs: run the create-book-art workflow first`);
const style = YAML.parse(await readFile(path.join(ROOT, 'content/visual-style.yaml'), 'utf8'));
const outDir = path.join(ROOT, '.cache/book-art', slug);
const candidates = async () => (existsSync(outDir) ? await readdir(outDir) : [])
  .filter((f) => /^candidate-\d+\.png$/.test(f)).sort((a, b) => parseInt(a.slice(10), 10) - parseInt(b.slice(10), 10));

// A motif written “- Primary: the dawn…” is read by YAML as a map, and went into a prompt as “[object Object]”.
const list = (items) => items.map((i) => (typeof i === 'string' ? `- ${i}` : fail(`${rel(visualFile)}: a list item is not plain text (quote it if it has a colon): ${JSON.stringify(i)}`))).join('\n');
const p = style.prompt;
const prompt = `Use case: ${p.useCase}
Asset type: ${p.assetType}
Aspect ratio: ${style.asset.aspectRatio}, ${style.asset.quality} quality
Book: ${book.name}
Book summary: ${brief.summary.trim()}
Required motifs:
${list(brief.motifs)}
Style/medium: ${p.style.trim()}
Composition/framing: ${(brief.composition ?? p.composition).trim()} ${brief.composition ? p.composition.trim() : ''}
Color palette: ${p.palette.trim()}
Constraints:
${list(p.constraints)}`;

if (command === 'prompt') {
  console.log(prompt);
} else if (command === 'generate') {
  // Codex's built-in image tool saves under $CODEX_HOME/generated_images and takes no destination,
  // so the new file is found there by its time and copied; Codex itself writes nothing in the repository.
  const home = path.join(process.env.CODEX_HOME ?? path.join(os.homedir(), '.codex'), 'generated_images');
  const pngs = async (dir) => !existsSync(dir) ? [] : (await Promise.all((await readdir(dir, { withFileTypes: true })).map(async (e) => {
    const f = path.join(dir, e.name);
    return e.isDirectory() ? pngs(f) : /\.png$/i.test(e.name) ? [{ f, t: (await stat(f)).mtimeMs }] : [];
  }))).flat();
  const before = new Set((await pngs(home)).map((x) => x.f));
  await mkdir(outDir, { recursive: true });
  const ask = `Generate exactly one image with your built-in image generation tool, from the brief below, used as it stands. Do not read or change any file, do not run commands, and do not use the image CLI or an API key. It is a candidate for the author's review. When the image exists, reply with one line saying so.\n\n${prompt}`;
  const run = spawnSync('codex', ['exec', ...(model ? ['-m', model] : []), '--skip-git-repo-check', '--sandbox', 'read-only', '--ephemeral', '-C', outDir, '-'], { input: ask, stdio: ['pipe', 'inherit', 'inherit'], timeout: 15 * 60 * 1000 });
  if (run.error) fail(run.error.code === 'ENOENT' ? 'the codex CLI is not installed or not on PATH' : run.error.message);
  if (run.status !== 0) fail(`codex exec ended with status ${run.status}; if its model is at capacity, wait and run again, or pass --model <another>`);
  const made = (await pngs(home)).filter((x) => !before.has(x.f)).sort((a, b) => b.t - a.t);
  if (!made.length) fail(`Codex finished without a new image in ${home} (is it signed in? codex login status)`);
  const n = (await candidates()).reduce((m, f) => Math.max(m, parseInt(f.slice(10), 10)), 0) + 1;
  const out = path.join(outDir, `candidate-${n}.png`);
  await copyFile(made[0].f, out);
  console.log(`Candidate: ${rel(out)}${made.length > 1 ? ` (Codex made ${made.length} images; this is the last)` : ''}. Show it to the author; nothing is published until: node scripts/book-art.mjs approve ${slug}`);
} else {
  const source = from ? path.resolve(from) : (await candidates()).map((f) => path.join(outDir, f)).at(-1);
  if (!source || !existsSync(source)) fail(from ? `no file ${from}` : `no candidate in ${rel(outDir)}: run generate first`);
  if (!brief.alt) fail(`${rel(visualFile)} needs alt text that describes the approved image`);
  const asset = `/assets/${slug}-book-art.png`;
  const dest = path.join(ROOT, 'src', asset);
  if (existsSync(dest) && !argv.includes('--force')) fail(`${rel(dest)} exists: pass --force to replace it`);
  await copyFile(source, dest);
  // Edited as text so the brief's wording and layout stay as the director wrote them.
  let text = (await readFile(visualFile, 'utf8')).replace(/^(asset|status):.*\n/gm, '').trimEnd();
  text = /^alt:/m.test(text) ? text.replace(/^alt:/m, `asset: ${asset}\nalt:`) : `${text}\nasset: ${asset}`;
  await writeFile(visualFile, `${text}\nstatus: approved\n`);
  console.log(`Approved ${rel(source)} as ${rel(dest)}. Check that alt, motifs and composition in ${rel(visualFile)} describe this image, then build.`);
}
