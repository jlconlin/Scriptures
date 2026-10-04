// Hebrew lookups in the Westminster Leningrad Codex, from the Open Scriptures Hebrew Bible (morphhb), so an agent reads
// a verse or counts a word with a script instead of fetching a lexicon page and a whole book's XML. The file is fetched
// through the shared cache (src/lib/pages.mjs). References are the King James Version's, which the site and its agents use; where
// the Hebrew numbers a verse differently the Hebrew reference is printed beside it (“Mal 4:5 (Hebrew 3:23)”), from the Open Scriptures
// verse map (src/lib/hebrew.mjs: whole chapters such as Malachi 4, Joel 2:28–3:21, the ends of chapters, and the Psalm titles).
// Usage: node scripts/hebrew.mjs <book> <chapter>:<verse>[-<verse>]   each word in order: the Hebrew (a slash divides a prefix or
//                                                                      suffix from the word), its Strong's number, its morphology
//                                                                      code, its lemma as written in the file, and its lexicon page
//        node scripts/hebrew.mjs <book> --word <strongs>              every verse of the book where that Strong's number occurs, with the count
//        <book> is a book's name or abbreviation (genesis, gen, 1 sam, isa) or its directory under content/.   --fresh refetches
//        --wlc  the chapter and verse are the Hebrew text's own (3:23), and are printed with the King James reference beside them
import { wlcFile, loadWlc, loadVerseMap, hebrewToKjv, kjvToHebrew, titleOf, chapterNote, refText, verseName, parseStrongs, wordHits, WLC_NOTE } from '../src/lib/hebrew.mjs';

process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); }); // piped into head
const argv = process.argv.slice(2);
const fresh = argv.includes('--fresh'), asHebrew = argv.includes('--wlc');
const wordAt = argv.indexOf('--word');
const strongs = wordAt >= 0 ? (argv[wordAt + 1] ?? '').replace(/^H/i, '').toLowerCase() : null;
const rest = argv.filter((a, i) => !a.startsWith('--') && wordAt < 0 || i !== wordAt + 1).filter((a) => !a.startsWith('--'));
const usage = () => { console.error('Usage: node scripts/hebrew.mjs <book> <chapter>:<verse>[-<verse>] [--wlc]\n       node scripts/hebrew.mjs <book> --word <strongs>'); process.exit(1); };
if (!rest.length || (wordAt >= 0 && !parseStrongs(strongs))) usage();

const file = wlcFile(rest[0]);
if (!file) { console.error(`“${rest[0]}” is not an Old Testament book I know.`); process.exit(1); }
const wlc = await loadWlc(file, { fresh });
if (wlc.error) { console.error(`${wlc.error}: ${wlc.url}`); process.exit(1); }
const map = await loadVerseMap({ fresh });
if (map.error) { console.error(`${map.error}: ${map.url} (the verse map, which says where the Hebrew numbers differ from the King James)`); process.exit(1); }
const all = wlc.verses, have = new Set(all.map((v) => v.id)), byId = new Map(all.map((v) => [v.id, v]));
const head = `${file} (Westminster Leningrad Codex, Open Scriptures Hebrew Bible; ${WLC_NOTE})`;
// The reference a Hebrew verse is printed under: the King James reference first, the Hebrew beside it when it differs.
const labelOf = (id) => {
  const k = hebrewToKjv(map, id);
  if (k[0].title) return `${file} ${id.split('.')[1]} title (Hebrew ${id.split('.').slice(1).join(':')}; the King James prints it above the psalm, unnumbered)`;
  return refText(k[0].id, [id]) + (k.length > 1 || k[0].partial ? `${k.length > 1 ? ` and ${k.slice(1).map((x) => verseName(x.id)).join(', ')}` : ''}; part of the verse` : '');
};

if (strongs) {
  const want = parseStrongs(strongs);
  const hits = wordHits(all, want);
  const count = hits.reduce((n, v) => n + v.words.length, 0);
  console.log(`${head}\nH${strongs} (https://biblehub.com/hebrew/${want.n}.htm): ${count} occurrence${count === 1 ? '' : 's'}, in ${hits.length} of the book's ${all.length} Hebrew verses\n`);
  for (const v of hits) console.log(`${labelOf(v.id)}  ${v.words.map((w) => w.text + (w.note ? ` (${w.note})` : '')).join('  ')}`);
  if (!hits.length) console.log('(none: a number the file does not use, or a word that carries another number)');
} else {
  const m = (rest[1] ?? '').match(/^(\d+):(\d+)(?:[–-](\d+))?$/);
  if (!m) usage();
  const [c, v1, v2] = [+m[1], +m[2], +(m[3] ?? m[2])];
  // The Hebrew verses asked for, each with the reference it is printed under.
  const picked = [];
  if (asHebrew) {
    for (const v of all) { const p = v.id.split('.'); if (+p[1] === c && +p[2] >= v1 && +p[2] <= v2) picked.push({ v, label: labelOf(v.id) }); }
    if (!picked.length) console.error(`${file} ${c}:${v1}${v2 > v1 ? `-${v2}` : ''} is not in the file under Hebrew numbering (it has ${all.filter((v) => +v.id.split('.')[1] === c).length} verses in Hebrew chapter ${c}).`);
  } else {
    const t = v1 === 1 ? titleOf(map, have, file, c) : null;
    if (t) picked.push({ v: byId.get(t), label: labelOf(t) });
    for (let k = v1; k <= v2; k++) {
      const id = `${file}.${c}.${k}`, h = kjvToHebrew(map, have, id);
      if (!h.length) { console.error(`WARNING: ${file} ${c}:${k} (King James numbering) has no verse in the Hebrew file${chapterNote(map, file, c) ? `: ${chapterNote(map, file, c)}` : `: the verse map lists none, and the Hebrew chapter ${c} has ${all.filter((v) => +v.id.split('.')[1] === c).length} verses`}.`); continue; }
      for (const x of h) picked.push({ v: byId.get(x.id), label: refText(id, [x.id]) + (x.partial ? '; part of the Hebrew verse' : '') });
    }
  }
  if (!picked.length) process.exit(1);
  console.log(`${head}\nMorphology codes: https://hb.openscriptures.org/parsing/HebrewMorphologyCodes.html\n`);
  for (const { v, label } of picked) {
    console.log(label);
    v.words.forEach((w, i) => console.log(`  ${String(i + 1).padStart(2)}  ${w.text}  ${w.n ? `H${w.n}${w.suffix}` : '-'}  ${w.morph}  lemma ${w.lemma}${w.n ? `  https://biblehub.com/hebrew/${w.n}.htm` : ''}${w.note ? `  (${w.note})` : ''}`));
    console.log();
  }
}
