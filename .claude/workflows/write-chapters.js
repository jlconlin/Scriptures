export const meta = {
  name: 'write-chapters',
  description: 'Write and review a batch of chapters of one book: a writer, a checker that reopens the sources, then a reviewer',
  whenToUse: 'A book has an approved BRIEF.md and the author wants chapters written. args: { book, chapters, writerModel, models, focus, lastBatch }',
  phases: [{ title: 'Write' }, { title: 'Check' }, { title: 'Review' }],
}
// args:
//   book         the book's slug (the directory under content/), e.g. 'genesis'
//   chapters     chapter numbers to write, e.g. [27, 28, 29]; about twelve at a time is a good batch
//   writerModel  'opus' (default; author, 2026-10-07, after the test on Jeremiah 19 and 45) or 'sonnet'.
//   reviewerModel 'opus' (default) or 'sonnet', for the last step
//   focus        optional: the author's focus questions, keyed by chapter number
//   skipKeys     optional: source keys whose rows the checker reads in the ledger only, without page context
//                (default 'lds-scriptures,oshb-wlc,biblehub-interlinear')
// Three agents per chapter, none of which sees another's conversation:
//   chapter-writer (Opus)     researches and writes the chapter and its ledger
//   chapter-checker (Sonnet)  the mechanical half of the review: reopens the sources, compares each claim with
//                             its page, tests the checkable rules, and writes its findings with the sources quoted
//   chapter-reviewer (Opus, or Sonnet if asked)  the judgment: decides each finding and repairs the chapter, without reopening sources
// Opus writes and reviews; the checking between them is Sonnet's (author, 2026-10-04: Opus need not be the one to see that pages exist).
//   models       optional chapter numbers of finished chapters of this book to use as models, e.g. [1, 22]
//   lastBatch    true when these chapters finish the book. If every reviewer then reports its chapter ready,
//                the batch ends by running create-book-art (the book-art-director's visual brief, then one
//                candidate image drawn by Codex); otherwise it says why not, and the coordinator runs create-book-art after the repairs.
// Each agent works in the repository. Writers and reviewers leave two working files per chapter in
// .cache/batch/<book>/ (not committed): proposed/NN.yaml, the sources.yaml entries the chapter needs, and
// reports/NN-writer.md and reports/NN-check.md. Afterwards the coordinator runs scripts/merge-sources.mjs and scripts/batch-notes.mjs,
// then the checks, and commits one chapter at a time (STANDARDS.md §11).
const book = args.book
const scratch = `.cache/batch/${book}`
const pad = (n) => String(n).padStart(2, '0')
// Rows the checker does not print page context for: the scripture text and the Hebrew text themselves
// (about two rows in five; the claim is what the verse reads, and check-ledger has confirmed the words).
const skipKeys = args.skipKeys ?? 'lds-scriptures,oshb-wlc,biblehub-interlinear'
const models = (args.models ?? []).map((m) => `content/${book}/chapters/${pad(m)}.yaml`)
const common = (n) => `Read content/${book}/BRIEF.md in full first: it carries the author's decisions for this book, its conventions, the approach to each contested question, the sources tested for it with their URL patterns, and the check commands for a book in preview. If the book has a CHURCH-STATEMENTS.md, it points to the Church's own statements on the contested questions (quote from the pages it points to, not from that file).${models.length ? ` ${models.join(' and ')} ${models.length > 1 ? 'are finished, reviewed chapters' : 'is a finished, reviewed chapter'} of this book: use ${models.length > 1 ? 'them' : 'it'} as the model of length, voice and layout.` : ''}

Work in few steps: every message in which you call a tool is charged for all you have read so far, so call several tools in one message whenever the calls don't depend on each other (your agent instructions say how).

Practical points: read pages with node scripts/source.mjs '<url>' (it handles the Church's pages and their footnotes, Scripture Central, the Joseph Smith Papers, PDFs, Bible Hub and the rest, shares a cache with the other agents, and prints only the paragraphs you ask for with --find or --para), start a chapter with node scripts/footnotes.mjs ${book} ${n}, and use node scripts/hebrew.mjs for the Hebrew; curl is the fallback. If churchofjesuschrist.org fails to resolve, the scripts retry; if it still fails, wait a minute and try again, which is not a reason to give it up. Many chapters are being written at the same time: touch only chapter ${n}'s files, never content/sources.yaml. Run the checks with node scripts/check-chapter.mjs ${book} ${n}: it runs fix-yaml, the build (PREVIEW=1, into ${scratch}/dist-${pad(n)}, so a book in preview is built and no other chapter's output is touched), check-quotes, check-content (your chapter's proposed entries are added in memory: no scratch copy of content/, no --root) and check-ledger, and prints only the lines that concern chapter ${n}. A build message that names another chapter is not yours. Other chapters of the book may be unwritten, so [[references]] to them link to the Gospel Library for now; that is expected. Where this chapter repeats or depends on a passage in another chapter, explain what this chapter needs briefly and point to the other chapter with a [[reference]].`
const writePrompt = (n) => `Write chapter ${n} of ${book} (book: ${book}, chapter: ${n}). ${args.focus?.[n] ? `The author's focus questions for this chapter: ${args.focus[n]}` : 'The author gave no focus questions: work from the questions a careful reader would ask.'}

