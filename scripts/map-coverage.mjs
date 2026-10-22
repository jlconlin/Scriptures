// How well a period's map serves its chapters: for every chapter whose Context link opens the period's guide, whether
// its map lights up a place the chapter names, and which places the chapters name most that the map doesn't have.
//
//   node scripts/map-coverage.mjs [map name …]     (default: every period map; a map's name is its guide's slug)
//
// Reads content/volumes/old-testament/periods.yaml, each book's `periods:`, the maps' <name>.places.json (from
// scripts/map.mjs), and OpenBible's ancient places (.cache/geo/openbible-ancient.jsonl), which lists the verses that
// mean each place. A place OpenBible gives no location for is listed as “no location”.
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const r = (...p) => path.join(ROOT, ...p);
const OSIS = { genesis: 'Gen', exodus: 'Exod', leviticus: 'Lev', numbers: 'Num', deuteronomy: 'Deut', joshua: 'Josh', judges: 'Judg', ruth: 'Ruth', '1-samuel': '1Sam', '2-samuel': '2Sam', '1-kings': '1Kgs', '2-kings': '2Kgs', ezra: 'Ezra', nehemiah: 'Neh', esther: 'Esth', isaiah: 'Isa', jeremiah: 'Jer', lamentations: 'Lam', ezekiel: 'Ezek', daniel: 'Dan', hosea: 'Hos', joel: 'Joel', amos: 'Amos', obadiah: 'Obad', jonah: 'Jonah', micah: 'Mic', nahum: 'Nah', habakkuk: 'Hab', zephaniah: 'Zeph', haggai: 'Hag', zechariah: 'Zech', malachi: 'Mal' };

const periods = YAML.parse(await readFile(r('content/volumes/old-testament/periods.yaml'), 'utf8'));
const mapOf = Object.fromEntries(Object.entries(periods).filter(([, p]) => p.guide).map(([k, p]) => [k, p.guide.split('/').filter(Boolean).pop()]));
const wanted = process.argv.slice(2);
const ancient = (await readFile(r('.cache/geo/openbible-ancient.jsonl'), 'utf8')).trim().split('\n').map((l) => JSON.parse(l));
const named = new Map(); // "Gen.28" -> Set of place ids
for (const a of ancient) for (const v of a.verses ?? []) {
  if (!(v.translations ?? []).includes('kjv')) continue;
  const [b, c] = v.osis.split('.');
  const k = `${b}.${c}`;
  (named.get(k) ?? named.set(k, new Set()).get(k)).add(a.friendly_id);
}
const located = new Set(ancient.filter((a) => (a.identifications ?? []).length).map((a) => a.friendly_id));

for (const [period, map] of Object.entries(mapOf)) {
  if (wanted.length && !wanted.includes(map)) continue;
  const file = r('content/volumes/old-testament/maps', `${map}.places.json`);
  if (!existsSync(file)) { console.log(`${map}: no places data (run scripts/map.mjs old-testament ${map})`); continue; }
  const places = JSON.parse(await readFile(file, 'utf8'));
  const counts = { chapters: 0, lit: 0, missed: 0 };
  const unmapped = new Map(); // place id -> chapters
  const misses = [];
  for (const dir of await readdir(r('content'))) {
    const by = r('content', dir, 'book.yaml');
    if (!existsSync(by) || !OSIS[dir]) continue;
    const book = YAML.parse(await readFile(by, 'utf8'));
    for (const range of book.periods ?? []) {
      if (range.period !== period) continue;
      const [a, b = a] = String(range.chapters).split('-').map(Number);
      for (let c = a; c <= b; c++) {
        counts.chapters++;
        const prefix = `${OSIS[dir]}.${c}.`;
        const lit = Object.values(places).some((p) => p.verses.some((v) => v.startsWith(prefix)));
        const names = [...(named.get(`${OSIS[dir]}.${c}`) ?? [])];
        if (lit) counts.lit++;
        else if (names.length) { counts.missed++; misses.push(`${dir} ${c}`); }
        const onMap = new Set(Object.values(places).flatMap((p) => p.verses.filter((v) => v.startsWith(prefix))));
        for (const id of names) {
          const a2 = ancient.find((x) => x.friendly_id === id);
          const here = (a2.verses ?? []).some((v) => v.osis.startsWith(prefix) && onMap.has(v.osis));
          if (!here) unmapped.set(id, (unmapped.get(id) ?? 0) + 1);
        }
      }
    }
  }
  console.log(`\n${map} (${period}): ${counts.chapters} chapters; the map lights a place in ${counts.lit}; ${counts.missed} name a place it doesn't show`);
  if (misses.length) console.log(`  chapters with nothing lit: ${misses.join(', ')}`);
  const top = [...unmapped].sort((x, y) => y[1] - x[1]).slice(0, 25).map(([id, n]) => `${id} ${n}${located.has(id) ? '' : ' (no location)'}`);
  console.log(`  named but not on the map (chapters): ${top.join(', ')}`);
}
