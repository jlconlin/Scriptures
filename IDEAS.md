# Ideas for later

Not planned work; nothing here should be started without the author.

## An MCP server for the content corpus

So readers can load the commentary into their own AI conversations. Suggested plan:

1. Have `build.mjs` also emit a machine-readable `corpus.json` (KJV text, sections, notes, sources for every chapter) and an `llms.txt`, which works on any static host.
2. Add a small MCP server over that corpus with tools such as `get_chapter`, `get_verse_commentary`, `search_notes`, and `list_sources`. It can run locally as an npm package over stdio, or remotely as a serverless function (for example a Cloudflare Worker at mcp.scriptures.conlin.io), depending on the host chosen.
