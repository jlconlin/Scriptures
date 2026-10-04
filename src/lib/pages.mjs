// Fetching web pages and reading them, for the research scripts and the ledger check.
//
// fetchPage(url) gets a page with curl (Node's fetch gets a different page from churchofjesuschrist.org) and keeps
// it in .cache/ledger/<sha1 of the url> for a day, so a page fetched by anyone today is fetched once. A Scripture
// Central KnoWhy is read from its API (the public page needs a browser) and kept under the public URL; a PDF is
// kept as its text, one form-feed between pages. pageText() and onPage() are the ledger check's comparison
// (scripts/check-ledger.mjs): a quote is on the page when its letters are. readPage(url) turns a page into its readable
// paragraphs, headings and notes, verbatim, for scripts/source.mjs and scripts/footnotes.mjs; scripts/test-source.mjs
// checks that what it returns is found by onPage().
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
export const CACHE = path.join(ROOT, '.cache/ledger');
await mkdir(CACHE, { recursive: true });

// ---------- comparing a quote with a page (the ledger check's own rules) ----------

// Compare on letters only: the sites put footnote markers, links, and verse numbers inside the text,
// and ledger quotes may carry Strong's numbers in brackets or morpheme slashes from the WLC. Digits are
// ignored because a quote copied across a verse break carries the verse number, which the page keeps in
// its own element.
// NFKD splits an accented letter into the letter and its mark (â → a) and a ligature into its letters (ﬁ → fi),
// so a quote and a page agree however each wrote them.
export const letters = (s) => String(s).normalize('NFKD').toLowerCase().replace(/[^a-zא-תͰ-Ͽ]+/g, '');
// A quote with hardly any letters (a footnote's cross-reference, “Ex. 4:22 (22–23)”) is compared with its digits kept.
export const alnum = (s) => String(s).normalize('NFKD').toLowerCase().replace(/[^a-z0-9א-תͰ-Ͽ]+/g, '');
export const entities = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&([a-z])(?:acute|grave|circ|uml|tilde|cedil|ring|caron|slash);/gi, '$1') // &acirc; → a
    .replace(/&[a-z]+\d*;/gi, ' '); // &mdash; &rsquo; &nbsp; and the rest
const visible = (html) =>
  entities(
    html
      .replace(/<sup[^>]*>.*?<\/sup>/gs, '')
      .replace(/<span class="verse-number">.*?<\/span>/gs, '')
      .replace(/<[^>]+>/g, ' '),
  );
const glState = (html) => {
  const m = html.match(/window\.__INITIAL_STATE__="([A-Za-z0-9+/=]+)"/);
  if (!m) return null;
  try { return JSON.parse(Buffer.from(m[1], 'base64').toString('utf8')); } catch { return null; }
};
// The Gospel Library keeps a chapter's footnotes in a block of data in the page, not in its visible text.
const embedded = (html) => {
  const state = glState(html);
  if (!state) return '';
  const out = [];
  const walk = (v) => { if (typeof v === 'string') out.push(v); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
  walk(state);
  return visible(out.join(' '));
};
// What a quote is looked for in: the page as a reader sees it, its embedded data, the file as it is (a quote from
// the Hebrew text's XML carries the markup; a lexicon page sets its first reference in superscript, which the
// first form drops).
export function pageText(raw) {
  if (raw.startsWith(PDF_PAGES)) { const t = raw.slice(PDF_PAGES.length); return { text: letters(t), num: alnum(t) }; }
  const forms = [visible(raw), entities(raw.replace(/<[^>]+>/g, ' ')), embedded(raw), raw];
  // A Joseph Smith Papers transcript keeps each name's pop-up in the middle of the text, which a reader doesn't see.
  if (raw.includes('id="__NEXT_DATA__"')) try { forms.push(parseJSP(raw).paras.map((p) => p.text).join(' ')); } catch {}
  return { text: forms.map(letters).join('|'), num: forms.map(alnum).join('|') };
}
// A quote is on the page when every part of it between elisions is.
// Brackets in a quote may be the writer's annotation ([7725], a Strong's number) or the page's own
// (“noun [masculine]”); a capital in parentheses may be a translation's cross-reference mark, “(M)”, which the
// page keeps in superscript, or a lexicon's own, “Genesis 1:2 (P)”. So each is tried with and without.
const variants = (quote) => {
  const q = entities(String(quote)); // a quote copied from a page's source may carry an entity (D&amp;C)
  const noBrackets = (t) => t.replace(/\[[^\]]*\]/g, ''), noMarks = (t) => t.replace(/\(\s*[A-Z]{1,2}\s*\)/g, ' ');
  return [q, noBrackets(q), noMarks(q), noMarks(noBrackets(q))];
};
/** A quote as the comparison reads it: for each way of reading it (variants), its parts between elisions, as ['text' | 'num', letters]. */
export const quoteParts = (quote) =>
  variants(quote).map((q) =>
    // Letters only, unless the part is short and has digits (a cross-reference), which is compared with them kept.
    q.split(/…|\.\.\./).map((p) => (letters(p).length >= 6 || alnum(p) === letters(p) ? ['text', letters(p)] : ['num', alnum(p)])).filter(([, p]) => p.length >= (/[א-ת]/.test(p) ? 2 : 3)));
