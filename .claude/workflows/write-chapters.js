export const meta = {
  name: 'write-chapters',
  description: 'Write and review a batch of chapters of one book: a writer, a checker that reopens the sources, then a reviewer',
  whenToUse: 'A book has an approved BRIEF.md and the author wants chapters written. args: { book, chapters, writerModel, models, focus }',
  phases: [{ title: 'Write' }, { title: 'Check' }, { title: 'Review' }],
}
// args:
//   book         the book's slug (the directory under content/), e.g. 'genesis'
//   chapters     chapter numbers to write, e.g. [27, 28, 29]; about twelve at a time is a good batch
//   writerModel  'sonnet' (default; the arrangement Jeremiah was written with) or 'opus'.
//   reviewerModel 'opus' (default) or 'sonnet', for the last step
//   focus        optional: the author's focus questions, keyed by chapter number
// Three agents per chapter, none of which sees another's conversation:
//   chapter-writer (Sonnet)   researches and writes the chapter and its ledger
//   chapter-checker (Sonnet)  the mechanical half of the review: reopens the sources, compares each claim with
//                             its page, tests the checkable rules, and writes its findings with the sources quoted
//   chapter-reviewer (Opus, or Sonnet if asked)  the judgment: decides each finding and repairs the chapter, without reopening sources
// Opus is kept for the last step only (author, 2026-10-04: Opus need not be the one to see that pages exist).
//   models       optional chapter numbers of finished chapters of this book to use as models, e.g. [1, 22]
// Each agent works in the repository. Writers and reviewers leave two working files per chapter in
// .cache/batch/<book>/ (not committed): proposed/NN.yaml, the sources.yaml entries the chapter needs, and
// reports/NN-writer.md and reports/NN-check.md. Afterwards the coordinator runs scripts/merge-sources.mjs and scripts/batch-notes.mjs,
// then the checks, and commits one chapter at a time (STANDARDS.md §11).
const book = args.book
const scratch = `.cache/batch/${book}`
const pad = (n) => String(n).padStart(2, '0')
const models = (args.models ?? []).map((m) => `content/${book}/chapters/${pad(m)}.yaml`)
const common = (n) => `Read content/${book}/BRIEF.md in full first: it carries the author's decisions for this book, its conventions, the approach to each contested question, the sources tested for it with their URL patterns, and the check commands for a book in preview. If the book has a CHURCH-STATEMENTS.md, it points to the Church's own statements on the contested questions (quote from the pages it points to, not from that file).${models.length ? ` ${models.join(' and ')} ${models.length > 1 ? 'are finished, reviewed chapters' : 'is a finished, reviewed chapter'} of this book: use ${models.length > 1 ? 'them' : 'it'} as the model of length, voice and layout.` : ''}

Practical points: the Church's pages need a browser User-Agent with curl, and the Gospel Library's footnotes may be in the page's embedded data, not the visible HTML. If churchofjesuschrist.org fails to resolve, wait a minute and try again; that is not a reason to give it up. Many chapters are being written at the same time: touch only chapter ${n}'s files, never content/sources.yaml, and use PREVIEW=1 BUILD_OUT=${scratch}/dist-${pad(n)} for the build. A build message that names another chapter is not yours. Other chapters of the book may be unwritten, so [[references]] to them link to the Gospel Library for now; that is expected. Where this chapter repeats or depends on a passage in another chapter, explain what this chapter needs briefly and point to the other chapter with a [[reference]].`
const writePrompt = (n) => `Write chapter ${n} of ${book} (book: ${book}, chapter: ${n}). ${args.focus?.[n] ? `The author's focus questions for this chapter: ${args.focus[n]}` : 'The author gave no focus questions: work from the questions a careful reader would ask.'}

${common(n)}

Check content/sources.yaml for the sources you can already cite; propose an entry only for one that is not there.

