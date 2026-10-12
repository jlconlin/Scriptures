# Old Testament guides: the plan

A project note (the build ignores it). It holds the author's decisions about guides for the Old Testament as a volume and the plan for writing them. When the work is done, what remains true moves to `STANDARDS.md` §8 and `DEVELOPMENT.md`, and this file is cut to the volume's standing decisions (`DECISIONS.md`, “Process notes are temporary”).

## State

Planned, nothing built. The author approved the plan and set its start after the Exodus theme pages are developed (2026-10-12: “Let's wait until the Exodus themes are developed, then we can work on this”). The code change and everything after it can run on Opus; Fable is wanted only for the outline of the women guide.

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

A change to how the site looks, so it goes on a branch, is shown in the preview artifact, and waits for the author's approval before `main` moves (`AUTHORING.md`, “Showing a change”). Books are discovered, never named, and the same holds here.

- **Content layout.** `content/volumes/<slug>/` becomes a directory: `volume.md` (the introduction, moved from `content/volumes/<slug>.md`; the build reads either until the five are moved), `guides/NN-slug.md`, `evidence/guides/NN-slug.yaml`, and project notes at the top (this file). Markdown at the top of the directory is ignored by the build, as in a book.
- **Discovery.** `src/lib/books.mjs` (or a `volumes.mjs` beside it) returns each volume as a page owner with `kind: 'volume'`, `slug`, `name`, `dir`, `hasGuides`, so every script that takes `<book>` accepts `old-testament` with no further change: `check-content`, `check-ledger`, `check-sources`, `codex-read`, `occurrences --site`, `status`, `ledger-context`.
- **Pages.** `renderGuide` and `renderGuidesIndex` take an owner (a book or a volume) in place of `book`, so a volume guide looks exactly like a book guide, at `/old-testament/guides/<slug>/`. `renderVolume` shows the volume's guide cards between the introduction and the list of books. The build writes the pages, the sitemap and the search entries (`b` carries the volume slug; the search filter lists the volume).
- **A book's Guides page lists its volume's guides below its own**, under a heading “Old Testament guides,” and a book with no guides of its own gets a Guides page when its volume has guides, so a Genesis reader finds the women guide from Genesis. The header's Guides link appears on every page of such a book and on the volume's pages (`layout.mjs`).
- **Links.** Chapters link to a guide section as they do now, with an explicit section id. `occurrences.mjs --site all` reads volume guides too, so a writer sees what the site already says.
- **Checks.** `check-content` holds a volume guide to the same rules as a book guide (a ledger, no announced sources, every cited key with a row under its section; no word cap on a guide). `status.mjs` prints the volume's guides under “The site.”

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

## Scripts to add or extend, so the agents spend fewer tokens

Each replaces something an agent now does by hand or by retyping.

1. **`source.mjs --append <dossier> --key <key>`** writes the paragraphs it found straight into the dossier as rows (key, URL, verbatim quote, where found), so the researcher never retypes a quote. Today the agent reads the script's output and emits it again, twice the tokens for every quote. The same flag serves theme research.
2. **`scripts/check-page.mjs <owner> <file name>`**, the page analogue of `check-chapter.mjs`: `check-content` for the page, `check-ledger` for its ledger, `check-sources` on its proposed entries, the build into a scratch directory, and a word count, in one command with one short result. The writer and the reviewer run one thing instead of four, and read one output.
3. **`scripts/search-lds.mjs "<words>"`**: one search across the sites the brief must read first (Scripture Central's archive, the Interpreter journal, the Religious Studies Center, BYU Studies), printing titles and URLs, as `knowhys.mjs` does for KnoWhys. It replaces several WebSearch calls per agent and keeps the search on the right sites. To try first: whether each site's own search answers a script; where one does not, the script falls back to a site-restricted WebSearch and says so.
4. **`occurrences.mjs --site all`** reads volume guides (part of the code change).
5. **`status.mjs`** lists the volume's guides (part of the code change).
6. **`.claude/workflows/write-guide.js`** (`args`: `owner`, `file`, `dossier`, `outline`, `writerModel`) runs the writing half: writer, `check-page`, reviewer, the writer's repairs, `check-page` again, then `codex-read` and an agent to apply its findings, and returns the reviewer's verdict. Research stays a single agent call, since the outline between the two halves is the session's (and, for the women guide, the author's).

Not worth a script: the outline, the back-link sentences (an agent writes a sentence that fits each note), and the author's reading.

## Order of work

1. **Now, on this branch:** the code change, the docs (`DEVELOPMENT.md`, `STANDARDS.md` §8, `AUTHORING.md` project files table), the agents' guide sections, scripts 1, 2, 4, 5 and 6; `preview-site.mjs` and the preview artifact for the author's approval; then fast-forward `main` only with the first guide (a feature with nothing in it changes nothing a visitor sees).
2. **The women guide:** research, the outline for the author, writing, review, Codex, the back-links from Genesis, Hosea and Ezekiel. Go live at the author's word.
3. **Psalms and Genesis book guides**, then the Ezekiel guide.
4. **Volume guides 2 and 3** (the timeline and the poetry), then the rest as books need them; each ends by trimming the book-guide sections it absorbs and adding the link sentences to Daniel's and Hosea's intros. Script 3 before the next book's brief.
