# Articles of Faith brief

Book-level decisions for the Articles of Faith. The site-wide standard is in `STANDARDS.md`; this file records what is particular to this book. Writers, checkers, and reviewers read both before starting the chapter. Obadiah's brief is the model for a one-chapter book; Abraham's for a book of the Pearl of Great Price.

**Status (2026-11-17):** drafted by the coordinator from a research survey made in the session with the research scripts (`.cache/pgp/research-aof.md`, not committed); each source named below was opened then. **The author chose this book** (2026-11-17: “Lets do the remaining books in the Pearl of Great Price”) **and has not read this brief.** Where a section says “Proposed,” that is the coordinator's decision, and the author can overturn it.

Related files: `OPEN-QUESTIONS.md` (what waits for the author, for every book).

## State of the book

`node scripts/status.mjs articles-of-faith` prints what the repository shows. What a script can't see:

- **The book is in preview** (`status: preview` in `book.yaml`), written on the branch `worktree-pearl-of-great-price` with Joseph Smith—Matthew and Joseph Smith—History.
- **The chapter is not yet written.**

## What the author has decided

- **This book's notes answer a different kind of question** (author, 2026-11-17, on the coordinator's proposal: “The Articles of Faith probably also need a different approach. Less ‘what does this mean’ because they are statements of belief. But it could still have the questions.”; approved: “Yes. Proceed.”). See “What a chapter is for here.” No new note kinds, labels or sections: the existing kinds carry it.
- **The text is the 1921 edition's** (the standing rule for a book outside the King James Version, 2026-10-06). See “The text.”
- **The Church's teaching manuals are finders, never cited** (`STANDARDS.md` §1). Here that includes *Teachings of Presidents of the Church: Joseph Smith* and the Pearl of Great Price Student Manual: follow them to what they cite.

## What a chapter is for here

A reader does not stop at “We believe in God, the Eternal Father” and ask what the words mean. The questions a careful reader brings to a statement of belief are these, and a note answers one of them:

1. **Where does this come from?** Each article sums up teaching found elsewhere in scripture. A note names the passages that teach it most directly (the Bible, the Book of Mormon, the Doctrine and Covenants, the Pearl of Great Price), says in a sentence what each adds, and quotes the key words. It is not a list of cross-references: the Gospel Library's footnotes already give those beside the verse (66 of them), and a note that only repeats them is not worth keeping. Choose the two or three passages a reader would most want, and say why.
2. **What was it answering, and why is it worded so?** The Articles were written in 1842 for a reader outside the Church. Some lines are clearest beside what other churches then taught: “for their own sins, and not for Adam's transgression” beside original sin; “the same organization that existed in the Primitive Church” beside the churches of the day; “as far as it is translated correctly” beside the Bible alone; no creed. The earlier lists the Articles grew out of (Oliver Cowdery 1834, Joseph Young 1836, Orson Pratt 1840, Orson Hyde 1842) show what Joseph Smith kept and what he changed.
3. **What does a phrase mean now?** A few words need explaining (“evangelists,” “pastors,” “paradisiacal glory,” “the restoration of the Ten Tribes,” “this [the American] continent”), and some lines raise a practical question (Article 12 for Saints under governments other than the American one; Article 11's “how, where, or what they may”).
4. **What have prophets taught about it since?** Where a prophet or apostle has expounded an article, a Latter-day Prophets note gives the teaching, from the talk or book itself, read in full.

**Which kinds of note.** Related Scriptures (kind 1), Context (kind 2, and the history of the wording), Language (a word in 1842 English), Latter-day Prophets (kind 4), Witness of Christ where the article is about Him. No Imagery, Literary Structure or BoM Comparison notes are expected.

**Balance.** Thirteen verses, so the chapter is short in verses and should not be long in notes: about two or three notes an article, more where the questions are real (Articles 2, 6, 8, 10), fewer where an article is plain (Articles 3, 7). The `plain` paraphrase of each section says what the article affirms, in plain words, without arguing it.

**What it is not.** Not an essay on each doctrine: the Gospel Library's Topics and Questions do that, and a doctrine large enough for an essay is a theme page, chosen by the author. Not proof-texting against other churches: say what another church taught only where it explains Joseph Smith's wording, in a source's words, without disparagement (`STANDARDS.md` §3). Not a record of every commentary on the Articles.

## Divisions

`book.yaml` has one division, `webelieve`, range [1, 1]. **Proposed `sections`: one per article** (thirteen sections of one verse each), each headed with a plain phrase (“The Godhead,” “Our own sins,” “Saved through the Atonement,” “The first principles and ordinances,” “Called of God,” “The same organization,” “The gifts of the Spirit,” “The word of God,” “Revelation, past, present and to come,” “Gathering, Zion and the earth renewed,” “Freedom of worship,” “Subject to the law,” “We seek after these things”). The writer may word them better.

## Book-wide conventions

**What in this brief is a lead and not a fact.** Words in quotation marks below were copied from the page named. The rest is the coordinator's direction of where to look. None of it goes into the chapter until the writer has read it on a page and given it a ledger row (`STANDARDS.md` §4).

- **The setting: the Wentworth letter.** The Articles closed Joseph Smith's “Church History” in the *Times and Seasons*, 1 March 1842, written at the request of John Wentworth, editor of the *Chicago Democrat* (KnoWhy #828, paragraph 3). The Joseph Smith Papers print the letter with endnotes (`…/paper-summary/church-history-1-march-1842/4` and `/5`); the Introduction to the Pearl of Great Price says the same in a sentence. `when`: “1 March 1842, Nauvoo, Illinois.” The `setting` gives the occasion, who asked and why, that the letter told the history of the Church before its thirteen points of belief, and that they were later canonized (October 1880, Gardner paragraph 18). Wentworth's own purpose (a history being written by George Barstow) comes in only if a page read says it.
- **How the list grew.** KnoWhy #828 and Welch and Whittaker's Ensign article (September 1979) set out the earlier lists. One Context note, at Article 1 or in the `setting`, says that such lists existed and that the Prophet's was shorter and plainer; individual notes say where a line has a forerunner only when the comparison explains the wording (Pratt's 1840 “by the transgression of their first parents” beside Article 2 is the clearest case).
- **Was it a reply to the religious controversies?** Two readings are in print. Welch and Whittaker (Ensign 1979, paragraph 56): “This is doubtful, however, because Joseph Smith's Articles lack the argumentative language commonly found in the earlier articles of faith.” RoseAnn Benson (RSC, *Joseph Smith and the Doctrinal Restoration*, paragraph 9) reads the first ten against “the nature of the Trinity, original sin, total depravity” and other doctrines of the day. **Proposed:** both are true to what each says, and they are compatible: the Articles are not argumentative, and several of them state a belief that differed from what most churches taught. A note gives the contrast where it explains the words, as Benson's reading, and does not call the Articles a polemic.
- **Not a creed.** The Ensign (paragraph 64), Sondrup (RSC, paragraphs 12–14, quoting Talmage) and KnoWhy #773 (paragraph 13) say the Articles are not a closed creed; Article 9 says so of itself. One note, at Article 9 or 13, from one of these.
- **Talmage.** James E. Talmage's *A Study of the Articles of Faith* (1899) was written at the First Presidency's request and is public domain. **The writer looks for it on archive.org** (`source.mjs` reads `…/download/<id>/<id>_djvu.txt`); if a full text loads, it is the main source for kinds 3 and 4, as an apostle's teaching (he was ordained an apostle in 1911; confirm from a page before saying so). Quote him sparingly and in his words. Bruce R. McConkie's *A New Witness for the Articles of Faith* (1985) is copyrighted and not readable online; leave it out.
- **The Witness of Christ.** Articles 1, 3 and 4 are about Him directly (the Son in the Godhead; “through the Atonement of Christ”; “Faith in the Lord Jesus Christ”), and Article 10 names His personal reign. The `christ` section rests on those articles' own words.
- **The site's other books.** Moses 6:52–68 (baptism and the Holy Ghost taught to Adam), Moses 5:9–11 and Genesis 3 (the Fall), Isaiah, Jeremiah and Ezekiel on the gathering, Moses 7 on Zion, Joel 2:28 on the gifts, Amos 3:7 on revelation are on the site: link to the note there rather than explain again (`node scripts/occurrences.mjs all "<phrase>" --site`).
- **No Hebrew, no Keil.** There is no original-language text, and no outside commentary is wanted beyond the Latter-day Saint studies named under “Sources.”

## Contested and sensitive questions

One approach for each. The writer reads the source again before writing the note and quotes from the page.

- **Article 2 and the Fall.** The article denies inherited guilt, not the Fall. Say both: we are not punished for Adam's transgression, and the Fall's effects are real (Moses 5:9–11; 6:53–55). Benson, paragraphs 16–18; Topics and Questions, “Fall of Adam and Eve.” Original sin is described in a sentence, from Benson, as what many Christians believed; no theologian is quoted.
- **Article 6, “the same organization.”** Grant Underwood (RSC) warns that “much has been claimed, perhaps too much, in the name of this article of faith.” **Proposed:** the note says what the article names (the offices of Ephesians 4:11, the passage the Joseph Smith Papers' endnote gives), what “evangelists” and “pastors” mean in Latter-day Saint usage (KnoWhy #692: Joseph Smith taught in 1839 that an evangelist “is a patriarch”; the Church's footnote reads “pastors” by way of the Topical Guide's “Bishop”), and says, with Underwood, that the claim is the same kind of organization with the same authority, not a one-to-one list of modern offices. Read Underwood beyond paragraph 5 before writing.
- **Article 8, “as far as it is translated correctly.”** Benson reads it “probably” of transmission more than translation (her reading, attributed); the Joseph Smith Papers' endnote ties it to the “New Translation” of 1830–33 and to 1 Nephi 13. **Proposed:** the note gives the Book of Mormon's account of what was lost (1 Ne. 13:26–29), the Joseph Smith Translation as the Prophet's own work on the Bible, and the Church's present use of the King James Version, in the Church's words (the Bible Dictionary or the Introduction to the Pearl of Great Price), and says nothing against any modern translation.
- **Article 10, the American continent and Zion.** The site prints the 1921 wording, “this [the American] continent”; today's reads “Zion (the New Jerusalem) will be built upon the American continent”; the 1842 letter has “this continent.” **Proposed:** one Context note on the phrase says the three forms, each from its page (the Joseph Smith Papers for 1842; the site's text for 1921; the Gospel Library for today), and says no more about when or why the change was made than a page read says. Where Zion and the New Jerusalem will be built is said in the Church's words (D&C 57:1–3 and the Church's footnotes); the gathering of Israel today is taught by President Nelson (“The Gathering of Scattered Israel,” October 2006) as gathering to the Church in every land, which a Latter-day Prophets note may give. “Paradisiacal”: the Church's footnote glosses it as “a condition like the Garden of Eden”; Robert J. Matthews (RSC) adds the Prophet's teaching that the earth will be renewed. The Ten Tribes: what the scriptures say (D&C 110:11; 133:26–34) and nothing about where they are.
- **Article 11, freedom of worship.** Cowdery's 1834 list, the 1835 declaration (D&C 134:4, 7), Atkin (RSC, quoting President Nelson). The note says the Saints claimed it for others as for themselves; it does not comment on any modern controversy.
- **Article 12, kings and presidents.** The 1835 declaration on government (D&C 134), which the Joseph Smith Papers' endnote gives. For Saints under other governments: Wood (RSC, paragraphs 24–25), as his. Persecution in Missouri comes in only if a page read ties it to the article. Gardner's note that the Articles were sustained by themselves in October 1890, just before the Manifesto, is history worth a clause; the Manifesto itself is linked (Official Declaration 1), not explained.
- **The wording since 1842.** Welch and Whittaker (Ensign 1979, paragraph 51): “Except for certain minor changes, particularly in the fourth, fifth, sixth, and tenth articles, we still use these statements today as they originally appeared on 1 March 1842.” What can be read: the 1842 text (Joseph Smith Papers), the 1921 text (the site's), today's (Gospel Library). **Who made each change, and in which edition, is not established by any page read.** A note says what differs, from the pages, and dates nothing it has not read. The differences worth a note: Article 4 (1842 “these ordinances are 1st, Faith …”; later “the first principles and ordinances of the Gospel are”); Article 10. Spellings and punctuation (“viz.” and “etc.”; 1842's “prophesy”) are not worth a note unless a reader would stop (Article 6's “viz.” is glossed in a clause).

## Sources for the Articles of Faith

Searched 2026-11-17 for this brief: the Religious Studies Center, BYU Studies, Scripture Central (KnoWhys; the archive did not load), the *Interpreter* journal (no title names the Articles or the Wentworth letter), the Joseph Smith Papers, the Gospel Library. No key for this book was in `sources.yaml`; the keys below are proposed.

**Readable:**

- The Joseph Smith Papers, “Church History,” 1 March 1842, pages 4–5 (`https://www.josephsmithpapers.org/paper-summary/church-history-1-march-1842/4`, `/5`; `--notes` gives endnotes 29–35, which point to 1 Tim. 4:14, Eph. 4:11, the New Translation, D&C 134, 1 Cor. 13:7, Phil. 4:8). Propose `jsp-church-history-1842`.
- The Gospel Library page (`…/scriptures/pgp/a-of-f/1`), with 66 footnotes, and the Introduction to the Pearl of Great Price (search `sources.yaml` for an existing key first). `node scripts/footnotes.mjs articles-of-faith 1`; the saved output is `.cache/pgp/fn-aof.txt`.
- Topics and Questions, “Articles of Faith” (`…/manual/gospel-topics/articles-of-faith`), three sentences.
- John W. Welch and David J. Whittaker, “‘We Believe…’: Development of the Articles of Faith,” *Ensign*, September 1979 (`…/study/ensign/1979/09/we-believe-development-of-the-articles-of-faith`): the earlier lists, the 1880 vote, the wording, the Pauline echoes (paragraph 58), the expanded lists of the 1850s.
- Scripture Central KnoWhys: #828 “Why are the Origins of the Articles of Faith Important?” (the earlier lists, quoted); #692 “What Is an Evangelist?”; #693 “How Often Do the Articles of Faith Track Sayings of Paul?” (a table, for kind 1); #773 “Why Did Christ Call the Creeds an Abomination?” Cite as `sc-knowhy-<n>`.
- The Religious Studies Center (`rsc.byu.edu`; read with `--find`): RoseAnn Benson, “The Articles of Faith” (`joseph-smith-doctrinal-restoration/articles-faith`); Ryan S. Gardner, “The Articles of Faith” (`foundations-restoration/articles-faith`; the canonization history, paragraphs 17–20); Steven P. Sondrup, “On Confessing Belief” (`literature-belief/confessing-belief-thoughts-language-articles-faith`; it prints the 1921 wording); Truman G. Madsen, “Articles of Faith” (`latter-day-saint-essentials/articles-faith`, the *Encyclopedia of Mormonism* entry); Grant Underwood, “The ‘Same’ Organization That Existed in the Primitive Church” (`go-ye-all-world/same-organization-existed-primitive-church`); Robert S. Wood, “International Diplomacy and the Church” (`lengthening-our-stride/international-diplomacy-church`); William Atkin, “‘Let Them Worship How, Where, or What They May’” (`lengthening-our-stride/let-them-worship-how-where-what-they-may`); Robert J. Matthews, “The Restoration of All Things” (`sperry-symposium-classics-doctrine-covenants/restoration-all-things-0`, paragraph 108); Noel B. Reynolds, “The Fifth Principle of the Gospel” (`vol-15-no-3-2014/fifth-principle-gospel`, on Article 4).
- General conference talks that load and may bear on an article (none was found to name an article; read before using): Nelson, “The Gathering of Scattered Israel” (October 2006); Nelson, “Revelation for the Church, Revelation for Our Lives” (April 2018); Holland, “‘My Words … Never Cease’” (April 2008); Oaks, “Priesthood Authority in the Family and the Church” (October 2005).

**Not readable, or not to be used:** BYU Studies' “The Articles of Faith” and “The Wentworth Letter” (abstract only); Church History Topics (no entries at those addresses); the Joseph Smith Papers' topic pages; Scripture Central's archive; the Gospel Library's search (a challenge page), so a talk on an article is found through the sources above, not by searching; Whittaker's 1987 chapter (not online); McConkie (copyrighted).

## The text

`data/kjv/articles-of-faith.json` (1 chapter, 13 verses) was imported on 2026-11-17 by `scripts/fetch-gl.mjs articles-of-faith pgp/a-of-f 1 "Articles of Faith"`, and `scripts/check-kjv.mjs articles-of-faith` reports no difference from the Gospel Library apart from the readings below. The signature “Joseph Smith.” is not a verse: it is in `data/kjv/articles-of-faith.extra.json` and printed after Article 13.

**Compared with the 1921 edition** (`.cache/pgp/aof-1921.txt`, cut from the 1929 printing `pearlofgreatpric0000jose_d8d6`; `scripts/compare-edition.mjs`). The 1921 wording differs from today's in three articles, and the site prints the 1921 wording (`data/kjv/articles-of-faith.edition.json`):

- 6: “Primitive Church, viz., apostles, … evangelists, etc.” (today “namely, … and so forth.”)
- 7: “interpretation of tongues, etc.” (today “and so forth.”)
- 10: “that Zion will be built upon this [the American] continent” (today “that Zion (the New Jerusalem) will be built upon the American continent”).

Copy every quoted phrase from `data/kjv/articles-of-faith.json`. The 1842 wording is on the Joseph Smith Papers pages; see “The wording since 1842” above.

## Checks while the book is in preview

```sh
node scripts/check-chapter.mjs articles-of-faith 1
```

The working folder is `.cache/batch/articles-of-faith/` (not committed): `proposed/01.yaml`, `reports/01-writer.md`, `reports/01-check.md`.

## Reader questions no source answered

In `content/articles-of-faith/UNANSWERED.md`, once the chapter is written.
