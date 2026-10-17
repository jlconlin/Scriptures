# Deuteronomy brief

Book-level decisions for Deuteronomy. The site-wide standard is in `STANDARDS.md`; this file records what is particular to Deuteronomy. Writers, checkers, and reviewers read both before starting a chapter. Jeremiah's brief (`content/jeremiah/BRIEF.md`) is the model, and its section “What a chapter is for” holds here. **Exodus's and Leviticus's briefs are the nearest neighbors**: Deuteronomy restates the Ten Commandments, the feasts, the clean and unclean animals, the blessings and cursings and much of Exodus 21–23, and those are already explained on the site. Read the table “Explained once: where” before writing.

**Status (2026-10-15):** drafted from the sources named below, each read in the session with the research scripts on 2026-10-15. **The author chose this book** (2026-10-15: “Let's do Deuteronomy tonight while I'm sleeping”) **and has not read this brief.** Where a section says “Proposed,” that is the approach the chapters follow; it is the drafter's decision, not a fact from a source, and the author can overturn it.

Related files: `OPEN-QUESTIONS.md` at the top of the repository; `THEME-CANDIDATES.md` and `UNANSWERED.md` in this folder.

## State of the book

`node scripts/status.mjs deuteronomy` prints what the repository shows; the history is `git log -- content/deuteronomy`. What a script can't see:

- **The book is live** (2026-10-16; author: “Let's go live with Deuteronomy”), with all 34 chapters written, reviewed and read by Codex, and the author has read almost none of it. Chapters 13–24 were reviewed by Sonnet 5.5 and chapters 13–34 had Codex's findings applied by Sonnet 5.5, a trial the author approved (2026-10-15); its harm to the language pass was repaired by Opus on 2026-10-16 (`AUTHORING.md`, “Why these models”), and the rest is Opus's. Every chapter's Witness of Christ applies the chapter to the reader (2026-10-16). Five theme pages, chosen by the author (`THEME-CANDIDATES.md`), are in `themes/`; no book guides (the volume guides cover the background). The illustration is approved (candidate 7: water from the rock, the fork, the barren slope).
- **The text is imported and checked** (“The text,” below). The Church's footnotes for every chapter are saved in `.cache/batch/deuteronomy/fn1.txt` to `fn34.txt`; read them instead of running `footnotes.mjs` again. Scripture Central's KnoWhys for each chapter are saved in `.cache/batch/deuteronomy/reports/knowhys/<n>.txt`.
- **Numbers is not on the site** (“Numbers, told from Deuteronomy,” below).

## What the author has decided

Nothing for Deuteronomy in particular beyond choosing it. The standing rules are in `STANDARDS.md` §1 and `AUTHORING.md`. How three land on this book:

- **Newest trumps oldest.** *Scripture Helps: Old Testament* (2025) has one chapter, “Deuteronomy 6–8; 15; 18; 29–30; 34” (`scripture-helps-deut`): what the book is [4–10], the Shema and its customs [11–13], “tempt” at 6:16 [15–16], the destruction of the Canaanites [17–19], the “special people” [20–23], the year of release and slavery [24–27], the prophet like Moses [28–30], the covenant renewed [32–33], the gathering [34–37], the circumcised heart [38–39], and the end of Moses' life [40–42]. Its appendix “Violence and Destruction in the Old Testament” (`scripture-helps-violence`) is the Church's newest word on the conquest. The Student Manual (two chapters, 1980) is older; where they differ, follow *Scripture Helps*.
- **Don't replicate the Gospel Library.** Those sections are beside the verse. A note on 6:4, 6:16, 7:6, 15:1, 18:15, 30:6 or 34:5–6 does not repeat them; it goes where they stop (to the study an endnote cites, to the Hebrew, to the Book of Mormon's use of the verse), or it is not written.
- **Quote the Church's modern material sparingly.** *Scripture Helps* quotes President Nelson on covenant and gathering, Elder Renlund on the circumcised heart, and President Packer on Moses' translation. Each is quoted at most once on the site, at the place named under “Explained once,” and only if the note needs his words.

## What a chapter is for here

Deuteronomy is 959 verses in 34 chapters, almost all of it Moses speaking. It is a sermon, not a law code read aloud: “remember,” “forget,” “love,” “this day,” “that it may go well with thee” return on every page. The reader's questions: *Why is the law given again, and why does it differ from Exodus (the Sabbath's reason, 5:15)? What does “the LORD our God is one LORD” mean? Why was Moses not allowed into the land, and why does he say it was for Israel's sake (1:37)? Why were the Canaanites to be utterly destroyed, women and children too? Why one place of worship? Who is the prophet like Moses? Why stone a rebellious son? What did a divorce require, and why did Jesus overrule it? Why are some kept out of the congregation (23:1–8)? What is the song for, and why are its verses so fierce? How could Moses write of his own death, and did he die?* (Answered by pointing to Christ; the `christ` section then says where the principle reaches a disciple now, in statements: `STANDARDS.md` §1, “Apply scripture to the reader,” 2026-10-16.)

**Say what the speech is doing before what it means.** Moses retells, exhorts, warns and pleads. A note says first where the verse sits in his argument (a memory of Horeb, a command, a reason, a promise), then what it says, then how scripture and the Church's sources read it.

**Law chapters get a thread, not a note per statute** (12–26), as in Exodus 21–23 and Leviticus 17–27: a `thread` that says how the chapter's laws hang together and what they protect, notes on the laws a reader would stop at, and nothing on a law that reads plainly. **Deuteronomy often gives its own reasons** (“for thou wast a bondman,” “that the LORD thy God may bless thee,” “so shalt thou put the evil away from among you”): a note may start from the reason the text gives.

**Retold chapters point back.** 1–3 retell Numbers; 5 retells Exodus 20; 9–10 retell the calf and the second tables (Ex. 32–34). Say what Moses' retelling adds or changes and why, not the story again.

