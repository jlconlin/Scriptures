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
// Student Manuals (warnings only, every chapter; STANDARDS.md §1): a chapter where more than
//   about a third of the notes cite a Student Manual, and notes that cite one with nothing
//   from beyond the Church's own publications beside it.
//
// Pointers (STANDARDS.md §3): “see the note on [[Gen. 11:3]]” or “the note on verse 5” must land on a verse that has a note in
//   that chapter, when that chapter is written (resolved with the reference table the site uses, src/lib/refs.mjs; a book not
//   on the site is skipped). An error in a chapter that has a ledger, a warning otherwise.
// Other rules, warnings only, each under its own heading (STANDARDS.md §3, §1): a source announced in a note, `setting`, `thread`,
//   `christ`, or `explore` (“the manual says”, “one commentator notes”); more than a third of a chapter's notes citing a
//   commentary read on Bible Hub; a `setting` under 120 or over 280 words (the guideline is 150–250).
// With --repeats: passages of 12 or more words quoted in the ledgers of three or more chapters of a book, from sources
//   other than scripture, lexicons, and dictionary entries, so the coordinator can explain one once and link it.
//
// Usage: node scripts/check-content.mjs [book [chapter]] [--quiet] [--repeats] [--root <dir>]
// Exit code is 1 if there are errors, 0 otherwise (warnings never fail).
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { parseRef } from '../src/lib/refs.mjs';

// Works known to be unreadable online. Citing one in a strict chapter needs quoted evidence
// in the ledger, since nobody can check the claim against the page.
const NOT_READABLE = ['oswalt', 'blenkinsopp', 'childs', 'paul-40-66', 'westermann', 'halot', 'parry-understanding', 'williamson-book-called', 'tov-textual', 'matthews-plainer'];


// Wikis are not sources (anyone can edit them); nor are popular history sites (author, 2026-10-01).
const WIKI_HOSTS = ['livius.org', 'wikipedia.org', 'wikimedia.org', 'wikisource.org', 'wikiquote.org', 'wiktionary.org', 'wikidata.org', 'wikibooks.org', 'fandom.com', 'wikia.com', 'wikia.org'];

// The Church's Student Manuals are a starting point, not the spine of a chapter (author,
// 2026-10-03). A chapter should have at most about a third of its notes citing one, and a note
// that cites one should also rest on something from beyond the Church's own publications
// (judged by the host of the source's URL in sources.yaml).
const CHURCH_HOSTS = ['churchofjesuschrist.org', 'josephsmithpapers.org', 'speeches.byu.edu'];
const STUDENT_MANUAL_SHARE = 1 / 3;

// Notes that point to another note: “the note on [[Gen. 11:3]]”, “notes at [[Jer. 25:15]]”, “the note on verse 5” (this chapter).
const POINTER = /\bnotes?\s+(?:on|at|to|for)\s+(?:(?:verses?|vv?\.)\s*(\d+)(?:\s*[–-]\s*(\d+))?|\[\[([^\]]+)\]\])/gi;
// A source announced in the running text (STANDARDS.md §3: “Quote with the reference; don't announce the source”): a subject and a verb.
const ANNOUNCERS = [
  "the (?:Church[’']s )?(?:[A-Za-z]+ ){0,4}?manual", 'the Bible Dictionary', 'the Guide to the Scriptures', 'the lexicon', '(?:BDB|HALOT)',
  '(?:one|another|a|the) commentators?', '(?:the|this|that) (?:same )?commentary', 'Scripture Helps', '(?:a|one|another|the|this) KnoWhy',
];
const ANNOUNCE_VERBS = [
  'says?', 'said', 'notes?', 'observes?', 'argues?', 'lists?', 'explains?', 'points out', 'comments?', 'suggests?', 'calls?', 'describes?', 'states?', 'puts it',
  'offers?', 'reports?', 'adds?', 'remarks?', 'writes?', 'teaches', 'claims?', 'holds?', 'gives?', 'defines?', 'translates?', 'renders?', 'treats?', 'cites?',
  'mentions?', 'maintains?', 'proposes?', 'connects?', 'compares?', 'traces', 'links?',
];
const ANNOUNCED = new RegExp(`\\b(?:${ANNOUNCERS.join('|')})\\s+(?:also |then |here |likewise )?(?:${ANNOUNCE_VERBS.join('|')})\\b`, 'gi');
const OUTSIDE_COMMENTARY_SHARE = 1 / 3; // of a chapter's notes, citing a commentary read on Bible Hub
const SETTING_WORDS = [120, 280]; // the guideline is 150–250
// What --repeats leaves out: scripture, lexicons, and dictionary entries are meant to be quoted again.
const REFERENCE_KEY = /^(?:lds-scriptures|greek-nt|biblehub-interlinear|lxx-|nrsv|niv$|esv$|kjv|oshb|tahot|bdb|halot|strongs|webster|thayer|jst-|mt-sefaria|.*-heading$)/;
const REPEAT_WORDS = 12, REPEAT_CHAPTERS = 3;

