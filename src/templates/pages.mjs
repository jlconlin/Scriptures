import { md, mdInline, esc, plain } from '../lib/markdown.mjs';
import { KINDS, SITE, LIBRARY, COMING_SOMEDAY, sectionTitle } from '../site.mjs';
import { layout, icon, logo } from './layout.mjs';
import { renderSource } from './sources.mjs';
import { gospelLibraryUrl } from './chapter.mjs';
import { VOLUMES, gospelLibraryVolume } from '../lib/canon.mjs';

const ensignArt = `<svg class="hero-art" viewBox="0 0 320 220" aria-hidden="true">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--art-sky-1)"/><stop offset="1" stop-color="var(--art-sky-2)"/></linearGradient>
  </defs>
  <rect width="320" height="220" rx="24" fill="url(#sky)"/>
  <circle cx="248" cy="62" r="26" fill="var(--art-sun)" opacity=".9"/>
  <path d="M0 190 70 120l40 32 60-78 58 66 30-22 62 60v42H0Z" fill="var(--art-hill-2)"/>
  <path d="M0 220v-24l58-36 44 22 70-56 76 54 40-14 32 24v30Z" fill="var(--art-hill-1)"/>
  <path d="M170 74V28" stroke="var(--art-pole)" stroke-width="3" stroke-linecap="round"/>
  <path d="M171 30c14-6 24 6 40 0v24c-16 6-26-6-40 0Z" fill="var(--accent)"/>
  <g fill="var(--art-people)"><circle cx="40" cy="200" r="3"/><circle cx="54" cy="196" r="3"/><circle cx="286" cy="206" r="3"/><circle cx="272" cy="202" r="3"/><circle cx="118" cy="186" r="3"/></g>
</svg>`;

// `books` are in site order; the first one gets the hero buttons. `featured` are notes chosen for the teasers.
export function renderHome({ books, featured }) {
  const first = books[0].home;
  const volumes = [
    ...books.map((b) => ({
      name: b.name, href: `/${b.slug}/`, live: true, blurb: b.home.blurb,
      status: b.written.length < b.chapters.length ? `${b.written.length} of ${b.chapters.length} chapters` : `${b.chapters.length} chapters`,
    })),
    ...COMING_SOMEDAY.map((v) => ({ ...v, status: 'Someday' })),
  ];
  const body = `
<section class="home-hero">
  <div class="wrap home-hero-inner">
    <div>
      <p class="eyebrow">${logo} A scripture study companion</p>
      <h1>“What does <em>that</em> mean?”</h1>
      <p class="lede">Some passages of scripture make you stop and read them three times. This site is for those passages. It goes phrase by phrase, the way a patient religion teacher might, with the history, the Hebrew, the imagery, and the witness of Jesus Christ that sits underneath them.</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="/${books[0].slug}/">${esc(first.cta)}</a>
        <a class="btn" href="/${books[0].slug}/guides/${first.guide.slug}/">${esc(first.guide.label)}</a>
      </div>
    </div>
    ${ensignArt}
  </div>
</section>

<section class="wrap home-section">
  <h2 class="section-title">Try a phrase</h2>
  <p class="section-sub">A few notes from ${books.filter((b) => b.chapters.some((c) => c.notes?.length)).map((b) => b.name).join(' and ')}, chosen at random each time the site is built.</p>
  <div class="teasers">
    ${featured
      .map(
        (f) => `<a class="teaser k-${f.kind}" href="/${f.book.slug}/${f.chapter}/#${f.id}">
      <span class="kind-chip k-${f.kind}">${icon(f.kind)}${esc(KINDS[f.kind].label)}</span>
      <span class="teaser-phrase">“${esc(f.phrase)}”</span>
      <span class="teaser-ref">${esc(f.book.name)} ${f.chapter}:${f.ref}</span>
      <span class="teaser-text">${esc(plain(f.body).slice(0, 150))}…</span>
    </a>`,
      )
      .join('')}
  </div>
</section>

<section class="wrap home-section">
  <h2 class="section-title">The library</h2>
  <div class="volumes">
    ${volumes
      .map((v) =>
        v.live
          ? `<a class="volume live" href="${v.href}"><span class="volume-status">${v.status}</span><h3>${v.name}</h3><p>${v.blurb}</p><span class="volume-go">Open ${icon('arrowR')}</span></a>`
          : `<div class="volume"><span class="volume-status">${v.status}</span><h3>${v.name}</h3><p>${v.blurb}</p></div>`,
      )
      .join('')}
  </div>
</section>

<section class="wrap home-section home-why">
  <div class="card">
    <h2 class="card-title">${icon('christ')} Why study this way?</h2>
    <div class="prose">
      <p>The Savior said, “Search these things diligently; for great are the words of Isaiah” ([[3 Ne. 23:1]]). The point of the searching is to know Him. Every note here tries to help you understand the words or see Jesus Christ in them.</p>
      <p>Commentary is not scripture. Where Latter-day Saint scholars or other students of Isaiah read a passage in different ways, the notes say so. Where prophets and apostles have taught plainly, the notes follow them. The best interpreter of Isaiah is still the Holy Ghost ([[2 Ne. 25:4]]).</p>
    </div>
  </div>
</section>`;
  return layout({ title: '', path: '/', body, bodyClass: 'page-home' });
}

