# Isaiah brief

Book-level decisions for Isaiah. The site-wide standard is in `STANDARDS.md`; this file records what is particular to Isaiah. Isaiah was written before the standard and before briefs existed, so this brief was assembled afterward from the project notes; it is shorter than a new book's brief will be.

Related files:
- `AUDIT.md`: which chapters have been audited against the sourcing standard.
- `OPEN-QUESTIONS.md`: judgment calls waiting for the author.
- `THEME-CANDIDATES.md`: topics for future theme pages.

## State of the book

All 66 chapters are written. Chapters 38–66 were written at the semi-academic standard in `STANDARDS.md`; chapters 1–37 were written somewhat closer to a general audience. The remaining work is the audit (`AUDIT.md`), resolving `OPEN-QUESTIONS.md`, and the revision plan below.

## Book-wide conventions

- **Servant Songs.** Cite the full passages: 42:1–9, 49:1–13, 50:4–11, 52:13–53:12, so readers don’t miss the verses that answer each song. No separate “core vs. extended” ranges.
- **Theme pages.** `content/isaiah/themes/`, published at `/isaiah/themes/<file name>/` with an index at `/isaiah/themes/` and cards on the Guides page (`/isaiah/guides/`). Done: **The Servant Songs**. When a chapter touches a theme that has a page, link to it instead of re-explaining the theme. Candidates are in `THEME-CANDIDATES.md`.

## Sources particular to Isaiah

- Delitzsch's commentary (in Keil and Delitzsch; readable on Bible Hub at `biblehub.com/commentaries/kad/isaiah/<c>.htm`) is the fullest commentary readable online. Use it to answer a question the chapter already asks, not as a source of material; where a point rests on him alone, present it as his reading.
- For the Qumran readings and the Septuagint, Hopkin (`hopkin-abinadi-isaiah`, RSC) were readable for chapters 52–53; the Israel Museum's Digital Dead Sea Scrolls site loads but doesn't show readings verse by verse.
- *Isaiah in the Book of Mormon* (Parry and Welch, eds., FARMS 1998; `isaiah-in-bom`) is the main Latter-day Saint scholarly work on the Isaiah chapters, and the whole book is readable: `node scripts/pdf-text.mjs https://storage.googleapis.com/scripturecentral-prod-strapi-uploads/ry_and_welch_isaiah_in_the_book_of_mormon_1998_184195e137/ry_and_welch_isaiah_in_the_book_of_mormon_1998_184195e137.pdf <first> <last>` (561 pages; cite page numbers in the ledger). Earlier audits dropped it as “image-only” for lack of a PDF tool; it isn't.
- Not readable from the sandbox: Ludlow's and Nyman's Isaiah commentaries (archive.org 401 or not found), Nilsen (encrypted PDF), Britannica (403), the British Museum (403).
- The standard modern commentaries (Oswalt, Blenkinsopp, Childs, Shalom Paul, Westermann, Williamson, Parry) are not readable online; see `STANDARDS.md` rule 8.
- Book of Mormon comparison data: `data/bom/isaiah-parallels.json` (built by `scripts/fetch-bom-parallels.mjs`, which is Isaiah-specific).

## Revision plan for chapters 1–37

**Deepen chapters 1–37 in place; don’t rewrite them.** Their threads, history, Restoration connections, and verified quotations are solid. For each chapter:

- Add 2–4 deeper notes: textual variants (MT, LXX, 1QIsaᵃ, Book of Mormon readings), fairly presented scholarly debates (for example, the date of chapters 24–27, whether chapters 13–14 postdate Isaiah, near and far fulfillments of 7:14), archaeology, and literary structure.
- Sharpen the `thread` where it is thin.
- Make sources explicit, and mark how certain each claim is (established fact, consensus, hypothesis, or devotional application).

Priority order: 1, 6, 7, 9, 11, 14, 24–27, 29; then the rest. The oracles in 15–23 are lowest priority.

In deepening them, stronger notes should replace weaker ones as often as they add new ones. How this plan fits with the audit (audit first, or both in one pass per chapter) is still to be decided.
