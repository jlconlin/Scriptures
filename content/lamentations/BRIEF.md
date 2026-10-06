# Lamentations brief

Book-level decisions for Lamentations. The site-wide standard is in `STANDARDS.md`; this file records what is particular to Lamentations. Writers, checkers, and reviewers read both before starting a chapter. Malachi's brief (`content/malachi/BRIEF.md`) is the model for the form, and the author's rules recorded in Genesis's brief carry over to every book.

**Status (2026-10-06):** drafted by the coordinator from the sources named below, each read in the session with the research scripts. The author asked for the book on 2026-10-06 and has not read this brief. The book is in preview (`status: preview` in `book.yaml`). Where a section says “Proposed,” that is the approach the chapters follow; it is a decision of the coordinator's, not a fact from a source, and the author can overturn it.

Related files: `OPEN-QUESTIONS.md` at the top of the repository (what waits for the author, for every book). Jeremiah is on the site, all 52 chapters; its brief (`content/jeremiah/BRIEF.md`) has the conventions for the fall of Jerusalem.

## What the author has decided

- **Lamentations is the next book** (author, 2026-10-06). It is written in the three-agent arrangement first used for Malachi (`AUTHORING.md`, “Plan for the next book”): a Sonnet writer, the ledger script, a Sonnet checker, an Opus reviewer.
- **Don't replicate the Gospel Library** (author, 2026-10-03; `STANDARDS.md` §1). The footnotes, chapter headings, and *Scripture Helps* are beside the verse already. A note that only says what they say is not worth writing.
- **Newest trumps oldest** (author, 2026-10-03). For Lamentations the newest is *Scripture Helps: Old Testament* (2025), which has two short sections on the book; the Student Manual chapter is older, and the Bible Dictionary is not an official statement of doctrine.
- **Follow *Scripture Helps* to what it cites**; **decide what the standard decides**; **the Student Manual limits apply** (about a third of a chapter's notes at most, and a note that cites it also rests on something from beyond the Church's own publications). All as in Malachi's brief.

## What a chapter is for here

Lamentations is poetry with almost no narrative, and the Church's helps on it are thin: *Scripture Helps* treats only the book as a whole and 1:17; chapters 2, 4, and 5 have no *Scripture Helps* section and few footnotes (32, 16, and a handful). A reader gets little help from the Gospel Library, so a chapter here does more of the plain work: who is speaking (the poet, the city, the people, “the man”), what event of the siege a line remembers (with a link to the chapter of Jeremiah that tells it), what an image or Hebrew word means, and where the poem turns. Chapter 3 is three times the length of the others (66 verses) and holds the book's best-known lines; it will be the longest chapter.

## Divisions

The book is five poems, one a chapter. `book.yaml` groups them in three, described from the Church's chapter headings. Proposed: keep them; they are only the map on the book page.

| Chapters | Division (key) | Church chapter heading |
|---|---|---|
| 1–2 | The City That Sits Solitary (`widow`) | 1: “Jeremiah laments the miserable condition of Jerusalem—Jerusalem herself complains of her deep sorrow.” 2: “Misery, sorrow, and desolation prevail in Jerusalem.” |
| 3 | The Man That Hath Seen Affliction (`mercies`) | “Jeremiah, speaking for Judah, laments the calamity but trusts in the Lord and prays for deliverance.” |
| 4–5 | The Siege Remembered and the People's Prayer (`remember`) | 4: “The condition of Zion is pitiful because of sin and iniquity.” 5: “Jeremiah recites in prayer the sorrowful condition of Zion.” |

The keys are not used by another book. The colors are new, chosen by eye.

## Book-wide conventions

