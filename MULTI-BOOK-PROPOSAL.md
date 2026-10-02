# Proposal: what adding Jeremiah does to the site

Draft for the author, 2026-10-01. A process note: delete it (or fold the decisions into `DEVELOPMENT.md`/`DECISIONS.md`) once the work is done.

## In short

- **The code already handles a second book.** I did a trial build in a scratch copy with a stand-in `content/jeremiah/book.yaml`. It built all 52 Jeremiah pages with no code changes. Nothing was committed.
- **Three real problems:**
  1. **Publishing is all or nothing.** The moment a `book.yaml` reaches `main`, the book shows up everywhere: in the header, on the home page, in search, and in the sitemap. Every chapter is listed, including the 50 that are only bare KJV text.
  2. **There's no way to move between books.** Inside Isaiah, the header shows only Isaiah's links. The other pages list every book in the header, which won't fit on a phone once there are three books.
  3. **A few things assume Isaiah.** One is a real bug: the chapter strip is hard-coded to 66 chapters.
- **Recommendation:** first, on a branch, add (a) a way to keep a book in preview, (b) a "Books" menu in the header, and (c) the small fixes. Then write the Jeremiah brief and pilot chapters as planned.

## What the trial build showed

If `content/jeremiah/book.yaml` were committed today:

| What | Result |
|---|---|
| Chapter pages | 52 pages at `/jeremiah/1/` … `/jeremiah/52/`, all KJV only. All of them go in the sitemap and in search. |
| Home page | A "Jeremiah · 52 chapters" library card, which looks like a finished book. "Try a phrase" says "A few notes from Isaiah and Jeremiah" even though Jeremiah has no notes. |
| Header | Home, About, and Search pages show `Isaiah · Jeremiah · About · Search`. Isaiah pages show only `Isaiah · Chapters · Guides · Search`. |
| Links from Isaiah | **68 `[[Jer. …]]` links in Isaiah's chapters switch** from Gospel Library (which has footnotes) to our bare draft pages. Readers get less than before until those chapters are written. |
| Short URLs | `/jer/31` → `/jeremiah/31/` already works. |
| Search index | `search.json` grows from 1.1 MB to 1.3 MB (375 KB → 415 KB compressed). With full commentary, I'd estimate about 2.2 MB (about 750 KB compressed). That's fine for two books, but around four or five books the index should be split by book. |
| Chapter strip on chapter pages | `site.css:327` has `grid-template-columns: repeat(66, 1fr)`, so Jeremiah's 52 ticks would fill only about 80% of the width. **Bug.** |

Content commits go straight to `main`, and Cloudflare publishes `main`. So the first two pilot chapters would make Jeremiah public with 2 of its 52 chapters written.

## Proposal

### 1. A preview setting for books

Add `status: preview` or `status: live` to `book.yaml`.

- **preview:** the book builds in `npm run dev` and in the claude.ai preview artifact, so you can review chapters as usual. The production build leaves it out completely: no pages, nav, home card, search entries, or sitemap entries, and `[[Jer.]]` links still go to Gospel Library.
- **live:** the book appears everywhere, as it would today.

Separately, and useful in both cases: **`[[Jer. 31:31]]` should link to our page only when that chapter has commentary.** Draft chapters keep linking to Gospel Library. This is a small change in `src/lib/refs.mjs`, since `LIBRARY` would carry the list of written chapters. It also makes a partial launch reasonable, if you'd rather publish chapters as they're finished.

### 2. Navigation

**Now:** inside a book, the header has that book's links (Overview, Chapters, Guides, Search). On other pages it lists every book. Chapter pages have breadcrumbs, a clickable chapter strip, and previous/next links. Nothing gets a reader from Isaiah 53 to Jeremiah 31 except the logo → home page → library.

**Proposed header, the same on every page:**

```
Phone (375px):     [logo]              Jeremiah ▾   🔍   ☾
iPad upright+:     [logo] Line upon Line   Jeremiah ▾  Chapters  Guides  🔍 Search  ☾
Outside a book:    [logo] Line upon Line   Books ▾  About  🔍 Search  ☾
```

