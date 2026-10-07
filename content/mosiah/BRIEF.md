# Mosiah: brief

**Not yet a full brief.** Mosiah was set up on 2026-10-07 only to give two notes a home (below). Before the book is written, this file needs what every brief has (divisions, the author's questions, readable sources, book-wide issues, Restoration connections); Jeremiah's is the model.

## Bare chapters

A **bare chapter** is a chapter file with the full text and one or a few notes, and nothing else: no `setting`, `thread`, `sections`, `christ` or `explore`. The author's idea (2026-10-07), for commentary that was written under one book and belongs under another that is not ready: the note moves to its own verse now, and the chapter is written in full later. The file begins with a comment saying so.

Bare chapters in this book: **12 and 15.**

When Mosiah is written, these two are written like any other chapter. The writer keeps the notes that are there (deepening them is welcome) and adds everything else; a file that already exists is not a reason to skip the chapter.

**What was moved, from Isaiah 52 (2026-10-07).** The author: the note on Isaiah 52:7, “Abinadi and the beautiful feet,” “is great, but it should mostly be attached to a note in Mosiah.”

- Mosiah 12:21, “Why the priests asked about Isaiah”: the false-prophet trap and Zeniff's colony seeing itself in Isaiah's words, from Isaiah 52:7, with its three rows from KnoWhy #89. Two rows were added from the same KnoWhy and 2 Nephi 5 for sentences that had none.
- Mosiah 15:18, “Whose feet are beautiful”: the widening circles and the joining of the two halves of Isaiah 52, from Isaiah 52:7.
- Mosiah 12:29 and 15:29: what the Isaiah notes on 52:11 and 52:8 say of Abinadi in a sentence each, written out here with their rows from *Isaiah in the Book of Mormon* (Welch, p. 296; Pike, p. 265). Those two sentences were short and were **left in Isaiah as well**.
- Mosiah 15:10, “The seed of Christ” (from Isaiah 53:10, “Who shall be his seed?”, the same day): Abinadi's question and answer about the servant's seed, with King Benjamin and Alma, and its two rows from Welch (p. 304). Isaiah 53:10 keeps the turning point of the song, “prolong his days,” and three sentences giving Abinadi's answer with a link.
- Isaiah 52:7 keeps the runner on the ridge, the Hebrew, Paul and Nephi, and a short paragraph giving Abinadi's answer with links to the two Mosiah notes.

**Not yet used, for the full chapters.** KnoWhy #89 gives a Dead Sea Scrolls text about Melchizedek that reads Isaiah 52:7 of the prophets and “the Anointed one”; and it names John W. Welch, *The Legal Cases in the Book of Mormon* (2008), 139–209, on the trial. Neither was read beyond the KnoWhy.

## The text

`data/kjv/mosiah.json` was imported on 2026-10-07 from the Gospel Library by `node scripts/fetch-gl.mjs mosiah bofm/mosiah 29` (29 chapters, 785 verses). `node scripts/check-kjv.mjs mosiah` reports no difference.

**It carries the wording of the 1920 edition** (every book's text is a public-domain edition's; `DEVELOPMENT.md`, “Adding a new book”). Five scans of the 1920 edition's printings on archive.org were compared (`bookofmormon00smituoft`, a 1921 printing, is the one named in the footer). `scripts/find-verses.mjs` found 718 of the 785 verses word for word; the other 67 were lined up with the scans by letter, skipping the footnotes the scans print inside verses. Fourteen verses differ in wording and are in `data/kjv/mosiah.edition.json`:

- “exceeding” where the current edition has “exceedingly”: 3:13, 4:11, 4:20, 5:4, 7:14, 20:10, 21:24, 25:8.
- 12:22 “Thy watchman” (current: “watchmen”); 14:3 “our face” (“our faces”); 22:7 “the left of the camp” (“of their camp”); 27:28 “after wandering through much tribulation” (“wading”).
- 17:15 “many shall suffer even the pains of death by fire” (current: “shall suffer the pains that I do suffer, even the pains of death by fire”); 29:15 “him have I punished according to the law” (current adds “according to the crime which he has committed,”).

Punctuation and capitals were not compared. Copy any quotation of these verses from `data/kjv/mosiah.json`, not from the Gospel Library. **12:22 is inside the passage the priests quote**: the site prints “Thy watchman,” while Isaiah 52:8 and Mosiah 15:29 have “watchmen.”

## Sources read so far

- `sc-knowhy-89`, “Why Would Noah's Priests Quiz Abinadi on Isaiah?” (read in full, 2026-10-07).
- `isaiah-in-bom`, *Isaiah in the Book of Mormon* (1998): Dana M. Pike on Isaiah 52:7–10 (pp. 249–291) and John W. Welch on Isaiah 53 and Mosiah 14 (pp. 293–312), from Scripture Central's PDF (only the pages around the two quotations).
- The Church's chapter headings for all 29 chapters and the headnotes before chapters 9 and 23 (`book.yaml` rests on these).