- **Who wrote it and when, said once, in chapter 1's setting.** *Scripture Helps* (2025): “Although no author is mentioned by name, this book is traditionally attributed to the prophet Jeremiah, who witnessed the events being described.” The Bible Dictionary: “Written by Jeremiah… The date of the book must be some years after the fall of the city, of which the writer was an eyewitness.” The Guide to the Scriptures: “written by Jeremiah… after the fall of the city about 586 B.C.” The Church edition's title is “The Lamentations of Jeremiah,” and its headings to chapters 1, 3, and 5 name Jeremiah. Brenton's Septuagint opens with a sentence the Hebrew lacks: “And it came to pass, after Israel was taken captive, and Jerusalem made desolate, that Jeremias sat weeping, and lamented with this lamentation over Jerusalem, and said.” The Student Manual (24-26): “Tradition has long ascribed the book of Lamentations to Jeremiah, though some modern critics question whether all of the book was written by him.” Proposed: chapter 1 says the book names no author, that it is traditionally Jeremiah's, and that the Church's edition and reference works give it to him; the chapters then call the speaker “the poet” or “Jeremiah” as the Church heading for that chapter does, and do not argue authorship again.
- **The acrostic, said once in chapter 1 and shown in each chapter only where it helps.** *Scripture Helps* and the Bible Dictionary describe it (quoted in `book.yaml`'s intro). From the Hebrew text (`hebrew.mjs lamentations <c>:<v>`, first word of each verse, 2026-10-06): chapter 1 runs in the usual order, ayin (1:16) before pe (1:17); chapters 2, 3, and 4 put pe first (2:16 and 2:17; 3:46–48 and 3:49–51; 4:16 and 4:17). Chapter 5 has 22 verses and no alphabet (5:1 begins with zayin, 5:2 with nun). A note may show this from the Hebrew; why the order differs needs a source read (Keil discusses it).
- **Verse numbers.** The Hebrew and the King James numbers agree throughout (the Open Scriptures verse map has no entry for Lamentations).
- **Names of God.** The Church edition prints “the Lord” (Hebrew *adonai*, H136) and not “the LORD” in fourteen places: 1:14, 1:15 (twice), 2:1, 2:2, 2:5, 2:7, 2:18, 2:19, 2:20, 3:31, 3:36, 3:37, 3:58. Copy any phrase with the name from `data/kjv/lamentations.json`. As in the other books, the Bible Dictionary identifies the LORD of the Old Testament as the premortal Christ; say it once where it first matters.
- **The Lord does not answer.** *Scripture Helps*: “unlike many books in the Old Testament, Lamentations does not contain any responses from the Lord. It captures only the suffering and longing that the people felt before the Lord later showed mercy to them.” Chapters do not supply an answer the book does not give. Where a chapter points forward to the Lord's mercy it does so with a source (Jeremiah 30–33 on the site; Isaiah 40 on the site, whose “Comfort ye” stands beside this book's “none to comfort her”, if a source read joins them).
- **Jeremiah, Isaiah, Genesis, and Malachi are on the site.** `[[Jer. 39:1–10]]`, `[[Jer. 52:6]]`, `[[Jer. 19:9]]`, `[[Isa. 3:26]]` and the like link to the chapter. Link rather than re-explain the siege, the famine, Zedekiah's capture, and the false prophets; Jeremiah 37–39 and 52 tell them. Jeremiah's theme pages (the cup of the Lord's fury; scattered and gathered) may be linked where a note reaches them (the cup at 4:21).
- **Book of Mormon comparison panel: none.** Use the `scripture` kind for Book of Mormon passages (Mormon's lament, [[Morm. 6:16–22]], which *Scripture Helps* endnote 32 and the footnote at 2:11 both point to).
- **Graphic passages.** The famine and the eating of children (2:20; 4:10), the dead in the streets (2:21), and the violence against women (5:11) are described plainly and briefly, not quoted at length and not dwelt on.
- **Theme candidates.** With five chapters few are expected. A writer reports what runs across the poems (“none to comfort her” in chapter 1; the Lord as an enemy; the daughter of Zion; “remember”; “turn”); the coordinator adds it to `THEME-CANDIDATES.md`.

## Contested and sensitive questions

One approach for each, so that five chapters say the same thing. Each quotation was copied from the page named, read with `source.mjs` on 2026-10-06.

- **The Lord as the one who did this (1:12–15; 2:1–8; 3:1–18).** The poems say plainly that the Lord afflicted the city (“The Lord was as an enemy,” 2:5). The Student Manual (24-28): “Judah's pitiful condition, caused by her iniquities, had come about by God's power.” The Bible Dictionary speaks of “the destruction of the holy city and temple by Jehovah's own hand” and “the feeling of sin awakened by it.” Proposed: say what the verse says and who says it (a grieving voice, in a poem), with the book's own account of the cause (1:5, 1:8, 1:18; 3:39–42; 5:16) and its own statement of the Lord's heart (3:31–33, “he doth not afflict willingly”). Do not soften the wording, and do not turn a verse into a statement about why a reader today suffers.
- **“A menstruous woman” (1:17; also 1:8–9).** *Scripture Helps*: “the imagery is symbolic, indicating that Jerusalem had become unclean due to the people's wickedness. This symbolism reflects ancient purity laws and does not imply that menstruation itself is sinful or shameful.” Proposed: follow it; go further only with the Hebrew word and Leviticus 15, which its endnote cites.
- **The sins of the people and the suffering of children (2:11–12, 19–20; 4:4, 10).** The Student Manual (24-31) says of 4:3 that the mothers of Judah “had neglected their children.” The verse is about famine, and the manual's reading says more than it does. Proposed: describe the famine from the text and from Jeremiah 52:6; do not repeat the manual's sentence unless a second source supports it. The poems do not say the children were guilty, and a chapter does not either.
- **“Any sorrow like unto my sorrow” (1:12).** The speaker is Jerusalem. The line has long been applied to the Savior's suffering. Proposed: the note says who speaks first; an application to Christ is made only from a source read (a talk, a hymn, a manual) and worded as that source's application. The same rule holds for 3:30 (“He giveth his cheek to him that smiteth him”; the Church footnote points to [[Isa. 50:6]] and [[Matt. 5:39]]) and for “the man” of chapter 3.
- **“The anointed of the Lord” (4:20).** In its setting this is the king of Judah, taken by the Babylonians ([[Jer. 39:4–7]]). Proposed: say so, with a source; it is not written up as a prophecy of Christ unless a Church source read makes that reading.
- **The prayers against enemies (1:21–22; 3:64–66; 4:21–22).** The Student Manual (24-30): verses 61–66 “contain a plea that the Lord will also reward Judah's enemies for their harsh and evil ways”; on Edom (24-32) it points to [[Obad. 1:10–16]], [[Ezek. 25:12–14]], and [[Ps. 137:7–9]]. Proposed: explain them as appeals to the Lord's justice, left with Him; no application to a reader's enemies. Edom is already explained at Malachi 1:3–4 and Jeremiah 49 on the site; link.
- **The ending (5:19–22).** The book closes “But thou hast utterly rejected us; thou art very wroth against us.” Other translations word 5:22 differently (as a question, or “unless”). Proposed: give the King James first and the other readings as differences, each from the translation's own page; do not resolve the ending into comfort. *Scripture Helps*' sentence on the Lord's later mercy (above) is the Church's frame for it.
- **Hope in chapter 3 (3:21–33).** *Come, Follow Me* (2026) reads it as hope in Christ: “What messages of hope in Christ do you find? (see especially Lamentations 3:20–33…).” The hymn “Great Is Thy Faithfulness” (*Hymns—For Home and Church*) rests on 3:22–23. Proposed: these verses carry the chapter's Witness of Christ, from what the Church's sources say; the personal application stays *Come, Follow Me*'s (`STANDARDS.md` §1). Lexicon work on “mercies” (*chesed*), “compassions,” and “faithfulness” belongs here.

## Sources for Lamentations

Tested 2026-10-06 with the research scripts. `STANDARDS.md` §9 has the general tools.

**Readable, and in `sources.yaml`:**

- `bd-lamentations`: Bible Dictionary, “Lamentations, book of.” `gs-lamentations`: Guide to the Scriptures, “Lamentations, Book of” (added 2026-10-06).
- `scripture-helps-jer-31-33`: *Scripture Helps: Old Testament*, “Jeremiah 31–33; 36–38; Lamentations 1; 3.” Paragraphs 15–17, “What is the book of Lamentations?”; paragraph 19, Lamentations 1:17. Endnotes 32–35 are the ones on Lamentations: 32 cites *The Jewish Study Bible*, 1582–83 (not readable) and [[Morm. 6:16–22]]; 33–35 cite the Guide to the Scriptures, the Bible Dictionary, and [[Lev. 15:19]]. It has nothing on chapters 2, 4, or 5.
- `ot-manual-24`: *Old Testament Student Manual: 1 Kings–Malachi*, chapter 24, sections 24-26 to 24-33 (paragraphs 66–83): 24-26 Lam. 1:1–11, who wrote it and why; 24-27 1:12–22; 24-28 2:1–10; 24-29 2:11–22; 24-30 3:1–66; 24-31 chapter 4; 24-32 4:21–22 (Edom); 24-33 chapter 5. Much of it quotes Keil and the *New Bible Commentary*; quote those only as the manual prints them (`STANDARDS.md` §4 rule 6), and prefer Keil's own page.
- `cfm-ot-2026-44` (*Come, Follow Me* 2026, October 26–November 1; paragraphs 26–31 and 41–45) and `ot-institute-manual-42` (the 2026 Institute teacher manual; seven paragraphs mention Lamentations). For what the Church asks a reader to see in chapters 1 and 3, not for commentary.
- `keil-…`: Keil on Bible Hub, `https://biblehub.com/commentaries/kad/lamentations/<c>.htm`, c = 1 to 5, each loads (chapter 1 is 108,904 characters and includes his introduction; 3 is 75,822; 5 is 25,994). Propose the key `keil-lamentations`. A last resort, no more than about a third of a chapter's notes; for chapters 2, 4, and 5, where the Church's helps are thin, he will be needed, so look first for the sources below.
- `lxx-rahlfs`: Brenton's Septuagint, `https://biblehub.com/sep/lamentations/<c>.htm`. Its verses are headed with the Hebrew letters' names (“ALEPH,” “BETH”), and 1:1 begins with the sentence about Jeremias quoted above.
- `oshb-wlc` for the Hebrew: `scripts/hebrew.mjs lamentations <c>:<v>` (the first line of each verse shows the acrostic letter). `biblehub-interlinear`, `bdb`, `lds-scriptures`, `nrsvue`, `niv`, `esv` as in the other books.
- The saved output of `footnotes.mjs` for each chapter is in `.cache/batch/lamentations/fn1.txt` to `fn5.txt`; writers may read it instead of running the script again.

**Readable; propose an entry when you use one** (each confirmed to load with `source.mjs`):

- “Great Is Thy Faithfulness,” *Hymns—For Home and Church* (`…/study/music/hymns-for-home-and-church/great-is-thy-faithfulness`); its page names Lamentations 3.
- Scripture Central KnoWhy #232, “How Did Mormon React to Seeing His People Slain?” (`how-did-mormon-react-to-seeing-his-people-slain`; main reference Mormon 6:17): the city lament as a form, with Lamentations named. #234, “Why Did Moroni Conclude His Father's Record with 22 Commands?” (alphabetical acrostics, with Lamentations 1–4 listed). #550, “Why Does Isaiah Prophesy of the Daughter of Zion?” (lists Lam. 1:6; 2; 4:22). #718 and #57 cite Lam. 4:7–8 on the Nazarites' faces. `node scripts/knowhys.mjs "Lamentations"` lists all fourteen that mention the book; none has it as its main reference.
- Scripture Central's archive: “The Divine Justification for the Babylonian Destruction of Jerusalem” and “How Could Jerusalem, ‘That Great City,’ Be Destroyed?” (`scripturecentral.org/archive/books/book-chapter/divine-justification-babylonian-destruction-jerusalem`, `…/how-could-jerusalem-great-city-be-destroyed`; chapters of *Glimpses of Lehi's Jerusalem*; each mentions Lamentations once). Find the author and book on the page before proposing the entry.
- BYU Religious Studies Center: “Swine's Blood and Broken Serpents: The Rejection and Rehabilitation of Worship in the Old Testament,” in *Ascending the Mountain of the Lord* (`rsc.byu.edu/ascending-mountain-lord/swines-blood-broken-serpents-rejection-rehabilitation-worship-old-testament`; one paragraph on Lamentations).
- Sources already in `sources.yaml` for Jeremiah's last chapters (the siege, Zedekiah, the famine, Edom) serve here too; search the file before proposing a new key.
- Conference talks: none was found that expounds a passage of Lamentations (one web search, 2026-10-06, found only a *Liahona* digest quoting 3:22–23 from another translation). A writer should search again for the chapter in hand (3:22–26; 3:31–33; 1:12; 5:21) and read any talk found in full.

**Not readable (don't cite):** *The Jewish Study Bible* (*Scripture Helps* endnote 32); the *New Bible Commentary: Revised* (quoted in the Student Manual); the modern commentaries on Lamentations; BYU ScholarsArchive PDFs; Sefaria.

## The text

`data/kjv/lamentations.json` was imported on 2026-10-06 (5 chapters, 154 verses) and compared verse by verse with the Gospel Library edition by `scripts/check-kjv.mjs lamentations`. It found twelve verses that differed: eleven with “Lord” (*adonai*) where the source file has LORD (1:14, 1:15, 2:1, 2:2, 2:5, 2:7, 2:18, 2:19, 3:31, 3:36, 3:58), and “I AM the man” for “I am the man” (3:1). Thirteen entries in `LDS_SPELLINGS` in `scripts/fetch-kjv.mjs` (under a `// Lamentations` comment, each anchored to its own phrase) correct them, and the two now agree in every verse. `check-kjv` still reports 0 for Malachi and Jeremiah.

## Checks while the book is in preview

```sh
node scripts/check-chapter.mjs lamentations <n>
```

It runs `fix-yaml`, the preview build into `.cache/batch/lamentations/dist-NN`, `check-quotes`, `check-content` (with the proposed entries), and `check-ledger`. The working folder for the batch is `.cache/batch/lamentations/` (not committed): `proposed/NN.yaml`, `reports/NN-writer.md`, `reports/NN-check.md`.

## Decided while writing

Settled by the reviewers on 2026-10-06, by the standard and this brief, without the author; any of them can be overturned.

- **Keil in chapters 1 and 5.** Six of chapter 1's ten notes and all seven of chapter 5's cite Keil, over the limit of about a third. They stay (coordinator): the Church's helps have nothing on these verses, each reading is labelled as a reading, and cutting them would leave chapter 5 with almost no notes. The author is asked in `OPEN-QUESTIONS.md` (L1).
- **One source entry for Keil.** `keil-lamentations` in `sources.yaml` points at his chapter 1 page, as `keil-malachi` and `keil-jeremiah` do; each ledger row carries the URL of the chapter page it quotes. The translators and dates two writers proposed were not on the page and were left out.

**Chapter 1**

- 1:2: the 'lovers' are given as the Student Manual reads them (false gods, with the former allies of verse 19); Keil's differing reading (allied nations, Egypt above all) is dropped rather than set beside the Church's, and Keil is no longer a source of the note.
- 1:2: the Jer. 22:22 and 30:14 quotations are cut because they only repeated footnote 2b; 'the same Hebrew word' is corrected to the participle in five verses and the same root as a verb in 2:13.
- 1:2 and 1:12: verse 9's 'she had no comforter' stays the poet's line and its closing cry the city's, so the two notes do not contradict each other.
- 1:1: 'tributary' now rests on BDB (mas, forced labour of conquered populations, with Lam. 1:1 listed) as the more direct source; the manual's widow reading and Keil's 'token of deep sorrow' are worked in without announcing them.
- 1:5: the verse lists are corrected (the Lord did it: 1:12, 14, 15; sin the cause: 1:8, 18, 20); 'the city says the same thing back to Him' and the sentence on how every sufferer should read his trouble are cut as the writer's own; Jer. 30:15 stays because footnote 5b joins it to this verse and the note goes beyond the footnote.
- 1:8: the unsourced gloss of 'wonderfully' and 'the verse that follows explains it' are cut; 'same picture as verse 17' is now a pointer to the 1:17 note; the reading is marked as a reading.
- 1:10: 'leans on that law' is now 'the command meant is probably the law' of Deut. 23:3, since only one commentator makes the identification.
- 1:11: 'recalls the famine of the siege' is reworded: the verse shows hunger, Jer. 52:6 tells of famine in the siege, and the poem does not say which moment it describes.
- 1:16: the cause of the pe/ayin order is given as unknown, with Keil's 'free use made of such forms by the Hebrew poets' as one commentator's judgment; the out-of-context 'form was rather sacrificed to the thought' quotation and the writer's observation about where verse 16 falls are cut.
- 1:17: the Scripture Helps paragraph is no longer quoted whole; the note leads with the Hebrew niddah and Lev. 15:19 and keeps two short phrases of the Church's statement, as the brief directs; the link to verse 8 is marked as a reading.
- 1:21: 'She does not strike them herself' and the Keil quotations that only restated the verse are cut; the note rests on the verse (the prayer is addressed to the Lord and asks the measure He used on her) and is retitled.
- christ: the writer's 'a lack that later scripture answers' typology and the unjoined Jer. 31:13 are replaced with what the Church footnotes at 1:2 and 1:5 join to the chapter (Jer. 30:17; D&C 101:2, 9), the brief's once-only statement that the LORD is Jehovah, the premortal Christ (Bible Dictionary), and Lam. 3:22 quoted in place of the unsourced 'chapter 3 turns toward mercy'.
- thread, setting, explore: 'the question changes from who is doing this' is replaced with what the text shows (more and more addressed to the Lord); 'first line ... only the one word How' corrected to 'first word'; 'the Church's own pairing' for Morm. 6 and 'comfort is promised there' reworded to plain descriptions.
- 1:12: no application of 'any sorrow like unto my sorrow' to the Savior, as the brief decides, since no source read makes it.

**Chapter 2**

- 2:1 footstool: now rests on BDB (hadom is 'never literal'; in Lam. 2:1 'with reference to sanctuary'; in 1 Chr. 28:2 and Ps. 99:5 'perhaps of ark'), replacing the writer's own identification. Keil says ark, not temple; I followed the lexicon and did not add a fifth Keil note.
- 2:5 the Lord as an enemy: cut the Ex. 15:6 comparison (no source makes it) and the 'how it looked from inside the city' reading; the note now follows the brief, giving the book's own cause (1:18) and its own statement of the Lord's heart (3:33).
- 2:6 tabernacle: BDB gives 'booth, pavilion' where Keil has 'hedge or enclosure'; the note gives the lexicon first and Keil's as an older explanation, and is retitled 'His tabernacle and his place of meeting'. The garden explanation stays labelled as one plausible reading.
- 2:9 the law is no more: cut the link from the Scripture Helps sentence about the whole book to this verse (the writer's own), and the unsourced defense/government line; added BDB for torah and Ps. 74:7 to show the psalm is about the burned sanctuary.
- 2:11 liver: reworded 'the cause is the famine' to 'their hunger is the famine of the siege'; otherwise unchanged.
- 2:11 Mormon: cut the contrast 'what Lamentations 2 leaves out' and 'as a witness' (both the writer's own); kept the note because the KnoWhy's city-lament form goes beyond footnote 11a, and added the KnoWhy's sentence that Mormon applied the same form.
- 2:14 false prophets: changed to a Language note on 'discovered' = galah, 'uncover, remove' (BDB); cut 'only pleasant things' and the claim that verse 14 answers verse 13. Kept Jer. 6:14 and 14:14 as what Jeremiah records of Jerusalem's prophets, which the brief directs.
- 2:15 perfection of beauty: note cut with its two ledger rows; both psalms are in the Church's footnotes and the rest was an unsourced reading.
- 2:16 pe before ayin: kept, since the brief invites it; removed 'one commentator' and 'one scholar's explanation' and the opening that stated Keil's conclusion as fact. It now says the reason is not settled.
- 2:17 days of old: removed 'on a commentator's reading' and 'most naturally' (now 'probably'), and cut the closing sentence that overlapped the note on 2:18.
- 2:18 the turn: 'all he hath' corrected to 'nearly all'; cut 'the poem sees no other place to take the grief'.
- 2:20 the prayer: added the Hebrew (the verb behind 'consider' means 'look', BDB) so the Language note has word work; the speaker is now argued from verses 18-19 and the first-person words of 21-22, and marked as unmarked in the text.
- 2:22 solemn day: changed from Literary Structure to Language; now rests on BDB for moed and on BDB's reading of Lam. 1:15 ('called a festal meeting against me'); the writer's 'day Israel kept to meet the Lord' sentence is cut.
- christ: cut Luke 19:41-44 and 'the Lord of Jerusalem looking on the same city' (the writer's connection); it now rests on the KnoWhy's sentence that the Savior too lamented over Jerusalem, with Matt. 23:37-38 quoted.
- Setting, thread, tagline, explore: removed the Church chapter heading (already beside the verse), the Jer. 52 heading quoted as if it were the text, 'worst of the hunger', 'the only One who can hear her', and 'nowhere to turn'; cut the Mormon line from explore as a repeat of the note.
- 'No responses from the Lord' (Scripture Helps) appeared five times; it is now in the setting, the thread and the note on 2:18 only.
- Section 4 plain: verse 20's questions are now worded as questions ('Should women eat their own children?'), not as statements.

**Chapter 3**

- Setting: cut "the Church's manual pairs this chapter with the promises of Jeremiah 31-33" (inferred from a lesson title, and an announced source) and the full chapter heading (it is beside the verse and is quoted in the 3:1 note); "each beginning with the next letter" became "one for each letter", since chapters 2-4 put pe before ayin. Both ledger rows removed.
- Thread: "What he recalls is that the Lord's mercies are not consumed" (which misstates verse 22) became "The verses that follow speak of the Lord's mercies."
- 3:1: removed "the strongest reason", "Between the two" and "the Church's heading is the safest guide" (none in a source); the I-to-we argument is now given as one reading and the Student Manual sentence as covering the whole chapter.
- 3:15: corrected the verses (gall in 3:5, wormwood in 3:15, both in 3:19); replaced the NASB gloss filed under BDB with BDB's own line ("a bitter and poisonous herb... always figurative"); cut the writer's sentence about what the man's life "tastes like".
- 3:18: "every verb" became "nearly every line" (verses 14, 17 and 18 have the man as subject); cut the unsourced "effect" sentence and the Scripture Helps quotation, which the setting and the 3:56 note already carry.
- 3:21: cut the unsourced claims that "this" points forward to verse 22 and that hope attaches "not to a change in circumstances"; the note now quotes the verse's own "therefore have I hope" and points to the 3:22 note.
- 3:22: cut "the more tender picture", "but it fits the sense" and the "Note the 'we'" remark (the writer's own, and the 3:1 note already covers the "we").
- 3:23 and christ: kept as the Church's application, said as such (the brief's rule for hope in chapter 3), without naming Come, Follow Me in running text; cut the duplicated Scripture Helps paragraph from the note; christ now points to the note instead of repeating its quotations, and lost "clearest statement" and "not shown being delivered" (verse 58 says "thou hast redeemed my life").
- 3:25: the opening now says three verses to a letter without "the next letter"; cut "makes the same statement three times" and the aside about the chapter's center.
- 3:27: the gradation is given as one reading of verses 28-30 (not 27-30, not "best read"); the paragraph naming Keil and repeating footnote 30a became one sentence that adds Job 16:10 from Keil; the matching explore bullet was cut.
- 3:33: removed Keil's gloss, which the note misquoted as "sometimes necessary" (Keil says "merely because chastisement is necessary") and then half disowned; the note now rests on the Hebrew, where "willingly" is word for word "with His heart" (new interlinear row), which also supports the chapter's phrase "the Lord's heart".
- 3:38: the opening now says what verses 37-38 say; added Keil's sentence "Man is not to sigh over suffering and sorrow, but only over his sin" (new row) as that reading; replaced the unsourced "the book does not say it either" with a pointer to the book's own naming of sin at 1:5 and 1:18.
- 3:48: replaced the first-person "No source I read explains the difference" with Keil's two statements from his chapter 1 page (two new rows); dropped the verse 60 quotation, which had no Hebrew row; removed "the note does not claim". Keil is cited in 5 of 15 notes, as before (out of 3:33, into 3:48).
- 3:53: "a reader can hold either" became "The poem does not say which."
- 3:56: "the only saying of the Lord quoted anywhere in the book" (unsourced, about all five chapters) was narrowed to the chapter, which its 66 verses bear out; corrected the quotation for the Lord's hearing to "Thou hast heard my voice"; Scripture Helps is no longer named in running text.
- 3:63: cut "frames the long chapter" and rewrote the opening to say what "musick" means here.
- 3:64: kept as the brief's approach to prayers against enemies, from the text alone; removed the self-referential last clause.
- 3:14, 3:53 (findings 14, 19) and the thread's closing sentence (18): left as they are; the checker found them accurate or a plain reading of the verses.
- Explore: cut the Psalm 119:57 bullet (it only repeated footnote 24a) and the cheek bullet (now in the 3:27 note).

**Chapter 4**

- 4:6 plain words: now follow the King James ("the punishment of my people's iniquity is greater than the punishment of Sodom's sin") instead of taking the guilt reading unhedged; "soot" and "squares" went back to "coal" and "streets", and 4:16's plain words back to "anger".
- 4:6 note: rebuilt on the lexicon and the Updated NRSV only. Cut "Hebrew usage allows both" (no source), the misread "phrases of punishment" line, the Keil quotations, and the Ezekiel 16:48 sentence (no source joins it to this verse). Ezekiel 16:46-56 stays in explore as a pointer only.
- 4:13 note: the Jeremiah 26 link and the leper's cry of Leviticus 13:45 were the writer's own; Keil makes both, so the note now cites him and says the Hebrew has also been taken as a cry raised about the priests.
- 4:19 note: kept, not cut. Its opening stated as fact what its close called a judgment; it now rests on Keil for verses 19 and 16 ("taken from Deuteronomy 28:49"; Deuteronomy 28:50 "is fulfilled on them") and on the Church footnote for verse 10, and says the poem itself names neither Moses nor the covenant.
- 4:20 note: Keil removed to hold outside commentary at 4 of 12 notes. "The breath of our nostrils" now rests on the lexicon ("figurative of king"; the nostril as organ of breathing, Genesis 2:7). Lost with Keil: the "theocratic king" and 2 Samuel 7 point, and the hunter figure for "pits".
- 4:20: the Church footnote also points to 2 Chronicles 35:25 (Jeremiah's lament for Josiah). The note follows the brief and Jeremiah 39:7 (the king taken by the Babylonians) and does not take up Josiah.
- 4:10 note: cut the writer's account of why the poet says "compassionate" ("not cruel by nature"), which also clashed with "cruel" in 4:3; the note now says the verse does not explain the word and does not blame the women.
- 4:3 note: "appears only here" reworded to the lexicon's "only in the plural"; "doing what the mothers of the city could not" replaced with the verse's own words.
- 4:7 note: "most likely means the nobility" reworded to "is taken of the nobility", since the lexicon lists the verse there without weighing likelihood.
- 4:16 note: "3:46-49" corrected to "3:46 and 3:49"; "which is why the King James has anger" reworded to what the lexicon says.
- 4:22 note: cut the "days of weeping" aside and the closing lines; "plays on one root" became "uses one root twice", which the Hebrew shows without a claim about intent.
- 4:1 note: Keil's "Isaiah 64:7" is the Hebrew numbering; the note now quotes and cites Isaiah 64:8 from the King James. The announced "the same commentary" was removed.
- Witness of Christ: cut "the poem itself does not point past Zedekiah", "which is the Jewish reading, not a Church statement", and the closing typology. It now gives the Bible Dictionary on "Messiah", says the title here is the king of Judah's, and reports the Messianic reading of 4:22 as one reading that the word "finished" does not itself imply.
- Thread and setting: removed announced sources ("one commentary divides", "on one commentator's reading"); "two answers side by side" reworded to Keil's sense that the wrath is a consequence of the sins; "first to Edom and then to Zion" corrected to "in turn"; the unsourced "the book's plainest statement" cut.
- Section plain words that depart from the King James (jackals, princes, coral, compassionate) now have ledger rows.
- Left as is, 4:17: three of its four references are in the Church footnote, but the note quotes Jeremiah 37 to say what the help amounted to, which the brief asks for.
- Left as is, 4:21: the Student Manual sentence on Edom is the manual's own statement and is cited for what it prints; the note also rests on Keil.

**Chapter 5**

- 5:1: note cut. No source joins "Remember" in 5:1 to Jer. 31:20 or calls that verse the Lord's answer to this prayer; the Jer. 31:18-20 material stays in the 5:21 note, where the Church footnote makes the link.
- Setting and christ: "the Lord's answer to a prayer very like this one" reworded to the Lord's reply to Ephraim's same request (Jer. 31:18, 20); Scripture Helps' sentence on the Lord's later mercy added as the Church's frame.
- Thread: rewritten to the structure Keil gives (two parts closing on the confessions of verses 7 and 16; verses 17-18 leading into the request of 19-22), with four ledger rows; "one last, fearful question" dropped.
- 5:10, 5:13, 5:18 plain words: returned to the King James sense ("black like an oven", "grind at the mill", "foxes"), since the Keil-only renderings had no rows.
- 5:22 plain words: now the King James statement, as the brief requires; the "unless" reading is in the note only.
- 5:4: Keil's name and the sentence announcing the Student Manual removed; ot-manual-24 dropped from the note and the chapter sources, since nothing rests on it now.
- 5:6: paragraph joining the verse to Johanan's flight to Egypt (Jer. 42:14) cut, as no source makes that link; the Jer. 2:18 pairing kept because Keil makes it.
- 5:7: "in the day of the Lord's gathering" removed; the note now gives Keil's reconciliation of verses 7 and 16 in his own words and labels it a commentator's reading.
- 5:12: note rebuilt on Keil's comment, which the writer had not used: "by their hand" is the enemy's hand, hanging after death was an added shame (Deut. 21:22), and the verse is not limited to Riblah (Jer. 39:6). The plain words now say "by the enemy's hand" instead of "by their hands".
- 5:19: "the one place where the poem turns" softened; Keil's name removed.
- 5:21: unsourced "also means repent" and the ketiv/qere aside cut; the transliteration of Jer. 31:18 corrected to hashiveni; Keil's point that the prayer is not for a return to the land added.
- 5:22: the manuscript repetition of verse 21 no longer said to support the "unless" reading (Keil calls it a synagogue reading custom); the question reading added, as the brief asks; the closing "should not be turned into comfort" replaced with Scripture Helps' sentence.
- Christ: "in the Bible Dictionary's words" removed; the quotation stands on its own.

## Reader questions no source answered

*(`scripts/batch-notes.mjs` adds to the end of this file, so this stays the last section.)*
- **1:** 1:21: what 'the day that thou hast called' is; no source read treats the clause; 1:12: whether a Church source applies 'any sorrow like unto my sorrow' to the Savior; none was found; 1:16: why chapters 2-4 put pe before ayin; only Keil's judgment (the poet's freedom with the form) was read; 1:3: what 'between the straits' means; no source read; 1:14: the yoke image and its link to D&C 113:10; not used, no source read.
- **2:** 2:18: who 'their heart' refers to, and how 'Their heart cried unto the Lord, O wall of the daughter of Zion' fits together; Keil discusses it but the chapter is at its limit of Keil notes; 2:3 and 2:17: what 'the horn of Israel' and 'the horn of thine adversaries' mean; 2:18: what 'the apple of thine eye' means here; 2:15-16: what clapping, hissing and wagging the head signified.
- **3:** 3:46-51: why pe stands before ayin in chapters 2-4. Only Keil's older suggestion was read; no modern source; 3:1, 3:10-13: what the rod, the bear and lion, the bow, and "reins" meant to first hearers (the writer cut these for lack of a source other than Keil); 3:24: "The LORD is my portion" has no note (the only source found was Keil, and the Church footnote already gives Ps. 119:57); 3:34-36: what wrongs the three "To..." lines describe (no source read); 3:33: the Church footnote points to D&C 133:53; the note does not use it and no source read connects the two.
- **4:** 4:12: why the kings of the earth "would not have believed" Jerusalem could fall. The writer dropped it to limit Keil, and I did not add a note; 4:16-17: why chapters 2-4 put the letter pe before ayin when chapter 1 does not. The writer searched Keil on chapters 1-4 and found nothing; the note says so; 4:20: why the Church footnote on "anointed" points to Jeremiah's lament for Josiah (2 Chronicles 35:25). No source read says which king the footnote intends.
- **5:** 5:9: what "the sword of the wilderness" is (only Keil answers: desert raiders); 5:10: whether the skin is "black" or "glows" with the fever of hunger (only Keil); 5:16: what "the crown" is (only Keil); 5:18: foxes or jackals on Mount Zion (only Keil); 5:1: whether any source reads the Lord's "I do earnestly remember him still" (Jer. 31:20) as the answer to "Remember, O LORD"; none was found.
