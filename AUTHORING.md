# Authoring guide

How a book is written and how to work with the author. The writing and sourcing standard is [`STANDARDS.md`](STANDARDS.md); theme pages and guides have their own, `PAGES.md`; the steps a coordinating session runs are in `PROCESS.md`, and how the site's code and scripts work in `DEVELOPMENT.md`; `CLAUDE.md` (and its copy, `AGENTS.md`) lists which file to read for which task.

This file says what is true now. A date in parentheses marks a rule as the author's and says when it was given. The author's words and the incident behind each rule are in git, not here (`DECISIONS.md`, “Process notes are temporary”): when something changes, replace the line; don't add to it.

## Status

Nothing about a single book is recorded in this file or any other top-level file (2026-10-09). Three places hold it:

- **`node scripts/status.mjs [book]`** reads the repository and prints where each book stands: chapters written and bare, ledgers, the language pass, theme and guide pages, preview or live, the illustration, the question numbers waiting for the author, and what is not pushed. Nobody writes it, so it is never out of date.
- **`content/<book>/BRIEF.md`** holds the book's decisions and whatever about its state a script can't see (“State of the book”).
- **`git log -- content/<book>`** is the book's history. A commit message says what was done and, where the author decided it, in the author's words: `Daniel: live (author: “Let's go live”)`. The language pass is recorded by `batch-commit.mjs`, whose commit trailers `status.mjs` reads; a hand-written subject records nothing.

`OPEN-QUESTIONS.md` is the one exception: a single file for every book, at the author's request.

What is true of the whole site:

- **The author has read almost none of it.** Books went live at the author's word before being read. Treat every book as open to the author's correction.
- **Live books are open to change** (2026-10-12). Work that improves a finished book proceeds without asking: deepening a note, trimming a guide a volume guide has absorbed, correcting what the author's study turns up. A new rule is applied to an older book when there is a reason to open it, not as a campaign (2026-10-07), and `check-content` warnings on older books are information, not a to-do list. The full review comes with the author's study (2026-10-16): when the author returns to a volume, every couple of years, its books are brought up to every rule made since.
- **Which book is next is the author's choice.** No more Book of Mormon content for now (2026-10-07); Isaiah notes with a passage that belongs under a Book of Mormon verse wait in `OPEN-QUESTIONS.md` (“Notes waiting for a Book of Mormon home”).
- **Theme pages are the author's choice.** Each book's `THEME-CANDIDATES.md` opens with the pages the author selected; a candidate is not developed until the author says so.
- **Each theme page and guide says where it stands in its own front matter** (`PAGES.md`, “Where a page stands”): `review: unread` until the author has read it, `review: read` after. `status.mjs` lists them; what waits is in `OPEN-QUESTIONS.md`, “Work waiting its turn.” **Don't remind the author of unread pages** (2026-11-18): the author reads them in their own time, so a summary of what is left leaves them out unless the author asks.

## Plan for the next book

**First the brief** (`content/<book>/BRIEF.md`): divisions and intro, which sources are readable online, the book-wide questions and how the Church's sources answer them, theme candidates, Restoration connections. Its research follows “A book's first research” below. Jeremiah's brief is the model, including its section “What a chapter is for”; “What the author has decided” links to the standing rules and does not copy them. Then set the book up in preview (`DEVELOPMENT.md`, “Adding a new book”).

**Choosing a book is the go-ahead for all of it** (2026-10-23): the brief, the setup and the chapters follow without stopping to ask. The author reads the brief at leisure; a doctrinal choice in it is settled by the standard and recorded there, where the author can overturn it.

**Then the chapters, about twelve to a batch**, each through five steps. The workflow is `.claude/workflows/write-chapters.js`, the agents' instructions are in `.claude/agents/`, and the coordinator's steps around them are in `PROCESS.md` (“Writing a book in batches”).

1. **An Opus writer** researches and writes the chapter and its ledger (`chapter-writer`).
2. **The script checks the ledger** (`scripts/check-ledger.mjs`): every quote confirmed on its page.
3. **A Sonnet checker** reopens the sources, compares each claim with its page, tests the checkable rules, and writes its findings with the sources quoted (`chapter-checker`).
4. **Codex reads the draft** for connected prose and language and writes its findings; it edits nothing and sees no sources (`PROCESS.md`, “The second reader”).
5. **An Opus reviewer** decides both lists of findings and repairs the chapter once, reading for sense and for the standard; what a real gap needs it adds only from a source it reads (`chapter-reviewer`).

Steps 4 and 5 have been in this order since 2026-11-17 (`DECISIONS.md`, “Codex reads before the reviewer”); through Chronicles the reviewer came first and Codex's findings were applied in a separate language pass.

**Why these models.** Opus writes and reviews; Sonnet does the mechanical checking; Codex is the last reader because it is a model of another family. Each choice is the author's, made after a trial; the trials and their results are in `DECISIONS.md` (“Why these models”). Don't change a model without a trial of the same kind.

