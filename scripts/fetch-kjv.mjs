// One-time import of the public-domain King James Version text.
// Source: https://github.com/aruljohn/Bible-kjv (KJV 1769, public domain).
// Usage: node scripts/fetch-kjv.mjs <Name> [slug]
//   Name is the source file's name, with no spaces (Isaiah, Jeremiah, 1Samuel, SongofSolomon).
//   slug is the output name and matches content/<slug>/; it defaults to the lowercase Name.
import { writeFile, mkdir } from 'node:fs/promises';

const book = process.argv[2] ?? 'Isaiah';
const slug = process.argv[3] ?? book.toLowerCase();
const url = `https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/${book}.json`;

// Spellings in the Latter-day Saint edition of the KJV (checked word-for-word against the
// Gospel Library) that differ from the source file.
const LDS_SPELLINGS = [
  [/Shearjashub/g, 'Shear-jashub'],
  [/Mahershalalhashbaz/g, 'Maher-shalal-hash-baz'],
  [/\bvail(s?)\b/g, 'veil$1'],
  [/\bday time\b/g, 'daytime'],
  [/standard-bearer/g, 'standardbearer'],
  [/Beerelim/g, 'Beer-elim'],
  [/Kirhareseth/g, 'Kir-hareseth'],
  [/Kirharesh\b/g, 'Kir-haresh'],
  [/\bintreated\b/g, 'entreated'],
  [/\benquire\b/g, 'inquire'],
  [/Esarhaddon/g, 'Esar-haddon'],
  [/\bplaister\b/g, 'plaster'],
  [/Merodachbaladan/g, 'Merodach-baladan'],
  [/\bmorter\b/g, 'mortar'],
  [/\brereward\b/g, 'rearward'],
  [/\bnoon day\b/g, 'noonday'],
  [/Hephzibah/g, 'Hephzi-bah'],
  // Jeremiah
  [/\bEnquire\b/g, 'Inquire'],
  [/Bethhaccerem/g, 'Beth-haccerem'],
  [/Magormissabib/g, 'Magor-missabib'],
  [/\bcieled\b/g, 'ceiled'],
  [/Kirjathjearim/g, 'Kirjath-jearim'],
  [/Ebedmelech/g, 'Ebed-melech'],
  [/Nergalsharezer/g, 'Nergal-sharezer'],
  [/Samgarnebo/g, 'Samgar-nebo'],
  [/Rabsaris/g, 'Rab-saris'],
  [/Rabmag/g, 'Rab-mag'],
  [/Nebuzaradan/g, 'Nebuzar-adan'],
  [/Bethlehem/g, 'Beth-lehem'], // Old Testament spelling; check before importing a New Testament book
  [/Bethshemesh/g, 'Beth-shemesh'],
  [/Pharaohhophra/g, 'Pharaoh-hophra'],
  [/Pharaohnecho/g, 'Pharaoh-necho'],
  [/\bBethel\b/g, 'Beth-el'],
  [/Bethdiblathaim/g, 'Beth-diblathaim'],
  [/Bethgamul/g, 'Beth-gamul'],
  [/Bethmeon/g, 'Beth-meon'],
  [/Kirheres\b/g, 'Kir-heres'],
  [/Benhadad/g, 'Ben-hadad'],
  [/\bbasons\b/g, 'basins'],
  [/Evilmerodach/g, 'Evil-merodach'],
  [/commanded them to do: but they did them not/g, 'commanded them to do; but they did them not'], // Jer. 11:8
  [/time of Jacob’s trouble, but he shall/g, 'time of Jacob’s trouble; but he shall'], // Jer. 30:7
  [/ye shall not prosper\.$/g, 'ye shall not prosper?'], // Jer. 32:5
  [/whom he had set at liberty at their pleasure/g, 'whom ye had set at liberty at their pleasure'], // Jer. 34:16
  [/I will dwell at Mizpah, to serve/g, 'I will dwell at Mizpah to serve'], // Jer. 40:10
  [/unto thee, O Baruch:$/g, 'unto thee, O Baruch;'], // Jer. 45:2
  // Genesis
  [/Padanaram/g, 'Padan-aram'],
  [/Beersheba/g, 'Beer-sheba'], // Old Testament spelling
  [/Tubalcain/g, 'Tubal-cain'],
  [/\basswaged\b/g, 'assuaged'],
  [/\bpluckt\b/g, 'plucked'],
  [/Sabtechah: and the sons of Raamah/g, 'Sabtecha: and the sons of Raamah'], // Gen. 10:7
  [/\bfirst born\b/g, 'firstborn'],
  [/burn them thoroughly/g, 'burn them throughly'], // Gen. 11:3
  [/Elparan/g, 'El-paran'],
  [/Enmishpat/g, 'En-mishpat'],
  [/Hazezontamar/g, 'Hazezon-tamar'],
  [/Beerlahairoi/g, 'Beer-lahai-roi'],
  [/\bLahairoi/g, 'Lahai-roi'],
  [/I cannot do anything till/g, 'I cannot do any thing till'], // Gen. 19:22
  [/Benammi/g, 'Ben-ammi'],
  [/a bow shot/g, 'a bowshot'],
  [/Jehovahjireh/g, 'Jehovah-jireh'],
  [/Kirjatharba/g, 'Kirjath-arba'],
  [/\bintreat\b/g, 'entreat'],
  [/and Abidah, and Eldaah/g, 'and Abida, and Eldaah'], // Gen. 25:4
  [/I will again feed and keep thy flock\.$/g, 'I will again feed and keep thy flock:'], // Gen. 30:31
  [/Jegarsahadutha/g, 'Jegar-sahadutha'],
  [/which I have cast betwixt me and thee:$/g, 'which I have cast betwixt me and thee;'], // Gen. 31:51
  [/EleloheIsrael/g, 'El-elohe-Israel'],
  [/Elbethel/g, 'El-beth-el'],
  [/Allonbachuth/g, 'Allon-bachuth'],
  [/Benoni/g, 'Ben-oni'],
  [/Baalhanan/g, 'Baal-hanan'],
  [/Zaphnathpaaneah/g, 'Zaphnath-paaneah'],
  [/Potipherah/g, 'Poti-pherah'],
  [/and Pharez, and Zarah: but Er/g, 'and Pharez, and Zerah: but Er'], // Gen. 46:12
  [/Abelmizraim/g, 'Abel-mizraim'],
  // The source file prints every “Lord” in Genesis as LORD. The Gospel Library keeps LORD (small capitals)
  // for the divine name and “Lord” for adonai; these are the verses where they differ.
  [/And God saw that the wickedness/g, 'And GOD saw that the wickedness'], // Gen. 6:5
  [/LORD God, what wilt thou give me/g, 'Lord GOD, what wilt thou give me'], // Gen. 15:2
  [/LORD God, whereby shall I know/g, 'Lord GOD, whereby shall I know'], // Gen. 15:8
  [/My LORD, if now I have found favour/g, 'My Lord, if now I have found favour'], // Gen. 18:3
  [/to speak unto the LORD, which am but dust/g, 'to speak unto the Lord, which am but dust'], // Gen. 18:27
  [/Oh let not the LORD be angry/g, 'Oh let not the Lord be angry'], // Gen. 18:30, 32
  [/to speak unto the LORD: Peradventure/g, 'to speak unto the Lord: Peradventure'], // Gen. 18:31
  [/Oh, not so, my LORD/g, 'Oh, not so, my Lord'], // Gen. 19:18
  [/he said, LORD, wilt thou slay/g, 'he said, Lord, wilt thou slay'], // Gen. 20:4
  [/\s+([?!;:,.])/g, '$1'], // stray spaces before punctuation in the source
];

const res = await fetch(url);
if (!res.ok) throw new Error(`${res.status} fetching ${url}`);
const src = await res.json();

const chapters = src.chapters.map((c) =>
  c.verses.map((v) => LDS_SPELLINGS.reduce((t, [re, s]) => t.replace(re, s), v.text.trim())),
);

await mkdir('data/kjv', { recursive: true });
const out = `data/kjv/${slug}.json`;
await writeFile(out, JSON.stringify({ book, source: url, chapters }, null, 1) + '\n');
console.log(`Wrote ${out}: ${chapters.length} chapters, ${chapters.flat().length} verses`);
