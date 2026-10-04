# Ideas for later

Not planned work; nothing here should be started without the author.

## An MCP server for the content corpus

So readers can load the commentary into their own AI conversations. Suggested plan:

1. Have `build.mjs` also emit a machine-readable `corpus.json` (KJV text, sections, notes, sources for every chapter) and an `llms.txt`, which works on any static host.
2. Add a small MCP server over that corpus with tools such as `get_chapter`, `get_verse_commentary`, `search_notes`, and `list_sources`. It can run locally as an npm package over stdio, or remotely as a serverless function (for example a Cloudflare Worker at mcp.scriptures.conlin.io), depending on the host chosen.

## A random note on the home page

(Author, 2026-10-03: “Might be fun to have a random quote generator to go alongside with the quotes on the main page.”) The home page's “Try a phrase” shows three notes chosen when the site is built. A button beside them could draw another at random in the browser, from the same data the search page loads. A change to how the site looks, so on a branch until the author has seen it.

## Marking words in another language

(Author, 2026-10-03: “Is there some way we can set apart text in a foreign language. Maybe a different color?… doesn't have to stand out a lot, but it would be fun to mark it subtly.”) Transliterated Hebrew and Greek are written in italics now, as are book titles and emphasis, so the build can't tell them apart. It needs a way to mark them in the chapter files (or a list of the transliterations in use) and a quiet style, such as a slightly different ink color. A change to how the site looks, so on a branch until the author has seen it; best done once Genesis is written, since chapters are being written now.

## The author's own questions

(Author, 2026-10-03.) While reading, the author wants to ask a question about a verse, have the answer found, and have it added to the site. Probably done outside the site, with an AI model. The simplest form needs no code: the author asks in a session in this repository (or in a comment on the preview artifact), and the question is researched and added as a note under `STANDARDS.md`, with its ledger rows. A question box on the live site itself would need a server behind it, which the static site doesn't have.
