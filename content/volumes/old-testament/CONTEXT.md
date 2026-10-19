# The Context panel and the period guides: the plan

A project note (the build ignores it), begun 2026-10-19. It holds the author's decisions about how a reader finds the history and geography behind a chapter without losing their place, and the plan for building it. When the work is done, what remains true moves to `STANDARDS.md` §8, `DEVELOPMENT.md` and `GUIDES.md`, and this file is deleted (`DECISIONS.md`, “Process notes are temporary”).

## Why

A reader needs the period a chapter belongs to (who ruled, which nations, where the places are) to understand it. *Isaiah's World* gives that for Isaiah, and the author liked it, but it belongs to a book while its content belongs to a period that several books share. Glossaries of names and places were tried and set aside (2026-10-18, mockups on the branch `claude/glossary-mockup`): a written glossary mostly repeated the Bible Dictionary, *Isaiah's World* and the chapter notes, and a generated index of names did what search already does (author: “I can just use the search to find that”). What a reader lacks is orientation, and a way to reach it from the chapter without losing their place (author: “The trouble will be in how to look it up without losing my place. I don't want a footnote every time a name/place is mentioned”).

## Decided

- **The world belongs to the volume, a book keeps what is its own** (author, 2026-10-18: “The division seems reasonable”). The history, map, rulers and nations of a period are a volume guide that every chapter of that period opens. A book keeps its own guides only for what is particular to it (how to read it, its theme pages).
- **The reading panel** (author, 2026-10-19, after trying it on the dev site: “the concept is good”; the side panel “looks good” in landscape; scrolling “seems to work”). On a chapter, a link opens the period guide, and the header's Search, in a panel over the chapter; closing it leaves the reader where they were. Beside the verses when there are 400px to their right (an iPad mini held sideways), over the margin notes; otherwise a card from the bottom (an iPad held upright: 620px wide over a dimmed chapter; a phone: the full width). Built on the branch `claude/reading-panel` (site.js “reading panel”, site.css “reading panel”); on the dev site, not live.
- **The link is called “Context”, and the notes of the history kind are relabelled “History”** (author, 2026-10-19, choosing between that and “History & Map” for the link). Each guide's own title names its period (“The Assyrian Crisis, 740–701 BC”), and the panel's bar shows it.
- **Six periods for the Old Testament** (author, 2026-10-19: “yes”), each a volume guide, following the eras of *A Timeline of the Old Testament*, with Egypt and the wilderness on their own:
  1. The patriarchs: Genesis 12–50, Abraham.
  2. Egypt and the wilderness: Exodus, Leviticus, Numbers, Deuteronomy.
  3. The conquest, the judges, and one kingdom: Joshua, Judges, Ruth, 1 Samuel–1 Kings 11, many Psalms.
  4. Two kingdoms and Assyria: 1 Kings 12–2 Kings 20, Amos, Hosea, Micah, Jonah, Isaiah 1–39.
  5. Babylon and the exile: 2 Kings 21–25, Jeremiah, Lamentations, Ezekiel, Daniel, Habakkuk, Nahum, Zephaniah, Obadiah.
  6. Persia and the return: Ezra, Nehemiah, Esther, Haggai, Zechariah, Malachi.

  Genesis 1–11 and Moses get none (their chapters' Background carries them); a chapter that cannot be dated (Joel) shows no Context link. Until a period's guide is written, its Context link opens the timeline guide at that era's section.

## Still to decide, in order

1. **What every period guide holds**, one outline for all six.
2. **How a chapter names its period** (by chapter, since a book can span periods: a range in `book.yaml`, or a field in each chapter).
3. **Isaiah 40–66**: the guide of Isaiah's own day or of the exiles it addresses; it touches the “Second Isaiah” question (the Church holds that Isaiah wrote the book). A question for the author, with a recommendation.
4. **What becomes of *Isaiah's World* and *Jeremiah's World*** (period guides 4 and 5 grown from them, or cut to what is the book's own).
5. **The other volumes** (later): the New Testament; the Book of Mormon, which has no real-world map; the Doctrine and Covenants; the Pearl of Great Price.
6. **Finishing the panel**: the Context link where a phone can find it (it is at the far end of the Outline bar), a compact search page in the panel, the link on every book's chapters.
7. **Writing it into the standing documents**, together with the glossary decision the author is settling in another session (2026-10-19).
