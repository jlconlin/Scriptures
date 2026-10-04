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
//   `christ`, or `explore`, or in a section of a guide or theme page (“the manual says”, “one commentator notes”); more than a third of a chapter's notes citing a
//   commentary read on Bible Hub; a `setting` under 120 or over 280 words (the guideline is 150–250).
// Guide and theme pages (STANDARDS.md §8), warnings only: a theme page over 1,000 words (a guide is not held to it); a `[@key]` cited in a
//   section whose ledger has no row for that key under that section (`where` “section “Heading”” or “opening”). Information, listed
//   and not counted as a warning: the page's own connections, the ledger rows whose claim begins “Connection made by this page:”.
// Per-note ledger coverage (STANDARDS.md §5), warnings only, each under its own heading, in a chapter with a ledger: a key in a note's
//   `sources` that no ledger row naming that note carries (not `lds-scriptures`: a note that only quotes scripture with a [[reference]] needs no row); a
//   ledger `where` that names no note or section of the chapter, with the closest note title when a note was retitled (note titles are
//   compared on letters, so straight and curly quotes agree); a note with no ledger row at all (reported once, not once per key, and not again when a retitled note's rows are found by their `where`); a
//   passage of 12 or more characters in curly quotes in a note's body that no ledger row for that note quotes, that is not followed in its
//   sentence by a [[reference]] (check-quotes.mjs checks those), and that is not a phrase of the chapter's own verses.
// Proposed sources (STANDARDS.md §5): the entries a writer left in .cache/batch/<book>/proposed/NN.yaml are added to sources.yaml in memory,
//   and the keys that came from there are printed; automatically when one chapter is checked and its file exists, `--proposed` also for a
//   whole book (every file), `--no-proposed` never. A proposed key that gives a URL another from sources.yaml's is an error; one the chapter
//   does not cite is a warning. (--root still works; the proposed files are read from this repository's .cache.)
// With --repeats: passages of 12 or more words quoted in the ledgers of three or more chapters of a book, from sources
//   other than scripture, lexicons, and dictionary entries, so the coordinator can explain one once and link it.
//
// Usage: node scripts/check-content.mjs [book [chapter | page file name]] [--quiet] [--repeats] [--proposed | --no-proposed] [--root <dir>]
//   (a second argument that is not a number is a guide or theme page, such as cup-of-fury: only that page is checked)
// Exit code is 1 if there are errors, 0 otherwise (warnings never fail).
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { parseRef } from '../src/lib/refs.mjs';
import { letters } from '../src/lib/pages.mjs';
import { SCRIPT_ROOT, readProposed, mergeProposed, proposedFile, isWiki, pageSections, headingKey, whereKey, partsOfWhere, closestNote, verseOf } from '../src/lib/ledger.mjs';

// Works known to be unreadable online. Citing one in a strict chapter needs quoted evidence
// in the ledger, since nobody can check the claim against the page.
const NOT_READABLE = ['oswalt', 'blenkinsopp', 'childs', 'paul-40-66', 'westermann', 'halot', 'parry-understanding', 'williamson-book-called', 'tov-textual', 'matthews-plainer'];


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
const PAGE_WORDS = 1000; // a theme page: “well under 1,000 words” (STANDARDS.md §8)
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
const [onlyBook, onlyChapter] = positional.map((p, i) => (i === 1 ? p.replace(/\.(?:md|yaml)$/, '') : p));
const onlyPage = onlyChapter && !/^\d+$/.test(onlyChapter) ? onlyChapter : null; // a second argument that is not a number is a guide or theme page's file name
const CONTENT = path.join(ROOT, 'content');

let errors = 0;
let warnings = 0;
const err = (m) => { errors++; console.error(`  ✗ ${m}`); };
const warn = (m) => { warnings++; if (!quiet) console.warn(`  ⚠ ${m}`); };

const keyOf = (s) => String(s).split(/,\s*/)[0];
const isKey = (k) => /^[a-z0-9-]+$/.test(k); // same rule as build.mjs: other strings are free text
const readYaml = async (f) => YAML.parse(await readFile(f, 'utf8'));
const ls = async (d, ext) => (existsSync(d) ? (await readdir(d)).filter((f) => f.endsWith(ext)).sort() : []);

