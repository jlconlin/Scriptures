// What the checking scripts share about a chapter's evidence ledger and its sources (scripts/ledger-context.mjs,
// scripts/check-content.mjs, scripts/check-sources.mjs, scripts/footnotes.mjs, scripts/check-chapter.mjs):
// the proposed sources.yaml entries a writer leaves in .cache/batch/<book>/proposed/NN.yaml, the wiki hosts, the
// sections of a theme page, and the reading of a row's `where` (“note 22:8 “God will see to the lamb””, “setting”,
// “section 3 plain”, “opening”, “section “The cup handed round””) so a row can be tied to the part of the page it supports.
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

/** The repository the scripts live in; `.cache/` is here even when a script is run with another content root. */
export const SCRIPT_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
export const pad = (n) => String(n).padStart(2, '0');

// ---------- proposed sources ----------

export const proposedFile = (book, chapter) => path.join(SCRIPT_ROOT, '.cache/batch', book, 'proposed', `${pad(chapter)}.yaml`);

/** The entries a writer proposed for a chapter (`{}` when there is no file); throws a plain message if the file doesn't parse. */
export async function readProposed(book, chapter) {
  const file = proposedFile(book, chapter);
  if (!existsSync(file)) return {};
  try { return YAML.parse(await readFile(file, 'utf8')) ?? {}; } catch (err) { throw new Error(`${path.relative(SCRIPT_ROOT, file)} does not parse: ${err.message.split('\n')[0]}`); }
}

/**
 * sources.yaml with a chapter's proposed entries added in memory. A key already in sources.yaml stays as it is
 * (`conflicts` lists the proposed ones that give it another URL). `proposed` is the set of keys that came from the proposed file.
 */
export function mergeProposed(sources, entries) {
  const merged = { ...sources }, proposed = new Set(), conflicts = [];
  for (const [key, entry] of Object.entries(entries)) {
    if (!(key in sources)) { merged[key] = entry; proposed.add(key); }
    else if (entry?.url && sources[key]?.url && entry.url !== sources[key].url) conflicts.push(key);
  }
  return { sources: merged, proposed, conflicts };
}

// ---------- hosts and links ----------

// Wikis are not sources (anyone can edit them); nor are popular history sites (author, 2026-10-01).
export const WIKI_HOSTS = ['livius.org', 'wikipedia.org', 'wikimedia.org', 'wikisource.org', 'wikiquote.org', 'wiktionary.org', 'wikidata.org', 'wikibooks.org', 'fandom.com', 'wikia.com', 'wikia.org'];
export const isWiki = (url) => {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return WIKI_HOSTS.some((w) => host === w || host.endsWith(`.${w}`));
  } catch { return false; }
};
/** A URL with what makes no difference to the page taken off (the fragment, `lang`, a verse `id`, a trailing slash, www), to compare two. */
export function normUrl(url) {
  try {
    const u = new URL(url);
    u.hash = ''; u.searchParams.delete('lang'); u.searchParams.delete('id');
    return `${u.hostname.replace(/^www\./, '')}${u.pathname.replace(/\/$/, '')}${u.search}`.toLowerCase();
  } catch { return String(url).toLowerCase(); }
}

// ---------- a guide or theme page ----------

