# 2 Chronicles brief

Book-level decisions for 2 Chronicles. The site-wide standard is in `STANDARDS.md`. **1 and 2 Chronicles are one book in Hebrew, and `content/1-chronicles/BRIEF.md` holds what both share; read it first**, all but its own chapter-by-chapter sections: “What the author has decided,” **“How Chronicles is written beside Samuel and Kings”** (the approach every chapter of this book follows, and the parallel table), “Book-wide conventions” (with the large numbers and the Joseph Smith Translation), the habits to avoid, the first items of “Contested and sensitive questions” (the writer and date, the omissions, Moriah, Christ in Chronicles), “Settled without the author,” and “Sources for 1 and 2 Chronicles.” This file holds 2 Chronicles' own chapters and questions. **Almost all of 2 Chronicles' narrative is already told on the site**: 1 Kings 3–12 and 14–15, 1 Kings 22, nearly all of 2 Kings, Isaiah 36–39 (2 Chr. 32), Jeremiah 52 (2 Chr. 36) and Ezra 1 (2 Chr. 36:22–23), and many Kings notes already quote what Chronicles adds. Read “Explained once: where” before writing.

**Status (2026-11-13):** drafted from the sources named in 1 Chronicles' brief, read in the session with the research scripts on 2026-11-13. The author chose these books and has not read this brief. Where a section says “Proposed,” that is the approach the chapters follow; it is the drafter's decision, not a fact from a source, and the author can overturn it.

Related files: `OPEN-QUESTIONS.md` at the top of the repository; `THEME-CANDIDATES.md` and `UNANSWERED.md` in this folder, once there is something to put in them.

## State of the book

`node scripts/status.mjs 2-chronicles` prints what the repository shows; the history is `git log -- content/2-chronicles`. What a script can't see:

