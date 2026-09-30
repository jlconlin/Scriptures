# Authoring guide and project status

This file holds the workflow, status, open questions, and Isaiah-specific history. **The writing and sourcing standard for every book is in [`STANDARDS.md`](STANDARDS.md)**; read it first. Each book's decisions go in `content/<book>/BRIEF.md`.

## Status (2026-09-30)

- Site framework, guides (content/isaiah/guides/), and About page: done.
- Chapter commentary: **all 66 chapters of Isaiah done** (56–66 finished 2026-09-29). Chapters 38 onward are written at the semi-academic standard in `STANDARDS.md`.
- Design pass (2026-09-30): site-wide note kinds, the “Liken it” sections removed, the chapter guide moved to the About page, and the Isaiah page reordered (chapters first, guides on their own page).
- Next: the revision pass (see the plan below). Chapters 56–66 have been audited so that every claim rests on a consulted, cited source (see “Audit of 56–66” below); 1–55 have not. Chapters 1–52 have had the Scripture Central pass that 53–66 got when they were written (see “Scripture Central pass on 1–52” below).
- **Plan (decided 2026-09-29):** write 53–66 one chapter at a time, all the way through, without stopping to revise. Record judgment calls and unverified claims under “Open questions for review” as you go. After 66, do a single revision pass: resolve the open questions, then deepen chapters 1–37 (see “Revision plan” below).
- **Theme pages** cover topics that span many chapters. Each is a Markdown file in `content/isaiah/themes/` (same format as the guides: YAML front matter with `title`, `blurb`, `icon`, `sources`, then prose) and is published at `/isaiah/themes/<file name>/`, with an index at `/isaiah/themes/` and cards on the Guides page (`/isaiah/guides/`). Give sections that chapters link to an explicit id (`<h2 id="song-2">…</h2>`). Done: **The Servant Songs**. When a chapter touches a theme that has a page, link to it instead of re-explaining the theme. Add future candidates to “Theme candidates” below.
- `scripts/check-content.mjs` (`npm run check`) checks sourcing: unknown keys and wiki URLs everywhere; for chapters with an evidence ledger, every note sourced and every cited key backed by a quoted ledger row. It is not part of `npm run build`, so unaudited chapters can't break the Cloudflare build. Not yet done: `scripts/check-links.mjs` (referenced in package.json). The repo is at `git@github.com:jlconlin/Scriptures.git`.
- Side task for later: **an MCP server for the content corpus**, so readers can load the commentary into their own AI conversations. Suggested plan: (1) have `build.mjs` also emit a machine-readable `corpus.json` (KJV text, sections, notes, sources for every chapter) and an `llms.txt`, which works on any static host; (2) add a small MCP server over that corpus with tools such as `get_chapter`, `get_verse_commentary`, `search_notes`, and `list_sources`. It can run locally as an npm package over stdio, or remotely as a serverless function (for example a Cloudflare Worker at mcp.scriptures.conlin.io), depending on the host chosen.
- **Plan for new books, starting with Jeremiah (decided 2026-09-30).** Goal: write content that needs no audit afterward, by making sourcing part of writing. Steps, in order:
  1. **Shared standard and tooling.** Split this file: a site-wide `STANDARDS.md` (voice, note kinds, sourcing rules, no Wikipedia, no personal application), each book's `BRIEF.md`, and this file trimmed to workflow and status. Add a project agent, `.claude/agents/chapter-writer.md` (runs on Sonnet), that researches before writing and saves an **evidence ledger** beside each chapter (`content/<book>/evidence/NN.yaml`: claim, source key, URL, supporting quote); a claim with no ledger row doesn't go in the chapter. Write `scripts/check-content.mjs` to fail the build when a note has no sources, a key is missing from `sources.yaml`, a cited work is on the not-readable list without a ledger quote, or a source URL is Wikipedia.
     - Done 2026-09-30: `STANDARDS.md` (with the ledger format), `.claude/agents/chapter-writer.md`, and `.claude/agents/chapter-auditor.md`; this file trimmed. `BRIEF.md` for each book comes in step 3.
  2. **Book-neutral code.** Remove the Isaiah assumptions in the build (content paths, Gospel Library URLs, KJV download, `check-quotes.mjs`, the BoM comparison data, sitemap).
     - Done 2026-09-30: books are discovered from `content/*/book.yaml` (see “Adding a new book” under Site design notes); Isaiah’s built output is byte-identical to before apart from the random home-page teasers. `data/kjv/jeremiah.json` is fetched; its LDS-edition spellings still need checking.
  3. **Jeremiah brief, with the author.** `content/jeremiah/BRIEF.md`: divisions and intro, the author's questions, which sources for Jeremiah are actually readable online (researched, not assumed), book-wide issues to handle consistently, guide and theme candidates, Restoration connections.
  4. **Pilot, then batches.** Two chapters by chapter-writer agents; review (spot-check the ledger, run the checks, show the author in the preview); adjust the instructions; then continue in batches, one commit per chapter.
