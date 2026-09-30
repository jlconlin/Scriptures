# Authoring guide and project status

Current work and how to work with the author. **The writing and sourcing standard for every book is in [`STANDARDS.md`](STANDARDS.md).** `CLAUDE.md` lists which file to read for which task.

## Status (2026-09-30)

- **Isaiah:** all 66 chapters written. Remaining: the audit (19 of 66 done; see `content/isaiah/AUDIT.md`), the open questions (`content/isaiah/OPEN-QUESTIONS.md`), and deepening chapters 1–37 (`content/isaiah/BRIEF.md`).
- **Jeremiah:** next book. `data/kjv/jeremiah.json` is fetched; its LDS-edition spellings still need checking. Next is the brief (step 3 below).
- **Site:** framework, guides, theme pages, About page, and book-neutral code done. Code notes are in `DEVELOPMENT.md`.

## Plan for new books, starting with Jeremiah

Goal: write content that needs no audit afterward, by making sourcing part of writing. Steps 1 (standard, agents, `check-content.mjs`) and 2 (book-neutral code) are done.

3. **Jeremiah brief, with the author.** `content/jeremiah/BRIEF.md`: divisions and intro, the author's questions, which sources for Jeremiah are actually readable online (researched, not assumed), book-wide issues to handle consistently, guide and theme candidates, Restoration connections. Then `book.yaml` and the rest of “Adding a new book” in `DEVELOPMENT.md`.
4. **Pilot, then batches.** Two chapters by chapter-writer agents; review (spot-check the ledger, run the checks, show the author in the preview); adjust the instructions; then continue in batches, one commit per chapter.

## Working with the author

- **Where changes go.** Commit chapter content, sources, and fixes directly to `main` and push. Changes to how the site *looks* (layout, widths, new interface features) go on a separate branch until the author has seen them and approved; then fast-forward `main`.
- **Showing a change.** Before a change is pushed, show it in the private claude.ai preview artifact (https://claude.ai/artifact/W1iHyLZVvWzuCeSvoDZCTS): copy the whole built site from `dist/`, make every root-absolute link, asset path, CSS `url()`, and `search.json` URL relative, and republish it to the same artifact. The author reviews there and can leave comments on specific passages. Once pushed, changes are live at https://scriptures.conlin.io.
- **The author reads mostly on an iPad mini** (744px upright, 1133px sideways). Check layouts there as well as on a laptop and a phone.
- **Ask for focus questions**, one question at a time, before a chapter is written; build the chapter around them.
- **Judgment calls** go in the book's `content/<book>/OPEN-QUESTIONS.md` rather than being decided silently.
- The per-chapter workflow (writer agent, ledger, checks, review, one commit per chapter) is in `STANDARDS.md` §10–11.

## Project files

| File | Holds |
|---|---|
| `STANDARDS.md` | Audience, voice, sourcing rules, evidence ledger, chapter structure, research tools, checks, review process |
| `content/<book>/BRIEF.md` | Book-level decisions |
| `content/<book>/OPEN-QUESTIONS.md` | Judgment calls waiting for the author |
| `content/isaiah/AUDIT.md` | Which Isaiah chapters have been audited |
| `content/<book>/THEME-CANDIDATES.md` | Topics for future theme pages |
| `DEVELOPMENT.md` | Hosting, site design, how books are built, adding a book |
| `IDEAS.md` | Ideas not yet planned |
| `DECISIONS.md` | Decisions that frame the site |
