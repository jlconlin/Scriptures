# Open questions for the author

Everything that waits for the author, for every book and for the site, in this one file (author, 2026-10-04: “I can't keep track of those that are in multiple places”). Nothing that needs the author is kept anywhere else.

- **Answer by number** (“G1: Context note. J4: leave it out.”), here, in a session, or in a comment on the preview.
- An item is deleted once it is answered and the answer is carried out; the decision is then recorded where it applies (`STANDARDS.md`, `AUTHORING.md`, or the book's brief).
- Only what needs the author belongs here. What the standard or a book's brief already settles is decided by whoever is writing and recorded in that book's `BRIEF.md` (“Decided while writing”), where the author can overturn it.
- “Recommend” is Claude's suggestion where the standard points one way. No recommendation means the choice is a matter of taste or doctrine.

## Waiting to be read

Not questions, but most of the questions below are easier after reading.

- **Genesis:** all 50 chapters, in preview only. Chapters 1–26 were written by Opus and 27–50 by Sonnet (see S2).
- **Jeremiah:** all 52 chapters and the five theme pages, live since 2026-10-02 and 03.
- **Isaiah:** four of the five theme pages (the new exodus and the highway; Zion and her husband; light; the servants section of the Servant Songs page), live.

## The site

- **S1. When does Genesis go live?** It is `status: preview` in `content/genesis/book.yaml`; removing that line and pushing makes it live.
- **S2. Opus or Sonnet as the writer?** Genesis 1–26 are Opus-written and 27–50 Sonnet-written, under the same brief and reviewers. If the two halves read the same to you, Sonnet writes from now on (the plan in `AUTHORING.md` already assumes it). If 1–26 are clearly better, say so.
- **S3. A header link to a book's theme pages when it has no guides.** Jeremiah has themes but no guides, so its header has no link to them; they are reached at `/jeremiah/themes/` and from chapter notes. Add the link? (A change to how the site looks.) Recommend: yes.
- **S4. The limits on a theme page's own connections.** Your rule of 2026-10-03 is in `STANDARDS.md` §8 with three limits added to your two: the connection rests on quoted words; the facts around it stay sourced; it is worded as a comparison and marked in the ledger. Is that what you meant by “relax a little,” or too tight? The last sections of Jeremiah's cup page and root-and-plant page show it in use.

## Genesis

- **G1. “The Angel which redeemed me” (48:16): a Witness of Christ note, or a Context note?** The note points the Angel to Christ by a chain: Hosea calls the one Jacob met “the Lord God of hosts” (Hosea 12:4–5); the Bible Dictionary says Jehovah is the premortal Christ; and the note says that Genesis does not say more about who the Angel is. No Church source found applies this verse to Christ directly, and President Joseph Fielding Smith thought the wrestler at Peniel “more than likely… a messenger.” It stands as a Witness of Christ note for now.
- **G2. Which theme pages, if any?** `content/genesis/THEME-CANDIDATES.md` opens with a short list of six: the covenant with Abraham; the younger chosen over the elder; Joseph sent ahead to preserve life; Judah; brothers at odds and reconciled; the God who sees, hears, and remembers. It also lists five connections no source makes, which only a theme page could make (Abraham on the altar beside Isaac on the altar is one).

## Jeremiah

- **J1. The five theme pages** (The Shepherds and the Branch; Scattered and Gathered; The Covenant Written in the Heart; The Cup of the Lord's Fury; To Root Out and to Plant). They went live before you read them. Keep, change, or drop each?
- **J2. The new covenant page, last section.** It follows the manuals and Joseph Smith's 1833 letter: the covenant was offered by Christ, rejected then, and is offered again in the Restoration. Is that the emphasis you want, or should the page stop at Hebrews and the Last Supper?

(Ten chapter-level items were settled on 2026-10-04; they are listed in `content/jeremiah/BRIEF.md`, “Decided while writing,” where you can overturn any of them.)

## Isaiah

- **I1. Deepen chapters 1–37?** They were written before the semi-academic standard, and `content/isaiah/BRIEF.md` has a plan to deepen them in place. It has not been started. Do it, and when?

## Work waiting, no decision needed

- **The preview lacks Genesis 39–50.** Publishing failed on 2026-10-04 because the artifact's host could not be reached. `node scripts/preview-site.mjs`, then republish.
- **Genesis 22, closing section:** Melvin J. Ballard's words are cited from the seminary manual that prints them; read and cite the original talk (“The Sacramental Covenant,” *New Era*, Jan. 1976).
- **The new review arrangement is untested** (Sonnet checker, then Opus reviewer; `AUTHORING.md`). Watch the first batch of the next book.
- **Isaiah's and Jeremiah's ledgers against the ledger script.** Both books were checked by agents reading the pages, before `scripts/check-ledger.mjs` existed. Run over the whole of each on 2026-10-04, the script confirms 3,336 rows of Jeremiah and cannot confirm 119 (64 quotes not found as written, 55 pages not fetched); it confirms 1,989 rows of Isaiah and cannot confirm 166 (153 not found as written, 13 not fetched). Genesis: all rows confirmed. The 14 looked at, in Jeremiah 13, are rows quoted in a form the script cannot read (raw Hebrew XML, lexicon entries with Hebrew, footnotes that sit in the page's embedded data), and the one checked by hand is on its page; the rest have not been looked at. A Sonnet pass should re-copy those quotes so the script confirms every row, and report any that are truly not on the page.
- **A leftover working copy** in `.claude/worktrees/` (from the “Show three more” branch, long merged) can be deleted.
