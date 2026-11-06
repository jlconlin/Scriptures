# 2 Kings brief

Book-level decisions for 2 Kings. The site-wide standard is in `STANDARDS.md`. **1 and 2 Kings are one book in Hebrew, and `content/1-kings/BRIEF.md` holds what both share; read it first**, all but its own chapter-by-chapter sections: “What the author has decided,” “Book-wide conventions,” the habits to avoid, the first item of “Contested and sensitive questions” (the writer), the lying spirit and the Church's Elijah, “Settled without the author,” and “Sources for 1 and 2 Kings.” This file holds 2 Kings' own chapters and questions. **Much of 2 Kings is already told on the site**: Isaiah 36–39 is 18:13–20:19 (47 notes), Jeremiah 52 is 24:18–25:30 (15 notes) and Jeremiah 39 tells the city's fall again; Hosea 1 explains Jehu's house and Jezreel, Jonah 1 and Amos 7 set Jeroboam II, Isaiah 7 meets Ahaz, and Malachi 4 explains why Elijah was the one sent. Read “Explained once: where” before writing.

**Status (2026-11-05):** drafted from the sources named in 1 Kings' brief, read in the session with the research scripts on 2026-11-05. The author chose these books and has not read this brief. Where a section says “Proposed,” that is the approach the chapters follow; it is the drafter's decision, not a fact from a source, and the author can overturn it.

Related files: `OPEN-QUESTIONS.md` at the top of the repository; `THEME-CANDIDATES.md` and `UNANSWERED.md` in this folder, once there is something to put in them.

## State of the book

`node scripts/status.mjs 2-kings` prints what the repository shows; the history is `git log -- content/2-kings`. What a script can't see:

