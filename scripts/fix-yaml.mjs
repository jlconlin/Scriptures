// Authoring helper: quote single-line YAML values that contain ": " (which YAML would
// otherwise read as a nested mapping). Scripture phrases often contain colons.
// Usage: node scripts/fix-yaml.mjs [files...]   (defaults to all chapter files)
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const dir = new URL('../content/isaiah/chapters/', import.meta.url).pathname;
const files = process.argv.length > 2 ? process.argv.slice(2) : (await readdir(dir)).filter((f) => f.endsWith('.yaml')).map((f) => path.join(dir, f));

const KEYS = /^(\s*(?:- )?(?:phrase|title|heading|tagline|when|ref|note|range)): (.*)$/;
let changed = 0;
for (const file of files) {
  const lines = (await readFile(file, 'utf8')).split('\n');
  let touched = false;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(KEYS);
    if (!m) continue;
    const value = m[2];
    if (/^['"|>]/.test(value) || !/: |#\s/.test(value)) continue;
    lines[i] = `${m[1]}: '${value.replace(/'/g, "''")}'`;
    touched = true;
    changed++;
  }
  if (touched) await writeFile(file, lines.join('\n'));
}
if (changed) console.log(`fix-yaml: quoted ${changed} value(s)`);