**What it costs** (measured on Nehemiah's thirteen chapters, 2026-11-17). A batch takes about forty minutes of running time: some 25 to write and check, a few for Codex's readings, under ten to review. Of the agents' spend on a chapter, the writer is about two thirds, the reviewer a fifth and the checker a sixth; a writer takes about 23 steps and ends holding some 130,000 tokens. Measure a batch with `node scripts/batch-usage.cjs <the run's transcript folder> --calls`. Two things keep the count down, and both are in the agents' instructions: each agent works in few steps (every step is sent the whole session again), and nobody reads more than the step needs.

**Theme candidates at the end of a book** (2026-10-13 to 10-23) are found automatically, while the author looks at the image. The last batch of `write-chapters` runs `propose-themes`, in which Fable reads the whole book and proposes arcs (`.cache/batch/<book>/reports/themes-fable.md`); then `batch-finish.mjs` runs `scripts/codex-themes.mjs <book>`, Codex's review of the candidates with ideas of its own (`themes-codex.md`); both files stay there for the author to read if asked. Update the brief's “State of the book” before Codex's review runs: Codex believes the brief. What a candidate must be is in `PAGES.md` (“What earns a theme page”).

- **Show the author one list, combined and cut down.** Merge the arcs the two lists share or that fit one page, drop those only one list supports weakly or that the chapters already carry, and number what is left: a handful, more for a big book. Each entry says which proposals it combines, what it follows in plain steps with the verses quoted, how it leads to Christ, and how it applies to the reader, at enough length to judge. Then one line each for what was left out and why, and the coordinator's recommendation.
- **Only the author's choice goes into `THEME-CANDIDATES.md`**, and no page is written before it.
- **A chosen theme is approved once.** Its outline goes straight to the writer. The research may cut or soften steps, but the outline keeps the theme the author chose: a step that fails is dropped, not replaced by a different arc. Tell the author afterwards, in a line, what the research changed. Only if the chosen theme itself does not survive does it go back to the author, as one question.

**The illustration is the last stage.** Run the book's final batch with `lastBatch: true` and it ends with one candidate image for the author. Approving it, writing its “What's in this picture” key, and what the image tool has taught are in `PROCESS.md` (“Book illustration workflow”).

## Working with the author

**Deciding and asking**

- **Decide, don't defer** (2026-10-03). Settle what the standard or the brief settles and record it where the author can overturn it. A reviewer's question is never passed on as written: the coordinator settles it by the standard, writes the *kind* of decision into the brief once as guidance, and files only what touches doctrine or the author's taste. One or two questions a book is the measure. Three things are not questions: a reviewer's doubt about a page it passed (the verdict stands, and the author overturns it on reading); a report of what a writer did and why (that is the ledger's and the commit's); and a Codex finding declined for taste.
- **One file of open questions** (2026-10-04). Everything that waits for the author is in `OPEN-QUESTIONS.md`, numbered so it can be answered by number; don't start another list anywhere else. A question there is a choice between two named wordings, with what each changes and a recommendation, never a description of a problem. Delete an item once its answer is carried out.
- **Resolving open questions records decisions only** (2026-10-11). Explain each question and recommend an answer, then record the decision and the work it requires. The content changes later, as a separate stage; answered items stay in the file until that work is done.
- **One question at a time** (2026-09-30). End a message with a single decision and hold the rest until it is answered. Give the current content, the concern, and what each choice would change. Keep it in ordinary chat: selection pop-ups disappear when the author is on a phone, and the author often replies from another device.
- **A question is a question** (2026-10-09). When the author asks why something is so, or whether something could be done, answer and wait; start the work when they say to.
- **Don't ask for focus questions before a book is written** (2026-10-06). Writers work from the questions a careful reader would ask (`STANDARDS.md` §3).
- **A design decision comes with a mockup** (2026-10-16). Before asking the author to choose how the site should look or behave, publish a mockup in the site's own fonts and colours with real content: the alternatives side by side or behind a switch, today's version among them.

**What gets written down**

- **Everything a session needs is in these files** (2026-10-09). A rule the author gives, a lesson a session learns, or a fact about what can be read from where goes into the file it belongs to (the table at the end). Nothing about the project is kept only in one tool's private memory.
- **Record guidance, not every judgment call** (2026-10-11). What the next writer needs (a rule, a convention, where a thing is explained) goes into the brief or the standard, in a line. What one reviewer decided about one verse is not recorded anywhere: the chapter, its ledger and its commit are the record.
- **A brief stays brief** (2026-10-11). An agent told to read a long file reads the start of it. A brief holds what every writer, checker and reviewer of the book has to know: its decisions, conventions, the approach to each contested question, where each shared thing is explained, and its sources. It holds no log. Reader questions no source answered go to `content/<book>/UNANSWERED.md`; a section that has done its job is deleted; a brief past about 60 KB is cut before the next batch (`batch-finish.mjs` warns).

**Research and content**

- **A book's first research includes Scripture Central and the Interpreter Foundation** (2026-10-09). Before a brief is drafted, search each site for the book (Scripture Central's archive as well as its KnoWhys; Interpreter's journal as well as its study aids), read what is found, and frame the brief's contested questions from those, BYU's publications and *Scripture Helps*. The brief says what was searched and what was read.
- **Keil comes last, and the manuals are only finders** (2026-10-08; manuals 2026-11-17). Keil and the Student Manual go verse by verse and load in one call, so a session reaches for them out of convenience. A Church teaching manual is never cited, only read for what it cites (`STANDARDS.md` §1). Search the Religious Studies Center, BYU Studies, Scripture Central and *Interpreter* for the book and read the articles through before either is opened; a KnoWhy search alone is not enough. BYU Studies' bibliography by book is a good first stop (`STANDARDS.md` §9). Keil then comes in as one voice, where the others have nothing.
- **Keep a chapter's structure and its notes** (2026-09-29). Don't cut sections or notes, or propose a broad trim, unless the author asks; if they do, ask which sections they skip before cutting.
- **The author's study questions become commentary** (2026-10-04). When the author asks about a verse while studying, answer from sources read in the session, then add the answer to that verse's note with ledger rows: deepen the note; don't restructure the chapter.
- **In a study conversation, answer plainly** (2026-10-05), without sourcing caveats; what is then added to the site keeps the standard. Before saying the site lacks something, search the chapter files (`content/<book>/chapters/*.yaml`) as well as the Markdown pages.
- **Codex reads every new page** (2026-10-07). A chapter, a theme or guide page, a book's landing page, a facsimile page, a volume introduction, the About page: it is read by Codex and the findings decided before the author is shown it (`PROCESS.md`, “The second reader”).

**Time and tokens**

- **Tokens matter** (2026-10-04). The author reaches usage limits. Mechanical work goes to a script or a smaller model, coding included; the most capable model is for judgment and for how the text reads. Don't recommend a costlier arrangement on a hunch: say whose recommendation it is, and give the cost before starting.
- **One stage at a time** (2026-11-10). Don't overlap one batch with the review of the last, or a writer repair with Codex's readings; finish each step before starting the next, so the author has tokens for other things.
- **Offload to scripts what a script can do exactly** (2026-10-04). A step an agent repeats mechanically is a reason to write a script before the next batch. A script saves tokens only when the model never sees its output, so say whether it reduces steps or reading, and measure it. When a check fails in bulk, look for the script's own fault first. Anything that will be run again is committed under `scripts/` or `.claude/workflows/` the first time it is written.
- **Use the hours the author is away.** When the author signs off, carry the approved work through to something they can read in the preview without stopping on questions, and hold only what they have not approved. Don't start a batch while the plan is still being discussed.
- **Few permission prompts** (2026-10-02). Prefer the file-editing tools and the repository's own scripts to shell one-liners, and gather git operations into few commands.

**Where changes go**

- **Where changes go.** A book is written in a worktree of its own: commit chapter content, sources and fixes to the book's branch, one commit a chapter. Merge into `main` only when the author says to (2026-10-24); never fast-forward `main` after a batch. Changes to how the site *looks* stay on a separate branch until the author has seen and approved them.
- **Push only when the live site changes, and say so first** (2026-10-07). Every push to `main` makes Cloudflare rebuild the site, so commits that change nothing a visitor sees stay local: a book in preview, a brief, the standard, the open questions, scripts, an unapproved illustration. When there is something to publish, push once, with whatever has gathered behind it.
- **The live site is pushed only from the local `main`** (2026-10-22). Bring the work into the `main` checkout first, then push `main` itself, so that at every going-live the local `main`, GitHub's `main` and the live site are the same. Between pushes the local `main` may run ahead, never behind. Never push a branch to `origin/main`. If the `main` checkout holds another session's uncommitted edits, save them as a patch, set them aside under a unique stash name, fast-forward, put them back and check they are unchanged; the stash is shared between sessions, so never a bare `stash pop`.
- **Showing a change.** Check a change in the local preview and send the author a screenshot. Push to the `dev` branch only when the author asks (2026-10-18); the dev site is https://scriptures-dev.conlin.io (`DEVELOPMENT.md`, “Hosting”).
- **The author reads mostly on an iPad mini** (744px upright, 1133px sideways). Check layouts there as well as on a laptop and a phone.

## Project files

| File | Holds |
|---|---|
| `STANDARDS.md` | Audience, voice, sourcing rules, evidence ledger, chapter structure, where things can be read |
| `PAGES.md` | The standard for theme pages and guides, and how each is written |
| `PROCESS.md` | The coordinator's steps: a batch, the second reader, theme-page scripts, the illustration, reviewing these instructions |
| `content/<book>/BRIEF.md` | Book-level decisions |
| `OPEN-QUESTIONS.md` | Everything waiting for the author, for every book and the site |
| `content/<book>/THEME-CANDIDATES.md` | Topics for future theme pages, and which were chosen |
| `content/volumes/<volume>/GUIDES.md` | The author's decisions about a volume's guides, and which are written |
| `DEVELOPMENT.md` | Hosting, what each check and research script does, site design, adding a book |
| `DECISIONS.md` | Decisions that frame the site, and the model trials |
| `IDEAS.md` | Ideas not yet planned |
