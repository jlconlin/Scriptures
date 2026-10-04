// Gathers the sources.yaml entries a batch of chapters proposed (.cache/batch/<book>/proposed/NN.yaml, written
// by the writers and kept accurate by the reviewers) and reports what a person has to settle before they go in:
// a key that exists with another URL, a key two chapters proposed for different pages, a page under two keys.
// Usage: node scripts/merge-sources.mjs <book> <chapter numbers...> [--write]
//   --write appends the new entries to content/sources.yaml under a comment naming the chapters.
import { readFileSync, appendFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { bookArg } from '../src/lib/books.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const argv = process.argv.slice(2);
const write = argv.includes('--write');
const { slug, rest } = bookArg(argv.filter((a) => !a.startsWith('--')));
const chapters = rest.map(Number);
const SOURCES = path.join(ROOT, 'content/sources.yaml');
const existing = YAML.parse(readFileSync(SOURCES, 'utf8'));
const pad = (n) => String(n).padStart(2, '0');

const add = new Map(); // key -> { n, entry }
let problems = 0;
const problem = (msg) => { problems++; console.log(msg); };
for (const n of chapters) {
  const file = path.join(ROOT, `.cache/batch/${slug}/proposed/${pad(n)}.yaml`);
  if (!existsSync(file)) { console.log(`${n}: no proposed file`); continue; }
  let proposed;
  try { proposed = YAML.parse(readFileSync(file, 'utf8')) ?? {}; } catch (err) { problem(`✗ ${n}: the proposed file does not parse: ${err.message.split('\n')[0]}`); continue; }
  for (const [key, entry] of Object.entries(proposed)) {
    if (!entry?.url) { problem(`✗ ${n}: ${key} has no url`); continue; }
    const have = existing[key] ?? add.get(key)?.entry;
    if (have) { if (have.url !== entry.url) problem(`✗ ${n}: ${key} is already used for another page\n    have ${have.url}\n    new  ${entry.url}`); continue; }
    add.set(key, { n, entry });
  }
}
const byUrl = new Map(Object.entries(existing).filter(([, e]) => e?.url).map(([k, e]) => [e.url, k]));
for (const [key, { n, entry }] of add) {
  if (byUrl.has(entry.url)) problem(`? ${n}: ${key} is the same page as ${byUrl.get(entry.url)}; use one key`);
  else byUrl.set(entry.url, key);
}
const lines = [...add].map(([key, { entry }]) => `${key}: ${JSON.stringify(entry)}`);
console.log(`${lines.length} new source(s) from ${chapters.length} chapter(s); ${problems} to settle by hand.`);
if (write && lines.length) {
  appendFileSync(SOURCES, `\n# ${slug} ${chapters[0]}–${chapters.at(-1)}\n${lines.join('\n')}\n`);
  console.log(`Appended to content/sources.yaml.`);
} else if (lines.length) console.log(lines.join('\n'));
