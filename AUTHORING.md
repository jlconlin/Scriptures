# Authoring guide and project status

This file tells a person or an AI assistant how to continue writing the commentary for this site.

## Status (2026-09-30)

- Site framework, guides (content/isaiah/guides/), and About page: done.
- Chapter commentary: **all 66 chapters of Isaiah done** (56–66 finished 2026-09-29). Chapters 38 onward are written at the semi-academic standard described below.
- Design pass (2026-09-30): site-wide note kinds, the “Liken it” sections removed, the chapter guide moved to the About page, and the Isaiah page reordered (chapters first, guides on their own page).
- Next: the revision pass (see the plan below). Chapters 56–66 have been audited so that every claim rests on a consulted, cited source (see “Audit of 56–66” below); 1–55 have not. Chapters 1–52 have had the Scripture Central pass that 53–66 got when they were written (see “Scripture Central pass on 1–52” below).
- **Plan (decided 2026-09-29):** write 53–66 one chapter at a time, all the way through, without stopping to revise. Record judgment calls and unverified claims under “Open questions for review” as you go. After 66, do a single revision pass: resolve the open questions, then deepen chapters 1–37 (see “Revision plan” below).
- **Theme pages** cover topics that span many chapters. Each is a Markdown file in `content/isaiah/themes/` (same format as the guides: YAML front matter with `title`, `blurb`, `icon`, `sources`, then prose) and is published at `/isaiah/themes/<file name>/`, with an index at `/isaiah/themes/` and cards on the Guides page (`/isaiah/guides/`). Give sections that chapters link to an explicit id (`<h2 id="song-2">…</h2>`). Done: **The Servant Songs**. When a chapter touches a theme that has a page, link to it instead of re-explaining the theme. Add future candidates to “Theme candidates” below.
- Not yet done: `scripts/check-links.mjs` and `scripts/check-content.mjs` (both referenced in package.json). The repo is at `git@github.com:jlconlin/Scriptures.git`.
- Side task for later: **an MCP server for the content corpus**, so readers can load the commentary into their own AI conversations. Suggested plan: (1) have `build.mjs` also emit a machine-readable `corpus.json` (KJV text, sections, notes, sources for every chapter) and an `llms.txt`, which works on any static host; (2) add a small MCP server over that corpus with tools such as `get_chapter`, `get_verse_commentary`, `search_notes`, and `list_sources`. It can run locally as an npm package over stdio, or remotely as a serverless function (for example a Cloudflare Worker at mcp.scriptures.conlin.io), depending on the host chosen.
- Hosting: the site is served at https://scriptures.conlin.io by Cloudflare, which rebuilds it from this repository whenever `main` is pushed; there is no GitHub deploy workflow. `npm run build` writes a plain static site to `dist/`. `wrangler.jsonc` tells Cloudflare to serve `dist/` and to answer missing paths with `404.html`, which redirects `/Isaiah`, `/isa/53`, and similar paths to their canonical URLs. Its `name` must match the Worker's name in Cloudflare.

## Working with the author

