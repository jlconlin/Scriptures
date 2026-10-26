# Brief for Codex: score every chapter note for the ledger-shaped voice

The author runs this in Codex from ChatGPT, separately from the Claude sessions. It is a read-and-code task: **write one script, run it over the whole site, and produce a table. Edit no content.** Deleted when the task is done; the script stays under `scripts/`.

## Why

The site's commentary is written to an evidence ledger: every factual claim in a chapter note has a row in `content/<book>/evidence/<NN>.yaml` (`STANDARDS.md` §5). A review of the theme pages (2026-10-25/26, `REVIEW.md`) found that this produced a voice the author calls “AI-generated”: writers write one sentence per ledger row, in the source's words, so the prose takes the shape of the evidence file. A spot check of eight chapters (Genesis 12, Exodus 32, Numbers 21, Psalm 22, Isaiah 53, Jeremiah 31, Hosea 11, Zechariah 3) found the voice in all eight, worst in notes with many sources and in notes that report several readings of one line (“one reading… another reading… the text does not say”). The “christ” notes were short and clean; the notes that read best argued one point (Isaiah 53: 19 sentences on 12 rows). Before any chapter is rewritten, the author wants to know **how many notes are actually bad, and which**.

## What to build

`scripts/score-notes.mjs`, run as `node scripts/score-notes.mjs [book…] [--out <dir>]`, default every book under `content/`. Use the repository's own parsing: `scripts/check-content.mjs` already reads a chapter's notes and its ledger (`js-yaml`, as the rest of `scripts/` does); reuse or copy its readers rather than writing new ones. A chapter file is `content/<book>/chapters/<NN>.yaml` with `setting`, `thread`, and `notes` (each with `ref`, `title`, `kind`, `body` in Markdown); its ledger is `content/<book>/evidence/<NN>.yaml`, rows with `where: note <chapter>:<verse> “<title>”` (and `setting`, `thread`, etc.).

For every note (and for each chapter's `setting` and `thread`), measure:

1. **Sentences** in the body (split on `.`, `?`, `!` followed by a space or end; ignore abbreviations like `v.`, `vv.`, `cf.`, `D&C`, `Gen.` and the other scripture abbreviations in `[[…]]`).
2. **Ledger rows** whose `where` names this note.
3. **Quotations**: passages in curly quotes `“…”` in the body, and how many words of the body they cover (quoted words ÷ total words).
4. **Citations** `[@key]` in the body.
5. **Readings stacks**: sentences beginning with or containing *One reading*, *Another reading*, *A second reading*, *A third*, *Some take*, *Others take*, *One older reading*, *the text does not say*, *neither text says*, *does not settle*. Count them.
6. **Set-beside**: occurrences of *set beside*, *set side by side*, *the comparison is*.

Combine into a **score from 0 (argues) to 10 (ledger-shaped)**: rows per sentence near or above 1 is the strongest signal, quoted-word share above about a third the second, readings stacks the third, citations per sentence the fourth. Document the weights at the top of the script in a comment, and make them constants. Flag a note when its score is at or above a threshold (`--threshold`, default 6).

## What to produce

Write into `.cache/review/` (create it; `.cache/` is gitignored):

- **`note-scores.md`**: one Markdown table of every flagged note, sorted by score descending, columns: `Book | Ch. | Note (title) | Kind | Sentences | Rows | Rows/sent. | Quoted share | Readings | Score | Notes`. The **Notes** column is a short phrase saying what drives the score for that note (“14 rows on 9 sentences, 6 quotations”; “readings stack ×4”; “quoted share 0.52”), not prose. Below it a second table, **per book**: `Book | Chapters | Notes | Flagged | Flagged % | Median score | Worst note`.
- **`note-scores.csv`**: every note, not only the flagged, same columns, for sorting.
- Print the per-book table to the console as well, and the totals: notes scored, notes flagged, flagged percentage.

Then **calibrate against the spot check** before reporting: the script should put Genesis 12 “Did Abram lie?” and Zechariah 3 “Filthy garments taken away” high, and Isaiah 53's notes and Exodus 32 “The offer Moses refused” low. If it does not, adjust the weights and say what changed. Report the calibration result in a few lines at the top of `note-scores.md`.

## Limits

- Edit nothing under `content/`. Do not rewrite a note, however bad its score.
- The score is a flag for a later reader, not a verdict: a note on a textual variant may legitimately quote three witnesses. Say so in the file's header.
- Keep the script's output off the console except the summary; the tables go to the files.
- Commit the script and nothing else (`scripts/score-notes.mjs`), with a message of the form `scripts: score-notes.mjs, scores every chapter note for the ledger-shaped voice (author's Codex task, 2026-10-26)`. Do not push.
