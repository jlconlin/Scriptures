// Shared presentation components. Page content and book metadata stay with their existing sources.
import { esc } from '../lib/markdown.mjs';
import { bookAliases } from '../lib/refs.mjs';
import { VOLUMES } from '../lib/canon.mjs';
import { KINDS, LIBRARY, VOLUMES_WITH_GUIDES, sectionTitle } from '../site.mjs';
import { icon } from './layout.mjs';

export function sectionNav(items, after = '') {
  const links = items.filter(Boolean);
  if (!links.length) return '';
  return `<nav class="section-nav" aria-label="On this page"><span>On this page</span>${links.map(([id, label]) => `<a href="#${esc(id)}">${esc(label)}</a>`).join('')}${after}</nav>`;
}

// The same bar for a page whose sections are the <h2 id="…"> headings of rendered Markdown (guides, About).
// Labels are the headings' own text with any markup stripped; a heading without an id is left out.
export function headingNav(html, extra = []) {
  const items = [...html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map((m) => [m[1], m[2].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, '’').trim()]);
  return sectionNav([...items, ...extra]);
}

export function readingTools(kinds, counts, { plain = true } = {}) {
  return `<div class="reader-bar" id="reading" role="toolbar" aria-label="Reading tools">
  <div class="legend">${kinds.map((k) => `<button type="button" class="kind-chip k-${k} filter" aria-pressed="true" data-kind="${k}" title="${esc(KINDS[k].blurb)}">${icon(k)}${esc(KINDS[k].short)} <span class="count">${counts[k]}</span></button>`).join('')}</div>
  <div class="reader-actions">
    <button type="button" class="tool tool-notes" data-action="notes-reset" aria-label="Hide all note kinds" title="Hide all note kinds">${icon('symbol')}</button>
    ${plain ? `<button type="button" class="tool" data-action="toggle-plain" aria-pressed="true" title="Show or hide the ${esc(sectionTitle('plain'))} summaries" aria-label="Show or hide the ${esc(sectionTitle('plain'))} summaries">${icon('text')}</button>` : ''}
    <button type="button" class="tool" data-action="related" aria-pressed="false" title="Show every note as a card beside the text">${icon('panel')}<span>Related</span></button>
    <button type="button" class="tool" data-action="font" title="Text size" aria-label="Change text size"><span class="aa">Aa</span></button>
  </div></div>`;
}

export function noteSources(sources) {
  return sources.length ? `<details class="note-sources"><summary>${esc(sectionTitle('cited'))}</summary><div>${sources.join(' ')}</div></details>` : '';
}

export function noteDialog() {
  return `<dialog class="note-dialog" aria-labelledby="expanded-note-title"><div class="note-dialog-bar"><span>Expanded note</span><button type="button" class="tool" data-dialog-close>Return to passage</button></div><div class="note-dialog-verse"></div><div class="note-dialog-content"></div></dialog>`;
}

export function searchScope() {
  const volumes = VOLUMES.map((v) => ({ name: v.name, key: v.key, slug: v.slug, hasGuides: VOLUMES_WITH_GUIDES.has(v.key), books: LIBRARY.filter((b) => b.vol === v.key).sort((a, b) => a.index - b.index).map((b) => ({ slug: b.slug, name: b.name, aliases: bookAliases(b.abbr), total: b.total })) }));
  return `<details class="search-scope" data-library="${esc(JSON.stringify(volumes))}" data-kinds="${esc(JSON.stringify(Object.fromEntries(Object.entries(KINDS).map(([k, v]) => [k, { label: v.label, icon: icon(k) }]))))}"><summary>${icon('book')}<span class="scope-label">All scriptures</span>${icon('chevron')}</summary><div class="scope-panel"><div class="scope-column"><h2>Volume</h2><div class="scope-volumes"></div></div><div class="scope-column"><h2 class="scope-books-heading">Book</h2><div class="scope-books"></div></div><div class="scope-footer"><button type="button" class="scope-clear">Clear filter</button><button type="button" class="tool scope-done">Done</button></div></div></details>`;
}
