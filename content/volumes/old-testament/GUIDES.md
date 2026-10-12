# Old Testament guides: the plan

A project note (the build ignores it). It holds the author's decisions about guides for the Old Testament as a volume and the plan for writing them. When the work is done, what remains true moves to `STANDARDS.md` §8 and `DEVELOPMENT.md`, and this file is cut to the volume's standing decisions (`DECISIONS.md`, “Process notes are temporary”).

## State

The code, the scripts, the agents' guide sections and the workflow are built (2026-10-12, on the branch `claude/scripture-guides-women-ot-6ec842`; the author: “Yes go and start creating”) and are described in `DEVELOPMENT.md` (“Volume guides,” “A page in preview”) and `STANDARDS.md` §8 (“How a guide is written”). The author approved the look from screenshots of a sample page (2026-10-12: “Yes, I like the look”), and the work is on `main`, not pushed: with no guide written the live site is unchanged. No guide is written yet. Next is the women guide: the research dossier is `.cache/batch/old-testament/dossier-women.md` (a working file, not committed), then the outline for the author, saved as `.cache/batch/old-testament/outline-women.md`. Everything can run on Opus; Fable is wanted only for that outline.

## What the author decided (2026-10-12)

- **Guides belong to the volume when their content is true for more than one book.** The kingdoms and the exile, the geography, the law and the covenant, the temple, Hebrew poetry, how the prophets speak, and the household and marriage customs are the Old Testament's background, not a book's. A book's guides keep what is particular to the book (how to read Psalms, Ezekiel's temple visions) and link to the volume's guides instead of repeating them. When a volume guide is written, the sections of Isaiah's and Jeremiah's guides that cover the same ground (the two “World” guides whole, keys 2 to 5 and 8 of *How to Read Isaiah*, the “Places and peoples” of both glossaries) are cut to a paragraph that says what matters for that book and links to the volume guide. The author authorized changing live books (2026-10-12; `AUTHORING.md`, “Live books are open to change”).
- **Volume guides do not wait for the volume to be finished.** They describe the world, not the books, so they can be written now and linked from every book as it comes.
- **The first volume guide is on the women of the Old Testament** and the marriage customs they lived under. The author's wife reads the Old Testament's women as objects, and the site has nothing to answer that. The guide is sourced like any guide (`STANDARDS.md` §4 in full; a guide makes no connections of its own). It does not argue that the customs promoted women; it says what the customs did, where the law protected women, where the narrator takes the women's side, what the hard texts are, and what the Restoration teaches.
- **A book gets guides of its own only when it has two or more topics a book page cannot hold**, each needing sections, a table or a map. A single topic goes into the book page's intro, lengthened a little if it must, or into a volume guide. Daniel's and Hosea's intros already carry their setting in about 200 words each; when volume guide 2 exists, each gets one sentence linking to its period.
- **The author approves the outline of the women guide before it is written.** Other guides follow the usual course (outline by the coordinating session, the page shown in the preview).

## The guides

**Old Testament (volume), in the order to write them:**

1. **Women and marriage in the Old Testament.** The household (the father's house), betrothal and the bride-price, dowry, the marriage contract, levirate marriage and plural marriage; what the law protected (a wife's right to food, clothing and marital relations, limits on divorce, the captive bride, Zelophehad's daughters inheriting); where the text sides with the women (Sarah and Rebekah directing the covenant line, Hagar naming God, Tamar “more righteous than I,” Hannah, Abigail, Deborah, Huldah, Ruth, Esther, the wise women of Samuel); the hard texts named plainly (Lot's daughters, Dinah, Judges 19, the marriage metaphors of Hosea and Ezekiel 16 and 23); the Restoration's teaching on Eve and on plural marriage (Gospel Topics essay; D&C 132; Jacob 2). A table of the women and where to read them. Links from the chapters that touch it: Genesis 16, 19, 21, 24, 29, 30, 34, 38; Hosea 1–3; Ezekiel 16, 23; Psalms where relevant.
2. **Israel's story in one place.** The patriarchs to the return: judges, the united kingdom, the two kingdoms, Assyria, Babylon, Persia; one timeline with the books set on it. Future “World” guides shrink to what is particular to the book.
3. **Hebrew poetry and the prophets' speech.** Parallelism, acrostics, the lament, the oracle, the woe, the covenant lawsuit, the call narrative. Psalms needs it first.
4. **The law and the covenant.** What Torah is, the covenants from Noah to Sinai, sacrifice, the festivals, clean and unclean. Needed by Leviticus, Deuteronomy, Psalms and the prophets.
5. **The temple and worship.** Tabernacle, Solomon's temple, the priests and Levites, the psalms in worship, Ezekiel's temple.
6. **The land.** The regions, the roads, the neighbors, the places the books keep naming.
7. **How the Old Testament came to us.** The Hebrew Bible and its order, the King James Version, the Joseph Smith Translation, the Dead Sea Scrolls, the Church's edition and its study helps.