// ---------- sources.yaml ----------
const sourcesFile = path.join(CONTENT, 'sources.yaml');
let sources = await readYaml(sourcesFile);
console.log('Global checks');
// The entries a writer proposed, added in memory: for the chapter checked (when its file exists), or every file with --proposed.
const proposedKeys = new Map(); // key -> 'book chapter'
if (!args.includes('--no-proposed') && onlyBook) {
  const dir = path.dirname(proposedFile(onlyBook, 1));
  const want = onlyChapter && !onlyPage ? [parseInt(onlyChapter, 10)] : args.includes('--proposed') && existsSync(dir) ? (await readdir(dir)).filter((f) => /^\d+\.yaml$/.test(f)).map((f) => parseInt(f, 10)) : [];
  for (const n of want.filter((n) => existsSync(proposedFile(onlyBook, n)))) {
    try {
      const merged = mergeProposed(sources, await readProposed(onlyBook, n));
      sources = merged.sources;
      for (const k of merged.proposed) proposedKeys.set(k, `${onlyBook} ${n}`);
      for (const k of merged.conflicts) err(`${path.relative(SCRIPT_ROOT, proposedFile(onlyBook, n))}: proposed key “${k}” is already in sources.yaml with another URL`);
    } catch (e) { err(e.message); }
  }
  if (proposedKeys.size) console.log(`  Proposed sources added in memory from ${[...new Set(proposedKeys.values())].map((l) => path.relative(SCRIPT_ROOT, proposedFile(...l.split(' ')))).join(', ')} (not yet in content/sources.yaml): ${[...proposedKeys.keys()].join(', ')}`);
}
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

// Words as a reader counts them: no citations, tags or link addresses, and none of a table's rules.
const wordCount = (md) => md.replace(/\[@[^\]]*\]/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\]\([^)]*\)/g, ' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

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
const pageLength = []; // theme pages over the length they should have
const uncitedSection = []; // a [@key] cited in a section of a guide or theme page that has no ledger row for that section
const ownConnections = []; // theme pages' own connections (ledger rows “Connection made by this page:”): information, not a warning
const outside = []; // chapters leaning on commentaries read on Bible Hub
const settingLength = []; // setting outside the length it should have
const repeatedQuotes = []; // --repeats: passages quoted in the ledgers of several chapters
const unusedProposed = []; // proposed sources the chapter does not cite
const keyNoRow = [], whereNoPart = [], noteNoRow = [], quoteNoRow = []; // per-note ledger coverage (chapters with a ledger)
let strictCount = 0, chapterCount = 0, strictPages = 0, pageCount = 0;

