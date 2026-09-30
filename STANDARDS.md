# Writing and sourcing standard

The standard for all commentary on this site, for every book. `AUTHORING.md` holds the status and how to work with the author; each book's `content/<book>/BRIEF.md` holds the decisions for that book, and its `OPEN-QUESTIONS.md` the judgment calls waiting for the author. Where they disagree, this file wins unless the author has decided otherwise in the brief.

The goal: **content that needs no audit afterward.** Sourcing is part of writing, not a later pass.

## 1. What the site is

- **A focused companion to the scriptures.** It gives one clear reading of each chapter. It is not a database and does not try to gather everything written about a chapter or cite every source. When another resource is especially good on a chapter, point to it once (usually in `explore`) rather than absorbing it.
- **Deeper than *Come, Follow Me*, and not a companion to it.** Don't repeat the manual or follow its outline.
- **No personal application or “liken it” content** (decided 2026-09-30). That belongs in *Come, Follow Me*. Chapters close by pointing to Christ (`christ`) and to what's worth exploring next (`explore`).
- Stay grounded in the scriptures and the teachings of latter-day prophets. When an interpretation is speculative, or faithful readers disagree, say so.

## 2. Audience

- **The primary reader is the author**, who reads mostly on an iPad mini. Favor what helps the author's study (their questions, readability, depth) over things that matter only for a public site.
- **Semi-academic.** Write for an academically trained reader (for example, a PhD in a technical field) who is curious, comfortable with competing hypotheses, and expects claims to be documented, but who is not a specialist in biblical studies, Hebrew, or ancient Near Eastern history.
  - **Don't oversimplify.** Engage real questions directly: textual variants (Masoretic Text, Septuagint, Dead Sea Scrolls, Book of Mormon readings), dating and authorship, Near Eastern parallels and archaeology, translation choices, literary structure. State the positions fairly, including non–Latter-day Saint scholarship, say what is at stake, then give the Latter-day Saint reading and its basis.
  - **Explain the specialist tools.** Define a technical term the first time it appears (*qere/ketiv*, *Masoretic*, chiasmus, *prophetic perfect*). Transliterate Hebrew; explain morphology only when it changes the meaning.

## 3. Voice

