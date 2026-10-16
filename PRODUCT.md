# Product

<!-- impeccable:product-schema 1 -->

The product record for design work on the site. The writing standard is `STANDARDS.md`, the framing decisions are `DECISIONS.md`, and how a book is written is `AUTHORING.md`; this file repeats them only where design depends on them.

## Platform

web

## Users

- **The author first.** The site's primary reader is its author, studying the scriptures (`STANDARDS.md` §2: “this site's primary reader is—me”). Design favors what helps the author's own study (their questions, readability, depth) over what matters only for a public site. Don't argue a design or a label from a hypothetical newcomer.
- **Two devices, both first-class** (author, 2026-10-15: “it needs to be both ipad and computer”): an iPad mini, upright (744px) and sideways (1133px), and a desktop or laptop computer. A layout isn't finished until it works on both. Phones aren't named as a target; the site should still work on one, but they don't decide a design.
- **Other readers are welcome but secondary**: Latter-day Saints who find the site. Nothing should confuse them, but nothing is designed only for them.
- **The reader is semi-academic**: academically trained, curious and comfortable with competing hypotheses, but not a specialist in biblical studies, Hebrew or ancient history (`STANDARDS.md` §2).

## Product Purpose

A Latter-day Saint scripture study site (https://scriptures.conlin.io), written one book at a time. Each chapter page sets the King James text beside sourced notes on the phrases a careful reader stops at, along with the chapter's setting, its thread, a plain-words paraphrase, how it points to Christ, and where to explore next. Theme pages follow an arc across a book's chapters; guides serve a book or a whole volume.

Success means the reader can stop at a phrase, get a sourced answer without losing their place in the text, and come away seeing the chapter's thread and how it points to Christ.

## Positioning

A focused companion to the scriptures: one clear reading of each chapter, deeper and more academic than the *Student Manual* (“Church-adjacent, with just the right amount of academic rigor”), and every factual claim sourced and checked. It is not a compendium, not a companion to *Come, Follow Me*, and doesn't reproduce what the Gospel Library already puts beside the verse (`STANDARDS.md` §1).

## Operating Context

- **Study sessions, reading the text first.** The reader reads a chapter, stops at a phrase, opens the note, and returns to the verse. Margin notes on screens 880px and wider keep the text from moving (`DEVELOPMENT.md`, “Margin notes”).
- **Beside the Gospel Library.** Chapters link to the Church's edition of the text and its helps, which the reader already has open; the site adds what those helps don't.
- **Search** by reference or word, scoped by volume and book; printing is supported (note citations open for print).
- **The site grows continuously.** Books go live at the author's word; live books keep changing as the author studies.

## Capabilities and Constraints

- A static site built by the project's own Node scripts (`scripts/build.mjs`; templates in `src/templates/`, styles in `src/assets/site.css`, behavior in `src/assets/site.js`), hosted on Cloudflare; every push to `main` rebuilds the live site.
- Every book shares one codebase with no book-specific code; books are found from `content/*/book.yaml`.
- Page types: home, book page, chapter, theme page, guide (book and volume), facsimile, About, search, 404.
- Note kinds and section names are the site's vocabulary (for example “BoM Comparison,” chosen knowingly by the author).
- **Changes to how the site looks wait for the author's approval on a separate branch** (`DECISIONS.md`), shown first in the private claude.ai preview (`AUTHORING.md`, “Showing a change”).

## Brand Commitments

- **Name:** *Line upon Line*, from Isaiah 28:10.
- **Voice:** a warm, knowledgeable teacher; honest about uncertainty; quotations carry their citations instead of announcing their sources (`STANDARDS.md` §3).
- **Christ at the center.** Each chapter closes by asking how it points to Him.
- **Book illustrations:** one author-approved image per finished book, in the shared visual language of `content/visual-style.yaml`.
- **Independent, not official.** The site says plainly that it is not a publication of The Church of Jesus Christ of Latter-day Saints, and that its commentary was written with AI under the author's direction (`content/about.md`).

## Evidence on Hand

- The commentary itself: `content/<book>/chapters/`, `themes/`, `guides/`, and the volume guides in `content/volumes/`.
- Book illustrations in `src/assets/*-book-art.png`; Book of Abraham facsimiles in `src/assets/facsimiles/`.
- The About page (`content/about.md`) explains the site's purpose, principles, and how it was made.
- There are no testimonials, reader counts or endorsements, and none may be invented. Nothing may suggest Church endorsement.

## Product Principles

1. **The text comes first.** The scripture is what the reader came for; commentary serves it and never displaces the reader's place in it.
2. **Answer the question the reader stopped on.** Every note exists because a careful reader would ask something; the interface gets them to that answer and back quickly.
3. **Show the evidence.** Sources are part of the product, always reachable, never decoration.
4. **The author's study decides.** When a choice helps the author's study but not a hypothetical newcomer, the author's study wins.
5. **Calm and lasting.** The site is read in long, reflective sessions and keeps growing; nothing should date it or pull at the reader's attention.

## Accessibility & Inclusion

No standard has been named. Long reading sessions on an iPad mini and a computer make legibility, comfortable reading width (`--read-w`, about 55 characters a line in chapters), and touch-friendly controls requirements. Hebrew and Greek transliterations and occasional Hebrew script must render correctly.
