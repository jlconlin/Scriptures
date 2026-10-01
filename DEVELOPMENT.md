# Development notes

How the site's code works: read this before changing the build, templates, styles, or scripts, or when adding a book. For building and previewing, see `README.md`.

## Hosting

The site is served at https://scriptures.conlin.io by Cloudflare, which rebuilds it from this repository whenever `main` is pushed; there is no GitHub deploy workflow. `npm run build` writes a plain static site to `dist/`. `wrangler.jsonc` tells Cloudflare to serve `dist/` and to answer missing paths with `404.html`, which redirects `/Isaiah`, `/isa/53`, and similar paths to their canonical URLs. Its `name` must match the Worker's name in Cloudflare. The repo is at `git@github.com:jlconlin/Scriptures.git`.

## Checks

`scripts/check-content.mjs` (`npm run check`) checks sourcing: unknown keys and wiki URLs everywhere; for chapters with an evidence ledger, every note sourced and every cited key backed by a quoted ledger row. It also warns about chapters well past the length guideline. It is not part of `npm run build`, so unaudited chapters can't break the Cloudflare build. `scripts/pdf-text.mjs` prints a PDF's text (pdfjs-dist; for research, since Python PDF libraries fail in the cloud sandbox). Not yet written: `scripts/check-links.mjs` (referenced by `npm run check:links` in `package.json`).

## Site design

- **Margin notes.** On screens 880px and wider (an iPad mini held sideways qualifies; held upright it doesn’t), a note opens in the right margin beside the phrase that opened it, so the text never moves and the reader keeps their place. Several open notes stack without overlapping, and a newly opened note slides up the margin if needed to stay on screen. Narrower screens keep the original behavior (the note opens beneath its verse). The layout is in `src/assets/site.css` (the `min-width: 880px` block; the notes column narrows with the window) and the positioning in `src/assets/site.js` (`layoutNotes`).
- **Related switch.** A toolbar switch shows every note as a compact card (kind, title, and the note’s opening sentence, generated at build time by `teaser()` in `src/templates/chapter.mjs`). Cards sit in the margin on wide screens and under the verse on narrow ones; clicking a card or phrase expands that note and collapses the others. It is off for first-time visitors, and each reader’s choice is remembered. Because the card shows each note’s first sentence, open notes with a sentence that says what the note is about, not a hook like “This is the hardest line in the chapter.”
- **Section headings** (“Background”, “The thread through the chapter”, “In plain words”, and the rest) are defined once, in `SECTIONS` in `src/site.mjs`. Change one there and it changes on every chapter of every book and in the site’s own descriptions. Templates use `book.name`, never a hard-coded “Isaiah”.
- **Reading width:** one setting, `--read-w: 540px` in `site.css`, used by chapters, guides, and the About page (about 55 characters a line in chapters). The author reads mostly on an iPad mini, so check layouts at 744px (upright) and 1133px (sideways).
- **Highlighted phrases** are `<span role="button" tabindex="0">`, not `<button>`, so they wrap across lines like ordinary text; `site.js` gives them Enter and Space.

## Books

The build treats every directory `content/<slug>/` that has a `book.yaml` and a `chapters/` directory as a book, and builds each under `/<slug>/`. `src/lib/books.mjs` does the discovery (the build and the scripts share it); `LIBRARY` in `src/site.mjs` is the list of books that templates read (header nav, 404 redirects, internal `[[…]]` links). Everything Isaiah-specific lives in `content/isaiah/book.yaml`. Scripts take the book as an optional first argument (`node scripts/show.mjs jeremiah 1`, `node scripts/check-quotes.mjs jeremiah 1`), defaulting to `isaiah`. `scripts/fix-yaml.mjs` with no arguments still touches Isaiah only; `npm run build` runs it with `--all`. For comparing two builds byte for byte, `BUILD_VERSION=x BUILD_SEED=1 node scripts/build.mjs` pins the `?v=` stamp and the home page's random teasers.

Markdown files at the top of a book's directory (`BRIEF.md`, `OPEN-QUESTIONS.md`, and so on) are project notes; the build ignores them. Markdown in `guides/` and `themes/` is published.

### Adding a new book

The author's brief for the book comes first (see `AUTHORING.md`). Then:

1. `node scripts/fetch-kjv.mjs Jeremiah` writes `data/kjv/jeremiah.json` (the source file name has no spaces, such as `1Samuel`; a second argument sets a different slug). Check its spellings against the Gospel Library edition and add any differences to `LDS_SPELLINGS` in that script.
2. `content/<slug>/book.yaml`. Required: `name`, `slug` (the directory name), `order` (nav and home-page position; lowest first), `abbr` (the abbreviation `src/lib/refs.mjs` uses, such as `jer`; `[[Jer. 1:5]]` links to the book from then on), `gospelLibrary` (path under `…/study/scriptures/`, such as `ot/jer`), `eyebrow` (line above the title, such as “The Old Testament”), `heroQuote` (`text`, `cite`), `description` (meta description of the book page), `divisionsBlurb` (subtitle of the division map), `home` (`blurb` for the library card on the home page; `cta` and `guide: {label, slug}` for the hero buttons, used only for the first book), `intro`, `divisions` (each `key`, `range`, `name`, `blurb`, and a `color`), `beloved`, `coreSources`, and optionally `rangeSources` and `titles`. `content/isaiah/book.yaml` is the model.
3. Division colors: each division gets `color` and, for dark mode, `darkColor` (defaults to `color`). The build appends them to `dist/assets/site.css` as `--div-<key>` variables; it warns when a division has neither a `color` nor a variable in `site.css`. Isaiah’s colors stay in `site.css` (moving them would change its output). The variables are global, so **give a new book’s division keys names that Isaiah doesn’t use** (`judah`, `nations`, `apocalypse`, `woes`, `hezekiah`, `comfort`, `servant`, `zion`).
4. Chapters in `content/<slug>/chapters/NN.yaml`; guides and themes as Markdown in `guides/` and `themes/`. A chapter with no file gets a draft page from the KJV text.
5. Book of Mormon comparison data is optional: `data/bom/<slug>-parallels.json`, same format as Isaiah’s (only Isaiah has one; `scripts/fetch-bom-parallels.mjs` is Isaiah-specific). Without it, chapter pages simply have no BoM panel.
6. Still written by hand for now: the home page’s “coming someday” cards (`COMING_SOMEDAY` in `src/site.mjs`; remove an entry when its book goes live), and site-wide wording that names Isaiah (home page hero text, `SITE.description`, the 404 page’s Isa. 30:20 line, the search box’s example searches).
