# Open questions for the author

Everything that waits for the author, for every book and for the site, in this one file (author, 2026-10-04: “I can't keep track of those that are in multiple places”). Nothing that needs the author is kept anywhere else.

- **Answer by number** (“G1: Context note. J4: leave it out.”), here, in a session, or in a comment on the preview.
- Resolving questions records answers only; content is changed later (author, 2026-10-11). Answered items awaiting implementation stay in the section below until their work is carried out.
- An item is deleted once it is answered and the answer is carried out; the decision is then recorded where it applies (`STANDARDS.md`, `AUTHORING.md`, or the book's brief).
- Only what needs the author belongs here. What the standard or a book's brief already settles is decided by whoever is writing and recorded in that book's `BRIEF.md` (“Decided while writing”), where the author can overturn it. A reviewer's doubt about a page that passed its review is not a question for the author: the verdict stands, and the author overturns it on reading (settled 2026-10-11, when most of this file was such doubts).
- “Recommend” is Claude's suggestion where the standard points one way. No recommendation means the choice is a matter of taste or doctrine.

Every theme page written from 2026-10-08 to 10-10 (Genesis, Moses, Abraham, Lamentations, Malachi, Ezekiel, Daniel, Hosea, Joel) passed its review and is unread by the author, as are Jeremiah's five and all of Joel and Psalms; `node scripts/status.mjs` shows what is unread. Treat every page as open to the author's correction.

## Answered, awaiting implementation

Decisions below were made on 2026-10-11. They are recorded for later work; the content has not been changed. This section and “Work waiting, no decision needed” are the follow-up task list for this review.

**The author's decisions:**

- **S6 — Former “Liken It” notes:** count the personal-application closing sentences that remain after the language pass, then remove those sentences while retaining the explanatory notes. The earlier claim that none remain was not established by a complete audit; this count still needs to be done.
- **S5 — About page:** broaden the principles to cover the site's books generally; remove “the Holy Ghost is the one who opens Isaiah” and “Read with a prayer in your heart.”
- **S5 — Mosiah's description:** use “A growing companion to the book of Mosiah, grounded in the restored gospel of Jesus Christ.”
- **S5 — The Arm of the Lord:** move the arm-of-mercy paragraph from “Alone” to “To whom is the arm revealed?”
- **S5 — The New Exodus:** retain “The words” column. Explain the “Step” column more clearly, using descriptions of the movements in the story rather than compressed labels.
- **S5 — Scattered and Gathered:** remove the standalone “Scattered” section; keep its passage references in the overview table.
- **S5 — Isaiah's World:** combine the timeline and rulers into one historical section showing dates, rulers or empires, events, and relevant passages. Keep a short geographical introduction, the map, and a shorter nations glossary.
- **S5 — Isaiah 1–37 language-pass cuts: settled, no work required.** Keep the shortening and refinements; do not revisit those chapters to restore deleted sentences (author, 2026-10-11). This decision does not cancel the separately approved targeted review of plain-words summaries.
- **S5 — Genesis 21:31:** restore the connection between Abraham's presence at Dan and Beer-sheba and the later boundaries of the promised land, in one concise sentence presented as the BYU study's reading. Restore its supporting ledger rows from commit `137d34d`'s parent (author, 2026-10-11: “Let’s restore it”).
- **S5 — Abraham 3:3:** restore a short discussion of the Church's caution about the facsimiles in the Kolob note, paraphrased in the site's words, and retain the link to Abraham 1:12 for fuller discussion. The reader should understand the qualification where the facsimile is used (author approved, 2026-10-11). Earlier wording is in commit `da6be9b`'s parent.
- **S5 — Lamentations 2: settled, no work required.** Keep the current chapter-specific explanation that the poem records no answer; do not restore the repeated book-wide sentence (author approved, 2026-10-11). The book-wide sentence on the comfort page (“No response from the Lord follows, here or anywhere in the book,” cited to *Scripture Helps*) stays as it is, since the page already handles 3:57 as the man's own telling (settled under the standard, below).
- **S5 — Plain words:** use the King James as the starting point, allowing well-supported clarifications that materially improve understanding. Explain meaningful departures in a visible note with ledger support; do not present disputed alternatives as settled (`STANDARDS.md` §6). Reconsider the language-pass changes flagged in Isaiah 13–15, 18–19, 24–26, 33, 37–38, 42, 59, 61, 66; Genesis 12:6, 9, 19; Jeremiah 2:20, 6:18–19, 10:17, 15:17. Isaiah 26:15, 27:1, and 27:7–11 retained supported alternatives and should be checked for consistent treatment. Earlier wording and ledger rows are in git. The targeted review approved below determines whether a wider review is needed.

**Settled under the standard on 2026-10-11** (Claude's decisions on questions that did not need the author, each with the rule it rests on; the author may overturn any of them before the work is done):

- **Mo-C / Ab-C — Two word-list sections go.** Cut “Son and father” from Moses's one-plan page and “Chapter 2 takes up words of chapter 1” from Abraham's fathers'-blessing page. Each lists shared words and draws nothing from them (`STANDARDS.md` §3: a shared word with nothing changed in the reading; §8: “an arc, not a list”), and the reviewers named them as the sections to cut. Both pages come under 900 words.
- **La-T — Lamentations 3:33, the note:** “with His heart” becomes “from His heart,” as the theme page and the ESV have it (*millibbo*: the prefix is “from”).
- **La-C (a) — The hand-and-heart page** ends its last section on “and His heart is named in one”; the clause “and the last prayer is left without a written reply” goes (the section already says D&C 133:53 “is not a reply within these poems,” and the previous section says it too).
- **La-C (c) — “An older commentary” on the three Lamentations pages:** where the reading is not contested, let the citation carry it (`STANDARDS.md` §3, “don't announce the source”); keep the marker only where the page sets that reading against another.
- **La-C (e) — The comfort page:** merge the two-quotation section “My hope is perished” into “Therefore have I hope” (verse 18 then verses 21–26, one movement).
- **Ma-T — “Where Is the God of Judgment?”:** cite the 2026 *Come, Follow Me* for “the Sun of righteousness” as Jesus Christ in place of the 2018 seminary teacher manual, with its ledger row (`STANDARDS.md` §1: the newest Church source).
- **E3 — Ezekiel 39:2:** reopen the Student Manual's Enrichment I. If it builds a detail of the battle on “the sixth part,” the note says in one sentence that the Church's manual reads the King James wording so, beside the Hebrew and the modern translations, without choosing against it (`STANDARDS.md` §2: state translation choices fairly, then the Church's reading). If it does not, the note stays silent.
- **E6 — Ezekiel 11** is retitled, so that “A Little Sanctuary” names only the theme page the author selected. **One Shepherd** drops the paragraph joining “whose right it is” (21:27) to “feed them with judgment” (34:16): a word Ezekiel uses 43 times joins nothing (§3). **Waters out of the Sanctuary** adds a pointer from “The LORD is there” (48:35) to A Little Sanctuary's section on Rev. 21:3 (§8: “the page links”). Chapter 17's twig is not added to One Shepherd's arc; the chapter stands on its own.
- **D2 — Daniel 4:33 and 5:2:** Tvedtnes's Nabonidus proposal stays in full at 4:33 (the madness); 5:2 keeps one sentence and points there (`STANDARDS.md` §1: say it once and link).
- **D3 — Daniel 5:25:** drop “listed in descending order” and the clause correcting it. The note keeps the three weights from the lexicon and *Scripture Helps*' reading that the series pictures Babylon's diminishing power, in the site's words. The site does not correct a Church help in a note; it says what it can support (§1, §4).
- **D5 — Daniel 10:5:** cut the last two paragraphs, which divide the chapter at verse 10 and name the speaker from there as one of the “others.” No source read makes that division (the one that reports it rejects it), so it is an unsourced reading (§3, §4 rule 1). The chapter says what the heading says: Daniel “sees the Lord and others.”
- **H8 — Hosea 11, Witness of Christ:** keep the one plain sentence and link it to the note that identifies the LORD as the premortal Christ.
- **I4 — Isaiah 2:4:** beside the manual's “not known,” one clause that the BYU article the chapter already cites reads Micah as repeating Isaiah (§2: state the positions; an addition, so within the add-only rule).
- **I5 — Isaiah 2:16:** add that Coverdale's 1535 Bible has “ships of the sea,” “quite possibly” from the Greek (*Isaiah in the Book of Mormon*, p. 377, already cited), and soften the argument that Joseph Smith could not have had the line from the Greek to what the evidence bears (§2, §3: say how certain each claim is; an addition).

## Genesis

- **G2. The title “The Covenant Blesses Those Outside the Family.”** It states as fact what the page itself calls its own comparison (no source says these scenes fulfil Gen. 12:2–3). Codex suggests “Abram’s Promise and Those Outside His Family.” The title is your wording and is link text in chapter notes. Keep it, or take Codex's? No recommendation: the rest of that page, and the other six Genesis pages, passed review and wait only for your reading.

## Abraham

- **Ab-T. From Council to Creation: whose reading of chapter 4 leads.** Your selection reads chapter 4 as the Gods going down and forming the earth and chapter 5 as bringing to pass what they counseled. The Church's chapter heading (which the brief follows) calls chapter 4 the Gods' *plans* for the six days and puts the bringing to pass in chapter 5. The page gives both: one study's reading that the council decides in 3:24–28 and “executes that decision” from 4:1, and the heading's reading beside it. Recommend: keep that balance, since the standard does not let a page read a passage against a Church source (`STANDARDS.md` §8); say if you want your reading to lead.

## Hosea

- **H1. Gomer: how far beyond the text.** The chapters follow *Scripture Helps* on the marriage (the readings as readings; no one chosen) and say nothing of Gomer beyond the text: not that she left, repented or came back, and no lessons for a reader's marriage. That is the brief's own rule, and it is stricter than the Church's newest help, which says as fact that “at some point in their marriage, Gomer left Hosea and returned to a life of immorality.” Recommend: let chapter 1 (or 3) report that sentence as *Scripture Helps*' reading, in one sentence, and keep the rest of the rule. Say if you would rather the chapters stay silent.
- **H9. Where the Student Manual is still the frame.** In fifteen notes its reading stands first or carries the explanation, with nothing from BYU, Scripture Central or *Interpreter* found for the verse: 2:2, 3:3–4, 4:12, 4:16, 5:1–2, 6:2 (the two days as two thousand years, with its “may”), 7:8, 7:11, 7:16, 8:9, 8:13, 9:3, 9:7, 9:13, 12:1. Every chapter is inside the one-third limit and no note rests on the manual alone. Recommend: leave them (`AUTHORING.md`: rules are for new writing; `STANDARDS.md` §1: the manual is the floor, not something to purge). An article on Scripture Central on “know” as covenant language (4:6; 13:4–5), found after the chapters were written, would be used if you want these reworked.

## Psalms

- **Ps1. Psalm 110:1, “The LORD said unto my Lord”: who speaks to whom.** *Scripture Helps* says Jesus cited the verse “to teach about His divine status as Jehovah.” Hebrews 1:13 and Acts 2:34–36 have God speak the verse to His Son, which makes “the LORD” the Father. The note gives *Scripture Helps* first, then those New Testament verses, then one sentence from a BYU article saying that the use of Jehovah for the Son and Elohim for the Father is the Church's modern usage and “was not taken from the Hebrew Bible”; it does not try to reconcile them. *Recommend:* keep it as it is. Say if you would rather the note stop after *Scripture Helps*.

## Isaiah

- **I1. Deepen the rest of chapters 1–37?** Done on 2026-10-06 under the add-only rules in `content/isaiah/BRIEF.md`: 6, 7, 9, 11, 14, 24, 26, 29 (25 and 27 were tried and nothing was worth adding). Not started: 2–5, 8, 10, 12, 13, 15–23, 28, 30–37. Chapter 1 has no evidence ledger and would need an audit first. A chapter cost 40–290k tokens and gained one to three notes. Recommend: read the eight first, then decide.
- **I9. Four places where the add-only rule keeps a new note from being merged with an old one:** 7:14 treats the sign for Ahaz twice (an old bullet and the new Immanuel note); 6:9 gives two readings of the hardening and the old one leads; the Babylonian morning-star parallel is in the 14:8 note, not at 14:12; the note on 29:15–17 sits on verse 16, so verse 17 has no highlight. Only you can relax the rule. Recommend: allow a merge in these four places and nowhere else.

## Work waiting, no decision needed

- **Psalms: a second pass over the psalms written before 2026-10-11: not now** (your answer that day: “No I dont' want a second pass right now. Maybe in a future date”). Kept here so it isn't lost. The first 116 psalms were written before the rule on Hebrew, before the table of where each shared thing is explained, and without two finders of Latter-day Saint studies (BYU Studies' psalm-by-psalm lists; the Interpreter Foundation's journal). Of them, 49 cite no Scripture Central, BYU or Interpreter source, and Delitzsch is in 28 percent of the notes. A pass would look each psalm up in the finders, cut Hebrew and Delitzsch that answer no reader's question, and turn repeated explanations into pointers; a rough guess is 150,000 to 250,000 tokens a psalm.

- **Targeted review of plain-words summaries** (author approved, 2026-10-11): first reconsider the passages listed under answered S5 using their notes, existing evidence, and earlier wording in git. Then review a small sample of other chapters for whether the summaries explain difficult language, preserve meaning, and explain significant translation choices. Measure the first batch before estimating the total cost; propose a broader review only if the sample shows a recurring problem. Content edits happen in the later implementation stage.

- **Historical context across the Old Testament books:** review whether each book's introduction and chapter settings give enough background to understand its people, places, and circumstances; add a historical guide where needed. The author approved context suited to the book's length and complexity, rather than an Isaiah-length guide for every book (2026-10-11; `STANDARDS.md` §8).

- **Genesis 22, closing section:** Melvin J. Ballard's words are cited from the seminary manual that prints them; read and cite the original talk (“The Sacramental Covenant,” *New Era*, Jan. 1976).
- **A leftover working copy** in `.claude/worktrees/` (from the “Show three more” branch, long merged) can be deleted.
- **Isaiah 18:7:** Joseph Smith's statement is cited from the manual (*History of the Church* 2:132); find it in the Joseph Smith Papers and cite it there.
- **2 Nephi 19:1, “Red Sea”** (Isaiah 9:1): a note was written and cut because Skousen's *Analysis of Textual Variants* was read on an unauthorized site. Write it when the publisher's copy and the *Interpreter* article arguing the reading may be authentic can both be read.
- **Isaiah 29:14:** three ledger rows cite an *Interpreter* article (`bowen-yasap`) whose page now needs a browser, so `check-ledger` cannot confirm them; find a readable copy.
- **Isaiah chapters with no evidence ledger:** 1, 40–44, 56–66 (`content/isaiah/BRIEF.md`, “State of the book”).
- **Abraham’s and Moses’s theme pages** have not had Codex’s language read (`AUTHORING.md`, “Other pages”).
- **Hosea 9:14, Luke 23:29** (“Blessed are the barren”) was cut from the Witness of Christ because its only source was a Bible Hub page whose author could not be confirmed; restore it only if a confirmed source is found. **Hosea 1:10 and 2:23, 1 Peter 2:10** was cut because no source read joins Peter's “not a people… had not obtained mercy” to Hosea; a chapter note needs a source for the connection (`STANDARDS.md` §4), so it waits for one.

## Notes waiting for a Book of Mormon home

No decision needed; this is the one list of commentary that sits under Isaiah and belongs under a Book of Mormon verse. The author (2026-10-07): Book of Mormon books are not being written now (“there are many more books in the OT and NT that should come first”), so these stay in Isaiah, whole, until their book is set up. **Whoever sets up one of these books reads this list first**: move the passage to a note on its own verse with its ledger rows, cut the Isaiah note down to what is about Isaiah’s verse with a link across, and delete the line here. Mosiah 12 and 15 show how it was done (`content/mosiah/BRIEF.md`).

| Isaiah note | What moves | To |
|---|---|---|
| 52:15 “The marvelous work and the marred servant” | Who the latter-day servant is (the three readings; the second and third paragraphs) | 3 Ne. 21:10 |
| 14:12 “Lucifer, son of the morning” | What Lehi had read of an angel fallen from heaven (the last paragraph) | 2 Ne. 2:17 |
| 53:4 “The pains and the sicknesses of his people” | Why the Savior took these on Himself, “that he may know according to the flesh” (the last paragraph) | Alma 7:12 |
| 22:22 “The key of David” | Nephi’s sealing power and the shutting of the heavens (the end of the last paragraph) | Hel. 10:7 |
| 1:2 “Calling the witnesses” | Nephi the son of Helaman putting the people on trial (the last paragraph) | Hel. 8:24 |
| 55:2 “What Jacob and Nephi did with this invitation” | Nearly the whole note (author, 2026-10-08: it “belongs in the BoM”): how Jacob reshaped verse 2 (the second paragraph) and how Nephi used verse 1 (the third). It was read on 2026-10-07 and judged to stay, so the test below is narrower than the author’s | 2 Ne. 9:51 and 2 Ne. 26:25 |

How the list was made: `node scripts/bom-in-notes.mjs isaiah` counts each note’s words in sentences with a Book of Mormon reference; the 33 notes with 60 or more, and 11 smaller ones where such sentences are half the note, were read on 2026-10-07. The test: a note that says what Isaiah’s verse means, including how the Book of Mormon quotes, rewords or applies it, stays; a passage that explains the Book of Mormon scene itself (who is speaking, why, what the argument is) moves. Twenty-five of the 33 stay as they are. Run the script on any other book that quotes or is quoted by the Book of Mormon (Malachi 3–4, Genesis) before its Book of Mormon partner is written, and add to this table.
