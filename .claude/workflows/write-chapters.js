export const meta = {
  name: 'write-chapters',
  description: 'Write a batch of chapters of one book and check each against its sources: a writer, then a checker that reopens the sources. Codex reads the drafts next, then review-chapters',
  whenToUse: 'A book has an approved BRIEF.md and the author wants chapters written. args: { book, chapters, writerModel, models, focus }',
  phases: [{ title: 'Write' }, { title: 'Check' }],
}
// args:
//   book         the book's slug (the directory under content/), e.g. 'genesis'
//   chapters     chapter numbers to write, e.g. [27, 28, 29]; about twelve at a time is a good batch
//   writerModel  'opus' (default; author, 2026-10-07, after the test on Jeremiah 19 and 45) or 'sonnet'.
//   focus        optional: the author's focus questions, keyed by chapter number
//   skipKeys     optional: source keys whose rows the checker reads in the ledger only, without page context
//                (default 'lds-scriptures,oshb-wlc,biblehub-interlinear')
//   models       optional chapter numbers of finished chapters of this book to use as models, e.g. [1, 22]
// Two agents per chapter, neither of which sees the other's conversation:
//   chapter-writer (Opus)     researches and writes the chapter and its ledger
//   chapter-checker (Sonnet)  the mechanical half of the review: reopens the sources, compares each claim with
//                             its page, tests the checkable rules, and writes its findings with the sources quoted
// Then, from the shell, Codex reads the drafts (node scripts/codex-read.mjs <book> <from>-<to> --batch), and the
// review-chapters workflow has an Opus reviewer decide both lists of findings and repair each chapter once
// (PROCESS.md, “Writing a book in batches”). Until 2026-11-17 the reviewer ran here and Codex read afterwards,
// with a separate apply stage (codex-pass); that arrangement is this file at commit 584c7225.
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
const results = await pipeline(
  chapters,
  (n) => agent(writePrompt(n), { label: `write:${n}`, phase: 'Write', agentType: 'chapter-writer', model: args.writerModel ?? 'opus' }),
  (w, n) => agent(checkPrompt(n), { label: `check:${n}`, phase: 'Check', agentType: 'chapter-checker', model: 'sonnet' })
    .then((c) => ({ chapter: n, writer: String(w).slice(0, 600), checker: String(c).slice(0, 600) })),
)
const missing = chapters.filter((n, i) => !results[i])
if (missing.length) log(`No result for chapters: ${missing.join(', ')}`)
const range = `${chapters[0]}-${chapters[chapters.length - 1]}`
return { results: results.filter(Boolean), missing,
  next: `${missing.length ? `Run this workflow again with only chapters ${missing.join(', ')}. Then, from` : 'From'} the shell: node scripts/codex-read.mjs ${book} ${range} --batch. Then run the review-chapters workflow with args { book: '${book}', chapters: [${chapters.join(', ')}] }.` }
