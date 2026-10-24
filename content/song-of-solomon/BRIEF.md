# Song of Solomon brief

Book-level decisions for the Song of Solomon. The site-wide standard is in `STANDARDS.md`; this file records what is particular to the Song. Writers, checkers, and reviewers read both before starting a chapter. Ecclesiastes' brief (`content/ecclesiastes/BRIEF.md`), written the same day, is the closest model; Psalms' brief has the rule for Hebrew poetry. **The Song is the one book in the Bible that the Church's own edition marks as “not inspired writings”** (“The book's status,” below), and every chapter is written in the light of that.

**Status (2026-10-24):** drafted from the sources named below, each read in the session with the research scripts on 2026-10-24. **The author chose this book** (2026-10-24: “Let's do Song of Solomon along with this. It doesn't need a theme”) **and has not read this brief.** Where a section says “Proposed,” that is the approach the chapters follow; it is the drafter's decision, not a fact from a source, and the author can overturn it.

Related files: `OPEN-QUESTIONS.md` at the top of the repository; `UNANSWERED.md` in this folder, once there is something to put in it.

## State of the book

`node scripts/status.mjs song-of-solomon` prints what the repository shows; the history is `git log -- content/song-of-solomon`. What a script can't see:

- **In preview; no chapter written yet** (2026-10-24). It is written on the Ecclesiastes branch, beside that book, at the author's word. `book.yaml` has the four divisions below and `noPeriod` for every chapter. The Church's footnotes for every chapter are saved in `.cache/batch/song-of-solomon/fn1.txt` to `fn8.txt`; read them instead of running `footnotes.mjs` again. The pages read for this brief are cached as text in `.cache/batch/song-of-solomon/research/` (search them first; reopen the URL with `source.mjs` for a ledger row).

## What the author has decided

- **No theme pages** (2026-10-24: “It doesn't need a theme”). Its last batch runs with `themes: false`, and `batch-finish.mjs` with `--no-themes`, so no candidates are proposed. A writer or reviewer reports no theme candidates.
- **Joseph Smith's note is included** (2026-10-24: “There is a rumored quote from Joseph smith that says Song of Solomon isn't inspired. If that quote is true, we should include it”). It is true, and the Church prints it (below). Where it goes is in “The book's status.”
- The standing rules are in `STANDARDS.md` §1 and `AUTHORING.md`. *Scripture Helps* has no chapter on the Song, and *Come, Follow Me* (2026) does not assign it; the Church's helps are the footnotes, the Bible Dictionary and one paragraph of the seminary manual.

## The book's status: “not inspired writings”

The facts, from the pages read:

