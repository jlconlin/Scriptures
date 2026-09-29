# Authoring guide and project status

This file tells a person or an AI assistant how to continue writing the commentary for this site.

## Status (2026-09-29)

- Site framework, guides (content/isaiah/guides/), and About page: done.
- Chapter commentary: **Isaiah 1–52 done.** Chapters 38 onward are written at the semi-academic standard described below.
- Remaining: 53–66.
- **Plan (decided 2026-09-29):** write 53–66 one chapter at a time, all the way through, without stopping to revise. Record judgment calls and unverified claims under “Open questions for review” as you go. After 66, do a single revision pass: resolve the open questions, then deepen chapters 1–37 (see “Revision plan” below).
- Planned feature for later: **theme pages** covering topics that span many chapters. They differ from the existing guides (`content/isaiah/guides/`), which are general introductions to reading Isaiah. Don’t build them yet; add candidates to “Theme candidates” below while writing chapters.
- Not yet done: a README and `scripts/check-links.mjs` (referenced in package.json). The repo is at `git@github.com:jlconlin/Scriptures.git`.
- Side task for later: **an MCP server for the content corpus**, so readers can load the commentary into their own AI conversations. Suggested plan: (1) have `build.mjs` also emit a machine-readable `corpus.json` (KJV text, sections, notes, sources for every chapter) and an `llms.txt`, which works on any static host; (2) add a small MCP server over that corpus with tools such as `get_chapter`, `get_verse_commentary`, `search_notes`, and `list_sources`. It can run locally as an npm package over stdio, or remotely as a serverless function (for example a Cloudflare Worker at mcp.scriptures.conlin.io), depending on the host chosen.
- Hosting: the site will be served at https://scriptures.conlin.io, but **not** by GitHub Pages. The host has not been chosen yet. `npm run build` writes a plain static site to `dist/` that can be served from any static host or web server. Configure the server to serve `404.html` for missing paths (in nginx: `error_page 404 /404.html;`), because it redirects `/Isaiah`, `/isaiah/53`, and similar paths to their canonical URLs.

## Open questions for review

Judgment calls and unverified claims waiting for the author. Whoever writes a chapter adds its items here instead of deciding them silently; the author works through the list later. Delete an item once it is resolved.

**Isaiah 51**
- v. 19 (“these two sons”): the note says Latter-day Saint commentators often connect the two sons with the two witnesses of Rev. 11, and lists Ludlow and Nyman as sources. Check that those books actually make the connection.
- v. 11: the note attributes to O. H. Steck the view that chapter 35 is a bridge written in the style of chapters 40–55. Stated from memory; confirm.
- v. 2: removed an unconfirmed claim that the Great Isaiah Scroll has “and increased him.” Check the scroll if this detail matters.

**Isaiah 52**
- v. 15 / 3 Ne. 21:10: the note calls the Joseph Smith identification of the marred servant widespread but an interpretation, and gives Christ as the alternative. Decide whether that framing is right. Ludlow, Nyman, and Parry are listed as sources without saying what each argues; check them.
- v. 15 (“sprinkle” or “startle”): the note presents the grammatical objection to “sprinkle” plainly rather than defending the KJV. Decide whether the balance is right.
- v. 14: the attribution of the “I anointed” reading of 1QIsaᵃ to William Brownlee is from memory; confirm.
- v. 8: the claim that the English idiom “see eye to eye” comes from this verse is from memory; confirm against the OED.
- v. 13: the summary of Bauckham’s argument linking Isa. 6:1, 52:13, and John 12 is from memory; confirm.
- Scope: the fourth Servant Song (52:13–53:12) is split at the chapter break. Chapter 52 covers only the opening verses and leaves the servant’s identity to chapter 53. Decide whether that split works.

## Theme candidates

Topics that run across several chapters, collected for the future theme pages. Add to a line when a new chapter develops the theme; add a line for a new theme.