**Short chapters are right for some of this.** Several law chapters (14, 22–25) are lists; three or four notes and a clear `thread` are a full chapter. `setting` may fall under the checker's word count; ignore the warning. Don't pad.

**Graphic passages** (the herem; 21's captive woman; 22's laws on virginity and rape; 25:11–12; the curses of 28:53–57): say what the text says plainly and briefly; describe rather than quote (`STANDARDS.md` §3).

## Divisions

The Bible Dictionary (“Deuteronomy”) gives the outline, and *Scripture Helps* [5–8] the same: a first discourse (1–4), a second (5–26) in two parts, “5–11, the Ten Commandments and a practical exposition of them” and “12–26, a code of laws,” a third (27–30), “a solemn renewal of the covenant,” and 31–34, Moses' song, last blessing and departure. `book.yaml` follows it.

| Chapters | Division (key) |
|---|---|
| 1–4 | Remember the Way (`deutjourney`) |
| 5–11 | Hear, O Israel (`deutlove`) |
| 12–26 | The Statutes and Judgments (`deutstatutes`) |
| 27–30 | Blessing and Cursing (`deutcovenant`) |
| 31–34 | The Last Days of Moses (`deutfarewell`) |

The first address ends at 4:40, with 4:41–49 a bridge (the cities of refuge east of Jordan, and the heading of the second address); chapter 4's `thread` says so. The ancient treaty form scholars read in the book is set out in *Scripture Helps*' endnote 3 (after Holzapfel and others) and in the *Old Testament Minute* (Rappleye [4–20]); it frames chapter 1's `setting` in a sentence or two and chapter 27's or 29's, and no other chapter re-explains it.

## Explained once: where

Each batch is written without sight of the others, so the same explanation returns unless one place owns it. **A chapter that needs one of these says it in a clause and points to the place named with a `[[reference]]`, whether or not that chapter is written yet; it does not explain it again or print the quotation again.** If your chapter is the place named, write the full note. A term the table does not place is explained at the first verse that has it (`node scripts/occurrences.mjs deuteronomy "<word>"`). Places in other books are already written: read them and agree.

