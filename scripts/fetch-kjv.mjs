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
  // Isaiah: where the Gospel Library has “Lord” (adonai) and the source LORD, or the reverse, and two commas
  // (found by scripts/check-kjv.mjs, which the first import of Isaiah did not have).
  [/Therefore saith the LORD, the LORD of hosts/g, 'Therefore saith the Lord, the LORD of hosts'], // Isa. 1:24
  [/the whole stay of water\.$/g, 'the whole stay of water,'], // Isa. 3:1
  [/Therefore the LORD will smite with a scab/g, 'Therefore the Lord will smite with a scab'], // Isa. 3:17
  [/I saw also the LORD sitting upon a throne/g, 'I saw also the Lord sitting upon a throne'], // Isa. 6:1
  [/Therefore the LORD shall have no joy in their young men/g, 'Therefore the Lord shall have no joy in their young men'], // Isa. 9:17
  [/For thus hath the LORD said unto me, (Go, set a watchman|Within a year)/g, 'For thus hath the Lord said unto me, $1'], // Isa. 21:6, 16
  [/^O Lord, thou art my God; I will exalt thee/g, 'O LORD, thou art my God; I will exalt thee'], // Isa. 25:1
  [/^O LORD, by these things men live/g, 'O Lord, by these things men live'], // Isa. 38:16
  [/The Lord GOD, which gathereth the outcasts/g, 'The Lord GOD which gathereth the outcasts'], // Isa. 56:8
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
  // Malachi: where the Gospel Library has “Lord” (adonai) and the source LORD (found by scripts/check-kjv.mjs).
  [/sacrificeth unto the LORD a corrupt thing/g, 'sacrificeth unto the Lord a corrupt thing'], // Mal. 1:14
  [/and the LORD, whom ye seek, shall suddenly come/g, 'and the Lord, whom ye seek, shall suddenly come'], // Mal. 3:1
  // Lamentations: where the Gospel Library has “Lord” (adonai) and the source LORD, and the source’s “I AM” (found by scripts/check-kjv.mjs).
  [/the LORD hath delivered me into their hands, from whom/g, 'the Lord hath delivered me into their hands, from whom'], // Lam. 1:14
  [/The LORD hath trodden under foot all my mighty men/g, 'The Lord hath trodden under foot all my mighty men'], // Lam. 1:15
  [/the LORD hath trodden the virgin, the daughter of Judah/g, 'the Lord hath trodden the virgin, the daughter of Judah'], // Lam. 1:15
  [/How hath the LORD covered the daughter of Zion/g, 'How hath the Lord covered the daughter of Zion'], // Lam. 2:1
  [/The LORD hath swallowed up all the habitations of Jacob/g, 'The Lord hath swallowed up all the habitations of Jacob'], // Lam. 2:2
  [/The LORD was as an enemy/g, 'The Lord was as an enemy'], // Lam. 2:5
  [/The LORD hath cast off his altar/g, 'The Lord hath cast off his altar'], // Lam. 2:7
  [/Their heart cried unto the LORD, O wall/g, 'Their heart cried unto the Lord, O wall'], // Lam. 2:18
  [/before the face of the LORD: lift up thy hands/g, 'before the face of the Lord: lift up thy hands'], // Lam. 2:19
  [/I AM the man that hath seen affliction/g, 'I am the man that hath seen affliction'], // Lam. 3:1
  [/For the LORD will not cast off for ever/g, 'For the Lord will not cast off for ever'], // Lam. 3:31
  [/the LORD approveth not/g, 'the Lord approveth not'], // Lam. 3:36
  [/O LORD, thou hast pleaded the causes of my soul/g, 'O Lord, thou hast pleaded the causes of my soul'], // Lam. 3:58
  // Ezekiel: spellings, hyphens, one colon, and “Lord” (adonai) where the source has LORD (found by scripts/check-kjv.mjs).
  [/Telabib/g, 'Tel-abib'], // Ezek. 3:15
  [/a stumbling-block before him/g, 'a stumblingblock before him'], // Ezek. 3:20
  [/pourtray/g, 'portray'], // Ezek. 4:1; 8:10; 23:14
  [/be enquired of/g, 'be inquired of'], // Ezek. 14:3; 20:3, 31; 36:37
  [/saith the LORD GOD;\)/g, 'saith the Lord GOD;)'], // Ezek. 16:23
  [/saith the LORD GOD, seeing thou doest/g, 'saith the Lord GOD, seeing thou doest'], // Ezek. 16:30
  [/The way of the LORD is not equal/g, 'The way of the Lord is not equal'], // Ezek. 18:25, 29
  [/a couching place for flocks/g, 'a couchingplace for flocks'], // Ezek. 25:5
  [/Bethjeshimoth, Baalmeon/g, 'Beth-jeshimoth, Baal-meon'], // Ezek. 25:9
  [/Pibeseth/g, 'Pi-beseth'], // Ezek. 30:17
  [/Hamongog/g, 'Hamon-gog'], // Ezek. 39:11, 15
  [/and the trespass offering: and every dedicated thing/g, 'and the trespass offering; and every dedicated thing'], // Ezek. 44:29
  [/from Engedi even unto Eneglaim/g, 'from En-gedi even unto En-eglaim'], // Ezek. 47:10
  [/the marishes thereof/g, 'the marshes thereof'], // Ezek. 47:11
  [/Hazarhatticon/g, 'Hazar-hatticon'], // Ezek. 47:16
  [/Hazarenan, the border/g, 'Hazar-enan, the border'], // Ezek. 47:17; 48:1
  // Daniel: a hyphen, spellings, a comma, a lower-case “god”, and “Lord” (adonai) where the source has LORD (found by scripts/check-kjv.mjs).
  [/Abednego/g, 'Abed-nego'], // Dan. 1:7; 2:49; 3:12–30
  [/the king enquired of them/g, 'the king inquired of them'], // Dan. 1:20
  [/according to the name of my God, and in whom/g, 'according to the name of my god, and in whom'], // Dan. 4:8
  [/Now the queen by reason of the words of the king and his lords came into/g, 'Now the queen, by reason of the words of the king and his lords, came into'], // Dan. 5:10
  [/and stedfast for ever/g, 'and steadfast for ever'], // Dan. 6:26
  [/O LORD, righteousness belongeth unto thee/g, 'O Lord, righteousness belongeth unto thee'], // Dan. 9:7
  [/O LORD, according to all thy righteousness/g, 'O Lord, according to all thy righteousness'], // Dan. 9:16
  // Hosea: hyphens in names, and “Lord” (adonai) where the source has LORD (found by scripts/check-kjv.mjs).
  [/Loruhamah/g, 'Lo-ruhamah'], // Hosea 1:6, 8
  [/Loammi/g, 'Lo-ammi'], // Hosea 1:9
  [/Bethaven/g, 'Beth-aven'], // Hosea 4:15; 5:8; 10:5
  [/Baalpeor, and separated/g, 'Baal-peor, and separated'], // Hosea 9:10
  [/Betharbel/g, 'Beth-arbel'], // Hosea 10:14
  [/shall his LORD return unto him/g, 'shall his Lord return unto him'], // Hosea 12:14
  // Joel: a comma and an old spelling (found by scripts/check-kjv.mjs).
  [/and cry unto the LORD\.$/g, 'and cry unto the LORD,'], // Joel 1:14
  [/the vats shall overflow with wine and oil/g, 'the fats shall overflow with wine and oil'], // Joel 2:24
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
