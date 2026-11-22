export const meta = {
  name: 'write-chapters',
  description: 'Write a batch of chapters of one book, each going straight on from writer to checker to Codex to reviewer, then Codex reads the batch side by side and an Opus pass applies what it finds',
  whenToUse: 'A book has an approved BRIEF.md and the author wants chapters written. args: { book, chapters, writerModel, reviewerModel, models, focus, lastBatch, themes }',
  phases: [{ title: 'Write' }, { title: 'Check' }, { title: 'Codex' }, { title: 'Review' }, { title: 'Across' }],
}
// args:
//   book         the book's slug (the directory under content/), e.g. 'genesis'
//   chapters     chapter numbers to write, e.g. [27, 28, 29]; about twelve at a time is a good batch
//   writerModel  'opus' (default; author, 2026-10-07, after the test on Jeremiah 19 and 45) or 'sonnet'.
//   focus        optional: the author's focus questions, keyed by chapter number
//   skipKeys     optional: source keys whose rows the checker reads in the ledger only, without page context
//                (default 'lds-scriptures,oshb-wlc,biblehub-interlinear')
//   models       optional chapter numbers of finished chapters of this book to use as models, e.g. [1, 22]
//   reviewerModel 'opus' (default) or 'sonnet', passed to review-chapters
//   lastBatch    true when these chapters finish the book: after the side-by-side pass, create-book-art and
//                propose-themes run, as review-chapters did before (skipped if any chapter is not ready)
//   themes       false for a book the author has said needs no theme pages
// Each chapter goes on through four stages as soon as the one before it finishes, never waiting for the
// other chapters (author, 2026-11-22: “Codex should have started as soon as a review was completed. No need to
// finish all of them in order to start the first codex check”):
//   chapter-writer (Opus)     researches and writes the chapter and its ledger
//   chapter-checker (Sonnet)  the mechanical half of the review: reopens the sources, compares each claim with
//                             its page, tests the checkable rules, and writes its findings with the sources quoted
//   codex                     a Sonnet agent runs node scripts/codex-read.mjs <book> <n> --inline (reports/NN-codex.md)
//   review-chapters           for this chapter alone: an Opus reviewer decides the checker's and Codex's findings
// Only the side-by-side reading waits for the whole batch: once every chapter is reviewed, Codex reads the batch
// together (--across, reports/NN-NN-codex.md) and one Opus chapter-reviewer applies the items that hold up to the
// chapters they name. Then, from the shell, node scripts/batch-finish.mjs on this run's journal commits each chapter
// (PROCESS.md, “Writing a book in batches”). Until 2026-11-22 the review was a separate workflow run after the whole
// batch was written and Codex had read it from the shell; that arrangement is this file at commit 6ac80997.
// Each agent works in the repository and leaves working files in .cache/batch/<book>/ (not committed):
// proposed/NN.yaml, the sources.yaml entries the chapter needs, reports/NN-writer.md and reports/NN-check.md.
const book = args.book
const scratch = `.cache/batch/${book}`
const pad = (n) => String(n).padStart(2, '0')
// Rows the checker does not print page context for: the scripture text and the Hebrew text themselves
// (about two rows in five; the claim is what the verse reads, and check-ledger has confirmed the words).
const skipKeys = args.skipKeys ?? 'lds-scriptures,oshb-wlc,biblehub-interlinear'
const models = (args.models ?? []).map((m) => `content/${book}/chapters/${pad(m)}.yaml`)
const common = (n) => `Read content/${book}/BRIEF.md in full first: it carries the author's decisions for this book, its conventions, the approach to each contested question, and the sources tested for it with their URL patterns.${models.length ? ` ${models.join(' and ')} ${models.length > 1 ? 'are finished, reviewed chapters' : 'is a finished, reviewed chapter'} of this book: use ${models.length > 1 ? 'them' : 'it'} as the model of length, voice and layout.` : ''}

Work in few steps, as your agent instructions say. Many chapters are being written at the same time: touch only chapter ${n}'s files, never content/sources.yaml. The one exception is for the writer: where the brief names research files shared between books (the Gospels' story files in content/volumes/new-testament/stories/), the writer of this chapter is asked to write and correct those for this chapter's stories, as the brief says. Run the checks with node scripts/check-chapter.mjs ${book} ${n}; a build message that names another chapter is not yours. If churchofjesuschrist.org fails to resolve, the scripts retry; if it still fails, wait a minute and try again, which is not a reason to give it up. Other chapters of the book may be unwritten, so [[references]] to them link to the Gospel Library for now; that is expected. Where this chapter repeats or depends on a passage in another chapter, explain what this chapter needs briefly and point to the other chapter with a [[reference]].`
const writePrompt = (n) => `Write chapter ${n} of ${book} (book: ${book}, chapter: ${n}). ${args.focus?.[n] ? `The author's focus questions for this chapter: ${args.focus[n]}` : 'The author gave no focus questions: work from the questions a careful reader would ask.'}

