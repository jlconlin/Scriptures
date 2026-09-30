# Isaiah audit

Isaiah was written before the sourcing standard in `STANDARDS.md` existed, so every chapter needs an audit: every claim checked against a source actually read, unread works dropped from `sources`, and unsourced claims reworded or cut. Chapters for later books are written to the standard from the start and shouldn't need one.

Audit a chapter with the `chapter-auditor` agent (`.claude/agents/chapter-auditor.md`). When its work is committed, update the table below in the same commit, and move its judgment calls to `OPEN-QUESTIONS.md`.

**When every chapter is audited, the history section at the bottom can be deleted** (see `HISTORY.md` on when history is removed).

## Status

- **Audited:** 1, 40, 41, 42, 43, 44, 56–66 (17 chapters).
- **Not yet audited:** 2–39, 45–55 (49 chapters).
- **No chapter has an evidence ledger yet.** All the audits so far were done before the ledger existed (`content/isaiah/evidence/` is empty), so `check-content.mjs` can't verify them the way it verifies a chapter with a ledger. Decide whether the audited chapters get a ledger after the fact (see `OPEN-QUESTIONS.md`).

| Chapters | Audited | Ledger | Notes |
|---|---|---|---|
| 1 | 2026-09-30 | no | commit a5a2785 |
| 2–39 | | | |
| 40 | 2026-09-30 | no | commits 2787960, e81634b (Wikipedia citations replaced) |
| 41 | 2026-09-30 | no | commit 37a1699 |
| 42 | 2026-09-30 | no | commit d39e3ea |
| 43 | 2026-09-30 | no | commit 7c65c61 |
| 44 | 2026-09-30 | no | commit 3cb8642 |
| 45–55 | | | 51–54 have claims “from memory” in `OPEN-QUESTIONS.md` |
| 56–66 | 2026-09-29 | no | one pass over all eleven (see history) |

Things every remaining audit should also do (from earlier passes):
- Drop modern commentaries that weren't actually read. Chapters 40–55 and the guides still list several (Oswalt, Paul, Blenkinsopp, Childs, Tov, HALOT).
- Reword notes that name scholars in running text (“Oswalt argues”, “Shalom Paul notes”) so the note’s `sources` carries the attribution; for example 38, 48, 49.
- *Isaiah in the Book of Mormon* (FARMS 1998), cited throughout 40–55 as `isaiah-in-bom`, can be read chapter by chapter on the Scripture Central archive (archive.bookofmormoncentral.org); use it to check those citations.

## History

Kept until the audit is finished.

**Audit of 1 and 40–44 (2026-09-30).** Done by Sonnet audit agents; the commit messages list the sources used and what was cut. Their judgment calls are in `OPEN-QUESTIONS.md`.

**Audit of 56–66 (2026-09-29).**
Every claim in chapters 56–66 was checked against a source actually consulted, and every note’s `sources` now lists only works that were read. Claims that could not be sourced were cut. Sources used: the Masoretic text and BDB (both through Sefaria), Delitzsch’s commentary (on Bible Hub), Gesenius’ grammar (Wikisource), the Septuagint (Rahlfs with Brenton), the Greek NT, the Talmud (Sefaria), the Targum (Pauli’s 1871 translation), NRSVUE and NIV, the Jewish and Catholic Encyclopedias, Britannica, Southwood (2022), Pike (BYU RSC, 2019), the Bible Dictionary and its chronology, the Joseph Smith Papers, Church History Topics, and the Scripture Central KnoWhys, talks, and hymn already listed.
- Modern commentaries (Oswalt, Paul, Blenkinsopp, Childs, Tov, HALOT) are not freely available and were removed from 56–66. If you have them, they could restore depth in places where the older sources were thin.
- S. Kent Brown, *The Testimony of Luke* (Scripture Central lists it as 2014) could not be read, so the AD 26–27 Jubilee claim at 61:1 was cut; 11QMelchizedek was replaced by 4Q521, which Pike discusses. Leith (*Oxford History of the Biblical World*) was likewise dropped from 58:13.

**Scripture Central pass on 1–52 (2026-09-29).** Not an audit, but it touched sourcing.
Every KnoWhy (all 874, through the API) was searched for citations of each chapter and of its Book of Mormon parallels, and used only where it answered a question the chapter raised or corrected it. Where a KnoWhy rested on another work, that work was read and cited too; where it couldn’t be read, the claim was left out. Chapters changed: 1, 2, 3, 5 (with 9:12, 65:2, and the glossary), 6, 9, 11, 13, 14, 19, 22, 26, 27, 29, 30, 31, 35, 40, 45, 48, 51, 52. Nothing useful was found for the others. Underlying works now cited: Calabro and Chadwick (*Ascending the Mountain of the Lord*, RSC), Gee and Roper (RSC), Gee (*Religious Educator* 2015), Bowen (*Interpreter* 2018), Welch and Pike (*Isaiah in the Book of Mormon*, FARMS 1998, on the Scripture Central archive), Strathearn and Moody (JBMS 2009, abstract only), Nilsen (JHS 2013), Luckenbill’s *Annals of Sennacherib*, Pauli’s Targum (archive.org scan), Herodotus (Rawlinson), Church History Topics, and a 1971 conference talk.
- 9:2: the John 7:52 and 8:12 connection comes from KnoWhy #869, which follows Riley (2021); Riley wasn’t available, so only the KnoWhy is cited.
- Left out because the underlying work couldn’t be read or confirmed: winged-serpent seals from Judah (Gee 2021; for 6:2 and 14:29), Esarhaddon’s winged snakes (30:6), the Arad standing stones (19:19), 4Q500 on the vineyard (5:2), and the JST’s “re-em” at 34:7.