const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
let ROOT = process.env.CHECK_ROOT || path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--root') ROOT = path.resolve(args[++i]);
  else if (!args[i].startsWith('--')) positional.push(args[i]);
}
const repeats = args.includes('--repeats');
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

const isStudentManual = (k) => /Student Manual/.test(sources[k]?.pub ?? '');
const isChurchSource = (k) => {
  try {
    const host = new URL(sources[k].url).hostname.toLowerCase();
    return CHURCH_HOSTS.some((c) => host === c || host.endsWith(`.${c}`));
  } catch { return false; } // no URL, or free text instead of a key: counts as from beyond the Church
};

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

// Which book on the site a reference is in (book.yaml `abbr`, the same codes src/lib/refs.mjs uses), and which verses have a note.
const siteBooks = new Map();
for (const d of await readdir(CONTENT, { withFileTypes: true }))
  if (d.isDirectory() && existsSync(path.join(CONTENT, d.name, 'book.yaml')) && existsSync(path.join(CONTENT, d.name, 'chapters'))) {
    const y = await readYaml(path.join(CONTENT, d.name, 'book.yaml'));
    if (y?.abbr) siteBooks.set(y.abbr, d.name);
  }
const noteVerses = new Map(); // "book/chapter" -> Set of verses with a note, or null when the chapter is not written
const versesWithNotes = async (book, chapter) => {
  const key = `${book}/${chapter}`;
  if (!noteVerses.has(key)) {
    const file = path.join(CONTENT, book, 'chapters', `${String(chapter).padStart(2, '0')}.yaml`);
    const set = existsSync(file) ? new Set() : null;
    if (set) for (const n of (await readYaml(file)).notes ?? []) {
      const m = String(n.ref ?? '').match(/(\d+)(?:\s*[–-]\s*(\d+))?\s*$/); // 5, 5–6, or the end of 'Gen. 22:5–6'
      if (m) for (let v = +m[1]; v <= +(m[2] ?? m[1]); v++) set.add(v);
    }
    noteVerses.set(key, set);
  }
  return noteVerses.get(key);
};

