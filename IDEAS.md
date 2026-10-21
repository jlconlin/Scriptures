# Ideas for later

Not planned work; nothing here should be started without the author.

## An MCP server for the content corpus

So readers can load the commentary into their own AI conversations. Suggested plan:

1. Have `build.mjs` also emit a machine-readable `corpus.json` (KJV text, sections, notes, sources for every chapter) and an `llms.txt`, which works on any static host.
2. Add a small MCP server over that corpus with tools such as `get_chapter`, `get_verse_commentary`, `search_notes`, and `list_sources`. It can run locally as an npm package over stdio, or remotely as a serverless function (for example a Cloudflare Worker at mcp.scriptures.conlin.io), depending on the host chosen.

## A question box on the site

(Author, 2026-10-03.) While reading, the author wants to ask a question about a verse, have the answer found, and have it added to the site. Today that is done in a session or a comment on the preview (`AUTHORING.md`, “The author's study questions become commentary”). A question box on the live site itself would need a server behind it, which the static site doesn't have.

## A theme page: the sacrifices and offerings beside today's ordinances

The author's idea (2026-10-13: “I'm curious how the various prescribed sacrifices and offerings compare to and align with today's ordinances”). **A theme page, not a guide** (author, same day: “I do want to add that as a theme page, not a guide page”), so it may make connections of its own within `STANDARDS.md` §8. **Not before the five books of Moses are finished** (author: “I want to finish the other fives Books of Moses first”); Leviticus, Numbers and Deuteronomy are not started.

When the time comes:

- **Which book owns it is not decided.** A theme page belongs to a book. The offerings are prescribed in Lev. 1–7 (with Lev. 16 and 23), the calendar of offerings in Num. 28–29, the Passover in Ex. 12; Deuteronomy mostly assumes them. Leviticus is the likely home. Put it in that book's `THEME-CANDIDATES.md` as already chosen by the author, and ask whether it should instead span the five books.
- **What is already on the site.** Volume guide 4, *The Law and the Covenant*, gives sacrifice two paragraphs (the three kinds of altar sacrifice, the six acts, that the sacrament replaced it); guide 5 has the daily offering and “more than sacrifice.” The theme page links to them and does not repeat them.
- **Ask the author before the outline** what the page should carry (one gospel taught by different ordinances, or a side-by-side of each offering and its counterpart), and whether temple ordinances are in scope, within what the Church's sources say publicly.

## Guides and Themes as dropdown menus

(Author, 2026-10-18: “I do think the ‘Guides’ and ‘Themes’ navigation needs to be dropdowns for easier navigation. Let's shelve that for a moment.”) Today the header's Guides link opens a book's Guides page, which lists its guides, its volume's guides and its themes (`DEVELOPMENT.md`, “Guides index”). The idea is a dropdown for each, like the Scriptures menu (`scriptureMenu` in `src/templates/layout.mjs`), so a reader can go straight to a guide or theme page from anywhere. A look-and-feel change: a branch and the dev site before `main` (`AUTHORING.md`, “Where changes go”).

## Photographs of real artifacts across the site

(Author, 2026-10-20, of the Black Obelisk's Jehu panel in the period guide *Two Kingdoms and Assyria*: “this is an excellent example of where we can pull real images into the site. I really like how this turned out.”) **Only in guides and the Context pages (the period guides), not in chapter notes** (author, same day: “I don't think I want photos in chapter notes. We can consider them for guides and for context pages”). Candidates: Hezekiah's tunnel and the Siloam inscription, the Lachish reliefs, the Cyrus Cylinder, the Babylonian Chronicle. What worked for the obelisk (`content/volumes/old-testament/CONTEXT.md`): a photograph on Wikimedia Commons under CC0, CC BY or CC BY-SA, downloaded without asking (author, 2026-10-21: “What does not require my input is downloading images”), whether it belongs on the page being the author's to judge; a source for what the object shows, cited in the caption with a ledger row (a Church, BYU or Scripture Central source); the photographer and licence credited in the caption, with links; WebP at 1200px in `src/assets/figures/`, shown with `.photo-figure`. Not the Church's own Bible photographs or media library, which would need the Church's permission.
