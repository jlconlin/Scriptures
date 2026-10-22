// Draw a volume map as SVG from public data: Natural Earth (public domain) for land, lakes, rivers, deserts and mountain ranges, and
// OpenBible.info's Bible Geocoding Data (CC BY 4.0) for where each place is (its modern identification).
//
//   node scripts/map.mjs <volume> <map name>   reads content/volumes/<volume>/maps/<name>.yaml and writes <name>.svg
//
// The data is not kept in the repository. Fetch it once into .cache/geo/ (DEVELOPMENT.md, “Maps”):
//   ne_10m_land, ne_10m_lakes, ne_10m_rivers_lake_centerlines, ne_10m_geography_regions_polys (.geojson, from
//   github.com/nvkelso/natural-earth-vector/geojson) and openbible-modern.jsonl (modern.jsonl from
//   github.com/openbibleinfo/Bible-Geocoding-Data/data).
// The spec gives the area (`box: [west, south, east, north]` in degrees), the width in pixels, the places
// (`places:` each `{ name, find?, at?, label?, dx?, dy?, home? }`: `find` is the name OpenBible lists the place under
// when it differs, `at` a [lon, lat] that overrides it), and labels for regions and seas (`labels:` each
// `{ text, at: [lon, lat], class }`, class one of m-empire, m-region, m-sea-label, m-river-label, m-small).
// The SVG uses the classes of `.map` in site.css, so it follows the site's light and dark colours.
// Beside the SVG it writes <name>.places.json, which the build gives the page so a chapter's Context map can show the
// places that chapter names (site.js “chapter map”): for each place, the verses where OpenBible's ancient-places data
// (ancient.jsonl, also in .cache/geo/ as openbible-ancient.jsonl) says the King James text means that place, and the
// first sentence of its Bible Dictionary entry. A place gives `ancient:` when its OpenBible entry's name differs from
// `find`/`name` (a place given by `at`), and `bd:` when its entry's address differs from its name in lower case;
// `bd: none` for none. `scan: [abraham]` and a place's `also: [Luz]` are for books OpenBible doesn't cover (below); a name search
// can find a person of the same name, so `skip: [Abraham.2.1]` leaves out a verse that means someone else.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { readPage } from '../src/lib/pages.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [volume, name] = process.argv.slice(2);
if (!volume || !name) { console.error('usage: node scripts/map.mjs <volume> <map name>'); process.exit(1); }
const dir = path.join(ROOT, 'content/volumes', volume, 'maps');
const spec = YAML.parse(await readFile(path.join(dir, `${name}.yaml`), 'utf8'));
const geo = (f) => path.join(ROOT, '.cache/geo', f);
const json = async (f) => JSON.parse(await readFile(geo(f), 'utf8'));

// ---------- projection: equirectangular, shrunk east–west by the cosine of the middle latitude ----------
const [W, S, E, N] = spec.box;
const width = spec.width ?? 600;
const k = Math.cos(((S + N) / 2) * Math.PI / 180);
const scale = width / ((E - W) * k);
const height = Math.round((N - S) * scale);
const px = ([lon, lat]) => [(lon - W) * k * scale, (N - lat) * scale];

