# Jeremiah brief

Book-level decisions for Jeremiah. The site-wide standard is in `STANDARDS.md`; this file records what is particular to Jeremiah. Writers and checkers read both before starting a chapter.

Related files:
- `OPEN-QUESTIONS.md`, at the top of the repository: what waits for the author, for every book.
- `THEME-CANDIDATES.md`: topics that run across chapters, collected for possible theme pages.

## State of the book

All 52 chapters were written on 2026-10-02 and the book went live the same day, with the author's approval given in advance. Each chapter was written by a `chapter-writer` agent (Sonnet), checked and repaired by a `chapter-reviewer` agent (Opus, which did not write it), and committed with its evidence ledger; the coordinating session added the `sources.yaml` entries and ran the checks. The author gave no focus questions and confirmed the approach: continue as with Isaiah, whose commentary the author is happy with “both in its content and its quantity.” Each writer worked from the questions a careful reader would ask (`STANDARDS.md` §3).

Remaining: the author has not yet read the chapters; the judgment calls and unanswered reader questions the checkers reported are in `OPEN-QUESTIONS.md` at the top of the repository (J1–J12), and the topics that run across the book are in `THEME-CANDIDATES.md`.

## What a chapter is for

(Author, 2026-10-02.) The site exists to answer the questions a reader would ask: “I might read a verse or a series of verses and wonder what it means or who the person is that's in it.” So: read the text first, work out what someone would ask, then find the answers, if they exist. It is “not to be a record of all the commentaries ever written,” and “not supposed to point to every possible source, but answers do need to be sourced.”

What that means in practice, from the two pilot chapters:

- **The question comes first, and the note answers it.** A note exists because a reader would stop at that phrase and wonder. If no reader would ask, there is no note, however interesting the source. If a reader would ask and no source answers, say in the report that it went unanswered; don't fill the gap.
- **Open with the answer, not a label.** Never begin a note “This note is about…” or “This note explains….” The first sentence states the note's main point in plain words (“Anathoth was a priests' town a few miles northeast of Jerusalem.”). The finished Isaiah chapters show how.
- **Where answers come from, in this order** (author, 2026-10-02: “the vast majority of content should come from official church sources”):
  1. **The Church's own sources** (churchofjesuschrist.org): the scriptures with their chapter headings and footnotes, the Bible Dictionary and Guide to the Scriptures, the Church's manuals, general conference talks and other teachings of prophets and apostles, the Joseph Smith Papers. Most of a chapter's notes should rest on these.
  2. **BYU** (byu.edu): the Religious Studies Center, BYU Studies, and other BYU publications.
  3. **Scripture Central** (KnoWhys and its other articles), which the author counts as staying close to the Church's teaching.
  4. **Other commentary and scholarship** (Keil, other translations, the Septuagint): “appropriate, but should be used sparingly when other LDS adjacent sources are not available.” The Hebrew text and a lexicon are tools for a word's meaning and are fine for that.
  
  **Everything follows the Church's teaching and doctrine.** Where an outside source's reading differs from the Church's, the chapter gives the Church's reading; the outside reading is left out unless the reader's question needs it, and it is never set beside the Church's as an equal alternative.
- **One good source per answer.** Go first to what answers the question most directly: the verse's own context, other scripture, the Hebrew text and BDB for a word, the Bible Dictionary or the Church's manual for a person, place, or doctrine. Don't stack a second and third source saying the same thing.
- **Keil is a last resort, not a companion.** He is the only full commentary readable online, which makes it easy to follow him verse by verse; don't. Use him when the question is real and nothing closer answers it, and in no more than about a third of a chapter's notes. Don't report what earlier commentators (Jerome, the rabbis) thought unless the reader's question needs it. When a point is his alone, say once that it is “one reading” and move on; don't write “one commentator says… the same commentator notes….”
- **Don't announce sources.** Not “The Church's manual observes that…” or “The Bible Dictionary says…”: make the statement, or work the quotation into the sentence, and let the citation carry the attribution (`STANDARDS.md` §3).
- **No `[@key]` markers in a chapter file.** Chapter pages don't render them (only guides and theme pages do). A note's citation is its `sources` list; for `setting`, `thread`, `christ`, and `explore`, it is the chapter's `sources` and the ledger. `check-content.mjs` rejects a marker in a chapter.
- **Name speakers correctly.** A quotation from the Book of Mormon is attributed to the person speaking, not the book it is in ([[Hel. 8:20]] is Nephi the son of Helaman).