${common(n)}

Check content/sources.yaml for the sources you can already cite; propose an entry only for one that is not there.

An earlier run may have been cut off partway: if content/${book}/chapters/${pad(n)}.yaml or its ledger content/${book}/evidence/${pad(n)}.yaml already exists, it is an unfinished draft of this chapter by a writer like you, not a reviewed chapter. Read both, keep what is sound, and finish the work from there rather than starting over; every claim still needs its ledger row, and the two working files below are still yours to write.

When you finish, besides the chapter and its ledger, write two working files (create the folders if they are missing):
1. ${scratch}/proposed/${pad(n)}.yaml : the sources.yaml entries you propose, one per line in that file's one-line format (key: { type, author, title, pub, url }), each URL opened and its heading confirmed in this session. Leave the file empty if you propose none.
2. ${scratch}/reports/${pad(n)}-writer.md : your report: the reader questions you worked from and which went unanswered; what you decided on your own and why (one line each); anything that truly needs the author's judgment (doctrine or taste the standard and brief don't settle; expect this to be rare); theme candidates; what you cut for lack of a source; the check output.
Find the KnoWhys that bear on the chapter with node scripts/knowhys.mjs ${book} ${n}. Run node scripts/check-sources.mjs ${book} ${n} on your proposed file (it sets each entry's title, author and pub beside the page's own and flags what is wrong) and node scripts/check-chapter.mjs ${book} ${n}, and fix what they find. Your final message is one short paragraph: done or not, note count, word count, and anything that blocked you.`
const checkPrompt = (n) => `Check chapter ${n} of ${book} (book: ${book}, chapter: ${n}): content/${book}/chapters/${pad(n)}.yaml with its ledger content/${book}/evidence/${pad(n)}.yaml. You did not write it.

${common(n)}

The writer's report is at ${scratch}/reports/${pad(n)}-writer.md and its proposed sources.yaml entries at ${scratch}/proposed/${pad(n)}.yaml; keep that proposed file accurate. Write your findings to ${scratch}/reports/${pad(n)}-check.md.

Do the reading with the scripts, not one fetch at a time: start the source comparison from node scripts/ledger-context.mjs ${book} ${n} --skip-keys ${skipKeys} (each ledger row with the paragraph that holds its quote and the paragraphs around it, under the chapter text it supports; the rows that quote the scripture and Hebrew text themselves are left out, and you compare a sample of those in the ledger file; use source.mjs only to read further), check the proposed entries with node scripts/check-sources.mjs ${book} ${n}, compare the notes with the Gospel Library with node scripts/footnotes.mjs ${book} ${n} --compare, and run the checks with node scripts/check-chapter.mjs ${book} ${n}.`
const reviewPrompt = (n) => `Review chapter ${n} of ${book} (book: ${book}, chapter: ${n}): content/${book}/chapters/${pad(n)}.yaml with its ledger content/${book}/evidence/${pad(n)}.yaml. You did not write it.

${common(n)}

The checker's findings are at ${scratch}/reports/${pad(n)}-check.md, the writer's report at ${scratch}/reports/${pad(n)}-writer.md, and the proposed sources.yaml entries at ${scratch}/proposed/${pad(n)}.yaml. The script has confirmed the ledger's quotes and the checker has reopened the sources, so work from the chapter and the findings, without reading the ledger through (read a note's rows when you repair that note): decide every finding, and open a page yourself only when a finding can't be settled from what it quotes. Make the repairs in as few messages as you can, several edits in each.

