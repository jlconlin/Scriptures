// Reads a chapter's (or a theme page's) evidence ledger the way a checker has to, with each quote in its context, so the
// checker reads one output and not 60–100 pages one `source.mjs --find` at a time (author, 2026-10-04: a step an agent
// repeats mechanically is a script). Rows are grouped by their `where`, in the chapter's order. Under each group: the text
// of that part of the chapter (a note's title, phrase and body; `setting`; a section of a theme page), then each row's claim,
// key, and URL, and the paragraph of the page that holds the quote with the paragraph before and after it, the quote's place
// marked ⟦like this⟧ (a quote with an elision, “…”, is marked in each part). The place is found with the comparison
// check-ledger uses (src/lib/pages.mjs), so a row it confirms is found here. A footnote of a Gospel Library page counts as a
// paragraph, shown with the verse it hangs on. A very long paragraph (a PDF page) is cut to a window around the quote,
// with … at a cut. A row whose quote is not on its page says “quote not found”; one whose page won't load, “page not fetched”.
// It does not judge whether a quote supports its claim: that is the checker's reading. Sources not yet in sources.yaml are read
// from .cache/batch/<book>/proposed/NN.yaml when the chapter has one.
// Usage: node scripts/ledger-context.mjs <book> <chapter>            a chapter's ledger, content/<book>/evidence/NN.yaml
//        node scripts/ledger-context.mjs <book> <page file name>      a theme or guide page's ledger (cup-of-fury)
//        --keys a,b          only rows with these keys (a trailing * is a prefix: sc-knowhy-*)
//        --skip-keys a,b     leave out rows with these keys (lds-scriptures,bdb,biblehub-interlinear)
//        --types a,b         only rows whose source has this `type` in sources.yaml: article, book, entry, hymn, manual, talk, web
//        --where "note 22:8" only the parts whose `where` contains this (several --where allowed; “setting”, “christ”, “section 2”)
//        --fresh             refetch pages, ignoring the cache
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { findBook } from '../src/lib/books.mjs';
import { fetchPage, parseOrEmpty, onPage, pageText, quoteParts, letters, alnum } from '../src/lib/pages.mjs';
import { SCRIPT_ROOT as ROOT, pad, readProposed, mergeProposed, partsOfWhere, pageSections, whereKey, headingKey, verseOf } from '../src/lib/ledger.mjs';

process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); }); // piped into head
const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); return i < 0 ? false : (argv.splice(i, 1), true); };
const values = (name) => { const out = []; for (let i; (i = argv.indexOf(name)) >= 0; ) { out.push(argv[i + 1] ?? ''); argv.splice(i, 2); } return out; };
const fresh = flag('--fresh');
const keysArg = values('--keys').join(',').split(',').filter(Boolean), skipArg = values('--skip-keys').join(',').split(',').filter(Boolean);
const typesArg = values('--types').join(',').split(',').filter(Boolean), whereArg = values('--where').map((w) => w.toLowerCase());
const [slug, what] = argv;
if (!slug || !what || argv.some((a) => a.startsWith('--'))) {
  console.error('Usage: node scripts/ledger-context.mjs <book> <chapter | theme page name> [--keys a,b] [--skip-keys a,b] [--types talk,article,manual,book] [--where "note 22:8"] [--fresh]');
  process.exit(1);
}
const book = await findBook(ROOT, slug);
const num = /^\d+$/.test(what) ? Number(what) : null;
const name = what.replace(/\.(?:yaml|md)$/, '');

// ---------- the ledger and the text it supports ----------
let ledgerFile, ch = null, pageSecs = null, label;
if (num) {
  ledgerFile = path.join(book.dir, 'evidence', `${pad(num)}.yaml`);
  ch = YAML.parse(await readFile(path.join(book.dir, 'chapters', `${pad(num)}.yaml`), 'utf8'));
  label = `${book.name} ${num}`;
} else {
  const sub = ['themes', 'guides'].find((s) => existsSync(path.join(book.dir, 'evidence', s, `${name}.yaml`)));
  if (!sub) { console.error(`No ledger for “${name}” in content/${slug}/evidence/themes/ or guides/.`); process.exit(1); }
  ledgerFile = path.join(book.dir, 'evidence', sub, `${name}.yaml`);
  const md = (await readFile(path.join(book.dir, sub, `${name}.md`), 'utf8')).replace(/^---\n[\s\S]*?\n---\n?/, '');
  pageSecs = pageSections(md);
  label = `${book.name} ${sub === 'themes' ? 'theme' : 'guide'} ${name}`;
}
if (!existsSync(ledgerFile)) { console.error(`No ledger at ${path.relative(ROOT, ledgerFile)}.`); process.exit(1); }
const rows = YAML.parse(await readFile(ledgerFile, 'utf8')).claims ?? [];
const { sources, proposed } = mergeProposed(YAML.parse(await readFile(path.join(ROOT, 'content/sources.yaml'), 'utf8')), num ? await readProposed(slug, num) : {});

