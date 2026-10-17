// Makes a WebP copy of every illustration in src/assets whose PNG is newer than its WebP (or has none), at the PNG's
// full resolution and quality 90. The pages serve the WebP (layout.mjs, preferWebp); the PNG stays as the approved
// master (author, 2026-10-17). Needs `cwebp` (Homebrew: brew install webp).
// Usage: node scripts/webp.mjs [--force]
import { readdirSync, statSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dir = path.join(ROOT, 'src', 'assets');
const force = process.argv.includes('--force');

try { execFileSync('cwebp', ['-version'], { stdio: 'ignore' }); } catch {
  console.error('cwebp is not installed (brew install webp); the pages keep serving the PNGs until it is.');
  process.exit(1);
}

let made = 0, before = 0, after = 0;
for (const name of readdirSync(dir).filter((f) => f.endsWith('.png'))) {
  const png = path.join(dir, name), webp = png.replace(/\.png$/, '.webp');
  if (!force && existsSync(webp) && statSync(webp).mtimeMs >= statSync(png).mtimeMs) continue;
  execFileSync('cwebp', ['-quiet', '-q', '90', png, '-o', webp]);
  before += statSync(png).size; after += statSync(webp).size; made++;
  console.log(`${name} → ${path.basename(webp)}: ${(statSync(png).size / 1e6).toFixed(1)} MB → ${Math.round(statSync(webp).size / 1e3)} KB`);
}
console.log(made ? `${made} made: ${(before / 1e6).toFixed(1)} MB of PNG served as ${(after / 1e6).toFixed(1)} MB of WebP.` : 'Every illustration already has a current WebP.');
