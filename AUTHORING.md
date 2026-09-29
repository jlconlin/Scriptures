# Authoring guide and project status

This file tells a person or an AI assistant how to continue writing the commentary for this site.

## Status (2026-09-29)

- Site framework, guides (content/isaiah/guides/), and About page: done.
- Chapter commentary: **Isaiah 1–37 done.** Isaiah 38 is started: `content/isaiah/chapters/38.yaml` has `setting` and `thread` but no `sections`, `notes`, `christ`, `liken`, `explore`, `parallels`, or `sources` yet.
- Remaining: finish 38, then 39–66.
- Not yet done: a README and `scripts/check-links.mjs` (referenced in package.json). The repo is at `git@github.com:jlconlin/Scriptures.git`.
- Hosting: the site will be served at https://scriptures.conlin.io, but **not** by GitHub Pages. The host has not been chosen yet. `npm run build` writes a plain static site to `dist/` that can be served from any static host or web server. Configure the server to serve `404.html` for missing paths (in nginx: `error_page 404 /404.html;`), because it redirects `/Isaiah`, `/isaiah/53`, and similar paths to their canonical URLs.

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
- For graphic passages (for example 36:12), describe rather than quote.

## Upcoming chapters: key connections

- 38: Hezekiah’s illness; 2 Kgs 20:1–11; “Set thine house in order”; the shadow on the stairs (compare Hel. 12:15); “undertake for me” (be my surety); figs as a poultice (compare D&C 42:43).
- 39: Merodach-baladan’s envoys; 2 Chr. 32:25–26, 31 (“God left him, to try him”); exile foretold (Dan. 1).
- 40–48 (division “comfort”): 1 Ne. 20 = Isa. 48; Cyrus 44:28–45:7; idol satire 44:9–20.
- 49–55 (“servant”): 1 Ne. 21; 2 Ne. 6–8; Mosiah 12, 14–15; 3 Ne. 16, 20–22; D&C 113:7–10 on 52:1–2.
- 56–66 (“zion”): Luke 4:16–21 on 61:1–2; D&C 138:42; D&C 133:46–53 on 63:1–9 (also D&C 88:106); D&C 101:30–31 on 65:20; D&C 133:40–45 on 64:1–4.
