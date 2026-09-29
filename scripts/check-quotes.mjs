// Verify quotations: finds “quoted text” followed by a [[scripture reference]] in the
// content and checks that the words actually appear in that chapter of scripture.
// Chapters are fetched from the Gospel Library once and cached in .cache/.
// Usage: node scripts/check-quotes.mjs [chapter numbers...]
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { parseRef } from '../src/lib/refs.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CACHE = path.join(ROOT, '.cache/scripture');
await mkdir(CACHE, { recursive: true });
const kjv = JSON.parse(await readFile(path.join(ROOT, 'data/kjv/isaiah.json'), 'utf8')).chapters;

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[’‘']/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^a-z]+/g, ' ') // drops verse numbers too
    .replace(/\bvail/g, 'veil')
    .replace(/ll/g, 'l') // marvellous/marvelous, etc.
    .trim();

async function chapterText(r) {
  if (r.slug === 'isa') return norm(kjv[r.chapter - 1]?.join(' ') ?? '');
  const volPath = r.vol === 'dc-testament' ? `dc-testament/${r.slug}` : `${r.vol}/${r.slug}`;
  const file = path.join(CACHE, `${volPath.replace(/\//g, '_')}_${r.chapter}.txt`);
  if (existsSync(file)) return norm(await readFile(file, 'utf8'));
  const url = `https://www.churchofjesuschrist.org/study/scriptures/${volPath}/${r.chapter}?lang=eng`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (quote checker)' } });
  // Fail loudly rather than caching an empty chapter, which would make every quotation look wrong.
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}. Behind a proxy, run with NODE_USE_ENV_PROXY=1.`);
  const html = await res.text();
  const body = [...html.matchAll(/<p[^>]*\bid="(?:p\d+|title\d+|intro\d+|study_summary\d+)"[^>]*>(.*?)<\/p>/gs)]
    .map((m) => m[1].replace(/<sup[^>]*>.*?<\/sup>/gs, ''))
    .join(' ');
  const text = norm(body);
  if (!text) throw new Error(`${url}: no scripture text found on the page`);
  await writeFile(file, text);
  await new Promise((res) => setTimeout(res, 300));
  return text;
}

const only = process.argv.slice(2).map(Number);
const dir = path.join(ROOT, 'content/isaiah/chapters');
const files = (await readdir(dir)).filter((f) => f.endsWith('.yaml')).sort();
const guideDir = path.join(ROOT, 'content/isaiah/guides');
const sources = [];
for (const f of files) {
  const ch = YAML.parse(await readFile(path.join(dir, f), 'utf8'));
  if (only.length && !only.includes(ch.chapter)) continue;
  const texts = [ch.setting, ch.thread, ch.christ, ch.liken, ch.explore, ...(ch.notes ?? []).map((n) => n.body)];
  sources.push([`Isaiah ${ch.chapter}`, texts.filter(Boolean).join('\n')]);
}
if (!only.length)
  for (const dir of [guideDir, path.join(ROOT, 'content/isaiah/themes')].filter(existsSync))
    for (const f of (await readdir(dir)).filter((x) => x.endsWith('.md'))) sources.push([`${path.basename(dir)} ${f}`, await readFile(path.join(dir, f), 'utf8')]);

const allIsaiah = norm(kjv.flat().join(' '));
let checked = 0;
const problems = [];
for (const [label, text] of sources) {
  // A quotation followed (within the same parenthetical) by one or more references.
  for (const m of text.matchAll(/“([^”]{12,}?)”[^“”]{0,40}?\(\s*((?:\[\[[^\]]+\]\][;,\s]*(?:see\s*)?)+)\)/g)) {
    const quote = m[1];
    const refs = [...m[2].matchAll(/\[\[([^\]|]+)/g)].flatMap((x) => {
      let prev;
      return x[1].split(';').map((p) => {
        const r = parseRef(p.trim(), prev);
        if (r) prev = r.book;
        return r;
      });
    }).filter(Boolean);
    if (!refs.length) continue;
    const fragments = quote.split(/…|\.\.\./).map(norm).filter((f) => f.split(' ').length >= 3);
    if (!fragments.length) continue;
    const corpus = (await Promise.all(refs.map(chapterText))).join(' ');
    checked++;
    // Quoting Isaiah’s own words is fine even when the reference points elsewhere.
    const missing = fragments.filter((f) => !corpus.includes(f) && !allIsaiah.includes(f));
    if (missing.length) problems.push(`${label}: “${quote.slice(0, 90)}” not found in ${m[2].replace(/\[\[|\]\]/g, '').trim()}\n     missing: “${missing[0].slice(0, 80)}”`);
  }
}
console.log(`Checked ${checked} quotations.`);
problems.forEach((p) => console.log('  ✗ ' + p));
if (problems.length) process.exitCode = 1;
