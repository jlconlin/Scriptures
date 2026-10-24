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
  // Amos: a place name, and “Lord” (adonai) where the source has LORD (found by scripts/check-kjv.mjs).
  [/palaces of Kirioth/g, 'palaces of Kerioth'], // Amos 2:2
  [/the LORD, saith thus;/g, 'the Lord, saith thus;'], // Amos 5:16
  [/the LORD stood upon a wall/g, 'the Lord stood upon a wall'], // Amos 7:7
  [/Then said the LORD, Behold, I will set a plumbline/g, 'Then said the Lord, Behold, I will set a plumbline'], // Amos 7:8
  [/I saw the LORD standing upon the altar/g, 'I saw the Lord standing upon the altar'], // Amos 9:1
  // Joel: a comma and an old spelling (found by scripts/check-kjv.mjs).
  [/and cry unto the LORD\.$/g, 'and cry unto the LORD,'], // Joel 1:14
  [/the vats shall overflow with wine and oil/g, 'the fats shall overflow with wine and oil'], // Joel 2:24
  // Micah: hyphens in names, and “Lord” (adonai) where the source has LORD (found by scripts/check-kjv.mjs).
  [/the LORD from his holy temple/g, 'the Lord from his holy temple'], // Micah 1:2
  [/Bethezel/g, 'Beth-ezel'], // Micah 1:11
  [/Moreshethgath/g, 'Moresheth-gath'], // Micah 1:14
  // Psalms: the divine name at the head of a psalm and elsewhere, the source's capitals on a
  // psalm's first words, punctuation and old spellings (found by scripts/check-kjv.mjs).
  [/the LORD shall have them in derision/g, 'the Lord shall have them in derision'], // Ps. 2:4
  [/^Lord, how are they increased/g, 'LORD, how are they increased'], // Ps. 3:1
  [/^O LORD, our Lord, how excellent is thy name in all the earth! who/g, 'O LORD our Lord, how excellent is thy name in all the earth! who'], // Ps. 8:1
  [/^Lord, who shall abide/g, 'LORD, who shall abide'], // Ps. 15:1
  [/thyself also in the LORD: and he/g, 'thyself also in the LORD; and he'], // Ps. 37:4
  [/^The LORD shall laugh at him/g, 'The Lord shall laugh at him'], // Ps. 37:13
  [/what it is: that I may know/g, 'what it is; that I may know'], // Ps. 39:4
  [/and casteth my words behind thee/g, 'and castest my words behind thee'], // Ps. 50:17
  [/^MAKE HASTE, O GOD, TO DELIVER ME; MAKE HASTE TO HELP ME, O LORD\.$/g, 'Make haste, O God, to deliver me; make haste to help me, O LORD.'], // Ps. 70:1
  [/old and greyheaded/g, 'old and grayheaded'], // Ps. 71:18
  [/not stedfast with God/g, 'not steadfast with God'], // Ps. 78:8
  [/and enquired early after God/g, 'and inquired early after God'], // Ps. 78:34
  [/were they stedfast in his covenant/g, 'were they steadfast in his covenant'], // Ps. 78:37
  [/^Then the LORD awaked as one out of sleep/g, 'Then the Lord awaked as one out of sleep'], // Ps. 78:65
  [/^O GOD, the heathen/g, 'O God, the heathen'], // Ps. 79:1
  [/perished at Endor/g, 'perished at En-dor'], // Ps. 83:10
  [/^Lord, thou hast been favourable/g, 'LORD, thou hast been favourable'], // Ps. 85:1
  [/gracious, long suffering, and plenteous/g, 'gracious, longsuffering, and plenteous'], // Ps. 86:15
  [/^Lord, thou hast been our dwelling place/g, 'LORD, thou hast been our dwelling place'], // Ps. 90:1
  [/^IT IS A GOOD THING TO GIVE THANKS UNTO THE LORD, AND TO SING PRAISES UNTO THY NAME, O MOST HIGH:$/g, 'It is a good thing to give thanks unto the LORD, and to sing praises unto thy name, O most High:'], // Ps. 92:1
  [/^O Lord God, to whom vengeance belongeth/g, 'O LORD God, to whom vengeance belongeth'], // Ps. 94:1
  [/unto Baalpeor, and ate/g, 'unto Baal-peor, and ate'], // Ps. 106:28
  [/at their wit.s end/g, "at their wits' end"], // Ps. 107:27
  [/^O Praise the LORD, all ye nations/g, 'O praise the LORD, all ye nations'], // Ps. 117:1
  [/^Lord, my heart is not haughty/g, 'LORD, my heart is not haughty'], // Ps. 131:1
  [/^Lord, remember David/g, 'LORD, remember David'], // Ps. 132:1
  [/^Lord, I cry unto thee/g, 'LORD, I cry unto thee'], // Ps. 141:1
  [/snow, and vapours; stormy wind/g, 'snow, and vapour; stormy wind'], // Ps. 148:8
  [/a two-edged sword in their hand/g, 'a twoedged sword in their hand'], // Ps. 149:6
  // Exodus: “Lord” (adonai) where the source has LORD and the reverse, hyphens in names, old spellings
  // and a dash (found by scripts/check-kjv.mjs).
  [/O my LORD, I am not eloquent/g, 'O my Lord, I am not eloquent'], // Ex. 4:10
  [/O my LORD, send, I pray thee/g, 'O my Lord, send, I pray thee'], // Ex. 4:13
  [/and said, LORD, wherefore hast thou so evil entreated/g, 'and said, Lord, wherefore hast thou so evil entreated'], // Ex. 5:22
  [/\bIntreat the LORD/g, 'Entreat the LORD'], // Ex. 8:8; 9:28
  [/in the bason/g, 'in the basin'], // Ex. 12:22
  [/Pihahiroth/g, 'Pi-hahiroth'], // Ex. 14:2, 9
  [/Baalzephon/g, 'Baal-zephon'], // Ex. 14:2, 9
  [/the Sanctuary, O LORD, which thy hands/g, 'the Sanctuary, O Lord, which thy hands'], // Ex. 15:17
  [/Jehovahnissi/g, 'Jehovah-nissi'], // Ex. 17:15
  [/with an aul/g, 'with an awl'], // Ex. 21:6
  [/appear before the LORD God\.$/g, 'appear before the Lord GOD.'], // Ex. 23:17
  [/Consecrate yourselves today to the LORD/g, 'Consecrate yourselves to day to the LORD'], // Ex. 32:29
  [/forgive their sin--; and if not/g, 'forgive their sin—; and if not'], // Ex. 32:32
  [/and the Lord talked with Moses/g, 'and the LORD talked with Moses'], // Ex. 33:9
  [/in thy sight, O LORD, let my LORD, I pray thee/g, 'in thy sight, O Lord, let my Lord, I pray thee'], // Ex. 34:9
  [/all your menchildren appear before the LORD God, the God of Israel/g, 'all your men children appear before the Lord GOD, the God of Israel'], // Ex. 34:23
  // Leviticus: old spellings, “LORD” where the source has “Lord”, and a missing space (found by scripts/check-kjv.mjs).
  [/\bplaistered\b/g, 'plastered'], // Lev. 14:42, 43, 48
  [/nor honor the person/g, 'nor honour the person'], // Lev. 19:15
  [/blasphemed the name of the Lord, and cursed/g, 'blasphemed the name of the LORD, and cursed'], // Lev. 24:11
  [/blasphemeth the name of the Lord, shall be/g, 'blasphemeth the name of the LORD, shall be'], // Lev. 24:16
  [/\bjubile\b/g, 'jubilee'], // Lev. 25; 27
  [/thy God:for I am/g, 'thy God: for I am'], // Lev. 25:17
  // Deuteronomy: hyphens in names, spellings, punctuation, and capitals (found by scripts/check-kjv.mjs).
  [/\bKadeshbarnea\b/g, 'Kadesh-barnea'], // Deut. 1:2, 19; 2:14; 9:23
  [/\bEziongaber\b/g, 'Ezion-gaber'], // Deut. 2:8
  [/\bBashanhavothjair\b/g, 'Bashan-havoth-jair'], // Deut. 3:14
  [/\bAshdothpisgah\b/g, 'Ashdoth-pisgah'], // Deut. 3:17
  [/\bBethpeor\b/g, 'Beth-peor'], // Deut. 3:29; 4:46; 34:6
  [/\bBaalpeor\b/g, 'Baal-peor'], // Deut. 4:3
  [/\bKibrothhattaavah\b/g, 'Kibroth-hattaavah'], // Deut. 9:22
  [/\bMeribahKadesh\b/g, 'Meribah-Kadesh'], // Deut. 32:51
  [/of anything that dieth/g, 'of any thing that dieth'], // Deut. 14:21
  [/take an aul, and thrust/g, 'take an awl, and thrust'], // Deut. 15:17
  [/and enquired diligently, and,/g, 'and inquired diligently, and,'], // Deut. 17:4
  [/or a witch\./g, 'or a witch,'], // Deut. 18:10
  [/no might in thine hand:/g, 'no might in thine hand.'], // Deut. 28:32
  [/When the Most High divided/g, 'When the most High divided'], // Deut. 32:8
  [/and the Lord shall cover him/g, 'and the LORD shall cover him'], // Deut. 33:12
  // Numbers: hyphens in names, old spellings, and capitals (found by scripts/check-kjv.mjs).
  [/the mixt multitude/g, 'the mixed multitude'], // Num. 11:4
  [/by daytime in a pillar/g, 'by day time in a pillar'], // Num. 14:14 (after the general rule above)
  [/let the power of my LORD be great/g, 'let the power of my Lord be great'], // Num. 14:17
  [/valley\.\) Tomorrow turn/g, 'valley.) To morrow turn'], // Num. 14:25
  [/for everything of the altar/g, 'for every thing of the altar'], // Num. 18:7
  [/trespass offering of theirs which they/g, 'trespass offering of theirs, which they'], // Num. 18:9
  [/without doing anything else/g, 'without doing any thing else'], // Num. 20:19
  [/\bIjeabarim\b/g, 'Ije-abarim'], // Num. 21:11; 33:44
  [/\bKirjathhuzoth\b/g, 'Kirjath-huzoth'], // Num. 22:39
  [/a tribute unto the Lord of the men of war/g, 'a tribute unto the LORD of the men of war'], // Num. 31:28
  [/\bBethnimrah\b/g, 'Beth-nimrah'], // Num. 32:36
  [/\bBethharan\b/g, 'Beth-haran'], // Num. 32:36
  [/\bBaalmeon\b/g, 'Baal-meon'], // Num. 32:38
  [/\bHavothjair\b/g, 'Havoth-jair'], // Num. 32:41
  [/\bRimmonparez\b/g, 'Rimmon-parez'], // Num. 33:19–20
  [/\bBenejaakan\b/g, 'Bene-jaakan'], // Num. 33:31–32
  [/\bHorhagidgad\b/g, 'Hor-hagidgad'], // Num. 33:32–33
  [/\bDibongad\b/g, 'Dibon-gad'], // Num. 33:45–46
  [/\bAlmondiblathaim\b/g, 'Almon-diblathaim'], // Num. 33:46–47
  [/\bBethjesimoth\b/g, 'Beth-jesimoth'], // Num. 33:49
  [/\bHazaraddar\b/g, 'Hazar-addar'], // Num. 34:4
  [/\bHazarenan\b/g, 'Hazar-enan'], // Num. 34:9–10
  [/\bAbelshittim\b/g, 'Abel-shittim'], // Num. 33:49
  // Zephaniah
  [/and the stumbling blocks with the wicked:/g, 'and the stumblingblocks with the wicked;'], // Zeph. 1:3
  [/nor enquired for him/g, 'nor inquired for him'], // Zeph. 1:6
  [/at the noonday, and Ekron/g, 'at the noon day, and Ekron'], // Zeph. 2:4 (after the general rule above)
  // Nahum
  [/spoileth, and fleeth away/g, 'spoileth, and flieth away'], // Nahum 3:16
  // Haggai
  [/for much, and lo, it came to little/g, 'for much, and, lo, it came to little'], // Hag. 1:9
  // Zechariah: “Lord” (adonai) where the source has LORD, and a hyphen in a name
  [/stand by the LORD of the whole earth/g, 'stand by the Lord of the whole earth'], // Zech. 4:14
  [/standing before the LORD of all the earth/g, 'standing before the Lord of all the earth'], // Zech. 6:5
  [/\bRegemmelech\b/g, 'Regem-melech'], // Zech. 7:2
  [/Behold, the LORD will cast her out/g, 'Behold, the Lord will cast her out'], // Zech. 9:4
  [/lightning: and the LORD God shall blow/g, 'lightning: and the Lord GOD shall blow'], // Zech. 9:14
  // Joshua: “Lord” (adonai) where the source has LORD, a few readings and marks of punctuation, and the
  // hyphenated place names (found by scripts/check-kjv.mjs)
  [/covenant of the LORD of all the earth/g, 'covenant of the Lord of all the earth'], // Josh. 3:11
  [/ark of the LORD, the LORD of all the earth/g, 'ark of the LORD, the Lord of all the earth'], // Josh. 3:13
  [/and take you up every man of you a stone/g, 'and take ye up every man of you a stone'], // Josh. 4:5
  [/until everything was finished that the LORD commanded Joshua/g, 'until every thing was finished that the LORD commanded Joshua'], // Josh. 4:10
  [/view the country\.\s+And the men went up/g, 'view the country. And the men went up'], // Josh. 7:2
  [/Alas, O LORD God, wherefore hast thou/g, 'Alas, O Lord GOD, wherefore hast thou'], // Josh. 7:7
  [/^O LORD, what shall I say, when Israel/g, 'O Lord, what shall I say, when Israel'], // Josh. 7:8
  [/\bAdonizedec\b/g, 'Adoni-zedek'], // Josh. 10:1, 3
  [/beside the Sidonians unto Aphek/g, 'beside the Sidonians, unto Aphek'], // Josh. 13:4
  [/^And Jahaza, and Kedemoth/g, 'And Jahazah, and Kedemoth'], // Josh. 13:18
  [/put the Canaanites to tribute, but did not utterly/g, 'put the Canaanites to tribute; but did not utterly'], // Josh. 17:13
  [/Beer-sheba, and Sheba, and Moladah/g, 'Beer-sheba, or Sheba, and Moladah'], // Josh. 19:2
  [/^And Haphraim, and Shihon,/g, 'And Hapharaim, and Shion,'], // Josh. 19:19
  [/and to Gezer; and the goings out thereof/g, 'and to Gezer: and the goings out thereof'], // Josh. 16:3
  [/\bAtarothadar\b/g, 'Ataroth-adar'], // Josh. 18:13
  [/\bAtarothaddar\b/g, 'Ataroth-addar'], // Josh. 16:5
  [/\bAznothtabor\b/g, 'Aznoth-tabor'], // Josh. 19:34
  [/\bBaalathbeer\b/g, 'Baalath-beer'], // Josh. 19:8
  [/\bBaalgad\b/g, 'Baal-gad'], // Josh. 11:17, 12:7, 13:5
  [/\bBamothbaal\b/g, 'Bamoth-baal'], // Josh. 13:17
  [/\bBeeshterah\b/g, 'Beesh-terah'], // Josh. 21:27
  [/\bBeneberak\b/g, 'Bene-berak'], // Josh. 19:45
  [/\bBethanoth\b/g, 'Beth-anoth'], // Josh. 15:59
  [/\bBetharabah\b/g, 'Beth-arabah'], // Josh. 15:61, 18:22
  [/\bBetharam\b/g, 'Beth-aram'], // Josh. 13:27
  [/\bBethbaalmeon\b/g, 'Beth-baal-meon'], // Josh. 13:17
  [/\bBethdagon\b/g, 'Beth-dagon'], // Josh. 15:41, 19:27
  [/\bBethhogla\b/g, 'Beth-hogla'], // Josh. 15:6
  [/\bBethhoglah\b/g, 'Beth-hoglah'], // Josh. 18:19, 18:21
  [/\bBethhoron\b/g, 'Beth-horon'], // Josh. 10:10, 10:11, 16:3, 16:5, 18:14, 21:22
  [/\bBethjeshimoth\b/g, 'Beth-jeshimoth'], // Josh. 12:3, 13:20
  [/\bBethlebaoth\b/g, 'Beth-lebaoth'], // Josh. 19:6
  [/\bBethmarcaboth\b/g, 'Beth-marcaboth'], // Josh. 19:5
  [/\bBethshean\b/g, 'Beth-shean'], // Josh. 17:11, 17:16
  [/\bBethtappuah\b/g, 'Beth-tappuah'], // Josh. 15:53
  [/\bBethzur\b/g, 'Beth-zur'], // Josh. 15:58
  [/\bChepharhaammonai\b/g, 'Chephar-haammonai'], // Josh. 18:24
  [/\bChislothtabor\b/g, 'Chisloth-tabor'], // Josh. 19:12
  [/\bEngannim\b/g, 'En-gannim'], // Josh. 15:34, 19:21, 21:29
  [/\bEngedi\b/g, 'En-gedi'], // Josh. 15:62
  [/\bEnhaddah\b/g, 'En-haddah'], // Josh. 19:21
  [/\bEnhazor\b/g, 'En-hazor'], // Josh. 19:37
  [/\bEnrogel\b/g, 'En-rogel'], // Josh. 18:16
  [/\bEnshemesh\b/g, 'En-shemesh'], // Josh. 15:7, 18:17
  [/\bEntappuah\b/g, 'En-tappuah'], // Josh. 17:7
  [/\bGathrimmon\b/g, 'Gath-rimmon'], // Josh. 19:45, 21:24, 21:25
  [/\bGittahhepher\b/g, 'Gittah-hepher'], // Josh. 19:13
  [/\bHammothdor\b/g, 'Hammoth-dor'], // Josh. 21:32
  [/\bHazargaddah\b/g, 'Hazar-gaddah'], // Josh. 15:27
  [/\bHazarshual\b/g, 'Hazar-shual'], // Josh. 15:28, 19:3
  [/\bHazarsusah\b/g, 'Hazar-susah'], // Josh. 19:5
  [/\bIrshemesh\b/g, 'Ir-shemesh'], // Josh. 19:41
  [/\bIttahkazin\b/g, 'Ittah-kazin'], // Josh. 19:13
  [/\bJiphthahel\b/g, 'Jiphthah-el'], // Josh. 19:14
  [/\bKirjathbaal\b/g, 'Kirjath-baal'], // Josh. 15:60
  [/\bKirjathsannah\b/g, 'Kirjath-sannah'], // Josh. 15:49
  [/\bKirjathsepher\b/g, 'Kirjath-sepher'], // Josh. 15:15, 15:16
  [/\bMaalehacrabbim\b/g, 'Maaleh-acrabbim'], // Josh. 15:3
  [/\bMejarkon\b/g, 'Me-jarkon'], // Josh. 19:46
  [/\bMigdalel\b/g, 'Migdal-el'], // Josh. 19:38
  [/\bMigdalgad\b/g, 'Migdal-gad'], // Josh. 15:37
  [/\bMisrephothmaim\b/g, 'Misrephoth-maim'], // Josh. 11:8, 13:6
  [/\bRamathmizpeh\b/g, 'Ramath-mizpeh'], // Josh. 13:26
  [/\bShihorlibnath\b/g, 'Shihor-libnath'], // Josh. 19:26
  [/\bShimronmeron\b/g, 'Shimron-meron'], // Josh. 12:20
  [/\bTaanathshiloh\b/g, 'Taanath-shiloh'], // Josh. 16:6
  [/\bTimnathserah\b/g, 'Timnath-serah'], // Josh. 19:50, 24:30
  [/\bZarethshahar\b/g, 'Zareth-shahar'], // Josh. 13:19
  [/\bBethanath\b/g, 'Beth-anath'], // Josh. 19:38
  [/\bBethemek\b/g, 'Beth-emek'], // Josh. 19:27
  [/\bBethpalet\b/g, 'Beth-palet'], // Josh. 15:27
  [/\bBethpazzez\b/g, 'Beth-pazzez'], // Josh. 19:21
  [/\bEndor\b/g, 'En-dor'], // Josh. 17:11
  [/\bRemmonmethoar\b/g, 'Remmon-methoar'], // Josh. 19:13
  [/sharp as a two-edged sword/g, 'sharp as a twoedged sword'], // Prov. 5:4
  [/riches shall fall; but the righteous/g, 'riches shall fall: but the righteous'], // Prov. 11:28
  [/righteousness is life: and in the pathway/g, 'righteousness is life; and in the pathway'], // Prov. 12:28
  [/The poor useth intreaties/g, 'The poor useth entreaties'], // Prov. 18:23
  [/and after vows to make enquiry/g, 'and after vows to make inquiry'], // Prov. 20:25
  [/old men is the grey head/g, 'old men is the gray head'], // Prov. 20:29
  [/^A GOOD name is rather/g, 'A good name is rather'], // Prov. 22:1
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