Test in particular: no note only repeats what the Gospel Library puts beside the verse (a footnote, the chapter heading, the JST, Scripture Helps); a note goes further or is cut. Where a note starts from Scripture Helps, the work its endnote cites was looked for and is cited if it is readable and used. The contested questions follow the brief. No reading of the chapter's own: a connection or interpretation no source applies to this verse is cut. An outside reading is never set beside the Church's as an equal. The Student Manual limits and the brief's limits on outside commentaries hold. No modern scholar is named in running text and no source is announced. Every note opens with a sentence that says what it is about and answers a question a reader would ask. Overlaps between notes, christ and explore are merged or cut.

Decide, don't defer: repair what fails, and settle what the standard and the brief settle. Only a matter that is truly the author's goes to the open questions. Keep ${scratch}/proposed/${pad(n)}.yaml accurate (add an entry you introduce, delete one no longer cited, correct a wrong detail) and run node scripts/check-sources.mjs ${book} ${n} after you change it. Rerun node scripts/check-chapter.mjs ${book} ${n} after your edits (fix-yaml, build, check-quotes, check-content with the proposed entries added in memory, and check-ledger: no scratch copy of content/).`
const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    ready: { type: 'boolean', description: 'true if the chapter is ready for the author to read' },
    summary: { type: 'string', description: 'Three or four sentences: what you changed, how many of the checker\'s findings you acted on, and the final note and ledger-row counts' },
    checks: { type: 'string', description: 'Final one-line results of check-chapter.mjs: fix-yaml, build, check-quotes, check-content, and check-ledger' },
    authorQuestions: { type: 'array', items: { type: 'string' }, description: 'Only what truly needs the author; each a self-contained sentence or two naming the verse' },
    decided: { type: 'array', items: { type: 'string' }, description: 'Judgment calls you or the writer settled, one line each with the verse' },
    unanswered: { type: 'array', items: { type: 'string' }, description: 'Reader questions no source answered' },
    themeCandidates: { type: 'array', items: { type: 'string' } },
    problems: { type: 'string', description: 'Anything that blocked you or the checker (a site that would not load, rows left unverified); empty if none' },
  },
  required: ['ready', 'summary', 'checks', 'authorQuestions', 'decided', 'unanswered', 'themeCandidates', 'problems'],
}
const chapters = args.chapters
const results = await pipeline(
  chapters,
  (n) => agent(writePrompt(n), { label: `write:${n}`, phase: 'Write', agentType: 'chapter-writer', model: args.writerModel ?? 'opus' }),
  (w, n) => agent(checkPrompt(n), { label: `check:${n}`, phase: 'Check', agentType: 'chapter-checker', model: 'sonnet' }).then((c) => ({ w, c })),
  ({ w, c }, n) => agent(reviewPrompt(n), { label: `review:${n}`, phase: 'Review', agentType: 'chapter-reviewer', model: args.reviewerModel ?? 'opus', schema: REVIEW_SCHEMA })
    .then((r) => ({ chapter: n, writer: String(w).slice(0, 600), checker: String(c).slice(0, 600), review: r })),
)
const missing = chapters.filter((n, i) => !results[i])
if (missing.length) log(`No result for chapters: ${missing.join(', ')}`)
// The book's illustration is the last stage of writing a book (DEVELOPMENT.md, “Book illustration workflow”).
let art = null
let next = null
if (args.lastBatch) {
  const notReady = results.filter((r) => r && !r.review?.ready).map((r) => r.chapter)
  const runArt = `run the create-book-art workflow with args { book: '${book}' }`
  if (missing.length || notReady.length) {
    next = `Book art not started: ${[missing.length ? `no result for ${missing.join(', ')}` : '', notReady.length ? `not ready: ${notReady.join(', ')}` : ''].filter(Boolean).join('; ')}. Once those chapters pass review, ${runArt}.`
  } else {
    try {
      art = await workflow('create-book-art', { book })
      next = art.next
    } catch (err) {
      next = `Book art failed to start (${err.message}): ${runArt}.`
    }
  }
  log(art?.candidate ? `Book art candidate for the author: ${art.candidate}` : next)
}
return { results: results.filter(Boolean), missing, art, next }
