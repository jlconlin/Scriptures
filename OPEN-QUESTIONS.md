# Open questions for the author

Everything that waits for the author, for every book and for the site, in this one file (author, 2026-10-04: “I can't keep track of those that are in multiple places”). Nothing that needs the author is kept anywhere else.

- **Answer by number** (“G1: Context note. J4: leave it out.”), here, in a session, or in a comment on the preview.
- Resolving questions records answers only; content is changed later (author, 2026-10-11). Answered items awaiting implementation stay in their own section until their work is carried out.
- An item is deleted once it is answered and the answer is carried out; the decision is then recorded where it applies (`STANDARDS.md`, `AUTHORING.md`, or the book's brief).
- Only what needs the author belongs here. What the standard or a book's brief already settles is decided by whoever is writing and recorded in that book's `BRIEF.md` (“Decided while writing”), where the author can overturn it. A reviewer's doubt about a page that passed its review is not a question for the author: the verdict stands, and the author overturns it on reading (settled 2026-10-11, when most of this file was such doubts).
- “Recommend” is Claude's suggestion where the standard points one way. No recommendation means the choice is a matter of taste or doctrine.

Every theme page written from 2026-10-08 to 10-10 (Genesis, Moses, Abraham, Lamentations, Malachi, Ezekiel, Daniel, Hosea, Joel) passed its review and is unread by the author, as are Jeremiah's five and all of Joel and Psalms; `node scripts/status.mjs` shows what is unread. Treat every page as open to the author's correction.

## The site

Nothing.

## Zechariah

- **ZC1. Who is the Zacharias of Matthew 23:35?** The note on Zech. 1:1 says the prophet is not the martyr Jesus names, “Zacharias son of Barachias, whom ye slew between the temple and the altar.” The Church's sources point two ways on who the martyr was: the *Old Testament Student Manual* (33-2) cites *Teachings of the Prophet Joseph Smith*, p. 261, an 1842 *Times and Seasons* editorial that makes him John the Baptist's father; Wilson (Religious Studies Center) argues Joseph Smith did not write that editorial, which follows an apocryphal gospel, and reports that most scholars take him to be Zechariah son of Jehoiada (2 Chr. 24:20–21). **A:** keep the note's second sentence, the scholars' view, labelled as theirs (it does not mention the editorial). **B:** cut it, so the note says only that the prophet is not the martyr and takes no side. Recommend B: the point of the note is who the prophet is, and A sides against a source the Student Manual attributes to Joseph Smith without saying so.

## Answered, awaiting implementation

Nothing.

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