When you finish, besides the chapter and its ledger, write two working files (create the folders if they are missing):
1. ${scratch}/proposed/${pad(n)}.yaml : the sources.yaml entries you propose, one per line in that file's one-line format (key: { type, author, title, pub, url }), each URL opened and its heading confirmed in this session. Leave the file empty if you propose none.
2. ${scratch}/reports/${pad(n)}-writer.md : your report: the reader questions you worked from and which went unanswered; what you decided on your own and why (one line each); anything that truly needs the author's judgment (doctrine or taste the standard and brief don't settle; expect this to be rare); theme candidates; what you cut for lack of a source; the check output.
Run check-content against a scratch copy of content/ that has your proposed entries appended (STANDARDS.md §5), and check-ledger and check-quotes, and fix what they find. Your final message is one short paragraph: done or not, note count, word count, and anything that blocked you.`
const checkPrompt = (n) => `Check chapter ${n} of ${book} (book: ${book}, chapter: ${n}): content/${book}/chapters/${pad(n)}.yaml with its ledger content/${book}/evidence/${pad(n)}.yaml. You did not write it.

${common(n)}

The writer's report is at ${scratch}/reports/${pad(n)}-writer.md and its proposed sources.yaml entries at ${scratch}/proposed/${pad(n)}.yaml; keep that proposed file accurate. Write your findings to ${scratch}/reports/${pad(n)}-check.md.`
const reviewPrompt = (n) => `Review chapter ${n} of ${book} (book: ${book}, chapter: ${n}): content/${book}/chapters/${pad(n)}.yaml with its ledger content/${book}/evidence/${pad(n)}.yaml. You did not write it.

${common(n)}

The checker's findings are at ${scratch}/reports/${pad(n)}-check.md, the writer's report at ${scratch}/reports/${pad(n)}-writer.md, and the proposed sources.yaml entries at ${scratch}/proposed/${pad(n)}.yaml. The script has confirmed the ledger's quotes and the checker has reopened the sources, so work from the chapter, the ledger and the findings: decide every finding, and open a page yourself only when a finding can't be settled from what it quotes.

Test in particular: no note only repeats what the Gospel Library puts beside the verse (a footnote, the chapter heading, the JST, Scripture Helps); a note goes further or is cut. Where a note starts from Scripture Helps, the work its endnote cites was looked for and is cited if it is readable and used. The contested questions follow the brief. No reading of the chapter's own: a connection or interpretation no source applies to this verse is cut. An outside reading is never set beside the Church's as an equal. The Student Manual limits and the brief's limits on outside commentaries hold. No modern scholar is named in running text and no source is announced. Every note opens with a sentence that says what it is about and answers a question a reader would ask. Overlaps between notes, christ and explore are merged or cut.

Decide, don't defer: repair what fails, and settle what the standard and the brief settle. Only a matter that is truly the author's goes to the open questions. For check-content, use a scratch copy of content/ with the proposed entries appended; keep ${scratch}/proposed/${pad(n)}.yaml accurate (add an entry you introduce, delete one no longer cited, correct a wrong detail). Rerun check-ledger, check-quotes, check-content and the build after your edits.`
const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    ready: { type: 'boolean', description: 'true if the chapter is ready for the author to read' },
    summary: { type: 'string', description: 'Three or four sentences: what you changed, how many of the checker\'s findings you acted on, and the final note and ledger-row counts' },
    checks: { type: 'string', description: 'Final one-line results of check-ledger, check-quotes, check-content (scratch root), and build' },
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
  (n) => agent(writePrompt(n), { label: `write:${n}`, phase: 'Write', agentType: 'chapter-writer', model: args.writerModel ?? 'sonnet' }),
  (w, n) => agent(checkPrompt(n), { label: `check:${n}`, phase: 'Check', agentType: 'chapter-checker', model: 'sonnet' }).then((c) => ({ w, c })),
  ({ w, c }, n) => agent(reviewPrompt(n), { label: `review:${n}`, phase: 'Review', agentType: 'chapter-reviewer', model: args.reviewerModel ?? 'opus', schema: REVIEW_SCHEMA })
    .then((r) => ({ chapter: n, writer: String(w).slice(0, 600), checker: String(c).slice(0, 600), review: r })),
)
const missing = chapters.filter((n, i) => !results[i])
if (missing.length) log(`No result for chapters: ${missing.join(', ')}`)
return { results: results.filter(Boolean), missing }
