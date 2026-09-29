import { esc, mdInline } from '../lib/markdown.mjs';

/**
 * Render a citation. `s` is either a key into content/sources.yaml (optionally
 * followed by a locator, e.g. "ludlow-isaiah, 142"), or free markdown text.
 */
export function renderSource(s, registry) {
  if (!s) return '';
  const [key, ...rest] = String(s).split(/,\s*/);
  const entry = registry[key];
  if (!entry) return mdInline(s);
  const locator = rest.length ? `, ${esc(rest.join(', '))}` : '';
  const title = entry.url
    ? `<a href="${entry.url}" target="_blank" rel="noopener">${esc(entry.title)}</a>`
    : esc(entry.title);
  const quoted = entry.type === 'article' || entry.type === 'talk' || entry.type === 'entry';
  const t = quoted ? `“${title}”` : `<cite>${title}</cite>`;
  const parts = [entry.author ? `${esc(entry.author)}, ${t}` : t];
  if (entry.pub) parts.push(mdInline(entry.pub));
  return parts.join(', ') + locator + '.';
}
