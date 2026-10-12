# Open questions for the author

Everything that waits for the author, for every book and for the site, in this one file (author, 2026-10-04: “I can't keep track of those that are in multiple places”). Nothing that needs the author is kept anywhere else.

- **Answer by number** (“G1: Context note. J4: leave it out.”), here, in a session, or in a comment on the preview.
- Resolving questions records answers only; content is changed later (author, 2026-10-11). Answered items awaiting implementation stay in their own section until their work is carried out.
- An item is deleted once it is answered and the answer is carried out; the decision is then recorded where it applies (`STANDARDS.md`, `AUTHORING.md`, or the book's brief).
- Only what needs the author belongs here. What the standard or a book's brief already settles is decided by whoever is writing and recorded in that book's `BRIEF.md` (“Decided while writing”), where the author can overturn it. A reviewer's doubt about a page that passed its review is not a question for the author: the verdict stands, and the author overturns it on reading (settled 2026-10-11, when most of this file was such doubts).
- “Recommend” is Claude's suggestion where the standard points one way. No recommendation means the choice is a matter of taste or doctrine.

Every theme page written from 2026-10-08 to 10-10 (Genesis, Moses, Abraham, Lamentations, Malachi, Ezekiel, Daniel, Hosea, Joel) passed its review and is unread by the author, as are Jeremiah's five and all of Joel and Psalms; `node scripts/status.mjs` shows what is unread. Treat every page as open to the author's correction.

## The site

- **S7. The arrows after each source on guide and theme pages.** Under “Sources,” each entry ends with one “↩” for every place the page cites it; each arrow jumps back to that place. On Isaiah’s World the Student Manual’s entry has seventeen. You read them as new-line marks (2026-10-11: “That isn't obvious what that link is. Perhaps we should rethink how to show that”). Two ways to show it: (a) small letters, as reference works do, “↑ a b c d,” each letter a link back to one use; (b) no back links at all, since the browser’s Back button returns to the place after a citation is followed. Recommend (a): it keeps the way back and no longer looks like a line break. It is a change to how the site looks, so it goes on a branch for you to see first (`AUTHORING.md`, “Where changes go”).

## Answered, awaiting implementation

Nothing. The decisions of 2026-10-11 were carried out the same day; each is in its commit (`git log --since=2026-10-11`) and, where it sets a rule, in the book’s brief. Three things to know when reading the result:

- **Hosea’s fifteen notes (H9).** Ten were revised from Latter-day Saint studies found in a new search. For seven verses (4:16; 5:2; 6:2; 7:16; 9:3; 9:7; 9:13) the search found nothing, and those notes stand as written (`content/hosea/BRIEF.md`, “State of the book”).
- **Plain words.** Of the passages flagged, nine sentences took back a clarification that a note or the Church edition’s footnote supports; the rest keep the King James sense. Where the footnote supplies the sense, no new note was written (`content/isaiah/BRIEF.md`, “Book-wide conventions”); say so if you want a visible note in those places too.
- **Former “Liken It” notes (S6).** All 117 were read. 112 are still on the site, and four had a sentence of personal application left (Isaiah 4:1; 44:12; 54:7; 56:5); those sentences are gone.

## Work waiting, no decision needed

- **Psalms: a second pass over the psalms written before 2026-10-11: not now** (your answer that day: “No I dont' want a second pass right now. Maybe in a future date”). Kept here so it isn't lost. The first 116 psalms were written before the rule on Hebrew, before the table of where each shared thing is explained, and without two finders of Latter-day Saint studies (BYU Studies' psalm-by-psalm lists; the Interpreter Foundation's journal). Of them, 49 cite no Scripture Central, BYU or Interpreter source, and Delitzsch is in 28 percent of the notes. A pass would look each psalm up in the finders, cut Hebrew and Delitzsch that answer no reader's question, and turn repeated explanations into pointers; a rough guess is 150,000 to 250,000 tokens a psalm.

- **Targeted review of plain-words summaries** (author approved, 2026-10-11): the passages flagged from the language pass were reconsidered on 2026-10-11 (above). Still to do: review a small sample of other chapters for whether the summaries explain difficult language, preserve meaning, and explain significant translation choices. Measure the first batch before estimating the total cost; propose a broader review only if the sample shows a recurring problem.

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
