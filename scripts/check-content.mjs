// Check the sourcing of commentary content.
//
// Why: every claim in a note must come from a source that was actually consulted, and the
// evidence for that lives in a per-chapter ledger (content/<book>/evidence/NN.yaml).
// Chapters that have a ledger are "strict": their problems are errors. Chapters without
// one only produce warnings, so unaudited content never fails the check.
//
// Global (errors): every cited source key exists in content/sources.yaml; no source or
//   ledger URL is on a wiki domain; no duplicate keys in sources.yaml; a guide or theme
//   page that lists sources cites them with numbered citations ([@key]).
// Guides and themes with a ledger (content/<book>/evidence/<guides|themes>/<file>.yaml) are
//   strict too: complete rows, and a row for every key the page cites.
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


// Wikis are not sources (anyone can edit them); nor are popular history sites (author, 2026-10-01).
const WIKI_HOSTS = ['livius.org', 'wikipedia.org', 'wikimedia.org', 'wikisource.org', 'wikiquote.org', 'wiktionary.org', 'wikidata.org', 'wikibooks.org', 'fandom.com', 'wikia.com', 'wikia.org'];

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
  if (s?.url && isWiki(s.url)) err(`sources.yaml: “${k}” has a wiki or popular-site URL (${s.url}); not a source`);

const CITE = /\[@([a-z0-9-]+)(?:,\s*[^\]]+)?\]/g;
const checkKey = (where, k) => { if (isKey(k) && !sources[k]) err(`${where}: unknown source key “${k}”`); };

// Check a ledger's rows; returns the set of source keys that have a row.
const checkRows = (rows, lf) => {
  const ledgerKeys = new Set();
  rows.forEach((r, i) => {
    const at = `${lf} row ${i + 1}${r?.where ? ` (${r.where})` : ''}`;
    for (const field of ['where', 'claim', 'key', 'url', 'quote'])
      if (!String(r?.[field] ?? '').trim()) err(`${at}: empty “${field}”`);
    if (r?.key) { ledgerKeys.add(String(r.key)); checkKey(at, String(r.key)); }
    if (r?.url) {
      if (!/^https?:\/\//.test(r.url)) err(`${at}: url must be http(s)`);
      else if (isWiki(r.url)) err(`${at}: wiki or popular-site URL (${r.url}); not a source`);
    }
  });
  return ledgerKeys;
};
const needsQuote = (label, k, rows) => {
  if (!rows.some((r) => r?.key === k && String(r.quote ?? '').trim())) err(`${label}: “${k}” is not readable online; its ledger needs a row with a quote`);
};

// ---------- books ----------
const books = [];
for (const d of await readdir(CONTENT, { withFileTypes: true }))
  if (d.isDirectory() && existsSync(path.join(CONTENT, d.name, 'chapters')) && (!onlyBook || d.name === onlyBook)) books.push(d.name);
books.sort();
if (onlyBook && !books.length) { console.error(`No book “${onlyBook}” with chapters/`); process.exit(1); }

const nonStrict = []; // one line per chapter with issues
let strictCount = 0, chapterCount = 0, strictPages = 0;

for (const book of books) {
  const bdir = path.join(CONTENT, book);

  // Guides and themes: keys must exist (global, only when checking the whole book).
  if (!onlyChapter)
    for (const sub of ['guides', 'themes'])
      for (const f of await ls(path.join(bdir, sub), '.md')) {
        const text = await readFile(path.join(bdir, sub, f), 'utf8');
        const fm = text.match(/^---\n([\s\S]*?)\n---/);
        const where = `${book}/${sub}/${f}`;
        const listed = fm ? YAML.parse(fm[1])?.sources ?? [] : [];
        for (const s of listed) checkKey(where, keyOf(s));
        const cites = [...text.matchAll(CITE)];
        for (const m of cites) checkKey(where, m[1]);
        if (listed.length && !cites.length) err(`${where}: lists sources but has no numbered citations ([@key] after the claims; STANDARDS.md §8)`);

        // A page with a ledger is strict, like a chapter with one.
        const lf = `${book}/evidence/${sub}/${f.replace(/\.md$/, '.yaml')}`;
        if (!existsSync(path.join(CONTENT, lf))) continue;
        strictPages++;
        const ledger = await readYaml(path.join(CONTENT, lf));
        const rows = ledger?.claims ?? [];
        if (ledger?.page !== f.replace(/\.md$/, '')) err(`${lf}: page is ${ledger?.page}, expected ${f.replace(/\.md$/, '')}`);
        const ledgerKeys = checkRows(rows, lf);
        const cited = new Set(cites.map((m) => m[1]));
        for (const k of [...cited].sort()) if (!ledgerKeys.has(k)) err(`${where}: cited “${k}” has no row in ${lf}`);
        for (const k of cited) if (NOT_READABLE.includes(k)) needsQuote(where, k, rows);
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

    // Chapters with a ledger: the form the chapter page needs. Chapter pages don't render [@key]
    // (a note's citation is its `sources` list), and a note's first sentence is its preview card.
    if (existsSync(path.join(bdir, 'evidence', f))) {
      for (const [name, t] of [['setting', ch.setting], ['thread', ch.thread], ['christ', ch.christ], ['explore', ch.explore]])
        if (/\[@/.test(String(t ?? ''))) err(`${label} ${name}: has a [@key] citation, which chapter pages don't render; remove it (the ledger and the chapter's sources carry the citation)`);
      for (const [name, t] of [['setting', ch.setting], ['thread', ch.thread], ['christ', ch.christ], ['explore', ch.explore]])
        if (t !== undefined && typeof t !== 'string') err(`${label} ${name}: must be Markdown text, not a YAML list or map (a list renders as one run-on paragraph)`);
      for (const n of notes) {
        if (/\[@/.test(String(n.body ?? ''))) err(`${noteLabel(n)}: has a [@key] citation, which chapter pages don't render; list the key in the note's sources instead`);
        if (/"/.test(String(n.body ?? ''))) err(`${noteLabel(n)}: has a straight double quote; use “ ” (check-quotes.mjs only checks quotations in curly quotes)`);
        if (/^\s*This (note|verse note|entry)\b/i.test(String(n.body ?? ''))) err(`${noteLabel(n)}: opens with “This note…”; open with the point itself`);
      }
    }

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
    const ledgerKeys = checkRows(rows, lf);
    for (const n of notes) if (!(n.sources ?? []).length) err(`${noteLabel(n)}: no sources`);
    for (const k of [...cited].sort()) if (!ledgerKeys.has(k)) err(`${label}: cited “${k}” has no row in ${lf}`);
    for (const k of unread) needsQuote(label, k, rows);

  }
}

if (nonStrict.length) {
  warnings += nonStrict.length;
}
if (nonStrict.length && !quiet) {
  console.log(`\nChapters without an evidence ledger (warnings only):`);
  for (const l of nonStrict) console.warn(`  ⚠ ${l}`);
}

console.log(`\n${chapterCount} chapter(s) in ${books.length} book(s); ${strictCount} strict${strictPages ? `; ${strictPages} guide or theme page(s) with a ledger` : ''}. ${errors} error(s), ${warnings} warning(s)${quiet ? ' (hidden)' : ''}.`);
process.exit(errors ? 1 : 0);
