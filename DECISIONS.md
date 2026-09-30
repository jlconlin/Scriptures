# Decisions that frame the site

Choices that shape the whole site and that later work shouldn't quietly undo. Only framing decisions go here; the history of how work was done lives in git, not in files. Where a decision is spelled out elsewhere, this file points there.

- **Sourcing is part of writing (2026-09-30).** Content is written so that it needs no audit afterward: every factual claim rests on a source actually read. See `STANDARDS.md` §4.
- **Evidence ledgers are kept permanently (2026-09-30).** Each chapter's `content/<book>/evidence/NN.yaml` is the support for what the chapter currently says, not a record of how it was written. It stays in the repository and is updated when a note changes, and `check-content.mjs` relies on it. See `STANDARDS.md` §5.
- **No Wikipedia or other wikis as sources.** See `STANDARDS.md` §4.
- **No personal application (2026-09-30).** The “Liken it” sections were removed; that belongs in *Come, Follow Me*. See `STANDARDS.md` §1.
- **Every book shares one standard and one codebase.** Book-level choices go in `content/<book>/BRIEF.md`; the code has no book-specific assumptions (books are discovered from `content/*/book.yaml`; see `DEVELOPMENT.md`).
- **Content goes to `main`; changes to how the site looks wait for the author's approval** on a separate branch. See `AUTHORING.md`.
- **Process notes are temporary.** Status, plans, audit tracking, and open questions are kept while the work is under way and deleted when it is done.