export const onPage = (page, quote) => quoteParts(quote).some((parts) => parts.length > 0 && parts.every(([kind, p]) => page[kind].includes(p)));

// ---------- fetching ----------

const PDF_PAGES = '%TEXT-OF-PDF-BY-PAGE\n'; // a cached PDF is kept as its text, a form-feed between pages, under this first line
const KNOWHY_DOC = '<!--knowhy-api-2-->'; // a cached KnoWhy is the article from the API, wrapped as a page, under this first line
const OLD_PDF = '%TEXT-OF-PDF\n'; // an earlier form that kept no page breaks; refetched
async function pdfPages(buf) {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await getDocument({ data: new Uint8Array(buf), verbosity: 0 }).promise;
  const out = [];
  for (let i = 1; i <= doc.numPages; i++) out.push((await (await doc.getPage(i)).getTextContent()).items.map((t) => t.str).join(' ').replace(/\s+/g, ' ').trim());
  return out;
}
export const curl = (url) => execFileSync('curl', ['-sgL', '-m', '120', '-A', 'Mozilla/5.0', url], { maxBuffer: 256e6 });
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
// A KnoWhy: https://scripturecentral.org/knowhy/<slug> is read from the API, as a page of its own.
async function knowhyDoc(slug) {
  const out = curl(`https://admin.scripturecentral.org/api/knowhys?filters[slug][$eq]=${slug}`).toString();
  const a = JSON.parse(out).data?.[0]?.attributes;
  if (!a?.body) return null;
  const info = `KnoWhy #${a.number}, published ${a.publicationDate}. Main reference: ${a.mainReference ?? 'none'}.`;
  return `${KNOWHY_DOC}<html><head><title>${esc(a.title)}</title></head><body><h1>${esc(a.title)}</h1><p class="knowhy-info">${esc(info)}</p><p class="knowhy-summary">${esc(a.summary)}</p>${a.scriptureQuote ? `<blockquote>${esc(a.scriptureQuote)}</blockquote>` : ''}${a.body}</body></html>`;
}
const memo = new Map(); // url -> { raw } | { error }
/** The page at `url` as kept in the cache: `{ raw }` (HTML, a file as it is, a PDF's text, or a KnoWhy) or `{ error }`. */
export async function fetchPage(url, { fresh = false, tries = 3, wait = 1500 } = {}) {
  if (memo.has(url)) return memo.get(url);
  const file = path.join(CACHE, createHash('sha1').update(url).digest('hex'));
  const knowhy = url.match(/^https?:\/\/(?:www\.)?scripturecentral\.org\/knowhy\/([^/?#]+)/);
  let raw = null;
  if (!fresh && existsSync(file) && Date.now() - statSync(file).mtimeMs < 86400e3) raw = await readFile(file, 'utf8');
  if (raw !== null && (raw.length <= 200 || raw.startsWith('%PDF-') || raw.startsWith(OLD_PDF) || (knowhy && !raw.startsWith(KNOWHY_DOC)))) raw = null; // an empty page, or one cached in a form this script no longer reads
  for (let attempt = 0; raw === null && attempt < tries; attempt++) {
    try {
      if (knowhy) { try { raw = await knowhyDoc(knowhy[1]); } catch {} }
      if (raw === null) {
        const out = curl(url);
        if (out.subarray(0, 5).toString() === '%PDF-') raw = PDF_PAGES + (await pdfPages(out)).join('\f');
        else if (out.length > 200) raw = out.toString();
      }
    } catch {}
    if (raw === null && attempt + 1 < tries) await new Promise((r) => setTimeout(r, wait * (attempt + 1)));
  }
  if (raw !== null) await writeFile(file, raw);
  const result = raw === null ? { error: `could not fetch (tried ${tries} times)` } : { raw };
  memo.set(url, result);
  return result;
}

// ---------- reading a page ----------

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', sbquo: '‚', ldquo: '“', rdquo: '”', bdquo: '„',
  hellip: '…', bull: '•', middot: '·', laquo: '«', raquo: '»', copy: '©', reg: '®', deg: '°', times: '×', sect: '§', para: '¶', dagger: '†', Dagger: '‡',
  shy: '', zwj: '', zwnj: '', thinsp: ' ', ensp: ' ', emsp: ' ', iexcl: '¡', iquest: '¿', szlig: 'ß', aelig: 'æ', AElig: 'Æ', oelig: 'œ', OElig: 'Œ',
  oslash: 'ø', Oslash: 'Ø', eth: 'ð', thorn: 'þ', frac12: '½', frac14: '¼', frac34: '¾', sup1: '¹', sup2: '²', sup3: '³', plusmn: '±', prime: '′', Prime: '″',
};
const MARK = { acute: '́', grave: '̀', circ: '̂', uml: '̈', tilde: '̃', cedil: '̧', ring: '̊', caron: '̌' };
export const decode = (s) =>
  s.replace(/&(?:#x([0-9a-f]+)|#(\d+)|([a-z]+\d*)|([a-z])(acute|grave|circ|uml|tilde|cedil|ring|caron));/gi, (all, h, d, name, base, mark) =>
    h ? String.fromCodePoint(parseInt(h, 16)) : d ? String.fromCodePoint(+d) : base ? (base + MARK[mark.toLowerCase()]).normalize('NFC') : (NAMED[name] ?? all));

const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']);
const SKIP = new Set(['script', 'style', 'noscript', 'iframe', 'svg', 'template', 'head', 'form', 'select', 'button', 'object', 'video', 'audio', 'canvas', 'map', 'nav', 'footer']);
const BLOCK = new Set(['p', 'div', 'li', 'tr', 'table', 'ul', 'ol', 'dl', 'dt', 'dd', 'blockquote', 'section', 'article', 'aside', 'header', 'main', 'pre', 'hr', 'figure', 'figcaption', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'caption', 'details', 'summary', 'body', 'address', 'fieldset', 'thead', 'tbody', 'tfoot', 'center']);
const attrsOf = (s) => {
  const a = {};
  for (const m of s.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) a[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4]);
  return a;
};
const hasClass = (a, ...names) => { const c = (a.class ?? '').split(/\s+/); return names.some((n) => c.includes(n)); };
const tidy = (t) => t.replace(/[ \t\r\f]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{2,}/g, '\n').trim();

/**
 * Splits HTML into blocks, in order: `{ type: 'p', text, id, refs }` for a paragraph (refs: the #anchors it links to, which is
 * how a note's marker is tied to its paragraph) and `{ type: 'h', text, level, label }` for a heading. Scripts, styles,
 * navigation and footers are dropped, entities decoded, tags stripped; text is not otherwise changed. Options:
 * drop(tag, attrs) → true to drop an element and what is inside it; heading(tag, attrs) → a level for a heading that is
 * not an <h1>–<h6>, `label: true` for a line that belongs in front of the next heading; anchors: true to start a paragraph
 * at each <a name="…"> (Bible Hub's Septuagint puts one before each verse); inline: tags to treat as inline, not blocks.
 */
export function blocks(html, { drop = () => false, heading = () => 0, anchors = false, inline = [] } = {}) {
  const isBlock = (t) => BLOCK.has(t) && !inline.includes(t);
  const out = [];
  let cur = '', curId = null, nextId = null, refs = [], skip = null, head = null, tables = 0;
  const flush = () => {
    const t = tidy(cur);
    if (t) out.push({ type: 'p', text: t, id: curId, refs });
    cur = ''; curId = null; nextId = null; refs = [];
  };
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>|[^<]+|</g;
  for (const m of html.matchAll(re)) {
    const [tok, close, name, attrs] = m;
    if (!name) {
      if (skip || tok.startsWith('<!--')) continue;
      const text = decode(tok).replace(/\s+/g, ' ');
      if (head) head.text += text;
      else { if (!cur.trim() && text.trim()) curId = nextId; cur += text; }
      continue;
    }
    const tag = name.toLowerCase();
    const selfClosed = /\/\s*$/.test(attrs) || VOID.has(tag);
    if (skip) {
      if (tag === skip.tag && !selfClosed) skip.depth += close ? -1 : 1;
      if (skip.depth === 0) skip = null;
      continue;
    }
    if (close) {
      if (head && tag === head.tag && --head.depth === 0) { out.push({ type: 'h', text: tidy(head.text), level: head.level, label: head.label }); head = null; }
      else if (tag === 'table' && !head) { if (--tables <= 0) { tables = 0; flush(); } }
      else if (isBlock(tag) && !head && !(tag === 'tr' && tables > 1)) flush();
      continue;
    }
    const a = attrsOf(attrs);
    if (a.href?.startsWith('#') && !head) refs.push(a.href.slice(1));
    if (SKIP.has(tag) || drop(tag, a)) { if (!selfClosed) skip = { tag, depth: 1 }; continue; }
    // A heading that is a <p> or <div> ends at the next block (old pages leave a <p> unclosed); an <h1>–<h6> ends at its own close.
    if (head && !/^h[1-6]$/.test(head.tag) && isBlock(tag) && tag !== 'br') { out.push({ type: 'h', text: tidy(head.text), level: head.level, label: head.label }); head = null; }
    if (head) { if (tag === head.tag && !selfClosed) head.depth++; if (tag === 'br') head.text += ' '; continue; }
    const h = /^h([1-6])$/.test(tag) ? { level: +tag[1] } : heading(tag, a);
    if (h && (h.level || h.label)) { flush(); head = { tag, depth: selfClosed ? 0 : 1, text: '', level: h.level ?? 0, label: !!h.label }; continue; }
    if (tag === 'br') cur += '\n';
    else if (tag === 'a' && anchors && a.name && !a.href) { flush(); nextId = null; }
    else if (tag === 'td' || tag === 'th') cur += ' ';
    else if (tag === 'table') { if (tables++ === 0) flush(); }
    else if (isBlock(tag) && !(tag === 'tr' && tables > 1)) { flush(); nextId = a.id ?? null; }
  }
  flush();
  return out;
}

// The paragraphs of a page, numbered, each knowing the heading it sits under. A page whose paragraphs all have the Church's
// ids (id="p12") keeps those numbers: they are what a link's id=p12 means.
function assemble(items) {
  const ps = items.filter((i) => i.type === 'p');
  const useIds = ps.length > 0 && ps.every((p) => /^p\d+$/.test(p.id ?? ''));
  const paras = [], heads = [];
  let head = null, label = '', auto = 0;
  const open = (text, level) => { head = { text, level, from: null, to: null }; heads.push(head); };
  for (const it of items) {
    if (it.type === 'h') {
      if (it.label) { label = it.text; continue; }
      open((label ? `${label}: ` : '') + it.text, it.level); label = '';
    } else {
      if (label) { open(label, 3); label = ''; }
      const n = useIds ? +it.id.slice(1) : ++auto;
      paras.push({ n, text: it.text, head: head?.text ?? '', refs: it.refs });
      if (head) { head.from ??= n; head.to = n; }
    }
  }
  return { paras, heads: heads.filter((h) => h.text) };
}

const links = (html, base) => [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
  .map((m) => ({ text: tidy(decode(m[2].replace(/<[^>]+>/g, ''))), href: attrsOf(m[1]).href })).filter((l) => l.href && !l.href.startsWith('#'))
  .map((l) => ({ text: l.text, href: base ? new URL(l.href, base).href : l.href }));
const oneLine = (html) => blocks(html).map((b) => b.text).join(' ').replace(/\s+/g, ' ');
const citedIn = (paras, id) => paras.filter((p) => p.refs.includes(id)).map((p) => p.n);

/** A Gospel Library page's content (`{ meta, content: { body, footnotes } }`), or undefined for any other page. */
export const glContent = (raw) => Object.values(glState(raw)?.reader?.contentStore ?? {}).find((e) => e.content?.body);

const CHURCH = 'https://www.churchofjesuschrist.org';
function parseGL(state, url) {
  const stores = state.reader.contentStore;
  let want = null;
  try { const u = new URL(url, CHURCH); want = `/${u.searchParams.get('lang') ?? 'eng'}${u.pathname.replace(/^\/study/, '')}`; } catch {}
  const entry = stores[want]?.content?.body ? stores[want] : Object.values(stores).find((e) => e.content?.body);
  if (!entry) throw new Error('no content in the page data');
  const { meta, content } = entry;
  const items = blocks(content.body, {
    drop: (tag, a) => tag === 'footer' || (tag === 'sup' && hasClass(a, 'marker')) || (tag === 'span' && hasClass(a, 'verse-number', 'page-break')) || (tag === 'a' && hasClass(a, 'note-ref')) || hasClass(a, 'title-number'),
    heading: (tag, a) => (hasClass(a, 'study-summary') ? { level: 2 } : hasClass(a, 'scripture-title') ? { label: true } : 0),
  });
  const { paras, heads } = assemble(items);
  const notes = Object.values(content.footnotes ?? {}).map((f) => ({
    id: f.id, marker: f.marker, context: f.context ?? '', text: oneLine(f.text), links: links(f.text, CHURCH),
    jst: /data-note-category="jst"/.test(f.text), at: citedIn(paras, f.id),
  }));
  return { kind: 'gl', title: meta?.title ?? '', paras, heads, notes };
}

const dropJunk = (tag, a) => hasClass(a, 'popup-content', 'see-footnote', 'footnote', 'breadcrumbs', 'breadcrumb', 'navbar', 'sidebar', 'cookie', 'adsbygoogle', 'skip-link', 'sr-only', 'screen-reader-text', 'visually-hidden', 'print-only', 'reftop', 'reftop2', 'reftrans', 'refheb', 'refbot') || ['fx', 'blnk', 'announce', 'adContainer'].includes(a.id);
const headClass = (tag, a) => (hasClass(a, 'vheading', 'vheading2', 'hdg', 'toptitle2', 'anonymous-block-p') ? { level: 3 } : 0);

function parseJSP(raw) {
  const m = raw.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  const s = JSON.parse(m[1]).props.pageProps.summary;
  const { paras, heads } = assemble(blocks(s.clearText, { drop: dropJunk, heading: headClass, inline: ['aside'] })); // an <aside> is a link with its pop-up here, inline in the text
  const meta = s.meta ?? {};
  const notes = (Array.isArray(s.footnotes) ? s.footnotes : []).map((f, i) => ({ marker: String(f.number ?? f.marker ?? i + 1), context: '', text: oneLine(String(f.text ?? f)), links: links(String(f.text ?? f), 'https://www.josephsmithpapers.org'), at: [] }));
  const info = [`manuscript page ${s.editorialPageNumber} of ${s.numberOfPages} (the URL's number is the image)`, s.date, s.handwriting].filter(Boolean).join('; ');
  return { kind: 'jsp', title: meta['/paper-summary-PageTitle'] ?? `${s.documentSeriesTitle}, page ${s.editorialPageNumber}`, info, paras, heads, notes };
}

// The element that holds a page's article: <main>, <article>, role="main", Bible Hub's #leftbox, or the body.
const ROOTS = [/<main\b[^>]*>/i, /<article\b[^>]*>/i, /<[a-z]+\b[^>]*\brole=["']main["'][^>]*>/i, /<div\b[^>]*\bid=["']leftbox["'][^>]*>/i, /<[a-z]+\b[^>]*\bid=["'](?:content|main|main-content|maincontent|article)["'][^>]*>/i, /<body\b[^>]*>/i];
function innerOf(html, open) {
  const start = open.index + open[0].length, tag = open[0].match(/^<([a-z0-9]+)/i)[1].toLowerCase();
  let depth = 1;
  for (const m of html.slice(start).matchAll(new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi'))) {
    if (!/\/\s*>$/.test(m[0])) depth += m[1] ? -1 : 1;
    if (depth === 0) return html.slice(start, start + m.index);
  }
  return html.slice(start);
}
function parseHTML(raw, url) {
  let body = raw;
  for (const re of ROOTS) { const m = re.exec(raw); if (m) { const inner = innerOf(raw, m); if (inner.length > 2000 || re === ROOTS.at(-1)) { body = inner; break; } } }
  const { paras, heads } = assemble(blocks(body, { drop: dropJunk, heading: headClass, anchors: /biblehub\.com/.test(url) }));
  const notes = [...body.matchAll(/<li\b([^>]*)>([\s\S]*?)(?=<li\b|<\/[ou]l>)/gi)].filter((m) => /\b(?:fn|footnote|endnote|cite[-_]note)/i.test(m[1]))
    .map((m, i) => {
      const a = attrsOf(m[1]);
      let text = oneLine(m[2]); const mk = text.match(/^\[?(\d+[a-z]?)[.\]]?\s+/);
      if (mk) text = text.slice(mk[0].length);
      return { id: a.id, marker: mk?.[1] ?? String(i + 1), context: '', text, links: links(m[2]), at: paras.filter((p) => a.id && p.refs.includes(a.id)).map((p) => p.n) };
    });
  const t = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const hd = heads.find((h) => h.level === 1);
  const info = raw.includes(KNOWHY_DOC) ? paras.find((p) => /^KnoWhy #/.test(p.text))?.text : '';
  return { kind: raw.includes(KNOWHY_DOC) ? 'knowhy' : 'html', title: tidy(decode((t?.[1] ?? hd?.text ?? '').replace(/<[^>]+>/g, ''))), info, paras, heads, notes };
}
// A plain text file (an archive.org full text, the Hebrew text's XML): paragraphs at blank lines, and long ones cut into pieces.
function parseText(raw) {
  const paras = [];
  for (const block of raw.split(/\n[ \t]*\n+/)) {
    const t = block.replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim();
    if (!t) continue;
    for (let i = 0; i < t.length; ) {
      let end = Math.min(t.length, i + 1500);
      if (end < t.length) end = Math.max(i + 1, t.lastIndexOf(' ', end)) || end;
      paras.push({ n: paras.length + 1, text: t.slice(i, end).trim(), head: '', refs: [] });
      i = end;
    }
  }
  return { kind: 'text', title: '', paras, heads: [], notes: [] };
}

/** A page's readable form from what fetchPage kept: `{ kind, title, info, paras: [{ n, text, head }], heads, notes: [{ marker, context, text, links, at }] }`. */
export function parsePage(raw, url = '') {
  if (raw.startsWith(PDF_PAGES)) {
    const pages = raw.slice(PDF_PAGES.length).split('\f');
    return { kind: 'pdf', title: decodeURIComponent(url.split('/').pop() ?? ''), info: `${pages.length} PDF pages (numbered as the PDF counts them, not by the printed page numbers); ${pages.filter((p) => !p.trim()).length} have no text layer (a scanned image)`, paras: pages.map((t, i) => ({ n: i + 1, text: t, head: '', refs: [], label: `page ${i + 1}` })), heads: [], notes: [] };
  }
  const state = glState(raw);
  if (state?.reader?.contentStore) return parseGL(state, url);
  if (/<script id="__NEXT_DATA__"/.test(raw)) { try { return parseJSP(raw); } catch {} }
  if (!/^\s*<\?xml/.test(raw) && /<(?:html|body|head|div|p|h1|table)\b/i.test(raw.slice(0, 6000))) return parseHTML(raw, url);
  return parseText(raw);
}

/** parsePage, but a page it cannot read (a Gospel Library index page with no content) comes back empty, with its <title> and `unreadable` set, and does not throw. */
export function parseOrEmpty(raw, url = '') {
  try { return parsePage(raw, url); } catch (err) {
    const t = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return { kind: 'unreadable', unreadable: err.message, title: tidy(decode((t?.[1] ?? '').replace(/<[^>]+>/g, ''))), info: '', paras: [], heads: [], notes: [] };
  }
}

/** Fetch and read a page: the result of parsePage plus `url`, `chars` (the length of its text), and `rawLength`; or `{ url, error }`. */
export async function readPage(url, opts = {}) {
  const got = await fetchPage(url, { tries: 5, wait: 4000, ...opts }); // the Church's site drops out for a minute now and then
  if (got.error) return { url, error: got.error };
  const page = parsePage(got.raw, url);
  return { url, ...page, chars: page.paras.reduce((n, p) => n + p.text.length, 0), rawLength: got.raw.length };
}

// ---------- is it the page that was meant? ----------

const BLOCKED = /just a moment|attention required|access denied|enable javascript|checking your browser|verify you are (?:a )?human|are you a robot|captcha|request blocked|403 forbidden|cf-browser-verification|challenge-platform|pardon our interruption|security check|unusual traffic/i;
const GONE = /\b404\b|page not found|not found|no longer available|page unavailable|does not exist|can[’']t be found/i;
/**
 * What is wrong with a page that loaded, as a list of plain phrases (empty when nothing is): a block or challenge page,
 * a not-found page, a PDF with no text layer, a page with almost no text. `raw` is what fetchPage kept, `page` what parsePage read.
 */
export function pageProblems(raw, page) {
  const out = [];
  const head = [page.title, page.heads?.[0]?.text, page.paras?.[0]?.text.slice(0, 300)].filter(Boolean).join(' | ');
  if (page.kind === 'pdf') { if (page.paras.every((p) => !p.text.trim())) out.push('a PDF with no text layer (a scan)'); return out; }
  if (BLOCKED.test(head) || (raw.length < 20000 && BLOCKED.test(raw.replace(/<script[\s\S]*?<\/script>/gi, '')))) out.push('a block or challenge page');
  if (GONE.test([page.title, page.heads?.[0]?.text].filter(Boolean).join(' | '))) out.push('looks like a not-found page');
  if (page.paras.reduce((n, p) => n + p.text.length, 0) < 200 && !out.length) out.push('almost no text (a page that needs a browser?)');
  return out;
}