// The parts of the page, in order: { id, label, text, rows }.
const parts = [];
const add = (id, head, text) => parts.push({ id, head, text: String(text ?? '').trim(), rows: [] });
if (ch) {
  for (const f of ['when', 'setting', 'thread']) if (ch[f] !== undefined) add(f, f, ch[f]);
  (ch.sections ?? []).forEach((s, i) => add(`section ${i + 1}`, `section ${i + 1} plain (verses ${s.range}: ${s.heading})`, s.plain));
  (ch.notes ?? []).forEach((n, i) => add(`note:${i}`, `note ${ch.chapter}:${verseOf(n.ref)} “${n.title}” [${n.kind}] on “${n.phrase}”`, `${n.body}\n(sources: ${(n.sources ?? []).join(', ')})`));
  for (const f of ['christ', 'explore']) if (ch[f] !== undefined) add(f, f, ch[f]);
  if (ch.parallels !== undefined) add('parallels', 'parallels', typeof ch.parallels === 'string' ? ch.parallels : YAML.stringify(ch.parallels));
} else for (const s of pageSecs) if (s.text.trim() || s.heading) add(s.heading ? headingKey(s.heading) : 'opening', s.heading ? `section “${s.heading}”` : 'opening', s.text);
const loose = { id: null, head: 'rows whose `where` names no part of the page', text: '', rows: [] };
for (const row of rows) {
  const ids = ch ? partsOfWhere(row.where, ch).ids : [whereKey(row.where)].filter(Boolean);
  const hit = parts.filter((p) => ids.includes(p.id));
  if (hit.length) hit.forEach((p) => p.rows.push(row)); else loose.rows.push(row);
}
if (loose.rows.length) parts.push(loose);

// ---------- which rows ----------
const keyMatch = (list, key) => list.some((k) => (k.endsWith('*') ? String(key).startsWith(k.slice(0, -1)) : k === key));
const wanted = (row) =>
  (!keysArg.length || keyMatch(keysArg, row.key)) && !keyMatch(skipArg, row.key) && (!typesArg.length || typesArg.includes(sources[row.key]?.type));
const partWanted = (p) => !whereArg.length || whereArg.some((w) => p.head.toLowerCase().includes(w) || p.rows.some((r) => String(r.where).toLowerCase().includes(w)));

