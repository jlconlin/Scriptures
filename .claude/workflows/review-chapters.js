export const meta = {
  name: 'review-chapters',
  description: 'Review a batch of written chapters: one Opus reviewer per chapter decides the checker\'s findings and Codex\'s reading and repairs the chapter once',
  whenToUse: 'write-chapters has finished a batch and codex-read.mjs --batch has read the drafts. args: { book, chapters, across, reviewerModel, lastBatch, themes }',
  phases: [{ title: 'Review' }],
}
// args:
//   book          the book's slug
//   chapters      the chapter numbers to review, e.g. [1, 2, …, 12]
//   across        optional, e.g. '1-12': the batch Codex read side by side, when chapters is only part of it (a rerun)
//   reviewerModel 'opus' (default; DECISIONS.md, “Why these models”) or 'sonnet'
//   models        optional chapter numbers of finished chapters of this book to use as models
//   lastBatch     true when these chapters finish the book. If every reviewer then reports its chapter ready,
//                 the run ends with create-book-art (the book-art-director's visual brief, then one candidate
//                 image drawn by Codex), then propose-themes (Fable reads the finished book and proposes theme pages).
//   themes        false for a book the author has said needs no theme pages: propose-themes is not run.
// One chapter-reviewer (Opus) per chapter, working from two lists it did not write:
//   reports/NN-check.md   the checker's findings, with the sources quoted (write-chapters)
//   reports/NN-codex.md   Codex's reading of the draft for answer, progression, integration and language, and
//   reports/NN-NN-codex.md, the batch read side by side (node scripts/codex-read.mjs <book> <from>-<to> --batch)
// It decides every finding, repairs the chapter, and may add what a real gap needs only from a source it reads,
// with a ledger row. Afterwards the coordinator runs scripts/batch-finish.mjs on this run's journal, which commits
// each chapter with the record of its prose review (PROCESS.md, “Writing a book in batches”).
// Since 2026-11-17 (DECISIONS.md, “Codex reads before the reviewer”); before then the reviewer saw only the
// checker's findings and a separate apply stage (codex-pass) handled Codex's.
const book = args.book
const scratch = `.cache/batch/${book}`
const pad = (n) => String(n).padStart(2, '0')
const chapters = args.chapters
const acrossRange = args.across ?? `${chapters[0]}-${chapters[chapters.length - 1]}`
const acrossFile = `${scratch}/reports/${acrossRange.split('-').map(Number).map(pad).join('-')}-codex.md`
const models = (args.models ?? []).map((m) => `content/${book}/chapters/${pad(m)}.yaml`)
const reviewPrompt = (n) => `Review chapter ${n} of ${book} (book: ${book}, chapter: ${n}): content/${book}/chapters/${pad(n)}.yaml with its ledger content/${book}/evidence/${pad(n)}.yaml. You did not write it.

Read content/${book}/BRIEF.md in full first: it carries the author's decisions for this book, its conventions, the approach to each contested question, and the sources tested for it.${models.length ? ` ${models.join(' and ')} ${models.length > 1 ? 'are finished chapters' : 'is a finished chapter'} of this book: the model of length, voice and layout.` : ''}

You have two lists of findings, and your agent instructions say how to decide each kind:
- The checker's, on the sources: ${scratch}/reports/${pad(n)}-check.md. The script has confirmed the ledger's quotes and the checker has reopened the sources, so work from the chapter and the findings without reading the ledger through. If that file is missing, look for the checker's findings under another name in ${scratch}/reports/; if there are none, do the source check yourself.
- The second reader's, on prose and language: ${scratch}/reports/${pad(n)}-codex.md (this chapter read alone)${chapters.length > 1 || args.across ? ` and ${acrossFile} (chapters ${acrossRange.replace('-', '–')} read side by side: act only on the items that name chapter ${n}, and only on chapter ${n}'s part of each)` : ''}. It read the draft and saw no sources. If the chapter's own file is missing or empty, say so under problems and review without it.
The writer's report is at ${scratch}/reports/${pad(n)}-writer.md and the proposed sources.yaml entries at ${scratch}/proposed/${pad(n)}.yaml.

Decide the checker's findings first, since a repair may remove the sentence a prose finding is about; then decide each of the second reader's against the text as it then stands. Make the repairs in as few messages as you can, several edits in each.

Test in particular: no note only repeats what the Gospel Library puts beside the verse (a footnote, the chapter heading, the JST, Scripture Helps); a note goes further or is cut. Where a note starts from Scripture Helps, the work its endnote cites was looked for and is cited if it is readable and used. The contested questions follow the brief. No reading of the chapter's own: a connection or interpretation no source applies to this verse is cut. An outside reading is never set beside the Church's as an equal. The Student Manual limits and the brief's limits on outside commentaries hold. No modern scholar is named in running text and no source is announced. Every note opens with a sentence that says what it is about and answers a question a reader would ask. Overlaps between notes, christ and explore are merged or cut.

Decide, don't defer: repair what fails, and settle what the standard and the brief settle. Only a matter that is truly the author's goes to the open questions. Many chapters are being reviewed at the same time: touch only chapter ${n}'s two files and its proposed file, never content/sources.yaml. Keep ${scratch}/proposed/${pad(n)}.yaml accurate (add an entry you introduce, delete one no longer cited, correct a wrong detail) and run node scripts/check-sources.mjs ${book} ${n} after you change it. Rerun node scripts/check-chapter.mjs ${book} ${n} after your edits; a build message that names another chapter is not yours.`
const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    ready: { type: 'boolean', description: 'true if the chapter is ready for the author to read' },
    summary: { type: 'string', description: 'Three or four sentences: what you changed and the final note and ledger-row counts' },
    checkerFindings: { type: 'number', description: 'How many findings the checker reported' },
    checkerActedOn: { type: 'number', description: 'How many of them you repaired' },
    codexFindings: { type: 'number', description: 'How many of the second reader\'s findings concerned this chapter (its own file and the side-by-side file together)' },
    codexActedOn: { type: 'number', description: 'How many of them you repaired' },
    declined: { type: 'array', items: { type: 'string' }, description: 'Each finding of either list you did not act on, with the reason, one line each' },
    open: { type: 'array', items: { type: 'string' }, description: 'Almost always empty. A correct finding you could neither repair from a source you read nor remove by cutting: where, the evidence, and what repair it needs. A chapter with an open item is not ready' },
    checks: { type: 'string', description: 'Final one-line results of check-chapter.mjs: fix-yaml, build, check-quotes, check-content, and check-ledger' },
    authorQuestions: { type: 'array', items: { type: 'string' }, description: 'Almost always empty. Only a reading that touches doctrine where the Church\'s own sources pull two ways, or a faithful scholar\'s speculation the author may not want. Never a request for leave to do what the standard or the brief already settles (an outside reading given as one reading; shared words set side by side; following the King James; a short christ section): decide those and say so under decided' },
    decided: { type: 'array', items: { type: 'string' }, description: 'Judgment calls you or the writer settled, one line each with the verse' },
    unanswered: { type: 'array', items: { type: 'string' }, description: 'Reader questions no source answered' },
    themeCandidates: { type: 'array', items: { type: 'string' } },
    problems: { type: 'string', description: 'Anything that blocked you or the checker (a site that would not load, rows left unverified); empty if none' },
  },
  required: ['ready', 'summary', 'checkerFindings', 'checkerActedOn', 'codexFindings', 'codexActedOn', 'declined', 'open', 'checks', 'authorQuestions', 'decided', 'unanswered', 'themeCandidates', 'problems'],
}
const results = await parallel(chapters.map((n) => () =>
  agent(reviewPrompt(n), { label: `review:${n}`, phase: 'Review', agentType: 'chapter-reviewer', model: args.reviewerModel ?? 'opus', schema: REVIEW_SCHEMA })
    .then((r) => (r ? { chapter: n, review: { ...r, ready: Boolean(r.ready) && !(r.open ?? []).length } } : null))))
