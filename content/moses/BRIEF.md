# Moses brief

Book-level decisions for the Book of Moses. The site-wide standard is in `STANDARDS.md`; this file records what is particular to Moses. Writers, checkers, and reviewers read both before starting a chapter. Malachi's brief (`content/malachi/BRIEF.md`) is the model for the form; Genesis's brief (`content/genesis/BRIEF.md`) matters more here than for any other book, because Genesis 1–6 on the site already treats much of the same ground.

**Status (2026-10-06):** drafted by the coordinator from the sources named below, each opened in the session with the research scripts. The author asked for the book on 2026-10-06 and approved its basis (below); the author has not read this brief. The book is in preview (`status: preview` in `book.yaml`). Where a section says “Proposed,” that is the approach the chapters follow; it is the coordinator's decision, and the author can overturn it.

Related files: `OPEN-QUESTIONS.md` (what waits for the author); `content/genesis/CHURCH-STATEMENTS.md` (the Church's statements on the Creation, the Fall, the Flood, and other contested questions, quoted with their pages; it serves Moses too).

## What the author has decided

- **Moses is the next book** (author, 2026-10-06), the first on the site from outside the Old Testament, though it is studied with it (“Moses and Abraham are usually studied alongside the old Testament”). It is written in the three-agent arrangement (`AUTHORING.md`, “Plan for the next book”).
- **Moses' notes cover what Moses has that Genesis does not, and link to Genesis for the rest** (coordinator's proposal, approved by the author 2026-10-06). The author's rule for Genesis was no side-by-side comparison with Moses (`content/genesis/BRIEF.md`); the same holds from this side. See “Moses and Genesis” below.
- **No focus questions before a book is written** (author, 2026-10-06; `AUTHORING.md`).
- **Don't replicate the Gospel Library; newest trumps oldest; follow *Scripture Helps* to what it cites; decide what the standard decides; the Student Manual limits apply.** All as in Malachi's brief. For Moses the newest is *Scripture Helps: Old Testament* (2025), which treats every chapter of Moses, at length.

## Moses and Genesis

The table of overlaps is in Genesis's brief (“Where Restoration scripture overlaps the text”). In short: Moses 1 has no Genesis parallel; Moses 2 is Genesis 1 and Moses 3 is Genesis 2, verse for verse; Moses 4:1–4 (Satan's rebellion) is new and 4:5–31 is Genesis 3; Moses 5:1–15 is new and 5:16–59 is Genesis 4 with much added; Moses 6:1–25 runs beside Genesis 4:25–5:21; Moses 6:26–7:69 (Enoch) stands where Genesis has 5:22–24; Moses 8 is Genesis 5:25–6:13 with Noah's preaching added.

**The rule.** Before writing a note, run `node scripts/occurrences.mjs genesis "<phrase>" --site` or read the Genesis chapter (`content/genesis/chapters/NN.yaml`) to see what the site already says on the parallel verse.