// ---------- a page's paragraphs, found by the ledger check's own comparison ----------
const short = (s, n) => (s.length > n ? `${s.slice(0, n - 1).trim()}…` : s);
const pages = new Map(); // url -> { error } | { page, units, T, S, whole }
async function load(url) {
  if (pages.has(url)) return pages.get(url);
  const got = await fetchPage(url, { fresh, tries: 5, wait: 4000 });
  let out;
  if (got.error) out = { error: got.error };
  else {
    const page = parseOrEmpty(got.raw, url);
    // A raw XML file (the Hebrew text) keeps its tags in a paragraph; the words are what a reader and a quote have.
    const bare = (t) => (page.kind === 'text' && /<[a-z\/]/i.test(t) ? t.replace(/^[^<>]*>/, '').replace(/<[^>]*$/, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : t);
    const units = page.paras.map((p) => ({ label: p.label ?? `¶${p.n}`, head: p.head, text: bare(p.text) }));
    for (const n of page.notes) {
      const at = n.at?.[0], verse = at ? units.findIndex((u) => u.label === `¶${at}`) : -1;
      units.push({ label: `footnote ${n.marker}${n.context ? ` “${n.context}”` : ''}${at ? ` (at ¶${at})` : ''}`, head: '', text: n.text + n.links.map((l) => ` ${l.text}`).join(''), above: verse });
    }
    // The text of every unit run together, as the comparison reads it, with where each begins.
    const T = { text: '', num: '' }, S = { text: [], num: [] };
    for (const u of units) { S.text.push(T.text.length); S.num.push(T.num.length); T.text += letters(u.text); T.num += alnum(u.text); }
    out = { page, units, T, S, whole: pageText(got.raw) };
  }
  pages.set(url, out);
  return out;
}
// The unit that holds position `at` of the run-together text.
const unitAt = (starts, at) => { let lo = 0, hi = starts.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (starts[mid] <= at) lo = mid; else hi = mid - 1; } return lo; };
// Where a quote is: the first reading of it (see quoteParts) whose parts are all found, as ranges of units' original text.
function locate(p, quote) {
  for (const reading of quoteParts(quote)) {
    if (!reading.length) continue;
    const from = { text: 0, num: 0 }, found = [];
    for (const [kind, q] of reading) {
      let at = p.T[kind].indexOf(q, from[kind]);
      if (at < 0) at = p.T[kind].indexOf(q);
      if (at < 0) { found.length = 0; break; }
      from[kind] = at + q.length;
      found.push({ kind, at, end: at + q.length });
    }
    if (!found.length) continue;
    const ranges = new Map(); // unit index -> [[start, end]] in the unit's own text
    for (const { kind, at, end } of found) {
      const starts = p.S[kind];
      for (let i = unitAt(starts, at); i < starts.length && starts[i] < end; i++) {
        const text = p.units[i].text, fold = kind === 'text' ? letters : alnum;
        const lo = Math.max(at, starts[i]) - starts[i], hi = Math.min(end, i + 1 < starts.length ? starts[i + 1] : Infinity) - starts[i];
        // Positions in the unit's text of each letter the comparison kept.
        const pos = [];
        for (let k = 0; k < text.length; ) { const ch1 = String.fromCodePoint(text.codePointAt(k)); for (const _ of fold(ch1)) pos.push([k, k + ch1.length]); k += ch1.length; }
        if (hi > lo && pos[lo] && pos[hi - 1]) (ranges.get(i) ?? ranges.set(i, []).get(i)).push([pos[lo][0], pos[hi - 1][1]]);
      }
    }
    if (ranges.size) return ranges;
  }
  return null;
}
// A unit's text with the quote marked, cut to a window of about `cap` characters around it when it is longer.
function render(text, marks, cap = 900) {
  const lo = Math.min(...marks.map((m) => m[0])), hi = Math.max(...marks.map((m) => m[1]));
  let from = 0, to = text.length;
  if (text.length > cap) {
    const margin = Math.max(250, Math.floor((cap - (hi - lo)) / 2));
    from = Math.max(0, lo - margin); to = Math.min(text.length, hi + margin);
    if (from > 0) from = text.indexOf(' ', from) + 1 || from;
    if (to < text.length) to = text.lastIndexOf(' ', to) > hi ? text.lastIndexOf(' ', to) : to;
  }
  let out = '', at = from;
  for (const [a, b] of [...marks].sort((x, y) => x[0] - y[0])) { if (b <= at) continue; const s = Math.max(a, at); out += `${text.slice(at, s)}⟦${text.slice(s, b)}⟧`; at = b; }
  return `${from > 0 ? '… ' : ''}${out}${text.slice(at, to)}${to < text.length ? ' …' : ''}`.trim();
}
const tail = (t, n = 200) => (t.length > n ? `… ${t.slice(t.indexOf(' ', t.length - n) + 1 || t.length - n)}` : t);
const head = (t, n = 200) => (t.length > n ? `${t.slice(0, t.lastIndexOf(' ', n) > 0 ? t.lastIndexOf(' ', n) : n)} …` : t);