| What | Explained in full at | Elsewhere |
|---|---|---|
| Who wrote it; the name; the treaty form | chapter 1 `setting`, briefly; the scholars' Josiah view at `[[Deut. 31:9]]` or 31:24–26 (“Contested”) | nothing |
| Horeb; **the LORD is Jehovah, the premortal Christ** | `[[Ex. 3:1]]`; `[[Ex. 3:14]]` | point; not re-argued |
| The spies, Kadesh-barnea, the forty years | `[[Deut. 1:22]]` (telling Num. 13–14 briefly) | `[[Deut. 9:23]]` points |
| **Moses barred from the land** (“for your sakes”) | `[[Deut. 3:26]]`, with Num. 20:7–13 | 1:37; 4:21; 32:51; 34:4 point |
| Sihon and Og; Og's bed | `[[Deut. 2:24]]`, `[[Deut. 3:11]]` (Psalms 135–136 on the site: agree) | point |
| **The herem, “utterly destroy”** | `[[Deut. 7:2]]` | 2:34 says what happened; `[[Deut. 20:16]]` the law of war; both point |
| Baal-peor | `[[Deut. 4:3]]` (Hosea 9:10, Ps. 106:28 on the site) | point |
| No similitude at Horeb; images | `[[Deut. 4:12]]`, `[[Deut. 4:15]]` | 5:8 points to `[[Ex. 20:4]]` |
| Cities of refuge | `[[Deut. 19:2]]` | 4:41–43 points |
| **The Ten Commandments**: each one, how counted | Exodus 20 and its notes | chapter 5 only what is new: 5:3; the Sabbath's reason and the servant's rest, 5:14–15 (`[[Ex. 20:8]]` already sets the two reasons side by side); the tenth's wording, 5:21; “he added no more,” 5:22; the people's fear, 5:23–29 |
| “A jealous God”; the fourth generation | `[[Ex. 20:5]]` | 5:9; 24:16 point |
| **The Shema** | `[[Deut. 6:4]]` | 11:13 points |
| **Love the LORD with all thine heart**; the first great commandment | `[[Deut. 6:5]]` | 10:12; 11:1; 30:6, 16, 20 point |
| Words on the heart, hand, doorposts; phylacteries | `[[Deut. 6:6–9]]` (the custom at `[[Ex. 13:9]]`) | 11:18–20 points |
| Teaching the children; “when thy son asketh” | `[[Deut. 6:7]]`, `[[Deut. 6:20]]` (Exodus's theme *When Your Children Ask*: link) | 4:9; 11:19; 31:13 point |
| **Christ's three answers to the devil** (Matt. 4) | `[[Deut. 8:3]]` | 6:13 and 6:16 each name the temptation in a sentence and point |
| Massah; manna | `[[Ex. 17:7]]`; Exodus 16 | 6:16; 9:22; 33:8; 8:16 point (8:3 says what is its own) |
| “A special people” (*segullah*) | `[[Ex. 19:5]]` | 7:6; 14:2; 26:18 point |
| Chosen for love, not righteousness | `[[Deut. 7:7]]`; `[[Deut. 9:4]]` points to it | point |
| **The calf and Moses' intercession** | Exodus 32 | chapter 9 says what the retelling adds (9:18, 20, 21, 25) |
| **The second tables; what was withheld** (JST 10:2; D&C 84) | `[[Ex. 34:1]]` | `[[Deut. 10:2]]` says the JST footnote makes the same change, and points |
| The ark; the priests and Levites | `[[Ex. 25:10]]`; `[[Ex. 28:1]]`, `[[Ex. 32:26]]` | 10:8–9 and 18:1–8 say their own |
| **The circumcised heart** | `[[Deut. 30:6]]` (circumcision at `[[Gen. 17:10]]`) | 10:16 points to the promise |
| Ebal and Gerizim | `[[Deut. 11:29]]` | chapter 27 says what is its own |
| **The place the LORD shall choose** | `[[Deut. 12:5]]` | 14:23; 16:2; 26:2 point |
| Blood not eaten | `[[Lev. 17:11]]` | 12:16, 23 point |
| False prophets; the test of a prophet | `[[Deut. 13:1]]`, `[[Deut. 18:22]]` (Jeremiah 28 on the site) | point |
| Death for idolatry; “put the evil away” | `[[Deut. 13:5]]` | 17:7; 19:19; 21:21; 22:21; 24:7 point |
| Clean and unclean animals; the kid in its mother's milk | Leviticus 11; `[[Ex. 23:19]]` | chapter 14 says what is its own (14:1–2, 5) |
| **The tithe** | `[[Lev. 27:30]]` (`[[Mal. 3:10]]` on the site) | `[[Deut. 14:22]]` its own (eaten before the Lord; the third-year tithe); 26:12–15 points |
| Year of release; “the poor shall never cease” | `[[Deut. 15:1]]` (the land's sabbath at `[[Lev. 25:2]]`) | point |
| **Hebrew servants** | `[[Ex. 21:2]]`; Lev. 25:39–46 | `[[Deut. 15:12]]` its own (gifts at release; the bored ear; the maidservant) |
| Firstlings | `[[Ex. 13:2]]` | 15:19 points |
| **The three feasts** | `[[Ex. 23:14]]`; Leviticus 23; Exodus 12 | chapter 16 its own: the chosen place, rejoicing with the Levite, stranger, fatherless and widow; the volume guide's table: link |
| Judges and justice | `[[Deut. 16:18]]` | 1:16–17; 24:17 point |
| **The king** | `[[Deut. 17:14]]` | point |
| Divination and necromancy | `[[Deut. 18:10]]` (Isa. 8:19 on the site) | point |
| **The prophet like unto Moses** | `[[Deut. 18:15]]`. Exodus's theme *Moses the Mediator*, section “A prophet like unto me” (`/exodus/themes/moses-the-mediator/#prophet`): agree, link | 18:18–19 and 34:10 say their own |
| Two or three witnesses; eye for eye | `[[Deut. 19:15]]`; `[[Ex. 21:24]]` | 17:6; 19:21 point |
| “Hanged on a tree … accursed” | `[[Deut. 21:23]]` (Gal. 3:13) | point |
| **Women: captive, firstborn, virginity, rape, divorce, levirate** | the guide *Women and Marriage* (`#divorce`, `#levirate-marriage`, `#the-law`, `#hard-passages`); then `[[Deut. 21:10]]`, `[[Deut. 21:15]]`, `[[Deut. 22:13]]`, `[[Deut. 24:1]]`, `[[Deut. 25:5]]` | link the guide's section at the end of the note |
| The congregation (23:1–8) | `[[Deut. 23:1]]` (Isa. 56:3–5 on the site) | nothing |
| Usury; gleaning; the stranger | `[[Ex. 22:25]]`; `[[Lev. 19:9]]`; `[[Lev. 19:33]]` | 23:19–20 and 24:19–22 say their own |
| The ox unmuzzled; Amalek | `[[Deut. 25:4]]` (1 Cor. 9:9); `[[Ex. 17:8]]` | 25:17–19 its own |
| “A Syrian ready to perish” | `[[Deut. 26:5]]` | nothing |
| **Blessings and cursings** | Leviticus 26 and the guide's `#renewals` | chapter 28 its own: length, the reversals, the siege, the return to Egypt (28:68) |
| **The covenant renewed in Moab** | `[[Deut. 29:1]]` and chapter 29 `setting` | 26:16–19; 27:9 point |
| **Scattering and gathering** | `[[Deut. 30:1]]` | 4:25–31; 28:64 say their own and point |
| “Choose life” | `[[Deut. 30:19]]` (2 Ne. 2:27) | 11:26 points |
| The law read every seventh year | `[[Deut. 31:10]]` (Mosiah 2; Neh. 8) | nothing |
| **The Song of Moses** | chapter 32 `setting` and `thread`; why written at `[[Deut. 31:19]]` | point |
| “The Rock” | `[[Deut. 32:4]]` (Ps. 18; Ex. 17:6; `[[Ps. 95:8]]`) | 32:15, 18, 31 point |
| **32:8, the number of the children of Israel** | `[[Deut. 32:8]]` (Ps. 82:8 and Gen. 10:32 on the site) | nothing |
| Jeshurun; the eagle; “vengeance is mine” | `[[Isa. 44:2]]`; `[[Deut. 32:11]]` (`[[Ex. 19:4]]`); `[[Deut. 32:35]]` | point |
| **The blessings of the tribes** | chapter 33 `setting` (Genesis 49 on the site) | Joseph at `[[Deut. 33:13]]` |
| **Moses' death or translation** | `[[Deut. 34:5]]` | 31:14; 32:50 point |
| Joshua | `[[Deut. 31:7]]`; `[[Deut. 34:9]]` | 1:38; 3:28 point |

**Three habits of wording, the same in every chapter:** a rendering that is not the King James is “a modern translation”; a point that is an older commentary's alone is “one older reading”; an `explore` bullet points to scripture, and to a study only when it is especially good on this chapter.

## Numbers, told from Deuteronomy

Numbers is not written on the site, and Deuteronomy retells it: the spies (1:19–46; Num. 13–14), the dying generation (2:14–16; Num. 14:29–35), Edom (2:1–8; Num. 20:14–21), Sihon and Og (Num. 21:21–35), the tribes east of Jordan (3:12–20; Num. 32), Baal-peor (4:3; Num. 25), Taberah and Kibroth-hattaavah (9:22; Num. 11), Dathan and Abiram (11:6; Num. 16), Balaam (23:4–5; Num. 22–24), Meribah (32:51; Num. 20:7–13). **Proposed:** a note tells the event in a sentence or two from the text of Numbers, with the `[[Num. …]]` reference (it links to the Gospel Library until Numbers is written, then to the site with no change), and then says what Moses' retelling, to the children of those who refused, adds or changes and why. Where the site already has a note on the event (the table), point there. *Scripture Helps* on Numbers 11–14; 20–24; 27 (`scripture-helps-num`) is the Church's newest word on those events. When Numbers is written, its chapter owns the event and the Deuteronomy note keeps only what is Deuteronomy's.

**Where Deuteronomy and Numbers differ** (who first proposed the spies, 1:22 beside Num. 13:1–2; why Moses was barred, “for your sakes,” 1:37; 3:26, beside Num. 20:12), say what each text says, side by side, and give a reading only from a source read. Don't harmonize in the writer's own words, and don't call it a contradiction.

## Book-wide conventions

**What in this brief is a lead and not a fact.** Words in quotation marks below were copied from the page named. The rest (what a Hebrew word can mean, which later scripture takes up which line) is the drafter's direction of where to look. None of it goes into a chapter until the writer has read it on a page and given it a ledger row (`STANDARDS.md` §4).

- **`when`.** The book dates itself: “in the fortieth year, in the eleventh month, on the first day of the month” (1:3), “on this side Jordan, in the land of Moab” (1:5). **Proposed:** every chapter's `when` is “In the plains of Moab, in the fortieth year after the Exodus” or the like, from the text; no B.C. year (Exodus 1:11 on the site treats the date of the Exodus: point there if a reader needs it). Chapter 34's `when` is the same, with Moses on Nebo.
- **Names of God.** Copy any phrase with LORD, Lord or GOD from `data/kjv/deuteronomy.json`; 33:12 was corrected to “LORD” and 32:8 reads “the most High” (lower-case *most*). The LORD of Deuteronomy is the premortal Christ: said where it answers a question, in a clause, pointing to `[[Ex. 3:14]]`.
- **The Hebrew numbering differs in three places.** King James 12:32 is Hebrew 13:1 (so chapter 13 runs one verse ahead), 22:30 is Hebrew 23:1 (chapter 23 likewise), and 29:1 is Hebrew 28:69 (chapter 29 runs one behind). `hebrew.mjs` takes the King James number and prints both; cite the King James verse.
- **Hebrew only where it answers a reader's question** (`STANDARDS.md` §3). Words that pay: “tempt” (6:16, *Scripture Helps* has it), “utterly destroy” (*ḥaram*, 7:2), “some uncleanness” (24:1), “Jeshurun” (point), “the most High” and “sons” (32:8), “the Rock.” No more than about a quarter of a chapter's notes are Language notes.
- **The Joseph Smith Translation.** The Church's footnotes have JST readings at 10:2 (the tables: point to Exodus 34:1) and 14:21 (“not give … not sell” the animal that dies of itself to the stranger). The manuscript also changes 34:5–6: Old Testament Revision 2, page 73, reads “for the Lord took him unto his Fathers, in a valley in the land of Moab, over against Bethpeor; therefore no man knoweth of his sepulchar unto this day” (`jsp-ot2`; *Scripture Helps* quotes it). Horton (`horton-jst-pentateuch`) treats the JST in Deuteronomy: read it before citing a change. Give one only where it answers a reader's question.
- **Scripture reads Deuteronomy.** The Bible Dictionary lists the New Testament's main uses: Matt. 4:4, 7, 10 (8:3; 6:16; 6:13); Matt. 5:31 (24:1); Mark 12:30 (6:5); Acts 3:22 (18:15, 18); 1 Cor. 9:9 (25:4); 2 Cor. 13:1 (19:15); Gal. 3:13 (21:23); Rom. 10:6–8 (30:12, 14). The Book of Mormon, which “never directly quotes a passage from Deuteronomy” (Seely, “Self-Reference” [9]) but echoes it often: the prophet like Moses (1 Ne. 22:20–21; 3 Ne. 20:23), Lehi's farewell and “choose” (2 Ne. 1–4; KnoWhy #268), Benjamin and the king's law (Mosiah 2; KnoWhy #428), Abinadi (Mosiah 12–13), Alma 45:19. Restoration scripture: Moses 1, D&C 84:19–27, D&C 110:11, JS–H 1:40. Where scripture says what a passage meant, say so as scripture's reading; an echo someone identifies is that author's. **No comparison panel, and nothing is written for a Book of Mormon chapter** (`AUTHORING.md`).
- **Other books on the site and the volume guides.** Besides the table: Hosea 9 and 11, Jeremiah 3 and 11, Malachi 4:4 (“Remember ye the law of Moses”), Lamentations, Amos. The guides *The Law and the Covenant* (`#torah`, `#feasts`, `#clean-unclean`, `#renewals`, which already summarizes Deuteronomy's renewal), *Women and Marriage*, *The Land* (1:7's regions) and *How It Came to Us* (`#dead-sea-scrolls`: thirty copies of Deuteronomy at Qumran). Point from the chapter in a clause; don't retell.
- **The law fulfilled.** As in Leviticus's brief: the law of Moses was “a preparatory gospel,” fulfilled in Christ (`[[3 Ne. 15:4–5]]`); say it where a chapter's `christ` section needs it, briefly. **No chapter calls the law primitive, and none says Christians outgrew it**: it was given by Jehovah and fulfilled by Him. Deuteronomy's own center, love of God with the whole heart, is the commandment the Savior kept first.
- **Theme candidates.** A writer reports an arc that joins chapters in a way a reader would not see chapter by chapter; `propose-themes` and Codex propose the list at the end of the book. No theme page is written until the author chooses it (leads so far: `THEME-CANDIDATES.md`).

**Habits to avoid** (Ezekiel's brief has the examples): say a thing once in a chapter; don't re-explain what another chapter explains, point with a `[[reference]]`; a Witness of Christ does not open by saying what the chapter lacks; a note's first sentence gives the answer, since the site shows it alone as the note's card; a reading stays a reading in every sentence; “In plain words” adds nothing to the verse; Hebrew only where it changes what the reader understands; don't join two verses yourself and call it the text's meaning; application only in `christ`, as statements resting on what it cites, never questions or exhortation.

## Contested and sensitive questions

One approach for each, so that 34 chapters say the same thing. Quotations were copied from the pages named on 2026-10-15; re-read the page before using one.

- **Who wrote Deuteronomy, and when.** The Bible Dictionary (“Pentateuch”): “The Pentateuch was written by Moses,” though scribes “have left their traces,” and “the explanation of Moses' supposed death (Deut. 34:5–12) was surely added by a later hand. But latter-day revelation confirms that Moses was the author” (`[[1 Ne. 5:11]]`; `[[Moses 1:40–41]]`). Scholars widely hold that the book found under Josiah (`[[2 Kgs. 22:8]]`) “comprised the book of Deuteronomy, at least in some form” (Dundas [14]); Latter-day Saint writers on both sides of the debate below accept that much (Hamblin [29]; Seely, “Self-Reference” [6]; KnoWhy #428). Shannon: “the original words of Moses … could have been edited, compiled, and redacted in a manner similar to that of the Book of Mormon” [22]. **The caution:** Margaret Barker's thesis, that Josiah's reformers suppressed true temple religion, has Latter-day Saint advocates (Christensen; Rappleye; Larsen) and critics (Hamblin: “no biblical prophet ever opposed or criticized Josiah's reforms” [43]; Halverson 2023; Eliason, who warns it leaves “a major portion of the Hebrew Bible as historically suspect or outright unreliable” [36]). **Proposed:** chapter 1's `setting` says in two or three sentences that the book gives itself as Moses' words (1:1; 31:9, 24), that latter-day revelation names Moses as the writer of the five books (Genesis 1 and Exodus 1 on the site: point), and that some passages, chapter 34 above all, were added by another hand. The scholars' Josiah view and the Latter-day Saint debate are said once, at 31:9 or 31:24–26, in a short paragraph, both sides as their authors'. **No chapter argues the date, builds a reading on a Deuteronomist, or gives Barker's view, or its rejection, as the Church's.**
- **Moses' death, burial and translation (34:5–7).** The text: “Moses … died there,” “he buried him,” “no man knoweth of his sepulchre.” The heading: “taken by the Lord.” The Bible Dictionary (“Moses”): “Moses was a translated being and had not died as reported in Deut. 34 (Alma 45:19),” so that he had a body at the Transfiguration. Alma 45:19 is careful: the saying went that Alma “was taken up by the Spirit, or buried by the hand of the Lord, even as Moses. But behold, the scriptures saith the Lord took Moses unto himself.” The JST manuscript keeps “died” and replaces “he buried him” with “the Lord took him unto his Fathers” (Horton: it “hints more strongly in that direction” [82]). *Scripture Helps* [40–42] has the JST, Alma, President Packer and the Transfiguration beside the verse. **Proposed:** the note at 34:5–6 gives the text, the JST and Alma 45:19, then the Church's conclusion that Moses was translated, and goes where *Scripture Helps* stops (the Bible Dictionary's reason; D&C 110:11). Who wrote 34:5–12 is a sentence from the Bible Dictionary, not argued. Josephus only from a source read that prints him (Rappleye [80]; Horton [82]).
- **The herem: “thou shalt utterly destroy them” (2:34; 3:6; 7:1–6; 20:16–18).** The Church's newest word, *Scripture Helps* [17–18] and its appendix “Violence and Destruction”: the destruction was “a consequence of their rebellion against the Lord” (`[[1 Ne. 17:35]]`, “ripe in iniquity”); “he offered prolonged opportunities for them to repent”; it reflects “His justice and His desire to protect His covenant people”; and “we should not think that examples of violence in the Old Testament would ever be justification for committing violence today.” Calabro (RSC, 2025): the word belongs with holiness; “The war ḥērem was a ritualized form of destruction employed in battle, not a goal of conquest. The goal … was to ‘drive out’ the wicked Canaanites” [119]; the language may be “the exaggerated idiom of that time” [143]; Israel itself may have “lacked a full understanding of the purposes behind God's commandment” [114]. Rappleye (after Walton and Walton): destroying “the national identities” [28]. **Proposed:** the full note at 7:2 gives the Church's reading first, with the text's own reason (7:4; 20:18), then Calabro's and Rappleye's as theirs, then what is not known; it neither defends nor condemns beyond its sources. **No chapter says the command was not given or that Israel misheard God**, and none makes the Canaanites' sins vivid beyond the text (12:31). The same God forbids Israel to touch Edom, Moab and Ammon (2:5, 9, 19).
- **Harsh laws (13; 17:2–7; 21:18–21; 22:20–24).** Say what the law requires, the reason the text gives (“so shalt thou put evil away from among you; and all Israel shall hear, and fear,” 21:21), and the limits it sets (both parents and the elders; two or three witnesses, 17:6; inquiry, 13:14). **No note says the law was often carried out, or never**, unless a source read does. Where the scriptures give no reason, say so, as *Scripture Helps* does on slavery [27], and give what modern revelation says. The law as schoolmaster (`[[Gal. 3:24]]`) is said in a `christ` section where needed, not in every chapter.
- **Women in the law (21:10–17; 22:13–30; 24:1–4; 25:5–12).** Follow the volume guide *Women and Marriage* and *Scripture Helps*' appendix “Women in the Old Testament.” Say what each law requires and whom it protects or fails to protect; the captive woman is described, not softened, with the protections the text gives. **Divorce (24:1–4),** the one note: the law regulates a practice already there; “some uncleanness” was disputed later (Frederick [33]); Jesus answers from Genesis, not from 24:1 (Frederick [35]), and calls it a concession “because of the hardness of your hearts” (`[[Matt. 19:8]]`). **No note applies these laws to modern marriage, and none argues a woman's worth from them.**
- **The prophet like unto Moses (18:15–19).** Scripture settles it: `[[Acts 3:22–23]]`, `[[Acts 7:37]]`, `[[1 Ne. 22:20–21]]`, `[[3 Ne. 20:23]]`, and Moroni to Joseph Smith that “that prophet was Christ” (`[[JS–H 1:40]]`). Say it without hedging. Then what *Scripture Helps* doesn't: why the promise comes from Horeb (18:16–17; 5:23–27); what “like unto me” means (34:10); the collective reading, a succession of prophets (Seely [35], with the Book of Mormon's identification [69]); a “dual fulfillment” in Christ's two comings (Benson and McConkie [9]); Bowen's reading that Joseph Smith and his successors also fulfill it [83], beside D&C 28:2 (“even as Moses”) and 107:91 (“like unto Moses”). Each reading as its author's.
- **The Shema and the first great commandment (6:4–5).** The note at 6:4 says what “one” (*ʾeḥad*) can mean (the lexicon page), gives *Scripture Helps*' alternative rendering “The Lord is our God, the Lord alone” (cite *Scripture Helps*: the book it quotes is not readable), and says the confession is of Israel's covenant loyalty to Jehovah alone. How Latter-day Saints read the oneness beside the Godhead (`[[John 17:21–22]]`; `[[3 Ne. 11:27, 36]]`) is said in a sentence only if a source read says it; **no argument about the Trinity.** 6:5: why Jesus adds “mind” (`[[Mark 12:30]]`; KnoWhy #517); love as covenant loyalty (Muhlestein).
- **Christ's three answers to the devil (8:3; 6:16; 6:13).** Scripture's own reading. The note at 8:3 says what the verse meant in Moses' speech, why the three verses fit the three temptations, and that Israel's forty years stand behind His forty days (Strathearn and Judd [36], as theirs). No typology of the writer's own.
- **The king (17:14–20).** Say what the law forbids and requires; Solomon (1 Kgs. 10–11) is the text's contrast; Bowen [84–86] and Halverson 2017 are the studies; Benjamin (Mosiah 2) and Mosiah 29 as Halverson reads them.
- **One place of worship (12:5).** Say what the text requires and why (12:2–4, 13–14, 29–31). Nephite temples (2 Ne. 5:16) only if the note needs them, with Shannon [35–36] as his.
- **The congregation (23:1–8).** Say whom the law excludes and the text's reasons (23:4–7); Ruth the Moabite is scripture's; Isaiah 56:3–5 answers 23:1 (the site's note: agree). No modern application of the exclusion itself.
- **“The number of the children of Israel” (32:8).** The King James follows the Hebrew; a Qumran scroll and the Greek read “sons of God” (McConkie [29]; Smoot [71–78]). The heading reads the verse: “the children of Israel were known in the premortal life.” **Proposed:** the King James and the heading's reading first, then the variant as a textual fact, then McConkie's (“pre-earth assignments”) and Smoot's readings as theirs. Psalm 82:8's note already gives it: agree.
- **The Song of Moses (32).** What it is (a witness, 31:19–21, 26–30), its shape, and why it is fierce; its mercy at the end (32:36, 43). KnoWhy #853's dating of the archaic poems is its reading. A longer 32:43 in the scroll and the Greek only from a source read (Smoot; Christensen 2023 [47]).
- **The blessings of the tribes (33).** Set beside Jacob's (Genesis 49 on the site): Simeon missing, Levi blessed, Joseph's long blessing; the heading's latter-day gathering at 33:17 as the heading's reading. No tribal typology of the writer's own.
- **Ebal and Gerizim (11:29; 27).** Where they are, what the ceremony was, the Levites' curses and the people's “Amen.” An altar found on Ebal only from a source read, as a proposal.

## Settled without the author

Kinds of decision a reviewer makes by the standard, not a question for the author (Psalms' brief has the rule):

- **No Church, BYU, Scripture Central or *Interpreter* source answers a reader's real question, and an older commentary does:** give its answer as “one older reading,” within the limit of a third of the notes. If the question isn't one a reader would ask, there is no note. The Latter-day Saint studies cluster on 6–8, 15, 17–18, 29–30 and 34; the law chapters 19–26 will need this most.
- **A scholar's reading that a Religious Studies Center, BYU or *Interpreter* publication prints**, or that Scripture Central's *Old Testament Minute* quotes (Friedman; Walton and Walton), is cited as that publication's author's, as one reading, beside the Church's, never above it.
- **Two passages share words and no source joins them:** a note may set them side by side as shared wording and say so; it draws nothing from the pairing.
- **The King James reads a verse one way and the Hebrew or a modern translation another:** the paraphrase and thread start from the King James; a clarification may go into the paraphrase when it materially helps, and then a visible note explains it (`STANDARDS.md` §6).
- **Two faithful sources read a verse differently:** give both, the Church's first, without choosing.
- **Deuteronomy and Exodus or Numbers tell an event differently:** say what each says, side by side; a reason only from a source read.
- **A source quoted inside a Church manual** whose own work can't be read is cited as the manual, for what the manual prints, as one view.
- **The Church's footnote points somewhere the note does not go:** leave it.

## Sources for Deuteronomy

Tested 2026-10-15 with the research scripts. `STANDARDS.md` §9 has the general tools. ✓ marks a key already in `sources.yaml` (✚ added with this brief); for any other work, propose an entry with the key given, taking author, title and pages from the page.

**What was searched, in this order:** BYU Studies' bibliography of Latter-day Saint writing on the Old Testament (`--find "Deuteronomy"`, [1713–1726]: Meservy in *Studies in Scripture* 3, Rasmussen in the *Encyclopedia of Mormonism*, Driggs 1918, none online; Horton, online); BYU Studies' *Come, Follow Me* page for the week (`…/come-follow-me/old-testament/20`); `search-lds.mjs --site rsc,byustudies` for some thirty queries (Deuteronomy, Deuteronomist, Josiah, Shema, prophet like Moses, translation of Moses, Song of Moses, sons of God, holy war, king, covenant renewal, Ebal, divorce, rebellious son, the tribes) and web searches limited to those sites; `knowhys.mjs deuteronomy <n>` for every chapter (saved; only #851 has a Deuteronomy verse as its main reference) and KnoWhys by words; Scripture Central's archive by web search; *Interpreter*'s journal by its list of addresses and its index of articles by scripture (`interpreterfoundation.org/journal/scriptures/deuteronomy`, 22 articles), and its study aids. Then *Scripture Helps*, *Come, Follow Me* and the Bible Dictionary; the Student Manual last (its outline only); Keil not opened. **Nothing found** on Ebal and Gerizim, the blessings of the tribes or the Song of Moses as a subject, nor in *Interpreter* on Moses' translation or the herem.

**BYU and the Religious Studies Center**

- ✓ `horton-jst-pentateuch`: seven JST changes in Deuteronomy [26, 76–82] (2:30; 10:1–2; 14:21; 16:22; 34:6). ✓ `bowen-law-codes`, the Deuteronomic Code [65–96]: false prophets and the prophet like Moses [74–83], the king [84–86], covenant economics [87–95] (the page misprints its author “Brown” [3]). ✓ `shannon-documentary` [13–48]: D, Mosaic authorship [22], the Nephites and 12:5 [35–36]. ✓ `belnap-law-moses` [39–43] (its “18:10–20” [42] is a slip for 20:10–20). ✓ `mcconkie-premortal-councils` [29] (32:8). ✓ `seely-cry-widow`, ✓ `lund-ot-laws`.
- ✚ `calabro-herem`: David M. Calabro, “‘Thou Shalt Utterly Destroy’,” *From Wilderness to Monarchy* (RSC, 2025): the study for every herem passage.
- ✚ `seely-self-reference` (Seely, *They Shall Grow Together*, 2022): Josiah's book [5–7], no direct quotation in the Book of Mormon [9], the sermons [82], Moses writing [87–92]. ✚ `dundas-ancient-israel` (*Mormon's Record*, 2024): Josiah [12–16], the covenant themes and 28 [17–51]. ✚ `eliason-josiah` (*BYU Studies* 60:3, 2021): the Latter-day Saint discussion of Barker [12–48]. Margaret Barker, “Joseph Smith and Preexilic Israelite Religion” (*BYU Studies* 44:4; propose `barker-preexilic`), only as the view others weigh.
- ✚ `benson-prophet-like` (Benson and McConkie, *Religious Educator* 12:3, 2011) on 18:15–19. ✚ `uriona-curses` (*BYU Studies* 63:2, 2024) on 27–28, 30. ✚ `lane-redemption` (*Covenant of Compassion*, 2021; *Scripture Helps* cites it) on 6, 8 and 15. ✚ `muhlestein-love-neighbor` (same volume) on 6:5, 15, 25:5–10 and the renewal. ✚ `frederick-divorce` (*The Household of God*, 2022) on 22:23–24 and 24:1 with Matt. 19. Strathearn and Judd, *Religious Educator* 8:2 (propose `strathearn-gospels`) [36] on the temptations; Christy, “The Great Commandment,” *Religious Educator* 3:1 (propose `christy-great-commandment`; read it first).
- To open before use: the RSC's *Joseph Smith's Translation of the Bible*, chapter “Exodus, Leviticus, Numbers, Deuteronomy” (for 34:6); “The Ancient Doctrine of the Two Ways and the Book of Mormon” (*BYU Studies*).

**Scripture Central**

- ✚ ***Old Testament Minute: Deuteronomy*** (2022, ed. Halverson), **not Welch's**: Philip A. Allred on chapters 1–3 (`ot-minute-deut-1`, `-2`, `-3`: introduction and treaty form [1: 4–13]; the herem at 2:34 [2: 29–31]) and Neal Rappleye on 1, 6–8, 15, 18, 29–30, 34 (`ot-minute-deut-rappleye`: covenant pattern [4–20], Shema [23–24], herem [28–30], 8:3 [34], release [47–58], the prophet [60–61], 29–30 [62–79], Moses' end [80–81], 34:10 [86–87]; its “Acts 33:22–23” [60] is Acts 3). Read with `--all`.
- KnoWhys: ✚ #851 (8:2), ✚ #428 (Deuteronomy in the Book of Mormon), ✚ #268 (Lehi like Moses; 30:15–19), ✚ #517 (6:5, “all thy mind”); ✓ #731 (Abinadi like Moses), #363, #850 (the documentary hypothesis and its limits), #853 (archaic poems: 32–33), #80 (Benjamin's assembly), #835. ✚ `christensen-barker` (Christensen in *Glimpses of Lehi's Jerusalem*, FARMS 2004) [4–5, 134, 158, 213].

***Interpreter*** (read at `journal.interpreterfoundation.org/<slug>/`)

- ✚ `seely-prophet-like-moses` (*Interpreter* 41, 2020): the collective reading, “the future succession of prophets” [35], Qumran [56–66], the Book of Mormon [69]. ✚ `halverson-kingship` (*Interpreter* 24, 2017) [27–40]; Bowen on Zoram and 17:20 (*Interpreter* 19; propose `bowen-zoram`). ✓ `smoot-council-hebrew-bible` [71–78] on 32:8 and 32:43 (his reading of the Hebrew as altered is his).
- **Josiah and the Deuteronomists, a debate in the journal's own pages:** ✚ `hamblin-josiah` (“Vindicating Josiah,” *Interpreter* 4, 2013) and ✚ `christensen-prophets-kings` (the reply, same issue), with McGuire's introduction (`mcguire-josiah`); Christensen's “Twenty Years After ‘Paradigms Regained’” 1 and 2 (*Interpreter* 54–55; `christensen-barker-1`, `-2`), which quote Eliason and Julie Smith against the thesis; Rappleye, “The Deuteronomist Reforms and Lehi's Family Dynamics” (16, 2015; `rappleye-deuteronomist`); Halverson, “Nephi Wanted to Be a Prophet Like Moses” (59, 2023; `halverson-nephi`), who sets Lehi and Nephi with “Deuteronomistic thinking” [76]; Val Larsen (36; 44; strongly for Barker); Bowen, “Putting Down the Priests” (51, 2022; `bowen-priests`); Reynolds, “A Backstory for the Brass Plates” (53, 2022). Bradshaw's review “Sorting Out the Sources” (9, 2014) on the documentary hypothesis; Ehat on a chiasm of chapter 8 beside Alma 36 (59, 2023), his structure.

**The Church's sources**

- ✓ `bd-deuteronomy`, `bd-pentateuch`, `bd-moses`, `bd-josiah`, `bd-frontlets`, `bd-law-of-moses`, `bd-divorce`, `bd-levirate-marriage`, `gs-moses`. **No Bible Dictionary entry “Shema”** (the address returns the index); check every new entry's heading.
- ✓ `scripture-helps-deut` (**not** `scripture-helps-dt-6`, which names the same page); its endnotes lead to Lane, Muhlestein's “Recognizing the Everlasting Covenant” (*Religious Educator* 21:2), the JST manuscript, and works not readable here. ✓ `scripture-helps-violence`, `scripture-helps-women`, `scripture-helps-josh` (“accursed,” Josh. 6:17–21); ✚ `scripture-helps-num`; ✚ `cfm-ot-2026-20` (the week's lesson: what the Church asks a reader to see, not commentary); ✓ `jsp-ot2` (page 73, `…/old-testament-revision-2/80`); ✓ `jst-deut-10`.
- Talks *Scripture Helps* cites (Christofferson, “The First Commandment First”; Renlund 2019 and 2020; Rasband, “Lest Thou Forget”; Eyring, “O Remember, Remember”; Nelson, “The Everlasting Covenant”): read each from its own page; quote at most once on the site.
- ✓ *Old Testament Student Manual*, `ot-manual-dt-1-16` (19-1 to 19-27) and `ot-manual-deuteronomy-17-33`, **after everything above**, one voice, in no more than a third of a chapter's notes. Its herem note (19-15) argues from Laban's death: *Scripture Helps* and its appendix are newer.

**The text and the older commentaries:** `oshb-wlc`, `biblehub-interlinear`, `bdb`, `lxx-rahlfs` (Brenton, `biblehub.com/sep/deuteronomy/<c>.htm`), `nrsvue`, `niv`, `esv`, `webster-1828`; ✓ `keil-deuteronomy` and the Cambridge Bible on Bible Hub (propose `cambridge-deuteronomy`) as **a last resort**, “one older reading.” The saved footnotes' “HEB” and “IE” aids are beside the verse: use one only to go further.

**Keys for new sources:** those above; `bd-<entry>`, `gs-<entry>`, `sc-knowhy-<number>`; a talk `<surname>-<one or two words>`; an article likewise. Check `content/sources.yaml` first.

**Not readable (don't cite):** ScholarsArchive PDFs; Meservy and Rasmussen (not online); Allred, “‘Lest Thou Forget the Lord’” (*God's Word in Our Hearts*, RSC: abstract only); Holzapfel and others' *Jehovah and the World of the Old Testament* and the study Bibles *Scripture Helps* cites; Walton and Walton and Friedman (cite the *Old Testament Minute* for what it prints); *Interpreter*'s study aid for the week (HTTP 500) and its KnoWhy OTL17A.

## The text

`data/kjv/deuteronomy.json` was imported on 2026-10-15 (34 chapters, 959 verses) and compared with the Gospel Library edition by `scripts/check-kjv.mjs deuteronomy`, which now reports no difference. The corrections are entries in `LDS_SPELLINGS` in `scripts/fetch-kjv.mjs`: hyphenated place names (Kadesh-barnea, Ezion-gaber, Bashan-havoth-jair, Ashdoth-pisgah, Beth-peor, Baal-peor, Kibroth-hattaavah, Meribah-Kadesh), “any thing” (14:21), “awl” (15:17), “inquired” (17:4), two marks of punctuation (18:10; 28:32), “the most High” (32:8), and “LORD” at 33:12.

## Checks while the book is in preview

```sh
node scripts/check-chapter.mjs deuteronomy <n>
```

It runs `fix-yaml`, the preview build into `.cache/batch/deuteronomy/dist-NN`, `check-quotes`, `check-content` (with the proposed entries), and `check-ledger`. The working folder for a batch is `.cache/batch/deuteronomy/` (not committed): `proposed/NN.yaml`, `reports/NN-writer.md`, `reports/NN-check.md`.

## Reader questions no source answered

In `content/deuteronomy/UNANSWERED.md`, by chapter, once the first batch is written.