for (const book of books) {
  const bdir = path.join(CONTENT, book);

  // Guides and themes: keys must exist (global, only when checking the whole book or one page).
  if (!onlyChapter || onlyPage)
    for (const sub of ['guides', 'themes'])
      for (const f of await ls(path.join(bdir, sub), '.md')) {
        if (onlyPage && f.replace(/\.md$/, '') !== onlyPage) continue;
        const text = await readFile(path.join(bdir, sub, f), 'utf8');
        const fm = text.match(/^---\n([\s\S]*?)\n---/);
        const where = `${book}/${sub}/${f}`;
        const listed = fm ? YAML.parse(fm[1])?.sources ?? [] : [];
        for (const s of listed) checkKey(where, keyOf(s));
        const cites = [...text.matchAll(CITE)];
        for (const m of cites) checkKey(where, m[1]);
        if (listed.length && !cites.length) err(`${where}: lists sources but has no numbered citations ([@key] after the claims; STANDARDS.md §8)`);
        pageCount++;

        // The page's sections: the text before the first heading is the opening (the ledger's `where` for it).
        const sections = pageSections(text.replace(/^---\n[\s\S]*?\n---\n?/, ''));
        // A theme page is short; a source announced in the running text is the same fault as in a chapter.
        const words = sections.reduce((n, s) => n + wordCount(s.text), 0);
        if (sub === 'themes' && words > PAGE_WORDS) pageLength.push(`${where}: ${words} words (STANDARDS.md §8: well under ${PAGE_WORDS}, the table included)`);
        for (const s of sections)
          for (const phrase of new Set([...s.text.matchAll(ANNOUNCED)].map((m) => m[0]))) announced.push(`${where} ${s.heading ? `section “${s.heading}”` : 'opening'}: “${phrase}”`);

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

        // A key cited in a section needs a row for that key under that section (`where` is “section “Heading”” or “opening”).
        for (const s of sections) {
          const here = new Set(rows.filter((r) => whereKey(r?.where) === (s.heading ? headingKey(s.heading) : 'opening')).map((r) => String(r.key)));
          for (const k of new Set([...s.text.matchAll(CITE)].map((m) => m[1])))
            if (ledgerKeys.has(k) && !here.has(k)) uncitedSection.push(`${where} ${s.heading ? `section “${s.heading}”` : 'opening'}: cites [@${k}], but ${lf} has no row for ${k} under that section`);
        }
        // The page's own connections (STANDARDS.md §8), listed so a reviewer sees them at once.
        const own = rows.filter((r) => /^\s*Connection made by this page:/i.test(String(r?.claim ?? '')));
        if (own.length) ownConnections.push(`${where}: ${own.length} connection${own.length > 1 ? 's' : ''} of its own`, ...own.map((r) => `    ${r.where}: ${String(r.claim).replace(/^\s*Connection made by this page:\s*/i, '')}`));
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

    // ---------- per-note coverage of the ledger (warnings) ----------
    // Which rows name each note; a `where` that names nothing in the chapter.
    const byNote = notes.map(() => []), unnamed = new Map();
    for (const r of rows) {
      const { ids, missing } = partsOfWhere(r?.where, ch);
      for (const id of ids) if (id.startsWith('note:')) byNote[+id.slice(5)].push(r);
      for (const m of missing) (unnamed.get(m) ?? unnamed.set(m, []).get(m)).push(r);
    }
    // A `where` that names a note that is not there is a note retitled after its rows were written: reported once, with the closest title.
    // Its rows are counted for that note when it has none of its own, so the note is not reported again as having no row.
    const explained = new Set();
    for (const [w, mine] of unnamed) {
      const near = closestNote(ch, w), pair = near && (near.sameVerse || near.score >= 0.4) && !byNote[near.index].length && !explained.has(near.index) ? near : null;
      if (pair) { explained.add(pair.index); byNote[pair.index].push(...mine); }
      whereNoPart.push(`${lf}: “${w}” ${near ? 'no longer matches a note' : 'names no part of the chapter'} (${mine.length} row${mine.length > 1 ? 's' : ''})${near ? ';' : ''} ${near ? `the closest title in the chapter is “${near.note.title}” (note ${near.note.ref}${near.sameVerse ? '' : ', another verse'})${pair ? ', which has no row of its own' : ''}` : ''}`.trimEnd());
    }
    // The chapter's own verses, to leave out a quotation of them (check-quotes.mjs checks those that carry a reference).
    const kjvFile = [ROOT, SCRIPT_ROOT].map((r) => path.join(r, 'data/kjv', `${book}.json`)).find(existsSync);
    const ownVerses = kjvFile ? letters(((JSON.parse(await readFile(kjvFile, 'utf8')).chapters ?? [])[num - 1] ?? []).join(' ')) : '';
    notes.forEach((n, i) => {
      const mine = byNote[i];
      if (!mine.length) { noteNoRow.push(noteLabel(n)); return; }
      for (const k of new Set((n.sources ?? []).map(keyOf).filter(isKey)))
        if (k !== 'lds-scriptures' && !mine.some((r) => String(r.key) === k)) keyNoRow.push(`${noteLabel(n)}: “${k}” is in its sources, but no ledger row for ${k} names this note`);
      const body = String(n.body ?? ''), rowLetters = mine.map((r) => letters(r.quote)).join('|');
      for (const m of body.matchAll(/“([^”]{12,})”/g)) {
        const after = body.slice(m.index + m[0].length), cut = after.replace(/\[\[[^\]]*\]\]/g, (x) => 'R'.repeat(x.length)).search(/[.!?](?:\s|$)/);
        if (/\[\[/.test(cut < 0 ? after : after.slice(0, cut))) continue; // a scripture quotation: check-quotes.mjs
        const parts = m[1].split(/…|\.\.\./).map(letters).filter((p) => p.length >= 6);
        if (parts.every((p) => ownVerses.includes(p) || rowLetters.includes(p))) continue;
        quoteNoRow.push(`${noteLabel(n)}: “${m[1].length > 70 ? `${m[1].slice(0, 69)}…` : m[1]}” is in no ledger row for this note`);
      }
    });
    // A proposed source this chapter does not cite.
    for (const [k, l] of proposedKeys) if (l === `${book} ${num}` && !cited.has(k)) unusedProposed.push(`${label}: proposed source “${k}” is cited by nothing in the chapter; remove it from the proposed file`);

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

warnings += unusedProposed.length + keyNoRow.length + whereNoPart.length + noteNoRow.length + quoteNoRow.length + nonStrict.length + leaning.length + dangling.length + announced.length + outside.length + settingLength.length + pageLength.length + uncitedSection.length + repeatedQuotes.length;
if (nonStrict.length && !quiet) {
  console.log(`\nChapters without an evidence ledger (warnings only):`);
  for (const l of nonStrict) console.warn(`  ⚠ ${l}`);
}
if (leaning.length && !quiet) {
  console.log(`\nChapters leaning on the Student Manuals (warnings only; STANDARDS.md §1):`);
  for (const l of leaning) console.warn(`  ⚠ ${l}`);
}

for (const [group, list] of [
  ['Proposed sources the chapter does not cite (warnings only)', unusedProposed],
  [`Notes with no ledger row that names them (warnings only; STANDARDS.md §5): ${noteNoRow.length}`, noteNoRow],
  [`Keys in a note's sources with no ledger row that names the note (warnings only; STANDARDS.md §5; lds-scriptures is left out: a note that only quotes scripture with a [[reference]] needs no row): ${keyNoRow.length}`, keyNoRow],
  [`Ledger rows whose where no longer matches a note or section of the chapter, usually a note retitled (warnings only; STANDARDS.md §5): ${whereNoPart.length}`, whereNoPart],
  [`Passages in curly quotes in a note that no ledger row for the note quotes (warnings only; STANDARDS.md §5; a quotation followed by a [[reference]] is left to check-quotes): ${quoteNoRow.length}`, quoteNoRow],
  ['Pointers to a note that isn\'t there, in chapters without a ledger (warnings only; STANDARDS.md §3)', dangling],
  ['Sources announced in the text (warnings only; STANDARDS.md §3: quote with the reference, don\'t announce the source)', announced],
  ['Chapters leaning on commentaries read on Bible Hub (warnings only; STANDARDS.md §1)', outside],
  ['Chapters whose setting is outside the length it should have (warnings only; STANDARDS.md §3)', settingLength],
  ['Theme pages over the length they should have (warnings only; STANDARDS.md §8)', pageLength],
  ['Citations in a section of a guide or theme page with no ledger row for that key under that section (warnings only; STANDARDS.md §8)', uncitedSection],
  ['Passages quoted in the ledgers of three or more chapters (--repeats; warnings only): explain one once and link it', repeatedQuotes],
])
  if (list.length && !quiet) {
    console.log(`\n${group}:`);
    for (const l of list) console.warn(`  ⚠ ${l}`);
  }

// Information, not a warning: the connections a theme page makes itself, so a reviewer sees at once which they are.
if (ownConnections.length && !quiet) {
  console.log(`\nConnections the pages make themselves (information; STANDARDS.md §8, ledger rows that begin “Connection made by this page:”):`);
  for (const l of ownConnections) console.log(l.startsWith('    ') ? l : `  ${l}`);
}

console.log(`\n${chapterCount} chapter(s) in ${books.length} book(s); ${strictCount} strict${pageCount ? `; ${pageCount} guide or theme page(s), ${strictPages} with a ledger` : ''}${ownConnections.length ? `; ${ownConnections.filter((l) => !l.startsWith('    ')).length} page(s) with connections of their own listed` : ''}. ${errors} error(s), ${warnings} warning(s)${quiet ? ' (hidden)' : ''}.`);
process.exit(errors ? 1 : 0);
