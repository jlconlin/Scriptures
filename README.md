# Line upon Line

A study companion for the scriptures, beginning with the book of Isaiah. It will be published at <https://scriptures.conlin.io>.

Each chapter page shows the King James text with notes on selected phrases (word meanings, context, imagery, witnesses of Christ, related scriptures, latter-day prophets, literary structure, and Book of Mormon comparisons), along with the historical setting, the thread that ties the chapter together, a plain-words paraphrase, a closing look at how the chapter points to Christ, and where to explore next. Guides and theme pages cover topics that span many chapters. The site is written for a thoughtful reader who is not a biblical specialist: it takes scholarship seriously and stays grounded in Latter-day Saint belief.

## Layout

- `content/` — the writing: chapter commentary (`isaiah/chapters/*.yaml`), guides, theme pages, the About page, and the shared bibliography (`sources.yaml`).
- `data/` — scripture text: the KJV text of Isaiah and the Book of Mormon verses that differ from it.
- `src/` — templates, styles, and scripts for the site.
- `scripts/` — the build, a local preview server, and checking tools.
- `dist/` — the generated site (not committed).

## Building

Requires Node 20 or later.

```sh
npm install
npm run build     # writes a static site to dist/
npm run dev       # preview at http://localhost:4321
```

The output is a plain static site that any web server can host. Configure the server to serve `404.html` for missing paths.

## Contributing to the content

[STANDARDS.md](STANDARDS.md) explains how the commentary is written and sourced; [AUTHORING.md](AUTHORING.md) records the project’s status and lists the other project files. [DEVELOPMENT.md](DEVELOPMENT.md) covers the code.

## License

The code is MIT-licensed, the commentary (`content/`) is CC BY-SA 4.0, and the KJV text is public domain. See [LICENSE](LICENSE) for details. This is not an official publication of The Church of Jesus Christ of Latter-day Saints.
