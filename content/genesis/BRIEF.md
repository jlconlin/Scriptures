# Genesis brief

Book-level decisions for Genesis. The site-wide standard is in `STANDARDS.md`; this file records what is particular to Genesis. Writers and checkers read both before starting a chapter. Jeremiah's brief (`content/jeremiah/BRIEF.md`) is the model, and its section “What a chapter is for” applies here unchanged.

**Status (2026-10-03): draft. No chapter is written until the author has approved this brief.** Sections marked *(to decide)* are waiting for the author.

Related files: `CHURCH-STATEMENTS.md` (what the Church's own sources say on the contested questions, quoted), `OPEN-QUESTIONS.md` (judgment calls waiting for the author), and `THEME-CANDIDATES.md` once chapters report topics.

## What the author has decided

- **Genesis is the next book** (2026-10-03). No focus questions: writers work from the questions a careful reader would ask (`STANDARDS.md` §3).
- **Don't replicate the Gospel Library** (2026-10-03; `STANDARDS.md` §1). The footnotes, the Joseph Smith Translation readings and appendix, and the chapter headings are beside the verse already. So there is no side-by-side panel of the Book of Moses or the JST, and a chapter does not list JST changes. “JST can be used if it answers the question someone might ask. Joseph Smith might have asked the question already which prompted the JST.”
- **Newest trumps oldest** (2026-10-03). Where the Church's own sources differ, a chapter follows the newest and does not repeat the older wording (“Contested and sensitive questions,” below).
- ***Scripture Helps: Old Testament* is beside the scriptures already** (2026-10-03: “really nice, but it is alongside the scriptures in the Gospel Library”). It sets the Church's current position and is cited for that. A note that only says what *Scripture Helps* says on the verse is not worth writing: the note goes further (the Hebrew, the history, other scripture, a BYU or Scripture Central article) or is left out.
- **How it is written:** an Opus writer (`chapter-writer` with the model set to Opus), then `scripts/check-ledger.mjs`, then a second Opus as reviewer (`AUTHORING.md`, “Plan for the next book”). One commit per chapter with its ledger.
- **The Student Manual limits apply from the first chapter** (`STANDARDS.md` §1): about a third of a chapter's notes at most, and a note that cites it also rests on something from beyond the Church's own publications.

## Divisions

From the Bible Dictionary's outline (“Genesis”), which says the book's structure “rests on several genealogies. Each new section begins ‘These are the generations.’” Its divisions overlap (Isaac's is 21:1–35:29, inside Abraham's and Jacob's), so the chapter ranges below are the nearest whole-chapter fit. They are in `book.yaml`.

| Chapters | Division | Bible Dictionary |
|---|---|---|
| 1–3 | The Creation and the Fall | “Adam (Gen. 1–3). The creation and early history of the world” |
| 4–11 | From Adam to Noah and the Nations | “Noah (Gen. 4–9)”; then Abraham (a) Babel, 11:1–9, and (b) the line of Shem, 11:10–32 |
| 12–25 | Abraham | Abraham (c) “Abraham is now the chief figure (12:1–25:18)” |
| 26–36 | Isaac and Jacob | “Isaac. The account of his life (21:1–35:29)”; Jacob (a) “the genealogy of Esau (Gen. 36)” |
| 37–50 | Joseph and His Brothers | Jacob (b) “the history of the patriarchs till the death of Joseph (Gen. 37–50)” |

The Guide to the Scriptures divides differently (1–4, 5–10, 11–20, 21–35, 36, 37–50). The Student Manual's chapters are 1–2, 3, 4–11, 12–17, 18–23, 24–36, 37–50.

## Book-wide conventions

- **The Book of Moses and the JST** (see the author's decision above). Genesis 1:1–6:13 is also Moses 2–8, and the creation is told again in Abraham 4–5. A note brings in Moses, Abraham, or a JST reading when it answers the reader's question about the Genesis verse (who is speaking, what is missing, why the wording is strange), and may say that the change answers that question. It does not survey the differences. Quote Moses and Abraham as scripture (`[[Moses 4:1]]`); for a JST reading that is only in a footnote or the appendix, cite `lds-scriptures` or the `jst-gen-<chapter>` entry with a ledger row.
- **Who wrote Genesis.** The Bible Dictionary (“Pentateuch”): “The Pentateuch was written by Moses, although it is evident that he used several documentary sources from which he compiled the book of Genesis, besides a divine revelation to him. It is also evident that scribes and copyists have left their traces upon the Pentateuch as we have it today.” The book's setting says this once (chapter 1). Later chapters don't argue authorship. Where an outside commentary divides a passage among sources (J, E, P), that is reported only if it answers a reader's question (a story told twice, a change in the divine name), as one scholarly view, with the Bible Dictionary's statement as the site's position.
- **Dates.** The Church's Bible Chronology gives no years before Abraham: it lists the Fall, Enoch, Noah, the Flood, and Babel under “4000” without dates, and says the Hebrew, Greek, and Samaritan texts “do not agree together, so that many dates cannot be fixed with certainty.” So chapters 1–11 give no B.C. dates. From Abraham on, a date is “about,” attributed to the Bible Dictionary (which puts Melchizedek “about 2000 B.C.”), and given only where a reader needs it.
- **Names of God.** The Bible Dictionary (“God,” “Jehovah”): the one “usually identified in the Old Testament as Lord (in small capitals), is the Son, known as Jesus Christ”; “When one speaks of God, it is generally the Father who is referred to; that is, Elohim.” The chapters follow this: the LORD who speaks to Adam, Noah, and Abraham is Jehovah, the premortal Christ. It is said once where it first matters and not in every chapter. The Hebrew names (*Elohim*, the divine name, *El Shaddai*, *El Elyon*) get a note where the name itself is the reader's question.
- **Graphic passages** (chapters 19, 34, 38, 39 and others): describe rather than quote (`STANDARDS.md` §3).
- **Repeated stories** (the wife called a sister in 12, 20, and 26; the two accounts of naming Beer-sheba and Beth-el): explained once, then linked.
- **Genealogies and lists** (chapters 5, 10, 11, 36, 46): a chapter that is mostly a list is short. Notes go to the names a reader would ask about and to what the list is for in the book; no note per name.
- **Isaiah and Jeremiah are on the site.** `[[Isa. 51:2]]` links to the chapter. Link rather than re-explain.
- **Theme candidates.** When a chapter develops a topic that runs across the book, the writer reports it; the coordinator adds it to `THEME-CANDIDATES.md`. Likely candidates before any chapter is written, to be tested against the text: the Abrahamic covenant from chapter 12 to chapter 50; the younger son chosen over the elder; Joseph as a deliverer.

## Where Restoration scripture overlaps the text

From the Gospel Library's pages, read 2026-10-03 (the footnotes on the Genesis, Moses, and Abraham chapters, and the JST appendix). It tells a writer where to look, not what to include.

| Genesis | Book of Moses | Abraham |
|---|---|---|
| 1:1–31 | 2:1–31, verse for verse | 4:1–31 |
| 2:1–25 | 3:1–25, verse for verse | 5:1–21, in a different order |
| 3:1–24 | 4:5–31 (4:1–4, on Satan's rebellion, has no Genesis parallel) | |
| 4:1–26 | 5:16–48, with gaps; 6:2–4 (5:1–15 has no Genesis parallel) | |
| 5:1–32 | 6:8–25; 8:1–12 (Enoch, 6:26–7:69, expands Gen. 5:22–24) | |
| 6:1–13 | 8:14–30 | |

- **Genesis 11–13:** the footnotes point to Abraham 1–2 throughout (the call out of Ur, Haran, the famine, Egypt).
- **JST appendix entries** (the page prints the JST text): JST Gen. 9:4–6 (at 8:20–22), 9:10–15 (at 9:4–9), 9:21–25 (at 9:16–17), 14:25–40 (Melchizedek, at 14:18–20), 15:9–12 (at 15:1–6), 17:3–12 and 17:23–24 (at 17:3–12, 17–18), 19:9–15 (at 19:8–10), 21:31–32 (at 21:32–34), 48:5–11 (at 48:5–6), 50:24–38 (Joseph's prophecy, at 50:24–26; compare 2 Ne. 3). The entry for 1:1–8:18 prints nothing and points to the Book of Moses.
- **JST footnotes:** 40 in 19 chapters; chapters 1–5 have none (their footnotes cite Moses and Abraham). The most are in 9 (six), 17 (five), and 19 (five). The footnotes are in the page's embedded data, not its visible HTML, so a plain `curl | sed` will not show them.
- The Church's chapter headings were read for all fifty chapters; the titles in `book.yaml` agree with them.

## Contested and sensitive questions *(to decide)*

One approach for each, taken from the Church's own statements, so that fifty chapters say the same thing. The statements themselves, with their URLs and verbatim quotations (148 of them, each confirmed on its page on 2026-10-03), are in `CHURCH-STATEMENTS.md`; writers quote from the pages it points to, not from it.

**Which Church source to prefer.** The Church's sources are not all of one date. *Scripture Helps: Old Testament* (2025, linked from the 2026 *Come, Follow Me* lessons) and the Gospel Topics Essays are the newest; the Student Manual is from 1980; the Bible Dictionary says of itself that it “is not intended as an official statement of Church doctrine.” Where they differ, the chapter follows the newest and does not repeat the older wording (author, 2026-10-03: “Newest trumps oldest”). Known cases: evolution (the 1980 manual prints statements against it; the Church now says it has “no official position”); Eve (the manual says she “was deceived”; Presidents Oaks and Nelson speak of her “wisdom and courage”); Cain, Ham, and Canaan (below). *Scripture Helps* is a Church manual, not a Student Manual, so the Student Manual limits don't count it; but it is in the Gospel Library beside the lesson, so a note doesn't simply repeat it (`STANDARDS.md` §1).

- **The age of the earth and the days of creation.** The Student Manual, after setting out three ways the word *day* is read: “officially the Church has not taken a stand on the age of the earth. For reasons best known to Himself, the Lord has not yet seen fit to formally reveal the details of the Creation.” (`…/old-testament-student-manual-genesis-2-samuel/genesis-1-2-the-creation`, section 2-3.) Proposed: the chapter says what the Hebrew word can mean and that the Church has no position; it does not argue for a reading. (The same section commends an author, Velikovsky, whom no one would cite now; the manual is cited for the Church's position, not for its science.)
- **Evolution.** “The Church has no official position on the theory of evolution…. Nothing has been revealed concerning evolution.” What is taught: “We are all descendants of Adam and Eve, our first parents, who were created in God's image.” (*New Era*, Oct. 2016, “What does the Church believe about evolution?”; and the First Presidency's “The Origin of Man,” 1909.) Proposed: the chapters say this once, in chapter 1 or 2, and leave science alone.
- **The mark of Cain (chapter 4) and the curse of Canaan (chapter 9).** These verses were once used to explain the priesthood restriction. The Church's essay “Race and the Priesthood”: “Today, the Church disavows the theories advanced in the past that black skin is a sign of divine disfavor or curse.” Proposed: the notes on these verses say what the text says (the mark protects Cain; the curse is on Canaan, not Ham, and says nothing of skin), state the disavowal in the Church's words, and repeat no older explanation, including any in the Student Manual.
  The newest statements: “We should avoid speculating about the nature or appearance of the mark placed on Cain or that the curse applied to anyone other than him”; “Some have incorrectly used the cursing of Canaan to justify slavery and discrimination” (*Scripture Helps*, 2025). The Student Manual as now published has no section on either verse. The Bible Dictionary and Guide to the Scriptures entries “Cain” and “Ham” keep older wording (a mark “by which he could be distinguished”; “the dark-skinned race of eastern Africa”; “not as to the priesthood”); the chapters do not quote those lines.
- **The Flood.** The Guide to the Scriptures: “the earth was completely covered with water. This was the baptism of the earth.” No First Presidency statement or conference talk on a worldwide against a local flood was found; the one explicit “worldwide… not a localized flood” is a 1998 *Ensign* article whose author is not a General Authority; the 2025 *Scripture Helps* says nothing on its extent. Proposed: the chapters say what the text says (the waters cover “all the high hills”) and what the Church's sources say (the earth's baptism; latter-day revelation confirms the account), and note that the Church has made no statement on geology. The Babylonian flood stories come in where a reader would ask about them (KnoWhy #837).
- **The long lifespans.** “The scriptures do not clearly explain the reason for these long lifespans” (*Scripture Helps*). Said once, in chapter 5.
- **The “sons of God” (6:1–4).** [[Moses 8:13–15]] answers it: Noah and his sons “were called the sons of God,” and their daughters married outside the covenant. This is a case where the JST answers the reader's question. *Nephilim* (“giants”) “can also mean ‘fallen ones’” (*Scripture Helps*).
- **Peleg (10:25).** The only Church interpretation is the 1980 manual quoting Joseph Fielding Smith (“a breaking asunder of the continents”), with [[D&C 133:24]]; newer sources are silent. Proposed: give the name's meaning (“division”) and D&C 133:24, and say that the verse does not explain itself.
- **Babel.** The Book of Mormon treats it as history ([[Ether 1:33]]). The confounding of language “may have happened over time and not in an instant” (*Scripture Helps*).
- **Plural marriage (16, 29–30).** “Monogamy… is the Lord's standing law of marriage. In biblical times, the Lord commanded some of His people to practice plural marriage” (Gospel Topics Essay); [[D&C 132:34–37]]; [[Jacob 2:27–30]]. Said once at chapter 16 and linked from 29–30.
- **Sodom (19).** The Church's sources name several sins together: pride, idleness, and neglect of the poor ([[Ezek. 16:49–50]]), sexual immorality, and rejecting the prophets (*Scripture Helps*). The chapter gives them together, as the sources do. JST Gen. 19:9–15 answers the question about Lot's daughters.
- **The offering of Isaac (22).** “A similitude of God and his Only Begotten Son” ([[Jacob 4:5]]); [[D&C 132:36]].
- **Melchizedek (14).** Most of what is known is from Restoration scripture ([[Alma 13]]; [[D&C 84:14]]; [[D&C 107:1–4]]; JST Gen. 14:25–40). Whether he was Shem is a tradition the manual calls possible, not a teaching; mention it only as that.
- **Who is of Abraham's seed.** “We can become heirs to the covenant either by birth or by adoption” (President Nelson, 2022); [[Abr. 2:10]].

## Sources for Genesis

Tested from the author's Mac on 2026-10-03. `STANDARDS.md` §9 has the general research tools. The Church's pages need a browser User-Agent with `curl`.

**Readable, and in `sources.yaml`:**

- `bd-genesis`: Bible Dictionary, “Genesis” (the outline by family line; the Book of Moses as “the best available account of the early chapters”; Moses as author).
- `gs-genesis`: Guide to the Scriptures, “Genesis.” `bd-pentateuch`: Bible Dictionary, “Pentateuch.”
- `lds-scriptures`, `oshb-wlc` (Hebrew: `…/morphhb/master/wlc/Gen.xml`), `biblehub-interlinear` (`biblehub.com/interlinear/genesis/<c>-<v>.htm`), `bdb` (`biblehub.com/hebrew/<strongs>.htm`), `lxx-rahlfs` (Brenton: `biblehub.com/sep/genesis/<c>.htm`), `nrsvue`, `niv`, `esv`, `webster-1828`, `bd-chronology`, `bd-abraham-covenant`, `jst-gen-17`, and the other Bible Dictionary entries already in the file.

**Readable; propose an entry when you use one:**

- *Old Testament Student Manual: Genesis–2 Samuel* (`…/study/manual/old-testament-student-manual-genesis-2-samuel/<slug>`): `genesis-1-2-the-creation`, `genesis-3-the-fall`, `genesis-4-11-the-patriarchs`, `genesis-12-17-abraham-father-of-the-faithful`, `genesis-18-23-abraham-a-model-of-faith-and-righteousness`, `genesis-24-36-the-covenant-line-continues-with-isaac-and-jacob`, `genesis-37-50-joseph-the-power-of-preparation`, and Enrichment Sections A (who is the God of the Old Testament), B (covenants), C (symbolism and typology), E (large numbers), F (idolatry), G (Hebrew literary styles; already `ot-manual-g`). Keys: `ot-manual-gen-1-2`, `ot-manual-gen-3`, `ot-manual-gen-4-11`, `ot-manual-gen-12-17`, `ot-manual-gen-18-23`, `ot-manual-gen-24-36`, `ot-manual-gen-37-50`.
- *The Pearl of Great Price Student Manual* (2018), by passage (`…/the-pearl-of-great-price-student-manual-2018/the-book-of-moses/moses-2-1-31` and so on). It counts as a Student Manual for the limits.
- The JST appendix has nine Genesis entries: `jst-gen/1-8`, `9`, `14`, `15`, `17`, `19`, `21`, `48`, `50`.
- Bible Dictionary entries. Confirmed to exist (2026-10-03): Adam, Eve, Fall of Adam and Eve, Eden (Garden of), Cain, Abel, Seth, Enoch, Methuselah, Lamech, Noah, Ark, Babel, Shem, Ham, Japheth, Nimrod, Abraham, Abraham (covenant of), Sarah or Sarai, Hagar, Ishmael, Keturah, Lot, Sodom, Melchizedek, Isaac, Rebekah, Jacob, Esau, Israel, Rachel, Leah, Bilhah, Laban, Dinah, Reuben, Simeon, Levi, Judah, Joseph, Benjamin, Ephraim, Manasseh, Tamar, Potiphar, Pharaoh, Egypt, Goshen, Canaan, Ur, Haran, Bethel, Beersheba, Hebron, Machpelah, Moriah, Peniel, Mizpah or Mizpeh, Shiloh, Circumcision, Birthright, Firstborn, Patriarch, Covenant, Dreams, Sacrifices, Altar, Cherubim, Sabbath, Chronology, Pentateuch, Dispensations, Joseph Smith Translation (JST). Confirmed **not** to exist: Flood. Always check the page heading (`STANDARDS.md` §4 rule 10).
- General conference talks and other Church sources on churchofjesuschrist.org: “The Origin of Man” (First Presidency, 1909; *Ensign*, Feb. 2002), the Gospel Topics entry “Creation,” the Gospel Topics Essay “Race and the Priesthood,” Donald W. Parry, “The Flood and the Tower of Babel” (*Ensign*, Jan. 1998).
- Scripture Central KnoWhys, through the API (`STANDARDS.md` §9). Those that bear on Genesis (take the date from the article):
  - #831 “Why is Knowing Genre Important for Understanding the Old Testament?” (Gen. 3:19)
  - #400 “Why Do We Have Three Different Accounts of the Creation?”; #832 “Why are Other People with God When He is Planning the Creation?”; #627 “Why Were Man and Woman Created in the Image of God?”
  - #833 “What Does it Mean that Eve is a ‘Help Meet’ for Adam?” (Gen. 2:18); #269 “Why Did Lehi Teach that the Fall was Necessary?”; #28 “What are the Origins of Lehi's Understanding of the Fall?”
  - #834 “Why Does the Lord Tell Cain That Sin ‘Lieth at the Door?’” (Gen. 4:7); #836 “What Were the Curse and Mark of Cain?”; #585 “Why Are Secret Combinations Associated with Cain and Getting Gain?”
  - #835 “Why Does Genesis Say That Enoch ‘Walked with God’ and That ‘God Took Him’?” (Gen. 5:24)
  - #837 “Why is the Story of the Great Flood in Genesis Similar in Certain Ways to Other Ancient Flood Stories?” (Gen. 7); #629 “Why Is the Story of Noah and the Ark So Repetitive?” (Gen. 8)
  - #643 “How Does the Joseph Smith Translation Teach Us about Melchizedek?” (Gen. 14); #120 “Why Did Alma Talk about Melchizedek?”
  - #838 “Why Did the Lord Tell Abraham That Neither His Servant Nor Ishmael Would Be His Heir?” (Gen. 15:4); #630 “Why Did Abraham and Sarah Receive New Names and Tokens?” (Gen. 17); #408 “How Can We Receive the Blessings of the Abrahamic Covenant?”
  - #839 “Why Might Similarities Between the Expulsion of Hagar and Abraham's Near-Sacrifice of Isaac Be Meaningful and Significant?” (Gen. 16; 21–22); #412 “How Abraham's Sacrifice of Isaac Illuminates the Atonement” (Gen. 22)
  - #840 “Why Does Rachel Want Leah's Mandrakes?” (Gen. 30:14)
  - #842 “Why Do the Details of the Joseph Story Matter?” (Gen. 37); #841 “Why is the Judah and Tamar Story in the Middle of the Joseph Story?” (Gen. 38); #416 “How Was Nephi Similar to Joseph of Egypt?”
  - #843 “Why is Judah Blessed with a Scepter Until Shiloh Comes?” (Gen. 49:10); #844 “Why Were the Hebrews Allowed to Settle in Egypt?”
  
  A KnoWhy is cited for what it says itself; an idea it passes along from another work needs that work read too (`STANDARDS.md` §4 rule 6).
- BYU's Religious Studies Center: *From Creation to Sinai: The Old Testament through the Lens of the Restoration* (`rsc.byu.edu/creation-sinai/<slug>`), each chapter confirmed to load: `beginning` (“In the Beginning”), `cain-abel-genesis-4-moses-5`, `enoch-old-testament-beyond`, `rainbow-token-genesis`, `wanderings-abraham`, `abraham-man-relationships`, `lot`, `matriarchs`, `isaac-jacob`, `ancestors-israel-environment-canaan-early-second-millennium-bc`, `covenant-among-covenants`, `clothes-cups`, `israel-egypt-canaan`. Also *Sperry Symposium Classics: The Old Testament* (`rsc.byu.edu/sperry-symposium-classics-old-testament/<slug>`): `abrahamic-test`, `melchizedek`, `jacob-presence-god`, `wife-sister-experience`. Find others with WebSearch (`site:rsc.byu.edu Genesis <topic>`), then read with `curl`.
- Keil and Delitzsch on Genesis, on Bible Hub at `biblehub.com/commentaries/kad/genesis/<c>.htm` (proposed key `keil-genesis`); the fullest commentary readable online, and a last resort as in Jeremiah (no more than about a third of a chapter's notes; “one reading” when a point is his alone). Also on Bible Hub: the Cambridge Bible for Schools and Colleges and Ellicott's commentary (`…/commentaries/cambridge/genesis/<c>.htm`, `…/ellicott/…`).
- BYU Studies (`byustudies.byu.edu/article/<slug>`), full text confirmed: Shannon, “The Genesis Creation Account in Its Ancient Context” (64:3); Jackson, “Joseph Smith Translating Genesis” (56:4); Smoot, Gee, Muhlestein, and Thompson, “Ancient Near Eastern Creation Myths” (61:4); Pike, “The Latter-day Saint Reimaging of ‘the Breath of Life’ (Genesis 2:7)” (56:2). Also Kent P. Jackson, *The Book of Moses and the Joseph Smith Translation Manuscripts* (RSC, 2005), by chapter at `rsc.byu.edu/book-moses-joseph-smith-translation-manuscripts/<slug>`.
- The Joseph Smith Papers, Old Testament Revision 1 and 2: `josephsmithpapers.org/paper-summary/old-testament-revision-<1|2>/<n>`, where `<n>` is the image number (for Revision 1, manuscript page = n − 2). The transcript is inside the page's `__NEXT_DATA__` JSON (`props.pageProps.summary.clearText`), not the visible HTML, and carries pop-up biographies that must be removed before quoting.
- archive.org full texts, each tested. The `<id>/<id>_djvu.txt` pattern is not universal; get the file name from `https://archive.org/metadata/<id>`. For rare use, as with Keil:
  - Commentaries: S. R. Driver, *The Book of Genesis* (Westminster Commentaries; `bookofgenesisnot00drivuoft`); John Skinner, *Genesis* (ICC, 1910; `criticalexegetic00skinuoft`); Franz Delitzsch, *A New Commentary on Genesis* (1889; `newcommentaryong01deli`, `newcommentaryong02deli`, the second from Genesis 15; its Hebrew is garbled).
  - Josephus, *Antiquities* (Whiston): `penelope.uchicago.edu/josephus/ant-<n>.html`, or Project Gutenberg #2848.
  - The Babylonian flood story: the British Museum's own booklet, *The Babylonian Story of the Deluge and the Epic of Gilgamish* (1920; `babylonianstoryo00brituoft`); R. W. Rogers, *Cuneiform Parallels to the Old Testament* (1912; `cuneiformparalle00rogeuoft`), which also has the fragments of Atrahasis then known. The Sumerian flood story: Oxford's ETCSL (`etcsl.orinst.ox.ac.uk/section1/tr174.htm`). The creation epic: L. W. King, *The Seven Tablets of Creation* (1902), readable only in a user upload, as is Thompson's 1928 Gilgamesh; see `OPEN-QUESTIONS.md` before citing either.
  - Jubilees and 1 Enoch: R. H. Charles, *Apocrypha and Pseudepigrapha of the Old Testament*, vol. 2 (Oxford, 1913; `apocryphapseudep02charuoft`). Targum Onkelos on Genesis: Etheridge (1862; `targumsonkelosa00ethegoog`).
  
  These are here so that a reader's question (what the Babylonian flood story says, how an ancient reader took a verse) can be answered from the text itself. They are not a reading list (`STANDARDS.md` §1, “Not a compendium”).

**Keys for new sources:** as in Jeremiah's brief (`bd-<entry>`, `gs-<entry>`, `sc-knowhy-<number>`, `jst-gen-<chapter>`, `<surname>-<one or two words>`). Check `content/sources.yaml` first.

**Not readable (don't cite):**

- BYU ScholarsArchive PDFs, Britannica, the British Museum's website (`STANDARDS.md` §9).
- Scripture Central's Book of Moses and Book of Abraham Insights (the API serves only KnoWhys); the Dead Sea Scrolls' readings (the Leon Levy library gives catalog data only); the Samaritan Pentateuch; a modern translation of Atrahasis.
- The modern commentaries on Genesis (Anchor Bible, Word Biblical Commentary, NICOT, JPS Torah Commentary, and the like) are not readable online. A view known only from memory of them is not sourced and is not in the chapter. The same holds for the authors the Student Manual quotes, unless their own book is read; cite the manual for what it prints (`STANDARDS.md` §4 rule 6).

## The text

`data/kjv/genesis.json` was imported on 2026-10-03 and compared verse by verse with the Gospel Library edition; the differences (hyphenated names such as Beer-sheba and Padan-aram, a few spellings and punctuation marks) are in `LDS_SPELLINGS` in `scripts/fetch-kjv.mjs`, and the two now agree in every verse.

## Checks while the book is in preview

The plain build leaves a preview book out, and several agents build at once, so use these forms (replace `NN` with the chapter number):

```sh
node scripts/fix-yaml.mjs content/genesis/chapters/NN.yaml
PREVIEW=1 BUILD_OUT=<your scratch directory>/dist-NN node scripts/build.mjs
node scripts/check-quotes.mjs genesis <n>
node scripts/check-content.mjs genesis <n>
node scripts/check-ledger.mjs genesis <n>
```

Other chapters are being written at the same time. A build warning or error that names another chapter's file is not yours: leave that file alone and, if the build stopped on it, run it again a minute later.
