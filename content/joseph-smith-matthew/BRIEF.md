# Joseph Smith—Matthew brief

Book-level decisions for Joseph Smith—Matthew. The site-wide standard is in `STANDARDS.md`; this file records what is particular to this book. Writers, checkers, and reviewers read both before starting the chapter. Obadiah's brief is the model for a one-chapter book; Moses's for a book of Joseph Smith's translation of the Bible.

**Status (2026-11-17):** drafted by the coordinator from a research survey made in the session with the research scripts (`.cache/pgp/research-jsm.md`, not committed); each source named below was opened then. **The author chose this book** (2026-11-17: “Lets do the remaining books in the Pearl of Great Price”) **and has not read this brief.** Where a section says “Proposed,” that is the coordinator's decision, and the author can overturn it.

Related files: `OPEN-QUESTIONS.md` (what waits for the author, for every book).

## State of the book

`node scripts/status.mjs joseph-smith-matthew` prints what the repository shows. What a script can't see:

- **The book is in preview** (`status: preview` in `book.yaml`), written on the branch `worktree-pearl-of-great-price` with Joseph Smith—History and the Articles of Faith. The author wants the three on the dev site, and inspected there, before they go to `main` (2026-11-17: “I want these pushed to dev and inspected before going to main”).
- **The chapter is not yet written.**

## What the author has decided