// ---------- clipping to the box (with a margin), and simplifying ----------
const pad = 0.6; // degrees outside the box kept, so nothing ends at the frame
const box = { w: W - pad, s: S - pad, e: E + pad, n: N + pad };
const inBox = ([x, y]) => x >= box.w && x <= box.e && y >= box.s && y <= box.n;
// Sutherland–Hodgman against the four edges of the box.
function clipRing(ring) {
  const edges = [
    [(p) => p[0] >= box.w, (a, b) => { const t = (box.w - a[0]) / (b[0] - a[0]); return [box.w, a[1] + t * (b[1] - a[1])]; }],
    [(p) => p[0] <= box.e, (a, b) => { const t = (box.e - a[0]) / (b[0] - a[0]); return [box.e, a[1] + t * (b[1] - a[1])]; }],
    [(p) => p[1] >= box.s, (a, b) => { const t = (box.s - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), box.s]; }],
    [(p) => p[1] <= box.n, (a, b) => { const t = (box.n - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), box.n]; }],
  ];
  let out = ring;
  for (const [inside, cut] of edges) {
    const input = out; out = [];
    for (let i = 0; i < input.length; i++) {
      const a = input[i], b = input[(i + 1) % input.length];
      if (inside(b)) { if (!inside(a)) out.push(cut(a, b)); out.push(b); } else if (inside(a)) out.push(cut(a, b));
    }
    if (!out.length) return [];
  }
  return out;
}
// A line kept as the runs of it that lie in the box.
function clipLine(line) {
  const runs = []; let run = [];
  for (const p of line) { if (inBox(p)) run.push(p); else if (run.length) { runs.push(run); run = []; } }
  if (run.length) runs.push(run);
  return runs.filter((r) => r.length > 1);
}
// Douglas–Peucker on pixel coordinates.
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [x1, y1] = pts[a], [x2, y2] = pts[b];
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
    let far = -1, max = tol;
    for (let i = a + 1; i < b; i++) { const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / len; if (d > max) { max = d; far = i; } }
    if (far > 0) { keep[far] = 1; stack.push([a, far], [far, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const r1 = (n) => Math.round(n * 10) / 10;
const d = (pts, close) => pts.length ? `M${pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L')}${close ? 'Z' : ''}` : '';
const polygons = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []);
const lines = (g) => (g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : []);
const ringPaths = (features, tol) => features.flatMap((f) => polygons(f.geometry).flatMap((poly) => poly.map((ring) => {
  const pts = simplify(clipRing(ring).map(px), tol);
  return pts.length > 2 ? d(pts, true) : '';
}))).filter(Boolean).join('');
const linePaths = (features, tol) => features.flatMap((f) => lines(f.geometry).flatMap((l) => clipLine(l).map((run) => d(simplify(run.map(px), tol), false)))).filter(Boolean).join('');

// ---------- the layers ----------
const touches = (f) => { const all = [...polygons(f.geometry).flat(2), ...lines(f.geometry).flat()]; return all.some(inBox); };
const land = (await json('ne_10m_land.geojson')).features.filter(touches);
const lakes = (await json('ne_10m_lakes.geojson')).features.filter(touches);
const rivers = (await json('ne_10m_rivers_lake_centerlines.geojson')).features.filter(touches).filter((f) => (f.properties.scalerank ?? 9) <= (spec.riverRank ?? 7));
const regions = (await json('ne_10m_geography_regions_polys.geojson')).features.filter(touches);
const deserts = regions.filter((f) => f.properties.FEATURECLA === 'Desert');
const mountains = regions.filter((f) => f.properties.FEATURECLA === 'Range/mtn');

// ---------- the places, from OpenBible ----------
const openbible = (await readFile(geo('openbible-modern.jsonl'), 'utf8')).trim().split('\n').map((l) => JSON.parse(l));
function where(place) {
  if (place.at) return place.at;
  const want = place.find ?? place.name;
  let best = null;
  for (const m of openbible) {
    if (!m.lonlat || m.class === 'natural') continue;
    for (const a of Object.values(m.ancient_associations ?? {})) if (a.name === want && (!best || a.score > best.score)) best = { score: a.score, lonlat: m.lonlat };
  }
  if (!best) throw new Error(`${name}.yaml: OpenBible has no place named “${want}” (give \`find:\` or \`at:\`)`);
  return best.lonlat.split(',').map(Number);
}
// A place's key in the SVG (data-place) and in <name>.places.json.
const keyOf = (p) => p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const placeMarks = (spec.places ?? []).map((p) => {
  const [x, y] = px(where(p));
  const lx = x + (p.dx ?? 7), ly = y + (p.dy ?? 4);
  const anchor = (p.dx ?? 7) < 0 ? ' text-anchor="end"' : '';
  const mark = p.home
    ? `<circle cx="${r1(x)}" cy="${r1(y)}" r="4.5" class="m-home"/><text x="${r1(lx)}" y="${r1(ly)}" class="m-home-label"${anchor}>${esc(p.label ?? p.name)}</text>`
    : `<circle cx="${r1(x)}" cy="${r1(y)}" r="3"/><text x="${r1(lx)}" y="${r1(ly)}"${p.small ? ' class="m-small"' : ''}${anchor}>${esc(p.label ?? p.name)}</text>`;
  return `<g class="pl" data-place="${keyOf(p)}">${mark}</g>`;
}).join('\n    ');
// A region's label (EGYPT, MOAB) takes part in a chapter's map, as a place does, when it names its OpenBible entry
// (`ancient:`); its name is `name:`, or the label's text in title case.
const regionName = (l) => l.name ?? l.text.toLowerCase().replace(/(^|[\s-])\S/g, (c) => c.toUpperCase());
const isRegion = (l) => l.ancient !== undefined;
const labels = (spec.labels ?? []).map((l) => {
  const [x, y] = px(l.at);
  const text = `<text x="${r1(x)}" y="${r1(y)}" class="${l.class ?? 'm-region'}" text-anchor="middle">${esc(l.text)}</text>`;
  return isRegion(l) ? `<g class="pl region" data-place="${keyOf({ name: regionName(l) })}">${text}</g>` : text;
}).join('\n  ');

const svg = `<svg viewBox="0 0 ${width} ${height}" role="img" class="map">
  <title>${esc(spec.title)}</title>
  <rect width="${width}" height="${height}" class="m-sea"/>
  <path d="${ringPaths(land, 0.35)}" class="m-land" fill-rule="evenodd"/>
  <path d="${ringPaths(deserts, 0.8)}" class="m-desert" fill-rule="evenodd"/>
  <path d="${ringPaths(mountains, 0.8)}" class="m-mountain" fill-rule="evenodd"/>
  <path d="${ringPaths(lakes, 0.35)}" class="m-lakefill"/>
  <path d="${linePaths(rivers, 0.35)}" class="m-river"/>
  ${labels}
  <g class="m-city">
    ${placeMarks}
  </g>
  <text x="${width - 6}" y="${height - 6}" class="m-credit" text-anchor="end">Natural Earth · OpenBible.info (CC BY 4.0)</text>
</svg>
`;
await writeFile(path.join(dir, `${name}.svg`), svg);

// ---------- the places' data: the verses that mean each place, and its Bible Dictionary sentence ----------
const ancient = new Map((await readFile(geo('openbible-ancient.jsonl'), 'utf8')).trim().split('\n').map((l) => JSON.parse(l)).map((a) => [a.friendly_id, a]));
// The Bible Dictionary sentence that says what a place is. An entry that covers several things (“(1) Son of Terah …
// (3) …”) gives the numbered part about a place; a sentence ends at a period outside parentheses (“(Gen. 12:8)” is
// inside one); a first sentence that is only the name's meaning (“House of God.”) is joined to the next.
const PLACE_WORDS = /\b(city|cities|town|place|land|district|country|region|mountain|mount|valley|plain|river|province|kingdom|well|wilderness)\b/i;
function bdSentence(text) {
  const parts = text.split(/\(\d+\)\s*/);
  if (parts.length > 2) text = parts.slice(1).find((t) => PLACE_WORDS.test(t)) ?? parts[1];
  const sentences = [];
  let depth = 0, start = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '(') depth++;
    else if (c === ')') depth = Math.max(0, depth - 1);
    else if ((c === '.' || c === ';') && depth === 0 && (i + 1 === text.length || text[i + 1] === ' ') && !/\b[A-Z]\.[A-Z]$/.test(text.slice(Math.max(0, i - 3), i))) {
      sentences.push(text.slice(start, i + 1).trim());
      start = i + 1;
    }
  }
  if (start < text.length) sentences.push(text.slice(start).trim());
  let out = sentences.shift() ?? '';
  while (out.length < 40 && sentences.length) out += ' ' + sentences.shift();
  return out.replace(/;$/, '.').replace(/^\(\d+\)\s*/, '').replace(/^([^.]{1,30}\.) \(\d+\)\s*/, '$1 ');
}
const placesData = {};
for (const p of [...(spec.places ?? []), ...(spec.labels ?? []).filter(isRegion).map((l) => ({ ...l, name: regionName(l) }))]) {
  // `ancient:` may list more than one entry where OpenBible splits one dot on the map (Beersheba 1 and 2).
  const ids = [p.ancient ?? p.find ?? p.name].flat();
  const verses = [];
  for (const id of ids) {
    const a = ancient.get(id);
    if (!a && id !== 'none') console.warn(`  ${p.name}: no OpenBible ancient place “${id}” (give \`ancient:\`); no verses`);
    for (const v of a?.verses ?? []) if ((v.translations ?? []).includes('kjv') && !verses.includes(v.osis)) verses.push(v.osis);
  }
  // Books OpenBible doesn't cover (the Pearl of Great Price), named in the spec's `scan:`, are searched for the place's
  // name and its other names (`also:`), as "<Book>.<chapter>.<verse>".
  for (const book of spec.scan ?? []) {
    const kjv = JSON.parse(await readFile(path.join(ROOT, 'data/kjv', `${book}.json`), 'utf8'));
    const re = new RegExp(`\\b(${[p.name, ...(p.also ?? [])].map((n) => n.replace(/[-]/g, '[- ]?')).join('|')})\\b`);
    const bookName = kjv.book ?? book.replace(/^./, (c) => c.toUpperCase());
    kjv.chapters.forEach((c, ci) => (c.verses ?? c).forEach((v, vi) => {
      const ref = `${bookName}.${c.chapter ?? ci + 1}.${v.verse ?? vi + 1}`;
      if (re.test(typeof v === 'string' ? v : v.text) && !(p.skip ?? []).includes(ref)) verses.push(ref);
    }));
  }
  let bd = null;
  if (p.bd !== 'none') {
    const url = `https://www.churchofjesuschrist.org/study/scriptures/bd/${p.bd ?? p.name.toLowerCase().replace(/\s+/g, '-')}?lang=eng`;
    const page = await readPage(url);
    const paras = page.error || page.paras.length > 60 ? [] : page.paras.filter((q) => q.text.length > 25 && !/^(Bible Dictionary|See also)/.test(q.text)).slice(0, 6);
    const para = paras.find((q) => PLACE_WORDS.test(q.text)) ?? paras[0];
    const sentence = para && bdSentence(para.text);
    if (sentence) bd = { url, text: sentence.trim() };
    else console.warn(`  ${p.name}: no Bible Dictionary entry at ${url} (give \`bd:\`, or \`bd: none\`)`);
  }
  placesData[keyOf(p)] = { name: p.name, ...(p.label ? { label: p.label } : {}), ...(bd ? { bd } : {}), verses };
}
await writeFile(path.join(dir, `${name}.places.json`), JSON.stringify(placesData, null, 1) + '\n');
console.log(`${name}.svg: ${width}×${height}, ${(svg.length / 1024).toFixed(1)} KB (${land.length} land, ${lakes.length} lakes, ${rivers.length} rivers, ${deserts.length} deserts, ${mountains.length} ranges, ${(spec.places ?? []).length} places)`);