- **The arm of the Lord:** [[Isa. 40:10]], [[Isa. 51:5]], [[Isa. 51:9]], [[Isa. 52:10]], [[Isa. 53:1]]; [[3 Ne. 20:35]].
- **“Awake, awake”** (and doubled imperatives): [[Isa. 51:9]], [[Isa. 51:17]], [[Isa. 52:1–2]]; [[D&C 113:7–10]]; [[Moro. 10:31]].
- **The Servant Songs and the servant’s identity:** 42:1–9, 49:1–13, 50:4–11, 52:13–53:12; see the setting of chapter 42.
- **The new exodus:** 40:3–5, 43:16–21, 48:20–21, 51:9–11, 52:11–12.
- **“High and lifted up”:** 2:12–17, 6:1, 52:13, 57:15; John 12:32–41.
- **The cup of wrath:** 51:17–23; Jer. 25:15–29; Matt. 26:39; D&C 19:18.
- **Zion as a woman** (bereaved mother, divorced wife, captive daughter): 49:14–21, 50:1, 51:17–52:2, 54:1–8; contrast Babylon in chapter 47.
- **Watchmen:** 21:6–12, 52:8, 56:10, 62:6.
- **The herald of good news (*bāśar*):** 40:9, 41:27, 52:7, 61:1; Mosiah 15:13–18.
- **The Lord as comforter (*niḥam*):** 40:1, 49:13, 51:3, 51:12, 51:19, 52:9, 66:13.

## Workflow for each chapter

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

`chapter`, `title`, `tagline`, `when`, `setting` (historical context), `thread` (the argument that ties the chapter together), `sections` (each has `range`, `heading`, and `plain`, a plain-words paraphrase; the ranges must cover every verse exactly once), `notes`, `christ`, `liken`, `explore`, `parallels` (`ref`, `note`, and `primary: true` for Book of Mormon chapters that quote the whole chapter), and `sources` (keys from `content/sources.yaml`).

Each note has:
- `ref`: the verse.
- `phrase`: an **exact** substring of that verse. Use the LDS-edition spellings in `data/kjv/isaiah.json`. Phrases in the same verse must not overlap.
- `kind`: one of `words`, `history`, `symbol`, `christ`, `restoration`, `liken`.
- `title`.
- `body`: markdown.
- `sources`: optional.

Write scripture references as `[[2 Ne. 25:4]]`, `[[D&C 113:1–6]]`, or `[[Isa. 53:5]]` (Isaiah references become internal links). Use en dashes in ranges.

## Audience

The site is **semi-academic**. The target reader is academically trained, for example someone with a PhD in a technical field. They are intellectually curious, comfortable with complexity and with competing hypotheses, and expect claims to be documented. But they are not a specialist in biblical studies, Hebrew, or ancient Near Eastern history. Write for that reader:

- **Don’t oversimplify.** Engage real scholarly questions directly: textual variants (Masoretic Text, Septuagint, the Great Isaiah Scroll 1QIsaᵃ, Book of Mormon readings), dating and authorship debates, Near Eastern parallels and archaeology, translation choices, and literary structure. Name the positions fairly, including non-Latter-day Saint scholarship, and explain what is at stake. Then present the Latter-day Saint reading and its basis.
- **Explain the specialist tools.** Define technical terms the first time they appear (for example *qere/ketiv*, *Masoretic*, chiasmus, *prophetic perfect*). Transliterate Hebrew, and explain the Hebrew morphology when it matters for meaning.
- **Document without cluttering.** Support claims with sources, in each note’s `sources` list or in a brief inline attribution (“Oswalt argues…”, “Sennacherib’s annals claim…”). Keep the prose readable. Citations should support the message, not interrupt it. Say how certain a claim is: established fact, scholarly consensus, a plausible hypothesis, or devotional application.
- **Go for depth over breadth.** A few well-developed notes that make real connections, across the canon, across the Restoration scriptures, and across the book of Isaiah, are better than many shallow ones.
- Chapters 1–37 were written somewhat closer to a general audience. See the revision plan below.

