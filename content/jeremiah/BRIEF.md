# Jeremiah brief

Book-level decisions for Jeremiah. The site-wide standard is in `STANDARDS.md`; this file records what is particular to Jeremiah. Writers and checkers read both before starting a chapter.

Related files:
- `OPEN-QUESTIONS.md`: judgment calls waiting for the author.
- `THEME-CANDIDATES.md`: topics that run across chapters, collected for possible theme pages.

## State of the book

Started 2026-10-02. The author asked for all 52 chapters to be written while away, so this brief was drafted by the coordinating session. The author then confirmed the approach (2026-10-02): no particular direction or focus questions for Jeremiah; continue as with Isaiah, whose commentary the author is happy with “both in its content and its quantity.” Each writer works from the questions a careful reader would ask (`STANDARDS.md` §3, “Read, ask, then seek”), and the finished Isaiah chapters are the measure of depth and length.

The book is `status: preview` in `book.yaml`, so it appears only in the preview build until the author takes that line out.

**How each chapter is made:** a `chapter-writer` agent (Sonnet) writes the chapter and its ledger; a `chapter-reviewer` agent (Opus, which did not write it) reopens the sources and repairs what fails; the coordinating session adds the `sources.yaml` entries, runs the checks, and commits one chapter at a time.

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
| 34–45 | The Fall of Jerusalem | (d) 34–38, the siege; 39–44, after the fall; 45, Baruch |
| 46–52 | The Nations and the End | 46–51, foreign nations; 52, historical conclusion |

## Book-wide conventions

- **Say when.** The book is not in order of time. Every chapter's `when` names the king and, where the text or a source gives one, the year. Take the date from the chapter's own heading verse first (for example [[Jer. 25:1]]), then from the Church's chapter heading or the Bible Dictionary. Where a chapter gives no date, say so; don't guess.
- **Dates.** Use the Bible Dictionary's (“Jeremiah” and “Chronology”): Josiah 626–608 for Jeremiah's part of the reign, Jehoiakim 608–597, Zedekiah 597–586, the fall of Jerusalem 586 B.C. Where a source you cite uses 587 or another year, keep the Bible Dictionary's date and mention the difference only if a note depends on it.
- **Lehi's Jerusalem.** Jeremiah and Lehi preached in the same city in the same years ([[1 Ne. 1:4]], [[1 Ne. 7:14]], [[1 Ne. 5:13]], [[Hel. 8:20]]), and Zedekiah's son Mulek reaches the Book of Mormon ([[Hel. 6:10]], [[Hel. 8:21]], [[Omni 1:15]]). This is the book's main Restoration connection. Use it where a chapter really meets the Book of Mormon (the same event, the same charge against the city, a named person), sourced like anything else. Don't add a Lehi note to a chapter just to have one.
- **Names with two spellings.** The KJV has both Nebuchadrezzar and Nebuchadnezzar; Jehoiachin is also Jeconiah and Coniah; Jehoahaz is also Shallum. A `phrase` uses the spelling in that verse (`data/kjv/jeremiah.json`); the commentary says who is meant the first time the other name appears in a chapter.
- **Repeated passages.** Jeremiah repeats itself (for example 6:12–15 and 8:10–12; 23:5–6 and 33:15–16), and chapter 52 parallels [[2 Kgs. 24:18–25:30]]. The second chapter says briefly that the passage also stands in the first and links to it; it doesn't repeat the notes.
- **The Septuagint.** Jeremiah's Greek text numbers the chapters differently after 25:13 (Brenton's chapter 25 on Bible Hub continues with verses marked “(32:…)”, and the prophecies against the nations follow there). When citing the Septuagint, give the Greek chapter and verse you actually read. Any statement about how and why the Greek differs (its length, its order, what the Dead Sea Scrolls show) needs a source read in the session like any other claim. Raise it only where it changes how a verse is read.
- **“Later than Jeremiah.”** The Bible Dictionary says chapters 50–51 “in their present form are later than Jeremiah” and that chapter 52 is a historical conclusion. Chapters 50–52 report this once, plainly, citing the Bible Dictionary; they don't build on it or argue with it. (See `OPEN-QUESTIONS.md`.)
- **Joseph Smith Translation.** The Gospel Library's JST appendix has one Jeremiah entry (26:13, `jst-jer-26`). Other JST readings are in the footnotes of the Church's edition; check the chapter's Gospel Library page for them, and cite `lds-scriptures` with a ledger row for a footnote reading.
- **The prophet's prayers.** The passages often called Jeremiah's “confessions” (in chapters 11–12, 15, 17, 18, and 20) are treated in their own chapters. Don't use the term, or list the set, without a source read in the session.
- **Graphic passages** (chapters 2–3, 13, 19, and others): describe rather than quote (`STANDARDS.md` §3).
- **Isaiah is on the site.** `[[Isa. 53:4]]` links to the Isaiah chapter, and Isaiah has theme pages (`content/isaiah/themes/`). Where Jeremiah takes up something Isaiah's pages already explain, link rather than re-explain.
- **Theme candidates.** When a chapter develops a topic that runs across the book, the writer reports it; the coordinator adds it to `THEME-CANDIDATES.md`. No Jeremiah theme pages are written until the author chooses them.

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
