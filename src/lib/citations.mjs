// Numbered citations for essay pages (guides and themes).
// In the Markdown, write [@key] or [@key, locator] right after the claim, e.g. “…in exile.[@oswalt, 2:112]”.
// Each distinct source (key plus locator) gets a number in order of first use. The citation becomes a
// small superscript number linking to its entry in the numbered source list; the entry links back.
import { renderSource } from '../templates/sources.mjs';

const CITE = /\[@([a-z0-9-]+)(?:,\s*([^\]]+))?\]/g;

/** Replace citations with superscript links. Returns the new body and the numbered references. */
export function applyCitations(body, registry, warn = () => {}) {
  const refs = [];
  const bySpec = new Map();
  const out = body.replace(CITE, (_, key, loc) => {
    if (!registry[key]) {
      warn(`unknown source in citation: [@${key}]`);
      return '';
    }
    const spec = loc ? `${key}, ${loc.trim()}` : key;
    let ref = bySpec.get(spec);
    if (!ref) {
      ref = { n: refs.length + 1, key, spec, backrefs: [] };
      refs.push(ref);
      bySpec.set(spec, ref);
    }
    const id = `cite-${ref.n}-${ref.backrefs.length + 1}`;
    ref.backrefs.push(id);
    const title = renderSource(spec, registry).replace(/<[^>]+>/g, '').replace(/"/g, '&quot;');
    return `<sup class="cite"><a href="#ref-${ref.n}" id="${id}" title="${title}" aria-label="Source ${ref.n}">${ref.n}</a></sup>`;
  });
  return { body: out, refs };
}

/** Citation markers removed, for search text and summaries. */
export const stripCitations = (body) => body.replace(CITE, '');
