import { Marked } from 'marked';
import { linkRefs } from './refs.mjs';

const marked = new Marked({ gfm: true, breaks: false });

// External links open in a new tab.
marked.use({
  renderer: {
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const t = title ? ` title="${title}"` : '';
      const ext = /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${href}"${t}${ext}>${text}</a>`;
    },
    // Headings get ids so they can be linked to (e.g. /about/#how-this-site-was-made).
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const id = text.replace(/<[^>]+>/g, '').toLowerCase().replace(/&[a-z]+;|[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    },
  },
});

export const unknownRefs = new Set();
const report = (r) => unknownRefs.add(r);

// A table with a column headed “The words” traces an arc through the scriptures (a theme's table). Its quoted King
// James words and its steps are prose, set in the reading serif like the rest of the page; its “Passage” column of
// references stays in the interface face, as references do elsewhere (classes "arc", "kjv", "refs"; author, 2026-10-16).
const markScriptureColumns = (html) =>
  html.replace(/<table>([\s\S]*?)<\/table>/g, (table, inner) => {
    const heads = [...(inner.match(/<thead>([\s\S]*?)<\/thead>/)?.[1] ?? '').matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((m) => m[1].replace(/<[^>]+>/g, '').trim());
    const words = heads.indexOf('The words'), refs = heads.indexOf('Passage');
    if (words < 0) return table;
    const body = table.replace(/<tr>([\s\S]*?)<\/tr>/g, (row, cells) => {
      let i = -1;
      return `<tr>${cells.replace(/<td([^>]*)>/g, (td, attrs) => { i++; return i === words ? `<td${attrs} class="kjv">` : i === refs ? `<td${attrs} class="refs">` : td; })}</tr>`;
    });
    return body.replace('<table>', '<table class="arc">');
  });

/** Render block markdown, with [[scripture refs]] linked. */
export const md = (s = '') => markScriptureColumns(marked.parse(linkRefs(String(s).trim(), report)));

/** Render inline markdown (no wrapping <p>). */
export const mdInline = (s = '') => marked.parseInline(linkRefs(String(s).trim(), report));

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Plain text (for search index / meta descriptions). */
export const plain = (s = '') =>
  String(s)
    .replace(/<\/?[a-z][^>]*>/gi, ' ')
    .replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (_, a, b) => b || a)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
