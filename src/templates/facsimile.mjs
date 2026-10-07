import { md, mdInline, esc, plain } from '../lib/markdown.mjs';
import { KINDS } from '../site.mjs';
import { layout, icon, lastRevised } from './layout.mjs';
import { renderSource } from './sources.mjs';
import { highlightVerse, noteHtml } from './chapter.mjs';

export const facsimileUrl = (book, n) => `/${book.slug}/facsimile-${n}/`;
const gospelLibraryUrl = (book, n) => `https://www.churchofjesuschrist.org/study/scriptures/${book.gospelLibrary}/fac-${n}?lang=eng`;

/** A facsimile page: the plate, then its explanation set out like a chapter's verses, one figure to a
 *  line, so notes open on a phrase of the explanation exactly as they do on a phrase of scripture. */
export function renderFacsimile({ book, fac, sources, warn }) {
  const n = fac.n;
  const name = `Facsimile ${n}`;
  const division = book.divisions.find((d) => fac.with >= d.range[0] && fac.with <= d.range[1]) ?? book.divisions[0];

  // A note's `ref` is the number of the figure whose explanation it is on.
  const byFigure = new Map();
  (fac.notes ?? []).forEach((note, idx) => {
    note.id = `nf${n}-${idx + 1}`;
    if (!KINDS[note.kind]) warn(`unknown note kind “${note.kind}” at figure ${note.ref}`);
    if (!fac.figures.some((f) => f.n === Number(note.ref))) warn(`note on figure ${note.ref}, which the explanation does not number`);
    if (!byFigure.has(Number(note.ref))) byFigure.set(Number(note.ref), []);
    byFigure.get(Number(note.ref)).push(note);
  });

  const lines = fac.figures
    .map((f, i) => {
      const notes = byFigure.get(f.n) ?? [];
      const id = f.n ? `fig${f.n}` : `line${i + 1}`;
      const num = f.n ? `<a class="vnum fig-num" href="#${id}" aria-label="Figure ${esc(f.label ?? f.n)}">${esc(f.label ?? f.n)}</a> ` : '';
      const markers = notes
        .filter((x) => !x.phrase)
        .map((x) => `<button type="button" class="marker k-${x.kind}" aria-expanded="false" aria-controls="${x.id}" data-note="${x.id}" title="${esc(plain(x.title ?? KINDS[x.kind].label))}">${icon(x.kind)}<span class="sr">${esc(KINDS[x.kind].label)}</span></button>`)
        .join('');
      return `<div class="verse-block">
  <p class="verse" id="${id}">${num}${highlightVerse(f.text, notes, (m) => warn(`figure ${f.n}: ${m}`))}${markers}</p>
  ${f.differs ? `<p class="fig-differs">${esc(f.differs)}</p>` : ''}
  ${notes.map((x) => noteHtml(x, sources)).join('\n')}
</div>`;
    })
    .join('\n');

  const counts = {};
  for (const x of fac.notes ?? []) counts[x.kind] = (counts[x.kind] ?? 0) + 1;
  const kindsUsed = Object.keys(KINDS).filter((k) => counts[k]);
  const srcList = (fac.sources ?? []).map((s) => renderSource(s, sources)).filter(Boolean);
  const others = book.facsimiles.filter((f) => f.n !== n);
  const withCh = book.chapters.find((c) => c.chapter === fac.with && !c.draft);

  const body = `
<article class="chapter facsimile" data-book="${book.slug}" data-chapter="facsimile-${n}" style="--div:var(--div-${division.key})">
  <header class="chapter-hero">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/${book.slug}/">${esc(book.name)}</a> <span>›</span> <a href="/${book.slug}/#facsimiles">The facsimiles</a></nav>
      <p class="eyebrow">${esc(book.name)} <span class="ch-num">${esc(name)}</span></p>
      <h1>${mdInline(fac.title)}</h1>
      ${fac.tagline ? `<p class="tagline">${mdInline(fac.tagline)}</p>` : ''}
      ${lastRevised(fac.updated)}
      <div class="hero-meta">
        ${withCh ? `<span>${icon('restoration')} Goes with <a href="/${book.slug}/${withCh.chapter}/">${esc(book.name)} ${withCh.chapter}</a></span>` : ''}
        <span>${icon('book')} <a href="${gospelLibraryUrl(book, n)}" target="_blank" rel="noopener">See it in the Gospel Library</a></span>
      </div>
    </div>
  </header>

  <div class="wrap chapter-grid">
    <div class="chapter-main">
      ${fac.about ? `<section class="setting card" aria-labelledby="about-h"><h2 class="card-title" id="about-h">${icon('compass')} About this facsimile</h2><div class="prose">${md(fac.about)}</div></section>` : ''}

      <figure class="plate">
        <a href="${esc(fac.image)}" title="Open the plate at full size"><img src="${esc(fac.image)}" alt="${esc(fac.alt)}" loading="lazy"></a>
        <figcaption>${mdInline(fac.credit)}</figcaption>
      </figure>

      ${kindsUsed.length ? `<div class="reader-bar" id="reading" role="toolbar" aria-label="Reading tools">
        <div class="legend">
          ${kindsUsed.map((k) => `<button type="button" class="kind-chip k-${k} filter" aria-pressed="true" data-kind="${k}" title="${esc(KINDS[k].blurb)}">${icon(k)}${esc(KINDS[k].short)} <span class="count">${counts[k]}</span></button>`).join('')}
        </div>
        <div class="reader-actions">
          <button type="button" class="tool" data-action="related" aria-pressed="false" title="Show every note as a card beside the text">${icon('panel')}<span>Related</span></button>
          <button type="button" class="tool" data-action="font" title="Text size" aria-label="Change text size"><span class="aa">Aa</span></button>
        </div>
      </div>
      <p class="reader-hint">Tap any <span class="hint-phr">highlighted phrase</span> to open a note <span class="hint-narrow">beneath its figure</span><span class="hint-wide">in the margin</span>.</p>` : ''}

      <div class="reader">
        <section class="passage" id="s1" aria-labelledby="s1h">
          <header class="passage-head">
            <span class="passage-range">Joseph Smith’s explanation, by figure</span>
            <h2 id="s1h">${esc(fac.heading)}</h2>
          </header>
          <div class="verses">${lines}</div>
        </section>
      </div>

      ${srcList.length ? `<div class="chapter-refs"><section aria-labelledby="src-h"><h2 id="src-h">Sources &amp; further reading</h2><ul class="source-list">${srcList.map((s) => `<li>${s}</li>`).join('')}</ul></section></div>` : ''}

      <nav class="pager" aria-label="Facsimiles">
        ${others.map((f, i) => `<a class="${i ? 'pager-next' : 'pager-prev'}" href="${facsimileUrl(book, f.n)}">${i ? '' : icon('arrowL')}<span><small>Facsimile ${f.n}</small>${esc(plain(f.title))}</span>${i ? icon('arrowR') : ''}</a>`).join('')}
      </nav>
    </div>
  </div>
</article>`;

  return layout({
    title: `${book.name}, ${name}: ${plain(fac.title)}`,
    description: plain(fac.tagline ?? '').slice(0, 200),
    path: facsimileUrl(book, n),
    body,
    bodyClass: 'page-chapter',
    book,
  });
}
