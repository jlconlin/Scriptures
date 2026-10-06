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

*(Reviewers' decisions go here, by chapter.)*

## Reader questions no source answered

*(`scripts/batch-notes.mjs` adds to the end of this file, so this stays the last section.)*
