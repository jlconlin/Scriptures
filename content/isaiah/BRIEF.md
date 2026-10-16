# Isaiah brief

Book-level decisions for Isaiah. The site-wide standard is in `STANDARDS.md`; this file records what is particular to Isaiah. Isaiah was written before the standard and before briefs existed, so this brief was assembled afterward from the project notes; it is shorter than a new book's brief will be.

Related files:
- `OPEN-QUESTIONS.md`, at the top of the repository: what waits for the author, for every book.
- `THEME-CANDIDATES.md`: topics for future theme pages.

## State of the book

All 66 chapters are written, audited against the sourcing standard, and have evidence ledgers. Chapters 38–66 were written at the semi-academic standard in `STANDARDS.md`; chapters 1–37 were written somewhat closer to a general audience. The remaining work is resolving `OPEN-QUESTIONS.md` and the revision plan below.

## Book-wide conventions

- **Setting and composition date are different questions.** In chapters 40–66, distinguish the community a passage addresses or pictures from a claim about when it was written. Where sources place a passage before or after the return from exile, identify that as a reading; a date in the historical chronology does not by itself date the chapter.

- **Isaiah’s World** has one historical table (dates, rulers or empires, events, passages), a short geographical introduction, the map, and a short list of nations (author, 2026-10-11). Add a ruler or an event as a row of that table; don’t start a second list.
- **Plain words and the Church edition’s footnotes.** Where the King James wording is obscure and the Church edition’s own footnote gives the sense (“satyrs”: he-goats, 13:21; “send a blast”: put a spirit in him, 37:7), the plain-words summary uses the footnote’s sense, with a ledger row quoting the footnote and no new note, since the reader has that footnote beside the verse (`STANDARDS.md` §1, §6). A clarification with no footnote behind it needs a visible note that explains it; a disputed reading stays with the King James (19:18; 26:19). Decided by the coordinator on 2026-10-11 in the review of the flagged passages; the author may overturn it.

- **Servant Songs.** Cite the full passages: 42:1–9, 49:1–13, 50:4–11, 52:13–53:12, so readers don’t miss the verses that answer each song. No separate “core vs. extended” ranges.
- **Theme pages.** `content/isaiah/themes/`, published at `/isaiah/themes/<file name>/` with an index at `/isaiah/themes/` and cards on the Guides page (`/isaiah/guides/`). Done: **The Servant Songs**. When a chapter touches a theme that has a page, link to it instead of re-explaining the theme. Candidates are in `THEME-CANDIDATES.md`.

## Sources particular to Isaiah

- Delitzsch's commentary (in Keil and Delitzsch; readable on Bible Hub at `biblehub.com/commentaries/kad/isaiah/<c>.htm`) is the fullest commentary readable online. Use it to answer a question the chapter already asks, not as a source of material; where a point rests on him alone, present it as his reading.
- For the Qumran readings and the Septuagint, Hopkin (`hopkin-abinadi-isaiah`, RSC) were readable for chapters 52–53; the Israel Museum's Digital Dead Sea Scrolls site loads but doesn't show readings verse by verse.
- *Isaiah in the Book of Mormon* (Parry and Welch, eds., FARMS 1998; `isaiah-in-bom`) is the main Latter-day Saint scholarly work on the Isaiah chapters, and the author counts it a good source: use it wherever it answers a question a chapter raises. Readers get BYU ScholarsArchive's PDF (the URL in `sources.yaml`), which the sandbox can't download (a Cloudflare check). Read the identical Scripture Central copy instead: `node scripts/source.mjs https://storage.googleapis.com/scripturecentral-prod-strapi-uploads/ry_and_welch_isaiah_in_the_book_of_mormon_1998_184195e137/ry_and_welch_isaiah_in_the_book_of_mormon_1998_184195e137.pdf --find 'words'` (561 pages). Cite printed page numbers and the exact PDF URL actually read in the ledger.
- Not readable from the sandbox: Ludlow's and Nyman's Isaiah commentaries (archive.org 401 or not found), Nilsen (encrypted PDF), Britannica (403), the British Museum (403).
- The standard modern commentaries (Oswalt, Blenkinsopp, Childs, Shalom Paul, Westermann, Williamson, Parry) are not readable online; see `STANDARDS.md` rule 8.
- Book of Mormon comparison data: `data/bom/isaiah-parallels.json` (built by `scripts/fetch-bom-parallels.mjs`, which is Isaiah-specific).

## Revision plan for chapters 1–37

**No further broad deepening pass is planned** (author, 2026-10-11). The existing research additions stand; improve individual passages when the author's study reveals an unanswered question. The rules below govern the existing additions and any later individual deepening.