- **Matthew is not on the site, so this book carries the commentary on the Mount of Olives discourse** (coordinator's proposal, approved 2026-11-17: “Yes. Proceed.”). Moses and Abraham link to Genesis for the verses they share; here there is nothing to link to, so the notes answer a reader's questions about the whole discourse, with the weight on what Joseph Smith's translation changed. When Matthew 24 is written, its notes will link here, not the other way round.
- **No side-by-side comparison** with the King James text (carried over from Moses, 2026-10-06). A note may say what the King James text reads where the difference answers a reader's question; no chapter lists the differences, and there is no comparison panel.
- **The text is the 1921 edition's** (the standing rule, 2026-10-06). See “The text”: two of its readings are slips the 1981 edition repaired.
- **The Church's teaching manuals are finders, never cited** (`STANDARDS.md` §1): *Scripture Helps: New Testament* and the Pearl of Great Price Student Manual included.

## What a chapter is for here

A reader of Matthew 24 asks: *Which of these things happened when Jerusalem fell, and which are still to come? What is the abomination of desolation? Who are the elect? What generation will not pass? What is the sign of the Son of Man? Why the eagles and the carcase? How can I keep from being deceived?* Joseph Smith's translation answers the first of these by its order: the Lord's answer to the disciples' first question (the temple and the Jews) runs to the middle of verse 21; “and again” opens His answer to the second (His coming and the end of the wicked). The chapter answers the others from the text first, then from Restoration scripture (above all D&C 45, which the Lord gave the day before the New Testament translation began), then from the Latter-day Saint studies named below.

**What the translation changed is the chapter's subject where it answers a question.** The Church History Topics essay says Joseph Smith “heavily revised” Matthew 24, “adding phrases, rearranging verses”; Ogden counts “33 percent more material.” The changes that a reader needs:

- The order: the two questions (1:4, “or the destruction of the wicked, which is the end of the world”) and the two answers, with the dividing line in the middle of 1:21. *Scripture Helps* (a finder) puts the line at verse 22 and the Student Manual at 21; Jackson (“What Is the Sign of Thy Coming?”, paragraph 9) puts it between “concerning the Jews” and “and again,” which is what the verse says. **Follow the verse and Jackson.**
- Signs moved to the last days (wars, famines, pestilences, earthquakes) and signs given twice, once for each fulfillment (deceivers, iniquity abounding, the gospel preached, the abomination of desolation: 1:10, 12, 22, 30–32; Jackson paragraph 15).
- Additions: “upon this temple” (1:3), “the elect according to the covenant” (1:20, 22), “whoso treasureth up my word, shall not be deceived” (1:37), “the end of the earth is not yet, but by and by” (1:55), and the closing verse that has no counterpart in Matthew (1:55).

**Link to the books that are on the site.** Daniel's abomination of desolation (`[[Dan. 9:27]]`, `[[Dan. 11:31]]`, `[[Dan. 12:11]]`); the sun darkened and the stars falling (`[[Isa. 13:10]]`, `[[Joel 2:10]]`, `[[Joel 2:31]]`); the Mount of Olives (`[[Zech. 14:4]]`); the days of Noah (`[[Gen. 6:5]]`, `[[Moses 8:22]]`); the gathering of Israel from the four winds (Isaiah, Jeremiah, Ezekiel). Run `node scripts/occurrences.mjs all "<phrase>" --site` before writing a note on a phrase that comes from the Old Testament, and say only what this passage does with it.

## Divisions

`book.yaml` has one division, `olivet`, range [1, 1]. **Proposed `sections`** (the writer may refine them from Jackson and the text): 1–3 (leaving the temple; “not one stone”); 4 (the disciples' two questions); 5–11 (deceivers, affliction, enduring to the end); 12–20 (the abomination of desolation; flight from Judea; the days shortened); 21–31 (“and again”: false Christs, the elect according to the covenant, wars and rumors of wars, the gospel preached in all the world); 32–36 (the abomination again; the sun darkened; the sign of the Son of Man); 37–40 (treasuring His word; the parable of the fig tree); 41–55 (as in the days of Noah; watch; the faithful and the evil servant; the end of the wicked).

## Book-wide conventions

**What in this brief is a lead and not a fact.** Words in quotation marks below were copied from the page named. The rest is the coordinator's direction of where to look. None of it goes into the chapter until the writer has read it on a page and given it a ledger row (`STANDARDS.md` §4).

- **When and why.** The Church's heading: “An extract from the translation of the Bible as revealed to Joseph Smith the Prophet in 1831: Matthew 23:39 and chapter 24.” The occasion is certain: D&C 45:60–61 (7 March 1831), “it shall not be given unto you to know any further concerning this chapter, until the New Testament be translated, … Wherefore I give unto you that ye may now translate it,” and the New Testament was begun the next day (Jackson, “What Is the Sign,” paragraph 6; New Testament Revision 1, page 1). The month is not: “probably June” (Jackson, “What Is the Sign,” paragraph 28); “between mid-April and mid-June 1831” (Jackson 2019, paragraph 31); “the spring of 1831” (Crawley). **Proposed `when`: “1831, Kirtland, Ohio; the setting in the text is the Mount of Olives, two days before the Passover” (confirm the last from Matthew 26:2), and the `setting` says “probably in the spring or early summer,” as Jackson's estimate.** Do not give the Student Manual's September.
- **Two settings.** The setting in the text (the Tuesday of the last week; the disciples' question on the Mount of Olives; Herod's temple, destroyed in A.D. 70) and the setting of the translation (Kirtland in 1831; D&C 45). Both are brief; the `setting` is about 150–250 words. The destruction of Jerusalem: Jared W. Ludlow, “The First Jewish Revolt against Rome” (RSC), read with `--find`, and the Bible Dictionary, “Abomination of desolation.” The flight of the Christians to Pella: Horton (RSC, paragraph 57) gives it as “believed” to have happened; keep his hedge.
- **How it came into the Pearl of Great Price.** Printed as a broadside, perhaps in Kirtland in 1835 (Crawley, item 25, “tentatively assigned”; Jackson); in Franklin D. Richards's Pearl of Great Price, Liverpool, 1851; canonized 10 October 1880 (the Introduction to the Pearl of Great Price); titled “Joseph Smith—Matthew” in 1981, having been “Joseph Smith I” since 1902 (Jackson, “The Book of Moses and Joseph Smith—Matthew,” paragraphs 44, 63). One sentence of this in the `setting` at most; never “printed in 1831.”
- **What the translation is.** The Bible Dictionary (`bd-jst`): the JST is “not the official Bible” of the Church but “an invaluable aid to biblical interpretation”; Church History Topics (`church-history-topics-jst`): Joseph Smith “did not employ Hebrew and Greek sources.” **No note argues from the Greek** that the translation is or is not what Matthew wrote. A Language note explains a word in 1611 or 1831 English (“abomination,” “carcase,” “meat in due season,” “cut him asunder”), from the Oxford English Dictionary only if a page is readable, otherwise from a Latter-day Saint study or a commentary that explains it.
- **The signs and our day.** The Lord “has not revealed exactly when He will come again” (Gospel Topics, “Second Coming of Jesus Christ,” paragraph 8), and the fig tree teaches the season, not the day. **Proposed:** the notes say what the text and the Church's sources say each sign is; they do not match a sign to events of the present day or say how near the end is, and they quote no one who does.
- **“Concerning the Jews.”** The first half of the discourse is about Jerusalem and its people in the first century. Speak of them as the text does; say nothing of the Jewish people in later ages except what a verse or a Church source says (D&C 45:21's “this generation of Jews”). No note implies collective guilt.
- **Outside commentary.** Latter-day Saint studies come first; for this book they are many (see “Sources”). The older commentaries on Matthew on Bible Hub (Ellicott, Meyer, Barnes and the like) may be used as Keil is for the Old Testament: last, for a question about the first-century setting or an English word that nothing closer answers, in no more than about a third of the notes, and never against the Church's reading or the translation's.
- **The Witness of Christ.** The discourse is His own prophecy of His coming “in the clouds of heaven, with power and great glory” (1:36). The `christ` section rests on His words in the chapter (1:1, 36–37, 46–48); the application is to be ready and not deceived (1:37, 48), in the scripture's words.

## Contested and sensitive questions

One approach for each. The writer reads the source again before writing the note and quotes from the page.

- **The abomination of desolation, twice (1:12, 32).** The Bible Dictionary: fulfilled “when the Roman legions under Titus, in A.D. 70, laid siege to Jerusalem,” and of 1:31–32, “That is, Jerusalem again will be under siege.” Link Daniel; say no more about the second fulfillment than that.
- **“This generation” (1:34).** The verse reads “this generation, in which these things shall be shown forth, shall not pass away until all I have told you shall be fulfilled.” D&C 45:21 speaks of “this generation of Jews” in the first fulfillment, and D&C 45:30–31 of “that generation” in which “the times of the Gentiles” are fulfilled. Ogden's reading (RSC, paragraph 67) is his; give it as his or leave it out. **Proposed:** the note says that the translation ties the generation to the signs, not to the disciples' lifetime, and gives D&C 45 beside it; it goes no further.
- **“The elect according to the covenant” (1:20, 22, 27, 37).** Those who have made covenants with God. Read D&C 29:7, 33:6 and the Guide to the Scriptures, “Elect,” and cite them; the Harold B. Lee statement that *Scripture Helps* quotes is from a book that cannot be read online and is not used.
- **“The end of the world” (1:4, 31, 55).** The translation's own words: “the destruction of the wicked, which is the end of the world” (1:4), and “the end of the earth is not yet, but by and by” (1:55). Joseph Smith taught that “the end of the world is the destruction of the wicked” (*Scripture Helps* quotes it from the *Teachings* manual, a finder): find the original in the Joseph Smith Papers and cite that, or leave it.
- **The eagles and the carcase (1:27).** The translation adds “so likewise shall mine elect be gathered from the four quarters of the earth,” which turns the saying to the gathering. Say that from the verse; any other reading (Nibley, whom *Scripture Helps* cites) only from a page read, as its author's.
- **The sign of the Son of Man (1:36).** Nothing is revealed of what it will be beyond the verse. A prophet's teaching on it comes in only from a talk or the Joseph Smith Papers read in full.

## Sources for Joseph Smith—Matthew

Searched 2026-11-17 for this brief: the Religious Studies Center, BYU Studies (no title on this book), Scripture Central (KnoWhys; the archive did not load), the *Interpreter* journal (no title on this book or Matthew 24), the Joseph Smith Papers, the Gospel Library.

**Readable:**

- The Gospel Library page (`…/scriptures/pgp/js-m/1`), with 65 footnotes (none a JST footnote); `node scripts/footnotes.mjs joseph-smith-matthew 1` prints them and *Scripture Helps: New Testament*, chapter 22, “Joseph Smith—Matthew 1; Matthew 24–25; Mark 12–13; Luke 21” (33 endnotes; a finder). The saved output is `.cache/pgp/fn-jsm.txt`. The King James text of Matthew 24 is read from `…/scriptures/nt/matt/24` (there is no `data/kjv/matthew.json`).
- The Introduction to the Pearl of Great Price (`…/scriptures/pgp/introduction`, paragraphs 2 and 7); Bible Dictionary, “Joseph Smith Translation (JST)” (`bd-jst`) and “Abomination of desolation”; Church History Topics, “Joseph Smith Translation of the Bible” (`church-history-topics-jst`; the address is `…/history/topics/joseph-smith-translation-of-the-bible`); Gospel Topics, “Second Coming of Jesus Christ” (`gs-second-coming`; check the page it names); D&C 45 and the Guide to the Scriptures.
- The Religious Studies Center (read with `--find`): Kent P. Jackson, “‘What Is the Sign of Thy Coming?’” (`understanding-joseph-smiths-translation-bible/what-sign-thy-coming`; the best single source on the translation's structure); Jackson, “Joseph Smith's Translation of the New Testament” (`new-testament-history-culture-society/joseph-smiths-translation-new-testament`, paragraphs 30–42); Jackson, “The Book of Moses and Joseph Smith—Matthew” (`understanding-joseph-smiths-translation-bible/book-moses-joseph-smith-matthew`; the editions, and the textual repairs at 1:8, 1:18 and 1:30, paragraphs 84–89); Jackson, “Publishing the New Translation”; Peter Crawley, *A Descriptive Bibliography of the Mormon Church*, vol. 1, item 25 (`descriptive-bibliography-mormon-church-volume-1/entries-1-100`); D. Kelly Ogden, “Prophecies and Promises of Joseph Smith—Matthew” (`vol-3-no-1-2002/prophecies-promises-joseph-smith-matthew`; verse by verse, his readings); George A. Horton Jr., “Joseph Smith—Matthew: Profiting from Prophecy” (`pearl-great-price-revelations-god/joseph-smith-matthew-profiting-prophecy`); Jared W. Ludlow, “The First Jewish Revolt against Rome” (`new-testament-history-culture-society/first-jewish-revolt-against-rome`). Search `sources.yaml` for “Jackson” first: several of his JST chapters have keys.
- Scripture Central KnoWhys: #628 (why the JST), #790 (“Why Does Doctrine and Covenants 45 Quote the Book of Zechariah?”, on the Mount of Olives and the promise of D&C 45:61), #800 (already a key). No KnoWhy is on this book as such.
- The Joseph Smith Papers: New Testament Revision 1 and 2 (`…/paper-summary/new-testament-revision-1/<image>`, `…-2/<image>`; propose `jsp-nt1`, `jsp-nt2`). The Matthew 24 pages of Revision 1 were not found among images 44–68; a writer who needs the manuscript works from Jackson's quotation of it.

**Not readable, or not to be used:** Matthews's *A Plainer Translation* and Faulring, Jackson and Matthews's *Original Manuscripts* (not online; `matthews-plainer` is a key, but cite only what a readable page says); Scripture Central's archive; the *Interpreter* article “Standing in the Holy Place” (no paragraph names this book; use only after `--find "abomination"` shows it bears on 1:12); the Harold B. Lee book that *Scripture Helps* quotes.

## The text

`data/kjv/joseph-smith-matthew.json` (1 chapter, 55 verses) was imported on 2026-11-17 by `scripts/fetch-gl.mjs joseph-smith-matthew pgp/js-m 1 "Joseph Smith—Matthew"`; `scripts/check-kjv.mjs joseph-smith-matthew` reports no difference from the Gospel Library apart from the readings below.

**Compared with the 1921 edition** (`.cache/pgp/jsm-1921.txt`, from the 1929 printing; `scripts/compare-edition.mjs`, every difference read in the scan). The site prints the 1921 wording (`data/kjv/joseph-smith-matthew.edition.json`) in two verses:

- **1:8:** 1921 “and shall betray one another;” (today “and shall betray one another, and shall hate one another;”).
- **1:30:** 1921 “the love of many shall wax cold” (today “the love of men”).

Both are among the repairs the 1981 edition made from the manuscripts: the clause in 1:8 had been lost in copying, and 1:30 restored the manuscript's “men” (Jackson, “The Book of Moses and Joseph Smith—Matthew,” paragraphs 84–89; read them before writing). **Proposed:** each verse gets a short Context note saying what today's edition reads, that it restores the manuscript, and where the source says so, as the Moses notes on 1:14 and 1:19 do. The 1902 printing (`.cache/pgp/pearlgreatprice00unkngoog.txt`) agrees with 1921 in both. Copy every quoted phrase from `data/kjv/joseph-smith-matthew.json`.

## Checks while the book is in preview

```sh
node scripts/check-chapter.mjs joseph-smith-matthew 1
```

The working folder is `.cache/batch/joseph-smith-matthew/` (not committed): `proposed/01.yaml`, `reports/01-writer.md`, `reports/01-check.md`.

## Reader questions no source answered

In `content/joseph-smith-matthew/UNANSWERED.md`, once the chapter is written.