// A volume's page: its books on the site, and the Gospel Library for the rest.
export function renderVolume({ volume, books }) {
  const sorted = [...books].sort((a, b) => a.place.index - b.place.index);
  const status = (b) => (b.written.length < b.chapters.length ? `${b.written.length} of ${b.chapters.length} chapters` : `${b.chapters.length} chapters`);
  const body = `
<header class="page-hero"><div class="wrap narrow">
  <p class="eyebrow">The standard works</p>
  <h1>${esc(volume.name)}</h1>
  <p class="lede">${sorted.length ? `The books of the ${esc(volume.name)} on this site so far. The whole ${esc(volume.name)} is in the Gospel Library, with footnotes and study helps.` : `Nothing from the ${esc(volume.name)} is on this site yet. You can read it in the Gospel Library, with footnotes and study helps.`}</p>
  <p><a class="btn" href="${gospelLibraryVolume(volume)}" target="_blank" rel="noopener">Read the ${esc(volume.name)} in the Gospel Library ↗</a></p>
</div></header>
${sorted.length ? `<section class="wrap narrow book-section"><div class="volumes volumes-stack">
  ${sorted.map((b) => `<a class="volume live" href="/${b.slug}/"><span class="volume-status">${status(b)}</span><h3>${esc(b.name)}</h3><p>${esc(b.home.blurb)}</p><span class="volume-go">Open ${icon('arrowR')}</span></a>`).join('')}
</div></section>` : ''}`;
  return layout({ title: volume.name, description: `The books of the ${volume.name} on ${SITE.name}.`, path: `/${volume.slug}/`, body, bodyClass: 'page-volume', volume: volume.key });
}