const nonStrict = []; // one line per chapter with issues
const leaning = []; // one line per chapter that leans on the Student Manuals
const dangling = []; // pointers to a note that isn't there, in chapters without a ledger
const announced = []; // sources announced in the text
const outside = []; // chapters leaning on commentaries read on Bible Hub
const settingLength = []; // setting outside the length it should have
const repeatedQuotes = []; // --repeats: passages quoted in the ledgers of several chapters
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

    // Student Manual reliance (warnings only). A note's `sources` list is its citation.
    const manualNotes = notes.filter((n) => (n.sources ?? []).some((s) => isStudentManual(keyOf(s))));
    const manualOnly = manualNotes.filter((n) => (n.sources ?? []).every((s) => isChurchSource(keyOf(s))));
    const leans = [];
    if (manualNotes.length > notes.length * STUDENT_MANUAL_SHARE) leans.push(`${manualNotes.length}/${notes.length} notes cite a Student Manual`);
    if (manualOnly.length) leans.push(`note${manualOnly.length > 1 ? 's' : ''} ${manualOnly.map((n) => n.ref ?? '?').join(', ')} ha${manualOnly.length > 1 ? 've' : 's'} nothing from beyond the Church's publications beside the manual`);
    if (leans.length) leaning.push(`${label}: ${leans.join('; ')}`);

    // Pointers to a note that isn't there (an error with a ledger), announced sources, outside commentary, and the length of `setting`.
    const hasLedger = existsSync(path.join(bdir, 'evidence', f));
    const prose = [['setting', ch.setting], ['thread', ch.thread], ['christ', ch.christ], ['explore', ch.explore], ...notes.map((n) => [`note ${n.ref ?? '?'}`, n.body])];
    for (const [where, t] of prose) {
      const text = String(t ?? '');
      for (const m of text.matchAll(POINTER)) {
        if (/(?:Church|edition|Gospel Library)(?:[’']s)?\s+$/i.test(text.slice(Math.max(0, m.index - 40), m.index))) continue; // the Church edition's own footnote, not a note on this site
        const targets = [];
        if (m[1]) targets.push({ book, chapter: num, verses: [+m[1], +(m[2] ?? m[1])], shown: `verse ${m[1]}` });
        else {
          let prev;
          for (const part of m[3].split('|')[0].split(';')) {
            const r = parseRef(part, prev);
            if (!r) continue;
            prev = r.book;
            if (r.verses && siteBooks.has(r.slug)) targets.push({ book: siteBooks.get(r.slug), chapter: r.chapter, verses: r.verses, shown: part.trim() });
          }
        }
        for (const to of targets) {
          const have = await versesWithNotes(to.book, to.chapter);
          if (!have) continue; // that chapter is not written yet
          let landed = false;
          for (let v = to.verses[0]; v <= to.verses[1]; v++) if (have.has(v)) landed = true;
          if (landed) continue;
          const msg = `${label} ${where}: “${m[0]}” but ${to.book} ${to.chapter}:${to.verses[0]}${to.verses[1] > to.verses[0] ? `–${to.verses[1]}` : ''} has no note`;
          if (hasLedger) err(msg); else dangling.push(msg);
        }
      }
      for (const phrase of new Set([...text.matchAll(ANNOUNCED)].map((m) => m[0]))) announced.push(`${label} ${where}: “${phrase}”`);
    }
    const bibleHubCommentary = (k) => { try { const u = new URL(sources[k]?.url); return /(^|\.)biblehub\.com$/.test(u.hostname) && u.pathname.startsWith('/commentaries/'); } catch { return false; } };
    const outsideNotes = notes.filter((n) => (n.sources ?? []).some((k) => bibleHubCommentary(keyOf(k))));
    if (outsideNotes.length > notes.length * OUTSIDE_COMMENTARY_SHARE) outside.push(`${label}: ${outsideNotes.length}/${notes.length} notes cite a commentary read on Bible Hub (notes ${outsideNotes.map((n) => n.ref ?? '?').join(', ')})`);
    if (ch.setting !== undefined) {
      const words = String(ch.setting).trim().split(/\s+/).filter(Boolean).length;
      if (words < SETTING_WORDS[0] || words > SETTING_WORDS[1]) settingLength.push(`${label}: setting is ${words} words (the guideline is 150–250)`);
    }

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

  // --repeats: a passage of REPEAT_WORDS words or more quoted in the ledgers of REPEAT_CHAPTERS chapters or more of this book.
  if (repeats) {
    const words = (q) => q.normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}\s]+/gu, ' ').split(/\s+/).filter(Boolean);
    const quotes = []; // { chapter, key, url, words }
    for (const f of await ls(path.join(bdir, 'evidence'), '.yaml')) {
      const ledger = await readYaml(path.join(bdir, 'evidence', f));
      for (const r of ledger?.claims ?? []) {
        const k = String(r.key ?? '');
        if (sources[k]?.type === 'entry' || REFERENCE_KEY.test(k)) continue;
        for (const part of String(r.quote ?? '').split(/…|\.\.\./)) quotes.push({ chapter: parseInt(f, 10), key: k, url: r.url, words: words(part) });
      }
    }
    const where = new Map(); // a run of REPEAT_WORDS words -> chapters that quote it
    for (const q of quotes)
      for (let i = 0; i + REPEAT_WORDS <= q.words.length; i++) {
        const g = q.words.slice(i, i + REPEAT_WORDS).join(' ');
        (where.get(g) ?? where.set(g, new Set()).get(g)).add(q.chapter);
      }
    const reported = new Set();
    for (const q of quotes)
      for (let i = 0; i + REPEAT_WORDS <= q.words.length; i++) {
        if ((where.get(q.words.slice(i, i + REPEAT_WORDS).join(' '))?.size ?? 0) < REPEAT_CHAPTERS) continue;
        let j = i; // extend the passage while the next run is shared too
        while (j + 1 + REPEAT_WORDS <= q.words.length && (where.get(q.words.slice(j + 1, j + 1 + REPEAT_WORDS).join(' '))?.size ?? 0) >= REPEAT_CHAPTERS) j++;
        const passage = q.words.slice(i, j + REPEAT_WORDS), start = passage.slice(0, REPEAT_WORDS).join(' ');
        i = j + REPEAT_WORDS - 1;
        if (reported.has(start)) continue;
        reported.add(start);
        const chapters = [...where.get(start)].sort((a, b) => a - b);
        repeatedQuotes.push(`${book} chapters ${chapters.join(', ')} [${q.key}]: “${passage.slice(0, 18).join(' ')}${passage.length > 18 ? '…' : ''}” (${passage.length} words) ${q.url}`);
      }
  }
}

