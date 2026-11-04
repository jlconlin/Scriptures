# Open questions for the author

Everything that waits for the author, for every book and for the site, in this one file (author, 2026-10-04: “I can't keep track of those that are in multiple places”). Nothing that needs the author is kept anywhere else, and **work that waits its turn is listed here too, under “Work waiting its turn,” never in a list of its own** (author, 2026-11-03: “I don't want a list of things to do from this review as well as a separate list of things to do from other areas. We could end up with a dozen different todo lists and not know which one is which”).

- **Answer by number** (“G1: Context note. J4: leave it out.”), here, in a session, or in a comment on the preview.
- Resolving questions records answers only; content is changed later (author, 2026-10-11). Answered items awaiting implementation stay in their own section until their work is carried out.
- An item is deleted once it is answered and the answer is carried out; the decision is then recorded where it applies (`STANDARDS.md`, `AUTHORING.md`, or the book's brief).
- Only what needs the author belongs here. What the standard or a book's brief already settles is decided by whoever is writing and recorded in that book's `BRIEF.md` (“Decided while writing”), where the author can overturn it. A reviewer's doubt about a page that passed its review is not a question for the author: the verdict stands, and the author overturns it on reading (settled 2026-10-11, when most of this file was such doubts).
- “Recommend” is Claude's suggestion where the standard points one way. No recommendation means the choice is a matter of taste or doctrine.

The author has read almost none of the site. A theme page or guide the author has not read carries `review: unread` in its front matter, and one still in the form of before 2026-10-25 carries `review: old-form`; `node scripts/status.mjs` lists both. Treat every page as open to the author's correction.

## The site

- **S1. The form of an old-form theme page when its turn comes.** Thirty-eight theme pages (and the narrative guides) carry `review: old-form`: their connection is sound and already made by the Church's sources, so they were kept, but they have the table-and-steps form of before 2026-10-25. They are rewritten when the author's study reaches their book, or sooner when the author reads one and finds it flat (author, 2026-11-03). What form they take is not decided. **Recommend** the guide's deal (`STANDARDS.md` §8, “How a guide is written”): a short page that states the known connection with the reasoning written out, no readings of its own, on a narrow research brief (the old ledger, the Church's footnotes and *Scripture Helps* at the key verses, one commentary, and what works against the manual's reading), one reviewer and Codex; a page the research shows has a real insight gets the full theme-page treatment instead. No answer is needed until the first such page is opened.

## Answered, awaiting implementation

Nothing.

## Work waiting its turn

Not questions: work the author has decided on that is done when its time comes. An item is deleted when the work is done. Where the work is a page at a time, the page's own front matter says where it stands and `node scripts/status.mjs` lists them, so no page is listed here.

- **Read the 38 rewritten theme pages** (the review of 2026-10-25; `STANDARDS.md` §8, “Where a page stands”). Each carries `review: unread` until the author has read it; the author reads a few each week (2026-11-03) and tells a session, which changes the line to `review: read`. A page the author finds flat is rewritten before the next.
- **Rewrite the old-form theme pages and guides when their book's turn comes.** Thirty-nine theme pages and seventeen guides carry `review: old-form`: their connection is sound but already made by the manuals, and they keep the form of before 2026-10-25. A page is rewritten when the author's study reaches its book, or sooner when the author reads one and finds it flat (author, 2026-11-03: “Lets leave bin C live. We need to update them in the future, maybe near future”). The form is S1 above. Isaiah's *servant-songs* is really a guide and is rewritten as one.
- **Repair the 33 chapter notes and two threads the chapter-note check found** (Codex, 2026-10-27, calibrated and adjudicated). The list, with each note's diagnosis, is the annotated tag `chapter-prose-review-2026-10-28` (`git tag -n400 chapter-prose-review-2026-10-28`). The repairs are made within the volume the author chooses to study, in the language pass's shape (Codex reads, Opus applies), with any added source claim verified; no site-wide rewrite is authorized.

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

**A note to write when 2 Nephi is set up: 2 Nephi 19:1, “Red Sea”** (Isaiah 9:1). The author confirmed on 2026-10-15 that the full discussion belongs under 2 Nephi 19:1, with only a brief cross-reference at Isaiah 9:1. A note was written and cut because Skousen's *Analysis of Textual Variants* was read on an unauthorized site. Write it only after an authorized copy and E. Jan Wilson’s “Joseph Smith and the ‘Red Sea’ in 2 Nephi 19:1” can both be read. Wilson’s article was read from *Interpreter*’s official PDF on 2026-10-15; it expressly calls its proposal speculative. The two official links tried for Skousen (the old PDF address and the edition linked by Scripture Central’s archive) both returned 404, so the note also waits for a readable authorized copy.

How the list was made: `node scripts/bom-in-notes.mjs isaiah` counts each note’s words in sentences with a Book of Mormon reference; the 33 notes with 60 or more, and 11 smaller ones where such sentences are half the note, were read on 2026-10-07. The test: a note that says what Isaiah’s verse means, including how the Book of Mormon quotes, rewords or applies it, stays; a passage that explains the Book of Mormon scene itself (who is speaking, why, what the argument is) moves. Twenty-five of the 33 stay as they are. Run the script on any other book that quotes or is quoted by the Book of Mormon (Malachi 3–4, Genesis) before its Book of Mormon partner is written, and add to this table.
