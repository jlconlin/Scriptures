# Authoring guide and project status

Where each book stands, how a book is written, and how to work with the author. **The writing and sourcing standard for every book is in [`STANDARDS.md`](STANDARDS.md).** `CLAUDE.md` (and its copy, `AGENTS.md`) lists which file to read for which task.

This file says what is true now. How the work got here is in git (`git log -- AUTHORING.md`), not here: when a status changes, replace the line; don't add to it.

## Status

**Nothing about a single book is recorded in this file or any other top-level file** (author, 2026-10-09: it belongs in commit messages and in the book's own documents, which stay in step with what happened). Three places hold it:

- **`node scripts/status.mjs [book]`** reads the repository and prints where each book stands: chapters written and bare, ledgers, the language pass, theme and guide pages, preview or live, the illustration, the question numbers waiting for the author, and what is not pushed. It is never out of date, because nobody writes it.
- **`content/<book>/BRIEF.md`** holds the book's decisions and whatever about its state a script can't see (“State of the book”, “Decided while writing”): that Jeremiah is finished as written, which Isaiah chapters have been deepened, why Mosiah has two bare chapters.
- **`git log -- content/<book>`** is the book's history, so a commit message says what was done and, where the author decided it, in the author's words: `Daniel: live (author: “Let's go live”)`, `Hosea 4: language pass (Codex's findings, applied by Opus)`. `status.mjs` reads the language pass from these messages; keep that wording.

`OPEN-QUESTIONS.md` stays one file for every book, at the author's request (“Working with the author,” below).

What is true of the whole site:

- **The author has read almost none of it.** Books went live at the author's word before being read, and the open questions are answered as the author studies. Treat every book as open to the author's correction.
- **Rules are for new writing.** A rule is not applied to the books written before it unless the author asks (2026-10-07: “No, we're not going to go over the other books”). `check-content` warnings on older books are information, not a to-do list.
- **Which book is next is the author's choice.** The order has followed the 2026 *Come, Follow Me* schedule since Jeremiah. **No more Book of Mormon content for now** (author, 2026-10-07: “There are many more books in the OT and NT that should come first”); Isaiah notes with a passage that belongs under a Book of Mormon verse wait in `OPEN-QUESTIONS.md` (“Notes waiting for a Book of Mormon home”).
- **Theme pages are the author's choice.** Each book's `THEME-CANDIDATES.md` opens with the pages the author selected; a candidate is not developed until the author says so.

## Plan for the next book

**First the brief** (`content/<book>/BRIEF.md`): divisions and intro, which sources are readable online, the book-wide questions and how the Church's sources answer them, theme candidates, Restoration connections. Its research follows “A book's first research” under “Working with the author” below. Jeremiah's brief is the model, including its section “What a chapter is for”; “What the author has decided” links to the standing rules and does not copy them. Then set the book up (`DEVELOPMENT.md`, “Adding a new book”), in preview, and save the Church's footnotes for every chapter (`node scripts/footnotes.mjs <book> <n>` into `.cache/batch/<book>/fn<n>.txt`).

**Then the chapters, about twelve to a batch**, each through five steps. The Workflow script is `.claude/workflows/write-chapters.js`, and the coordinator's steps around it are scripts too (`DEVELOPMENT.md`, “Writing a book in batches”). The agents' instructions are in `.claude/agents/`.

1. **An Opus writer** researches and writes the chapter and its ledger (`chapter-writer`).
2. **The script checks the ledger** (`scripts/check-ledger.mjs`): every quote confirmed on its page.
3. **A Sonnet checker** reopens the sources, compares each claim with its page, tests the checkable rules, and writes its findings with the sources quoted (`chapter-checker`).
4. **An Opus reviewer** decides the findings and repairs the chapter, reading for sense and for the standard, without reopening the sources (`chapter-reviewer`).
5. **Codex reads for language, and Opus applies what holds up** (next section).

**Why these models** (the author's decisions):

- Opus writes (2026-10-07: “I think this settles it that Opus is the right model for writing”). In a test on two chapters, scored against the questions a reader would ask, Opus answered the most and asked the follow-up question; Sonnet dropped questions it had asked; Haiku's answers were thin, and review did not close the gap. The author's measure: “More notes is not necessarily better. The best would be the one that best anticipates the questions a human might ask and then finds answers to those questions.”
- Sonnet does the mechanical checking, and Opus the judging (2026-10-04: “We don't need Opus to make sure links exist and that kind of things. Opus may be helpful for reviewing text and making sure it reads right”; “I don't want to go all the way to Sonnet”).
- Codex is the last reader because it is a model of another family (2026-10-07: “a very useful fourth step”). About nine in ten of its findings were worth acting on, and none had been caught by the Opus reviewer.

**What it costs.** A chapter takes 350,000 to 500,000 tokens through steps 1–4 and about 120,000 for step 5; a batch of twelve takes 40 to 50 minutes. Measure a batch with `node scripts/batch-usage.cjs <the run's transcript folder> --calls`. Two things keep the count down, and both are in the agents' instructions: each agent works in few steps (every step is sent the whole session again), and nobody reads more than the step needs (the checker skips rows that quote scripture and the Hebrew text; the reviewer does not read the ledger through).

**The illustration is the last stage.** Run the book's final batch with `lastBatch: true` and it ends by running `.claude/workflows/create-book-art.js`: a `book-art-director` writes a proposed visual brief from the finished book, and `scripts/book-art.mjs generate <book>` has Codex draw one candidate. Show it to the author; only after approval run `node scripts/book-art.mjs approve <book>` (`DEVELOPMENT.md`, “Book illustration workflow”). When a detailed brief keeps missing, try a generic prompt that leaves the subject to Codex; that is what worked for Daniel. When one object keeps coming out wrong, take it out: Joel's ram's horn was drawn seven times (as a drinking horn, a smoking pipe, balanced on its curve, hanging as no horn would hang) before the author said “Maybe the horn isn't the right approach here since you can't get it right” (2026-10-10). The image tool does not get a small object's shape or the way it rests and hangs right by being told more, so a miss or two is no reason to give up on an object, but after about five, try something new: change the picture, not the description (author, 2026-10-10: “two misses are not bad. A lot of misses is worth trying something new. Why don't we set the limit at 5”). Two more things Joel's image taught: the tool fills space by repeating things, so a scene that looks too regular (rows of vines, a patchwork of fields, a river of even bends) is fixed by asking for fewer and larger things, not for irregularity; and the light has to be what the scene's own sources would give. A picture may have several lights where that is natural (author, 2026-10-10: “The moon with glowing stars has multiple glowing things, but that is natural”); what was wrong in Joel's was a low red sun on the dark side beside bright daylight on the other (“With the red sun on the left, you wouldn't get the bright light on the right”). Say in the brief where the light comes from and which way the shadows fall, and check each candidate for light that nothing in it could cast.

**Lessons for the coordinator:**

- Don't change the session's working directory while a batch runs; agents started afterwards work in the other copy.
- An agent sometimes refuses to write its report or findings file, taking an instruction against writing documents to forbid it. Save its final message as the file.
- A reviewer may pull an earlier version of a chapter out of git when one exists. If it does, redo the review.
- `check-ledger` passes a Hebrew row whose quoted word is on the page but is the wrong word for its claim. A reviewer still reads the Hebrew rows against their claims.
- If a batch is cut off, run it again with only the chapters that were not finished. Resuming a whole run after one agent failed once sent all twelve chapters again.
- Ask a theme researcher for a dossier under about 400 lines, with script output summarized. Longer ones are more than the coordinator can read whole when outlining.
- After a batch, see how much of it rests on the Student Manual and on older commentaries, and list for the author where the manual is still the frame (as H9 does for Hosea).

## The language pass, in a session of its own

Step 5 may run in a separate session from the one writing chapters (author, 2026-10-07). That session works **in the main checkout, on `main`**; a writing session in a worktree fast-forwards `main` to its branch whenever a batch is committed, so a chapter on `main` is finished and ready for the pass.

**What is waiting.** A chapter has had the pass when a commit says so:

```sh
git log --format=%s --grep "language pass" -- content/<book>/chapters | sort -V   # done
ls content/<book>/chapters                                                          # written
```

Take a batch whole, so its chapters can also be read side by side.

**Run it.** Say “run the codex-pass workflow on Ezekiel 25–36” (or call it: `Workflow({ name: "codex-pass", args: { book: "ezekiel", chapters: [25, …, 36] } })`). It needs the `codex` CLI signed in (`codex login status`). For each chapter a small agent runs `node scripts/codex-read.mjs <book> <n>` (Codex, read-only: it edits nothing and judges no citation; it writes numbered findings to `.cache/batch/<book>/reports/NN-codex.md`, and reads the batch side by side first), then an Opus agent decides each finding, edits only that chapter's two files, cutting, merging and rewording but adding nothing, and reruns `check-chapter`. The Sonnet source check is not repeated, since no claim is added.

**Codex's own limit** is the ChatGPT plan's, not Claude's. It ran out after about 70 readings a window when Codex opened the files itself; `--inline` (the chapter's text in the prompt) takes about a third less, and a smaller Codex model less again, with somewhat fewer findings (`codexModel`). Run Codex's readings first, a few at a time from the shell, then the workflow, which skips a reading whose file exists. A reading that hangs is killed and run again; run a few readings to a command and look at the findings files’ times, since one long loop once sat on a single chapter for 25 minutes.

**Run the pass when the author’s last word was about the chapters.** The harness shows each agent the author’s latest message as the request; when that was about something else (an illustration, once), five of fourteen Opus agents judged a copy-edit outside it and made no edits. Expect to run such refusals again.

**Then, as coordinator:**

1. `node scripts/check-pass.mjs <book> <chapters…>`: what the edits added, beside the last commit. New references should only be pointers to another chapter's note; no ledger row should have been added; a “new or changed quotation” is usually an old one whose closing punctuation moved, so look at any that is not.
2. `node scripts/check-chapter.mjs <book> <n>` for each chapter. Warnings about commentaries read on Bible Hub were there before the pass and stay.
3. Read each agent's `declined` list in the workflow's result: a finding declined for a reason that touches doctrine or the author's taste goes to `OPEN-QUESTIONS.md`; the rest need nothing.
4. Commit one chapter at a time, the chapter with its ledger: `Ezekiel 25: language pass (Codex's findings, applied by Opus)`. Commit to `main`; don't push a book in preview.
5. Touch nothing but those chapters' files. The writing session owns `content/sources.yaml`, the brief, `THEME-CANDIDATES.md`, and the chapters not yet on `main`.

**Other pages** (a theme or guide page, a book page, a facsimile page, the About page) are read one at a time, with no workflow: `node scripts/codex-read.mjs <book> <page file name>`, `<book> book`, `<book> facsimile-<n>`, or `--file <path>`; apply the findings that hold up, adding nothing, and rerun that page's checks (`check-content <book> <page>` and `check-ledger <book> <page>` for a theme page; the build for a book page).

## Working with the author

- **Everything a session needs is in these files** (author, 2026-10-09: “update all the documentation so that we don't have to rely upon your memory”). A rule the author gives, a lesson a session learns, or a fact about what can be read from where is written into the file it belongs to (the table at the end), so that any assistant starting from `CLAUDE.md` or `AGENTS.md` has it. Nothing about the project is kept only in one tool's private memory.
- **One question at a time** (author, 2026-09-30: “Do one at a time. I can't respond to all of them very easily”). End a message with a single decision and hold the rest until it is answered; offer one plain candidate with a recommendation, ask once, record the answer. The author often replies from a comment thread on the preview, on another device.
- **A question is a question** (author, 2026-10-09: “I didn't ask you to do it, I asked the question: why don't we do it”). When the author asks why something is so, or whether something could be done, answer and wait; start the work when they say to.
- **Decide, don't defer** (author, 2026-10-03: “Do not save for me what you can decide on your own”). Settle what the standard or the brief settles and record it where the author can overturn it; bring only what needs the author.
- **One file of open questions.** Everything that waits for the author, for every book and the site, is in `OPEN-QUESTIONS.md`, numbered so it can be answered by number (author, 2026-10-04: “I can't keep track of those that are in multiple places”). Don't start another list anywhere else. A judgment call the standard or the brief settles is recorded in the book's brief (“Decided while writing”). Delete an item once its answer is carried out.
- **Keep a chapter's structure and its notes** (author, 2026-09-29, of a trimmed sample of Isaiah 58 that went from nine notes to six, lost Explore and Seeing Christ and halved the setting and thread: “I don't like what you did to 58. Go back”). Don't cut sections or notes, or propose a broad trim, unless the author asks; if they do, ask which sections they skip before cutting.
- **Use the hours the author is away.** The author likes long work to run while they are gone. When they sign off, carry the approved work through to something they can read in the preview without stopping on questions, and hold only what they have not approved. Don't start a batch while the plan is still being discussed.
- **Tokens matter** (author, 2026-10-04: “it felt through Genesis that we were using Opus more than we needed to”). The author reaches usage limits. Mechanical work goes to a script or a smaller model, coding included; the most capable model is for judgment and for how the text reads. Don't recommend a costlier arrangement on a hunch: say whose recommendation it is, and give the cost before starting.
- **Offload to scripts what a script can do exactly** (author, 2026-10-04: “Anywhere we can write a script to offload AI use to a simple script is a good idea”). A step an agent repeats mechanically (fetching, searching, counting, comparing a quote with a page, listing what the site already says) is a reason to write a script before the next batch. Three things learned: a script saves tokens only when the model never sees its output (a check that prints pass or fail; a script that prints a page for an agent to read saves nothing), so before proposing one as a saving, say whether it reduces steps or reading, and measure it; when a check fails in bulk, look for the script's own fault before sending the rows to a model; and anything that will be run again is committed under `scripts/` or `.claude/workflows/` the first time it is written.
- **Few permission prompts** (author, 2026-10-02: “Why do you keep asking for my permission?”). Prompts come from shell commands the session's permissions don't cover (a push, an inline script that edits files, `sed -i`, a long pipeline). Prefer the file-editing tools and the repository's own scripts to shell one-liners, and gather git operations into few commands.
- **Where changes go.** Commit chapter content, sources, and fixes directly to `main`, one commit a chapter. **Push only when the live site changes, and say so first** (author, 2026-10-07: “We should be cautious about pushing to main. I don't need CloudFlare to build a new site when nothing has changed”). Every push to `main` makes Cloudflare rebuild the site, so commits that change nothing a visitor sees stay local until something does: a book still in preview, a brief, the standard, the open questions, scripts, an unapproved illustration. When there is something to publish, push once, with whatever has gathered behind it. Changes to how the site *looks* (layout, widths, new interface features) go on a separate branch until the author has seen and approved them; then fast-forward `main`.
- **Showing a change.** Before a change is pushed, show it in the private claude.ai preview artifact (https://claude.ai/artifact/W1iHyLZVvWzuCeSvoDZCTS): run `node scripts/preview-site.mjs`, which builds the site with books still in preview and makes every link relative, then republish `.cache/preview/dist` to the same artifact (`index.html` as the page, the files listed in `.cache/preview/files.json` beside it). The author reviews there and can leave comments on specific passages. Once pushed, changes are live at https://scriptures.conlin.io.
- **The author reads mostly on an iPad mini** (744px upright, 1133px sideways). Check layouts there as well as on a laptop and a phone.
- **A book's first research includes Scripture Central and the Interpreter Foundation** (author, 2026-10-09: “Please make sure that you include both of those sites in your initial research. They are good sources and stay true to the doctrines of the Church. They strike a good academic balance”). Before a brief is drafted, search each site by itself for the book (Scripture Central's archive of articles and book chapters as well as its KnoWhys; Interpreter's journal as well as its study aids), read what is found, and frame the brief's contested questions from those, BYU's publications and *Scripture Helps* before the Student Manual or an older commentary is opened. The brief says what was searched and what was read.
- **Keil and the Student Manual come last** (author, 2026-10-08, of Daniel's brief: “Why do you like Keil so much? There's got to be other sources we can draw upon”; 2026-10-09, of Hosea's: “you still jump to the student manual quite quickly”). Both go verse by verse and load in one call, so a session reaches for them out of convenience; `STANDARDS.md` §1 ranks them below BYU, Scripture Central and *Interpreter*. For a brief, search the Religious Studies Center, BYU Studies, Scripture Central and *Interpreter* for the book and read the articles through before either is opened; a KnoWhy search alone is not enough. BYU Studies' bibliography of Latter-day Saint writing on the Old Testament, by book, is a good first stop (`STANDARDS.md` §9). The manual and Keil then come in as one voice each, where the others have nothing.
- **Don't ask for focus questions before a book is written** (author, 2026-10-06: “I typically won't have focus questions while generating the books. Only after I start studying them in more depth will I get that”). Writers work from the questions a careful reader would ask (`STANDARDS.md` §3).
- **The author's study questions become commentary** (author, 2026-10-04). When the author asks about a verse while studying, answer from sources read in the session, then add the answer to that verse's note with ledger rows: deepen the existing note; don't restructure the chapter.
- **In a study conversation, answer plainly** (author, 2026-10-05: “for an interactive session like this, strict adherence to a citation is not necessary”). When the author asks about a verse in chat, answer without sourcing caveats. What is then added to the site keeps the standard. Before saying the site lacks something, search the chapter files (`content/<book>/chapters/*.yaml`) as well as the Markdown pages.
- **Codex reads every new page** (author, 2026-10-07: “whenever we create a page, we should have codex check it”). A chapter, a theme or guide page, a book's landing page (`book.yaml`), a facsimile page, a volume introduction, the About page: once it is written and has passed its own review, it gets the language pass above before the author is shown it.
- The per-chapter workflow is in `STANDARDS.md` §10–11; the theme-page workflow (research, outline, writing, review) is in §8.

## Project files

| File | Holds |
|---|---|
| `STANDARDS.md` | Audience, voice, sourcing rules, evidence ledger, chapter structure, research tools, checks, review process |
| `content/<book>/BRIEF.md` | Book-level decisions |
| `OPEN-QUESTIONS.md` | Everything waiting for the author, for every book and the site |
| `content/<book>/THEME-CANDIDATES.md` | Topics for future theme pages, and which were chosen |
| `DEVELOPMENT.md` | Hosting, site design, the scripts, how books are built, adding a book |
| `IDEAS.md` | Ideas not yet planned |
| `DECISIONS.md` | Decisions that frame the site |
