# Authoring guide and project status

Current work and how to work with the author. **The writing and sourcing standard for every book is in [`STANDARDS.md`](STANDARDS.md).** `CLAUDE.md` lists which file to read for which task.

## Status (2026-10-02)

- **Isaiah:** all 66 chapters written and audited. Remaining: the open questions (`content/isaiah/OPEN-QUESTIONS.md`) and deepening chapters 1–37 (`content/isaiah/BRIEF.md`).
- **Isaiah theme pages:** five chosen (`content/isaiah/THEME-CANDIDATES.md`). The arm of the Lord is live (2026-10-02), and the notes on 51:5, 52:10, 53:1 and 59:16 link to it. The other four (the new exodus and the highway, Zion and her husband, light, and the servants section of the Servant Songs page) are live too, with links from the chapter notes at their key verses; the author has not yet read these four.
- **Jeremiah:** under way, in preview (`status: preview` in `content/jeremiah/book.yaml`). The text's spellings are checked against the Gospel Library edition. The brief (`content/jeremiah/BRIEF.md`) was drafted on 2026-10-02 by the coordinating session; the author confirmed its approach the same day (continue as with Isaiah, no focus questions). Chapters are written by `chapter-writer` (Sonnet), checked by `chapter-reviewer` (Opus), and committed one at a time.
- **Site:** framework, guides, theme pages, About page, and book-neutral code done. Code notes are in `DEVELOPMENT.md`.

## Plan for new books, starting with Jeremiah

Goal: write content that needs no audit afterward, by making sourcing part of writing. Steps 1 (standard, agents, `check-content.mjs`) and 2 (book-neutral code) are done.

3. **The book's brief, with the author.** `content/<book>/BRIEF.md`: divisions and intro, the author's questions, which sources for the book are actually readable online (researched, not assumed), book-wide issues to handle consistently, guide and theme candidates, Restoration connections. Then `book.yaml` and the rest of “Adding a new book” in `DEVELOPMENT.md`. (Done for Jeremiah, without the author; see Status.)
4. **Pilot, then batches.** Two chapters by chapter-writer agents, each checked by a chapter-reviewer agent; review (spot-check the ledger, run the checks, show the author in the preview); adjust the instructions; then continue in batches, one commit per chapter.

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
