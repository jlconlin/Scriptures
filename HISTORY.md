# Project history

Finished plans and past decisions, moved out of `AUTHORING.md` so it holds only current work. Git history has the detail. **What here can be deleted, and when, is still to be decided with the author**; until then, add finished items here rather than deleting them.

## Isaiah

- **Plan for 53–66 (decided 2026-09-29, finished 2026-09-29).** Write 53–66 one chapter at a time, all the way through, without stopping to revise. Record judgment calls and unverified claims under open questions as you go. After 66, do a single revision pass: resolve the open questions, then deepen chapters 1–37.
- **Design pass (2026-09-30).** Site-wide note kinds, the “Liken it” sections removed, the chapter guide moved to the About page, and the Isaiah page reordered (chapters first, guides on their own page).
- Margin notes and the Related switch were added on 2026-09-29.

## Plan for new books, steps 1–2 (decided and done 2026-09-30)

Goal: write content that needs no audit afterward, by making sourcing part of writing.

1. **Shared standard and tooling.** Split `AUTHORING.md`: a site-wide `STANDARDS.md` (voice, note kinds, sourcing rules, no Wikipedia, no personal application), each book's `BRIEF.md`, and `AUTHORING.md` trimmed to workflow and status. Add a project agent, `.claude/agents/chapter-writer.md` (runs on Sonnet), that researches before writing and saves an evidence ledger beside each chapter (`content/<book>/evidence/NN.yaml`); a claim with no ledger row doesn't go in the chapter. Write `scripts/check-content.mjs` to fail when a note has no sources, a key is missing from `sources.yaml`, a cited work is on the not-readable list without a ledger quote, or a source URL is Wikipedia.
   - Done: `STANDARDS.md` (with the ledger format), `.claude/agents/chapter-writer.md`, and `.claude/agents/chapter-auditor.md`.
2. **Book-neutral code.** Remove the Isaiah assumptions in the build (content paths, Gospel Library URLs, KJV download, `check-quotes.mjs`, the BoM comparison data, sitemap).
   - Done: books are discovered from `content/*/book.yaml` (see `DEVELOPMENT.md`); Isaiah’s built output is byte-identical to before apart from the random home-page teasers.

## Project notes reorganized (2026-09-30)

`AUTHORING.md` was split: Isaiah's open questions, audit tracking, theme candidates, and revision plan moved to `content/isaiah/`; code notes to `DEVELOPMENT.md`; the MCP idea to `IDEAS.md`; finished plans here. `CLAUDE.md` added as the index.