- **In preview; all 36 chapters are written, checked and reviewed** (2026-11-13), and the author has read none of them. The language pass is recorded for every chapter (2026-11-14); the gaps Codex found went to a writer first (1 Chr. 3, 24; 2 Chr. 14, 15, 17, 25, 27, 32). Chapters 15, 19 and 31 were then reworked to rest less on Keil and the Cambridge Bible, as Kings' were; 34 and 35 cite them in half their notes, where no higher source answers.
- **The illustration is approved** (2026-11-13, candidate 2): the temple's doors opened (29:3) between Jachin and Boaz, Manasseh's open fetters (33:11–13), the broken Passover bread (30:18–20). The first candidate's plain doorway read as a city gate; describing the porch, pillars, doors and interior in the Bible's words (3:4–17; 4:22) fixed it in one edit.
- **Two theme pages** (the author's choice, 2026-11-14), outlined by Fable, written and reviewed by Opus, read by Codex, with `review: unread`: “Seek My Face … and I Will Heal” (`themes/seek-my-face.md`; notes 7:14, 30:20, 36:16 and 1 Chr. 15:13 link to it) and “The LORD His God Be with Him” (`themes/with-him.md`; notes 15:2, 32:8, 36:23). Their reviews set guidelines: 7:14's “seek” is *bāqaš*, not the *dāraš* of 1 Chronicles; the promise's “hear” is kept several times (12:7; 33:13; 34:27), only its “heal” once (30:20); the terms of 15:2 do not end in forsaking (15:4; Jer. 29:10–14); and no Latter-day Saint source ties Matt. 28 to Cyrus's decree.
- **Research** is shared with 1 Chronicles, in `.cache/batch/chronicles/research/` (1 Chronicles' brief, “State of the book”). The Church's footnotes and chapter headings for every chapter are in `.cache/batch/2-chronicles/fn<n>.txt`.

## What the author has decided

Nothing beyond choosing the books; 1 Chronicles' brief says how the standing rules land. For 2 Chronicles: *Scripture Helps* covers 14–20, 26 and 30 (`scripture-helps-2-chronicles`: the northern settlers [11], Asa's covenant [12], the lying spirit by reference to 1 Kings [14], Jehu's and Eliezer's rebukes [15]–[16], Jehoshaphat's prayer and Solomon's [17]–[18], the high places [19], Uzziah's two names and his incense [21]–[24], Hezekiah's Passover [26]–[28]) and nothing else. *Come, Follow Me* (`cfm-ot-2026-30`) reads Asa's trust (14–16), Micaiah's courage (18), Jehoshaphat's prayer and “believe his prophets” (20), Uzziah's pride (26) and Hezekiah as a peacemaker (30). The seminary manual has only the introduction and a review lesson (`ot-seminary-lesson-102`, on 36:14–20 the prophets sent in compassion). *Scripture Helps* quotes Elder Soares on Uzziah, and points to President Hinckley's “Believe His Prophets” for 20:20; each at most once on the site.

## What a chapter is for here

2 Chronicles is 822 verses in 36 chapters: Solomon's temple, then the kings of Judah to the fall of Jerusalem and the decree of Cyrus. The northern kingdom appears only where it touches Judah (`ot-seminary-chronicles-intro` [6]; *Scripture Helps* 28 [5]). Questions a careful reader would ask, by chapter (a start, not a limit):

- **1–4:** *Why does Chronicles tell Gibeon without the dream (1:7; 1 Kgs. 3:5)? Who was Huram, and why “Huram” and not Hiram? What is mount Moriah, and why name it (3:1)? Why are the pillars thirty-five cubits here and eighteen in Kings, and the sea three thousand baths and not two? What were the ten lavers and tables?*
- **5–7:** *Why do the Levites and singers stand at the dedication, and what happened when they sang “as one” (5:12–14)? Why the brasen scaffold (6:13)? Why does Solomon's prayer end with Psalm 132 (6:41–42)? Why fire from heaven (7:1), and what is the promise of 7:14, “If my people … humble themselves,” which Kings does not have?*
- **8–12:** *Why does Pharaoh's daughter move out of the city of David (8:11)? Why is Solomon's turning (1 Kgs. 11) left out? Why did Levites and others from the north come to Judah (11:13–17)? What did Shishak's invasion teach, “that they may know my service, and the service of the kingdoms” (12:8)?*
- **13–16:** *Why does Abijah, whom Kings calls a sinner (1 Kgs. 15:3), preach to Jeroboam's army (13:4–12)? Who was Zerah the Ethiopian, and can a host of a million be right (14:9)? What did Azariah's word and the covenant ask (15:1–15)? Why was Asa rebuked for relying on Syria, and what does “sought not to the LORD, but to the physicians” mean (16:7–12)? What are “the eyes of the LORD” (16:9)?*
- **17–20:** *What was the book of the law the Levites taught from (17:9)? Why did Jehoshaphat ally with Ahab, and what does the Joseph Smith Translation change in Micaiah's vision (18)? Why was Jehoshaphat rebuked, and what did his judges do (19)? How did the battle become singing (20:21–22)? What does “believe his prophets, so shall ye prosper” promise? Why did the high places remain (20:33)?*
- **21–24:** *How could Elijah send Jehoram a letter (21:12)? Forty-two or twenty-two (22:2)? How did Joash survive, and why did he turn after Jehoiada died? Who was Zechariah, and is he the Zacharias of Matt. 23:35?*
- **25–28:** *Why did Amaziah send home the hired men of Israel, and why worship the gods of Edom he had defeated (25:7–14)? Why was it wrong for Uzziah to burn incense, and why is he called Azariah in Kings? Who was Oded, and why did Israel send Judah's captives home (28:9–15)? Why did Ahaz shut the temple doors?*
- **29–32:** *What did cleansing the temple involve, and why did the Levites outdo the priests (29:34)? Why a Passover in the second month, and why were the unclean pardoned (30)? Why tithes in heaps (31)? How does Chronicles tell Sennacherib beside Kings and Isaiah, and what does “God left him, to try him” mean (32:31)?*
- **33–36:** *How could Manasseh, after all that Kings tells, be heard (33:12–13)? What is the Prayer of Manasses? Why did Josiah seek God at sixteen (34:3)? Why did Necho's words come “from the mouth of God,” and why did Josiah die for not hearing them (35:21–22)? Eight or eighteen (36:9)? What are the land's sabbaths and the seventy years (36:21)? Why does the book end in the middle of a sentence of Cyrus?*

A chapter answers those from the text first. (The `christ` section then applies the chapter to the reader, in statements: `STANDARDS.md` §1.)

**Read the history as the Chronicler framed it.** The LORD's answer to Solomon sets the measure for every king after him: “If my people … shall humble themselves, and pray, and seek my face, and turn from their wicked ways; then will I hear from heaven” (7:14). The kings who seek the LORD are helped and those who forsake Him are forsaken (“The LORD is with you, while ye be with him … but if ye forsake him, he will forsake you,” 15:2), often in their own lifetimes; KnoWhy #861 says that in Chronicles rewards and punishments “are not usually delayed” (`sc-knowhy-861` [7]) and that both Kings' and Chronicles' views are needed (“Both Kings and Chronicles are necessary,” [14]). Humbling oneself is the turn the book watches for (Rehoboam, 12:6–7, 12; Hezekiah, 32:26; Manasseh, 33:12; Josiah, 34:27; Zedekiah, who did not, 36:12). Say what a pattern shows where a source shows it; don't build a scheme of the writer's own, and don't say that every misfortune in the book is a punishment where the text does not.

**Thirty-six chapters, most told already.** The approach is 1 Chronicles' brief's (“How Chronicles is written beside Samuel and Kings”). The chapters with the most of their own are 5–7 (the singers, the fire, 7:14), 13–20 (Abijah, Asa, Jehoshaphat), 24 (Zechariah), 26, 28:9–15, 29–31, 33 and 35; 9, 10, 23 and 27 are nearly all parallel and need few notes.

## Divisions

*Scripture Helps* gives 1 Chr. 10–2 Chr. 9, 2 Chr. 10–35 and 36 (28 [8]–[10]); the seminary manual 1–9, 10–35, 36 (`ot-seminary-chronicles-intro` [10]–[12]). **Proposed:** three, with titles in the King James' words: Solomon (1–9); the kings of Judah to Ahaz (10–28); and Hezekiah to Cyrus (29–36), because Hezekiah's reopening of the temple begins the last movement (cleansing, two Passovers, Manasseh's return, the burning and the decree), and a division of one chapter (36) would leave the book's end with nothing beside it.

| Chapters | Division (key) |
|---|---|
| 1–9 | The Glory of the LORD Filled the House (`chrglory`, 7:1; 5:14) |
| 10–28 | Believe in the LORD Your God (`chrbelieve`, 20:20) |
| 29–36 | If Ye Return unto Him (`chrreturn`, 30:9) |

No key collides with another book's (`grep key: content/*/book.yaml`, 2026-11-13). **Periods:** 1–9 belong to `kingdom`; 10–32 to `assyria` (*Two Kingdoms and Assyria*, to the end of Hezekiah's reign, as 2 Kings 1–20); 33–36 to `babylon` (*Babylon and the Exile*, from Manasseh, as 2 Kings 21–25). The decree of Cyrus (36:22–23) is *Persia and the Return*'s; the chapter's `setting` points there.

## Explained once: where

**A chapter that needs one of these says it in a clause and points to the place named with a `[[reference]]`; it does not explain it again or print the quotation again.** Places in 1 Chronicles are written first, in its own batches; places in other books are already written: read them (`node scripts/occurrences.mjs 2-chronicles "<phrase>" --site all`) and agree. 1 Chronicles' table holds the entries both books use (the book, its sources, Moriah, the books of the seers).

| What | Explained in full at | Elsewhere |
|---|---|---|
| Gibeon, the tabernacle there, Solomon's request | `[[1 Kgs. 3:4]]` and `[[1 Kgs. 3:9]]` on the site: agree, link; `[[2 Chr. 1:3]]` only for what Chronicles changes (no dream; the brasen altar of Bezaleel) | 1 Chr. 16:39 points |
| Huram, Tyre, the levy | `[[1 Kgs. 5:1]]`, `[[1 Kgs. 7:14]]`, `[[1 Kgs. 5:13]]` on the site: agree, link; `[[2 Chr. 2:17]]` for the strangers numbered | nothing |
| Moriah | 1 Chronicles' brief (`[[Gen. 22:2]]`, `[[2 Sam. 24:18]]` on the site); `[[2 Chr. 3:1]]` says what Chronicles adds | nothing |
| **The temple's plan and furnishings; the different figures** | `[[1 Kgs. 6:2]]`, `[[1 Kgs. 7:21]]`, `[[1 Kgs. 7:23]]`, `[[1 Kgs. 7:25]]` on the site: agree, link; `[[2 Chr. 3:15]]` and `[[2 Chr. 4:5]]` for the figures (1 Chronicles' brief, “Large numbers”) | 4:6–8 (lavers, tables) in a clause |
| **The singers at the dedication; the cloud** | `[[2 Chr. 5:13]]` (only here; `hopkin-psalms-sung` [12]); `[[1 Kgs. 8:10]]` (“The cloud of glory”) on the site: agree, link | 7:6; 29:25–30 point |
| **Solomon's prayer; D&C 109** | `[[1 Kgs. 8:22]]`–53 on the site (“The prayer behind D&C 109,” “Praying toward the house”): agree, link; `[[2 Chr. 6:13]]` (the scaffold) and `[[2 Chr. 6:41]]` (Ps. 132:8–10; `[[Ps. 132:8]]` on the site) only for what Chronicles adds; KnoWhy #814 on Kirtland, if needed | 20:8–9 points |
| **Fire from heaven** | `[[2 Chr. 7:1]]`; `[[1 Kgs. 18:38]]` (“The fire of the LORD”) on the site: agree | 1 Chr. 21:26 points |
| **“If my people … humble themselves” (7:14)** | `[[2 Chr. 7:14]]` (only here; the book's measure, above) | 12:6–12; 30:9; 32:26; 33:12; 34:27; 36:12 point |
| The temple's condition | `[[1 Kgs. 9:6]]` on the site: agree, link | 7:19–22 in a clause |
| The queen of Sheba; Solomon's wealth | `[[1 Kgs. 10:1]]`, `[[1 Kgs. 4:26]]` on the site: agree, link | 9:25 (the figure) in a clause |
| **What Chronicles leaves out of Solomon** | chapter 9 `setting` (1 Chronicles' brief, “Contested,” the omissions); `[[1 Kgs. 11:3]]` on the site | nothing |
| Rehoboam and the division | 1 Kings 12's notes on the site: agree, link | 10 in a clause |
| **Northerners who came to Judah** | `[[2 Chr. 11:13]]`–17 and `[[2 Chr. 15:9]]` (*Scripture Helps* 28 [11]; KnoWhy #708); `[[1 Kgs. 12:17]]` (“Israelites who stayed with Judah”) on the site: agree, link | 30:11, 18 point |
| Shishak | `[[1 Kgs. 14:25]]` on the site: agree, link; `[[2 Chr. 12:8]]` for what Chronicles adds | nothing |
| **Abijah's speech** | `[[2 Chr. 13:5]]` (the covenant of salt; `[[Num. 18:19]]`), `[[2 Chr. 13:8]]` | nothing |
| **Asa: the covenant, Hanani's rebuke, the physicians** | `[[2 Chr. 15:12]]` (*Scripture Helps* 28 [12]), `[[2 Chr. 16:9]]`, `[[2 Chr. 16:12]]` (“Contested”); `[[1 Kgs. 15:14]]`, `[[1 Kgs. 15:19]]`, `[[1 Kgs. 15:23]]` and the `christ` of 1 Kgs. 15 on the site: agree, link | nothing |
| Jehu the son of Hanani | `[[1 Kgs. 16:1]]` on the site: agree, link | 19:2; 20:34 |
| Jehoshaphat's teachers and judges | `[[2 Chr. 17:9]]`, `[[2 Chr. 19:6]]` | nothing |
| **The lying spirit; the JST of 18:20–22** | `[[1 Kgs. 22:22]]` on the site (it already gives the JST of Chronicles): agree, link; `[[2 Chr. 18:21]]` gives the JST's three changes in a clause each (“Contested”) | nothing |
| **Jehoshaphat's prayer and “believe his prophets”** | `[[2 Chr. 20:12]]` (*Scripture Helps* 28 [17]–[18]), `[[2 Chr. 20:20]]` (Hinckley, `hinckley-believe-his-prophets-1992`; `cfm-ot-2026-30`) | 20:15–17 (`[[1 Sam. 17:47]]` on the site) in a clause |
| High places that remained | `[[2 Chr. 20:33]]` (*Scripture Helps* 28 [19]); `[[1 Kgs. 3:2]]` on the site: agree, link | 15:17 points |
| Jehoshaphat's ships | `[[1 Kgs. 22:48]]` on the site: agree, link | 20:35–37 |
| **Elijah's letter** | `[[2 Chr. 21:12]]` (“Contested”) | nothing |
| **Forty-two or twenty-two; the JST of 22:2** | `[[2 Kgs. 8:26]]` (“Twenty-two or forty-two”) on the site: agree, link; 22:2 adds KnoWhy #786 [13] in a clause if needed | nothing |
| Athaliah and Joash | 2 Kings 11's notes on the site: agree, link | 22:10–23:21 |
| **Zechariah son of Jehoiada; Matt. 23:35** | `[[2 Chr. 24:20]]`–22 in full; `[[2 Kgs. 12:2]]`, `[[2 Kgs. 12:20]]`, the `christ` of 2 Kgs. 12 and the 2 Kings theme page “Innocent Blood” on the site: agree, link | nothing |
| Amaziah and the gods of Edom | `[[2 Chr. 25:14]]`; `[[2 Kgs. 14:8]]`, `[[2 Kgs. 14:11]]` on the site: agree, link | nothing |
| **Uzziah: his names, his incense, his leprosy** | `[[2 Chr. 26:16]]` (*Scripture Helps* 28 [21]–[24]; `davis-bended-rules` [2]; `[[Num. 16:40]]`); `[[2 Kgs. 14:21]]` (“Azariah, also called Uzziah”) and `[[2 Kgs. 15:5]]` on the site: agree, link | `[[Isa. 6:1]]` on the site |
| Ahaz | 2 Kings 16's notes and `[[Isa. 7:1]]` on the site: agree, link | nothing |
| **Oded and the captives sent home** | `[[2 Chr. 28:9]]`–15 (only here) | nothing |
| **Hezekiah cleanses the temple** | `[[2 Chr. 29:5]]`, `[[2 Chr. 29:34]]`; `[[Neh. 12:30]]` (“Purifying a wall”) on the site | nothing |
| **Hezekiah's Passover; the unclean pardoned** | `[[2 Chr. 30:2]]` (*Scripture Helps* 28 [27]; `[[Num. 9:11]]`), `[[2 Chr. 30:18]]`–20 (*Scripture Helps* 28 [28]; `davis-bended-rules` [3]–[5]); the *Law and Covenant* guide (`#feasts`) | 35:18 points |
| Tithes and offerings | `[[2 Chr. 31:5]]`; Mal. 3 on the site: agree, link | nothing |
| **Sennacherib; Hezekiah's sickness, pride and the envoys** | Isaiah 36–39 and 2 Kings 18–20 on the site: **agree, link; write only where Chronicles differs** (32:1–8, the water stopped and the wall; 32:25–26, 31, “God left him, to try him,” which the 2 Kgs. 20 `thread` already quotes) | nothing |
| **Manasseh's captivity and repentance** | `[[2 Chr. 33:12]]`–13 in full (“Contested”); `[[2 Kgs. 21:17]]` (“The repentance Kings leaves out”) and `[[2 Kgs. 21:11]]` on the site: agree, link | 33:18–19 points |
| **Josiah's reform, the book, Huldah** | `[[2 Chr. 34:3]]` for the order Chronicles gives (the reform before the book); `[[2 Kgs. 22:1]]`, `[[2 Kgs. 22:8]]`, `[[2 Kgs. 22:14]]` on the site: agree, link | nothing |
| **Josiah's Passover** | `[[2 Chr. 35:3]]`, `[[2 Chr. 35:18]]`; `[[2 Kgs. 23:21]]` (“A Passover kept by the book”) and `[[Ezra 6]]`'s Passover on the site: agree, link | nothing |
| **Josiah's death; Necho's word “from the mouth of God”** | `[[2 Chr. 35:22]]` (“Contested”); `[[2 Kgs. 23:29]]` on the site: agree, link | 35:25 (Jeremiah's lament) in a clause |
| The last kings; Jehoiachin's age | `[[2 Chr. 36:9]]` (eight against eighteen at 2 Kgs. 24:8; 1 Chronicles' brief, “Large numbers”); 2 Kings 24–25 and Jeremiah 52 on the site: agree, link | nothing |
| **The prophets sent in compassion** | `[[2 Chr. 36:15]]`–16 (`ot-seminary-lesson-102` [26]–[33]; KnoWhy #441) | nothing |
| **The land's sabbaths; the seventy years** | `[[2 Chr. 36:21]]`; `[[Lev. 26:34]]` (“The land keeps its sabbaths”), `[[Ex. 23:11]]` and Jeremiah 25 and 29 on the site: agree, link | nothing |
| **The decree of Cyrus** | `[[2 Chr. 36:22]]`–23 for why the book ends there; `[[Ezra 1:1]]` (“Why a Persian king sent them home”) and Isaiah 44:28–45:1 on the site: agree, link | nothing |

## Contested and sensitive questions

The approach to the writer, the date, the omissions, the numbers, Moriah and Christ in Chronicles is 1 Chronicles' (its brief). Quotations were copied from the pages named on 2026-11-13; re-read the page before using one.

- **The lying spirit and its Joseph Smith Translation (18:18–22).** The site's note at 1 Kgs. 22:22 already explains it from *Scripture Helps* (25 [26] and endnote 25), the JST of this chapter and the Student Manual's older reading. The JST of 18:20–22 is this book's own text: “Then there came out a lying spirit, and stood before them”; “for all these have sinned against me”; “the Lord hath found a lying spirit” (Nyman's transcription, `nyman-jst-historical` [61]–[67]; the Appendix prints 18:22). **Proposed:** one note at 18:21 gives the three changes, the Appendix's heading as the Church's statement, and points to 1 Kgs. 22:22 for the rest; it does not repeat that note's argument. **No note says God lies or deceives.**
- **Manasseh's repentance (33:11–19) and the Prayer of Manasses.** The text: in affliction “he besought the LORD his God, and humbled himself greatly,” and the LORD “was entreated of him, and heard his supplication, and brought him again to Jerusalem into his kingdom. Then Manasseh knew that the LORD he was God” (33:12–13); he took away the idols and restored the altar (33:15–16), but “the people did sacrifice still in the high places” (33:17). The site's note at 2 Kgs. 21:17 already gives this and two older readings of why Kings leaves it out. 2 Kings' brief set two guidelines for any page on Manasseh: no page says reprieve never depends on conduct, and **no page says Christ's blood answers for the innocent blood Manasseh shed** (the murderer's pardon: Num. 35:31; Alma 34:12; D&C 42:18; the 2 Kings theme page “Innocent Blood”). Chronicles does not mention the innocent blood of 2 Kgs. 21:16. His prayer is “written among the sayings of the seers” (33:19; `bd-lost-books` [1]); the Prayer of Manasses in the Apocrypha is “a penitential prayer built up, for the most part, of sentences and phrases taken from the canonical scriptures. There is little reason for giving it the title that it bears” (`bd-apocrypha` [20]); the Lord's word on the Apocrypha is D&C 91:1–2 (the *How the Old Testament Came to Us* guide quotes it). **Proposed:** 33:12–13 says what the text says Manasseh did and what the LORD did, in the text's words: he was heard and restored, and knew the LORD; it does not say what became of his sins beyond that, and does not set his repentance against D&C 42:18 in either direction. 33:19 says in a clause that the prayer itself is lost and that the apocryphal prayer bears the name, with the Bible Dictionary's judgment and D&C 91. The `christ` section may say that the LORD heard the worst of Judah's kings when he humbled himself (7:14; 33:12), in statements, without a promise the text does not make.
- **Uzziah (26:16–21).** *Scripture Helps*: only priests could burn incense, and Uzziah's success led to “a prideful heart and an overreach of his authority” (28 [22]), with Elder Soares's words ([23]–[24]); Davis contrasts him with Hezekiah's Passover (`davis-bended-rules` [2]–[4], his; his note 1 on Kings' reason for the leprosy is a slip, `byu.md`). **Proposed:** 26:16 gives the text, the law (Num. 16:40; 18:7), *Scripture Helps*' sentence, and points to 2 Kgs. 15:5 on the site; Elder Soares quoted only if the note needs his words.
- **Asa and the physicians (16:12).** “yet in his disease he sought not to the LORD, but to the physicians.” The site's note at 1 Kgs. 15:23 (“Diseased in his feet”) already treats it. **Proposed:** the note says that the charge is that he did not seek the LORD, in the book's verb (16:12; 15:2; 7:14), and agrees with the 1 Kings note; **no note says or implies that seeking medical help is faithless**. If a source on ancient physicians is used, it is cited and said to be its author's.
- **Elijah's letter (21:12–15).** Chronicles says “there came a writing to him from Elijah the prophet”; Kings tells Elijah's taking up before Jehoram of Judah's reign is told and has Elisha serving in Jehoshaphat's day (2 Kgs. 2; 3:11). The seminary manual names the letter as a detail found only in Chronicles (`ot-seminary-chronicles-intro` [6]); no Latter-day Saint source read explains the timing. Keil holds that Elijah wrote it before he was taken and rejects a letter from heaven (`keil-chronicles`, 2 Chr. 21 [35]: one older reading). **Proposed:** 21:12 says what the text says, names the question, gives Keil's as one older reading, and does not settle it.
- **Josiah's death and Necho's word (35:20–24).** Necho's message is “from the mouth of God” (35:22) and Josiah “hearkened not”; KnoWhy #861 reads it as a timely punishment for ignoring God ([8]: but its last sentence there is reversed, a slip; don't cite it). Kings says only that Necho slew him (2 Kgs. 23:29; the site's note: agree, link); 2 Kgs. 22:20 had promised him burial “in peace.” The 2026 *Interpreter* study helps relay a reading of the disguise (35:22) as linking Josiah with Saul, Jeroboam and Ahab (theirs; `curl` only). **Proposed:** 35:22 gives the text, the KnoWhy's reading as its own, and the 2 Kings note's account; no verdict on Josiah in the writer's voice, and the promise of 34:28 (“in peace”) is said to be the text's and left as it stands unless a source explains it.
- **Reward and punishment in the kings' lifetimes** (above, “Read the history”). KnoWhy #861 says both views, Kings' delayed judgment and Chronicles' timely one, are needed and that “People are not punished for the sins of others, yet the sins of others can cause terrible things to happen in people's lives” ([14]). **Proposed:** a note that explains a defeat or a disease as a punishment does so because the text says so (16:7–9, 12; 21:18; 24:24; 26:19–20), never on its own reasoning; Kings' account and the site's notes on it stand beside Chronicles', not against it.
- **“Believe his prophets” (20:20).** The Church reads it as a promise to those who follow living prophets (*Come, Follow Me*; President Hinckley's talk takes it as its text). **Proposed:** the note says what Jehoshaphat said and what followed (20:21–23), with the Hinckley talk as the Latter-day Prophets note, quoted briefly and once; the application is in `christ`, as a statement.
- **Christ in 2 Chronicles.** Scripture's own use first: Zacharias's blood (Matt. 23:35; Luke 11:51; the site's notes at 2 Kgs. 12: agree, link). Then the Church's and faithful scholarship's: the house the LORD filled and promised to hear from (7:1, 14; *Scripture Helps* 28 [17]: Jehoshaphat relied on Solomon's prayer); the LORD who “healed the people” who prepared their hearts though unclean (30:18–20; *Scripture Helps* 28 [28]; Davis [5], his); the prophets sent in compassion (36:15; seminary lesson 102); Manasseh heard (33:12–13, within the limits above). **Proposed:** each in `christ` or at the note named, in the source's words. **No chapter makes the brasen scaffold, the lavers, the Levites' trumpets or Cyrus a type of Christ in the writer's words** (the site's Isaiah notes on Cyrus as the LORD's anointed are Isaiah's: point, don't extend).

## Sources

Shared with 1 Chronicles (its brief, “Sources for 1 and 2 Chronicles”). Particular to 2 Chronicles:

- *Scripture Helps* `scripture-helps-2-chronicles` (28), the only chapter; `scripture-helps-1-kings` (25 [26], the lying spirit). `cfm-ot-2026-30`; `ot-seminary-lesson-102`; the Student Manual's Kings chapters (`ot-manual-4`, `ot-manual-12`, `ot-manual-19`; `ot-manual-kings-a`), last.
- `hinckley-believe-his-prophets-1992` (20:20); `davis-bended-rules` (26; 30); `hopkin-psalms-sung` [12] (5:12–13); `nyman-jst-historical` [58]–[68] (the JST in 2 Chronicles); KnoWhys #861, #786, #441, #637, #708, #814; `satterfield-divine-justification` and `seely-woods-jerusalem-destroyed` (the fall: Hezekiah's and Manasseh's reigns in Chronicles, 36:5, 15–16); `pierce-israelite-refugees` (30); `interpreter-cfm-2026-2-chronicles` (`curl` only).
- Bible Dictionary: `bd-asa`, `bd-jehoshaphat`, `bd-uzziah`, `bd-hezekiah`, `bd-josiah`, `bd-manasseh`, `bd-apocrypha` [20], `bd-cyrus`, `bd-ahaz`, `bd-jehoiachin`, `bd-zedekiah`, `bd-nebuchadnezzar`, `bd-high-places`, `bd-temple-of-solomon`, `bd-sabbatical-year`. The Septuagint is Brenton at `biblehub.com/sep/2_chronicles/<c>.htm` (read).

## The text

`data/kjv/2-chronicles.json` was imported on 2026-11-13 (36 chapters, 822 verses) and compared with the Gospel Library edition by `scripts/check-kjv.mjs 2-chronicles`, which reports no difference (1 Chronicles' brief, “The text”). Chronicles spells names its own way (Huram, Hiram's name here; Ezion-geber; Carchemish): **when quoting Kings or Isaiah beside Chronicles, copy each from its own file.**

## Checks while the book is in preview

```sh
node scripts/check-chapter.mjs 2-chronicles <n>
```

The working folder for a batch is `.cache/batch/2-chronicles/` (not committed).

## Reader questions no source answered

In `UNANSWERED.md`, once a batch has some.