const missing = chapters.filter((n, i) => !results[i])
if (missing.length) log(`No result for chapters: ${missing.join(', ')}`)
// The book's illustration is the last stage of writing a book (PROCESS.md, “Book illustration workflow”).
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
// Theme candidates, while the author looks at the image: Fable reads the whole book and proposes arcs
// (author, 2026-10-14: “finding the candidates, and setting the outline. Let's set Fable for that task”).
let themes = null
if (args.lastBatch && !missing.length && args.themes !== false) {
  const leads = results.filter(Boolean).flatMap((r) => (r.review?.themeCandidates ?? []).map((t) => `(${r.chapter}) ${t}`))
  try { themes = await workflow('propose-themes', { book, leads }) } catch (err) { log(`Theme proposals failed to start (${err.message}): run the propose-themes workflow with args { book: '${book}' }.`) }
}
const done = results.filter(Boolean)
const sum = (f) => done.reduce((t, r) => t + (Number(r.review?.[f]) || 0), 0)
return { results: done, missing, notReady: done.filter((r) => !r.review?.ready).map((r) => r.chapter), art, themes,
  counts: { checkerFindings: sum('checkerFindings'), checkerActedOn: sum('checkerActedOn'), codexFindings: sum('codexFindings'), codexActedOn: sum('codexActedOn') },
  next: next ?? `node scripts/batch-finish.mjs ${book} <this run's journal.jsonl> <question prefix> commits each ready chapter with the record of its prose review.` }