${common(n)}

An earlier run may have been cut off partway: if content/${book}/chapters/${pad(n)}.yaml or its ledger content/${book}/evidence/${pad(n)}.yaml already exists, it is an unfinished draft of this chapter by a writer like you, not a reviewed chapter. Read both, keep what is sound, and finish the work from there rather than starting over; every claim still needs its ledger row, and the two working files below are still yours to write.

When you finish, besides the chapter and its ledger, write two working files (create the folders if they are missing):
1. ${scratch}/proposed/${pad(n)}.yaml : the sources.yaml entries you propose, one per line in that file's one-line format (key: { type, author, title, pub, url }), each URL opened and its heading confirmed in this session. Leave the file empty if you propose none.
2. ${scratch}/reports/${pad(n)}-writer.md : your report: the reader questions you worked from and which went unanswered; what you decided on your own and why (one line each); anything that truly needs the author's judgment (doctrine or taste the standard and brief don't settle; expect this to be rare); theme candidates; what you cut for lack of a source; the check output.
Run node scripts/check-sources.mjs ${book} ${n} on your proposed file and node scripts/check-chapter.mjs ${book} ${n}, and fix what they find. Your final message is one short paragraph: done or not, note count, word count, and anything that blocked you.`
const checkPrompt = (n) => `Check chapter ${n} of ${book} (book: ${book}, chapter: ${n}): content/${book}/chapters/${pad(n)}.yaml with its ledger content/${book}/evidence/${pad(n)}.yaml. You did not write it.

${common(n)}

The writer's report is at ${scratch}/reports/${pad(n)}-writer.md and its proposed sources.yaml entries at ${scratch}/proposed/${pad(n)}.yaml; keep that proposed file accurate. Write your findings to ${scratch}/reports/${pad(n)}-check.md. That file is required working output, the reviewer's input in this pipeline, not a report or documentation file: write it. If the write fails, save your full findings anywhere under ${scratch}/reports/ and say where in your final message.