- **In preview; all 25 chapters are written, checked and reviewed** (2026-11-05), and the author has read none of them. Chapters 13, 16 and 22 have 3 of 7 or 8 notes on Keil or the Cambridge Bible, where no higher source answers (the arrows and the bones, 13:19, 21).
- **The language pass is not yet run; no theme page and no illustration yet.**
- **The Joseph Smith Papers page for the 10 March 1844 discourse** that `jsp-discourse-1844-03-10` names (…/8) no longer exists; the discourse runs pages 205–211 (`…/1` to `…/7`). For Elijah's keys read `…/3` and `…/4`, and give the ledger row that page.
- **Research** is shared with 1 Kings, in `.cache/batch/kings/research/` (1 Kings' brief, “State of the book”). The Church's footnotes and chapter headings for every chapter are in `.cache/batch/2-kings/fn<n>.txt`.

## What the author has decided

Nothing beyond choosing the books; 1 Kings' brief says how the standing rules land. For 2 Kings: *Scripture Helps* covers 2–7 (`scripture-helps-2-kings-2`) and 16–25 (`scripture-helps-2-kings-16-25`), and nothing on 1 or 8–15. *Come, Follow Me* (`cfm-ot-2026-28`, `cfm-ot-2026-29`) compares Elisha's miracles with the Savior's (4:8–37 and Luke 7:11–16; 4:42–44 and John 6:1–13; 5:1–15 and Luke 17:11–19; `cfm-ot-2026-28` [7]), reads Naaman as “As I am humble and obedient, Jesus Christ can heal me,” and reads Hezekiah's trust and Josiah's covenant (`cfm-ot-2026-29`). The seminary manual has 2 Kings' introduction (`ot-seminary-2-kings-intro`) and lessons 97–101. The Student Manual's chapters are `ot-manual-5` (to 2:25), `ot-manual-6` (3–13), `ot-manual-12` (14–20), `ot-manual-19` (21–25), with enrichments D (`ot-manual-kings-d`, the Assyrian conquest and the lost tribes) and G (`ot-manual-kings-g`, Babylonia). *Scripture Helps* quotes Elder Holland (6:16, “help from both sides of the veil”) and President Kimball (the mantle, and Josiah); each at most once on the site.

## What a chapter is for here

2 Kings is 719 verses in 25 chapters: Elisha's ministry, the end of Ahab's house, the long decline of both kingdoms, the fall of Samaria, Hezekiah and Josiah, and the fall of Jerusalem. Questions a careful reader would ask, by chapter (a start, not a limit):

- **1–2:** *Who was Baal-zebub? Why did fire consume two captains and their fifties? How was Elijah taken, and why “translated”? What was the double portion? Why did the waters heal with salt? Why did bears maul the youths who mocked Elisha, and how old were they?*
- **3–4:** *Why did Elisha call for a minstrel? What happened when the king of Moab sacrificed his son, and what was the “great indignation” (3:27)? What do the widow's oil, the Shunammite's son, the poisoned pottage and the hundred fed have to do with each other and with Jesus' miracles?*
- **5–7:** *Who was Naaman, and why the Jordan seven times? Why did he want two mules' burden of earth, and why could he bow in the house of Rimmon? What was Gehazi's sin? How did the axe head swim? What did the servant see (6:17)? Why did mothers eat their children in the siege, and what did the lepers find?*
- **8–10:** *Why did Elisha weep before Hazael, and did he tell him to lie (8:10)? Why did the LORD not destroy Judah “for David his servant” (8:19)? Who was Jehu, and why such violence? What happened to Jezebel? Why does Hosea condemn the blood of Jezreel (Hos. 1:4) that 10:30 commends?*
- **11–14:** *How did Athaliah reign, and how was Joash hidden? What was the covenant at his crowning? Why did the temple repairs stall? What did the arrows mean (13:17–19), and why did a dead man live at Elisha's bones? Who was Jonah son of Amittai (14:25)?*
- **15–17:** *Why so many kings in so few years? Who were Pul and Tiglath-pileser? What did Ahaz copy from Damascus, and why did he move the brazen sea? Why did Samaria fall, and where did the ten tribes go? Who were the Samaritans, and why did lions come?*
- **18–20:** *Why did Hezekiah break the brazen serpent? Why did he strip the temple to pay Sennacherib (18:14–16), which Isaiah does not tell? What do Sennacherib's annals say? Who died, the 185,000? How did the shadow go back? Why was showing the treasure to Babylon wrong?*
- **21–23:** *Why does Manasseh bear the blame for the exile (21:11–15; 23:26; 24:3)? What was the book of the law found in the temple, and why did Josiah tear his clothes? Who was Huldah? What did Josiah remove, and why burn bones at Bethel? Why did a good king die at Megiddo, and why did his reform not turn away the judgment (23:26–27)?*
- **24–25:** *How was Jerusalem taken twice? Who were Jehoiakim, Jehoiachin and Zedekiah, and what has Lehi to do with them (1 Ne. 1:4)? Did all Zedekiah's sons die (25:7; Hel. 8:21)? Who was Gedaliah? Why does the book end with Jehoiachin eating at the king of Babylon's table?*

A chapter answers those from the text first. (The `christ` section then applies the chapter to the reader, in statements: `STANDARDS.md` §1.)

**Read the history as the writer framed it.** 2 Kings closes the account 1 Kings opened. Elisha's miracles answer Elijah's (the widow's oil, the raised son, the parted Jordan) and Jesus took both as His precedent (Luke 4:25–27). Chapter 17 explains why Samaria fell, in the text's own words (17:7–23), and the fall of Judah is set down to Manasseh (21:11–15; 23:26; 24:3). The judgment falls “as he had said by all his servants the prophets” (17:23; 24:2). Hezekiah and Josiah are the kings like David (18:3; 22:2), and both reforms are followed by worse. Say what a pattern shows where a source shows it (Satterfield on Manasseh's reversal of the reforms, `satterfield-divine-justification` [32]); don't build a scheme of the writer's own.

**Twenty-five chapters, two told already.** 18:13–20:19 is Isaiah 36–39 and 24:18–25:30 is Jeremiah 52, each already written with full notes. **Proposed:** those passages get a `setting` and `thread` that place them in Kings, notes only where Kings differs or adds (18:1–12, 14–16; 20:20–21; 24:1–17; 25:22–26 against Jer. 40–41, already on the site), and links to the Isaiah and Jeremiah notes for the rest; they are not written again. Chapters 8–15 have no *Scripture Helps* and no *Old Testament Minute*, and lists of reigns (13–15) need one note on what the list shows, not a note per king.

## Divisions

*Scripture Helps* gives three: 1–9 Elisha, 10–17 the wicked kings and the Assyrian conquest, 18–25 Hezekiah, Josiah and Babylon (`scripture-helps-2-kings-2` [4]–[10]). **Proposed:** those three, with titles in the King James' words.

| Chapters | Division (key) |
|---|---|
| 1–9 | There Is a Prophet in Israel (`kgselisha`, 5:8) |
| 10–17 | Until the LORD Removed Israel out of His Sight (`kgsremoved`, 17:23) |
| 18–25 | He Trusted in the LORD God of Israel (`kgstrusted`, 18:5) |

No key collides with another book's (`grep key: content/*/book.yaml`, 2026-11-05). Chapters 1–20 belong to `assyria` (*Two Kingdoms and Assyria*, to the end of Hezekiah's reign); 21–25 to `babylon` (*Babylon and the Exile*, from Manasseh).

## Explained once: where

**A chapter that needs one of these says it in a clause and points to the place named with a `[[reference]]`; it does not explain it again or print the quotation again.** Places in 1 Kings are written first, in its own batches; places in other books are already written: read them (`node scripts/occurrences.mjs 2-kings "<phrase>" --site all`) and agree.

| What | Explained in full at | Elsewhere |
|---|---|---|
| Baal-zebub; fire from heaven | `[[2 Kgs. 1:2]]`, `[[2 Kgs. 1:10]]`; `[[Luke 9:54]]` (James and John ask to do as Elias did) | nothing |
| **Elijah translated; the keys and D&C 110** | `[[2 Kgs. 2:11]]` (*Scripture Helps* 26 [12]; D&C 110:13–16; `jsp-discourse-1844-03-10`; GS “Translated Beings”; `christofferson-sealing-power`); `[[Gen. 5:24]]` (“Taken without death”) and `[[Mal. 4:5]]` on the site: agree, link | 1 Kgs. 17:1 points here for the keys |
| **The double portion; the mantle** | `[[2 Kgs. 2:9]]` (*Scripture Helps* 26 [11]; `woods-elisha-children` [78]; `[[Deut. 21:15]]` on the site, “The firstborn of the less-loved wife”), `[[2 Kgs. 2:13]]` (*Scripture Helps* 26 [14]–[16]) | 1 Kgs. 19:19 in a clause |
| **The youths and the bears** | `[[2 Kgs. 2:23]]` (“Contested”) | nothing |
| Moab's king and the “great indignation” | `[[2 Kgs. 3:27]]` (the Mesha stele: `ot-minute-2-kings-3` [5], with a museum source) | 1 Kgs. 16:23 in a clause |
| **Elisha's miracles and the Savior's** | `[[2 Kgs. 4:42]]` (`cfm-ot-2026-28` [7]; `barlow-miracles`); `[[2 Kgs. 4:34]]` (the raised son, beside `[[1 Kgs. 17:21]]`) | 4:1–7; 6:1–7; 13:21 point |
| **Naaman; Luke 4:27; becoming as a little child** | `[[2 Kgs. 5:10]]`, `[[2 Kgs. 5:14]]` (*Scripture Helps* 26 [23]–[25]; `sc-knowhy-859` [9]–[10]; `faust-some-great-thing-2001`); `[[2 Kgs. 5:17]]` (the earth: `shannon-location` [24]) | 5:1, 15–19 in a clause |
| Gehazi | `[[2 Kgs. 5:26]]` | 8:4–5 points |
| **“They that be with us are more”** | `[[2 Kgs. 6:16]]`–17 (*Scripture Helps* 26 [28]–[32]; `eyring-embark-2008` [21]) | nothing |
| The siege of Samaria and the mothers | `[[2 Kgs. 6:28]]` (describe; don't quote beyond the text); `[[1 Kgs. 3:16]]` and `[[Deut. 28:53]]` on the site | nothing |
| Hazael | `[[2 Kgs. 8:12]]`; 1 Kgs. 19:15 in a clause | 10:32; 12:17; 13:3 point |
| **“A light” for David (8:19)** | `[[2 Kgs. 8:19]]`; `[[1 Kgs. 11:36]]` and `[[2 Sam. 7:16]]` on the site: agree | 11:1–3 in a clause |
| **Jehu's revolt and Hosea 1:4** | `[[2 Kgs. 9:7]]`, `[[2 Kgs. 10:30]]` (“Contested”); `[[Hos. 1:4]]` on the site (“Why Jehu's house answers for Jezreel”): agree, link | 9:25–26 points to 1 Kgs. 21 |
| Jezebel's end | `[[2 Kgs. 9:30]]`–37; 1 Kgs. 21:23 in a clause | nothing |
| Athaliah and Joash; the covenant at the crowning | `[[2 Kgs. 11:1]]`, `[[2 Kgs. 11:17]]` (`seely-covenant-renewal`, if it treats it) | 12 points |
| Elisha's death; the arrows; the bones | `[[2 Kgs. 13:14]]`–21 (“My father, my father,” 2:12 and 13:14) | nothing |
| **Jeroboam II and Jonah son of Amittai** | `[[2 Kgs. 14:25]]`; Jonah 1 `setting` and `[[Amos 7:10]]` on the site: agree, link | nothing |
| Pul, Tiglath-pileser and the first deportation | `[[2 Kgs. 15:19]]`, `[[2 Kgs. 15:29]]`; the *Two Kingdoms* guide (`#nations`) | 16:7 points |
| **Ahaz, Isaiah 7, the altar from Damascus** | `[[2 Kgs. 16:7]]`, `[[2 Kgs. 16:10]]` (*Scripture Helps* 27 [4]–[8]); `[[Isa. 7:3]]` and Isaiah 7's notes on the site: agree, link | nothing |
| **Why Samaria fell; the ten tribes** | `[[2 Kgs. 17:6]]`, `[[2 Kgs. 17:23]]` (“Contested”) | 18:9–12 points |
| **The Samaritans** | `[[2 Kgs. 17:24]]`, `[[2 Kgs. 17:33]]` (*Scripture Helps* 27 [9]–[12]; `bd-samaritans`; `matson-bridging` [17]) | nothing |
| **Hezekiah, Sennacherib, the 185,000, the sundial, the envoys** | Isaiah 36–39 on the site (its notes on Lachish, the annals, Tirhakah, the shadow, Babylon): **agree, link; write only where Kings differs** | 18:13–20:19 |
| **Nehushtan** | `[[2 Kgs. 18:4]]` (*Scripture Helps* 27 [13] and endnote 16; `pierce-brazen-serpent` [11]); `[[Num. 21:8]]` on the site: agree, link | nothing |
| Hezekiah's tribute (18:14–16), not in Isaiah | `[[2 Kgs. 18:14]]` | nothing |
| Hezekiah's conduit | `[[2 Kgs. 20:20]]` (with the Siloam inscription from a museum source, or `bd-hezekiahs-tunnel` if the key exists); `[[Isa. 7:3]]` and `[[Isa. 22:11]]` on the site | nothing |
| **Manasseh and the judgment** | `[[2 Kgs. 21:11]]`–15 (`satterfield-divine-justification` [32]) | 23:26; 24:3 point |
| **The book of the law; Huldah** | `[[2 Kgs. 22:8]]`, `[[2 Kgs. 22:14]]` (“Contested”); `[[Deut. 6:5]]` on the site already sets 23:25 beside it: agree, link | 23:2, 21, 24 point |
| **Josiah's reform: what was removed** | `[[2 Kgs. 23:4]]`–14 (`bd-grove`; `bowen-putting-down-priests` [34] on the *kĕmārîm*); `[[Lev. 18:21]]` on the site (Molech, Topheth): agree | nothing |
| Bethel and the man of God's tomb | `[[2 Kgs. 23:16]]`–18; 1 Kgs. 13 in a clause | nothing |
| Josiah's death at Megiddo | `[[2 Kgs. 23:29]]` | nothing |
| **Lehi's Jerusalem; Zedekiah's first year** | `[[2 Kgs. 24:17]]`–18 (“Contested”); `[[Jer. 1:3]]` and Jeremiah's “Lehi's Jerusalem” note on the site: agree, link | nothing |
| **Zedekiah's sons and Mulek** | `[[Jer. 39:6]]` and `[[Jer. 52:10]]` on the site (“Zedekiah's sons, and Mulek”; “Not all of Zedekiah's sons”): **agree, link** | 25:7 in a clause |
| Gedaliah | `[[2 Kgs. 25:22]]`; Jeremiah 40–41 on the site: agree, link | nothing |
| **Jehoiachin released** | `[[2 Kgs. 25:27]]` (`sc-knowhy-860` [4], the ration tablets); `[[Jer. 52:31]]` on the site: agree, link | nothing |

## Contested and sensitive questions

The approach to the writer, the lying spirit and Elijah is 1 Kings' (its brief). Quotations were copied from the pages named on 2026-11-05; re-read the page before using one.

- **The youths and the bears (2:23–24).** *Scripture Helps*: “The Hebrew text indicates that these were not young children but older youths or even young men…. This event may have also been a warning to Israel that the judgments of God would come upon them if they continued to reject His prophets” (26 [17]; endnote 19: the same words are used of Solomon in 1 Kgs. 3:7). The seminary manual relays Rasmussen: “The bears did not kill the offenders, as some commentaries assume, but ‘tare,’ or lacerated, them” (lesson 97 [71]); the Student Manual: “The assumption that Elisha directed the bears may not be justified” (`ot-manual-5` [73], relaying Clarke). Woods reads the taunt “go up, thou bald head” as mocking Elisha's succession to the translated Elijah (`woods-elisha-children` [6]). **Proposed:** 2:23 gives *Scripture Helps* first, then the manuals' readings as theirs and Woods' as his; Elisha's curse “in the name of the LORD” (2:24) stays the text's. No verdict on Elisha in the writer's voice.
- **Elijah resurrected or translated.** D&C 110:13: Elijah “was taken to heaven without tasting death”; *Scripture Helps*: Elijah appeared on the Mount of Transfiguration “as a translated being” and later in Kirtland “as a resurrected being” (26 [12]). **Proposed:** 2:11 gives both as the sources give them, the newer source's wording for 1836, without building a doctrine of translated beings beyond GS “Translated Beings.”
- **Jehu (9–10).** The LORD commissions Jehu (9:6–10) and commends him (10:30), but he keeps Jeroboam's calves (10:29, 31), and Hosea's son Jezreel is named for the blood Jehu shed (Hos. 1:4; Jackson: the name “looks to the Lord's vengeance on Jehu's dynasty,” `jackson-hosea-marriage` [14]). Hosea 1 on the site already explains it. **Proposed:** 10:30 gives the text's commendation and its limit (10:31), and points to Hosea's note for the tension; no note judges the killings beyond the text and the Hosea note.
- **Why Samaria fell; the lost tribes (17).** The text gives its own reasons (17:7–23). *Scripture Helps*: the people “lost the Lord's protection”; some “remained in Israel and eventually intermixed with the foreign people … This mixed group became known as the Samaritans”; the Savior said they were “not lost unto the Father, for he knoweth whither he hath taken them” (3 Ne. 17:4), and the Articles of Faith look to “the restoration of the Ten Tribes” (27 [9]–[10]). D&C 110:11 gives Moses' keys “of the gathering of Israel … and the leading of the ten tribes from the land of the north.” Chadwick, in *BYU Studies*: Assyrian inscriptions show the deportees resettled and assimilated (`chadwick-review-ten-tribes` [8]); the seminary manual and the Student Manual name Sargon (17:6 says only “the king of Assyria”). **Proposed:** 17:6 says who took them and where, from the text; 17:23 carries the Church's teaching on the scattering and the gathering, in its sources' words, with Chadwick as his; **no note says where the tribes are now.**
- **Hezekiah and Isaiah 36–39.** Kings tells what Isaiah leaves out (18:14–16: Hezekiah's submission and the temple's gold stripped to pay it). Isaiah 36's notes already treat Sennacherib's annals, Lachish and the Rabshakeh. **Proposed:** 18:14 explains the payment and how it sits beside 18:5–7 (“he trusted in the LORD”), from the text and a source; the 185,000 (19:35) points to Isaiah 37's note, with *Scripture Helps*' endnote 23 (the JST of Isa. 37:36) if the note there lacks it.
- **The book of the law and Josiah's reform (22–23).** *Scripture Helps*: “Most scholars believe that the book of the law was a version of Deuteronomy, although it could have included more of the Pentateuch” (27 [17]); Huldah is “one of only a few women called a prophetess in the Bible” [19]; “stood to the covenant” was “likely part of a formal covenant-renewal ceremony” [20] (Seely: `seely-covenant-renewal` [29]). President Kimball: “one of the finest stories in all of the scriptures,” and the book was the one “Moses had placed in the ark of the covenant” (`kimball-tpc-6` [17], [19]). Eliason in *BYU Studies* relays the scholarly view (proto-Deuteronomy) and the critiques of Margaret Barker, who reads the reform as a loss of older temple teaching (`eliason-josiah` [18]–[31]); in *Interpreter*, Hamblin holds the reforms “necessary and inspired,” since “no biblical prophet ever opposed or criticized Josiah's reforms” (`hamblin-vindicating-josiah` [43]), and Christensen leans to Barker (`christensen-prophets-and-kings`); McGuire introduces both (`mcguire-josiah-introduction` [31]). **Proposed:** 22:8 gives *Scripture Helps*' sentence and President Kimball's as his (they differ; give both, the newer first); 22:14 carries Huldah. The reform is told as the text, *Scripture Helps*, *Come, Follow Me* and the seminary manual tell it: a righteous king's return to the covenant (22:2; 23:25). **Barker's reading is not set beside it as an equal alternative** (`STANDARDS.md` §1): at most one sentence at 23:4 or in `explore` that some writers read the reform otherwise and that Hamblin answers them (`eliason-josiah` is the place to point). 23:26–27 explains why the judgment stood, from the text (Manasseh) and Satterfield.
- **Lehi's Jerusalem (24:17–18; 1 Ne. 1:4).** *Scripture Helps*: “Lehi, the first prophet of the Book of Mormon, lived at Jerusalem during the first year of Zedekiah's reign” (27 [25]). The date of Lehi's departure is argued (Brown and Seely, `brown-jeremiah-imprisonment` [7]: Zedekiah's first year dated to 597 BC; Chadwick, `chadwick-lehi-departure` [7]: a 605 BC model), and two KnoWhys differ by six days on the day Nebuchadnezzar took the city (`sc-knowhy-475` [6]: March 10; `sc-knowhy-860` [7]: March 16, 597 BC). **Proposed:** 24:17–18 gives *Scripture Helps*' sentence and 1 Ne. 1:4, and says the year is argued, naming no day; Jeremiah's notes on the site carry the rest: agree, link.
- **Zedekiah's sons (25:7; Hel. 8:21).** Jeremiah's notes already say it; the seminary manual: “There is no discrepancy, since the account in 2 Kings does not indicate that all of the sons of Zedekiah were slain” (lesson 101 [64]); the Bible Dictionary and Guide to the Scriptures say the same (`bd-zedekiah` [2]; `gs-mulek`). **Proposed:** 25:7 in a clause, pointing to Jeremiah's note.
- **Christ in 2 Kings.** Jesus' own use first: Naaman (Luke 4:27) and the widow (Luke 4:25–26, 1 Kings). Then the Church's: *Come, Follow Me*'s three comparisons of Elisha's miracles with the Savior's (`cfm-ot-2026-28` [7]); help “from both sides of the veil” (6:16–17; Holland in *Scripture Helps* 26 [32]); Naaman made new “as a little child” (`sc-knowhy-859`; Mosiah 3:19); the brazen serpent that “once symbolized Jesus Christ” (Num. 21 and John 3:14 on the site); the “light” promised to David (8:19; Claybaugh reads it as Christ, `interpreter-cfm-2026-2-kings-2-7` [28], his); Elijah's keys and the hearts turned (D&C 110). **Proposed:** each in `christ` or at the note named, in the source's words. **No chapter makes the salt, the meal, the axe head or the arrows a type of Christ in the writer's words.**

## Sources

Shared with 1 Kings (its brief, “Sources for 1 and 2 Kings”). Particular to 2 Kings:

- *Scripture Helps* `scripture-helps-2-kings-2` (26) and `scripture-helps-2-kings-16-25` (27); `cfm-ot-2026-28`, `cfm-ot-2026-29`; `ot-seminary-2-kings-intro`; the Student Manual chapters named above, last.
- ***Old Testament Minute: 2 Kings*** (Combs): `ot-minute-2-kings-2` to `-7`; nothing on 1 or 8–25. **Slips** (`sc-interpreter.md` §10): Ben-hadad as Hazael's “successor” (5 [4], reversed), Joram wounded by Ben-hadad (5 [6]; 8:28 says Hazael), the Mesha stele's discovery (3 [5], unsourced). Don't repeat them.
- Josiah and Lehi's Jerusalem: ✓ `eliason-josiah`; `hamblin-vindicating-josiah`, `christensen-prophets-and-kings`, `mcguire-josiah-introduction`, `rappleye-deuteronomist-reforms`, `larsen-josiah-to-zoram` (Larsen's “began at age 18” is a slip: Josiah was about 26, 22:1, 3), `bowen-putting-down-priests` (*Interpreter*); from *Glimpses of Lehi's Jerusalem* (2004) on Scripture Central's archive: ✓ `schade-kingdom-judah` [16], `seely-lehi-jeremiah`, `seely-woods-jerusalem-destroyed`, `satterfield-divine-justification`, ✓ `barker-josiah-reform` (Barker's, not a Latter-day Saint's); `seely-covenant-renewal` (Sperry), `brown-jeremiah-imprisonment`, `chadwick-lehi-departure`; KnoWhys ✓ #451, #475, #637, #708, ✓ #860, #753, #434; `sc-evidence-102`, `chadwick-seal-of-mulek`, `eom-mulek`, ✓ `sorenson-mulekites`.
- Assyria and the north: `chadwick-review-ten-tribes`, `mcconkie-gathering`, `matson-bridging`, `halverson-fall-of-israel` [60]; `pierce-micah` [20] (Lachish, the prism), `pierce-israelite-refugees` [22], `pierce-brazen-serpent` [11]; `jackson-hosea-marriage` [14].
- Elisha: `woods-elisha-children` (*BYU Studies* 32:3, 1992), `barlow-miracles`, `sc-knowhy-859`, `faust-some-great-thing-2001`, `eyring-embark-2008`, `hilton-motherhood-ot` [79], `shannon-location` [24], `keller-fall-atonement` [54] (Naaman and baptism).
- Bible Dictionary: `bd-elisha`, `bd-naaman`, `bd-athaliah`, ✓ `bd-hezekiah`, ✓ `bd-josiah`, ✓ `bd-sennacherib`, ✓ `bd-nebuchadnezzar`, ✓ `bd-zedekiah`, ✓ `bd-jehoiachin`, ✓ `bd-ahaz`, ✓ `bd-samaritans`. **No entry** for Jehu or Huldah. The Septuagint is Brenton at `biblehub.com/sep/2_kings/<c>.htm` (check the address).

## The text

`data/kjv/2-kings.json` was imported on 2026-11-05 (25 chapters, 719 verses) and compared with the Gospel Library edition by `scripts/check-kjv.mjs 2-kings`, which reports no difference. Its spellings that differ from Isaiah's (“Rab-shakeh,” “Rabsaris,” “Esarhaddon” at 19:37) are in `BOOK_SPELLINGS` in `scripts/fetch-kjv.mjs`; **when quoting Isaiah 36–39 beside Kings, copy each from its own file.**

## Checks while the book is in preview

```sh
node scripts/check-chapter.mjs 2-kings <n>
```

The working folder for a batch is `.cache/batch/2-kings/` (not committed).

## Reader questions no source answered

In `UNANSWERED.md`, once a batch has some.
