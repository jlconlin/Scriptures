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
  // Two citations with nothing between them get a comma between their numbers; the comma is written here, not by a
  // CSS sibling rule, which also fired when only text separated them (author, 2026-10-13).
  const out = body.replace(/(\]\[@)/g, ']\u0000[@').replace(CITE, (_, key, loc) => {
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
    return `<sup class="cite"><a href="#ref-${ref.n}" id="${id}" aria-label="Source ${ref.n}: ${title}">${ref.n}</a></sup>`;
  }).replace(/<\/sup>\u0000<sup class="cite">/g, '</sup><sup class="cite cite-sep">,</sup><sup class="cite">').replace(/\u0000/g, '');
  return { body: out, refs };
}

/** Citation markers removed, for search text and summaries. */
export const stripCitations = (body) => body.replace(CITE, '');
