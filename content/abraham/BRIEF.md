# Abraham brief

Book-level decisions for the Book of Abraham. The site-wide standard is in `STANDARDS.md`; this file records what is particular to Abraham. Writers, checkers, and reviewers read both before starting a chapter. Moses's brief (`content/moses/BRIEF.md`) is the model: Abraham is the second book from the Pearl of Great Price, and it stands to Genesis and Moses as Moses stands to Genesis.

**Status (2026-10-07):** drafted by the coordinator from the sources named below, each opened in the session with the research scripts. The author asked for the book on 2026-10-07 (“Can we do the book of Abraham next?”) and has not read this brief. The book is in preview (`status: preview` in `book.yaml`). Where a section says “Proposed,” that is the approach the chapters follow; it is the coordinator's decision, and the author can overturn it.

Related files: `OPEN-QUESTIONS.md` (what waits for the author; A1, the facsimiles); `content/genesis/CHURCH-STATEMENTS.md` (the Church's statements on the Creation and other contested questions, quoted with their pages).

## What the author has decided

- **Abraham is the next book** (author, 2026-10-07). It is written in the three-agent arrangement (`AUTHORING.md`, “Plan for the next book”).
- **Carried over from Moses** (author, 2026-10-06), unless the author says otherwise: the notes cover what this book has that Genesis and Moses do not, and link to them for the rest; no side-by-side comparison; no focus questions before the book is written; the text is a public-domain edition's.
- **Don't replicate the Gospel Library; newest trumps oldest; follow *Scripture Helps* to what it cites; decide what the standard decides; the Student Manual limits apply.** All as in Malachi's brief. The newest of the Church's statements are *Scripture Helps: Old Testament* (2025) and the Topics and Questions page “Origins of the Book of Abraham,” which *Scripture Helps* quotes.

## Abraham beside Genesis and Moses

| Abraham | Runs beside | On the site |
|---|---|---|
| 1 | Genesis 11:27–32 names Ur, Terah, Haran, and the famine is not in it; nothing in Genesis tells of the altar or the priest of Elkenah | Genesis 11 |
| 2:1–13 | Genesis 11:28–12:3, with the covenant given at length (2:6–11) | Genesis 11, 12 |
| 2:14–25 | Genesis 12:4–13 | Genesis 12 |
| 3 | no parallel | — |
| 4 | Genesis 1; Moses 2 | Genesis 1, Moses 2 |
| 5 | Genesis 2; Moses 3 | Genesis 2, Moses 3 |

**The rule** (Moses's, with two books to look at). Before writing a note, run `node scripts/occurrences.mjs all "<phrase>" --site` or read the parallel chapters (`content/genesis/chapters/NN.yaml`, `content/moses/chapters/NN.yaml`) to see what the site already says.

- Where Genesis or Moses already explains the verse (a Hebrew word, the ancient setting, the Church's statement on the Creation, “help meet,” the rib), **do not write it again**: link in a sentence, “see the note on [[Gen. 12:13]],” and give the note to something else or leave the verse without one. Chapters 4 and 5 will have few notes on their shared verses, and that is right.
- Where Abraham adds, changes, or reframes, **that is the chapter's subject**: Abraham's seeking the priesthood and the records of the fathers (1:1–4, 28, 31); the altar and Jehovah's deliverance (1:5–20); Egypt and Pharaoh (1:21–27); the covenant in the Lord's own words, with priesthood and “all the families of the earth” (2:6–11); the Lord telling Abraham what to say of Sarai (2:22–25); all of chapter 3; “the Gods,” who “organized and formed,” counsel together, “watched those things which they had ordered until they obeyed,” and number “times” (4); “the Lord's time, which was after the time of Kolob” (5:13).
- A note may say what an Abraham verse has that its Genesis or Moses verse lacks when that answers a reader's question. No chapter lists the differences, and there is no comparison panel.
- `parallels`, with `primary: true` as Moses has it: Abraham 2 names Genesis 12; Abraham 4 names Genesis 1 (and lists Moses 2); Abraham 5 names Genesis 2 (and lists Moses 3). Abraham 1 and 3 have no primary parallel.
- **Hebrew.** There is no Hebrew text of Abraham, and `scripts/hebrew.mjs` does not apply to it. The book prints several transliterated words (Kokob, Kokaubeam, Shinehah, Olea in 3:13; Shaumau, Shaumahyeem, Raukeeyang in the explanation of Facsimile 1; gnolaum in 3:18). A Language note on one of them is written only from a source read that discusses it; Hebrew behind the shared verses of chapters 4–5 belongs to the Genesis notes.
- **Outside commentary on Abraham does not exist**, and Keil on the parallel Genesis verse is not quoted here. “Something from beyond the Church's own publications” (`STANDARDS.md` §1) means, for this book, BYU Studies, BYU's Religious Studies Center, Scripture Central, and the Joseph Smith Papers.

## Divisions

Three, described from the Church's chapter headings (in `book.yaml`): 1–2 From Ur to Egypt (`chaldea`); 3 The Stars and the Council (`kolob`); 4–5 The Gods Plan the Creation (`gods`). The keys are not used by another book.

## Book-wide conventions

- **What the book is, said once, in chapter 1's setting.** The headnote: “A Translation of some ancient Records that have fallen into our hands from the catacombs of Egypt. The writings of Abraham while he was in Egypt, called the Book of Abraham, written by his own hand, upon papyrus.” *Scripture Helps*, “Abraham 3: What is the book of Abraham?” (the “Moses 1; Abraham 3” chapter, paragraphs 22–26) is the newest statement; the Introduction to the Pearl of Great Price and “Origins of the Book of Abraham” stand behind it. Read all three before writing chapter 1. Later chapters do not retell the history.
- **Two settings.** Each chapter has the setting inside the text (Ur of the Chaldees, Haran, the road to Egypt; a vision; the council of the Gods) and the setting of its coming forth (Kirtland, 1835; Nauvoo, 1842). `when` and `setting` give both, briefly. What the Saints were doing when a chapter was translated or printed comes in only from a source read. The first printing is on the Joseph Smith Papers site (*Times and Seasons*, 1 March–16 May 1842): Abraham 1:1–2:18 with Facsimile 1 on 1 March; 2:19–5:21 with Facsimile 2 on 15 March; Facsimile 3 on 16 May. Confirm that from the pages before stating it.
- **Who is speaking.** Abraham writes in the first person. The one who delivers him says “my name is Jehovah” (1:16; 2:8); follow Genesis's brief on the names of God, and say once, where it first matters, that Jehovah is the premortal Christ. In 3:22–28 “God,” “the Lord,” “one among them that was like unto God,” and “one like unto the Son of Man” are named; identify them only as the Church's sources do, in their words.
- **“The Gods” (4–5).** *Scripture Helps*, “Who was involved in the Creation?” (the Genesis 1–2 chapter, paragraph 14) is the Church's statement. Follow it, and the Gospel Topics essay “Becoming Like God” where it is cited, and go no further.
- **Genesis and Moses are on the site.** Link rather than re-explain. Likely: the notes on Genesis 11:28–32 and 12:1–20 (the footnotes there point to Abraham 1–2 throughout); Genesis 1–2 and Moses 2–3 on the Creation; Moses 4:1–4 on the council and Satan's rebellion (with Abraham 3:27–28); Moses 1 on worlds without number (with Abraham 3:11–12); Isaiah 14:12.
- **Reader questions already recorded elsewhere on the site.** Genesis's brief lists two that belong here: why Abraham 2:14 gives Abraham's age as 62 where Genesis 12:4 has 75 (“no source reconciles them”), and Abraham 1:21–27 beside Mizraim in Genesis 10:6.
- **No Book of Mormon comparison panel.** Use the `scripture` kind for Book of Mormon and Doctrine and Covenants passages (Alma 13 and D&C 138:53–56 on foreordination; D&C 84:14 and 107 on the priesthood of the fathers; D&C 93:29 on intelligence; D&C 132:29–37 on Abraham).
- **Theme candidates.** Report what runs across the book (the priesthood and records of the fathers; Jehovah who delivers; the covenant and the seed; one above another; the Gods in council); the coordinator adds it to `THEME-CANDIDATES.md`.

## Contested and sensitive questions

One approach for each, so that five chapters say the same thing. The coordinator read the sections named here on 2026-10-07; **the writer reads the section again before writing the note**, and quotes from the page.

- **How the book was translated, and the papyri.** “Origins of the Book of Abraham” (paragraphs 12–17): Joseph Smith “did not explain how he translated the book of Abraham”; the surviving fragments “do not match the translation given in the book of Abraham”; some believe the text was on papyri now missing, others that the papyri were “the catalyst for a revelation”; “The Church does not take a position on these theories. It simply affirms that the translation was accomplished by revelation.” The Gospel Topics essay “Translation and Historicity of the Book of Abraham” says the same at more length. Proposed: this is said once, in chapter 1's setting, in the Church's words, with both views named and neither chosen. No chapter argues for a theory, and none takes up the Egyptian alphabet documents or the length of the scrolls. “By his own hand” has its own section (paragraphs 26–27); follow it.
- **The facsimiles (1:12, 14; 3; and the three explanations).** “Origins,” paragraphs 20–22, quoted by *Scripture Helps* (the Genesis 12–17 chapter, paragraphs 9–11): most of the explanations “do not match the interpretations of modern Egyptologists”; “scholars have noted some parallels”; “We don't know how the facsimiles relate to the text.” The site has no page for the facsimiles (A1 in `OPEN-QUESTIONS.md`). Proposed, until the author decides: a chapter says what a facsimile is where the text points to it (1:12–14, “the representation at the commencement of this record”; chapter 3 for Facsimile 2's Kolob), in the Church's words, links to the facsimile in the Gospel Library, and may quote Joseph Smith's explanation of a figure where it bears on a verse (Facsimile 2, figure 1, on Kolob; Facsimile 1, figure 12, on the firmament). No note interprets a figure as Egyptologists do or argues that an explanation is right; a parallel is reported only as the Church's page or a source read in full gives it, as that author's proposal.
- **The curses of 1:21–27 (Ham, Egyptus, Pharaoh “cursed as pertaining to the Priesthood”).** *Scripture Helps*, “Abraham 1:21–27: What were the curses mentioned by Abraham?” (paragraphs 12–14): “These verses do not clearly explain what the curses were or why they were given. In the past, some have incorrectly associated the curse on Ham's posterity with the priesthood and temple restriction pertaining to people of Black African descent in our dispensation. Today, the Church disavows this and other past theories.” Proposed, as Moses's brief decided for Cain: say what the verses say and no more; give the Church's present teaching in its own words, including what it disavows; connect these verses to no people today; do not speculate on what the curse was. The essay “Race and the Priesthood” is `gte-race-priesthood`. The Moses 5 and 7 notes and the Genesis 9–10 notes say the same thing; read them first.
- **Human sacrifice and the altar (1:5–20).** Described plainly and briefly. Whether such sacrifice is attested in Abraham's world is reported only from a source read in full (BYU Studies' guide has an article on it), as that study's finding.
- **Astronomy: Kolob, “one above another,” reckonings of time (3:1–19; 5:13).** *Scripture Helps*, “Abraham 3:2–21: Why did the Lord show Abraham the order, movements, and times of stars and planets?” (paragraphs 29–30). Proposed: follow it; the chapter's own turn from stars to spirits (3:16–19) is the subject. No note maps Kolob onto modern astronomy, and proposals about ancient cosmologies are reported only from a source read in full, as proposals. “One thousand years” (3:4; 5:13) is not used to date the Creation; “How long did the Creation take?” (the Genesis 1–2 chapter, paragraph 11) is the Church's statement.
- **Intelligences, spirits, and souls (3:18–23).** *Scripture Helps*, “Abraham 3:21–23: What are ‘intelligences’?” (paragraph 31). The word is used in more than one way in Latter-day Saint teaching; say what the Church's page says and do not settle what it leaves open.
- **Foreordination, and “they who keep their first estate” (3:22–26).** *Scripture Helps*, paragraphs 32–37. Proposed: follow it. Nothing is said about anyone's standing in the premortal life as an explanation of circumstances in this one, except to report what the Church disavows.
- **“Whom shall I send?” (3:27–28).** Moses 4:1–4 on the site has the notes on Satan's rebellion; link, and give this chapter to what Abraham adds (“the first,” “the second,” “kept not his first estate”). The saying that Satan would have “forced” everyone is used only if a source read says it.
- **The Creation and evolution; creation out of nothing (4–5).** As Genesis's and Moses's briefs decided. Abraham adds “organized and formed” and “the Gods … prepared” (4:1, 11–12, 21); *Scripture Helps*, “Did God create the earth out of nothing?” (paragraphs 12–13) uses Abraham's wording, with Joseph Smith's statement in the Joseph Smith Papers.
- **Sarai as Abraham's sister (2:22–25).** *Scripture Helps* (the Genesis 12–17 chapter, paragraph 27) and `smoot-sarai`; the Genesis 12 notes already treat it. The Abraham note gives what Abraham adds (the Lord's instruction) and links.
- **The temple.** KnoWhy #820 is on the Book of Abraham and the endowment. As Moses's brief: a chapter may say, from a source read, that the book is related to temple worship; it describes nothing of the ceremonies beyond what the Church itself has published, and makes no parallel of its own.
- **Ancient parallels generally.** BYU Studies' guide and Scripture Central set the book beside ancient Egyptian and Near Eastern material (the name Elkenah, “the plain of Olishem,” crocodile gods, Abraham as an astronomer in later Jewish writings). Proposed, as for Enoch in Moses: such a parallel is reported only from a source read in full, as that author's proposal (“has been proposed”), not as established, and **no more than one such note in a chapter**. The essay's own caution applies (its conclusion, paragraph 33): “The veracity and value of the book of Abraham cannot be settled by scholarly debate concerning the book’s translation and historicity.”