- **Where changes go.** Commit chapter content, sources, and fixes directly to `main` and push. Changes to how the site *looks* (layout, widths, new interface features) go on a separate branch until the author has seen them and approved; then fast-forward `main`.
- **Showing a change.** Before a change is pushed, show it in the private claude.ai preview artifact (https://claude.ai/artifact/W1iHyLZVvWzuCeSvoDZCTS): copy the whole built site from `dist/`, make every root-absolute link, asset path, CSS `url()`, and `search.json` URL relative, and republish it to the same artifact. The author reviews there and can leave comments on specific passages. Once pushed, changes are live at https://scriptures.conlin.io.
- **The author reads mostly on an iPad mini** (744px upright, 1133px sideways). Check layouts there as well as on a laptop and a phone.
- **Ask for focus questions.** Before writing a chapter, it helps to ask whether the author has specific questions or interests for it; build the chapter around those.
- **Open threads for decisions** go in “Open questions for review” below rather than being decided silently.

## Research tools

- **Scripture Central** (on a local machine, `scripturecentral.org` may not resolve from the shell sandbox even though `admin.scripturecentral.org` does; confirm article pages in the built-in browser instead) has a public API that returns KnoWhy articles as JSON. For example, `https://admin.scripturecentral.org/api/knowhys?filters[body][$containsi]=Isaiah%2054&pagination[pageSize]=100&fields[0]=title&fields[1]=slug` finds every KnoWhy that mentions Isaiah 54 (also try `Nephi 22` and similar Book of Mormon parallels, and `filters[title][$containsi]=…`). Fetch one article’s full text with `filters[slug][$eq]=<slug>` (the `body` field is HTML). The public page is `https://scripturecentral.org/knowhy/<slug>`; confirm it loads with the right title before adding it to `content/sources.yaml` as `sc-knowhy-<number>`.
- **BYU**: the Religious Studies Center (rsc.byu.edu) and ScholarsArchive (scholarsarchive.byu.edu) are reachable from the cloud environment.
- **Scripture text** for checking quotations comes from churchofjesuschrist.org through `check-quotes.mjs` (run with `NODE_USE_ENV_PROXY=1` in the cloud).

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
- **Highlighted phrases** are `<span role="button" tabindex="0">`, not `<button>`, so they wrap across lines like ordinary text; `site.js` gives them Enter and Space.

## Workflow for each chapter

**Method: read, ask, then seek.** Start by reading the chapter itself and writing down the questions it raises (what does this word mean, who is speaking, why does the Book of Mormon read differently, what happened here, where else is this quoted). Only then go to sources, to answer those questions. Every note should answer a real question a careful reader would ask; if it doesn’t, cut it. This is what keeps the site a reading companion rather than a collection of everything the sources say. When the author sends questions about a chapter, build the chapter around them.


```sh
node scripts/show.mjs 38            # print the KJV text with verse numbers
# write content/isaiah/chapters/38.yaml (copy the structure of an existing chapter)
node scripts/fix-yaml.mjs           # quote YAML values that contain ": "
node scripts/build.mjs              # warns about phrases not found, overlaps, bad refs
node scripts/check-quotes.mjs 38    # verify quoted scripture against the cited chapter
npm run dev                         # preview at http://localhost:4321
```

Fix every warning before committing. Commit each chapter separately.

## Chapter file structure

`chapter`, `title`, `tagline`, `when`, `setting` (historical context), `thread` (the argument that ties the chapter together), `sections` (each has `range`, `heading`, and `plain`, a plain-words paraphrase; the ranges must cover every verse exactly once), `notes`, `christ`, `explore`, `parallels` (`ref`, `note`, and `primary: true` for Book of Mormon chapters that quote the whole chapter), and `sources` (keys from `content/sources.yaml`).

Each note has:
- `ref`: the verse.
- `phrase`: an **exact** substring of that verse. Use the LDS-edition spellings in `data/kjv/isaiah.json`. Phrases in the same verse must not overlap.
- `kind`: one of `words` (Language), `history` (Context), `symbol` (Imagery), `christ` (Witness of Christ), `scripture` (Related Scriptures), `prophets` (Latter-day Prophets), or `structure` (Literary Structure). The set is site-wide, for every book; labels live in `KINDS` in `src/site.mjs`. `bom` (BoM Comparison) is generated from `data/bom/`. A hand-written note may also use `bom` to explain why a Book of Mormon reading matters; it is shown inside that verse’s comparison panel rather than as a second marker, so its verse must have a comparison (the build warns if not). Its `phrase` is not highlighted.
  - Use `structure` only when the structure shows something about the message, such as a chiasm whose center is the main point. Saying a passage is poetry or a chiasm is not enough.
  - Personal application belongs in *Come, Follow Me*, not in notes.
- `title`.
- `body`: markdown.
- `sources`: optional.

Write scripture references as `[[2 Ne. 25:4]]`, `[[D&C 113:1–6]]`, or `[[Isa. 53:5]]` (Isaiah references become internal links). Use en dashes in ranges.

## Audience

The primary reader is the author, who reads mostly on an iPad mini. Write to the standard below, and favor what helps the author’s study (their questions, readability, depth) over things that matter only for a public site (search-engine polish, first-time-visitor defaults).


The site is **semi-academic**. The target reader is academically trained, for example someone with a PhD in a technical field. They are intellectually curious, comfortable with complexity and with competing hypotheses, and expect claims to be documented. But they are not a specialist in biblical studies, Hebrew, or ancient Near Eastern history. Write for that reader:

- **Don’t oversimplify.** Engage real scholarly questions directly: textual variants (Masoretic Text, Septuagint, the Great Isaiah Scroll 1QIsaᵃ, Book of Mormon readings), dating and authorship debates, Near Eastern parallels and archaeology, translation choices, and literary structure. Name the positions fairly, including non-Latter-day Saint scholarship, and explain what is at stake. Then present the Latter-day Saint reading and its basis.
- **Explain the specialist tools.** Define technical terms the first time they appear (for example *qere/ketiv*, *Masoretic*, chiasmus, *prophetic perfect*). Transliterate Hebrew, and explain the Hebrew morphology when it matters for meaning.
- **Document without cluttering, and keep attention on the message, not the scholar.** Don’t name modern scholars in running text (“Oswalt argues…”, “Duhm named…”); let the citation carry the attribution. In chapter notes, list the sources in the note’s `sources`. In guides and theme pages, put a numbered citation right after the claim: `[@key]` or `[@key, locator]` (keys from `content/sources.yaml`); it renders as a small superscript number linking to a numbered source list, and sources in the page’s `sources` that are never cited appear under “Further reading.” Ancient documents can be named when they are the evidence (“Sennacherib’s annals claim…”). Say how certain a claim is: established fact, scholarly consensus, a plausible hypothesis, or devotional application.
- **Keep `setting` short: about 150–250 words of background** (when, to whom, where the chapter sits in the book, how the Book of Mormon uses it). Debates about a particular verse belong in that verse’s note. Recurring topics such as the Servant Songs should be explained once, on a theme page, and linked, not re-explained in each chapter.
- **Be selective; don’t include everything you find.** The site should not feel busy. Aim for roughly the length of chapter 50 (about 3,500 words, 8–11 notes). Where several sources or cross-references make the same point, use the best one. Where two notes overlap, merge them or cut one. Good material that doesn’t serve the chapter’s thread can be left out. This applies to every chapter, including the revision of 1–37 (where deepening should replace weaker notes as often as it adds new ones), and to every resource: Scripture Central, BYU, the Church’s site, and the scholarly commentaries. Finding something is not a reason to include it.
- **Go for depth over breadth.** A few well-developed notes that make real connections, across the canon, across the Restoration scriptures, and across the book of Isaiah, are better than many shallow ones.
- Chapters 1–37 were written somewhat closer to a general audience. See the revision plan below.

## Revision plan for chapters 1–37

First finish 38–66 at the new standard. Then **deepen chapters 1–37 in place; don’t rewrite them.** Their threads, history, Restoration connections, and verified quotations are solid. For each chapter:

- Add 2–4 deeper notes: textual variants (MT, LXX, 1QIsaᵃ, Book of Mormon readings), fairly presented scholarly debates (for example, the date of chapters 24–27, whether chapters 13–14 postdate Isaiah, near and far fulfillments of 7:14), archaeology, and literary structure.
- Sharpen the `thread` where it is thin.
- Make sources explicit, and mark how certain each claim is (established fact, consensus, hypothesis, or devotional application).

Priority order: 1, 6, 7, 9, 11, 14, 24–27, 29; then the rest. The oracles in 15–23 are lowest priority.

## Voice and standards

- Write like a warm, knowledgeable religion teacher. Find the **thread** of each chapter instead of listing topics. Notice structure and wordplay. Explain the history behind the text, bring in Hebrew only when it pays off, and connect to Restoration scripture. Close each chapter by pointing to Christ and to what’s worth exploring next; personal application belongs in *Come, Follow Me*, not here. Keep a light touch of humor where it fits.
- Go deeper than *Come, Follow Me*. Don't make the site a companion to it.
- Stay grounded in the scriptures and the teachings of latter-day prophets. When an interpretation is speculative, or faithful readers disagree, say so.
- **Everything is referenced; nothing is made up.** Every factual claim (a Hebrew meaning, a textual variant, a date, a scholarly view, a historical detail) must come from a source you have actually consulted, and that source must be cited. List a work in `sources` only if you have checked that it supports what the note says; never attribute a claim to a commentary because it is the kind of thing that commentary would say. If a citation can’t be confirmed, don’t include it. If you cannot find and read a source for a claim, cut the claim. “From memory” is not a source, and an entry under “Open questions” is not a substitute for one. **Wikipedia is not a source** (the author, 2026-09-30): the site must not become a mini-Wikipedia. Use the primary source or a scholarly or institutional one (a museum’s own catalog page, the text itself, a lexicon); if only Wikipedia supports a claim, cut it.
- **Verify everything.** Check every quotation of non-Isaiah scripture with `check-quotes.mjs`. Before describing a Book of Mormon variant, confirm it against the text; `data/bom/isaiah-parallels.json` holds the Book of Mormon verses that differ from the KJV. Add talks and books to `content/sources.yaml` only after confirming that the URL loads a page with the right title. Bible Dictionary URLs return 200 even for nonexistent entries, so check the page heading instead.
- On your own computer, run the quote checker as plain `node scripts/check-quotes.mjs …`. In a cloud sandbox, run it as `NODE_USE_ENV_PROXY=1 node scripts/check-quotes.mjs …`. Node’s built-in `fetch` ignores the sandbox’s proxy unless that variable is set, and the Church site is then refused. The checker stops with an error if a chapter can’t be downloaded. The environment’s allowed domains must include `churchofjesuschrist.org` (they now do, along with `scripturecentral.org` and `byu.edu`).
- **The site is a focused companion, not a database or a replacement for other resources.** It gives one clear reading of each chapter. It does not try to gather everything written about a chapter or to cite every available source. Readers who want more can go to Scripture Central, the commentaries, and the Church’s materials; when one of those is especially good on a chapter, point to it once (for example in `explore`) rather than absorbing it. List in `sources` only what the chapter actually relies on.
- **Don’t let any single secondary source shape a chapter.** Scripture Central, a commentary, or a lexicon is one input among several. Start from the text and the scriptures that quote it; use a secondary source to check or deepen an idea, not to supply the chapter’s angle or a string of its notes. As a rule of thumb, no one outside source should be the main idea of more than one note in a chapter. When an idea does come from a source, cite it, put it in your own words, and don’t follow the source’s outline. If the idea reached you through a secondary source that got it from another work (a KnoWhy quoting a commentary, for example), cite that underlying work as well, after confirming its details.
- **Scripture Central** (scripturecentral.org, formerly Book of Mormon Central) is a recommended secondary source. It isn’t an official Church source, but it is scholarly and faithful to the doctrine. Use it for Latter-day Saint scholarship on Isaiah, such as its KnoWhy articles and its material on Isaiah in the Book of Mormon. Cite specific articles, not the site as a whole, and add each one to `content/sources.yaml` only after confirming that its URL loads the right title, as with any source. It is blocked in some cloud sandboxes; if so, add `scripturecentral.org` to the environment’s allowed domains, or leave a note under “Open questions for review” to add the citation later.
- For graphic passages (for example 36:12), describe rather than quote.