**Targeted revision in place.** The earlier chapters' threads, history, Restoration connections, and verified quotations are solid, but they were written before the semi-academic standard (`STANDARDS.md` §2) and lean on Delitzsch. Later individual revisions answer what a reader still needs: textual variants (MT, LXX, 1QIsaᵃ, Book of Mormon readings), fairly presented scholarly debates, archaeology, and literary structure, where these help explain the passage.

Tried on chapters 6 and 7 (2026-10-06). The writers’ first drafts overreached: the reviewers cut about a third of chapter 6’s additions and made chapter 7’s three notes one. The rules that came of it:

- **The old add-only restriction is superseded** (author, 2026-10-11). Within an authorized revision, notes may be merged, moved, or rewritten to improve understanding under the current standard. Preserve useful supported explanations and distinct readings; keep the ledger and links in step. No broad revision pass is scheduled.
- **One note per unanswered question, and no quota.** One or two strong additions to a chapter are better than four; a chapter with no unanswered question gets none. A note that lists “three points” is collecting, not answering.
- **Look before writing.** Run `footnotes.mjs <n> --compare` and read the old notes on the verse. Add nothing the old notes, the Church’s footnotes, or *Scripture Helps* already say. Integrate supported additions with the existing explanation and make differing readings clear.
- **Rest the additions on the Church’s sources, BYU, Scripture Central, *Isaiah in the Book of Mormon*, and the primary texts**, not on more Delitzsch. The *Scripture Helps* endnotes are the best finder (they led to Hoskisson for chapter 6 and Combs for chapter 7); if a guessed URL for an article fails, search for its title. One outside article is the main idea of one note (`STANDARDS.md` §4 rule 11).
- **Keep the source’s strength of wording** (“seems to,” “more likely,” “no definitive conclusion can be reached”), and don’t round off its tally.
- **No closing line of the writer’s own.** Nearly every sentence cut in the trial was a tidy last line or a connection no source makes. A connection worth keeping goes in `THEME-CANDIDATES.md`, not in the chapter.
- **Where a scholar’s hypothesis touches a messianic verse, the note states the Church’s reading first** and gives the hypothesis as one.
- **Never “one study says” or “the Church’s study helps say”** (`STANDARDS.md` §3).
- **A list inside a note is numbered within the sentence**, “(1)…, (2)…,” not set out as a block list (author, 2026-10-06).
- **The Septuagint and the Great Isaiah Scroll were not readable** for chapters 6 and 7 (Bible Hub’s `/sep/` page came back garbled; Elpenor returned the wrong book; no source gives the scroll verse by verse). Don’t plan a note on them unless a readable source is found first.

A chapter cost about 290k tokens (writer 120k, checker 85k, reviewer 85k).


## Reducing the reliance on the Student Manual

(Author, 2026-10-06: the many references to the Student Manual are “one thing we wanted to get rid of.”) Chapters written before the limits of `STANDARDS.md` §1 lean on the *Old Testament Student Manual*: `check-content.mjs isaiah` lists the chapters where more than a third of the notes cite it, the notes that rest on it with nothing from beyond the Church's publications, and the places that name it in the text. For this purpose only, the add-only rule above is lifted: **an existing note that cites the manual may be reworded, but no note is removed and its point stays.**

- Where the manual relays another work (a commentary, a talk, a Bible Dictionary entry), read that work and cite it (`STANDARDS.md` §4 rule 6); the manual's citation then goes, with its ledger rows.
- Where the manual's own sentence is the note's support, look for the same point in the primary text (the Hebrew, another scripture), a BYU or Scripture Central article, *Isaiah in the Book of Mormon*, or the Church's other sources, and rest the note on that. Prefer these to Delitzsch; use him only where he is the work the manual quotes.
- Where the manual gives the Church's standard reading as such, the note may keep it and say so (the exception in §1).
- Where nothing but the manual can be read for the point, the note is left exactly as it is and listed for the author.
- If the better source says something different from what the note says, the note follows the source, and the difference is reported.
- A sentence that names the manual (“the manual says…”) is reworded (§3).
- **A Church footnote, a Topical Guide pointer, or *Scripture Helps* is not a replacement for the manual** (found in the pass of 2026-10-06, where the reviewers undid most such swaps): the reader has those beside the verse already (`STANDARDS.md` §1), and a cross-reference is not evidence for a reading. Nor is another Church manual. If those are the only alternatives, the note stays on the manual.
- **A swap never costs the note its point.** If the better source says less than the note needs (the key of David without the priesthood, 22:22), the note keeps the manual.