export function renderBookIndex({ book, guides, sources }) {
  const divisions = book.divisions
    .map((d) => {
      const chs = book.chapters.filter((c) => c.chapter >= d.range[0] && c.chapter <= d.range[1]);
      return `<section class="division" id="${d.key}" style="--div:var(--div-${d.key})">
  <header class="division-head">
    <span class="division-range">${esc(book.name)} ${d.range[0]}–${d.range[1]}</span>
    <h3>${esc(d.name)}</h3>
    <p>${mdInline(d.blurb)}</p>
  </header>
  <ol class="chapter-cards">
    ${chs
      .map((c) =>
        c.draft
          ? `<li><a class="chapter-card unwritten" href="${gospelLibraryUrl(book, c.chapter)}" target="_blank" rel="noopener">
      <span class="cc-num">${c.chapter}</span>
      <span class="cc-title">${c.title ? mdInline(c.title) : 'Commentary coming'}</span>
      <span class="cc-tag">${c.title ? 'Commentary coming. ' : ''}Read it in the Gospel Library ↗</span>
    </a></li>`
          : `<li><a class="chapter-card" href="/${book.slug}/${c.chapter}/" data-ch="${book.slug}-${c.chapter}">
      <span class="cc-num">${c.chapter}</span>
      <span class="cc-title">${mdInline(c.title)}</span>
      ${c.tagline ? `<span class="cc-tag">${esc(plain(c.tagline))}</span>` : ''}
      <span class="cc-read" aria-hidden="true">${icon('check')}</span>
    </a></li>`,
      )
      .join('')}
  </ol>
</section>`;
    })
    .join('');

  const body = `
<section class="book-hero">
  <div class="wrap book-hero-inner">
    <div>
      <p class="eyebrow"><a href="/${VOLUMES.find((v) => v.key === book.place.vol).slug}/">${esc(book.eyebrow)}</a></p>
      <h1>${esc(book.name)}</h1>
      <blockquote class="hero-quote">${book.heroQuote.text} <cite>${book.heroQuote.cite}</cite></blockquote>
      <div class="prose lede">${md(book.intro)}</div>
      <div class="progress" aria-live="polite"><div class="progress-bar"><span style="width:0%"></span></div><span class="progress-label">Mark chapters as studied to track your progress.</span></div>
    </div>
    ${ensignArt}
  </div>
</section>

${guides.length ? `<p class="wrap start-callout">${icon('key')}<span>New to ${esc(book.name)}? Start with <a href="/${book.slug}/guides/">Guides</a>.</span></p>` : ''}

<section class="wrap book-section" id="chapters">
  <h2 class="section-title">The chapters</h2>
  <p class="section-sub">${esc(book.divisionsBlurb)}</p>
  <div class="dial-wrap division-map-wrap"><div class="dial-label" aria-hidden="true" hidden></div><div class="division-map" aria-hidden="true">
    ${book.divisions.map((d) => `<a href="#${d.key}" style="--div:var(--div-${d.key});--c:var(--div-${d.key});flex:${d.range[1] - d.range[0] + 1}" data-label="${esc(d.name)}" data-div="${esc(book.name)} ${d.range[0]}–${d.range[1]}"><span>${d.range[0]}–${d.range[1]}</span></a>`).join('')}
  </div></div>
  ${divisions}
</section>


<section class="wrap book-section">
  <h2 class="section-title">Beloved passages</h2>
  <ul class="beloved">
    ${book.beloved.map((b) => `<li><a href="/${book.slug}/${b.chapter}/#v${b.verse}"><span class="bel-text">“${esc(b.text)}”</span><span class="bel-ref">${esc(book.name)} ${b.chapter}:${b.verse}</span></a></li>`).join('')}
  </ul>
</section>

<section class="wrap book-section">
  <h2 class="section-title">Most-used sources</h2>
  <p class="section-sub">Every note cites its sources. These are the ones this commentary leans on most.</p>
  <ul class="source-list">${book.coreSources.map((s) => `<li>${renderSource(s, sources)}</li>`).join('')}</ul>
</section>`;

  return layout({
    title: book.name,
    description: book.description,
    path: `/${book.slug}/`,
    body,
    bodyClass: 'page-book',
    book,
  });
}

// Guides and theme pages share one template; these are the words that differ.
export const COLLECTIONS = {
  guides: { path: 'guides', crumb: 'Guides', indexTitle: (b) => `Guides to ${b.name}`, lede: 'Short background essays that make the chapters easier to read.', all: 'All guides', next: 'Next guide' },
  themes: { path: 'themes', crumb: 'Themes', indexTitle: (b) => `Themes in ${b.name}`, lede: 'Ideas that run through many chapters, gathered in one place.', all: 'All themes', next: 'Next theme' },
};

export function renderGuidesIndex({ book, guides, collection = COLLECTIONS.guides, themes = [] }) {
  const c = collection;
  const t = COLLECTIONS.themes;
  const body = `
<header class="page-hero"><div class="wrap guides-wide">
  <nav class="crumbs"><a href="/${book.slug}/">${esc(book.name)}</a></nav>
  <h1>${esc(c.indexTitle(book))}</h1>
  <p class="lede">${esc(c.lede)}</p>
</div></header>
<div class="wrap guides-wide"><div class="guide-cards guide-cards-two">
${guides.map((g) => `<a class="guide-card" href="/${book.slug}/${c.path}/${g.slug}/"><span class="guide-icon">${icon(g.icon ?? 'book')}</span><span class="guide-title">${esc(g.title)}</span><span class="guide-blurb">${esc(g.blurb)}</span></a>`).join('')}
</div>
${themes.length ? `<h2 class="section-title guides-themes-title" id="themes">Themes</h2>
<p class="section-sub">${esc(t.lede)}</p>
<div class="guide-cards guide-cards-two">${themes.map((g) => `<a class="guide-card" href="/${book.slug}/${t.path}/${g.slug}/"><span class="guide-icon">${icon(g.icon ?? 'book')}</span><span class="guide-title">${esc(g.title)}</span><span class="guide-blurb">${esc(g.blurb)}</span></a>`).join('')}</div>` : ''}
</div>`;
  return layout({ title: c.indexTitle(book), path: `/${book.slug}/${c.path}/`, body, bodyClass: 'page-guides', book });
}