- Where Genesis already explains the verse (a Hebrew word, the ancient setting, an outside commentator's reading), **do not write it again**: link, in a sentence, “see the note on [[Gen. 1:26]],” and give the Moses note to something else or leave the verse without a note. A Moses chapter that runs beside Genesis may therefore have few notes on its shared verses, and that is right.
- Where Moses adds, changes, or reframes (the first person, “I, God”; “by mine Only Begotten”; the spiritual creation in 3:5–7; Satan's rebellion; the angel and the sacrifice in 5:4–12; Eve's words in 5:11; Cain and Satan; the book of remembrance; everything about Enoch; Noah's preaching and the “sons of God” of 8:13–15), **that is the chapter's subject.**
- A note may say what a Moses verse has that its Genesis verse lacks when that answers a reader's question. No chapter lists the differences, and there is no comparison panel.
- Each chapter that runs beside Genesis names the Genesis chapter in `parallels` with `primary: true` (as Malachi 3 does for 3 Nephi 24), so the header says “Also in Genesis 1.”
- **No Hebrew.** There is no Hebrew text of Moses. `scripts/hebrew.mjs` does not apply, and a Language note is written only where a source read discusses the English wording of Moses itself (a word in Joseph Smith's day, a reading in the manuscripts). Hebrew behind the shared verses belongs to the Genesis notes.
- **No outside commentary on Moses exists**, and Keil on the parallel Genesis verse is not quoted here (the Genesis notes have him). So “something from beyond the Church's own publications” (`STANDARDS.md` §1) means, for this book, BYU's Religious Studies Center, BYU Studies, Scripture Central, and the Joseph Smith Papers.

## Divisions

Five, described from the Church's chapter headings (in `book.yaml`): 1 Moses on the Mountain (`mount`); 2–4 The Creation and the Fall (`eden`); 5 Adam and Eve and Their Children (`adam`); 6–7 Enoch and Zion (`enoch`); 8 The Days of Noah (`flood`). The keys are not used by another book.

## Book-wide conventions

- **What the book is, said once, in chapter 1's setting.** The Church edition's headnote: “An extract from the translation of the Bible as revealed to Joseph Smith the Prophet, June 1830–February 1831.” The Introduction to the Pearl of Great Price: “An extract from the book of Genesis of Joseph Smith's translation of the Bible, which he began in June 1830.” The edition dates each chapter: 1 (June 1830); 2–5 (June–October 1830); 6 (November–December 1830); 7 (December 1830); 8 (February 1831). *Scripture Helps*, “Moses 1: What is the book of Moses?” (paragraphs 5–12 of its first chapter) is the newest statement; read it before writing chapter 1. Later chapters give their date in `when` and do not retell the history of the translation.
- **Two settings.** Each chapter has the setting inside the text (Moses on the mountain; Adam's family; Enoch's day) and the setting of its revelation (New York and Ohio, 1830–31). `when` and `setting` give both, briefly; what the first Saints were doing when a chapter was received (the Church six months old; the gathering to Ohio; Zion in the revelations of 1831) comes in only from a source read.
- **Who is speaking.** From 2:1 the account is God's own words to Moses in the first person (“I, God”). Moses 1:40–41 says Moses is to write, and that the words will be taken from the book and restored. Say it once where it first matters.
- **Names of God.** In Moses 1 the speaker is “the Lord God Almighty” who speaks of “mine Only Begotten”; *Scripture Helps* has a section on who is speaking (“Moses 1:2–8: Who was speaking to Moses?”). Follow it, and do not go beyond it.
- **The text and its manuscripts.** The text is the Church's current edition, imported from the Gospel Library (see “The text”). The manuscripts (Old Testament Revision 1 and 2) are on the Joseph Smith Papers site. A difference between the manuscripts and the printed text comes into a note only when a source read discusses it and it answers a reader's question; the chapters are not a textual apparatus.
- **Genesis, Isaiah, Jeremiah, Lamentations, and Malachi are on the site.** Link rather than re-explain. Likely: every parallel Genesis note; [[Mal. 3:16]] on the book of remembrance (with Moses 6:5); Isaiah and Jeremiah on Zion.
- **No Book of Mormon comparison panel.** Use the `scripture` kind for Book of Mormon and Doctrine and Covenants passages.
- **Graphic passages.** Cain's murder of Abel, Lamech's killing, and the violence before the Flood are described plainly and briefly.
- **Theme candidates.** Report what runs across the book (the Only Begotten named throughout; Zion; Satan's dealings with Moses, Eve, Cain; the gospel taught from the beginning; weeping heavens and earth); the coordinator adds it to `THEME-CANDIDATES.md`.

## Contested and sensitive questions

One approach for each, so that eight chapters say the same thing. For every one of these *Scripture Helps* (2025) has a section, named here with its paragraph numbers; it is the newest of the Church's statements and the chapters follow it. The coordinator read the section lists on 2026-10-06, not the sections themselves: **the writer reads the section before writing the note**, and quotes from the page.

- **Cain's curse and mark; “the seed of Cain were black”; the people of Canaan (5:23–41; 7:8; 7:22).** *Scripture Helps*: “Genesis 4:7–15; Moses 5:23–40: What do we know about the curse and mark placed upon Cain?” (chapter 3, paragraphs 27–29); “Moses 7:5–8: What do we know about the children of Canaan and their curse?” (chapter 5, paragraphs 5–6); “Moses 7:22: What does it mean that ‘the seed of Cain were black?’” (chapter 5, paragraphs 12–15). The Gospel Topics essay “Race and the Priesthood” (`gte-race-priesthood` in `sources.yaml`) and Scripture Central KnoWhy #836, “What Were the Curse and Mark of Cain?” are also readable. Proposed: say what the verse says and no more; give the Church's present teaching in its own words from those pages, including what the Church disavows; do not connect these verses to race, to priesthood restriction, or to any people today except to report that the Church rejects such readings; do not speculate on what the mark was. Genesis 4 on the site has notes on Cain; say the same thing they say.
- **The Creation and evolution (2–3; 3:7).** *Scripture Helps*: “How can I approach my study of the Creation?”, “How long did the Creation take?”, “Did God create the earth out of nothing?”, “Moses 3:7: What is the Church's position on evolution?” (chapter 2, paragraphs 7–13 and 22–25). `content/genesis/CHURCH-STATEMENTS.md` has the Church's statements. Proposed: as Genesis's brief decided; the Moses chapters add only what Moses adds (the spiritual creation of 3:5–7; “the first flesh upon the earth, the first man also”), stated from the Church's sources, with no theory of the writer's own about how the spiritual creation relates to the physical one.
- **The Council in Heaven and Satan's plan (4:1–4).** *Scripture Helps*: “Moses 4:1–4: How did Satan rebel in the Council in Heaven?” (chapter 3, paragraphs 5–7). Proposed: keep to the verse and that section. The common saying that Satan would have “forced” everyone to be righteous is used only if a source read says it, in its words.
- **The Fall, Eve, and “rule over” (4:5–31; 5:10–11).** *Scripture Helps* has sections on conflicting commandments, whether partaking was a sin, “rule over,” the coats of skins, and “Why did Adam and Eve rejoice…?” (chapter 3). Proposed: follow them and the Genesis 3 notes; Eve's words in 5:11 are the chapter's own subject. The section on coats of skins leads to “Temple garments” under Learn More: a note says only what the Church's published page says.
- **The temple.** BYU's volume has a chapter “The Book of Moses and Temple Worship,” and KnoWhy #396 is on the endowment. Proposed: a chapter may say, from a source read, that the Book of Moses is related to temple worship; it describes nothing of the temple ceremonies beyond what the Church itself has published, and makes no parallel of its own.
- **Long lives, giants, and the “sons of God” (6:10–25; 7:15; 8:13–21).** *Scripture Helps* has sections on each (chapter 4, paragraph 6; chapter 5, paragraph 7; chapter 6, paragraphs 5–7). Genesis's brief and the Genesis 5–6 notes settle them; link.
- **The Flood (8:22–30).** As Genesis's brief decided; *Scripture Helps*, “What are some possible reasons God sent the Flood?” (chapter 6, paragraphs 15–17).
- **Enoch and ancient writings about Enoch (6–7).** Latter-day Saint scholars have set the Enoch of Moses beside ancient Enoch books (1 Enoch, the Book of Giants; the name Mahijah in 6:40 and Mahujah in 7:2). Proposed: such a parallel is reported only from a source read in full, as that author's proposal (“has been proposed”), not as established, and no more than one such note in a chapter (`STANDARDS.md` §1, not a compendium). The ancient texts themselves are not quoted unless the page read prints them.
- **Zion “taken up into heaven” and its return (7:18–21, 62–64).** *Scripture Helps*: “What is Zion?”, “taken up into heaven,” and the three subsections on 7:60–63 (chapter 5, paragraphs 8–11 and 25–32). Proposed: follow it; the place of the New Jerusalem and the timing of the last days are stated only in the Church's words.
- **God weeps (7:28–40).** The center of chapter 7. Proposed: say what the text says of why (7:32–33, 37); a reading of what this shows about God's nature comes from a prophet's or apostle's words, read in full. *Scripture Helps* points to “God's love” under Learn More.
- **“The Lamb is slain from the foundation of the world”; “Man of Holiness”; the name of Jesus Christ known from the beginning (5:6–9; 6:52, 57; 7:47, 53).** *Scripture Helps* has a section on each. These carry the book's Witness of Christ; the Only Begotten is named in every chapter, so `christ` should rest on the chapter's own verses first.
- **Baptism and the gift of the Holy Ghost before Christ (6:52–68).** *Scripture Helps*, chapter 4, paragraphs 21–28. Follow it.

## Sources for Moses

Tested 2026-10-06 with the research scripts. `STANDARDS.md` §9 has the general tools.

**Readable, and in `sources.yaml`:**

- *Scripture Helps: Old Testament* (2025): `scripture-helps-moses-1` (“Moses 1; Abraham 3”, 54 endnotes; paragraphs 5–21 are on Moses 1); `scripture-helps-gen-1-2` (Moses 2–3; 41 endnotes); `scripture-helps-gen-3-4` (Moses 4–5; 44); `scripture-helps-gen-5` (Moses 6; 38); `scripture-helps-moses-7` (62 endnotes); `scripture-helps-gen-6-11` (Moses 8; 51). `node scripts/footnotes.mjs moses <n>` finds the right chapter and prints its sections and endnotes with their links; the saved output is `.cache/batch/moses/fn1.txt` to `fn8.txt`. Follow the endnotes to the talks and articles they cite.
- The Church's footnotes: 121, 46, 50, 62, 107, 149, 132, and 44 by chapter (in the same files). None is a Joseph Smith Translation footnote.
- *The Pearl of Great Price Student Manual* (2018), by passage: `…/study/manual/the-pearl-of-great-price-student-manual-2018/the-book-of-moses/<slug>`, with slugs `moses-1-1-11`, `moses-1-12-23`, `moses-1-24-42`, `moses-2-1-31`, `moses-3-1-25`, `moses-4-1-19`, `moses-4-20-32`, `moses-5-1-15`, `moses-5-16-59`, `moses-6-1-47`, `moses-6-48-68`, `moses-7-1-41`, `moses-7-42-69`, `moses-8`, and an introduction at `…/the-book-of-moses`. Keys in use: `pgp-manual-moses-2`, `pgp-manual-moses-3`, `pgp-manual-moses-4` (4:1–19), `pgp-student-manual-2018` (7:42–69). Propose the others as `pgp-manual-moses-<slug>`. It counts as a Student Manual for the limits: about a third of a chapter's notes at most.
- BYU Religious Studies Center, Aaron P. Schade and Matthew L. Bowen, *The Book of Moses: From the Ancient of Days to the Latter Days*, each chapter at `rsc.byu.edu/book-moses/<slug>`: `joseph-smith-translation-book-moses`, `moses-1-visions-moses` (65,005 characters), `moses-1-work-glory`, `moses-2-purpose-logistics-creation`, `moses-2-image-likeness`, `moses-3-identity-commandments-purpose`, `moses-4-council-heaven`, `moses-4-fall-doctrinal-perspectives-insights`, `moses-4-partaking-fruit-knowledge-accountability-redemption`, `moses-5-family-adam-eve-law-sacrifice`, `moses-5-cains-offering-curse`, `moses-6-enoch`, `moses-7-enochs-zion`, `moses-7-enochs-vision-earth-savior-zions-return`, `moses-7-influence-development-zion`, `moses-8-noah-flood`, `book-moses-temple-worship`, and front matter (`introduction`, `coming-forth-pearl-great-price`, `ancient-nature-gospel`, `joseph-smith`). Keys in use: `schade-bowen-fall`, `schade-bowen-fruit`, `schade-bowen-moses-5`, and those for Moses 6 from Genesis and Malachi; search `sources.yaml` for “Schade” before proposing. This is the main source from beyond the Church's own publications; it is long, so read with `--find`.
- BYU Studies: Kent P. Jackson, “Joseph Smith Translating Genesis” (56:4; `byustudies.byu.edu/article/joseph-smith-translating-genesis`); the others in Genesis's brief.
- The Joseph Smith Papers: `jsp-ot1` and `jsp-ot2` (Old Testament Revision 1 and 2). Page 1 of Revision 1 is a cover with no text; the transcript pages follow (`…/old-testament-revision-1/<n>`). `check-sources` once flagged Joseph Smith Papers transcripts as hard to read, so confirm a page prints its text before quoting it.
- Church references: the Introduction to the Pearl of Great Price (`…/scriptures/pgp/introduction`); Bible Dictionary “Joseph Smith Translation (JST)” and “Enoch”; Guide to the Scriptures “Pearl of Great Price” and “Enoch”; Church History Topics, “Joseph Smith Translation of the Bible” (`…/study/history/topics/joseph-smith-translation-of-the-bible`); the Gospel Topics essay “Race and the Priesthood” (`gte-race-priesthood`). Search `sources.yaml` for an existing key first.
- Scripture Central KnoWhys: `node scripts/knowhys.mjs moses <n>` and `node scripts/knowhys.mjs "Book of Moses"` (256 mention it). Seen: #836 “What Were the Curse and Mark of Cain?” (Jan. 27, 2026); #396 “How Do the Book of Moses and Book of Mormon Help Us Understand the Endowment?”; #837 on the Flood story.
- Conference talks: *Scripture Helps*' endnotes name many; read in full any that expounds the verse.
- `lds-scriptures` for the text and for Genesis, the Doctrine and Covenants (sections 29, 38, 45, 76, 84, 88, 107 touch these chapters) and the Book of Mormon.

**Not readable, or not to be used:** Scripture Central's “Book of Moses Insights” and “Essays” (the API serves only KnoWhys; Genesis's brief); the Gospel Topics page “organic-evolution” (the address returns the Topics index, not an entry); BYU ScholarsArchive PDFs; *Interpreter* pages flagged by `check-sources`; Hugh Nibley's and Jeffrey Bradshaw's books unless a full chapter loads. `scripts/hebrew.mjs`, Bible Hub's interlinear, the lexicon, the Septuagint, and Keil have no text of Moses.

## The text

`data/kjv/moses.json` was imported on 2026-10-06 from the Gospel Library by `scripts/fetch-gl.mjs moses pgp/moses 8` (8 chapters, 356 verses: 42, 31, 25, 32, 59, 68, 69, 30), a script written for books that are not in the King James Version. `scripts/check-kjv.mjs moses` reads the pages again and reports no difference. The file sits in `data/kjv/` because that is where the build reads every book's text. Copy any quoted phrase from it (7:18 prints “ZION” in capitals).

## Checks while the book is in preview

```sh
node scripts/check-chapter.mjs moses <n>
```

The working folder for the batch is `.cache/batch/moses/` (not committed): `proposed/NN.yaml`, `reports/NN-writer.md`, `reports/NN-check.md`, and the saved footnotes `fn1.txt` to `fn8.txt`.

## Decided while writing

*(Reviewers' decisions go here, by chapter.)*

## Reader questions no source answered

*(`scripts/batch-notes.mjs` adds to the end of this file, so this stays the last section.)*