## Divisions

From the Bible Dictionary's outline (“Jeremiah”), which arranges the book by reign. They are in `book.yaml`:

| Chapters | Division | Bible Dictionary |
|---|---|---|
| 1–6 | The Call and the First Warnings | Prophecies of the reign of Josiah |
| 7–20 | The Temple Sermon and the Prophet's Burden | Prophecies under Jehoiakim |
| 21–29 | Kings, Shepherds, and False Prophets | Under Zedekiah: (a) 21–24, (b) 26–29; chapter 25 falls between |
| 30–33 | The New Covenant | (c) “the latter-day restoration of Israel and the gospel covenant” |
| 34–45 | The Fall of Jerusalem | (d) 34–38, the siege; 39–44, after the fall (the outline passes over 45, the word to Baruch) |
| 46–52 | The Nations and the End | 46–51, foreign nations; 52, historical conclusion |

## Book-wide conventions

- **Say when.** The book is not in order of time. Every chapter's `when` names the king and, where the text or a source gives one, the year. Take the date from the chapter's own heading verse first (for example [[Jer. 25:1]]), then from the Church's chapter heading or the Bible Dictionary. Where a chapter gives no date, say so; don't guess.
- **Dates.** Use the Bible Dictionary's (“Jeremiah” and “Chronology”): Josiah 626–608 for Jeremiah's part of the reign, Jehoiakim 608–597, Zedekiah 597–586, the fall of Jerusalem 586 B.C. Where a source you cite uses 587 or another year, keep the Bible Dictionary's date and mention the difference only if a note depends on it.
- **Lehi's Jerusalem.** Jeremiah and Lehi preached in the same city in the same years ([[1 Ne. 1:4]], [[1 Ne. 7:14]], [[1 Ne. 5:13]], [[Hel. 8:20]]), and Zedekiah's son Mulek reaches the Book of Mormon ([[Hel. 6:10]], [[Hel. 8:21]], [[Omni 1:15]]). This is the book's main Restoration connection. Use it where a chapter really meets the Book of Mormon (the same event, the same charge against the city, a named person), sourced like anything else. Don't add a Lehi note to a chapter just to have one.
- **Names with two spellings.** The KJV has both Nebuchadrezzar and Nebuchadnezzar; Jehoiachin is also Jeconiah and Coniah; Jehoahaz is also Shallum. A `phrase` uses the spelling in that verse (`data/kjv/jeremiah.json`); the commentary says who is meant the first time the other name appears in a chapter.
- **Repeated passages.** Jeremiah repeats itself (for example 6:12–15 and 8:10–12; 23:5–6 and 33:15–16), and chapter 52 parallels [[2 Kgs. 24:18–25:30]]. The second chapter says briefly that the passage also stands in the first and links to it; it doesn't repeat the notes.
- **The Septuagint.** Jeremiah's Greek text numbers the chapters differently after 25:13 (Brenton's chapter 25 on Bible Hub continues with verses marked “(32:…)”, and the prophecies against the nations follow there). When citing the Septuagint, give the Greek chapter and verse you actually read. Any statement about how and why the Greek differs (its length, its order, what the Dead Sea Scrolls show) needs a source read in the session like any other claim. Raise it only where it changes how a verse is read.
- **“Later than Jeremiah.”** The Bible Dictionary says chapters 50–51 “in their present form are later than Jeremiah” and that chapter 52 is a historical conclusion. Chapters 50–52 report this once, plainly, citing the Bible Dictionary; they don't build on it or argue with it.
- **Joseph Smith Translation.** The Gospel Library's JST appendix has one Jeremiah entry (26:13, `jst-jer-26`). Other JST readings are in the footnotes of the Church's edition; check the chapter's Gospel Library page for them, and cite `lds-scriptures` with a ledger row for a footnote reading.
- **The prophet's prayers.** The passages often called Jeremiah's “confessions” (in chapters 11–12, 15, 17, 18, and 20) are treated in their own chapters. Don't use the term, or list the set, without a source read in the session.
- **Graphic passages** (chapters 2–3, 13, 19, and others): describe rather than quote (`STANDARDS.md` §3).
- **Isaiah is on the site.** `[[Isa. 53:4]]` links to the Isaiah chapter, and Isaiah has theme pages (`content/isaiah/themes/`). Where Jeremiah takes up something Isaiah's pages already explain, link rather than re-explain.
- **Theme candidates.** When a chapter develops a topic that runs across the book, the writer reports it; the coordinator adds it to `THEME-CANDIDATES.md`. No Jeremiah theme pages are written until the author chooses them.