export function renderGuide({ book, guide, guides, sources, collection = COLLECTIONS.guides }) {
  const c = collection;
  const idx = guides.findIndex((g) => g.slug === guide.slug);
  const next = guides[idx + 1];
  // Pages with [@key] citations get a numbered source list plus “Further reading” for the rest;
  // pages without citations keep a single list.
  const refs = guide.refs ?? [];
  const citedKeys = new Set(refs.map((r) => r.key));
  const further = (guide.sources ?? []).filter((s) => !citedKeys.has(String(s).split(/,\s*/)[0])).map((s) => renderSource(s, sources));
  const refList = refs.length
    ? `<h2>${esc(sectionTitle('cited'))}</h2><ol class="source-list ref-list-num">${refs
        .map((r) => `<li id="ref-${r.n}">${renderSource(r.spec, sources)} <span class="backrefs">${r.backrefs.map((id, i) => `<a href="#${id}" aria-label="Back to citation ${r.n}${r.backrefs.length > 1 ? `, use ${i + 1}` : ''}">↩</a>`).join(' ')}</span></li>`)
        .join('')}</ol>${further.length ? `<h3>${esc(sectionTitle('further'))}</h3><ul class="source-list">${further.map((s) => `<li>${s}</li>`).join('')}</ul>` : ''}`
    : further.length ? `<h2>${esc(sectionTitle('sources'))}</h2><ul class="source-list">${further.map((s) => `<li>${s}</li>`).join('')}</ul>` : '';
  const body = `
<header class="page-hero"><div class="wrap narrow">
  <nav class="crumbs"><a href="/${book.slug}/">${esc(book.name)}</a> <span>›</span> <a href="/${book.slug}/${c.path}/">${esc(c.crumb)}</a></nav>
  <h1>${esc(guide.title)}</h1>
  <p class="lede">${esc(guide.blurb)}</p>
</div></header>
<article class="wrap narrow guide prose prose-lg">
${guide.html}
${refList}
</article>
<nav class="wrap narrow pager">
  <a class="pager-prev" href="/${book.slug}/${c.path}/">${icon('arrowL')}<span><small>Back to</small>${esc(c.all)}</span></a>
  ${next ? `<a class="pager-next" href="/${book.slug}/${c.path}/${next.slug}/"><span><small>${esc(c.next)}</small>${esc(next.title)}</span>${icon('arrowR')}</a>` : `<a class="pager-next" href="/${book.slug}/1/"><span><small>Ready?</small>Begin with ${esc(book.name)} 1</span>${icon('arrowR')}</a>`}
</nav>`;
  return layout({ title: guide.title, description: guide.blurb, path: `/${book.slug}/${c.path}/${guide.slug}/`, body, bodyClass: 'page-guide', book });
}