## Sources for Abraham

Tested 2026-10-07 with the research scripts. `STANDARDS.md` §9 has the general tools.

**Readable, and in `sources.yaml` unless marked new:**

- *Scripture Helps: Old Testament* (2025): `scripture-helps-gen-12-17` (“Genesis 12–17; Abraham 1–2”, 57 endnotes; paragraphs 5–14 and 27 are on Abraham); `scripture-helps-moses-1` (“Moses 1; Abraham 3”, 54 endnotes; paragraphs 22–37 are on Abraham 3); `scripture-helps-gen-1-2` (Abraham 4–5; 41 endnotes). `node scripts/footnotes.mjs abraham <n>` finds the right chapter and prints its sections and endnotes with their links; the saved output is `.cache/batch/abraham/fn1.txt` to `fn5.txt`. Follow the endnotes to the talks and articles they cite.
- The Church's footnotes are in the same files.
- Topics and Questions, “Origins of the Book of Abraham” (new; `https://www.churchofjesuschrist.org/study/manual/gospel-topics/abraham-book-of?lang=eng`, 33 paragraphs, 18 notes), and the Gospel Topics essay “Translation and Historicity of the Book of Abraham” (new; `…/study/manual/gospel-topics-essays/translation-and-historicity-of-the-book-of-abraham?lang=eng`, 34 paragraphs, 46 notes). Propose them as `gt-origins-abraham` and `gte-book-of-abraham`.
- The facsimiles and their explanations in the Gospel Library: `…/study/scriptures/pgp/abr/fac-1`, `fac-2`, `fac-3` (new).
- *The Pearl of Great Price Student Manual* (2017): an introduction at `…/the-pearl-of-great-price-student-manual-2018/the-book-of-abraham`, then `abraham-1-1-3`, `abraham-1-5-31-facimile-1` (the address is spelled so), `abraham-2-1-13`, `abraham-2-14-25`, `abraham-3-1-28`, `facsimiles-2-3-abraham-4-5`. Keys in use: `pgp-manual-abr-1-1-3`, `pgp-manual-abr-1-4-31`, `pgp-manual-abr-2-1-13`, `pgp-manual-abr-2-14`, `pgp-manual-abr-4-5`; propose `pgp-manual-abr-3` for chapter 3. It counts as a Student Manual for the limits: about a third of a chapter's notes at most.
- BYU Studies Quarterly 61, no. 4 (2022), “A Guide to the Book of Abraham,” by Stephen O. Smoot, John Gee, Kerry Muhlestein, and John S. Thompson: short articles, each at `byustudies.byu.edu/article/<slug>`. Read on 2026-10-07: `did-abraham-lie-about-his-wife-sarai` (in use as `smoot-sarai`), `the-fall-of-lucifer`, `kolob-the-governing-one`, `the-divine-council`. Each article's “Further Reading” names the others; the journal's own contents page does not load, so find a slug from an article's links or by its title. This is the main source from beyond the Church's own publications.
- BYU Religious Studies Center: John Gee, “The Wanderings of Abraham” (`gee-wanderings`, 62,477 characters); Avram R. Shannon, “Abraham: A Man of Relationships” (`shannon-abraham`); Shon D. Hopkin on the Abrahamic covenant (`hopkin-covenant`); Monte S. Nyman, “The Covenant of Abraham” (`nyman-covenant-abraham`); Fred E. Woods, “The Ascension of Abraham” (`woods-ascension`); John Gee, *An Introduction to the Book of Abraham* (`rsc.byu.edu/book/introduction-book-abraham` lists its chapters; not tested whether the chapters themselves load). Search `sources.yaml` for “Abraham” before proposing.
- The Joseph Smith Papers: “Book of Abraham and Facsimiles, 1 March–16 May 1842” (`…/paper-summary/book-of-abraham-and-facsimiles-1-march-16-may-1842/<n>`; page 1 printed its text), and the manuscripts. Confirm a page prints its text before quoting it.
- Church references: the Introduction to the Pearl of Great Price; Bible Dictionary “Abraham” (`bd-abraham`), “Abraham, covenant of” (`bd-abraham-covenant`), “Ur,” “Haran,” “Melchizedek,” “Urim and Thummim”; Guide to the Scriptures “Abraham,” “Pearl of Great Price,” “Foreordination,” “Council in Heaven,” “Intelligence, Intelligences” (check each page's heading, `STANDARDS.md` §4 rule 10); *Saints*, volume 1, which *Scripture Helps* cites for the papyri.
- Scripture Central KnoWhys: `node scripts/knowhys.mjs abraham <n>` and `node scripts/knowhys.mjs "Book of Abraham"` (119 mention it). Seen: #832 “Why are Other People with God When He is Planning the Creation?” (Abr. 3:23–24); #820 on the Book of Abraham and the endowment; #408 on the Abrahamic covenant.
- Conference talks: *Scripture Helps*' endnotes name many; read in full any that expounds the verse.
- `lds-scriptures` for the text and for Genesis, Moses, the Doctrine and Covenants, and the Book of Mormon.

**Not readable, or not to be used:** Scripture Central's “Book of Abraham Insights” (the API serves only KnoWhys; Genesis's brief); BYU ScholarsArchive PDFs; *Interpreter* pages flagged by `check-sources`; Hugh Nibley's books unless a full chapter loads; anything that reproduces or argues from the Egyptian alphabet documents. `scripts/hebrew.mjs`, Bible Hub's interlinear, the lexicon, the Septuagint, and Keil have no text of Abraham.

