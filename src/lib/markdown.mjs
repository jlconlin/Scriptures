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
  },
});

export const unknownRefs = new Set();
const report = (r) => unknownRefs.add(r);

/** Render block markdown, with [[scripture refs]] linked. */
export const md = (s = '') => marked.parse(linkRefs(String(s).trim(), report));

/** Render inline markdown (no wrapping <p>). */
export const mdInline = (s = '') => marked.parseInline(linkRefs(String(s).trim(), report));

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Plain text (for search index / meta descriptions). */
export const plain = (s = '') =>
  String(s)
    .replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (_, a, b) => b || a)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
