# Numbers brief

Book-level decisions for Numbers. The site-wide standard is in `STANDARDS.md`; this file records what is particular to Numbers. Writers, checkers, and reviewers read both before starting a chapter. Deuteronomy's brief is the model. **Numbers sits between books already written**: Exodus and Leviticus give the tabernacle, the priests, the offerings, the feasts and the laws of clean and unclean that Numbers restates or carries on, and Deuteronomy retells Numbers' events. Read “Explained once: where” before writing.

**Status (2026-10-16):** drafted from the sources named below, each read in the session with the research scripts on 2026-10-16. **The author chose this book** (2026-10-16: “Let's work on the book of Numbers”) **and has not read this brief.** Where a section says “Proposed,” that is the approach the chapters follow; it is the drafter's decision, not a fact from a source, and the author can overturn it.

Related files: `OPEN-QUESTIONS.md` at the top of the repository; `THEME-CANDIDATES.md` and `UNANSWERED.md` in this folder.

## State of the book

`node scripts/status.mjs numbers` prints what the repository shows; the history is `git log -- content/numbers`. What a script can't see:

- **In preview, no chapter written.** The text is imported and checked against the Gospel Library (“The text,” below). The Church's footnotes for every chapter are saved in `.cache/batch/numbers/fn1.txt` to `fn36.txt`; read them instead of running `footnotes.mjs` again. Scripture Central's KnoWhys for each chapter are saved in `.cache/batch/numbers/reports/knowhys/<n>.txt` (none has a Numbers verse as its main reference except #850, on 31:16).
- **Chapters 13, 19 and 21 were the writer test** (2026-10-16): Opus and Sonnet 5.5 each wrote them, judged blind against a reader's questions, and Opus's versions are the book's (author: “We stay with opus”; `AUTHORING.md`, “Why these models”).

## What the author has decided

Nothing for Numbers in particular beyond choosing it. The standing rules are in `STANDARDS.md` §1 and `AUTHORING.md`. How three land on this book:

- **Newest trumps oldest.** *Scripture Helps: Old Testament* (2025) has one chapter, “Numbers 11–14; 20–24; 27” (`scripture-helps-num`): what the book is and its three parts [4–7], murmuring [9–10], Moses' wish that all were prophets and Numbers 12 [11–13], Oshea renamed Joshua [14–15], the sons of Anak [16–17], the forty years [18–20], why Moses and Aaron were barred [22–24], the brass serpent in later scripture [25–27], and who Balaam was [29–31]. The Student Manual (two chapters, 1980) is older; where they differ, follow *Scripture Helps*.
- **Don't replicate the Gospel Library.** Those sections are beside the verse. A note on 11:29, 12, 13:16, 13:33, 14, 20:12, 21:4–9 or 22–24 does not repeat them; it goes where they stop (to the study an endnote cites, to the Hebrew, to the Book of Mormon's use of the passage), or it is not written.
- **Quote the Church's modern material sparingly.** *Scripture Helps* quotes Elder Renlund (murmuring; personal revelation), President Oaks (“two lines of communication”), Elder Bednar, and President Nelson on the name Jesus. Each is quoted at most once on the site, and only if the note needs his words. *Come, Follow Me* (`cfm-ot-2026-19`) is what the Church asks a reader to see, not commentary.

## What a chapter is for here

Numbers is 1,288 verses in 36 chapters, and it mixes three kinds of writing: lists (the censuses, the camp, the offerings, the journeys, the borders), law, and story. The Bible Dictionary notes it is “remarkable for the number of fragments of ancient poetry preserved in it (6:24–26; 10:35–36; 21:14–15, 17–18, 27–30)” (`bd-numbers`), and Balaam's oracles are poetry too. The reader's questions: *How many were there, really? Why the Levites instead of the firstborn? What was the trial of jealousy? Why give the meat and then strike the people? Who was Moses' Cushite wife, and why was only Miriam punished? Why was Korah wrong if “all the congregation are holy”? Why stone a man for gathering sticks? What did Moses do wrong at Meribah? Why would a serpent heal? Was Balaam a prophet, and did the ass speak? How could Israel be commanded to kill the Midianite women and children? Why do daughters inherit?* (Answered by pointing to Christ; the `christ` section then says where the principle reaches a disciple now, in statements: `STANDARDS.md` §1, 2026-10-16.)

**Lists get a thread, not a note per line** (1–4, 7, 26, 28–29, 33–34). Say what the list is for and what in it a reader would stop at (the 603,550; the Levites counted from a month old; the twelve identical offerings of chapter 7; the bullocks of Tabernacles falling from thirteen to seven, 29:12–32; the place-names Deuteronomy also gives). Three or four notes and a clear `thread` are a full chapter. `setting` may fall under the checker's word count; ignore the warning. Don't pad.

**Law chapters as in Leviticus and Deuteronomy** (5–6, 15, 18–19, 28–30, 35–36): a `thread` that says how the laws hang together and what they protect; notes on the laws a reader would stop at.

**Story chapters say what the episode is in the book's argument.** Pike (`pike-balaam` [10–24]) and the Bible Dictionary give the book's frame: a people counted and ordered at Sinai, a refusal at Kadesh, a generation that dies, and a new one counted on the plains of Moab. Each rebellion (11, 12, 14, 16, 20, 21, 25) is placed in that frame in the `thread`, briefly; the chapter's notes then answer its own questions. Thomas (`thomas-provocation`) on “the provocation” is already used at `[[Ex. 17:7]]`; agree.

**Graphic passages** (the trial of jealousy; the plagues; Phinehas, 25:8; the war on Midian and its women and children, 31:15–18): say what the text says plainly and briefly; describe rather than quote (`STANDARDS.md` §3).

## Divisions

The Bible Dictionary (“Numbers”) divides the book 1:1–10:10, 10:11–14:45, 15–19, and 20–36; *Scripture Helps* [5–7] 1–10, 10–21, 22–36; Pike [9–15] by place, at Sinai, near Kadesh, and on the plains of Moab. **Proposed:** five divisions, Sinai and Kadesh from the Bible Dictionary, the wilderness years to the end of chapter 21 with *Scripture Helps*, and the plains of Moab split at the second census (26), which Pike and the heading of chapter 26 make the line between the generations.

| Chapters | Division (key) |
|---|---|
| 1–10 | Ordered at Sinai (`numsinai`) |
| 11–14 | The Refusal at Kadesh (`numkadesh`) |
| 15–21 | The Wilderness Years (`numyears`) |
| 22–25 | Balaam and Baal-peor (`nummoab`) |
| 26–36 | The New Generation (`numnewgen`) |

Israel leaves Sinai at 10:11, inside chapter 10: its `thread` says so. Chapter 20 opens in the first month of an unstated year and Aaron dies in the fortieth (33:38): the thirty-eight years pass between 14 and 20 almost in silence, and chapter 20's `setting` says so.

## Explained once: where

Each batch is written without sight of the others, so the same explanation returns unless one place owns it. **A chapter that needs one of these says it in a clause and points to the place named with a `[[reference]]`; it does not explain it again or print the quotation again.** If your chapter is the place named, write the full note. A term the table does not place is explained at the first verse that has it (`node scripts/occurrences.mjs numbers "<word>"`). **Places in other books are already written: read them (`node scripts/occurrences.mjs numbers "<phrase>" --site all` finds them) and agree.**

**Numbers is now the home of its own events.** Deuteronomy's notes told the spies, Meribah, Baal-peor and Balaam from Numbers because Numbers was not written; they stay as they are (live books are opened when there is a reason). A Numbers note tells the event in full, reads the Deuteronomy, Psalms and Exodus notes named below, does not contradict them, and points to them for what is theirs (Moses' retelling, a psalm's reading). Where the full explanation of a thing already sits in another book, Numbers points there.

| What | Explained in full at | Elsewhere |
|---|---|---|
| Who wrote Numbers; the name | chapter 1 `setting`, two sentences (`bd-pentateuch`; `bd-numbers`; Pike [7]) | nothing |
| **The LORD is Jehovah, the premortal Christ** | `[[Ex. 3:14]]` | a clause, not re-argued |
| **The census; 600,000; *ʾelep*** | `[[Ex. 12:37]]` (the large numbers, with `ot-manual-large-numbers`) | `[[Num. 1:46]]` says what is its own (who was counted and why; the tribal totals; the promise of posterity, Pike [19]) and points; 26:51 says what changed |
| The tabernacle, its furnishings, “the tabernacle of the congregation” | `[[Ex. 25:8]]` and the Exodus verse for each furnishing | point |
| The cloud and fire | `[[Ex. 13:21]]`; `[[Ex. 40:38]]` | `[[Num. 9:15]]` its own (the camp moving and resting by it, 9:17–23) |
| Aaron, his sons and the priesthood; the Levites | `[[Ex. 28:1]]`; `[[Ex. 32:26]]`; the volume guide `#priests` | chapter 3 its own: the three Levite clans and their charges (3–4) |
| **The Levites instead of the firstborn; the redemption money** | `[[Num. 3:12]]` (`[[Ex. 13:2]]` already gives 3:12–13, 46–47: read and agree; Exodus's theme *The Firstborn*: link) | 3:41, 45; 8:16–18 point |
| **Aaronic and Levitical priesthood; what the restored priesthood has to do with it** (D&C 84:18–27; 107:13–20) | `[[Lev. 8:12]]` and `[[Mal. 3:3]]` | `[[Num. 8:19]]` says the Levites' place in a sentence; `[[Num. 16:10]]` owns the JST “high priesthood” |
| The offerings: burnt, meat, peace, sin, trespass; the added fifth | Leviticus 1–7 (`[[Lev. 5:15–16]]`) | `[[Num. 5:7]]` and chapter 7, 15, 28–29 point |
| Leprosy; outside the camp | `[[Lev. 13:2]]`; `[[Lev. 13:46]]` | `[[Num. 5:2]]`, `[[Num. 12:10]]` point |
| **The trial of jealousy** | `[[Num. 5:12]]` (the volume guide *Women and Marriage* `#the-law`, `#hard-passages`: link) | nothing |
| **The Nazarite** | `[[Num. 6:2]]` (`[[Amos 2:12]]`, `[[Lam. 4:7]]` on the site: agree) | point |
| **The priestly blessing** | `[[Num. 6:24]]` (`[[Ps. 4:6]]`, `[[Ps. 67:1]]`, `[[Lev. 9:22]]` on the site: read and agree) | `[[Num. 6:27]]` (“put my name upon”) its own |
| Murmuring | `[[Ex. 15:24]]` | chapter 11 `thread` places Numbers' murmurings in a sentence |
| Manna; quails | Exodus 16 (`[[Ex. 16:31]]`) | `[[Num. 11:7]]` its own; the quails and the graves of lust at `[[Num. 11:31]]` (`[[Ps. 106:15]]`, `[[Ps. 78:19]]`: agree) |
| **The seventy elders; Eldad and Medad; “would God that all the LORD's people were prophets”** | `[[Num. 11:16]]`, `[[Num. 11:29]]` (`[[Ex. 24:1]]`, `[[Ezek. 8:11]]`, `[[Joel 2:29]]` on the site: agree) | point |
| Miriam the prophetess | `[[Ex. 15:20]]` | chapter 12 its own; her death at 20:1 points |
| **“Mouth to mouth”; the similitude; seeing God** | `[[Ex. 33:20]]` (and `[[Ex. 33:11]]`) | `[[Num. 12:8]]` its own (Moses set above visions and dreams, 12:6–8) and points; `[[Deut. 34:10]]` |
| **The spies, Kadesh, the forty years** | `[[Num. 13:2]]`, chapter 14 (`[[Deut. 1:22]]`, `[[Ps. 95:8]]`, `[[Ps. 106:26]]`, Psalm 90 `setting`: agree) | `[[Num. 32:8]]` points |
| Oshea renamed Joshua | `[[Num. 13:16]]` (`[[Ex. 17:9]]` on the site: agree) | point |
| Giants; the sons of Anak | `[[Gen. 6:4]]`; `[[Deut. 1:28]]` | `[[Num. 13:33]]` its own (“as grasshoppers”) |
| **Moses' intercession and the name proclaimed** | `[[Ex. 32:10]]`; `[[Ex. 34:6]]` (which already cite 14:12, 17–20); Exodus's theme *Moses the Mediator*: link | `[[Num. 14:13]]` says what is new (the nations' report; “I have pardoned … But as truly as I live”) |
| “Ten times” | `[[Gen. 31:7]]` | `[[Num. 14:22]]` points |
| Sin “through ignorance”; the high hand | `[[Lev. 4:2]]` | `[[Num. 15:30]]` its own (“cut off”) |
| **The Sabbath-breaker** | `[[Num. 15:32]]` (the penalty itself at `[[Ex. 31:14]]`; `[[Lev. 24:12]]` on waiting for the word: agree) | nothing |
| **Korah, Dathan and Abiram** | `[[Num. 16:3]]`, `[[Num. 16:10]]` (`[[Ps. 106:16]]`, `[[Deut. 11:6]]`: agree) | `[[Num. 26:10–11]]` (the sons of Korah: Psalm 42's title note) |
| Aaron between the dead and the living | `[[Num. 16:48]]` (`[[Ps. 99:6]]`: agree) | point |
| Aaron's rod | `[[Num. 17:8]]` | point |
| The Levites' tithe; the LORD as their inheritance | `[[Lev. 27:30]]`; `[[Ps. 16:5]]` | `[[Num. 18:20]]`, `[[Num. 18:26]]` their own; salt covenant `[[Lev. 2:13]]` |
| **The red heifer and the water of separation** | `[[Num. 19:2]]`, `[[Num. 19:9]]` (`[[Ps. 51:7]]`, `[[Ezek. 36:25]]`, `[[Lev. 21:1]]`: agree) | point |
| **Meribah: what Moses did and why he was barred** | `[[Num. 20:12]]` (`[[Ex. 17:7]]` on the second Meribah; `[[Deut. 3:26]]` for “for your sakes”; `[[Ps. 106:33]]`; Deuteronomy's theme *Let It Suffice Thee*: link) | `[[Num. 20:24]]`, `[[Num. 27:14]]` point |
| Edom; the king's highway | `[[Num. 20:14]]` (`[[Deut. 2:29]]`, the volume guide `#roads`: agree) | point |
| Aaron's death; the garments to Eleazar | `[[Num. 20:26]]` (`[[Deut. 10:6]]` on Mosera: agree) | `[[Num. 33:38]]` |
| **The brass serpent** | `[[Num. 21:8]]` (`[[Isa. 45:22]]`, `[[Isa. 14:29]]`, `[[Isa. 6:2]]` on the site: agree) | point |
| The book of the wars of the LORD; the old songs | `[[Num. 21:14]]` (`bd-lost-books`) | 21:17, 27 their own |
| Sihon and Og | `[[Deut. 2:24]]`, `[[Deut. 3:11]]` (`[[Ps. 135:11]]`) | chapter 21 tells the battle and points; the song of Heshbon, `[[Num. 21:27]]` (`[[Jer. 48:45]]`: agree) |
| **Balaam** | chapters 22–24, by question (below) | `[[Deut. 23:3]]`; Deuteronomy's theme *He Turned the Curse into a Blessing*: link |
| **Baal-peor; Phinehas; the covenant of an everlasting priesthood** | `[[Num. 25:3]]`, `[[Num. 25:11]]`, `[[Num. 25:13]]` (`[[Deut. 4:3]]`, `[[Ps. 106:30–31]]`, `[[Hos. 9:10]]`, `[[Mal. 2:4]]`, the volume guide `#covenants`: agree) | `[[Num. 31:16]]` |
| **Zelophehad's daughters** | `[[Num. 27:1]]` (the volume guide *Women and Marriage*: link) | `[[Num. 36:6]]` its own |
| **Joshua set apart** | `[[Num. 27:18]]` (`[[Deut. 34:9]]`, `[[Deut. 31:7]]`: agree) | point |
| The daily offering; the feasts | `[[Ex. 29:38]]`; Leviticus 23; the volume guide `#feasts` | chapters 28–29 their own (the amounts; the new moon, `[[Ps. 81:3]]`; the bullocks of Tabernacles) |
| Vows | `[[Lev. 27:2]]` | chapter 30 its own (a father's or husband's say, 30:5, 8; the volume guide on women: link; the law of a man's say over a woman's vow is not applied to anyone today, and `christ` applies the chapter to a disciple's own covenants) |
| **The herem; the war on Midian** | `[[Deut. 7:2]]` | `[[Num. 21:2]]` (Hormah) and chapter 31 say their own |
| The tribes east of Jordan | `[[Num. 32:6]]` (`[[Deut. 3:18]]`: agree) | point |
| The borders | `[[Num. 34:2]]` (`[[Ezek. 47:15]]`, the volume guide `#inheritance`: agree) | point |
| **Cities of refuge** | `[[Deut. 19:2]]` | chapter 35 its own: the Levites' cities (35:2–8), the death of the high priest (35:25, 28), no ransom (35:31; `[[Ex. 21:30]]`), blood that defiles the land (35:33–34; `[[Isa. 24:5]]`) |

**Three habits of wording, the same in every chapter:** a rendering that is not the King James is “a modern translation”; a point that is an older commentary's alone is “one older reading”; an `explore` bullet points to scripture, and to a study only when it is especially good on this chapter.

## Book-wide conventions

**What in this brief is a lead and not a fact.** Words in quotation marks below were copied from the page named. The rest is the drafter's direction of where to look. None of it goes into a chapter until the writer has read it on a page and given it a ledger row (`STANDARDS.md` §4).

- **`when`.** The book dates itself: 1:1 (the second month of the second year after Egypt), 9:1, 10:11 (the twentieth day of the second month), 20:1 (the first month, no year), 33:38 (Aaron's death, the fortieth year), and `[[Deut. 1:3]]` for the end. **Proposed:** each chapter's `when` is from the text (“At Sinai, in the second year after the Exodus”; “In the wilderness after the refusal at Kadesh; the text gives no year” for 15–19; “On the plains of Moab, in the fortieth year” for 22–36); no B.C. year (`[[Ex. 1:11]]` treats the Exodus's date).
- **Names of God.** Copy any phrase with LORD, Lord or GOD from `data/kjv/numbers.json`; 14:17 reads “my Lord” and 31:28 “the LORD.”
- **The Hebrew numbering differs.** King James 16:36–50 is Hebrew 17:1–15, so King James 17:1–13 is Hebrew 17:16–28; 29:40 is Hebrew 30:1, so chapter 30 runs one ahead; the first words of 26:1 are Hebrew 25:19 (`hebrew.mjs` prints 26:1 oddly, as a “title”: check the Hebrew before a note on that verse). `hebrew.mjs` takes the King James number and prints both; cite the King James verse.
- **Hebrew only where it answers a reader's question** (`STANDARDS.md` §3). Words that pay: *ʾelep* (point to Ex. 12:37), *nāzîr* (6:2), “Cushite” (12:1; the footnote has it), “fiery serpents,” *śārāp* (21:6, 8: Pierce [8]; Rappleye), *qōsēm* and “divination” (22:7; 23:23: Pike [41–43]), “zealous” and “jealousy” (25:11, the same root). No more than about a quarter of a chapter's notes are Language notes.
- **The Joseph Smith Translation.** The Church's footnotes have one reading, 16:10 (“seek ye the high priesthood also”). The manuscript also changes 22:20 (“rise up if thou wilt, and go with them”), which Horton [75] and Pike [57] print; read the manuscript page (Old Testament Revision 2, `jsp-ot2`) before citing it. Both answer a reader's question; use them.
- **Scripture reads Numbers.** The New Testament: `[[John 3:14–15]]` (21:8–9); `[[1 Cor. 10:1–11]]` (the wilderness as example, and 23,000 at 10:8 beside 24,000 at Num. 25:9: say both, give a reason only from a source read); `[[Heb. 3:7–19]]` and Hebrews 4 (the rest not entered); `[[Heb. 5:4]]` (called “as was Aaron”); `[[Heb. 9:4]]` (the rod), `[[Heb. 9:13–14]]` (the heifer's ashes); `[[2 Pet. 2:15]]`, `[[Jude 1:11]]`, `[[Rev. 2:14]]` (Balaam, Korah); `[[Rev. 22:16]]` beside 24:17 (Pike [109] as his). The Book of Mormon: the serpent (`[[1 Ne. 17:41]]`; `[[2 Ne. 25:20]]`; `[[Alma 33:19–22]]`; `[[Alma 37:46]]`; `[[Hel. 8:14–15]]`); the priestly blessing in `[[3 Ne. 19:25]]` (KnoWhy #212); the provocation (`[[Jacob 1:7]]`; `[[Alma 12:36–37]]`). Restoration scripture: D&C 84:6 (Jethro), 84:18–27, 107:13–20, 110:11. Where scripture says what a passage meant, say so as scripture's reading; an echo someone identifies is that author's. **No comparison panel, and nothing is written for a Book of Mormon chapter** (`AUTHORING.md`).
- **The law fulfilled.** As in Leviticus's brief: the law was “a preparatory gospel,” fulfilled in Christ (`[[3 Ne. 15:4–5]]`). **No chapter calls the law primitive.**
- **Theme candidates.** A writer reports an arc that joins chapters in a way a reader would not see chapter by chapter; `propose-themes` and Codex propose the list at the end of the book (leads so far: `THEME-CANDIDATES.md`).

**Habits to avoid:** say a thing once in a chapter; don't re-explain what another chapter or book explains, point; a note's first sentence gives the answer, since the site shows it alone as the note's card; a reading stays a reading in every sentence; Hebrew only where it changes what the reader understands; don't join two verses yourself and call it the text's meaning; application only in `christ`, as statements resting on what it cites, never questions or exhortation. **Not from the Student Manual:** its rabbinic account of the trial of jealousy (17-10, from Clarke), its argument for the Sabbath-breaker from consistency (18-6), and its applications to modern bishops and members (17-24, 18-19).

## Contested and sensitive questions

One approach for each, so that 36 chapters say the same thing. Quotations were copied from the pages named on 2026-10-16; re-read the page before using one.

- **The large numbers (1:46; 26:51).** The site's note at `[[Ex. 12:37]]` gives both readings: a people of some two million, and *ʾelep* as “a family,” clan or “military unit,” which would make far fewer (`ot-manual-large-numbers`); the note calls the second a proposal, not an established result. Pike: “There are reasons to question the literal accuracy of this extremely large number,” but it “functions in part to highlight the ongoing fulfillment of Jehovah's promise to Abraham” [19]. **Proposed:** 1:46 gives the count as the text gives it, says the census was of men “able to go forth to war” from twenty up (1:3), points to Ex. 12:37 for the question of size, and adds Pike's reading of what the count is for. No chapter argues a figure.
- **Who wrote Numbers.** The Bible Dictionary (“Pentateuch”): “The Pentateuch was written by Moses,” though “scribes and copyists have left their traces”; “latter-day revelation confirms that Moses was the author” (`[[1 Ne. 5:11]]`; `[[Moses 1:40–41]]`). The book quotes older writings (21:14, 27) and says Moses wrote the journeys (33:2). KnoWhy #850 (main reference 31:16) gives the documentary hypothesis as one explanation of Balaam's two portraits and the final text read as a unity as another, preferring neither. **Proposed:** chapter 1's `setting` says it in two sentences, pointing to `[[Gen. 1:1]]`'s chapter. **12:3** (“Now the man Moses was very meek”) is a reader's question about authorship: say the verse is set in parentheses in the King James, that the Bible Dictionary allows for later scribes' traces, and give no further reading unless a source read gives one; the note's substance is what meekness is (the Guide to the Scriptures, “Meek”; Elder Bednar, “Meek and Lowly of Heart,” which *Come, Follow Me* names: read it) and how the chapter shows it (12:2–3, 13).
- **Moses' Cushite wife and Miriam's leprosy (12).** The footnote: “Ethiopian” is “HEB Cushite”; the Bible Dictionary places Cush (“Ethiopia”) south of Egypt in the Nile valley (`bd-ethiopia`). Whether she is Zipporah is not settled: the *Old Testament Minute* says they are “most likely different individuals” (`ot-minute-num` [19]); the Student Manual relays Josephus's story of an Ethiopian marriage (17-24, as the manual's). The Lord's answer is about Moses' calling, not the marriage (12:2, 6–8); the minute reads “faithful in all mine house” as possibly “acknowledging Moses's marriage” [21], as its reading. **Proposed:** say what the text says and what it does not (her name; the siblings' reason beyond 12:2). **No note sets Miriam's skin “white as snow” against the wife's origin, or reads color or race into the punishment**, and none speculates about the wife's skin. Where a reader would ask whether the objection was to a foreign or a Black wife, give the Church's words once, in that note, as the Church's: it “disavows the theories advanced in the past that black skin is a sign of divine disfavor or curse … that mixed-race marriages are a sin” (`gte-race-priesthood`). Why only Miriam was struck: the text does not say; the Student Manual gives Keil's answer (she is named first, the verb is feminine) as one older reading, and the minute's [23] as its own.
- **The trial of jealousy (5:11–31).** Say what the law requires, step by step and plainly, and what it does not say (no penalty is carried out by any person; the outcome is left to the LORD, 5:21). Densley (*Interpreter* 32) reads it as a provision that lets a suspicious husband bring the case before the priest rather than act himself [44, 47–49], as his; the volume guide *Women and Marriage* on the law and hard passages: link. **Don't use** the Student Manual's rabbinic description (Clarke). The question a reader asks, why there is no trial for a husband, is answered only from a source read; if none, it goes to `UNANSWERED.md`.
- **The Sabbath-breaker (15:32–36).** Say what happened: “it was not declared what should be done to him” (15:34) until the LORD spoke (15:35), and the penalty was the one already given (`[[Ex. 31:14]]`, read its note and agree). The chapter's own setting is the law of the “presumptuous” sin just before it (15:30–31). The Student Manual's link to the refusal at Kadesh (18-6) is the manual's reading, given as such or not at all. No note says the penalty was often or never carried out.
- **Why Moses and Aaron were barred (20:2–13).** The text's reason: “Because ye believed me not, to sanctify me in the eyes of the children of Israel” (20:12), repeated as rebellion (20:24; 27:14). *Scripture Helps* [22–24]: told to speak, Moses struck the rock twice and asked “Must we fetch you water”; “the scriptures do not fully explain the reasons for this consequence.” Psalm 106:32–33 and `[[Deut. 3:26]]` (“for your sakes”) are on the site. **Proposed:** the note at 20:12 says what the LORD commanded and what Moses did, side by side (20:8–11); the reason the verse gives, in its own words; the “we” of 20:10 as *Scripture Helps* reads it; then points to Deut. 3:26 and Ps. 106:33 for the other readings and to the theme page. What Moses received after (`[[Alma 45:19]]`; Matt. 17; `[[D&C 110:11]]`) is said in `christ`, in a sentence. **No note says Moses lost his exaltation or that the penalty was unjust.** The *Old Testament Minute*'s reading that Moses entered the most holy place for the rod [53] is its own.
- **The brass serpent (21:4–9).** Scripture makes the type: `[[John 3:14–15]]`; Alma calls it “a type” (`[[Alma 33:19]]`). Say it plainly. Then where *Scripture Helps* stops: why a serpent (Pierce: the serpent stands for both judgment and healing in the Bible and the ancient Near East [6, 10]; Rappleye on the winged seraph-serpent and Isaiah 6 [33, 122–123]); what the Book of Mormon adds that Numbers does not, that many would not look “because of the simpleness of the way” (Pierce [19]); and what became of the serpent (`[[2 Kgs. 18:4]]`; Pierce [11]; `halverson-swine` on the site).
- **Balaam (22–24; 31:8, 16).** Pike is the study. Balaam is never called a prophet in these chapters (*Scripture Helps* [29]; Pike [45]); he is “diviner, prophet, and seer” in the text's overlapping roles [47]; “the Lord put a word in Balaam's mouth” (23:5, 16). Latter-day Saint writers have called him a fallen prophet: Elder McConkie, a prophet who “lost his soul in the end because he set his heart on the things of this world” (`mcconkie-balaam`); the Bible Dictionary, “a prophet” bribed by Balak; Pike prefers “a non-Israelite diviner for hire” [52] and says the McConkie reading differs from his [129]. **Proposed:** give *Scripture Helps*' reading (used by the Lord, intentions “not always good,” betrayed Israel at Peor, `[[Rev. 2:14]]`) first, then McConkie's and Pike's as theirs, without choosing. **Why God was angry (22:20–22):** the JST (above) and Pike's “no explicit and compelling answer” [58]. **The speaking ass:** the text gives it to the LORD (22:28); Pike notes readings “from the literal … to the figurative” [60] and the point that the seer could not see what his ass saw [61]; the note gives the text's account and that point, and does not argue whether an animal spoke. **The star (24:17):** the Church's heading reads it of the Messiah; say so, with Pike [109] on how Qumran, Bar Kokhba and Christians read it, as his. **Balaam's two portraits** (blessing in 22–24, Peor's counsel at 31:16): KnoWhy #850 and Pike [112–117], at 31:16, side by side. The Deir ʿAlla inscription (Pike [119–126]): once, at 22:5, briefly.
- **Phinehas and the war on Midian (25; 31).** The Church's newest word is *Scripture Helps*' appendix “Violence and Destruction” (`scripture-helps-violence`): commanded war was “the exception rather than the rule,” and “we should not think that examples of violence in the Old Testament would ever be justification for committing violence today” [6]; Calabro (`calabro-herem`) for Hormah (21:2–3). The text's reasons: Peor's plague and its cause, “through the counsel of Balaam” (31:16), and the LORD's word “Avenge the children of Israel of the Midianites” (31:2). **Proposed:** say what the text says and its reasons; the killing of the women and the boys (31:15–18) is described, not softened or defended beyond the sources; Phinehas's zeal is given as the text and Psalm 106 judge it (25:11–13; `[[Ps. 106:30–31]]`). **No note applies Phinehas to modern discipline** (the Student Manual's 18-19 is not used) and none says the command was not given.
- **Korah and priesthood authority (16–17).** Strathearn (`strathearn-holiness-lord` [18]): Korah held that the LORD's presence made every member holy; Moses' answer showed that holiness “is not something that was automatic,” “the man whom the Lord doth choose, he shall be holy” (16:5, 7). The JST at 16:10 reads “high priesthood”; Horton [86–88] reads it as the Melchizedek Priesthood, as his. Scripture: `[[Heb. 5:4]]`; `[[D&C 84:18–27]]`; `[[D&C 107:13–20]]`. **Proposed:** the note at 16:10 gives the JST, Horton's reading as his, and `[[Heb. 5:4]]`; the restored Aaronic priesthood is said only by pointing to `[[Lev. 8:12]]`. No note draws a lesson about modern dissent beyond what the cited apostles teach.
- **The seventy and “would God that all the LORD's people were prophets” (11).** *Scripture Helps* [11–13] is beside the verse. Go further with the text: the spirit “taken” from Moses and put on the seventy (11:17, 25); prophesying “and did not cease” (KJV) or “did so no more” (a modern translation: check); Joshua's jealousy and Moses' answer. KnoWhy #813 on the Church organized by ancient patterns, as its reading; `[[Joel 2:28–29]]` on the site. 12:6–8 is the limit the next chapter sets: point there.
- **The red heifer (19).** What the rite is and why it is unusual (the clean become unclean in preparing it, 19:7–10). `[[Heb. 9:13–14]]` makes the comparison with Christ's blood: say it as scripture's. No Latter-day Saint study of the chapter was found; the Student Manual (18-12) is one voice. No typology of the writer's own (the color, the cedar, the scarlet).
- **Zelophehad's daughters (27:1–11; 36).** Say what they asked, that Moses “brought their cause before the LORD” (27:5), and what was given, and why chapter 36 limits it (the tribe's land). KnoWhy #639 and the volume guide; Pike's Moussaieff ostracon (`pike-inscriptions` [99]) as a widow's later plea under 27:8–11, as his. The inheritance laws are not applied to anyone today; `christ` applies the chapter to the reader as the standard asks.
- **Joshua set apart (27:15–23).** The text: “a man in whom is the spirit,” “lay thine hand upon him,” “some of thine honour” (27:18–20), Eleazar and the Urim (27:21). The laying on of hands as Latter-day Saints know it (Articles of Faith 1:5) is said in a sentence, from scripture; `[[Deut. 34:9]]` on the site.
- **The priestly blessing (6:22–27).** The site's notes on Psalms 4 and 67 already give its verbs: agree. What is Numbers' own: “put my name upon” (6:27); the silver amulets from Ketef Hinnom, about 600 BC, “remarkably similar” to it (`pike-inscriptions` [54–55]); the Savior's blessing at Bountiful (`[[3 Ne. 19:25]]`; KnoWhy #212 on “face shine” as an idiom for smiling, as its reading).

## Settled without the author

Kinds of decision a reviewer makes by the standard, not a question for the author:

- **No Church, BYU, Scripture Central or *Interpreter* source answers a reader's real question, and an older commentary does:** give its answer as “one older reading.” The Latter-day Saint studies cluster on 6, 11–14, 16, 20–25 and 27. **In a chapter where no such source exists, the limit of a third of the notes does not hold** (author, 2026-10-16: “Yes, lean in Keil since we don't have other sources,” of chapters 3, 5, 6, 8 and 10, as for Lamentations 1 and 5). The condition is the missing source, not the kind of chapter: it is chiefly the lists and laws (1–4, 7–10, 15, 18–19, 26, 28–36), but holds for any chapter with no such source (17, for one). There Keil and the Cambridge Bible may carry as many notes as the reader's questions need, each labelled. Any Church, BYU, Scripture Central or *Interpreter* source that does bear on the chapter still comes first, and an older reading is still never set beside the Church's as an equal. `check-content`'s warning about the count is expected in these chapters.
- **A scholar's reading that a Religious Studies Center, BYU or *Interpreter* publication prints** (Milgrom, Hurowitz, Ashley in Pike) is cited as that publication's author's, as one reading.
- **Numbers and Deuteronomy, or Numbers and Exodus, tell an event differently** (who proposed the spies; why Moses was barred; Mosera and mount Hor): say what each says, side by side; a reason only from a source read; don't harmonize in the writer's words.
- **Two passages share words and no source joins them:** set them side by side as shared wording; draw nothing from it.
- **The King James reads a verse one way and a modern translation another:** the paraphrase starts from the King James; a clarification goes in only with a visible note (`STANDARDS.md` §6).
- **Two faithful sources read a verse differently:** give both, the Church's first, without choosing.
- **A source quoted inside a Church manual** whose own work can't be read (Josephus, Clarke, Keil in the manual) is cited as the manual, for what the manual prints.
- **The Church's footnote points somewhere the note does not go:** leave it.

## Sources for Numbers

Tested 2026-10-16 with the research scripts. `STANDARDS.md` §9 has the general tools. ✓ marks a key already in `sources.yaml` (✚ added with this brief); for any other work, propose an entry, taking author, title and pages from the page.

**What was searched, in this order:** BYU Studies' bibliography of Latter-day Saint writing on the Old Testament (Numbers, [1698–1712]: Horton and McConkie online; Morton's *Ensign* answer on the serpent online, not read; the rest not online); BYU Studies' *Come, Follow Me* page for the week (`…/come-follow-me/old-testament/19`); `search-lds.mjs` on the Religious Studies Center, BYU Studies and *Interpreter* for Numbers and some twenty of its subjects (Balaam, the serpent, Korah, the priestly blessing, the Nazarite, the red heifer, Zelophehad, Phinehas, Miriam, Meribah, the spies, the Cushite wife, the Levites, the census, the seventy, the star); the RSC volumes *From Creation to Sinai* and *From Wilderness to Monarchy* by their contents; `knowhys.mjs numbers <n>` for every chapter (saved) and KnoWhys by words; Scripture Central's archive by web search; *Interpreter*'s journal by its list of addresses and its index of articles by scripture (`interpreterfoundation.org/journal/scriptures/numbers`, six articles), and its study aids. Then *Scripture Helps*, *Come, Follow Me* and the Bible Dictionary; the Student Manual last (both chapters' outlines, and 17-2, 17-10, 17-15, 17-24, 18-6, 18-8, 18-13, 18-19 read); Keil only to confirm its address. **Nothing found** from a Latter-day Saint author on the red heifer, the Nazarite as a subject, the trial of jealousy beyond Densley, the war on Midian, the journeys or the borders.

**BYU and the Religious Studies Center**

- ✚ `pike-balaam`: Dana M. Pike, “Balaam in the Book of Numbers,” *From Creation to Sinai* (RSC, 2021), 561–98, read through: the book's parts and themes [7–25], Balaam's roles [40–53], God's anger and the JST [54–58], the ass [59–62], Pethor [63–68], the oracles as poetry [69–95], 24:17 [96–109], Midian [110], Balaam elsewhere in scripture [111–117], Deir ʿAlla [118–126], Latter-day Saint readings [127–131].
- ✚ `pierce-brazen-serpent`: Krystal V. L. Pierce, *I Glory in My Jesus* (RSC), 87–106: the serpent's two meanings, Nehushtan, John 3, and each Book of Mormon use [5–26].
- ✓ `horton-jst-pentateuch` [72–75, 83–89] (the two JST changes; Korah). ✓ `strathearn-holiness-lord` [18–19] (Korah; the Nazarite as lay holiness). ✓ `thomas-provocation` (the provocation; on the site at Ex. 17:7). ✓ `calabro-herem` (Hormah [19]; Sihon and Og [75]). ✓ `halverson-swine` (the serpent rejected and rehabilitated). ✓ `shannon-documentary`.
- To open before use: Reynolds on Moses typology (*BYU Studies* 44:2); Skinner on serpent symbols (*JBMS* 10:2); “Prophets and Priesthood in the Old Testament” (*Sperry Symposium Classics*).

**Scripture Central**

- ✚ `ot-minute-num`: Noe Correa, *Old Testament Minute: Numbers* (2022, ed. Halverson), on 11–14, 20–24, 27, verse by verse; read with `--find`. Its readings are its own and often devotional (the spies who did not climb the mountain [28]; Moses entering the most holy place [53]): cite as its reading.
- ✓ KnoWhys #212 (priestly blessing), #657 (John 3:14), #850 (31:16; sources and unity); #721, #749, #646, #316 (the serpent in the Book of Mormon), #813 (the seventy), #639 (women), #851 (the journeys and early settlements), #853 (poems in stories): propose keys `sc-knowhy-<n>` as needed.
- ✚ `pike-inscriptions`: Pike, “Israelite Inscriptions from the Time of Jeremiah and Lehi,” *Glimpses of Lehi's Jerusalem* (FARMS, 2004): the Ketef Hinnom amulets [54–70]; the Moussaieff widow's ostracon [99].

***Interpreter***

- ✚ `rappleye-serpents`: Neal Rappleye, “Serpents of Fire and Brass” (*Interpreter* 50, 2022), 217–98: seraph-serpents [33–40], Hezekiah [57–58], the serpent “raised up” [66–81], looking and seeing God [121–126].
- ✚ `densley-adultery`: Steven T. Densley Jr. (*Interpreter* 32, 2019), on the trial of jealousy [35, 43–50].
- Also indexed under Numbers: Bradshaw, “Sorting Out the Sources in Scripture” (9, 2014), and Townsend's reply, on the documentary hypothesis. The study aid for the 2022 lesson (Claybaugh) reads only with `curl` and relays a blogger on the census: not used.

**The Church's sources**

- ✚ `bd-numbers`; ✓ `bd-pentateuch`, `bd-balaam`, `bd-korah`, `bd-nazarite`, `bd-levites`, `bd-aaronic-priesthood`, `bd-ethiopia`, `bd-lost-books` and many more (search `sources.yaml` for `bd-`). Check every new entry's heading.
- ✓ `scripture-helps-num`; ✓ `scripture-helps-violence`, `scripture-helps-women`; ✚ `cfm-ot-2026-19`; ✓ `gte-race-priesthood`; ✚ `mcconkie-balaam` (*New Era*, Apr. 1972).
- Talks *Scripture Helps* and *Come, Follow Me* name (Oaks, “Two Lines of Communication”; Renlund, “A Framework for Personal Revelation”; Nelson, “Revelation for the Church, Revelation for Our Lives”; Bednar, “Meek and Lowly of Heart”; Christofferson, “Look to God and Live,” 2025): read each from its own page; quote at most once on the site.
- ✓ `ot-manual-numbers-13-36`, ✚ `ot-manual-numbers-1-12`, ✓ `ot-manual-large-numbers`, **after everything above**, one voice, in no more than a third of a chapter's notes.

**The text and the older commentaries:** `oshb-wlc`, `biblehub-interlinear`, `bdb`, `lxx-rahlfs` (Brenton, `biblehub.com/sep/numbers/<c>.htm`), `nrsvue`, `niv`, `esv`, `webster-1828`; ✚ `keil-numbers` (`biblehub.com/commentaries/kad/numbers/<c>.htm`) and the Cambridge Bible on Bible Hub (propose `cambridge-numbers`) as **a last resort**, “one older reading.” The saved footnotes' “HEB” and “IE” aids are beside the verse: use one only to go further.

**Keys for new sources:** `bd-<entry>`, `gs-<entry>`, `sc-knowhy-<number>`; a talk `<surname>-<one or two words>`; an article likewise. Check `content/sources.yaml` first.

**Not readable (don't cite):** ScholarsArchive PDFs; the *Studies in Scripture* and Sperry volumes the bibliography lists; Taggart's BYU Studies reflection for the week (no address found); Muhlestein's “The Exodus” (RSC page printed no text); the scholars Pike quotes (Milgrom, Ashley, Hurowitz, Freedman: cite Pike for what he prints).

## The text

`data/kjv/numbers.json` was imported on 2026-10-16 (36 chapters, 1,288 verses) and compared with the Gospel Library edition by `scripts/check-kjv.mjs numbers`, which reports no difference. The corrections are entries in `LDS_SPELLINGS` in `scripts/fetch-kjv.mjs`: hyphenated place names (Ije-abarim, Kirjath-huzoth, Beth-nimrah, Beth-haran, Baal-meon, Havoth-jair, Rimmon-parez, Bene-jaakan, Hor-hagidgad, Dibon-gad, Almon-diblathaim, Beth-jesimoth, Abel-shittim, Hazar-addar, Hazar-enan), “mixed multitude” (11:4), “day time” (14:14), “my Lord” (14:17), “To morrow” (14:25), “every thing” and “any thing” (18:7; 20:19), a comma (18:9), and “the LORD” (31:28).

## Checks while the book is in preview

```sh
node scripts/check-chapter.mjs numbers <n>
```

It runs `fix-yaml`, the preview build into `.cache/batch/numbers/dist-NN`, `check-quotes`, `check-content` (with the proposed entries), and `check-ledger`. The working folder for a batch is `.cache/batch/numbers/` (not committed): `proposed/NN.yaml`, `reports/NN-writer.md`, `reports/NN-check.md`.

## Reader questions no source answered

In `content/numbers/UNANSWERED.md`, by chapter, once the first batch is written.
