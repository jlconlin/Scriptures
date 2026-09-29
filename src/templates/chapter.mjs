import { md, mdInline, esc, plain } from '../lib/markdown.mjs';
import { KINDS } from '../site.mjs';
import { layout, icon } from './layout.mjs';
import { renderSource } from './sources.mjs';
import { compareVerse } from '../lib/bomdiff.mjs';

/** Split "1-9" / "4" into [first, last]. */
export const range = (r) => {
  const [a, b] = String(r).split(/[–-]/).map(Number);
  return [a, b ?? a];
};

/** Wrap each note's phrase in its verse with a button; returns HTML for the verse text. */
function highlightVerse(text, notes, warn) {
  const spans = [];
  for (const n of notes) {
    if (!n.phrase) continue;
    const i = text.indexOf(n.phrase);
    if (i < 0) {
      warn(`phrase not found: “${n.phrase}”`);
      continue;
    }
    const j = i + n.phrase.length;
    if (spans.some((s) => i < s.j && j > s.i)) {
      warn(`overlapping phrase: “${n.phrase}”`);
      continue;
    }
    spans.push({ i, j, n });
  }
  spans.sort((a, b) => a.i - b.i);
  let out = '';
  let pos = 0;
  for (const { i, j, n } of spans) {
    out += esc(text.slice(pos, i));
    // A span, not a <button>: browsers never break a button across lines, so long phrases jumped to a new line.
    out += `<span class="phr k-${n.kind}" role="button" tabindex="0" aria-expanded="false" aria-controls="${n.id}" data-note="${n.id}">${esc(text.slice(i, j))}</span>`;
    pos = j;
  }
  return out + esc(text.slice(pos));
}

/** Opening of a note for the compact “related content” card: the first sentence, plus the next
 *  when the first is very short. A period only ends a sentence when the next word isn't a number,
 *  so references like “Isa. 53:1” don't cut it short. */