Guides 2 to 7 are written as a book needs them, not all at once. None is started without the author.

**Book guides still worth writing:**

- **Psalms** (the largest gap, 150 chapters with none): *How to read the Psalms* (the five books, the titles and their terms, the kinds of psalm, Davidic authorship) and *The Psalms in Israel's worship* (or fold that into volume guide 5). Christ in the Psalms is already carried by the theme pages.
- **Genesis**: *The patriarchs' world* (the household, inheritance, the birthright, nomadic life, Mesopotamia to Egypt) and *Genesis beside Moses and Abraham* (the JST and the Pearl of Great Price, chapter by chapter).
- **Ezekiel**: *Ezekiel's exile and his temple* (the deportations, the priestly background, the visions' architecture).
- **Daniel, Hosea, Joel, Malachi, Lamentations, Moses, Abraham, Mosiah**: none. The book page and the chapter settings carry the context, the volume guides carry the rest, and Abraham has its facsimile pages.

## The code

Built; `DEVELOPMENT.md` (“Volume guides,” “A page in preview,” “Guides index”) describes it. Two things were added to the plan: a page whose front matter says `status: preview` stays out of the live build, so a guide can be committed to `main` and read in the preview before it is live; and `preview-site.mjs --keep` keeps a live book's Guides page in the preview.

## The workflow, and what each model does

Guides reuse the theme pipeline (`STANDARDS.md` §8, “How a theme page is written”) with instructions for a guide: the three `theme-*` agents each get a section “When the page is a guide” (background rather than an arc; §4 in full, no connections of the page's own; not held to 1,000 words; the owner may be a volume) rather than three new agent files. The pipeline, and the model for each step:

| Step | Who | Model | Why |
|---|---|---|---|
| The code change, the docs, the agents' new sections | a session | Opus | Ordinary engineering against a documented codebase; Fable is not needed. |
| Research: the dossier of verbatim quotes | `theme-researcher` | Sonnet | Reading and recording, no judgment, as for themes. |
| Outline: what the guide says, section by section, and which source carries each claim | the coordinating session | Fable for the women guide; Opus for the rest | The women guide is the one page where framing can go wrong in a way the author's reader will feel. The standard already keeps this step with the most capable model and out of the agents' hands. |
| The author approves the outline (women guide only) | the author | | |
| Writing the page and its ledger from the outline and dossier | `theme-writer` | Sonnet | Adds nothing of its own, so the cheaper model is enough, as for themes. If the reviewer's list comes back long, switch the writer to Opus and compare with `batch-usage.cjs`. |
| Review: ledger check first, then the sources the script can't judge | `theme-reviewer` | Opus | Judgment, as now. |
| Language pass | Codex, then an Opus agent applies what holds up | as `codex-pass` | Unchanged. |
| Chapter back-links: one sentence in a note pointing to the guide section | a small agent | Sonnet | Mechanical, from a list `occurrences.mjs --site` makes. |
| The author reads the page in the preview | the author | | |

Haiku is not used: the author's test found its answers thin and review did not close the gap (`AUTHORING.md`).

## Scripts

Built and described in `DEVELOPMENT.md`: `source.mjs --append`, `scripts/check-page.mjs`, `occurrences.mjs --site all` and `status.mjs` for volumes, `theme-dossier.mjs` for a volume, and `.claude/workflows/write-guide.js`. Still to write, before the next book's brief: **`scripts/search-lds.mjs "<words>"`**, one search across Scripture Central's archive, the *Interpreter* journal, the Religious Studies Center and BYU Studies, printing titles and URLs as `knowhys.mjs` does for KnoWhys; to try first is whether each site's own search answers a script, and where one does not, the script falls back to a site-restricted web search and says so.

## Order of work

1. **Done on the branch (2026-10-12):** the code change, the docs, the agents' guide sections, scripts 1, 2, 4, 5 and 6. The first guide is shown in the preview artifact with `preview-site.mjs --keep genesis/guides/`, and the push waits for the author's word.
2. **The women guide:** research, the outline for the author, writing, review, Codex, the back-links from Genesis, Hosea and Ezekiel. Go live at the author's word.
3. **Psalms and Genesis book guides**, then the Ezekiel guide.
4. **Volume guides 2 and 3** (the timeline and the poetry), then the rest as books need them; each ends by trimming the book-guide sections it absorbs and adding the link sentences to Daniel's and Hosea's intros. Script 3 before the next book's brief.
