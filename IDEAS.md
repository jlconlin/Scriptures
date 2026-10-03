# Ideas for later

Not planned work; nothing here should be started without the author.

## An MCP server for the content corpus

So readers can load the commentary into their own AI conversations. Suggested plan:

1. Have `build.mjs` also emit a machine-readable `corpus.json` (KJV text, sections, notes, sources for every chapter) and an `llms.txt`, which works on any static host.
2. Add a small MCP server over that corpus with tools such as `get_chapter`, `get_verse_commentary`, `search_notes`, and `list_sources`. It can run locally as an npm package over stdio, or remotely as a serverless function (for example a Cloudflare Worker at mcp.scriptures.conlin.io), depending on the host chosen.

## The author's own questions

(Author, 2026-10-03.) While reading, the author wants to ask a question about a verse, have the answer found, and have it added to the site. Probably done outside the site, with an AI model. The simplest form needs no code: the author asks in a session in this repository (or in a comment on the preview artifact), and the question is researched and added as a note under `STANDARDS.md`, with its ledger rows. A question box on the live site itself would need a server behind it, which the static site doesn't have.