## Revision plan for chapters 1–37

First finish 38–66 at the new standard. Then **deepen chapters 1–37 in place; don’t rewrite them.** Their threads, history, Restoration connections, and verified quotations are solid. For each chapter:

- Add 2–4 deeper notes: textual variants (MT, LXX, 1QIsaᵃ, Book of Mormon readings), fairly presented scholarly debates (for example, the date of chapters 24–27, whether chapters 13–14 postdate Isaiah, near and far fulfillments of 7:14), archaeology, and literary structure.
- Sharpen the `thread` where it is thin.
- Make sources explicit, and mark how certain each claim is (established fact, consensus, hypothesis, or devotional application).

Priority order: 1, 6, 7, 9, 11, 14, 24–27, 29; then the rest. The oracles in 15–23 are lowest priority.

## Voice and standards

- Write like a warm, knowledgeable religion teacher. Find the **thread** of each chapter instead of listing topics. Notice structure and wordplay. Explain the history behind the text, bring in Hebrew only when it pays off, and connect to Restoration scripture. Close each chapter with honest, probing application. Keep a light touch of humor where it fits.
- Go deeper than *Come, Follow Me*. Don't make the site a companion to it.
- Stay grounded in the scriptures and the teachings of latter-day prophets. When an interpretation is speculative, or faithful readers disagree, say so.
- **Verify everything.** Check every quotation of non-Isaiah scripture with `check-quotes.mjs`. Before describing a Book of Mormon variant, confirm it against the text; `data/bom/isaiah-parallels.json` holds the Book of Mormon verses that differ from the KJV. Add talks and books to `content/sources.yaml` only after confirming that the URL loads a page with the right title. Bible Dictionary URLs return 200 even for nonexistent entries, so check the page heading instead.
- If `churchofjesuschrist.org` is unreachable (some cloud sandboxes block it), `check-quotes.mjs` caches empty pages and reports every quotation as missing. Delete the empty files in `.cache/scripture/`, then fill the cache from the JSON files in `github.com/bcbooks/scriptures-json` (same book slugs; one file per chapter named `<vol>_<slug>_<chapter>.txt` holding the verse text). JST passages aren't in that data and have to be checked by hand.
- **Scripture Central** (scripturecentral.org, formerly Book of Mormon Central) is a recommended secondary source. It isn’t an official Church source, but it is scholarly and faithful to the doctrine. Use it for Latter-day Saint scholarship on Isaiah, such as its KnoWhy articles and its material on Isaiah in the Book of Mormon. Cite specific articles, not the site as a whole, and add each one to `content/sources.yaml` only after confirming that its URL loads the right title, as with any source. It is blocked in some cloud sandboxes; if so, add `scripturecentral.org` to the environment’s allowed domains, or leave a note under “Open questions for review” to add the citation later.
- For graphic passages (for example 36:12), describe rather than quote.

## Upcoming chapters: key connections

- 38: Hezekiah’s illness; 2 Kgs 20:1–11; “Set thine house in order”; the shadow on the stairs (compare Hel. 12:15); “undertake for me” (be my surety); figs as a poultice (compare D&C 42:43).
- 39: Merodach-baladan’s envoys; 2 Chr. 32:25–26, 31 (“God left him, to try him”); exile foretold (Dan. 1).
- 40–48 (division “comfort”): 1 Ne. 20 = Isa. 48; Cyrus 44:28–45:7; idol satire 44:9–20.
- 49–55 (“servant”): 1 Ne. 21; 2 Ne. 6–8; Mosiah 12, 14–15; 3 Ne. 16, 20–22; D&C 113:7–10 on 52:1–2.
- 56–66 (“zion”): Luke 4:16–21 on 61:1–2; D&C 138:42; D&C 133:46–53 on 63:1–9 (also D&C 88:106); D&C 101:30–31 on 65:20; D&C 133:40–45 on 64:1–4.
