import { esc } from '../lib/markdown.mjs';
import { linkRefs } from '../lib/refs.mjs';
import { SITE } from '../site.mjs';

export const logo = `<svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
  <rect x="3" y="6" width="26" height="3.2" rx="1.6" fill="currentColor" opacity=".35"/>
  <rect x="3" y="12.5" width="20" height="3.2" rx="1.6" fill="currentColor" opacity=".55"/>
  <rect x="3" y="19" width="14" height="3.2" rx="1.6" fill="currentColor" opacity=".8"/>
  <circle cx="24.5" cy="21" r="4.2" fill="var(--accent)"/>
</svg>`;

/**
 * @param {{title:string, description?:string, path:string, body:string, bodyClass?:string, book?:object, head?:string}} p
 */
export function layout({ title, description = SITE.description, path, body, bodyClass = '', book, head = '' }) {
  const fullTitle = title ? `${title} · ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const url = SITE.url + path;
  const nav = book
    ? `<nav class="site-nav" aria-label="${esc(book.name)}">
        <a href="/${book.slug}/">${esc(book.name)}</a>
        <a href="/${book.slug}/#chapters">Chapters</a>
        <a href="/${book.slug}/guides/">Guides</a>
        <a href="/search/" class="nav-search" aria-label="Search">${icon('search')}<span>Search</span></a>
      </nav>`
    : `<nav class="site-nav" aria-label="Main">
        <a href="/isaiah/">Isaiah</a>
        <a href="/about/">About</a>
        <a href="/search/" class="nav-search" aria-label="Search">${icon('search')}<span>Search</span></a>
      </nav>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta name="theme-color" content="#f7f1e6" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#17181f" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/literata.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css?v=${SITE.version}">
<script>try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t;var f=localStorage.getItem('fontScale');if(f)document.documentElement.style.setProperty('--reader-scale',f)}catch(e){}</script>
${head}
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/">${logo}<span>${esc(SITE.name)}</span></a>
    ${nav}
    <button class="theme-toggle" type="button" aria-label="Toggle dark mode" title="Toggle dark mode">${icon('moon')}${icon('sun')}</button>
  </div>
</header>
<main id="main">
${linkRefs(body)}
</main>
<footer class="site-footer">
  <div class="wrap footer-inner">
    <div>
      <a class="brand brand-small" href="/">${logo}<span>${esc(SITE.name)}</span></a>
      <p class="footer-verse">“For he will give unto the faithful line upon line, precept upon precept.” <a href="https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/98?lang=eng&amp;id=p12#p12" target="_blank" rel="noopener">D&amp;C 98:12</a></p>
    </div>
    <div class="footer-small">
      <p>The commentary on this site was written with AI (Anthropic’s Claude) and checked against the scriptures. <a href="/about/#how-this-site-was-made">How it was made</a>.</p>
      <p>An independent study companion created by a member of The Church of Jesus Christ of Latter-day Saints. It is not an official publication of the Church. For the Church’s official resources, visit <a href="https://www.churchofjesuschrist.org/study?lang=eng" target="_blank" rel="noopener">churchofjesuschrist.org</a>.</p>
      <p>Scripture text: King James Version (public domain). Commentary © ${SITE.year} ${esc(SITE.author)}, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>. <a href="/about/">About this site</a> · <a href="${SITE.repo}" target="_blank" rel="noopener">Source</a></p>
    </div>
  </div>
</footer>
<script src="/assets/site.js?v=${SITE.version}" defer></script>
</body>
</html>`;
}

const ICONS = {
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
  arrowL: '<path d="M15 5l-7 7 7 7"/>',
  arrowR: '<path d="M9 5l7 7-7 7"/>',
  // note kinds
  words: '<path d="M5 19 10.5 5h1L17 19M7.3 14h7.4"/><path d="M19 8v6" opacity=".5"/>',
  history: '<path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9"/>',
  symbol: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
  christ: '<path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/><circle cx="12" cy="12" r="3.5"/>',
  restoration: '<path d="M3 5.5c3-1.3 6-1.3 9 .7 3-2 6-2 9-.7v13c-3-1.3-6-1.3-9 .7-3-2-6-2-9-.7Z"/><path d="M12 6.2v13.2"/>',
  liken: '<path d="M12 20.5s-8-4.7-8-10.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 8 2.3c0 5.9-8 10.6-8 10.6Z"/>',
  bom: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 8h16M4 13h16M4 18h16" opacity=".6"/>',
  book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5v-15Z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H19v-3"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  key: '<circle cx="7.5" cy="14.5" r="4"/><path d="m10.5 11.5 9-9M16 6l2.5 2.5M13.5 8.5l2 2"/>',
  scroll: '<path d="M7 3h11a2 2 0 0 1 2 2v2h-4M7 3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7M7 3a2 2 0 0 1 2 2v14"/>',
  map: '<path d="m3 6 6-2.5 6 2.5 6-2.5v15L15 21l-6-2.5L3 21Z"/><path d="M9 3.5v15M15 6v15"/>',
  sparkle: '<path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  text: '<path d="M4 7V5h11v2M9.5 5v14M7.5 19h4M14 12v-1h7v1M17.5 11v8M16 19h3"/>',
  quote: '<path d="M9.5 7C6.5 8 5 10.2 5 13.5V17h4.5v-4.5H7c0-2 .8-3.3 2.5-4ZM18.5 7c-3 1-4.5 3.2-4.5 6.5V17h4.5v-4.5H16c0-2 .8-3.3 2.5-4Z"/>',
};

export const icon = (name, cls = '') =>
  `<svg class="icon ${cls} icon-${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] ?? ''}</svg>`;