function teaser(md) {
  const sentence = /^.*?[.!?]["”’)]*(?=\s+[^\s\d]|$)/;
  let rest = plain(md);
  let x = '';
  while (rest && x.length < 70) {
    const s = rest.match(sentence)?.[0] ?? rest;
    x = x ? `${x} ${s}` : s;
    rest = rest.slice(s.length).trim();
  }
  if (x.length > 190) x = `${x.slice(0, 180).replace(/\s+\S*$/, '')}…`;
  return x;
}

/** A collapsible introductory section. Open by default; collapsed, it shows its heading and first sentence.
 *  site.js remembers which sections a reader has collapsed. */
function introSection({ key, cls, iconName, title, body, prose }) {
  return `<details class="${cls} intro" data-intro="${key}" open>
  <summary><h2 class="card-title" id="${key}-h">${icon(iconName)} ${esc(title)}${icon('chevron', 'intro-chevron')}</h2><span class="intro-teaser">${esc(teaser(body))}</span></summary>
  <div class="${prose}">${md(body)}</div>
</details>`;
}

function noteHtml(n, sources) {
  const k = KINDS[n.kind];
  const src = (n.sources ?? []).map((s) => renderSource(s, sources)).filter(Boolean);
  return `<aside class="note k-${n.kind}" id="${n.id}" hidden aria-label="${esc(k.label)} note">
  <div class="note-head">
    <span class="kind-chip k-${n.kind}">${icon(n.kind)}${esc(k.label)}</span>
    <a class="note-link" href="#${n.id}" title="Link to this note" aria-label="Link to this note">#</a>
    <button type="button" class="note-close" aria-label="Close note" data-close="${n.id}">×</button>
  </div>
  <h4 class="note-title">${mdInline(n.title ?? (n.phrase ? `“${n.phrase}”` : 'A closer look'))}</h4>
  <p class="note-teaser">${esc(teaser(n.body))}</p>
  <div class="note-body prose">${md(n.body)}</div>
  ${src.length ? `<p class="note-sources"><span>Sources:</span> ${src.join(' ')}</p>` : ''}
</aside>`;
}

function bomNoteHtml(b) {
  return `<aside class="note k-bom" id="${b.id}" hidden aria-label="Book of Mormon reading">
  <div class="note-head">
    <span class="kind-chip k-bom">${icon('bom')}${esc(KINDS.bom.label)}</span>
    <a class="note-link" href="#${b.id}" title="Link to this note" aria-label="Link to this note">#</a>
    <button type="button" class="note-close" aria-label="Close" data-close="${b.id}">×</button>
  </div>
  <h4 class="note-title">${mdInline(`[[${b.ref}]]`)} reads differently</h4>
  <p class="bom-text">${b.html}</p>
  <p class="bom-legend"><ins>added or changed in the Book of Mormon</ins> <del>in the King James Version only</del></p>
</aside>`;
}

export function renderChapter({ book, ch, verses, sources, prev, next, warn, bom }) {
  const n = ch.chapter;
  const division = book.divisions.find((d) => n >= d.range[0] && n <= d.range[1]);

  // Assign ids and index notes by verse
  const byVerse = new Map();
  (ch.notes ?? []).forEach((note, idx) => {
    note.id = `n${n}-${idx + 1}`;
    note.v = range(note.ref)[0];
    if (!KINDS[note.kind]) warn(`unknown note kind “${note.kind}” at ${n}:${note.ref}`);
    if (note.v < 1 || note.v > verses.length) warn(`note ref out of range: ${n}:${note.ref}`);
    if (!byVerse.has(note.v)) byVerse.set(note.v, []);
    byVerse.get(note.v).push(note);
  });

  // Book of Mormon readings that differ in more than small words
  const variants = new Map();
  let minorVariants = 0;
  for (const [v, b] of Object.entries(bom?.verses ?? {})) {
    const cmp = compareVerse(verses[v - 1], b.text);
    if (cmp.significant) variants.set(Number(v), { ...b, ...cmp, id: `b${n}-${v}` });
    else minorVariants++;
  }

  const sections = ch.sections?.length ? ch.sections : [{ range: `1-${verses.length}`, heading: '' }];
  // Check that sections cover every verse exactly once
  const covered = new Array(verses.length + 1).fill(0);
  sections.forEach((s) => {
    const [a, b] = range(s.range);
    for (let v = a; v <= b; v++) covered[v]++;
  });
  covered.slice(1).forEach((c, i) => c !== 1 && warn(`verse ${n}:${i + 1} is in ${c} sections`));

  const passageHtml = sections
    .map((s, si) => {
      const [a, b] = range(s.range);
      const vs = [];
      for (let v = a; v <= b && v <= verses.length; v++) {
        const notes = byVerse.get(v) ?? [];
        const loose = notes.filter((x) => !x.phrase);
        const text = highlightVerse(verses[v - 1], notes, (m) => warn(`${n}:${v} ${m}`));
        const markers = loose
          .map(
            (x) =>
              `<button type="button" class="marker k-${x.kind}" aria-expanded="false" aria-controls="${x.id}" data-note="${x.id}" title="${esc(plain(x.title ?? KINDS[x.kind].label))}">${icon(x.kind)}<span class="sr">${esc(KINDS[x.kind].label)}</span></button>`,
          )
          .join('');
        const variant = variants.get(v);
        const bomMarker = variant
          ? `<button type="button" class="marker bom-mark k-bom" aria-expanded="false" aria-controls="${variant.id}" data-note="${variant.id}" title="The Book of Mormon reads differently">BoM</button>`
          : '';
        vs.push(`<div class="verse-block">
  <p class="verse" id="v${v}"><a class="vnum" href="#v${v}" aria-label="Verse ${v}">${v}</a> ${text}${markers}${bomMarker}</p>
  ${notes.map((x) => noteHtml(x, sources)).join('\n')}
  ${variant ? bomNoteHtml(variant) : ''}
</div>`);
      }
      const label = a === b ? `Verse ${a}` : `Verses ${a}–${b}`;
      return `<section class="passage" id="s${si + 1}" aria-labelledby="s${si + 1}h">
  <header class="passage-head">
    <span class="passage-range">${label}</span>
    <h2 id="s${si + 1}h">${mdInline(s.heading || `Isaiah ${n}`)}</h2>
  </header>
  ${s.plain ? `<div class="plain"><span class="plain-label">In plain words</span>${md(s.plain)}</div>` : ''}
  <div class="verses">${vs.join('\n')}</div>
</section>`;
    })
    .join('\n');

  const counts = {};
  for (const x of ch.notes ?? []) counts[x.kind] = (counts[x.kind] ?? 0) + 1;
  if (variants.size) counts.bom = variants.size;
  const kindsUsed = Object.keys(KINDS).filter((k) => counts[k]);

  const bomSummary = bom
    ? `<p class="bom-summary">${icon('bom')} Nephi’s text of this chapter (${mdInline(bom.passages.map((p) => `[[${p}]]`).join('; '))}) reads differently from the King James Version in <strong>${variants.size + minorVariants}</strong> verse${variants.size + minorVariants === 1 ? '' : 's'}. ${variants.size ? `The <span class="kind-chip k-bom">BoM</span> markers show the ${variants.size} where more than a small word changes.` : 'The differences are all small words.'}</p>`
    : '';

  const parallels = (ch.parallels ?? [])
    .map((p) => `<li><strong>${mdInline(`[[${p.ref}]]`)}</strong>${p.note ? ` — ${mdInline(p.note)}` : ''}</li>`)
    .join('');

  const rangeSources = (book.rangeSources ?? []).filter((x) => n >= x.range[0] && n <= x.range[1]).flatMap((x) => x.sources);
  const chapterSources = [...new Set([...(ch.sources ?? []), ...rangeSources])];
  const srcList = chapterSources.map((s) => renderSource(s, sources)).filter(Boolean);

  const dial = book.chapters
    .map((c) => {
      const d = book.divisions.find((d) => c.chapter >= d.range[0] && c.chapter <= d.range[1]);
      return `<a href="/${book.slug}/${c.chapter}/" class="tick${c.chapter === n ? ' current' : ''}" style="--c:var(--div-${d.key})" title="Isaiah ${c.chapter}: ${esc(c.title)}" aria-label="Isaiah ${c.chapter}${c.chapter === n ? ' (this chapter)' : ''}" data-ch="${c.chapter}"></a>`;
    })
    .join('');

  const churchUrl = `https://www.churchofjesuschrist.org/study/scriptures/ot/isa/${n}?lang=eng`;

  const body = `
<article class="chapter" data-book="${book.slug}" data-chapter="${n}" style="--div:var(--div-${division.key})">
  <header class="chapter-hero">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/${book.slug}/">${esc(book.name)}</a> <span>›</span> <a href="/${book.slug}/#${division.key}">${esc(division.name)}</a></nav>
      <p class="eyebrow">${esc(book.name)} <span class="ch-num">${n}</span></p>
      <h1>${mdInline(ch.title)}</h1>
      ${ch.tagline ? `<p class="tagline">${mdInline(ch.tagline)}</p>` : ''}
      <div class="dial" aria-label="Chapters of Isaiah">${dial}</div>
      <div class="hero-meta">
        ${ch.when ? `<span>${icon('history')} ${mdInline(ch.when)}</span>` : ''}
        ${ch.parallels?.some((p) => p.primary) ? `<span>${icon('restoration')} Also in ${mdInline(ch.parallels.filter((p) => p.primary).map((p) => `[[${p.ref}]]`).join(', '))}</span>` : ''}
        <span>${icon('book')} <a href="${churchUrl}" target="_blank" rel="noopener">Read with footnotes in Gospel Library</a></span>
      </div>
    </div>
  </header>

  <div class="wrap chapter-grid">
    <div class="chapter-main">
      ${ch.setting ? introSection({ key: 'setting', cls: 'setting card', iconName: 'compass', title: 'Where we are', body: ch.setting, prose: 'prose' }) : ''}

      ${ch.thread ? introSection({ key: 'thread', cls: 'thread', iconName: 'sparkle', title: 'The thread through the chapter', body: ch.thread, prose: 'prose prose-lg' }) : ''}

      <div class="reader-bar" role="toolbar" aria-label="Reading tools">
        <div class="legend">
          ${kindsUsed.map((k) => `<button type="button" class="kind-chip k-${k} filter" aria-pressed="true" data-kind="${k}" title="${esc(KINDS[k].blurb)}">${icon(k)}${esc(KINDS[k].short)} <span class="count">${counts[k]}</span></button>`).join('')}
        </div>
        <div class="reader-actions">
          <button type="button" class="tool" data-action="toggle-plain" aria-pressed="true" title="Show or hide the plain-words summaries">${icon('text')}<span>Summaries</span></button>
          <button type="button" class="tool" data-action="related" aria-pressed="false" title="Show every note as a card beside the text">${icon('panel')}<span>Related</span></button>
          <button type="button" class="tool" data-action="font" title="Text size" aria-label="Change text size"><span class="aa">Aa</span></button>
        </div>
      </div>
      <p class="reader-hint">Tap any <span class="hint-phr">highlighted phrase</span> to open a note <span class="hint-narrow">beneath its verse</span><span class="hint-wide">in the margin</span>.</p>

      <div class="reader">
        ${passageHtml}
      </div>

      ${ch.christ ? `<section class="closing card card-christ" aria-labelledby="christ-h"><h2 id="christ-h" class="card-title">${icon('christ')} Seeing Christ in Isaiah ${n}</h2><div class="prose">${md(ch.christ)}</div></section>` : ''}
      ${ch.liken ? `<section class="closing card card-liken" aria-labelledby="liken-h"><h2 id="liken-h" class="card-title">${icon('liken')} Liken it to yourself</h2><div class="prose">${md(ch.liken)}</div></section>` : ''}
      ${ch.explore ? `<section class="closing card card-explore" aria-labelledby="explore-h"><h2 id="explore-h" class="card-title">${icon('key')} Worth exploring next</h2><div class="prose">${md(ch.explore)}</div></section>` : ''}

      <div class="chapter-refs">
        ${parallels || bomSummary ? `<section aria-labelledby="par-h"><h2 id="par-h">This chapter elsewhere in scripture</h2>${bomSummary}${parallels ? `<ul class="ref-list">${parallels}</ul>` : ''}</section>` : ''}
        ${srcList.length ? `<section aria-labelledby="src-h"><h2 id="src-h">Sources &amp; further reading</h2><ul class="source-list">${srcList.map((s) => `<li>${s}</li>`).join('')}</ul></section>` : ''}
      </div>

      <label class="mark-read"><input type="checkbox" data-read="${book.slug}-${n}"> I’ve studied Isaiah ${n}</label>

      <nav class="pager" aria-label="Chapter navigation">
        ${prev ? `<a class="pager-prev" href="/${book.slug}/${prev.chapter}/">${icon('arrowL')}<span><small>Isaiah ${prev.chapter}</small>${esc(prev.title)}</span></a>` : '<span></span>'}
        ${next ? `<a class="pager-next" href="/${book.slug}/${next.chapter}/"><span><small>Isaiah ${next.chapter}</small>${esc(next.title)}</span>${icon('arrowR')}</a>` : '<span></span>'}
      </nav>
    </div>
  </div>
</article>`;

  return layout({
    title: `Isaiah ${n}: ${plain(ch.title)}`,
    description: plain(ch.tagline ?? ch.thread ?? '').slice(0, 200),
    path: `/${book.slug}/${n}/`,
    body,
    bodyClass: 'page-chapter',
    book,
  });
}
