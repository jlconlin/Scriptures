# Authoring guide and project status

Current work and how to work with the author. **The writing and sourcing standard for every book is in [`STANDARDS.md`](STANDARDS.md).** `CLAUDE.md` lists which file to read for which task.

## Status (2026-10-04)

- **Isaiah:** all 66 chapters written and audited. Remaining: deepening chapters 1–37 (`content/isaiah/BRIEF.md`), which waits for the author (`OPEN-QUESTIONS.md`, I1).
- **Isaiah theme pages:** five chosen (`content/isaiah/THEME-CANDIDATES.md`). The arm of the Lord is live (2026-10-02), and the notes on 51:5, 52:10, 53:1 and 59:16 link to it. The other four (the new exodus and the highway, Zion and her husband, light, and the servants section of the Servant Songs page) are live too, with links from the chapter notes at their key verses; the author has not yet read these four.
- **Jeremiah:** all 52 chapters written, checked, and live (2026-10-02). The author has not yet read them; the checkers' judgment calls were settled on 2026-10-04 (`content/jeremiah/BRIEF.md`, “Decided while writing”), leaving two for the author in `OPEN-QUESTIONS.md` (J1, J2); the unanswered reader questions in `content/jeremiah/BRIEF.md`, and the theme candidates in `content/jeremiah/THEME-CANDIDATES.md`. No Jeremiah guides yet.
- **Jeremiah theme pages:** five written, reviewed, and **pushed live** on 2026-10-03 at the author's request, before the author had read them: The Shepherds and the Branch, Scattered and Gathered, The Covenant Written in the Heart, The Cup of the Lord's Fury, To Root Out and to Plant (`content/jeremiah/themes/`). The last two use the author's rule of 2026-10-03 that a theme page may make connections of its own (`STANDARDS.md` §8). The header has no link to a book's themes when it has no guides (`OPEN-QUESTIONS.md`, S3). `check-ledger.mjs` now reads `evidence/themes/` too (`node scripts/check-ledger.mjs jeremiah themes`): on 2026-10-04 all 132 rows of these five were confirmed. Isaiah's four theme ledgers have 45 rows confirmed and 3 that cite the ScholarsArchive copy of *Isaiah in the Book of Mormon* (blocked); their quotes are on the Scripture Central copy the chapters cite, so only the URL needs changing (not done: arm of the Lord, twice; Zion and her husband, once).
- **Jeremiah is finished as written** (author, 2026-10-03: “we're done with Jeremiah”). No deepening pass was wanted.
- **Genesis:** all 50 chapters written, reviewed, and committed (2026-10-03 and 04): 711 notes, every ledger quote confirmed on its page. **In preview, not live** (`status: preview` in `book.yaml`). **The claude.ai preview artifact has only chapters 1–38:** publishing 39–50 failed on 2026-10-04 because the artifact's host could not be reached; run `node scripts/preview-site.mjs` and republish to finish it. **The author has not read the book.** What waits for the author is in `OPEN-QUESTIONS.md`: one note (48:16), which theme pages if any (`content/genesis/THEME-CANDIDATES.md` has a short list of six), whether Opus or Sonnet writers are used from now on (chapters 1–26 are Opus-written, 27–50 Sonnet-written), and when the book goes live. What was decided without the author is in the brief (“Decided while writing”). The author's rules from this book: don't replicate the Gospel Library (`STANDARDS.md` §1; no JST or Moses comparison panel); where the Church's sources differ, the newest wins; look to the *Scripture Helps* endnotes for academic sources; decide what the standard decides and bring the author only what needs the author. The brief is `content/genesis/BRIEF.md`, with the Church's statements on the contested questions in `CHURCH-STATEMENTS.md`.
- **Texts checked (2026-10-04):** `scripts/check-kjv.mjs` compares a book's text with the Gospel Library edition. Genesis and Jeremiah agree with it in every verse; ten verses of Isaiah did not (Lord and LORD in eight, punctuation in two) and were corrected on the live site.
- **Home page (2026-10-03):** “Show three more,” a quiet link under the three sample notes, draws three others at random; live.
- **Student Manual limits (2026-10-03):** `STANDARDS.md` §1 now says the Student Manual is a starting point, not the spine: about a third of a chapter's notes at most, and a note that cites it should also rest on something from beyond the Church's own publications. `check-content.mjs` warns, never fails. Isaiah (13 chapters) and Jeremiah (48) draw warnings from before the rule; they are information, not a to-do list. The rule is for new writing, starting with the next book.
- **Site:** framework, guides, theme pages, About page, and book-neutral code done. Code notes are in `DEVELOPMENT.md`.

## Plan for the next book

Three agents write a chapter, and Opus is kept for the last step only (author, 2026-10-04: “We don't need Opus to make sure links exist and that kind of things. Opus may be helpful for reviewing text and making sure it reads right”):

1. **A Sonnet writer** researches and writes the chapter and its ledger (`chapter-writer`).
2. **The script checks the ledger** (`scripts/check-ledger.mjs`): every quote confirmed on its page.
3. **A Sonnet checker** reopens the sources, compares each claim with its page, tests the checkable rules, and writes its findings with the sources quoted (`chapter-checker`).
4. **An Opus reviewer** decides the findings and repairs the chapter, reading for sense and for the standard, without reopening the sources (`chapter-reviewer`).

Opus stays in that last step (author, 2026-10-04: “I don't want to go all the way to Sonnet. But it felt through Genesis that we were using Opus more than we needed to”). In Genesis Opus wrote 26 of the chapters and, as reviewer, reopened the sources of all 50; neither is its job now.

**This arrangement is new and untested.** It was set up after Genesis; no chapter has been through it. The thing to watch in the first chapters of the next book is whether the Sonnet checker reports the failures that Opus reviewers caught in Genesis by reading the sources themselves: a claim that says more than its page, a wrong word in the Hebrew, an outside commentary followed where the Church's own footnote says otherwise.

**How it got here.** Jeremiah: Sonnet writers, Opus reviewers that reopened nearly every row (about 120k Opus tokens a chapter). A test on Jeremiah 19 and 45 (2026-10-02) had Opus write as well: more notes (13 against 8 on chapter 19), the same sourcing discipline, and a lighter review; Claude recommended it, and wrote here that “the author chose depth,” which was wrong: the author has not compared the two. Genesis 1–26 were written that way, at 360–380k Opus tokens a chapter for the writer and 165–175k for the reviewer, about three times Jeremiah's cost and twice its time. Genesis 27–50 went back to Sonnet writers with Opus reviewers. The author will judge the difference between the two halves on reading; the Opus versions of Jeremiah 19 and 45 are the ones on the site.

Before that: the book's brief, with the author (`content/<book>/BRIEF.md`: divisions and intro, the author's questions, which sources are actually readable online, book-wide issues, guide and theme candidates, Restoration connections); then `book.yaml` and “Adding a new book” in `DEVELOPMENT.md`. Jeremiah's brief is the model, including its section “What a chapter is for.” The Workflow script for writing a book in batches (writer → reviewer pipeline, about twelve chapters at a time) is `.claude/workflows/write-chapters.js`, and the coordinator's steps around it are scripts too (`DEVELOPMENT.md`, “Writing a book in batches”).

## Working with the author

- **Where changes go.** Commit chapter content, sources, and fixes directly to `main` and push. Changes to how the site *looks* (layout, widths, new interface features) go on a separate branch until the author has seen them and approved; then fast-forward `main`.
- **Showing a change.** Before a change is pushed, show it in the private claude.ai preview artifact (https://claude.ai/artifact/W1iHyLZVvWzuCeSvoDZCTS): run `node scripts/preview-site.mjs`, which builds the site with books still in preview and makes every link relative, then republish `.cache/preview/dist` to the same artifact (`index.html` as the page, the files listed in `.cache/preview/files.json` beside it). The author reviews there and can leave comments on specific passages. Once pushed, changes are live at https://scriptures.conlin.io.
- **The author reads mostly on an iPad mini** (744px upright, 1133px sideways). Check layouts there as well as on a laptop and a phone.
- **Ask for focus questions**, one question at a time, before a chapter is written; build the chapter around them.
- **The author's study questions become commentary** (author, 2026-10-04). When the author asks about a verse while studying, answer from sources read in the session, then add the answer to that verse's note with ledger rows: deepen the existing note rather than restructure the chapter. First done for Isaiah 53:7.
- **One file of open questions.** Everything that waits for the author, for every book and the site, is in `OPEN-QUESTIONS.md` at the top of the repository, numbered so it can be answered by number (author, 2026-10-04: “I can't keep track of those that are in multiple places”). Don't start another list anywhere else. A judgment call the standard or the brief settles is decided and recorded in the book's brief (“Decided while writing”); only what needs the author goes in that file. Delete an item once its answer is carried out.
- **Offload to scripts what a script can do exactly** (author, 2026-10-04: “Anywhere we can write a script to offload AI use to a simple script is a good idea”). It covers theme pages as well as chapters. A step an agent repeats mechanically (fetching, searching, counting, comparing a quote with a page, listing what the site already says) is a reason to write a script before the next batch, not to tell the next agent to do it again by reading.
- The per-chapter workflow (writer agent, ledger, checks, review, one commit per chapter) is in `STANDARDS.md` §10–11; the theme-page workflow (research, outline, writing, review) is in §8.

## Project files

| File | Holds |
|---|---|
| `STANDARDS.md` | Audience, voice, sourcing rules, evidence ledger, chapter structure, research tools, checks, review process |
| `content/<book>/BRIEF.md` | Book-level decisions |
| `OPEN-QUESTIONS.md` | Everything waiting for the author, for every book and the site |
| `content/<book>/THEME-CANDIDATES.md` | Topics for future theme pages, and which were chosen |
| `DEVELOPMENT.md` | Hosting, site design, how books are built, adding a book |
| `IDEAS.md` | Ideas not yet planned |
| `DECISIONS.md` | Decisions that frame the site |