// ---------- print ----------
console.log(`${label}: the ledger's quotes in their pages. A quote's place is marked ⟦like this⟧; a paragraph is ¶ with the page's own number (a PDF's page, a footnote's marker); … is a cut.`);
if (proposed.size) console.log(`Sources from the proposed file (not yet in sources.yaml): ${[...proposed].join(', ')}`);
const filtered = keysArg.length || skipArg.length || typesArg.length || whereArg.length;
const tally = { shown: 0, notFound: 0, unfetched: 0, unlocated: 0, left: 0 };
const notFound = [], placed = new Map(), seen = new Set(); // places already printed, and paragraphs already printed
for (const part of parts) {
  if (!partWanted(part)) continue;
  const mine = part.rows.filter(wanted);
  tally.left += part.rows.length - mine.length;
  if (!mine.length && (filtered || part.rows.length)) continue;
  if (!part.rows.length && part.id === null) continue;
  console.log(`\n${'='.repeat(78)}\n${part.head}${part.rows.length ? ` (${part.rows.length} row${part.rows.length > 1 ? 's' : ''}${mine.length !== part.rows.length ? `, ${mine.length} shown` : ''})` : '  (NO LEDGER ROW)'}`);
  if (part.text) console.log(`${part.text}\n${'-'.repeat(40)}`);
  for (const row of mine) {
    tally.shown++;
    const type = sources[row.key]?.type;
    console.log(`\n▸ [${row.key}${type ? `, ${type}` : sources[row.key] ? '' : ', not in sources.yaml'}] ${String(row.claim).trim()}\n  ${row.url}`);
    const p = await load(row.url);
    if (p.error) { tally.unfetched++; console.log(`  page not fetched (${p.error})`); continue; }
    const where = locate(p, row.quote);
    if (!where) {
      if (onPage(p.whole, row.quote)) { tally.unlocated++; console.log(`  the quote is on the page but in its markup or data, not in a paragraph source.mjs prints (use source.mjs --find): “${short(String(row.quote).trim(), 200)}”`); }
      else { tally.notFound++; notFound.push(`${part.head}: ${row.key}`); console.log(`  quote not found on the page: “${short(String(row.quote).trim(), 200)}”`); }
      continue;
    }
    const hits = [...where.keys()].sort((a, b) => a - b);
    console.log(`  ${p.page.title ? `${short(p.page.title, 80)}; ` : ''}${hits.length > 3 ? `${p.units[hits[0]].label} to ${p.units[hits.at(-1)].label}` : hits.map((i) => p.units[i].label).join(', ')}${p.units[hits[0]].head ? ` § ${short(p.units[hits[0]].head, 70)}` : ''}`);
    // The same place as an earlier row is not shown again; a paragraph already shown for another quote is shown with this one's marks, without its neighbors.
    const id = `${row.url} ${hits.map((i) => `${i}:${where.get(i).map((m) => m.join('-')).join(',')}`).join(' ')}`;
    if (placed.has(id)) { console.log(`  (the same place as under ${placed.get(id)})`); continue; }
    placed.set(id, short(part.head, 60));
    const show = (i, text, tag) => { const k = `${row.url}#${i}`; if (!seen.has(k)) { seen.add(k); console.log(`  [${p.units[i].label}, ${tag}] ${text}`); } };
    for (const i of hits.slice(0, 6)) {
      const u = p.units[i], first = !seen.has(`${row.url}#${i}`);
      if (first && u.above >= 0 && !hits.includes(u.above)) show(u.above, head(p.units[u.above].text, 200), 'the verse');
      else if (first && i > 0 && !hits.includes(i - 1) && u.above === undefined) show(i - 1, tail(p.units[i - 1].text), 'before');
      seen.add(`${row.url}#${i}`);
      console.log(`  [${u.label}] ${render(u.text, where.get(i))}`);
      if (first && i + 1 < p.units.length && !hits.includes(i + 1) && u.above === undefined && p.units[i + 1].above === undefined) show(i + 1, head(p.units[i + 1].text), 'after');
    }
    if (hits.length > 6) console.log(`  … and ${hits.length - 6} more places`);
  }
}
const parts2 = [`${rows.length} rows in the ledger`, `${tally.shown} shown`];
if (tally.left) parts2.push(`${tally.left} left out by the options`);
parts2.push(`${tally.notFound} quote(s) not found`, `${tally.unfetched} page(s) not fetched`);
if (tally.unlocated) parts2.push(`${tally.unlocated} on the page but not in a paragraph`);
console.log(`\n${parts2.join('; ')}.${notFound.length ? ` Not found: ${notFound.join('; ')}.` : ''}`);