The **book menu** is labeled with the current book's name, or "Books" outside a book. It opens a panel:

```
┌──────────────────────────────┐
│ THIS BOOK                    │
│   Jeremiah — overview        │
│   Chapters                   │
│   Guides                     │
├──────────────────────────────┤
│ OLD TESTAMENT                │
│   Isaiah        66 chapters  │
│ ✓ Jeremiah      52 chapters  │
├──────────────────────────────┤
│   About this site            │
└──────────────────────────────┘
```

- Books are grouped by volume, using the `eyebrow` field ("The Old Testament"), so the menu still works once the Book of Mormon or D&C is added.
- On a phone, "Chapters" and "Guides" move into the menu, so the header fits however many books there are.
- It's built on a plain HTML `<details>` element, so it works without JavaScript, like the rest of the site. A few lines in `site.js` close it on Escape or an outside tap.
- One dropdown, not one menu per book or a mega-menu. A reader switches books rarely and moves between chapters often.

**Smaller navigation items, each optional:**

- **Chapter picker.** The chapter strip (52–66 thin ticks, 14px tall) is hard to tap on an iPad. Tapping "Jeremiah **31**" at the top of a chapter could open a grid of chapter numbers colored by division. This is separate from the book menu and could come later.
- **Search by book.** When there's more than one book, add a book filter (All · Isaiah · Jeremiah) next to the existing Verses/Notes filters. Also make the example searches in the search box suit more than one book.
- **Across the boundary between books.** At Isaiah 66, "next" could say "Continue to Jeremiah 1". I'd skip this, because site order won't always follow canonical order.

### 3. Small fixes (no design decision needed)

- Chapter strip: replace the hard-coded 66 with the book's own chapter count (`site.css:327` plus the chapter template).
- "Try a phrase" (`pages.mjs`): name only books that have notes.
- `COMING_SOMEDAY` in `src/site.mjs`: take Jeremiah out of the "More of the Old Testament" blurb when it goes live.
- Search placeholder ("wings as eagles", "Immanuel", "Cyrus"): use examples from more than one book.

### 4. Wording that names Isaiah (yours to rewrite, or I can draft)