warnings += nonStrict.length + leaning.length + dangling.length + announced.length + outside.length + settingLength.length + repeatedQuotes.length;
if (nonStrict.length && !quiet) {
  console.log(`\nChapters without an evidence ledger (warnings only):`);
  for (const l of nonStrict) console.warn(`  ⚠ ${l}`);
}
if (leaning.length && !quiet) {
  console.log(`\nChapters leaning on the Student Manuals (warnings only; STANDARDS.md §1):`);
  for (const l of leaning) console.warn(`  ⚠ ${l}`);
}

for (const [group, list] of [
  ['Pointers to a note that isn\'t there, in chapters without a ledger (warnings only; STANDARDS.md §3)', dangling],
  ['Sources announced in the text (warnings only; STANDARDS.md §3: quote with the reference, don\'t announce the source)', announced],
  ['Chapters leaning on commentaries read on Bible Hub (warnings only; STANDARDS.md §1)', outside],
  ['Chapters whose setting is outside the length it should have (warnings only; STANDARDS.md §3)', settingLength],
  ['Passages quoted in the ledgers of three or more chapters (--repeats; warnings only): explain one once and link it', repeatedQuotes],
])
  if (list.length && !quiet) {
    console.log(`\n${group}:`);
    for (const l of list) console.warn(`  ⚠ ${l}`);
  }

console.log(`\n${chapterCount} chapter(s) in ${books.length} book(s); ${strictCount} strict${strictPages ? `; ${strictPages} guide or theme page(s) with a ledger` : ''}. ${errors} error(s), ${warnings} warning(s)${quiet ? ' (hidden)' : ''}.`);
process.exit(errors ? 1 : 0);
