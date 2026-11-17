# Line upon Line

A Latter-day Saint scripture study site (https://scriptures.conlin.io): scripture text with sourced commentary, one book at a time. `node scripts/status.mjs` prints where every book stands; a book’s own decisions are in `content/<book>/BRIEF.md` and its history in `git log -- content/<book>`.

Always read `AUTHORING.md` (how a book is written, working with the author). Then read only what the task needs:

| Task | Read |
|---|---|
| Writing or reviewing commentary | `STANDARDS.md` and `content/<book>/BRIEF.md` |
| Running a batch of chapters, the second reader, or a book's illustration | `PROCESS.md` |
| Resolving the author's open questions, or adding one | `OPEN-QUESTIONS.md` (one file for every book and the site) |
| Writing a theme page, or a chapter that touches a theme | `PAGES.md` and `content/<book>/THEME-CANDIDATES.md` |
| Writing a guide, for a book or for a volume | `PAGES.md` and `content/volumes/<volume>/GUIDES.md` |
| Marking a theme page or guide read, or rewriting one that waits its turn | `OPEN-QUESTIONS.md` (“Work waiting its turn”) and `PAGES.md` (“Where a page stands”) |
| Changing code, styles, templates, or scripts; adding a book | `DEVELOPMENT.md` |
| Building and previewing | `README.md` |

Read `DECISIONS.md` before changing anything that affects the whole site. `IDEAS.md` is needed only when asked about.
