// A review-gated authoring tool for the wide illustration on a book's landing page.
// It never changes published assets until `approve` is run explicitly.
import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import YAML from 'yaml';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CONTENT = path.join(ROOT, 'content');
const STYLE_FILE = path.join(CONTENT, 'visual-style.yaml');

const usage = `Usage:
  node scripts/book-art.mjs brief <book> --summary "…" --motif "…" [--motif "…"] [--composition "…"]
  node scripts/book-art.mjs prompt <book>
  node scripts/book-art.mjs generate <book> [--out output/book-art/<book>-candidate.png] [--force]
  node scripts/book-art.mjs approve <book> --from <candidate.png> --alt "…"

Commands:
  brief     Save the book's visual summary and motifs in content/<book>/visual.yaml.
  prompt    Print the exact house-style prompt for review or use in Codex ImageGen.
  generate  Create a review candidate with the bundled ImageGen CLI. Requires IMAGE_GEN and OPENAI_API_KEY.
  approve   Copy a reviewed candidate to src/assets/ and mark it approved for the book page.
`;

function fail(message) {
  console.error(`book-art: ${message}`);
  process.exit(1);
}

function parseArgs(args) {
  const positional = [];
  const flags = new Map();
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg.startsWith('--')) {
      positional.push(arg);
      continue;
    }
    const key = arg.slice(2);
    if (key === 'force') {
      flags.set(key, true);
      continue;
    }
    const value = args[i + 1];
    if (!value || value.startsWith('--')) fail(`--${key} needs a value`);
    const values = flags.get(key) ?? [];
    flags.set(key, [...values, value]);
    i += 1;
  }
  return { positional, flags };
}

const one = (flags, name) => flags.get(name)?.at(-1);
const many = (flags, name) => flags.get(name) ?? [];

async function readYaml(file) {
  return YAML.parse(await readFile(file, 'utf8'));
}

async function writeYaml(file, value) {
  await writeFile(file, YAML.stringify(value));
}

async function bookPaths(slug) {
  if (!/^[a-z0-9-]+$/.test(slug)) fail('book slug may contain lowercase letters, numbers, and hyphens only');
  const dir = path.join(CONTENT, slug);
  const bookFile = path.join(dir, 'book.yaml');
  const visualFile = path.join(dir, 'visual.yaml');
  if (!existsSync(bookFile)) fail(`no book at content/${slug}/book.yaml`);
  const book = await readYaml(bookFile);
  if (book.slug !== slug) fail(`content/${slug}/book.yaml names a different slug`);
  return { slug, dir, visualFile, book };
}

async function getBrief(paths) {
  if (!existsSync(paths.visualFile)) fail(`no visual brief for ${paths.slug}; run the brief command first`);
  const brief = await readYaml(paths.visualFile);
  if (!brief.summary || !Array.isArray(brief.motifs) || !brief.motifs.length) {
    fail(`content/${paths.slug}/visual.yaml needs a summary and at least one motif`);
  }
  return brief;
}

function buildPrompt(style, book, brief) {
  const p = style.prompt;
  const motifs = brief.motifs.map((motif) => `- ${motif}`).join('\n');
  const composition = brief.composition ?? p.composition;
  const constraints = p.constraints.map((constraint) => `- ${constraint}`).join('\n');
  return `Use case: ${p.useCase}
Asset type: ${p.assetType}
Book: ${book.name}
Book summary: ${brief.summary}
Required motifs:
${motifs}
Style/medium: ${p.style}
Composition/framing: ${composition}
Color palette: ${p.palette}
Constraints:
${constraints}`;
}

async function run() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const [command, slug] = positional;
  if (!command || command === '--help' || command === 'help') {
    console.log(usage);
    return;
  }
  if (!slug) fail(`a book slug is required\n\n${usage}`);
  const paths = await bookPaths(slug);

  if (command === 'brief') {
    const summary = one(flags, 'summary');
    const motifs = many(flags, 'motif');
    const composition = one(flags, 'composition');
    if (!summary || !motifs.length) fail('brief needs --summary and at least one --motif');
    const previous = existsSync(paths.visualFile) ? await readYaml(paths.visualFile) : {};
    await writeYaml(paths.visualFile, {
      ...previous,
      summary,
      motifs,
      ...(composition ? { composition } : {}),
      status: previous.status === 'approved' ? 'approved' : 'briefed',
    });
    console.log(`Saved content/${slug}/visual.yaml. Review the prompt with: node scripts/book-art.mjs prompt ${slug}`);
    return;
  }

  const style = await readYaml(STYLE_FILE);
  const brief = await getBrief(paths);
  const prompt = buildPrompt(style, paths.book, brief);

  if (command === 'prompt') {
    console.log(prompt);
    return;
  }

  if (command === 'generate') {
    const imageCli = process.env.IMAGE_GEN;
    if (!imageCli) fail('set IMAGE_GEN to the bundled image_gen.py path before generating; prompt remains available without it');
    if (!process.env.OPENAI_API_KEY) fail('OPENAI_API_KEY is not set; prompt remains available without it');
    await access(imageCli).catch(() => fail(`IMAGE_GEN does not exist: ${imageCli}`));
    const out = path.resolve(ROOT, one(flags, 'out') ?? `output/book-art/${slug}-candidate.png`);
    await mkdir(path.dirname(out), { recursive: true });
    const args = [imageCli, 'generate', '--prompt', prompt, '--size', style.asset.size, '--quality', style.asset.quality, '--out', out];
    if (flags.get('force')) args.push('--force');
    const result = spawnSync('python3', args, { stdio: 'inherit' });
    if (result.error) fail(result.error.message);
    if (result.status !== 0) process.exit(result.status ?? 1);
    console.log(`Candidate written to ${path.relative(ROOT, out)}. Review it before approving.`);
    return;
  }

  if (command === 'approve') {
    const from = one(flags, 'from');
    const alt = one(flags, 'alt');
    if (!from || !alt) fail('approve needs --from <candidate.png> and --alt "…"');
    const source = path.resolve(ROOT, from);
    await access(source).catch(() => fail(`candidate does not exist: ${from}`));
    const destination = path.join(ROOT, 'src', 'assets', `${slug}-book-art.png`);
    if (existsSync(destination)) fail(`asset already exists: src/assets/${slug}-book-art.png; rename it first rather than overwriting it`);
    await copyFile(source, destination);
    await writeYaml(paths.visualFile, {
      ...brief,
      asset: `/assets/${slug}-book-art.png`,
      alt,
      status: 'approved',
    });
    console.log(`Approved src/assets/${slug}-book-art.png for ${paths.book.name}.`);
    return;
  }

  fail(`unknown command “${command}”\n\n${usage}`);
}

run().catch((error) => fail(error.message));
