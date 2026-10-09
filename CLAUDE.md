# Line upon Line

A Latter-day Saint scripture study site (https://scriptures.conlin.io): scripture text with sourced commentary, one book at a time. `node scripts/status.mjs` prints where every book stands; a book’s own decisions are in `content/<book>/BRIEF.md` and its history in `git log -- content/<book>`.

Always read `AUTHORING.md` (how a book is written, working with the author). Then read only what the task needs:

| Task | Read |
|---|---|
| Writing, auditing, or reviewing commentary | `STANDARDS.md` and `content/<book>/BRIEF.md` |
| Resolving the author's open questions, or adding one | `OPEN-QUESTIONS.md` (one file for every book and the site) |
| Writing a theme page, or a chapter that touches a theme | `content/<book>/THEME-CANDIDATES.md` |
| Changing code, styles, templates, or scripts; adding a book | `DEVELOPMENT.md` |
| Building and previewing | `README.md` |

Read `DECISIONS.md` before changing anything that affects the whole site. `IDEAS.md` is needed only when asked about.
