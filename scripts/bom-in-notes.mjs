// Lists the notes of a book that spend many words on a Book of Mormon passage: commentary that may belong
// under that Book of Mormon verse instead (author, 2026-10-07; content/mosiah/BRIEF.md, “Bare chapters”).
// For each note it counts the words in sentences that carry a [[Book of Mormon reference]] (the sentences
// around them that go on about the same passage are not counted, so the number is a floor) and prints the notes
// where that is at least --min words (default 60), with the Book of Mormon chapters they name, most words first
// within each chapter. It measures, it does not judge: a note that only quotes a verse in passing is listed too.
// Usage: node scripts/bom-in-notes.mjs <book> [--min 60] [--by-target]
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const argv = process.argv.slice(2);
const book = argv.find((a) => !a.startsWith('--') && argv[argv.indexOf(a) - 1] !== '--min') ?? 'isaiah';
const min = +(argv[argv.indexOf('--min') + 1] ?? 60) || 60;
const BOM = '1 Ne\\.|2 Ne\\.|Jacob|Enos|Jarom|Omni|W of M|Words of Mormon|Mosiah|Alma|Hel\\.|Helaman|3 Ne\\.|4 Ne\\.|Morm\\.|Mormon|Ether|Moro\\.|Moroni';
const REF = new RegExp(`\\[\\[((?:${BOM}) \\d+)[^\\]]*\\]\\]`, 'g');
const words = (s) => s.split(/\s+/).filter(Boolean).length;
const dir = `content/${book}/chapters`;
const rows = [], targets = new Map();
for (const f of readdirSync(dir).filter((f) => f.endsWith('.yaml')).sort()) {
  const ch = YAML.parse(readFileSync(path.join(dir, f), 'utf8'));
  for (const n of ch.notes ?? []) {
    const body = String(n.body ?? '');
    // Sentences are split after the references are set aside, since “[[2 Ne. 8:24]]” has a full stop of its own.
    const refs = [];
    const flat = body.replace(/\n+/g, ' ').replace(/\[\[[^\]]*\]\]/g, (m) => `\u0001${refs.push(m) - 1}\u0002`);
    const sentences = flat.match(/[^.!?]+[.!?]*[”’)\]]*(?:\s*\(\u0001\d+\u0002[^)]*\))?/g) ?? [];
    let w = 0; const chapters = new Set();
    for (const raw of sentences) {
      const s = raw.replace(/\u0001(\d+)\u0002/g, (_, i) => refs[+i]);
      const m = [...s.matchAll(REF)];
      if (m.length) { w += words(s); m.forEach((x) => chapters.add(x[1])); }
    }
    if (w >= min) {
      rows.push({ ref: `${ch.chapter}:${n.ref}`, title: n.title, w, total: words(body), chapters: [...chapters] });
      for (const c of chapters) targets.set(c, [...(targets.get(c) ?? []), `${ch.chapter}:${n.ref}`]);
    }
  }
}
if (argv.includes('--by-target')) {
  const order = BOM.replace(/\\/g, '').split('|');
  const key = (c) => [order.findIndex((b) => c.startsWith(b + ' ')), +c.match(/\d+$/)[0]];
  for (const [c, refs] of [...targets].sort((a, b) => key(a[0])[0] - key(b[0])[0] || key(a[0])[1] - key(b[0])[1])) console.log(`${c.padEnd(12)} ${refs.length} note(s): ${refs.join(', ')}`);
} else {
  for (const r of rows) console.log(`${r.ref.padEnd(7)} ${String(r.w).padStart(4)} of ${String(r.total).padStart(4)} words  ${r.title}  →  ${r.chapters.join(', ')}`);
}
console.log(`\n${rows.length} note(s) of ${book} have ${min} or more words in sentences with a Book of Mormon reference, naming ${targets.size} Book of Mormon chapter(s).`);