- `SITE.description`: "…beginning with Isaiah."
- Home page, "Why study this way?" card (`pages.mjs:76–77`): built around 3 Ne. 23:1 and "students of Isaiah."
- `content/about.md`: lines 8, 12, 20, 21, 23, and 48 talk about Isaiah specifically. Some should stay (the site's name comes from Isa. 28:10); others read as if Isaiah is the whole site.
- The 404 page's Isa. 30:20 line can stay. It's a joke, not a claim about the site.

### 5. Content questions for the Jeremiah brief, not for code

- **Shared background.** Isaiah's World already covers Assyria and Babylon. A Jeremiah guide could link to it and cover only Josiah, Babylon's rise, and the exile.
- **Themes across books.** Theme pages currently belong to one book. Some topics span both books, such as the new covenant (Jer. 31) and the gathering of Israel. A site-wide theme page is possible later; not needed now.
- **Book of Mormon.** No Book of Mormon text quotes Jeremiah at length the way Nephi quotes Isaiah, so Jeremiah needs no BoM comparison panel. Lehi was Jeremiah's contemporary, though, and the brief should research the Book of Mormon's references to Jeremiah. That could become a guide.
- **Division colors.** Choose a palette that's distinct from Isaiah's, with keys Isaiah doesn't use (see `DEVELOPMENT.md`).

## Order of work

1. **Branch `multi-book`:** the preview setting, linking only to written chapters, the chapter-strip fix, the book menu, and the search filter. Preview it in the claude.ai artifact with a stand-in Jeremiah, on a phone, an iPad mini (744 / 1133px), and a laptop. Fast-forward `main` once you approve.
2. **Jeremiah brief** (step 3 in `AUTHORING.md`), unchanged.
3. **`content/jeremiah/book.yaml` with `status: preview`.** Pilot chapters go to `main` as usual without appearing on the live site.
4. **Flip to `live`** when you decide (see the first question).
5. Update `DEVELOPMENT.md` ("Adding a new book") and `DECISIONS.md` (how books launch).

## Decisions for you, one at a time

**Decided (2026-10-01): (b), as chapters are finished.** Jeremiah stays in preview through the pilot, then goes live and grows chapter by chapter.

**Decided (2026-10-01): unwritten chapters are listed but not built.** On the live site, an unwritten chapter has no page of its own:

- **Book page:** its chapter card is greyed out, marked "coming," and links to the chapter in Gospel Library.
- **Chapter strip:** the same chapter's tick is dimmed and links to Gospel Library.
- **Previous/next links:** they skip to the nearest written chapter.
- **`[[Jer.]]` links:** they go to Gospel Library until the chapter is written.
- **Home card:** it says "N of 52 chapters."
- **Search and sitemap:** they include written chapters only.

- **Old or shared links:** `404.html` sends `/jeremiah/5/` to the Gospel Library.

There are no bare KJV draft pages anywhere, in preview or live. A chapter being written already has its YAML file, so it builds normally.

**Decided (2026-10-01): build it on the `multi-book` branch.** Done; it's in the preview artifact with a stand-in Jeremiah (chapters 1–2 are placeholders). The stand-in isn't committed.

**Still open, after the author tries the preview:** the book menu's design; whether 50 "Commentary coming" cards are too many (a compact row of chapter numbers would be an alternative); whether to add a chapter picker; and the wording in §4.

**First question: when should Jeremiah appear on the live site?**

- **(a) When it's finished.** It stays in preview until all 52 chapters are written. This is the simplest option, and the site never looks half-built.
- **(b) As chapters are finished.** It goes live after the pilot, the home card says "6 of 52 chapters," and unwritten chapters are left out of the chapter list. Readers get Jeremiah sooner.
- **(c) Live now with draft pages**, which is today's behavior.

I'd recommend (a), or (b) if you want readers on Jeremiah sooner. The preview setting is worth building either way.

Questions after that: the book menu's design (shown in the preview), whether to add the chapter picker now, and the wording in §4.

## Header menu: decisions so far (2026-10-01)

- **The header text never changes.** The menu button always says "Scriptures", whatever book you're in. Other header items can be added later if they help.
- **Design under review:** a "Scriptures" menu that opens to a panel of three columns: volume, book, chapter grid. Mockup: https://claude.ai/artifact/G3LvQFYx7WS5rhvBbHkEcR. The author is judging it with every book of the standard works listed. Once the design is settled, the live menu will list only books that have commentary.
- **The author likes:** the menu opening with the current book (and chapter) already selected.
- **Adjusted after feedback:** pointing opens a column immediately; the panel stays a fixed size with three columns, so changing volume doesn't reshape it; the column whose contents change fades in; returning to a volume shows the book last chosen there.
- **Codex's review** (for the record): it questioned whether a full scripture browser is worth it while the site has few books. It suggested listing only books with commentary, with "2 of 52"-style labels, and making chapter navigation on the page itself prominent.
- **All five volumes are always listed** (Old Testament, New Testament, Book of Mormon, Doctrine and Covenants, Pearl of Great Price), even when only books with commentary are shown. A volume with nothing on the site yet says so and links to the Gospel Library.
- **Guides:** each book keeps its own Guides page (no site-wide Guides page). Proposed: a Guides link in the header on pages of books that have guides. Only the Scriptures menu's label must never change.
- **The menu closes** when a destination is chosen (a chapter, Overview, Guides, About, a Gospel Library link) or when the reader clicks anywhere outside it. Choosing a volume or book keeps it open. On narrow windows the three columns shrink to fit, down to about 640px; below that it is one panel with a back button.
- **Volume pages and book pages.** Each volume gets a page (for example `/old-testament/`), alongside the book pages that exist now (`/isaiah/`). In the menu, a mouse click on a volume or book goes to its page (pointing has already opened its column). On a touch screen, the first tap opens the column and a second tap on the highlighted item goes to the page. The name at the top of each column is also a link to that page, and on phones it's the way in. A volume with nothing on the site yet still has a page, which links to the Gospel Library.