export const headingKey = (s) => String(s).normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
/** A guide or theme page's sections: the text before the first heading is the opening (`heading: null`); a heading is `## …` or `<h2 …>…</h2>`. */
export function pageSections(body) {
  const out = [{ heading: null, text: '' }];
  for (const line of body.split('\n')) {
    const h = line.match(/^#{1,3}\s+(.*?)\s*$/) ?? line.match(/^<h[1-6][^>]*>(.*?)<\/h[1-6]>/);
    if (h) out.push({ heading: h[1].replace(/<[^>]+>/g, '').replace(/[*_`]/g, '').trim(), text: '' });
    else out.at(-1).text += `${line}\n`;
  }
  return out;
}
/** A page ledger row's `where` as a section key: “section “The cup handed round”” -> the heading's key, “opening” -> 'opening', anything else -> null. */
export const whereKey = (w) => {
  const s = String(w ?? '');
  if (/^\s*opening\b/i.test(s)) return 'opening';
  const m = s.match(/^\s*section\s+(.*)$/i);
  return m ? headingKey(m[1]) : null;
};

// ---------- a chapter's parts, and a row's `where` ----------

/** The verse a note's `ref` starts at: 5, '5–6', or the end of 'Gen. 22:5–6'. */
export const verseOf = (ref) => { const m = String(ref ?? '').match(/(\d+)(?:\s*[–-]\s*\d+)?\s*$/); return m ? +m[1] : null; };
/** The verses a note's `ref` covers, [first, last]. */
export const versesOf = (ref) => { const m = String(ref ?? '').match(/(\d+)(?:\s*[–-]\s*(\d+))?\s*$/); return m ? [+m[1], +(m[2] ?? m[1])] : null; };

/**
 * The parts of a chapter a ledger row's `where` names, as ids: a field (`setting`), `section 2`, or `note:<index in notes>`.
 * A `where` may name several parts, separated by “; ”. Note titles are compared on letters, so straight and curly quotes agree;
 * a note named by verse alone (“note 22:8”) is every note on that verse. A part that names nothing in the chapter is in `missing`.
 */
export function partsOfWhere(where, ch) {
  const ids = [], missing = [];
  const notes = ch.notes ?? [];
  for (const part of String(where ?? '').split(/;\s+(?=(?:note|setting|thread|when|section|christ|explore|parallels)\b)/i)) {
    const p = part.trim();
    let m;
    if ((m = p.match(/^(when|setting|thread|christ|explore|parallels)\b/i))) { const f = m[1].toLowerCase(); if (ch[f] !== undefined) ids.push(f); else missing.push(p); }
    else if ((m = p.match(/^section\s+(\d+)\b/i))) { const k = +m[1]; if (k >= 1 && k <= (ch.sections ?? []).length) ids.push(`section ${k}`); else missing.push(p); }
    else if ((m = p.match(/^notes?\s+(?:\d+\s*:\s*)?(\d+)(?:\s*[–-]\s*\d+)?\s*(.*)$/is))) {
      const verse = +m[1], titleKey = headingKey(m[2]);
      let hits = titleKey ? notes.map((n, i) => (headingKey(n.title) === titleKey ? i : -1)).filter((i) => i >= 0) : notes.map((n, i) => (verseOf(n.ref) === verse ? i : -1)).filter((i) => i >= 0);
      if (hits.length > 1 && titleKey) { const at = hits.filter((i) => verseOf(notes[i].ref) === verse); if (at.length) hits = at; }
      if (hits.length) ids.push(...hits.map((i) => `note:${i}`)); else missing.push(p);
    } else missing.push(p);
  }
  return { ids, missing };
}

/**
 * For a `where` that names a note that is not in the chapter (the note was retitled after its rows were written), the closest note:
 * `{ index, note, sameVerse, score }`, by the words of the titles and by verse; null if the `where` is not a note's.
 */
export function closestNote(ch, where) {
  const m = String(where ?? '').match(/^notes?\s+(?:\d+\s*:\s*)?(\d+)(?:\s*[–-]\s*\d+)?\s*(.*)$/is);
  if (!m) return null;
  const verse = +m[1], words = (t) => new Set(String(t).normalize('NFKD').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []);
  const want = words(m[2]);
  let best = null;
  (ch.notes ?? []).forEach((note, index) => {
    const have = words(note.title), same = [...want].filter((w) => have.has(w)).length, all = new Set([...want, ...have]).size || 1;
    const [a, b] = versesOf(note.ref) ?? [0, 0], sameVerse = verse >= a && verse <= b;
    const score = same / all + (sameVerse ? 0.5 : 0);
    if (!best || score > best.score) best = { index, note, sameVerse, score };
  });
  return best;
}