- A **warm, knowledgeable teacher**. Conversational, a light touch of humor where it fits, willing to reframe a shallow reading.
- **Find each chapter's thread**: the argument that ties it together, not a list of topics. Notice structure and wordplay. Explain the history behind the text and *why* people thought as they did.
- **Hebrew (or Greek) only when it pays off.**
- Connect to Restoration scripture where the connection is real.
- **Read, ask, then seek.** Read the chapter first and write down the questions a careful reader would ask; those questions decide which phrases get highlighted and what gets researched. Every note answers one of them. Don't go looking for material, and don't carry over what a source happens to cover. The questions are a working tool, not a record: they go in the writer's report, not in a file.
- **Open each note with a sentence that says what the note is about.** The site shows that first sentence as the note's preview card, so a hook (“This is the hardest line in the chapter”) doesn't work.
- **Keep attention on the message, not the scholar.** Don't name modern scholars in running text (“Oswalt argues…”); the note's `sources` carries the attribution. Ancient documents and ancient writers can be named when they are the evidence (“Sennacherib's annals claim…”, “Jerome connects…”).
- **Say how certain each claim is**: established fact, scholarly consensus, a plausible hypothesis, or a devotional reading.
- For graphic passages, describe rather than quote.
- **Selectivity.** About 3,500 words and 8–11 notes a chapter (Isaiah 50 is the model length). Depth over breadth: a few well-developed notes that make real connections beat many shallow ones. Where several sources make the same point, use the best one; where two notes overlap, merge or cut. Finding something is not a reason to include it.
- **`setting` is short**, about 150–250 words: when, to whom, where the chapter sits in the book, how other scripture uses it. Debates about a verse go in that verse's note. A topic that spans many chapters is explained once on a theme page and linked.

## 4. Sourcing rules

**Everything is referenced; nothing is made up.**

1. **Every factual claim** (a word meaning, a textual variant, a date, a historical detail, a scholarly view, what a prophet taught) **comes from a source you opened and read in the working session, and is cited.** Your own memory is never a source, and neither is an entry under “Open questions.” If you can't find and read a source for a claim, cut the claim.
2. **Cite a work only for what you checked it says.** Never list a work because it is the kind of thing that work would say.
3. **Cite the work, not the website that hosts it.** Bible Hub, Scripture Central, BibleGateway, churchofjesuschrist.org and archive.org are where you read something; the source is the work: Delitzsch's commentary, BDB, the Westminster Leningrad Codex, the Septuagint, a specific KnoWhy or talk. The `sources.yaml` entry names the work (and may say where it was read); the ledger `url` is the page you actually read. Don't create keys for a website as such.
4. **The primary texts are evidence, not commentary.** The Hebrew text, the Septuagint, the Dead Sea Scrolls, the Book of Mormon's readings and the rest of scripture answer many questions directly; prefer them to a commentary that reports them. A note whose claims rest only on scripture cites `lds-scriptures` (the Church's editions of the scriptures, including their chapter and section headings), with a ledger row pointing at the chapter read.
5. **Cite the underlying work behind a secondary source.** If a KnoWhy, dictionary, or commentary passes along an idea from another work, read that work and cite it too. If you can't read it, cite only the secondary source for what the secondary source itself says, or leave the claim out.
6. **Wikipedia and other wikis are never sources** (author, 2026-09-30: “I don't want this to become a mini-wikipedia”). Use the primary text or a scholarly or institutional source: the text itself, a lexicon, an encyclopedia, a museum's own catalog page. If only a wiki supports a claim, cut it. This includes wiki transcriptions of public-domain books (Wikisource and the like): read the work from a scan or an institutional copy (archive.org, a library, the publisher) and cite that URL. `check-content.mjs` rejects wiki URLs in `sources.yaml` and in ledgers.
7. **No unofficial copies of copyrighted works.** Don't read from, link to, or cite pirated PDFs or unauthorized uploads. Cite the official DOI or publisher URL.
8. **Commentaries that can't be read online are not cited unless genuinely read.** Known unreadable here: Oswalt (NICOT), Blenkinsopp (Anchor Bible), Childs, Shalom Paul, Westermann, *HALOT*, Parry's *Understanding Isaiah*, Williamson's *The Book Called Isaiah*, Tov's *Textual Criticism*, Matthews' *A Plainer Translation*. Each book's `BRIEF.md` lists what is and isn't readable for that book; add to both lists when you find another, and to `NOT_READABLE` in `scripts/check-content.mjs`. The checker lets a strict chapter cite one of these only with a quoted ledger row, so the quote must come from a copy you actually read.
9. **Confirm every URL before it goes into `content/sources.yaml`**: it must load a page with the right title. Bible Dictionary and Guide to the Scriptures URLs return 200 even for entries that don't exist, so check the page heading. Put page or chapter numbers in the entry's `pub` field; note `sources` take keys only.
10. **No single secondary source shapes a chapter.** Start from the text and the scriptures that quote it. As a rule of thumb, no one outside source is the main idea of more than one note. When an idea comes from a source, cite it, put it in your own words, and don't follow its outline.
11. **List in `sources` only what the chapter relies on.** A chapter-level `sources` list is the union of what its notes and prose actually cite, not a reading list.
12. **Quotations are checked**: scripture quotations with `check-quotes.mjs`; Book of Mormon variants against the text (`data/bom/`); quotations from talks and books against the page you read.
13. **Judgment calls go to the book's `content/<book>/OPEN-QUESTIONS.md`**; never decide them silently.

## 5. The evidence ledger

Required for every chapter written or audited from now on. It is the record of what was read for each claim, and `scripts/check-content.mjs` validates it.

```yaml
# content/<book>/evidence/NN.yaml  (NN = two-digit chapter number)
chapter: 5
claims:
  - where: 'note 5:3 “Title of the note”'   # or: setting | thread | when | section 2 plain | christ | explore | parallels
    claim: 'Short statement of the factual claim'
    key: bdb                                  # key in content/sources.yaml
    url: 'https://…'                          # the exact page actually read
    quote: 'Verbatim supporting text, at most about 40 words'
```

- `where` names the part of the chapter file: `note <chapter>:<verse> “<note title>”`, `setting`, `thread`, `when`, `section <n> plain` (sections numbered from 1), `christ`, `explore`, or `parallels`.
- One source per row. A claim supported by two sources gets two rows.
- `url` is the exact page you read (the lexicon entry, the interlinear verse, the article), not a site's home page.
- `quote` is copied from that page, not paraphrased or recalled: from the page text as `curl` returns it with the tags stripped (§9), never from a tool's summary of the page. Keep it short; for a lexicon or interlinear, quote the relevant line. Mark an elision with “…”.
- **Rules:**
  - Every factual claim in the chapter has at least one row. A claim with no row does not go in the chapter.
  - Every source key cited anywhere in the chapter appears in the ledger at least once.
  - What the chapter's own verses say, and scripture quoted with a `[[reference]]` (checked by `check-quotes.mjs`), need no row. A claim *about* a scripture beyond its plain words (its date, its Hebrew, a variant, how a tradition reads it) does. So does a plain-words rendering that departs from the KJV's sense.
  - The ledger is committed with the chapter, in the same commit.
  - Reviewers spot-check it by reopening the URLs.
  - If a source isn't in `sources.yaml` yet, use the key you propose for it; the orchestrator adds the entry before the checks pass. Until then `check-content.mjs` reports “unknown source key” for it; that error is expected, and every other error must be fixed. To test against the proposed entries, copy `content/` to a scratch directory, add them there, and run `node scripts/check-content.mjs <book> <n> --root <scratch dir>`.

## 6. Chapter file structure

Files for a book: `content/<book>/book.yaml`, `chapters/`, `guides/`, `themes/`, `evidence/`; `data/kjv/<book>.json`; optionally `data/bom/<book>-parallels.json`. “Adding a new book” in `DEVELOPMENT.md` lists the `book.yaml` fields. Markdown files at the top of `content/<book>/` (`BRIEF.md`, `OPEN-QUESTIONS.md`, `THEME-CANDIDATES.md`) are project notes and aren't published.

`content/<book>/chapters/NN.yaml` (look at an existing chapter for the exact layout). Fields:

- `chapter`, `title`, `tagline`, `when`.
- `setting`: the historical background (150–250 words).
- `thread`: the argument that ties the chapter together.
- `sections`: each has `range`, `heading`, and `plain` (a plain-words paraphrase). The ranges cover every verse exactly once.
- `notes`: see below.
- `christ`: how the chapter points to Jesus Christ.
- `explore`: what's worth exploring next (a short list of scripture threads, and a pointer to an outside resource only if one is especially good).
- `parallels`: `ref`, `note`, and `primary: true` for a Book of Mormon chapter that quotes the whole chapter.
- `sources`: keys from `content/sources.yaml`.

Each note has:

- `ref`: the verse.
- `phrase`: an **exact** substring of that verse, in the spellings of `data/kjv/<book>.json` (the Latter-day Saint edition). Phrases in the same verse must not overlap.
- `kind`: see “Note kinds.”
- `title`: plain and descriptive.
- `body`: Markdown.
- `sources`: keys from `content/sources.yaml`. Every note that makes a factual claim has them.

Write scripture references as `[[2 Ne. 25:4]]` or `[[D&C 113:1–6]]`; references to a book on the site become internal links. Use en dashes in ranges. Section headings shown to the reader (“Background”, “The thread through the chapter”, and the rest) come from `SECTIONS` in `src/site.mjs`; templates use `book.name`, never a hard-coded book title.

## 7. Note kinds

One set for every book. Labels and one-line descriptions live in `KINDS` in `src/site.mjs`; that is the authority.

| kind | label | use for |
|---|---|---|
| `words` | Language | What a word or phrase meant in the original language or in 1611 English. |
| `history` | Context | The people, places, and events behind the text. |
| `symbol` | Imagery | What an image would have meant to its first hearers. |
| `christ` | Witness of Christ | Where the passage points to Jesus Christ and His Atonement. |
| `scripture` | Related Scriptures | Other scripture that quotes, explains, or fulfills the passage. |
| `prophets` | Latter-day Prophets | What latter-day prophets and apostles have taught about it. |
| `structure` | Literary Structure | Only when the structure shows the message (a chiasm whose center is the point). Saying a passage is poetry or a chiasm is not enough. |
| `bom` | BoM Comparison | Generated from `data/bom/` where the Book of Mormon text differs. A hand-written `bom` note explains why a reading matters; it appears inside that verse's comparison panel, so the verse must have one (the build warns if not), and its phrase isn't highlighted. |

Anything new (a kind, a section, a label) gets a plain, non-clever name, and goes to the author first.

## 8. Guides and theme pages

Markdown files in `content/<book>/guides/` and `content/<book>/themes/`, with YAML front matter (`title`, `blurb`, `icon`, `sources`) and then prose. Cite with a numbered citation right after the claim: `[@key]` or `[@key, locator]`. Sources in the page's `sources` that are never cited appear under “Further reading.” Give sections that chapters link to an explicit id (`<h2 id="song-2">…</h2>`). The same sourcing rules and ledger apply.

## 9. Research tools and access

What has worked (2026-09-30, from the author's Mac and from the cloud sandbox). Record new findings in the book's `BRIEF.md` or here.

- **Fetch pages with `curl`, not a web-fetch tool.** `curl -sL '<url>' | sed 's/<[^>]*>//g'` (add `grep` to find the passage) returns the page's own text, so a ledger quote can be copied from it verbatim. A web-fetch tool returns a model's summary of the page, which is not verbatim, and in the cloud sandbox it may be blocked when `curl` is not. Use `curl -g` for URLs with brackets (the Scripture Central API).
- **If a site fails twice, stop trying it** and say so in the report. Don't probe other domains looking for a way around a block; a claim whose only source can't be reached is cut (or left for the author, if it was already in the chapter).
- **Hebrew text.** The Westminster Leningrad Codex, from the Open Scriptures Hebrew Bible (`oshb-wlc`): `https://raw.githubusercontent.com/openscriptures/morphhb/master/wlc/<Book>.xml` (`Isa`, `Jer`, `Exod`, …). Bible Hub's interlinear (`biblehub.com/interlinear/<book>/<c>-<v>.htm`) is a convenient view of the same text.
- **Lexicon.** BDB (`bdb`). The open transcription at `https://raw.githubusercontent.com/openscriptures/HebrewLexicon/master/BrownDriverBriggs.xml` is abridged (many entries give glosses only); Bible Hub's lexicon pages (`biblehub.com/hebrew/<strongs>.htm`) include fuller BDB entries. Quote only what the page you read says.
- **Septuagint.** Brenton's translation on Bible Hub (`biblehub.com/sep/<book>/<c>.htm`), or the Greek and English on Elpenor (`ellopos.net`); cite `lxx-rahlfs`.
- **Other translations** (NRSVUE, NRSV, NIV, ESV) on BibleGateway; cite the translation's own key.
- **Commentaries.** Older public-domain commentaries such as Keil and Delitzsch are on Bible Hub (`biblehub.com/commentaries/kad/<book>/<c>.htm`). Its Hebrew comes back as HTML entities (`&#1506;…`); decode them before quoting.
- **Sefaria** (`www.sefaria.org`) failed from the shell before 2026-09-30 and redirects now; if it doesn't load, use the sources above.
- **Scripture Central.** Use the API (the public pages need a browser). Search: `https://admin.scripturecentral.org/api/knowhys?filters[body][$containsi]=<Book>%20<chapter>&pagination[pageSize]=100&fields[0]=title&fields[1]=slug` (also try Book of Mormon parallels and `filters[title][$containsi]=…`). Full text: `filters[slug][$eq]=<slug>` (the `body` field is HTML). There are 874 KnoWhys, in 9 pages of 100. Public page: `https://scripturecentral.org/knowhy/<slug>`; cite as `sc-knowhy-<number>`. Scripture Central isn't an official Church source, but it is scholarly and faithful; cite specific articles, never the site as a whole. Its archive (`archive.bookofmormoncentral.org`) has PDFs of older FARMS works but failed from the sandbox.
- **BYU.** Religious Studies Center (`rsc.byu.edu`) articles are readable. **ScholarsArchive PDFs are not** (403 from the shell; a download in the browser): only the abstract page is readable, so cite only what the abstract says.
- **archive.org** full texts work: `https://archive.org/download/<id>/<id>_djvu.txt`.
- **Museum catalog pages** (the British Museum, the Israel Museum, and similar) are good institutional sources for artifacts, though some block scripts or fail from the sandbox.
- **Church sources**: scriptures, Bible Dictionary, Guide to the Scriptures, Church History Topics, general conference talks, the Joseph Smith Papers, hymns.
- **Scripture text** for quotation checks comes from churchofjesuschrist.org through `check-quotes.mjs`. On the author's computer run it plainly; in a cloud sandbox run it as `NODE_USE_ENV_PROXY=1 node scripts/check-quotes.mjs …` (Node's `fetch` ignores the sandbox proxy otherwise).
- **Cloud sandbox network.** The environment's network policy decides which hosts load. If research sites fail from every tool, the environment's allowed domains need changing (the author does that); report it rather than working around it.

## 10. Checks

```sh
node scripts/show.mjs [book] <n>                        # print the KJV text with verse numbers
node scripts/fix-yaml.mjs content/<book>/chapters/NN.yaml   # quote YAML values that contain ": "
node scripts/build.mjs                                  # warns about phrases not found, overlaps, bad refs
node scripts/check-quotes.mjs [book] <n>                # verify quoted scripture
node scripts/check-content.mjs [book [n]]              # sources, keys, unreadable works, wikis, ledger, length
npm run dev                                             # preview at http://localhost:4321
```

Fix every warning that concerns your chapter (length warnings on older chapters are the author's to decide). `show.mjs` and `check-quotes.mjs` take the book as an optional first argument (default `isaiah`); give it for any other book.

## 11. Review process

1. **The author's questions first.** Before a chapter is written, ask the author whether they have focus questions for it, and build the chapter around them. Ask one question at a time.
2. **A writer agent drafts** (`.claude/agents/chapter-writer.md`, on Sonnet): it reads the chapter, lists the questions a careful reader would ask, researches them, builds the ledger, writes the chapter from the ledger, runs the checks, and reports. It doesn't edit `sources.yaml`, code, or other chapters, and doesn't commit. Existing chapters are audited the same way by `.claude/agents/chapter-auditor.md`.
3. **The orchestrating session reviews** (on Opus): adds the proposed `sources.yaml` entries after confirming each URL, spot-checks a sample of ledger rows by reopening the sources, and runs `build`, `check-quotes`, and `check-content`.
4. **The author sees it** in the private preview artifact (see “Working with the author” in `AUTHORING.md`).
5. **One commit per chapter**, with its ledger.
6. **Judgment calls** go in the book's `OPEN-QUESTIONS.md`, never decided silently. For an Isaiah audit, also update `content/isaiah/AUDIT.md` in the same commit.