## The text

`data/kjv/abraham.json` was imported on 2026-10-07 from the Gospel Library by `scripts/fetch-gl.mjs abraham pgp/abr 5` (5 chapters, 136 verses: 31, 25, 28, 31, 21). `scripts/check-kjv.mjs abraham` reads the pages again and reports no difference. The three facsimiles and their explanations are not in the file.

**It is the 1921 edition's wording** (the author's rule of 2026-10-06, applied without asking again). Compared the same day with the 1929 printing of the 1921 edition (`pearlofgreatpric0000jose_d8d6`), and with scans of the 1902 edition where the 1929 scan was unclear: `scripts/find-verses.mjs` finds 130 of the 136 verses word for word in the scans; the other six, and the five that `compare-edition.mjs` could not place, were read by eye. The 1921 edition differs from today's in six verses, nine readings, all in `data/kjv/abraham.edition.json`:

| Verse | Today | 1921 (the site's text) |
|---|---|---|
| 1:1 | at the residence of my fathers | at the residence of my father |
| 1:3 | before the foundation of the earth, down to the present time | before the foundations of the earth to the present time |
| 1:3 | or the first man, who is Adam, or first father | on the first man, who is Adam, our first father |
| 1:7 | unto these dumb idols | unto their dumb idols |
| 1:14 | which manner of figures | which manner of the figures |
| 2:2 | Nahor … who was the daughter of Haran | Nehor … who were the daughters of Haran |
| 3:21 | to declare unto thee the works | to deliver unto thee the works |

Punctuation, capitals, and hyphens were not compared (1:16 is “kins-folk” in 1929). **Copy any quotation from `data/kjv/abraham.json`, not from the Gospel Library, in these verses.** Where a note is on one of these phrases and the difference bears on its meaning (1:3 most of all, where “on the first man” and “our first father” read differently from today's text), the note says how the current edition reads, citing `pgp-1921`; a reading is not otherwise remarked on. Genesis 11's notes name “Nahor”; the spelling “Nehor” in 2:2 is the 1921 edition's and needs no note.

## Checks while the book is in preview

```sh
node scripts/check-chapter.mjs abraham <n>
```

The working folder for the batch is `.cache/batch/abraham/` (not committed): `proposed/NN.yaml`, `reports/NN-writer.md`, `reports/NN-check.md`, and the saved footnotes `fn1.txt` to `fn5.txt`.

## Decided while writing

*(`scripts/batch-decided.cjs` writes the reviewers' decisions here, by chapter.)*

## Reader questions no source answered

*(`scripts/batch-notes.mjs` adds to the end of this file, so this stays the last section.)*
