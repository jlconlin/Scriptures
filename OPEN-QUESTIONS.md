# Open questions for the author

Everything that waits for the author, for every book and for the site, in this one file (author, 2026-10-04: “I can't keep track of those that are in multiple places”). Nothing that needs the author is kept anywhere else, and **work that waits its turn is listed here too, under “Work waiting its turn,” never in a list of its own** (author, 2026-11-03: “I don't want a list of things to do from this review as well as a separate list of things to do from other areas. We could end up with a dozen different todo lists and not know which one is which”).

- **Answer by number** (“G1: Context note. J4: leave it out.”), here, in a session, or in a comment on the preview.
- Resolving questions records answers only; content is changed later (author, 2026-10-11). Answered items awaiting implementation stay in their own section until their work is carried out.
- An item is deleted once it is answered and the answer is carried out; the decision is then recorded where it applies (`STANDARDS.md`, `AUTHORING.md`, or the book's brief).
- Only what needs the author belongs here. What the standard or a book's brief already settles is decided by whoever is writing and recorded in that book's `BRIEF.md` (“Decided while writing”), where the author can overturn it. A reviewer's doubt about a page that passed its review is not a question for the author: the verdict stands, and the author overturns it on reading (settled 2026-10-11, when most of this file was such doubts).
- “Recommend” is Claude's suggestion where the standard points one way. No recommendation means the choice is a matter of taste or doctrine.

The author has read almost none of the site. A theme page or guide the author has not read carries `review: unread` in its front matter; `node scripts/status.mjs` lists them. Treat every page as open to the author's correction.

## The site

Nothing.

## The Gospels

What importing the author's chronology found (`node scripts/chronology.mjs --check` prints all of it; line numbers are lines of `Appendices/Chronology.tex`). The original is the author's, so each is a change the author makes or approves there; the import is then run again.

- **N1. Luke 27:39–43** (line 724, “Today thou shalt be with me in paradise”): Luke has no chapter 27. *Recommend* 23:39–43, which no other row has.
- **N2. John 16:29–30 is given to two rows** (line 667, “Apostles testify of Christ,” and line 668, “Again warns of future calamity”), and John 16:31–33 to none. *Recommend* line 668 as 16:31–33.
- **N3. Verses in no row.** Each with the row it would join, or leave it out on purpose: Matthew 16:27 (line 364, “Lost life shall be found,” now 16:24–26); Matthew 27:36 (line 718, “Crucified”); Luke 13:18–19 (the mustard seed, whose row at line 480 is commented out); Luke 21:38 (line 630, “Retires to Mount of Olives”); Luke 22:17 (line 641, “Institutes the Sacrament,” now 22:18–20, or line 634); John 1:34 (line 93, now 1:32–33); John 4:45 (line 141, “Travels to Galilee,” now 4:43).
- **N4. Passages placed twice.** Keep both, or say which is the place: Matthew 11:25–30 (lines 245–246 in Galilee and lines 452–453 with the Seventy); Matthew 10:1–4 (line 193 and lines 295–296); Luke 9:51 (lines 443 and 514); Luke 22:66–71 (lines 686 and 693). The other fifty or so shared verses are one verse at the join of two rows and need nothing.
- **N5. Line 739 reads “Arimath\ae asks”** and prints as “Arimathæasks.” *Recommend* “Arimath\ae a asks.” Two labels are each used by two rows, which matters only to the book's page references: `sec:ReturningtoNazareth` (lines 291, 292) and `par:JesusHearsofBaptistsDeath` (lines 302, 312).
- **N6. The grouping into 165 stories** (`content/volumes/new-testament/stories.yaml`) is a first proposal and waits for the author's reading: which stories to join or divide.

- **N8. May the full detail of the chronology sit in this public repository?** `content/volumes/new-testament/chronology.yaml` (all 635 events, converted from the private repository) is on disk and ignored by git. *Keep it out:* the site and the writers work from `stories.yaml` alone, and a link between tellings lands on a story's verses. *Commit it:* the links can land on the exact event. *Recommend* keeping it out; nothing needs it yet.
- **N9. Is Luke's sermon on the plain the same sermon as Matthew 5–7?** Your chronology has one event, “Sermon on the Mount/Plain,” and `stories.yaml` joins Luke 6:20–49 to the matching Sermon on the Mount stories so they are read side by side; S. Kent Brown, the fullest Latter-day Saint commentary on Luke, reads two sermons on two occasions. *Two sermons:* Luke 6's `setting` and notes explain the sayings in Luke's own setting (the Twelve just chosen, the plain, the woes) and say once that readers take it either way, with Brown's view attributed; the story files and `parallels` stay as they are. *One sermon:* the `setting` calls it Luke's account of the sermon in Matthew 5–7 and explains why the two differ. *Recommend* two sermons, as `content/luke/BRIEF.md` proposes; it changes only the wording of chapter 6's `setting` and one note.

## Answered, awaiting implementation

Nothing.

## Work waiting its turn

Not questions: work the author has decided on that is done when its time comes. An item is deleted when the work is done. Where the work is a page at a time, the page's own front matter says where it stands and `node scripts/status.mjs` lists them, so no page is listed here.

- **Read the 38 rewritten theme pages** (the review of 2026-10-25; `PAGES.md`, “Where a page stands”). Each carries `review: unread` until the author has read it; the author reads a few each week (2026-11-03) and tells a session, which changes the line to `review: read`. A page the author finds flat is rewritten before the next.
- **Re-source the pages that cite a Church teaching manual, when the books are revised** (author, 2026-11-17: “I don't want to make a wide change now… we can revise when we revise the books”). About 4,700 of the site's 65,000 ledger rows (in 770 files, most books) cite a Student Manual (about 2,700), *Scripture Helps* (1,600), a seminary manual (300) or *Come, Follow Me* (150), written before the rule that a manual is a finder, never a source (`STANDARDS.md` §1). When a book is revised, each is replaced by the work the manual relays, read and cited, or by scripture or a prophet saying the same, or cut. `check-content.mjs` lists them; nothing is done before then.
- **Review the unanswered questions** (author, 2026-11-17: “At some point we should do a review of the unanswered questions. We should either search more broadly for answers or keep a list of questions that don't have answers yet”). Each book's `content/<book>/UNANSWERED.md` lists the reader questions no source read answered: 688 in 35 books on 2026-11-17. The review sorts each by why it is open (the text is silent, faithful sources disagree, a source exists but couldn't be read, or nothing was searched beyond the Church's sources), searches more broadly where an answer may exist, adds what is found to the chapter as usual, and publishes the rest for readers (author, 2026-11-17: “make a page for them so the reader can see it”): a page per book, linked from the book page, each question in a plain sentence saying what the text says and what it leaves open, linked to its chapter, written for the reader rather than copied from the working list (which names sources and records what a writer didn't search). It may also show whether the rules on sources (`STANDARDS.md` §1, §4) are keeping good answers out. Not yet scheduled.

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
