// Check the sourcing of commentary content.
//
// Why: every claim in a note must come from a source that was actually consulted, and the
// evidence for that lives in a per-chapter ledger (content/<book>/evidence/NN.yaml).
// Chapters that have a ledger are "strict": their problems are errors. Chapters without
// one only produce warnings, so unaudited content never fails the check.
//
// Global (errors): every cited source key exists in content/sources.yaml; no source or
//   ledger URL is on a wiki domain; no duplicate keys in sources.yaml.
// Strict chapters (errors): every note has sources; every cited key has a ledger row;
//   ledger rows are complete (where, claim, key, url, quote); works that cannot be read
//   online need a quoted ledger row.
//
// Usage: node scripts/check-content.mjs [book [chapter]] [--quiet] [--root <dir>]
// Exit code is 1 if there are errors, 0 otherwise (warnings never fail).
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

// Works known to be unreadable online. Citing one in a strict chapter needs quoted evidence
// in the ledger, since nobody can check the claim against the page.
const NOT_READABLE = ['oswalt', 'blenkinsopp', 'childs', 'paul-40-66', 'westermann', 'halot', 'parry-understanding', 'williamson-book-called', 'tov-textual', 'matthews-plainer'];

// Wikis are not sources (anyone can edit them).
const WIKI_HOSTS = ['wikipedia.org', 'wikimedia.org', 'wikisource.org', 'wikiquote.org', 'wiktionary.org', 'wikidata.org', 'wikibooks.org', 'fandom.com', 'wikia.com', 'wikia.org'];

const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
let ROOT = process.env.CHECK_ROOT || path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--root') ROOT = path.resolve(args[++i]);
  else if (!args[i].startsWith('--')) positional.push(args[i]);
}
const [onlyBook, onlyChapter] = positional;
const CONTENT = path.join(ROOT, 'content');

let errors = 0;
let warnings = 0;
const err = (m) => { errors++; console.error(`  ✗ ${m}`); };
const warn = (m) => { warnings++; if (!quiet) console.warn(`  ⚠ ${m}`); };

const isWiki = (url) => {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return WIKI_HOSTS.some((w) => host === w || host.endsWith(`.${w}`));
  } catch { return false; }
};
const keyOf = (s) => String(s).split(/,\s*/)[0];
const isKey = (k) => /^[a-z0-9-]+$/.test(k); // same rule as build.mjs: other strings are free text
const readYaml = async (f) => YAML.parse(await readFile(f, 'utf8'));
const ls = async (d, ext) => (existsSync(d) ? (await readdir(d)).filter((f) => f.endsWith(ext)).sort() : []);

// ---------- sources.yaml ----------
const sourcesFile = path.join(CONTENT, 'sources.yaml');
const sources = await readYaml(sourcesFile);
console.log('Global checks');
const seen = new Map();
(await readFile(sourcesFile, 'utf8')).split('\n').forEach((line, i) => {
  const m = line.match(/^([A-Za-z0-9_.-]+):/);
  if (!m) return;
  if (seen.has(m[1])) err(`sources.yaml: duplicate key “${m[1]}” (lines ${seen.get(m[1])} and ${i + 1})`);
  else seen.set(m[1], i + 1);
});
for (const [k, s] of Object.entries(sources))
  if (s?.url && isWiki(s.url)) err(`sources.yaml: “${k}” has a wiki URL (${s.url}); wikis are not sources`);

const CITE = /\[@([a-z0-9-]+)(?:,\s*[^\]]+)?\]/g;
const checkKey = (where, k) => { if (isKey(k) && !sources[k]) err(`${where}: unknown source key “${k}”`); };

// ---------- books ----------
const books = [];
for (const d of await readdir(CONTENT, { withFileTypes: true }))
  if (d.isDirectory() && existsSync(path.join(CONTENT, d.name, 'chapters')) && (!onlyBook || d.name === onlyBook)) books.push(d.name);
books.sort();
if (onlyBook && !books.length) { console.error(`No book “${onlyBook}” with chapters/`); process.exit(1); }

const nonStrict = []; // one line per chapter with issues
let strictCount = 0, chapterCount = 0;