// What every chapter page contains, for any book. Built from SECTIONS and KINDS so it can't drift
// from the chapter pages. The About page places it where content/about.md has <!-- chapter-guide -->.
export function chapterGuide() {
  const steps = [
    ['Get your bearings', `<strong>${esc(sectionTitle('setting'))}</strong> sets the scene: who is speaking, to whom, and what was happening at the time.`],
    ['Follow the thread', `<strong>${esc(sectionTitle('thread'))}</strong> shows the argument or story that ties the chapter together.`],
    ['Read with help', `Every section starts with <strong>${esc(sectionTitle('plain').toLowerCase())}</strong>, a short paraphrase that is a reading aid, not a translation. Tap a <span class="hint-phr">highlighted phrase</span> to open its note: in the margin on a wide screen, under the verse on a narrow one.`],
    ['Come unto Christ', `Each chapter ends by <strong>seeing Christ</strong> in the text and pointing to what’s <strong>${esc(sectionTitle('explore').toLowerCase())}</strong>.`],
  ];
  return `<div class="chapter-guide">
  <div class="how-grid how-grid-2">${steps.map(([h, p], i) => `<div class="how-step"><span class="how-n">${i + 1}</span><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>
  <p>Each note is marked by kind, with its own color:</p>
  <ul class="kinds-legend">${Object.entries(KINDS).map(([k, v]) => `<li><span class="kind-chip k-${k}">${icon(k)}${esc(v.label)}</span> ${esc(v.blurb)}</li>`).join('')}</ul>
</div>`;
}

export function renderPage({ title, blurb, html, path }) {
  const body = `
<header class="page-hero"><div class="wrap narrow"><h1>${esc(title)}</h1>${blurb ? `<p class="lede">${esc(blurb)}</p>` : ''}</div></header>
<article class="wrap narrow prose prose-lg">${html}</article>`;
  return layout({ title, description: blurb, path, body, bodyClass: 'page-plain' });
}

export function renderSearch() {
  const body = `
<header class="page-hero"><div class="wrap narrow">
  <h1>Search</h1>
  <p class="lede">Find a verse, a phrase, a name, or a topic across the text and the notes.</p>
  <form class="search-form" role="search" onsubmit="return false">
    <label class="sr" for="q">Search</label>
    ${icon('search')}
    <input id="q" type="search" placeholder="Try “wings as eagles”, “Immanuel”, or “Cyrus”" autocomplete="off" autofocus>
  </form>
  <div class="search-filters" role="group" aria-label="Filter results">
    <button type="button" class="tool" data-filter="all" aria-pressed="true">Everything</button>
    <button type="button" class="tool" data-filter="verse" aria-pressed="false">Verses</button>
    <button type="button" class="tool" data-filter="note" aria-pressed="false">Notes</button>
    <button type="button" class="tool" data-filter="chapter" aria-pressed="false">Chapters &amp; guides</button>
  </div>
  ${LIBRARY.length > 1 ? `<div class="search-filters" role="group" aria-label="Books to search">
    <button type="button" class="tool" data-book-filter="all" aria-pressed="true">All books</button>
    ${LIBRARY.map((b) => `<button type="button" class="tool" data-book-filter="${b.slug}" aria-pressed="false">${esc(b.name)}</button>`).join('\n    ')}
  </div>` : ''}
</div></header>
<div class="wrap narrow"><p class="search-status" aria-live="polite"></p><ol class="search-results"></ol></div>`;
  return layout({ title: 'Search', path: '/search/', body, bodyClass: 'page-search' });
}

export function render404() {
  const body = `
<header class="page-hero"><div class="wrap narrow">
  <h1>“Where is the way?”</h1>
  <p class="lede">We couldn’t find that page. Maybe it has been “removed into a corner” ([[Isa. 30:20]]).</p>
  <p><a class="btn btn-primary" href="/">Go home</a> ${LIBRARY.map((b) => `<a class="btn" href="/${b.slug}/">Open ${esc(b.name)}</a>`).join(' ')}</p>
</div></header>
<script>
// Friendly redirects: /Isaiah → /isaiah/, /isaiah/53 → /isaiah/53/, /isa/53 → /isaiah/53/.
// An unwritten chapter (/jeremiah/5/) goes to the Gospel Library.
(function(){var p=location.pathname,l=p.toLowerCase()${LIBRARY.filter((b) => b.abbr !== b.slug).map((b) => `.replace(/^\\/${b.abbr}(\\/|$)/,'/${b.slug}$1')`).join('')};if(!/\\/$/.test(l)&&!/\\.[a-z0-9]+$/.test(l))l+='/';
var gl=${JSON.stringify(Object.fromEntries(LIBRARY.filter((b) => b.written.size < b.total).map((b) => [b.slug, [b.gospelLibrary, Array.from({ length: b.total }, (_, i) => i + 1).filter((n) => !b.written.has(n))]])))},m=l.match(/^\\/([a-z0-9-]+)\\/(\\d+)\\/$/),b=m&&gl[m[1]];
if(b&&b[1].indexOf(+m[2])>=0){location.replace(b[0]+'/'+(+m[2])+'?lang=eng');return}
if(l!==p)location.replace(l+location.search+location.hash);})();
</script>`;
  return layout({ title: 'Page not found', path: '/404.html', body: body.replace(/\[\[Isa\. 30:20\]\]/, '<a href="/isaiah/30/#v20">Isa. 30:20</a>'), bodyClass: 'page-404' });
}