Do the reading with the scripts your instructions name, not one fetch at a time. The skip list for this book: node scripts/ledger-context.mjs ${book} ${n} --skip-keys ${skipKeys}.`
const chapters = args.chapters
const codexPrompt = (n) => `From the repository root, run: node scripts/codex-read.mjs ${book} ${n} --inline
It is Codex's reading of chapter ${n} of ${book} and takes several minutes. Run it in the foreground with the Bash tool's longest timeout (600000 ms); don't poll, sleep or run anything else meanwhile. If the command is cut off by the timeout, look at ${scratch}/reports/${pad(n)}-codex.md: if it was written in this run and is not empty, that is the reading; otherwise run the command once more. Change no file yourself. Your final message is one line: the last line the command printed, or what failed.`
const results = await pipeline(
  chapters,
  (n) => agent(writePrompt(n), { label: `write:${n}`, phase: 'Write', agentType: 'chapter-writer', model: args.writerModel ?? 'opus' }),
  (w, n) => {
    if (!w) throw new Error(`no writer result for ${n}`)
    return agent(checkPrompt(n), { label: `check:${n}`, phase: 'Check', agentType: 'chapter-checker', model: 'sonnet' })
      .then((c) => ({ writer: String(w).slice(0, 600), checker: String(c ?? '').slice(0, 600) }))
  },
  (prev, n) => agent(codexPrompt(n), { label: `codex:${n}`, phase: 'Codex', model: 'sonnet', effort: 'low' })
    .then((c) => ({ ...prev, codex: String(c ?? '').slice(0, 300) })),
  (prev, n) => workflow('review-chapters', { book, chapters: [n], models: args.models, reviewerModel: args.reviewerModel, lastBatch: false, themes: false })
    .then((r) => ({ chapter: n, ...prev, review: r?.results?.[0]?.review ?? null })),
)
const done = results.filter(Boolean)
const missing = chapters.filter((n, i) => !results[i] || !results[i].review)
if (missing.length) log(`No review for chapters: ${missing.join(', ')}`)
// The side-by-side reading needs the whole batch, so it is the one stage that waits.
let across = null
const reviewed = done.filter((r) => r.review).map((r) => r.chapter)
if (reviewed.length > 1) {
  const range = `${reviewed[0]}-${reviewed[reviewed.length - 1]}`
  const acrossFile = `${scratch}/reports/${range.split('-').map(Number).map(pad).join('-')}-codex.md`
  await agent(`From the repository root, run: node scripts/codex-read.mjs ${book} ${range} --across
It is Codex's reading of chapters ${range.replace('-', '–')} of ${book} side by side and takes several minutes. Run it in the foreground with the Bash tool's longest timeout (600000 ms); don't poll or sleep. If it is cut off by the timeout, look at ${acrossFile}: if it was written in this run and is not empty, that is the reading; otherwise run the command once more. Change no file yourself. Your final message is one line: the last line the command printed, or what failed.`, { label: `codex:${range}`, phase: 'Across', model: 'sonnet', effort: 'low' })
  across = await agent(`Codex has read chapters ${range.replace('-', '–')} of ${book} side by side, after each was reviewed alone: ${acrossFile}. It saw no sources. Its items are about what one chapter repeats, contradicts or leaves out of another, and about the batch's language. Every chapter has already passed its own review, so this is a short pass over those items only.

Read content/${book}/BRIEF.md first. For each item: decide it as your agent instructions say for the second reader's findings, against the chapters as they now stand (one may already have been repaired by its reviewer). Where it holds, make the repair in the chapter or chapters it names: usually one explanation kept and a [[reference]] to it from the others, or a contradiction settled from the sources the ledgers already cite. Add nothing that needs a new source. Touch only the chapters' files and ledgers, never content/sources.yaml; rerun node scripts/check-chapter.mjs ${book} <n> for each chapter you change. Your final message: one line per item (acted on or declined, and why), then the chapters you changed.`, { label: `across:${range}`, phase: 'Across', agentType: 'chapter-reviewer', model: args.reviewerModel ?? 'opus' })
}
// The book's illustration and theme proposals, when this batch finishes the book (PROCESS.md).
let art = null
let themes = null
let next = null
if (args.lastBatch) {
  const notReady = done.filter((r) => !r.review?.ready).map((r) => r.chapter)
  const runArt = `run the create-book-art workflow with args { book: '${book}' }`
  if (missing.length || notReady.length) next = `Book art not started: ${[missing.length ? `no review for ${missing.join(', ')}` : '', notReady.length ? `not ready: ${notReady.join(', ')}` : ''].filter(Boolean).join('; ')}. Once those chapters pass review, ${runArt}.`
  else {
    try { art = await workflow('create-book-art', { book }); next = art.next } catch (err) { next = `Book art failed to start (${err.message}): ${runArt}.` }
    if (args.themes !== false) {
      const leads = done.flatMap((r) => (r.review?.themeCandidates ?? []).map((t) => `(${r.chapter}) ${t}`))
      try { themes = await workflow('propose-themes', { book, leads }) } catch (err) { log(`Theme proposals failed to start (${err.message}): run the propose-themes workflow with args { book: '${book}' }.`) }
    }
  }
}
const sum = (f) => done.reduce((t, r) => t + (Number(r.review?.[f]) || 0), 0)
return { results: done.map((r) => ({ chapter: r.chapter, ready: r.review?.ready ?? false, summary: r.review?.summary, open: r.review?.open, checker: r.checker })),
  missing, notReady: done.filter((r) => r.review && !r.review.ready).map((r) => r.chapter), across: String(across ?? '').slice(0, 2000), art, themes,
  counts: { checkerFindings: sum('checkerFindings'), checkerActedOn: sum('checkerActedOn'), codexFindings: sum('codexFindings'), codexActedOn: sum('codexActedOn') },
  next: next ?? `${missing.length ? `Run this workflow again with only chapters ${missing.join(', ')} (or review-chapters for a chapter that has its draft). Then ` : ''}node scripts/batch-finish.mjs ${book} <this run's journal.jsonl> <question prefix> commits each ready chapter with the record of its prose review.` }