for (const book of books) {
  const bdir = path.join(CONTENT, book);

  // Guides and themes: keys must exist (global, only when checking the whole book).
  if (!onlyChapter)
    for (const sub of ['guides', 'themes'])
      for (const f of await ls(path.join(bdir, sub), '.md')) {
        const text = await readFile(path.join(bdir, sub, f), 'utf8');
        const fm = text.match(/^---\n([\s\S]*?)\n---/);
        const where = `${book}/${sub}/${f}`;
        if (fm) for (const s of YAML.parse(fm[1])?.sources ?? []) checkKey(where, keyOf(s));
        for (const m of text.matchAll(CITE)) checkKey(where, m[1]);
      }

  for (const f of await ls(path.join(bdir, 'chapters'), '.yaml')) {
    const num = parseInt(f, 10);
    if (onlyChapter && num !== parseInt(onlyChapter, 10)) continue;
    chapterCount++;
    const label = `${book} ${num}`;
    const ch = await readYaml(path.join(bdir, 'chapters', f));
    const notes = ch.notes ?? [];
    const noteLabel = (n) => `${label} note ${n.ref ?? '?'}${n.title ? ` “${n.title}”` : ''}`;

    // Global: every key cited anywhere in the chapter exists.
    const cited = new Set();
    for (const s of ch.sources ?? []) { const k = keyOf(s); if (isKey(k)) { cited.add(k); checkKey(label, k); } }
    for (const n of notes) for (const s of n.sources ?? []) { const k = keyOf(s); if (isKey(k)) { cited.add(k); checkKey(noteLabel(n), k); } }
    for (const t of [ch.setting, ch.thread, ch.christ, ch.explore, ...notes.map((n) => n.body)])
      for (const m of String(t ?? '').matchAll(CITE)) { cited.add(m[1]); checkKey(label, m[1]); }

    const ledgerFile = path.join(bdir, 'evidence', f);
    const unread = [...cited].filter((k) => NOT_READABLE.includes(k));

    if (!existsSync(ledgerFile)) {
      const unsourced = notes.filter((n) => !(n.sources ?? []).length).length;
      if (unsourced || unread.length)
        nonStrict.push(`${label}: ${unsourced ? `${unsourced}/${notes.length} notes without sources` : ''}${unsourced && unread.length ? '; ' : ''}${unread.length ? `not-readable cited: ${unread.join(', ')}` : ''}`);
      continue;
    }

    // ---------- strict chapter ----------
    strictCount++;
    const ledger = await readYaml(ledgerFile);
    const rows = ledger?.claims ?? [];
    const lf = `${book}/evidence/${f}`;
    if (ledger?.chapter !== num) err(`${lf}: chapter is ${ledger?.chapter}, expected ${num}`);
    const ledgerKeys = new Set();
    rows.forEach((r, i) => {
      const at = `${lf} row ${i + 1}${r?.where ? ` (${r.where})` : ''}`;
      for (const field of ['where', 'claim', 'key', 'url', 'quote'])
        if (!String(r?.[field] ?? '').trim()) err(`${at}: empty “${field}”`);
      if (r?.key) { ledgerKeys.add(String(r.key)); checkKey(at, String(r.key)); }
      if (r?.url) {
        if (!/^https?:\/\//.test(r.url)) err(`${at}: url must be http(s)`);
        else if (isWiki(r.url)) err(`${at}: wiki URL (${r.url}); wikis are not sources`);
      }
    });
    for (const n of notes) if (!(n.sources ?? []).length) err(`${noteLabel(n)}: no sources`);
    for (const k of [...cited].sort()) if (!ledgerKeys.has(k)) err(`${label}: cited “${k}” has no row in ${lf}`);
    for (const k of unread)
      if (!rows.some((r) => r?.key === k && String(r.quote ?? '').trim())) err(`${label}: “${k}” is not readable online; its ledger needs a row with a quote`);
  }
}

if (nonStrict.length) {
  warnings += nonStrict.length;
}
if (nonStrict.length && !quiet) {
  console.log(`\nChapters without an evidence ledger (warnings only):`);
  for (const l of nonStrict) console.warn(`  ⚠ ${l}`);
}

console.log(`\n${chapterCount} chapter(s) in ${books.length} book(s); ${strictCount} strict. ${errors} error(s), ${warnings} warning(s)${quiet ? ' (hidden)' : ''}.`);
process.exit(errors ? 1 : 0);