- Hosting: the site is served at https://scriptures.conlin.io by Cloudflare, which rebuilds it from this repository whenever `main` is pushed; there is no GitHub deploy workflow. `npm run build` writes a plain static site to `dist/`. `wrangler.jsonc` tells Cloudflare to serve `dist/` and to answer missing paths with `404.html`, which redirects `/Isaiah`, `/isa/53`, and similar paths to their canonical URLs. Its `name` must match the Worker's name in Cloudflare.

## Working with the author

- **Where changes go.** Commit chapter content, sources, and fixes directly to `main` and push. Changes to how the site *looks* (layout, widths, new interface features) go on a separate branch until the author has seen them and approved; then fast-forward `main`.
- **Showing a change.** Before a change is pushed, show it in the private claude.ai preview artifact (https://claude.ai/artifact/W1iHyLZVvWzuCeSvoDZCTS): copy the whole built site from `dist/`, make every root-absolute link, asset path, CSS `url()`, and `search.json` URL relative, and republish it to the same artifact. The author reviews there and can leave comments on specific passages. Once pushed, changes are live at https://scriptures.conlin.io.
- **The author reads mostly on an iPad mini** (744px upright, 1133px sideways). Check layouts there as well as on a laptop and a phone.
- **Ask for focus questions**, one question at a time, before a chapter is written; build the chapter around them.
- **Open threads for decisions** go in “Open questions for review” below rather than being decided silently.
- Audience, voice, sourcing, the evidence ledger, research tools, and the review process: see `STANDARDS.md`.

## Open questions for review

Judgment calls and unverified claims waiting for the author. Whoever writes a chapter adds its items here instead of deciding them silently; the author works through the list later. Delete an item once it is resolved.

**Isaiah 51**
- v. 19 (“these two sons”): the note says Latter-day Saint commentators often connect the two sons with the two witnesses of Rev. 11, and lists Ludlow and Nyman as sources. Check that those books actually make the connection.
- v. 11: the note attributes to O. H. Steck the view that chapter 35 is a bridge written in the style of chapters 40–55. Stated from memory; confirm.
- v. 2: removed an unconfirmed claim that the Great Isaiah Scroll has “and increased him.” Check the scroll if this detail matters.

**Isaiah 52**
- Length: chapters 51 (about 5,800 words) and 52 (about 5,400 words, 15 notes) are denser than the chapter 50 standard. Trim both.
- v. 15 / 3 Ne. 21:10: the note calls the Joseph Smith identification of the marred servant widespread but an interpretation, and gives Christ as the alternative. Decide whether that framing is right. Ludlow, Nyman, and Parry are listed as sources without saying what each argues; check them.
- v. 15 (“sprinkle” or “startle”): the note presents the grammatical objection to “sprinkle” plainly rather than defending the KJV. Decide whether the balance is right.
- v. 14: the attribution of the “I anointed” reading of 1QIsaᵃ to William Brownlee is from memory; confirm.
- v. 8: the claim that the English idiom “see eye to eye” comes from this verse is from memory; confirm against the OED.
- v. 13: the summary of Bauckham’s argument linking Isa. 6:1, 52:13, and John 12 is from memory; confirm.
- Scope: the fourth Servant Song (52:13–53:12) is split at the chapter break. Chapter 52 covers only the opening verses and leaves the servant’s identity to chapter 53. Decide whether that split works.

**Isaiah 53**
- Setting: the Hezekiah theory (Margaret Barker, reported by Scripture Central KnoWhy #648) is mentioned in a single sentence as one theory among many. Keep or cut?
- v. 4: the argument that Alma 7:11 renders the Hebrew of 53:4 more literally than the KJV is Thomas Wayment’s, cited through KnoWhy #564. Wayment’s original article hasn’t been checked.
- v. 9: the reading of the Great Isaiah Scroll’s *bwmtw* as “burial mound,” and, in v. 11, the list of Qumran manuscripts that read “light” (1QIsaᵃ, 1QIsaᵇ, 4QIsaᵈ), are from memory; confirm.
- Setting: the attributions to Origen (*Against Celsus* 1.55) and Rashi are from memory; confirm.

**Across chapters**
- Trim chapter-level `sources` lists to what the chapter actually relies on; several list commentaries that no note draws on.
- Convert the five guides to numbered citations (`[@key]` after specific claims), as on the Servant Songs page.
- Chapter notes that name scholars in the text (for example “Oswalt argues”, “Shalom Paul notes”, “William Brownlee… proposed”) should be reworded so the note’s `sources` list carries the attribution.
- Servant Song boundaries: the site cites the full passages (42:1–9, 49:1–13, 50:4–11, 52:13–53:12) so readers don’t miss the verses that answer each song; the author found a separate “core vs. extended” column not worth its space. Check older chapters and guides for other ranges (42:1–4, 42:1–7, 49:1–6, and so on) and make them consistent.
- The chapter 53 `setting` is still about 340 words after moving the servant debate to the theme page; trim toward the 150–250 word guideline.

**Isaiah 54**
- v. 7: the claim that *šeṣep* (“a little wrath”) occurs nowhere else in the Bible, and v. 11–12: the gem identifications (sapphire as lapis lazuli, and so on), are from memory; confirm against a lexicon.
- v. 4: the Nephite text’s repeated line (“the reproach of thy youth”) is described as possibly emphasis or a copying slip. Worth checking whether the critical text of the Book of Mormon comments on it.

**Audit of 1 and 40–44 (2026-09-30)** — judgment calls from the Sonnet audit agents
- 1:7–9: now says the verses fit either the Syro-Ephraimite war or 701 BC (Delitzsch leaves it open). Commit to 701?
- 1:5: Delitzsch reads “why should ye be stricken” as “to what end?”, not “on what part of the body?”. Worth adding?
- 40: three Wikipedia-only claims were cut (Qumran’s use of 40:3; the scroll’s shorter v. 7; the scroll’s date and the *Messiah* order were re-sourced). Restore the first two if a real source turns up.
- 40, `when` (“6th century BC”) and 43, 44 (“in Babylon, 6th century BC”): kept as the conventional setting; no source read gives the date.
- 42:1: the comparison of Matt. 3:17 with Matt. 12:18 is now the chapter’s own reading of the two texts; no scholarly source.
- 43:1: Delitzsch reads “I have redeemed thee” as looking back to Egypt; the older “prophetic perfect” explanation was cut as unsourced.
- 43:27: “thy first father” now follows Delitzsch (Abraham), with Adam as others’ view; the old “most take it as Jacob” is gone.
- 41, 44: the Cyrus Cylinder is quoted from Rogers’s 1912 translation; the British Museum page blocks scripts. A modern translation would be better.
- 41, 44: Livius.org (Grayson’s Nabonidus Chronicle) and TheTorah.com (Gabbay on the *mīs pî* ritual) are cited. They are scholarly but not institutional; keep or replace?
- 41: several points rest on Delitzsch alone (the sense of *ṣedeq* in v. 2, the “former things”, the seven trees, the Cumae oracle); the notes present them as his reading. Delitzsch is named in running text in a few places (a 19th-century source, as in chapter 40).
- 44: the authorship debate is deliberately thin here and points to chapter 40’s setting.

**Audit of 56–66 (2026-09-29)**
Every claim in chapters 56–66 was checked against a source actually consulted, and every note’s `sources` now lists only works that were read. Claims that could not be sourced were cut. Sources used: the Masoretic text and BDB (both through Sefaria), Delitzsch’s commentary (on Bible Hub), Gesenius’ grammar (Wikisource), the Septuagint (Rahlfs with Brenton), the Greek NT, the Talmud (Sefaria), the Targum (Pauli’s 1871 translation), NRSVUE and NIV, the Jewish and Catholic Encyclopedias, Britannica, Southwood (2022), Pike (BYU RSC, 2019), the Bible Dictionary and its chronology, the Joseph Smith Papers, Church History Topics, and the Scripture Central KnoWhys, talks, and hymn already listed.
- Modern commentaries (Oswalt, Paul, Blenkinsopp, Childs, Tov, HALOT) are not freely available and were removed from 56–66. If you have them, they could restore depth in places where the older sources were thin.
- KnoWhy `pub` fields omit dates: the API’s `publicationDate` looks like a republication date for older articles (it gives 2024 for #81). Add original dates if they matter.
- S. Kent Brown, *The Testimony of Luke* (Scripture Central lists it as 2014) could not be read, so the AD 26–27 Jubilee claim at 61:1 was cut; 11QMelchizedek was replaced by 4Q521, which Pike discusses. Leith (*Oxford History of the Biblical World*) was likewise dropped from 58:13.
- Judgment calls still worth your review: 63:3 reads the winepress first as judgment, then as a Latter-day Saint application to Gethsemane; 64:6 treats “filthy rags” as a defiled people’s deeds rather than the worthlessness of good works; 61:6’s one sentence on priesthood follows the wording of Official Declaration 2; the unsourced air-travel application of 60:8 was removed.
- Chapters 40–55 (and the guides) still list modern commentaries that may not have been consulted, and the open questions above for 51–54 include claims “from memory.” The same audit should be done there.

**Scripture Central pass on 1–52 (2026-09-29)**
Every KnoWhy (all 874, through the API) was searched for citations of each chapter and of its Book of Mormon parallels, and used only where it answered a question the chapter raised or corrected it. Where a KnoWhy rested on another work, that work was read and cited too; where it couldn’t be read, the claim was left out. Chapters changed: 1, 2, 3, 5 (with 9:12, 65:2, and the glossary), 6, 9, 11, 13, 14, 19, 22, 26, 27, 29, 30, 31, 35, 40, 45, 48, 51, 52. Nothing useful was found for the others. Underlying works now cited: Calabro and Chadwick (*Ascending the Mountain of the Lord*, RSC), Gee and Roper (RSC), Gee (*Religious Educator* 2015), Bowen (*Interpreter* 2018), Welch and Pike (*Isaiah in the Book of Mormon*, FARMS 1998, on the Scripture Central archive), Strathearn and Moody (JBMS 2009, abstract only), Nilsen (JHS 2013), Luckenbill’s *Annals of Sennacherib*, Pauli’s Targum (archive.org scan), Herodotus (Rawlinson), Church History Topics, and a 1971 conference talk.
- Judgment calls worth your review: 5:25 now reads “his hand is stretched out still” as a threat, with the Book of Mormon’s merciful image as a different idiom (the arm “lengthened out,” “extended”), which reverses the earlier mercy reading in 5:25, 9:12, and the glossary; 13:20 adds the destruction of Babylon in 689 BC as a possible near fulfillment; 45:7 now presents the Zoroastrian background as a debate; 26:17–18 notes that the “pangs” and the “cords” of death sound alike, though BDB treats them as two words; 52:15 adds the Book of Mormon as a third reading of the marred servant.
- 9:2: the John 7:52 and 8:12 connection comes from KnoWhy #869, which follows Riley (2021); Riley wasn’t available, so only the KnoWhy is cited.
- Left out because the underlying work couldn’t be read or confirmed: winged-serpent seals from Judah (Gee 2021; for 6:2 and 14:29), Esarhaddon’s winged snakes (30:6), the Arad standing stones (19:19), 4Q500 on the vineyard (5:2), and the JST’s “re-em” at 34:7.
- *Isaiah in the Book of Mormon* (FARMS 1998), cited throughout 40–55 as `isaiah-in-bom`, can be read chapter by chapter on the Scripture Central archive (archive.bookofmormoncentral.org). The audit of 1–55 can use it to check those citations.
- On this machine, `www.sefaria.org` didn’t resolve from the shell. The Hebrew was checked on Bible Hub (interlinear and BDB), cited as `biblehub-interlinear` and `bdb`.
- Not done in this pass: the full audit of 1–55, and rewording notes that name scholars in the text (for example 38, 40, 41, 48, 49).

## Theme candidates

Topics that run across several chapters, collected for the future theme pages. Add to a line when a new chapter develops the theme; add a line for a new theme.

- **The arm of the Lord:** [[Isa. 40:10]], [[Isa. 51:5]], [[Isa. 51:9]], [[Isa. 52:10]], [[Isa. 53:1]], [[Isa. 59:16]], [[Isa. 63:5]]; [[3 Ne. 20:35]].
- **“Awake, awake”** (and doubled imperatives): [[Isa. 51:9]], [[Isa. 51:17]], [[Isa. 52:1–2]]; [[D&C 113:7–10]]; [[Moro. 10:31]].
- ~~The Servant Songs~~: done (`content/isaiah/themes/servant-songs.md`). Chapters 42, 49, 50, 52, 53 and the Christ guide link to it. Chapter 61 links to the page’s “A fifth song?” section (`#fifth-song`).
- **The new exodus:** 40:3–5, 43:16–21, 48:20–21, 51:9–11, 52:11–12.
- **“High and lifted up”:** 2:12–17, 6:1, 52:13, 57:15 (where the high God also dwells with the “crushed,” the root of “bruised” in 53:5); John 12:32–41.
- **The cup of wrath:** 51:17–23; Jer. 25:15–29; Matt. 26:39; D&C 19:18.
- **Zion as a woman** (bereaved mother, divorced wife, captive daughter, barren woman who becomes a mother): 49:14–21, 50:1, 51:17–52:2, 54:1–10; contrast Babylon in chapter 47. The Lord as husband and Redeemer (*gōʾēl*): 50:1, 54:5–8, 62:4–5.
- **From servant to servants:** “servant” is singular 20 times in chapters 41–53 and plural 11 times from 54:17 to the end (56:6, where foreigners are included; 63:17, 65:8–15, 66:14). Could become a section of the Servant Songs page.
- **Light rising on Zion:** 9:2, 42:6, 49:6, 58:8–10, 59:9, 60:1–3, 60:19–20; Rev. 21:23; D&C 115:5.
- **Watchmen:** 21:6–12, 52:8, 56:10, 62:6 (the “remembrancers” who give the Lord no rest; D&C 101:81).
- **Names given by the Lord:** 1:26, 60:14, 60:18, 62:2–4, 62:12, 65:15; Mosiah 5:7–12; Rev. 2:17.
- **The highway:** 11:16, 35:8–10, 40:3–5, 49:11, 57:14, 62:10.
- **The herald of good news (*bāśar*):** 40:9, 41:27, 52:7, 61:1; Mosiah 15:13–18.
- **Isaiah in Abinadi’s trial:** 52:7–10 and all of 53; [[Mosiah 12:20–24]], [[Mosiah 14–15]].
- **Exchange** (he bears ours, we receive his): 53:4–6, 53:11–12; compare 61:3 (“beauty for ashes”).
- **The Lord’s garments and ours:** 59:6 (webs that are not garments), 59:17 (the Lord’s armor), 61:3, 61:10 (garments of salvation), 63:1–3 (red garments); Eph. 6:14–17; D&C 27:15–18.
- **Jubilee and release** (Lev. 25:8–13): 58:6, 61:1–2 (“the acceptable year of the LORD”); Luke 4:18–19.
- **The word of God** that stands and does its work: 40:6–8 and 55:10–11 frame chapters 40–55; compare D&C 1:38.
- **The free meal:** 25:6–8, 55:1–2; Prov. 9:1–6; John 7:37; 2 Ne. 9:50–51; 2 Ne. 26:25.
- **The silence of God:** 42:14, 57:11, 62:1, 64:12, 65:6; D&C 121:1–7.
- **God as Father:** Deut. 32:6, 63:16, 64:8; Mosiah 5:7; Ether 3:14.
- **The Lord as comforter (*niḥam*):** 40:1, 49:13, 51:3, 51:12, 51:19, 52:9, 66:13.

## Site design notes

- **Margin notes (2026-09-29).** On screens 880px and wider (an iPad mini held sideways qualifies; held upright it doesn’t), a note opens in the right margin beside the phrase that opened it, so the text never moves and the reader keeps their place. Several open notes stack without overlapping, and a newly opened note slides up the margin if needed to stay on screen. Narrower screens keep the original behavior (the note opens beneath its verse). The layout is in `src/assets/site.css` (the `min-width: 880px` block; the notes column narrows with the window) and the positioning in `src/assets/site.js` (`layoutNotes`).
- **Related switch (2026-09-29).** A toolbar switch shows every note as a compact card (kind, title, and the note’s opening sentence, generated at build time by `teaser()` in `src/templates/chapter.mjs`). Cards sit in the margin on wide screens and under the verse on narrow ones; clicking a card or phrase expands that note and collapses the others. It is off for first-time visitors, and each reader’s choice is remembered. Because the card shows each note’s first sentence, open notes with a sentence that says what the note is about, not a hook like “This is the hardest line in the chapter.”
- **Section headings** (“Background”, “The thread through the chapter”, “In plain words”, and the rest) are defined once, in `SECTIONS` in `src/site.mjs`. Change one there and it changes on every chapter of every book and in the site’s own descriptions. Templates use `book.name`, never a hard-coded “Isaiah”.
- **Reading width:** one setting, `--read-w: 540px` in `site.css`, used by chapters, guides, and the About page (about 55 characters a line in chapters). The author reads mostly on an iPad mini, so check layouts at 744px (upright) and 1133px (sideways).
- **Books (book-neutral code).** The build treats every directory `content/<slug>/` that has a `book.yaml` and a `chapters/` directory as a book, and builds each under `/<slug>/`. `src/lib/books.mjs` does the discovery (the build and the scripts share it); `LIBRARY` in `src/site.mjs` is the list of books that templates read (header nav, 404 redirects, internal `[[…]]` links). Everything Isaiah-specific lives in `content/isaiah/book.yaml`. Scripts take the book as an optional first argument (`node scripts/show.mjs jeremiah 1`, `node scripts/check-quotes.mjs jeremiah 1`), defaulting to `isaiah`. `scripts/fix-yaml.mjs` with no arguments still touches Isaiah only; `npm run build` runs it with `--all`. For comparing two builds byte for byte, `BUILD_VERSION=x BUILD_SEED=1 node scripts/build.mjs` pins the `?v=` stamp and the home page's random teasers.
- **Adding a new book** (checklist; the author's brief for the book comes first, see “Plan for new books”):
  1. `node scripts/fetch-kjv.mjs Jeremiah` writes `data/kjv/jeremiah.json` (the source file name has no spaces, such as `1Samuel`; a second argument sets a different slug). Check its spellings against the Gospel Library edition and add any differences to `LDS_SPELLINGS` in that script.
  2. `content/<slug>/book.yaml`. Required: `name`, `slug` (the directory name), `order` (nav and home-page position; lowest first), `abbr` (the abbreviation `src/lib/refs.mjs` uses, such as `jer`; `[[Jer. 1:5]]` links to the book from then on), `gospelLibrary` (path under `…/study/scriptures/`, such as `ot/jer`), `eyebrow` (line above the title, such as “The Old Testament”), `heroQuote` (`text`, `cite`), `description` (meta description of the book page), `divisionsBlurb` (subtitle of the division map), `home` (`blurb` for the library card on the home page; `cta` and `guide: {label, slug}` for the hero buttons, used only for the first book), `intro`, `divisions` (each `key`, `range`, `name`, `blurb`, and a `color`), `beloved`, `coreSources`, and optionally `rangeSources` and `titles`. `content/isaiah/book.yaml` is the model.
  3. Division colors: each division gets `color` and, for dark mode, `darkColor` (defaults to `color`). The build appends them to `dist/assets/site.css` as `--div-<key>` variables; it warns when a division has neither a `color` nor a variable in `site.css`. Isaiah’s colors stay in `site.css` (moving them would change its output). The variables are global, so **give a new book’s division keys names that Isaiah doesn’t use** (`judah`, `nations`, `apocalypse`, `woes`, `hezekiah`, `comfort`, `servant`, `zion`).
  4. Chapters in `content/<slug>/chapters/NN.yaml`; guides and themes as Markdown in `guides/` and `themes/`. A chapter with no file gets a draft page from the KJV text.
  5. Book of Mormon comparison data is optional: `data/bom/<slug>-parallels.json`, same format as Isaiah’s (only Isaiah has one; `scripts/fetch-bom-parallels.mjs` is Isaiah-specific). Without it, chapter pages simply have no BoM panel.
  6. Still written by hand for now: the home page’s “coming someday” cards (`COMING_SOMEDAY` in `src/site.mjs`; remove an entry when its book goes live), and site-wide wording that names Isaiah (home page hero text, `SITE.description`, the 404 page’s Isa. 30:20 line, the search box’s example searches).
- **Highlighted phrases** are `<span role="button" tabindex="0">`, not `<button>`, so they wrap across lines like ordinary text; `site.js` gives them Enter and Space.

## Workflow for each chapter

The method, checks, and review steps are in `STANDARDS.md` (“Checks” and “Review process”). In short: ask the author for focus questions; a `chapter-writer` agent drafts the chapter with its evidence ledger (`content/<book>/evidence/NN.yaml`); the orchestrating session spot-checks the ledger and runs `build.mjs`, `check-quotes.mjs`, and `check-content.mjs`; the author reviews in the preview artifact; one commit per chapter. Existing chapters are audited with the `chapter-auditor` agent.

## Revision plan for chapters 1–37

First finish 38–66 at the new standard. Then **deepen chapters 1–37 in place; don’t rewrite them.** Their threads, history, Restoration connections, and verified quotations are solid. For each chapter:

- Add 2–4 deeper notes: textual variants (MT, LXX, 1QIsaᵃ, Book of Mormon readings), fairly presented scholarly debates (for example, the date of chapters 24–27, whether chapters 13–14 postdate Isaiah, near and far fulfillments of 7:14), archaeology, and literary structure.
- Sharpen the `thread` where it is thin.
- Make sources explicit, and mark how certain each claim is (established fact, consensus, hypothesis, or devotional application).

Priority order: 1, 6, 7, 9, 11, 14, 24–27, 29; then the rest. The oracles in 15–23 are lowest priority.

Chapters 1–37 were written somewhat closer to a general audience than the standard in `STANDARDS.md`; in deepening them, stronger notes should replace weaker ones as often as they add new ones.