## Conventions applied while writing

Applied across the book while it was written (2026-10-02); each follows from `STANDARDS.md` or the conventions above. Later revisions keep to them.

1. **A scholar quoted inside a Church manual** is cited as the manual, for what the manual prints, and presented as one view, when the scholar's own book can't be read online (`STANDARDS.md` §4 rule 6). This covers Thompson (NICOT) in 1:5, 6:14, 7:29, 12:9, 45:1; Sperry in 13:4–7, 34:11, 40:1; the *Interpreter's Bible* in 13:23; Clarke was read on Bible Hub and is cited directly (8:1, 12:5, 33:16).
2. **A prophet's words quoted in a Church manual** (Benson 1950, McConkie, Kimball, Joseph Smith) are cited as the manual when the original wasn't opened. Where the Joseph Smith Papers have the original discourse, the chapter quotes the Papers (29:9, where *Teachings of the Prophet Joseph Smith* adds words the 1844 report lacks).
3. **An outside reading** (usually Keil) is given only where no Church, BYU, or Scripture Central source answers the question, is labelled “one reading,” and is never set beside the Church's reading as an equal (brief, “Where answers come from”). Where a Church source and Keil differ on a verse, the chapter follows the Church source (15:13–14, 18:18, 22:22, 42:20, 51:20). Chapters 15 and 29 have Keil in about half their notes because nothing else answered those questions; the alternative was to cut the notes.
4. **Scripture set beside scripture** by the writer, with no footnote or source making the link, is kept when the shared words are in the texts (13 christ, 14:7, 14:21, 24:5, 38:22 the mire, 49:13 Bozrah) and cut when it is a typology no source makes (8:19 Laman and Lemuel, 32:7 the kinsman-redeemer, 36:32 the lost 116 pages, 12:16 and 3 Ne. 21). `STANDARDS.md` §4 rule 5 and §8, “No readings of the site's own.”
5. **Dates** follow the Bible Dictionary's “Jeremiah” outline (brief). Where the Bible Dictionary's entries disagree with one another (Jehoiakim 609–598 in one, 608–597 in another), the “Jeremiah” outline wins. A year reached by arithmetic from it (Zedekiah's fourth year, “about 594 or 593 B.C.” in 27, 28, 51) is given as “about.” An undated chapter says so.
6. **Two Church sources that read a verse differently** are both given, without choosing (28:6 Jeremiah's “Amen,” 33:18 the sons of Levi, 35:13 what the Rechabites kept). **A Church source whose reading goes beyond the verse's own sense** is quoted, and the note says plainly that the verse's own sense is different (31:36 “ordinances”).
7. **Textual variants** (Septuagint, Kethib, Hebrews' wording) are reported where they change the reading, with the KJV first (2:20, 11:15, 31:32, 33:14–26, 49:1); `STANDARDS.md` §2.
8. **The `prophets` kind** is for the teaching of prophets and apostles. A note whose only latter-day voice is a Seventy or a bishop keeps the quotation under another kind (22:16, 29:13 relabelled `scripture`; 39:16 is `history`).
9. **A `christ` section** rests on scripture or a cited source; where a chapter gives little to work with (41, 43, 47), the section is short and says the chapter itself draws no connection, rather than inventing one.
10. **Repeated passages** are explained once and linked (6:12–15 and 8:10–12; 7:30–34 and 19:6; 23:5–6 and 33:15–16), as the brief says.

## Sources for Jeremiah

Tested from the author's Mac on 2026-10-02. `STANDARDS.md` §9 has the general research tools.

**Readable, and already in `sources.yaml`:**

- `bd-jeremiah`: Bible Dictionary, “Jeremiah” (his life, the outline by reign, notable passages, the Book of Mormon references).
- `gs-jeremiah`: Guide to the Scriptures, “Jeremiah.” `bd-lamentations`: Bible Dictionary, “Lamentations, book of.”
- `ot-manual-23` (Jeremiah 1–19), `ot-manual-24` (Jeremiah 20–22; 24–29; 32; 34–45; 52), `ot-manual-25` (Jeremiah 23; 30–31; 33; 46–51): *Old Testament Student Manual: 1 Kings–Malachi*. `ot-manual-kings-g`: its Enrichment G, “Babylonia and the Conquest of Judah.”
- `jst-jer-26`: the JST appendix entry for Jeremiah 26:13.
- `keil-jeremiah`: Keil's commentary on Jeremiah, on Bible Hub at `biblehub.com/commentaries/kad/jeremiah/<c>.htm`. It is the fullest commentary readable online. Use it to answer a question the chapter already asks, not as a source of material; where a point rests on Keil alone, present it as one commentator's reading. Its dates (it puts Josiah's thirteenth year at 629 B.C.) differ from the Bible Dictionary's; use the Bible Dictionary's.
- `lds-scriptures`, `oshb-wlc` (Hebrew: `…/morphhb/master/wlc/Jer.xml`), `biblehub-interlinear` (`biblehub.com/interlinear/jeremiah/<c>-<v>.htm`), `bdb` (`biblehub.com/hebrew/<strongs>.htm`), `lxx-rahlfs` (Brenton: `biblehub.com/sep/jeremiah/<c>.htm`), `nrsvue`, `niv`, `esv`, `webster-1828`, `bd-chronology`, `bd-babylon`, `bd-captivities`, `bd-topheth`, and the other Bible Dictionary entries already in the file.

**Readable; propose an entry when you use one:**

- Bible Dictionary and Guide to the Scriptures entries. Confirmed to exist in the Bible Dictionary: Zedekiah, Jehoiakim, Josiah, Nebuchadnezzar, Baruch, Lehi. Confirmed **not** to exist there (the page loads but has no entry): Rechabites, Mulek, Gedaliah, Pashur, Queen of heaven. The Guide to the Scriptures has “Mulek.” Always check the page heading (`STANDARDS.md` §4 rule 10).
- General conference talks and other Church sources on churchofjesuschrist.org; the Joseph Smith Papers.
- Scripture Central KnoWhys, through the API (`STANDARDS.md` §9). Those that bear on Jeremiah, with their numbers (take the date from the article):
  - #872 “Why Does Jeremiah Refer to Circumcising the Heart?” (`why-does-jeremiah-refer-to-circumcising-the-heart`), on [[Jer. 4:4]]
  - #650 “How Did Jeremiah's and Lehi's Ministries Reflect One Another?” (`how-did-jeremiahs-and-lehis-ministries-reflect-one-another`)
  - #544 “Why Did Lehi and Jeremiah Find Themselves in a Dark and Dreary Wilderness?” (`why-did-lehi-and-jeremiah-find-themselves-in-a-dark-and-dreary-wilderness`)
  - #463 “How Could Nephi Have Known about Jeremiah's Imprisonment?” (`how-could-nephi-have-known-about-jeremiahs-imprisonment`)
  - #451 “Why Did Some in Lehi's Time Believe that Jerusalem Could Not Be Destroyed?” (`why-did-some-in-lehis-time-believe-that-jerusalem-could-not-be-destroyed`); already in `sources.yaml` as `sc-knowhy-451`
  - #441 “Who Were the ‘Many Prophets’ in Jerusalem During Lehi's Time?” (`who-were-the-many-prophets-in-jerusalem-during-lehis-time`)
  - #637 “Why Did the Lord Allow Jerusalem to Be Destroyed?” (`why-did-the-lord-allow-jerusalem-to-be-destroyed`)
  - #710 “Why Are Lehi's and Nephi's Visions and Histories Similar to the History of the Rechabites?” (`why-are-lehis-and-nephis-visions-and-histories-similar-to-the-history-of-the-rechabites`), for chapter 35
  - #753 “How Did Mulek Get to the New World?” (`how-did-mulek-get-to-the-new-world`) and #434 “Why Should Readers Pay Close Attention to the Mulekites?” (`why-should-readers-pay-close-attention-to-the-mulekites`), for chapters 39 and 52
  - #475 “When Did Lehi Leave Jerusalem?” (`when-did-lehi-leave-jerusalem`); #410 “What Parts of the Old Testament Were on the Plates of Brass?” (`what-parts-of-the-old-testament-were-on-the-plates-of-brass`)
  
  A KnoWhy is cited for what it says itself; an idea it passes along from another work needs that work read too (`STANDARDS.md` §4 rule 6).
- BYU's Religious Studies Center (`rsc.byu.edu`) and BYU Studies (`byustudies.byu.edu`): article pages load with `curl` (confirmed 2026-10-02; an earlier failure was temporary). Their own search pages need a browser, so find articles with WebSearch (`site:rsc.byu.edu Jeremiah <topic>`), then read the article with `curl` and quote from that.
- archive.org full texts (`…/download/<id>/<id>_djvu.txt`).

**Keys for new sources,** so that two chapters proposing the same work choose the same key: `bd-<entry>` and `gs-<entry>` (the entry's name in the URL); `sc-knowhy-<number>`; `jst-<book>-<chapter>`; for a talk, `<speaker's surname>-<one or two words of the title>`; for a book or article, `<author's surname>-<one or two words>`. Check `content/sources.yaml` first: it changes as chapters are finished.

**Not readable (don't cite):**

- BYU ScholarsArchive PDFs (abstract page only), Britannica, the British Museum (`STANDARDS.md` §9 and the Isaiah brief).
- The modern commentaries on Jeremiah (Anchor Bible, Hermeneia, NICOT, Word Biblical Commentary, and the like) are not readable online. A view known only from memory of them is not sourced and is not in the chapter.

## Checks while the book is in preview

The plain build leaves a preview book out, and several agents build at once, so use these forms (replace `NN` with the chapter number):

```sh
node scripts/fix-yaml.mjs content/jeremiah/chapters/NN.yaml
PREVIEW=1 BUILD_OUT=<your scratch directory>/dist-NN node scripts/build.mjs
node scripts/check-quotes.mjs jeremiah <n>
node scripts/check-content.mjs jeremiah <n>
```

Other chapters are being written at the same time. A build warning or error that names another chapter's file is not yours: leave that file alone and, if the build stopped on it, run it again a minute later.

## Reader questions no source answered

A list for a later deepening pass, from the checkers' reports (2026-10-02). Each is a question a reader might ask that no Church, BYU, Scripture Central, or other readable source answered; where only Keil answered it and the chapter was already at its Keil limit, it was left out. “No talk” means no general conference or Church magazine treatment of the chapter was found.

- **2:** what a cistern was and why it cracks (13); why Judah courted Egypt and Assyria (18, 36); the JST change at 24; who Kedar was (10).
- **3:** “stones and stocks” (9; the footnote to 2:27 would answer it); “a whore's forehead” (3); the tradition that Jeremiah hid the ark (16).
- **4:** “remove” (1); the “watchers” from a far country (16–17); “I will not repent” against 18:8 (28).
- **5:** “an ancient nation” (15); “refused to return” (3); “quiver… an open sepulchre” (16); why Israel is named beside Judah (11).
- **6:** mourning “as for an only son” (26); the fountain (7) and gleaning (9); “children abroad” (11); brass, iron, and lead in refining (28–29); the year.
- **7:** why the Lord forbids the prayer (16), beyond the text's “therefore”; whether child sacrifice resumed after Josiah (31); “on high places” (29) and the abominations in the temple (30).
- **8:** “this evil family” (3); the birds in Hebrew (7); “water of gall” (14); the cockatrices (17); the barren vine and fig tree (13).
- **9:** “the daughter of my people” (1, 7); the clipped-temples haircut (26); which peoples practiced circumcision (26); whose voice in 10; wormwood and gall (15).
- **10:** Uphaz (9); why verse 11 is Aramaic (Keil only); whether the Septuagint has 6–10; the Hebrew of “upright” (5).
- **11:** “rising early and protesting” (7); why his own prayer is heard (20) when prayer for Judah is forbidden (14); the date; the prayer for vengeance against later teaching (20).
- **12:** “therefore have I hated it” (8); whether 7–13 foretell or mourn; how 14–17 relate to Jer. 31 and the gathering of the Gentiles.
- **13:** who weeps (17); the “dark mountains” (16); why the girdle must not touch water (1); who is addressed in 20.
- **14:** why the prayer is forbidden; who the prophets of 13–15 were (KnoWhys #441 and #451 may answer it); who speaks the tears of 17; “virgin daughter of my people” (17).
- **15:** “thy remnant” (11); the prayer for vengeance (15); “the precious from the vile” (19).
- **16:** “dung upon the face of the earth” (4); which land is “the land of the north” (15); “Shall a man make gods unto himself” (20).
- **17:** who speaks in 12; which gate in 19; the belief that Jerusalem could not be destroyed (25; KnoWhy #451); no talk on 17:9 or 17:7–8 found; the date.
- **18:** the snow of Lebanon (14; Keil only); how a prophet could pray for his people's destruction (21–23); whether the manual's Sperry passage on conditional prophecy would strengthen 7–10.
- **19:** why the KJV has “east gate” (2); whether Baal and Molech are one god or two (5); why “kings” is plural (3).
- **20:** whether Pashur went to Babylon (4–6); what “Pashur” means (the manual's gloss only); the year.
- **21:** the wording of “the way of life” (8); what Zedekiah's “wondrous works” recall (2; Keil names Hezekiah); the source of the “forest” image (14).
- **22:** “Lebanon, Bashan, and the passages” (20; Keil answers it); how Jehoiakim's burial came about (19); how Matthew's genealogy through Jechonias squares with “no man of his seed shall prosper” (30; Matt. 1:12); “a despised broken idol” (28).
- **23:** “in my house” (11); the whirlwind and “in the latter days ye shall consider it perfectly” (19–20); “all my bones shake” (9); why the land mourns (10); which dreams (25–27).
- **24:** why the baskets were set before the temple (1); when the Jews in 8 went to Egypt (Keil only); “naughty” in 1611; no talk.
- **25:** how the twenty-third year is counted (3); the mingled people, Uz, Dedan, Tema, Buz, Zimri (20–25); why the Septuagint arranges the chapter differently (13–14).
- **26:** why prophesying against the temple was a capital offense (8–11); the new gate (10); where Hezekiah's response to Micah is recorded (19).
- **27:** no talk; whether Babylon was ruled by Nebuchadnezzar's son and grandson (7).
- **28:** who Hananiah was; the year; the Jehoiakim/Zedekiah heading problem of 27:1 seen from this chapter; whether Zedekiah was present.
- **29:** who Elasah, Gemariah, Ahab, Zedekiah son of Maaseiah, and Shemaiah were; “Nehelamite”; when the letter was sent; how the seventy years are counted (10).
- **30:** “the time of Jacob's trouble” (7; only Keil defines it); “who is this that engaged his heart” (21); no talk on 17, 21, 23; the Septuagint not consulted.
- **31:** who “the people which were left of the sword” are (2).
- **32:** seventeen shekels as a price (9); altars on rooftops (29); “one heart, and one way” (39; the footnote to Deut. 6:24 and 10:13 could answer “for the good of them”); where Anathoth is and how far; no talk.
- **33:** why the Septuagint lacks 14–26; why nations “fear and tremble” at Judah's goodness (9); no talk on “Call unto me” (3); whether 12 echoes Jer. 23 and Ezek. 34.
- **34:** what the Lachish letters say about Azekah's signals (7); how and where Zedekiah died (5); no talk.
- **35:** no talk; JST footnotes not checked; what became of the promise in 19 (only later tradition); whether Maaseiah son of Shallum (4) is Zephaniah's father.
- **36:** why Jeremiah was “shut up” (5); who proclaimed the fast (9); whether the “ass's burial” was literally fulfilled (30; the manual's “probably”); what the “many like words” were (32); no talk.
- **37:** who Jonathan the scribe was (15); “the portion” in Benjamin (12); which Pharaoh, from a Church source (5); who Irijah was (13).
- **38:** who the thirty men were (10); the rags under the armpits (11–12; Keil explains); “the third entry” (14).
- **39:** what the judgment at Riblah involved (5); why the poor were left (10); whom Ebed-melech feared (17); the middle gate (3).
- **40:** who Baalis was and why he wanted Gedaliah dead (14); where Mizpah was (the Bible Dictionary's entry doesn't list this one); how Jeremiah, released in 39:14, is in chains at Ramah in 40:1; no talk.
- **41:** why Ishmael killed the eighty pilgrims (6–7); whether the “great waters” are the pool of Gibeon (12; Keil only).
- **42:** why the people say “thy God” and then “our God” (2–6); why Egypt looked safe in 586; whether any of the group returned (44:14, 28).
- **43:** whose daughters in 6; whether and when Nebuchadnezzar invaded Egypt (10–13; Keil only); what happened to Jeremiah after Egypt; the “houses of the gods” at Tahpanhes (13).
- **44:** Jeremiah's death (only the Bible Dictionary's “according to tradition”); whether the Jews in Egypt perished as foretold (27–28); “rising early” as an idiom (4).
- **45:** what “great things” Baruch sought (5); who Neriah was and whether Seraiah (51:59) was Baruch's brother; no talk.
- **46:** why Tabor and Carmel (18; Keil answers it); the date and course of Nebuchadnezzar's invasion of Egypt (13); Book of Mormon parallels not checked.
- **47:** which Pharaoh and year (1; Keil only); whether Babylon destroyed Gaza and Ashkelon; “the remnant of their valley” (5).
- **48:** where the Moabite towns lie and which Israel once held; the date and how Babylon conquered Moab; “at ease” (11; footnote “relaxed his guard”); the footnote on 47; fear, pit, and snare (43–44; Isa. 24:17–18); no talk.
- **49:** Ai (3); how the Damascus and Kedar oracles were fulfilled (23–33); why Elam is judged (34–38); “the swelling of Jordan” (19); no talk on Elam's return (39).
- **50:** “the mingled people” (37); how “never inhabited” was fulfilled (39–40); the Hebrew behind “Redeemer” (34); no talk.
- **51:** Ararat, Minni, and Ashkenaz (27; Keil only); “the vengeance of his temple” (11); Sheshach (41) outside the cipher note; whether Seraiah was Baruch's brother (59).
- **52:** why Evil-merodach released Jehoiachin (31); the five-cubit capital against 2 Kgs. 25:17's three (22); who Seraiah the chief priest was (24); no talk.