- The Church's footnote above 1:1: “JST Note: The JST manuscript states that ‘the Songs of Solomon are not inspired writings.’” (`fn1.txt`). The Bible Dictionary (`bd-song-of-solomon`): “The JST states that ‘the Songs of Solomon are not inspired writings.’ Both Jews and Christians have at times been reluctant to accept it into the canon of scripture because of its romantic content but have permitted it on the basis of its being an allegory of God's love for Israel and of the Church.” The seminary manual (`seminary-ot-teacher-115` [58]): “a collection of poetry and songs of love and affection,” with the same note.
- Pike (`pike-reading-song` [59]): the Joseph Smith Translation “not only provides no revisions at all to the text of the Song, but contains the comment ‘The Songs of Solomon are not Inspired writings [sic].’ This statement dates to July 1832.” His source is the printed edition of the manuscripts (Faulring, Jackson and Matthews, *Joseph Smith's New Translation of the Bible: Original Manuscripts*, 785; his note 16). It is a note on the manuscript, not a sermon. Pike and Eliason (`pike-eliason-song-scripture` [11]): “What is lacking from Joseph Smith and from his contemporaries is any indication of the reason for this pronouncement,” and “There has never been any official Church explanation.” Pike [68]: the note “has, in effect, come to represent the official Latter-day Saint position.”
- **The wording matters.** From 1979 to 2012 the Bible Dictionary said “not inspired scripture,” “an overstatement of Joseph Smith's actual notation”; the 2013 edition restored “not inspired writings,” which “does not touch on canonical status directly” (Pike and Eliason [23]). Quote the note as the Church now prints it, never as “not inspired scripture.”
- **What it means is a reading.** Pike's own: “not produced with the assistance of the Holy Spirit and that it contains no explicit religious truths” [62]. Pike and Eliason: the Song “is in the traditional collection of scripture, the biblical canon, but it is not institutionally regarded as scripture” [26]. Elder Bruce R. McConkie (1984, quoted in their note 1) called it “biblical trash”; they add that “his pronouncement is short of an official Church statement.” Joseph Fielding McConkie (`mcconkie-poetic-writings` [11]): “nor is there a single spiritual truth to be found in it”.
- **Joseph Smith still used its words.** Song 6:10, “fair as the moon, clear as the sun, and terrible as an army with banners,” is in [[D&C 5:14]], [[D&C 105:31]] and the Kirtland Temple dedication, [[D&C 109:73]], the last two after 1832 (Pike [206]–[230]; Pike and Eliason [12]). He used “the little foxes” of 2:15 in the Nauvoo Relief Society, August 1842 (Pike [239], his note 49), and Pike notes that “Nauvoo” is the Hebrew *na'vu*, found only in Isaiah 52:7 and Song 1:10 (his note 41; Pike and Eliason [13]). Elder Henry D. Taylor quoted 2:11–12 in general conference, April 1959 (Pike and Eliason [14]–[18]).

**Proposed:**

- **Said once in full, at the book's start.** The book page's intro and chapter 1's `setting` say, in the Church's words, that the Joseph Smith Translation manuscript states that “the Songs of Solomon are not inspired writings,” that Joseph Smith changed nothing in it, that no reason was recorded, and that the Church prints the Song in its Bible. The note at 1:1 adds the rest (the 2013 wording, what “not inspired” has been taken to mean, the allegorical reading the Bible Dictionary names). **The other chapters do not repeat it**: at most a clause and `[[Song 1:1]]`.
- **The Song is read as what the Church's sources say it is: love poetry** (the Bible Dictionary's “lyrical prose”; the seminary manual's “poetry and songs of love and affection”; Pike [134]–[200], “Israelite love poetry”). A note says what the poem says and what its images meant, not what they stand for in a doctrine.
- **No allegory as the meaning.** The Jewish and Christian readings of the lovers as the Lord and Israel, or Christ and the Church, are reception history: named once, at 1:1, as the Bible Dictionary names them, as the reason the Song was kept, not as what it means. No note reads a verse as Christ, the Church or the soul (the “rose of Sharon,” 2:1, is a flower here: the hymn's use is not raised).
- **Joseph Smith's and the revelations' use of its words** is given where the verse is: 6:10 (with D&C 5:14, 105:31, 109:73), 2:15, 1:10. The note at 6:10 says what the line means in the poem first, then how the revelations apply it, as the revelations' use, and that Joseph Smith's note and his use of the line sit side by side without a recorded explanation (Pike and Eliason [12], [21]). The Smith and Sjödahl idea that the line came from a lost inspired source is theirs, and Pike and Eliason say they “correctly admit this might be a notion too good to be true”: once at 6:10 if at all. **No note says the revelations make the Song inspired, or that the note makes the revelations' wording suspect.**
- **No chapter argues with the note, and none treats the Song as worthless.** The site does not repeat Elder McConkie's 1984 phrase or Joseph Fielding McConkie's judgment. Rasmussen's “does not negate or depreciate its value as romantic … poetry” (in Pike [257] and Pike and Eliason [20]) is the register.

## What a chapter is for here

The Song is 117 verses in 8 chapters of love poetry between a woman and a man, with “the daughters of Jerusalem” as a chorus (1:5; 2:7; 5:8–9; 6:1; Pike's note 5) and her brothers once (8:8–9). The reader's questions: *Why is this in the Bible, and what did Joseph Smith say about it? Who is speaking in this verse? Is this Solomon? Are they married? What do the images mean (doves' eyes, hair like goats, a garden inclosed, the little foxes, the apple tree, the mandrakes)? Why does she call him her brother and he call her his sister? What is the refrain “stir not up, nor awake my love, till he please”? What does “love is strong as death” mean? How did the Kirtland Temple prayer come to use 6:10?* (The `christ` section then applies the chapter to the reader, in statements: `STANDARDS.md` §1.)

- **Say who is speaking.** The King James has no speakers' names, and the Hebrew marks the speaker mostly by the gender of its words. Each section's `heading` and `plain` say who speaks (“She,” “He,” “The daughters of Jerusalem”), and where the speaker is uncertain the note or the paraphrase says so. A modern translation's headings may be cited as a modern translation; the Hebrew's masculine and feminine forms (`hebrew.mjs`) are evidence a note may give when a reader would ask.
- **`thread`** follows the movement of the chapter's poems (longing, meeting, separation and search, praise, union), not a plot: no source read finds a story in it (Joseph Fielding McConkie: “Its story line is unclear”), and the older dramatic readings (a shepherd lover, a king who takes the girl away) are not used as the frame. Don't invent one.
- **The images:** what they meant to an ancient hearer, from a source read (Pike's Egyptian parallels for the “sister” and the descriptions head to foot, [182]–[185]; KnoWhy #840 on mandrakes at 7:13; Delitzsch as one older reading; the footnotes' “IE” and “OR” aids). Most praise poems (4:1–7; 5:10–16; 6:4–9; 7:1–9) get one note for the run, not a note on every feature.
- **Modesty.** The poems are sensual, and the reader is an adult. **Describe, don't dwell** (`STANDARDS.md` §3, graphic passages): say plainly that a passage is about desire or the body, give the meaning of an image when a reader would ask, and don't spell out double meanings no source read gives, or add any. No note is coy either: a note does not pretend a passage is about something else.
- **Are they married?** The text calls her “my spouse” (the bride) in 4:8–12 and 5:1, and 3:11 is Solomon's wedding day; elsewhere it does not say, and Pike's note 67 says “there is no clear indication in the Song that the lovers are actually married; they certainly do not live together.” **Proposed:** say what each passage says, no more: “spouse” where the text has it, and no claim either way where it doesn't.

## Divisions

The book has no headings, and no Church source divides it. **Proposed:** four, at whole chapters, by its own markers: the refrain “I charge you, O ye daughters of Jerusalem … that ye stir not up, nor awake my love” (2:7; 3:5; 8:4) and the question “Who is this that cometh … from the wilderness” (3:6; 8:5). The names are the King James' words. Keys checked against every other book's and `site.css` (2026-10-24).

| Chapters | Division (key) |
|---|---|
| 1–2 | Thy Love Is Better Than Wine (`songwine`) |
| 3–4 | A Garden Inclosed (`songgarden`) |
| 5–6 | I Sought Him, but I Could Not Find Him (`songsought`) |
| 7–8 | Many Waters Cannot Quench Love (`songwaters`) |

## Explained once: where

**A chapter that needs one of these says it in a clause and points with a `[[reference]]`; it does not explain it again.**

| What | Explained in full at | Elsewhere |
|---|---|---|
| **The book's status; Joseph Smith's note; the allegorical readings** | chapter 1 `setting` and `[[Song 1:1]]` | a clause at most |
| “Which is Solomon's”; Solomon in the Song | `[[Song 1:1]]` (the Bible Dictionary: “Whether Solomon is actually the author is doubtful”) | 3:7–11; 8:11–12 point |
| The daughters of Jerusalem | `[[Song 1:5]]` | 2:7; 5:8 point |
| “Black, but comely”; the tents of Kedar | `[[Song 1:5]]` | nothing |
| “Nauvoo” (*na'vu*) | `[[Song 1:10]]` | nothing |
| The refrain “stir not up, nor awake my love” | `[[Song 2:7]]` (Pike and Eliason [10], with a modern translation) | 3:5; 8:4 point |
| The little foxes | `[[Song 2:15]]` (Joseph Smith in Nauvoo) | nothing |
| “My beloved is mine, and I am his” | `[[Song 2:16]]` | 6:3 points |
| “My sister, my spouse” | `[[Song 4:9]]` (Pike [182]) | 4:10, 12; 5:1–2; 8:1 point |
| The praise from head to foot | `[[Song 4:1]]` (Pike [185]) | 5:10; 6:4; 7:1 point |
| The garden inclosed, the fountain sealed | `[[Song 4:12]]` | 5:1; 6:2 point |
| **“Fair as the moon, clear as the sun”: the revelations** | `[[Song 6:10]]` | nothing |
| Mandrakes | `[[Song 7:13]]` (KnoWhy #840; `[[Gen. 30:14]]` on the site: agree) | nothing |
| **“Love is strong as death”; “many waters”** | `[[Song 8:6]]`–`[[Song 8:7]]`, and chapter 8's `christ` section | nothing |

**Three habits of wording:** a rendering that is not the King James is “a modern translation”; a point that is an older commentary's alone is “one older reading”; an `explore` bullet points to scripture, and to a study only when it is especially good (Pike's two articles, once each, in chapters 1 and 6).

## Book-wide conventions

**What in this brief is a lead and not a fact.** Words in quotation marks were copied from the page named. The rest is the drafter's direction of where to look; nothing goes into a chapter until the writer has read it and given it a ledger row (`STANDARDS.md` §4).

- **`when`.** The text dates nothing. **Proposed:** “Love poems under Solomon's name” for every chapter; no year.
- **No Context link** (`noPeriod`): no historical setting in the text, as for Proverbs and Ecclesiastes. Solomon's reign, where a chapter needs it (3:7–11), is the volume timeline's `#united-kingdom`, in a clause.
- **Names of God.** The Song does not name God (Pike [134]: “the Song is devoid of the name of God”; Joseph Fielding McConkie: “The book makes no mention of God”). The last word of 8:6, “a most vehement flame,” is one Hebrew word ending in *-yah*; whether it holds the divine name is a question for the Hebrew and the translations (`hebrew.mjs song-of-solomon 8:6`, BDB, the modern translations): say what a source read says, or nothing.
- **Hebrew only where it answers a reader's question** (`STANDARDS.md` §3): *dodim*, “love” (1:2; 4:10); *na'vu* (1:10); the gender of a speaker; *kallah*, “spouse” (4:8); the plants and spices the footnotes gloss (“camphire,” “OR henna,” 1:14; “spikenard,” 1:12). No more than about a quarter of a chapter's notes are Language notes.
- **The Joseph Smith Translation.** Nothing in the text was changed; the note at the head of the book is all, and it is explained at 1:1.
- **The `christ` section.** The Song names neither God nor Christ, and the Church does not read it as allegory, so **no `christ` section reads a verse of the Song as Christ.** Each says where the chapter's subject meets Jesus Christ from other scripture and the Church's teaching, worded as comparisons, and then applies it in one to three plain sentences:
  - **Covenant love as scripture's own image.** The prophets and the New Testament speak of the Lord as the bridegroom of His covenant people ([[Isa. 62:5]]; [[Hosea 2:19–20]]; [[Matt. 25:1–13]]; [[Eph. 5:25]]; [[Rev. 19:7]]; [[D&C 133:10, 19]]); Pike and Eliason name “the husband-wife motif utilized in several prophetic books” as one reason the Song was read as allegory [9]. Say once, in chapter 1's `christ` section, that this is scripture's image and not the Song's meaning; later chapters use it only where the chapter's own subject meets it (the bridegroom's coming, 2:8–13 beside Matt. 25; the seal and the flame, 8:6–7, beside [[Rom. 8:35–39]] and [[John 15:13]]).
  - **Marriage and intimacy as sacred.** The Church teaches that sexual intimacy is sacred within marriage (the Family Proclamation, ✓ `family-proclamation`; Elder Holland's “Of Souls, Symbols, and Sacraments,” which Pike and Eliason cite [22]: read the talk before quoting it). The refrain “stir not up, nor awake my love, till he please” (2:7) is the text's own counsel of waiting (Pike and Eliason [10], as their reading); the application in a `christ` section may set it beside the law of chastity from a Church source read.
  - Vary them. Eight chapters must not end with the same paragraph. A chapter whose poems give little to work with has a short `christ` section that says the poem itself draws no connection (Jeremiah's brief, convention 9), and it does not open by saying so (Ezekiel's habits).
- **Scripture that uses the Song's words**: [[D&C 5:14]], [[D&C 105:31]], [[D&C 109:73]] (6:10). The New Testament does not quote the Song (Joseph Fielding McConkie: “nor is it quoted in the New Testament”). Hosea 2, Isaiah 5 (the song of the vineyard) and Psalm 45 (a royal wedding song) are on the site: `occurrences.mjs song-of-solomon "<phrase>" --site all`, and agree.

**Habits to avoid** (Ezekiel's brief has the examples): say a thing once in a chapter; a note's first sentence gives the answer; a reading stays a reading in every sentence; “In plain words” adds nothing; application only in `christ`; **no advice about modern romance or marriage in the notes**; **no apology for the book in every chapter**: its status is said at 1:1 and the chapters then read the poems.

## Contested and sensitive questions

- **Why is it in the Bible?** The Bible Dictionary's answer (romantic content, kept “on the basis of its being an allegory”); Pike and Eliason: “widespread acceptance of the Song as scripture was not achieved until the early second century AD” [8], and Rabbi Akiva's “the Song of Songs is the holy of holies” [10]; Pike: four copies at Qumran (his [119], note 25). **Proposed:** the note at 1:1, briefly; reception history beyond that is not a question the reader has.
- **Is it Solomon's?** The Bible Dictionary: “Whether Solomon is actually the author is doubtful”; Pike and Eliason, “most scholars reject Solomonic authorship” [7]. 1:1's “which is Solomon's” may mean by, for or about him (check a source before saying so). **Proposed:** the note at 1:1; Solomon in 3:7–11 and 8:11–12 is read as the poem presents him.
- **The Egyptian love poems.** Pike [137]–[200]: shared traits with Papyrus Chester Beatty I and other Egyptian love songs of about 1300–1150 B.C. (“my sister,” “my brother”; the description head to foot). **Proposed:** given at 4:9 and 4:1 as Pike's comparison, to explain the image; no note says the Song copied them.
- **The dramatic readings** (Joseph Fielding McConkie's summary of a story, a maiden, a shepherd and a king, [11]): presented by him as what others have proposed; not used as the frame. If a reader would ask at 1:4 or 8:11, one sentence, as a reading.

## Settled without the author

- **No Church, BYU, Scripture Central or *Interpreter* source answers a reader's question about an image, and an older commentary does:** give its answer as “one older reading,” within a third of the notes. Expect Delitzsch to be the main source for single images; a short chapter is better than one filled from him.
- **A scholar quoted by Pike** (Fox, Exum, Longman, Kugel, Crawford) is cited as Pike's, for what he prints.
- **The Church's footnote points somewhere the note does not go:** leave it.

## Sources for the Song of Solomon

Tested 2026-10-24. ✓ marks a key already in `sources.yaml`; the rest were added on 2026-10-24 and confirmed with `check-sources.mjs --keys`.

**What was searched:** BYU Studies' bibliography (`--find "Song of Solomon"`: Seely in *Studies in Scripture* 4; Jensen, *Young Woman's Journal* 1927; McConkie); `search-lds.mjs` for six queries (`research/queries.txt`, `q*.txt`); the KnoWhys (none has a Song verse as its main reference; #840 quotes 7:13); *Interpreter*'s sitemap (nothing on the Song); a web search for the Joseph Smith Papers' copy of the manuscript page (`old-testament-revision-2`; the pages tried returned the site's not-found page, so the note is cited from the Church's footnote and from Pike). Then the footnotes, the Bible Dictionary and the seminary manual.

- `pike-reading-song` (Dana M. Pike, “Reading the Song of Solomon as a Latter-day Saint,” *Religious Educator* 15, no. 2, 2014): the note and its date [59]–[68]; why it is in the Bible [71]–[119]; love poetry and the Egyptian parallels [125]–[200]; the Doctrine and Covenants and Joseph Smith's use of its words [203]–[242], with notes 41, 49; reading it now [248]–[266].
- `pike-eliason-song-scripture` (Dana M. Pike and Eric A. Eliason, “Is the Song of Solomon Scripture?,” *BYU Studies* 60, no. 3, 2021): canonization [8]; the allegorical reading and the husband-wife motif [9]; Akiva and the refrain [10]; the note and the lack of any reason [11]; the revelations, Smith and Sjödahl [12]; Nauvoo [13]; Elder Taylor [14]–[18]; the 1979–2012 wording and the 2013 correction [23]; whether it is scripture [24]–[26]; Elder McConkie, 1984 (note 1).
- ✓ `mcconkie-poetic-writings` [11], [13], [14]: no mention of God, not quoted in the New Testament, the dramatic reading, the note. His judgment is not repeated.
- ✓ `bd-song-of-solomon`; `seminary-ot-teacher-115` [3], [57]–[58]; the footnotes (`lds-scriptures`).
- `sc-knowhy-840` (mandrakes, 7:13).
- **Not readable:** Pike, “The Song of Solomon: Fair as the Moon and Clear as the Sun,” in *From Wilderness to Monarchy* (RSC 2025): “not been released for online reading”; the RSC's *Joseph Smith's Translation of the Bible* chapter “Song of Solomon, Isaiah, Ezekiel, Daniel” (PDF only, not opened); Seely in *Studies in Scripture* 4.
- **The text and the older commentaries:** `oshb-wlc`, `biblehub-interlinear`, `bdb`, `lxx-rahlfs` (Brenton, `biblehub.com/sep/songs/<c>.htm`), `nrsvue`, `niv`, `esv`, `webster-1828`; Delitzsch (`delitzsch-song`, `biblehub.com/commentaries/kad/songs/<c>.htm`), “one older reading.” Bible Hub's folder for the book is `songs`.

## The text

`data/kjv/song-of-solomon.json` was imported on 2026-10-24 (8 chapters, 117 verses; `node scripts/fetch-kjv.mjs SongofSolomon song-of-solomon`) and compared with the Gospel Library edition by `check-kjv.mjs song-of-solomon`, which now reports no difference. Three corrections in `LDS_SPELLINGS`: “wellbeloved” (1:13), “Bath-rabbim” (7:4), “Baal-hamon” (8:11).

## Checks while the book is in preview

```sh
node scripts/check-chapter.mjs song-of-solomon <n>
```

The working folder for a batch is `.cache/batch/song-of-solomon/` (not committed).

## Reader questions no source answered

In `content/song-of-solomon/UNANSWERED.md`, by chapter, once the batch is written.
