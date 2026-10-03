# Authoring guide and project status

Current work and how to work with the author. **The writing and sourcing standard for every book is in [`STANDARDS.md`](STANDARDS.md).** `CLAUDE.md` lists which file to read for which task.

## Status (2026-10-02)

- **Isaiah:** all 66 chapters written and audited. Remaining: the open questions (`content/isaiah/OPEN-QUESTIONS.md`) and deepening chapters 1–37 (`content/isaiah/BRIEF.md`).
- **Isaiah theme pages:** five chosen (`content/isaiah/THEME-CANDIDATES.md`). The arm of the Lord is live (2026-10-02), and the notes on 51:5, 52:10, 53:1 and 59:16 link to it. The other four (the new exodus and the highway, Zion and her husband, light, and the servants section of the Servant Songs page) are live too, with links from the chapter notes at their key verses; the author has not yet read these four.
- **Jeremiah:** all 52 chapters written, checked, and live (2026-10-02). The author has not yet read them; the checkers' judgment calls and unanswered reader questions are in `content/jeremiah/OPEN-QUESTIONS.md`, theme candidates in `content/jeremiah/THEME-CANDIDATES.md`. No Jeremiah guides yet.
- **Jeremiah theme pages:** five written, reviewed and committed (2026-10-02 and 10-03) but **not pushed**, because the author has not seen them: The Shepherds and the Branch, Scattered and Gathered, The Covenant Written in the Heart, The Cup of the Lord's Fury, To Root Out and to Plant (`content/jeremiah/themes/`). The last two use the author's rule of 2026-10-03 that a theme page may make connections of its own (`STANDARDS.md` §8). The header has no link to a book's themes when it has no guides (`OPEN-QUESTIONS.md`). `check-ledger.mjs` does not yet read `evidence/themes/`; the three ledgers were checked with a scratch copy of its comparison.
- **Site:** framework, guides, theme pages, About page, and book-neutral code done. Code notes are in `DEVELOPMENT.md`.

## Plan for the next book

Jeremiah was written with Sonnet writers and Opus checkers (one commit per chapter; `STANDARDS.md` §11). The checkers reopened nearly every ledger row, which is mechanical work a script now does (`scripts/check-ledger.mjs`). For the next book, test this arrangement on two pilot chapters and compare (author, 2026-10-02: “a good thing to test”):

1. **Opus writes** the chapter and its ledger (`chapter-writer`, with the model set to Opus).
2. **The script checks the ledger**: `node scripts/check-ledger.mjs <book> <n>`. Every quote confirmed on its page before anyone reads the chapter.
3. **A second Opus reviews** (`chapter-reviewer`): the chapter against the ledger and the standard, which is a shorter job once the quotes are proved.

**Result of the test (2026-10-02, Jeremiah 19 and 45 rewritten this way and compared with the Sonnet versions):** the Opus drafts answered more of a reader's questions (chapter 19: 13 notes against 8, adding the Potsherd Gate, “estranged this place,” Baal and Molech, the hissing, and the walk from Tophet to the temple court), with the same sourcing discipline; the script found every quote on its page; and the second Opus called both “a light edit” and used 75–90k tokens against about 120k when it also had to reopen every row. Cost: the Opus writer used 125–156k tokens against Sonnet's ~115k, so a chapter now spends about 215k Opus tokens instead of 120k. The author chose depth, so this is the arrangement for the next book; the Opus versions of 19 and 45 are the ones on the site.

Before that: the book's brief, with the author (`content/<book>/BRIEF.md`: divisions and intro, the author's questions, which sources are actually readable online, book-wide issues, guide and theme candidates, Restoration connections); then `book.yaml` and “Adding a new book” in `DEVELOPMENT.md`. Jeremiah's brief is the model, including its section “What a chapter is for.” The Workflow script used for Jeremiah's batches (writer → reviewer pipeline, ten chapters at a time) is not in the repository; it is described in `STANDARDS.md` §11 and easy to rebuild.

## Working with the author

- **Where changes go.** Commit chapter content, sources, and fixes directly to `main` and push. Changes to how the site *looks* (layout, widths, new interface features) go on a separate branch until the author has seen them and approved; then fast-forward `main`.
- **Showing a change.** Before a change is pushed, show it in the private claude.ai preview artifact (https://claude.ai/artifact/W1iHyLZVvWzuCeSvoDZCTS): build with `PREVIEW=1 npm run build` (so books still in preview are included), copy the whole built site from `dist/`, make every root-absolute link, asset path, CSS `url()`, and `search.json` URL relative, and republish it to the same artifact. The author reviews there and can leave comments on specific passages. Once pushed, changes are live at https://scriptures.conlin.io.
- **The author reads mostly on an iPad mini** (744px upright, 1133px sideways). Check layouts there as well as on a laptop and a phone.
- **Ask for focus questions**, one question at a time, before a chapter is written; build the chapter around them.
- **Judgment calls** go in the book's `content/<book>/OPEN-QUESTIONS.md` rather than being decided silently.
- The per-chapter workflow (writer agent, ledger, checks, review, one commit per chapter) is in `STANDARDS.md` §10–11; the theme-page workflow (research, outline, writing, review) is in §8.

## Project files

| File | Holds |
|---|---|
| `STANDARDS.md` | Audience, voice, sourcing rules, evidence ledger, chapter structure, research tools, checks, review process |
| `content/<book>/BRIEF.md` | Book-level decisions |
| `content/<book>/OPEN-QUESTIONS.md` | Judgment calls waiting for the author |
| `content/<book>/THEME-CANDIDATES.md` | Topics for future theme pages, and which were chosen |
| `DEVELOPMENT.md` | Hosting, site design, how books are built, adding a book |
| `IDEAS.md` | Ideas not yet planned |
| `DECISIONS.md` | Decisions that frame the site |
