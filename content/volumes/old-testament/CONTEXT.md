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

- **Every period guide has the same five parts** (author, 2026-10-19: “That outline looks good”): where the period sits (its dates and what changed, linked to its section of the timeline); the map (drawn once, in the volume's maps folder); rulers and events (a table: date, ruler, what happened, where to read); the nations (a table: who, where, how they stood toward Israel, where to read); the books of this period (each book or chapter range, with a line on where it falls). About 1,000–1,500 words, to read in the panel; sourced like any guide (`STANDARDS.md` §8).
- ***Isaiah's World* gives its map, rulers and nations to guide 4 and keeps what is Isaiah's own** (author, 2026-10-19: everyday things and archaeology “sound like things that become a Guide for Isaiah. (not sure I care about an archaeology guide.)”): a shorter *Isaiah's World* with “Everyday things Isaiah assumes you know” and its four archaeological finds, which are about Isaiah's events and already sourced; no archaeology guide of its own.
- **All of Isaiah opens guide 4, Isaiah's own day** (author, 2026-10-19, choosing between that and opening the guide of the exiles for chapters 40–66, which the coordinator had recommended because those chapters' “when” lines describe them by the exiles they address). The link says when the book was given, as *How to Read Isaiah*'s “A word about ‘Second Isaiah’” does.
- ***Jeremiah's World* as Isaiah's**: its map, rulers and nations go to guide 5, and it keeps what is Jeremiah's own, including its timeline of the last forty years (the coordinator, 2026-10-19, following the author's decision for Isaiah; author, same day: “yes”).
- **A chapter's period is named in its book's `book.yaml`**, as chapter ranges (Isaiah 1–39 → period 4), and a chapter may name its own (the coordinator's choice, 2026-10-19).

  Genesis 1–11 and Moses get none (their chapters' Background carries them); a chapter that cannot be dated (Joel) shows no Context link. Until a period's guide is written, its Context link opens the timeline guide at that era's section.

## Guide 4's outline (approved by the author, 2026-10-19: “Sounds good”)

**Two Kingdoms and Assyria** (file `08-two-kingdoms-and-assyria`; 1 Kings 12 to 2 Kings 20; about 1,200–1,500 words; `status: preview`).

1. **Where this period sits.** From the division under Rehoboam and Jeroboam to the end of Hezekiah's reign. The north (Samaria; 19 kings, over 200 years) fell to Assyria in 722 or 721; Judah kept David's line, paid Assyria tribute, and survived Sennacherib in 701. The sources date the division 975, 931 or about 925, and the page says so (as the timeline does, `#two-kingdoms`). Links to the timeline's `#two-kingdoms` and `#assyria`.
2. **The map**: the sketch of the Near East now in *Isaiah's World*, from the volume's maps folder (`old-testament/the-empires`), with its own caption.
3. **Rulers and events** (date, ruler, what happened, where to read): from *Isaiah's World*'s table, already sourced, Uzziah, Jotham, Tiglath-pileser III, Ahaz, the Syro-Ephraimite war, Damascus taken, Shalmaneser V and Sargon II, Samaria's fall, Hezekiah, Merodach-baladan, Sennacherib's invasion of 701, Esarhaddon; from the timeline guide, already sourced, the division, Jeroboam's calves at Dan and Bethel, the deportations of 740–734; **new, to research**: Ahab with Elijah and Elisha, Jehu, Jeroboam II (Jonah, Amos, Hosea). Not Manasseh, Nebuchadnezzar or Cyrus (guides 5 and 6).
4. **The nations** (who, where, how they stood toward Israel, where to read): Assyria (a row of its own); from *Isaiah's World*'s table Syria (Aram), Egypt, Cush, the Philistines, Moab, Edom, Tyre and Sidon; Babylon as Assyria's rebel under Merodach-baladan. Not Tarshish, Media or Elam.
5. **The books of this period**: 1 Kings 12–22, 2 Kings 1–20, 2 Chronicles 10–32; Jonah, Amos and Hosea under Jeroboam II; Micah under Jotham, Ahaz and Hezekiah; Isaiah, the whole book (the author's decision above), in Jerusalem 740–701. A book on the site links to its page.

How: a short research pass (`theme-researcher`) for the three new rows, a dossier from the two pages' existing rows and their sources, then `write-guide.js` (writer, reviewer, repairs, Codex) on the branch `claude/reading-panel`; then *Isaiah's World* cut to its everyday things and archaeology, Isaiah's `periods:` pointed at the new guide and `periods.yaml` given its `guide:`. Measure the cost (`scripts/batch-usage.cjs`) before guide 5.

## Still to decide, in order

1. **The other volumes** (later): the New Testament; the Book of Mormon, which has no real-world map; the Doctrine and Covenants; the Pearl of Great Price.
2. **Finishing the panel**: the Context link where a phone can find it (it is at the far end of the Outline bar), a compact search page in the panel, the link on every book's chapters.
3. **Writing it into the standing documents**, together with the glossary decision the author is settling in another session (2026-10-19).

## Where the work stands (2026-10-19)

- **The panel** is on the branch `claude/reading-panel` (worktree `.claude/worktrees/reading-panel`), merged with the live site, and all of it is on the dev site; not live.
- **The glossary mockups** (set aside) are on `claude/glossary-mockup`: the volume maps folder (`content/volumes/<volume>/maps/`, shown with `<!-- map: … -->`, `embedMaps` in `scripts/build.mjs`) is the part worth keeping, for the period guides' maps.
- **Step 1a is done** (on `claude/reading-panel` and the dev site): `content/volumes/old-testament/periods.yaml` names the six periods, each Old Testament book's `book.yaml` its chapter ranges (`periods:`), and every chapter in a period has the Context link, which opens the timeline guide at the era's section until the period's guide is written; Isaiah and Jeremiah open their World guides meanwhile. No link on Genesis 1–11, Moses, Joel, and the Psalms (a psalm's period is mostly unknown; the plan's “many Psalms” in period 3 would need a list of which).
- **Step 1b is done**: under 900px, where the Outline bar is swiped, Context comes first, after the label. The search page in the panel loses its large title, by the rule that trims a guide's.
- **Nothing goes live until the sprint is finished** (author, 2026-10-19: “I want to finish this sprint before we go live on main”): the panel and the period guides stay on `claude/reading-panel` and the dev site, and `main` is fast-forwarded once, at the end.
- **Then** guide 4 from *Isaiah's World*, guide 5 from *Jeremiah's World*, then guides 1, 2, 3 and 6, each outline shown to the author first, and the first one's cost measured before the rest.
