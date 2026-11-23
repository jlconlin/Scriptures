export const meta = {
  name: 'repair-sole-commentary',
  description: 'Recast the parts of finished chapters that rest only on a verse-by-verse commentary, each chapter going straight on from repair writer to checker to Codex to reviewer, then Codex reads the batch side by side',
  whenToUse: 'scripts/sole-commentary.mjs lists parts of finished chapters whose only outside sources go verse by verse, and the author wants them repaired. args: { book, chapters, reviewerModel }',
  phases: [{ title: 'Write' }, { title: 'Check' }, { title: 'Codex' }, { title: 'Review' }, { title: 'Across' }],
}
// args:
//   book          the book's slug
//   chapters      the chapters to repair (those sole-commentary.mjs lists parts for)
//   reviewerModel 'opus' (default) or 'sonnet', passed to review-chapters
//   skipKeys      as in write-chapters
// The same four stages as write-chapters, chapter by chapter without waiting for the others, with a repair writer in place
// of the writer: an Opus chapter-writer recasts each part that node scripts/sole-commentary.mjs <book> <n> lists (GOSPELS.md,
// “Why one source keeps coming to carry a book”); then the Sonnet checker, Codex's reading, review-chapters, and the
// side-by-side reading of the batch. First used for John (2026-11-22). Then node scripts/batch-finish.mjs on this run's
// journal commits each chapter with the record of its prose review.
const book = args.book
const scratch = `.cache/batch/${book}`
const pad = (n) => String(n).padStart(2, '0')
// Rows the checker does not print page context for: the scripture text and the Hebrew text themselves
// (about two rows in five; the claim is what the verse reads, and check-ledger has confirmed the words).
const skipKeys = args.skipKeys ?? 'lds-scriptures,oshb-wlc,biblehub-interlinear'
const models = (args.models ?? []).map((m) => `content/${book}/chapters/${pad(m)}.yaml`)
const common = (n) => `Read content/${book}/BRIEF.md in full first: it carries the author's decisions for this book, its conventions, the approach to each contested question, and the sources tested for it with their URL patterns.${models.length ? ` ${models.join(' and ')} ${models.length > 1 ? 'are finished, reviewed chapters' : 'is a finished, reviewed chapter'} of this book: use ${models.length > 1 ? 'them' : 'it'} as the model of length, voice and layout.` : ''}

Work in few steps, as your agent instructions say. Many chapters are being written at the same time: touch only chapter ${n}'s files, never content/sources.yaml. The one exception is for the writer: where the brief names research files shared between books (the Gospels' story files in content/volumes/new-testament/stories/), the writer of this chapter is asked to write and correct those for this chapter's stories, as the brief says. Run the checks with node scripts/check-chapter.mjs ${book} ${n}; a build message that names another chapter is not yours. If churchofjesuschrist.org fails to resolve, the scripts retry; if it still fails, wait a minute and try again, which is not a reason to give it up. Other chapters of the book may be unwritten, so [[references]] to them link to the Gospel Library for now; that is expected. Where this chapter repeats or depends on a passage in another chapter, explain what this chapter needs briefly and point to the other chapter with a [[reference]].`
const writePrompt = (n) => `Repair chapter ${n} of ${book} (book: ${book}, chapter: ${n}): content/${book}/chapters/${pad(n)}.yaml and its ledger content/${book}/evidence/${pad(n)}.yaml. The chapter is finished and reviewed; this is a focused repair, not a rewrite.

The problem: in this chapter some parts rest only on a commentary that goes verse by verse (Talmage's Jesus the Christ, Ellicott, the Expositor's Greek Testament, Meyer, the Cambridge Bible, Huntsman and Hatch's Greater Love Hath No Man, and the others the script names), against STANDARDS.md §4 rule 11 and the rule that these are opened last (GOSPELS.md, “Why one source keeps coming to carry a book”). Run node scripts/sole-commentary.mjs ${book} ${n}: it lists each part (a note, setting, thread, christ, a section's plain words).

For each listed part: name the reader's question it answers. Look for the answer first in the scriptures that quote or explain the verse (footnotes.mjs, the Joseph Smith Translation, Restoration scripture), in the words of prophets and apostles (search-lds.mjs), in the Latter-day Saint studies of the passage (the Religious Studies Center, BYU Studies, Religious Educator, Scripture Central's KnoWhys with knowhys.mjs, Interpreter), in the Bible Dictionary and the Greek, and in the shared story file, reading each on its page. Then recast the part so its main idea comes from the text and from those sources; keep the commentary only where it adds what none of them gives, attributed as a reading. **Never repair a part by moving it to another verse-by-verse commentary**: that is the trap this repair undoes. Where nothing but a commentary answers a question a careful reader would not ask, cut the note or fold it into another. Where it is the only answer to a question a reader truly asks, it may stay: say which parts and why in your report. A plain-words row or a 'when' row that rests on a commentary may instead rest on the verses themselves where they say it. Leave parts outside the list alone unless a listed part's change requires it. Every claim keeps its ledger row; remove the rows of what you cut; add a row for everything new, read on its page. Keep the chapter's length about the same.

${common(n)}

When you finish, write ${scratch}/proposed/${pad(n)}.yaml with only the sources.yaml entries you newly need (one-line format, each URL opened; empty if none), and ${scratch}/reports/${pad(n)}-writer.md: for each listed part, what you did (recast with which sources, kept and why, cut, folded), and the check output. Run node scripts/check-sources.mjs ${book} ${n} and node scripts/check-chapter.mjs ${book} ${n} and fix what they find. Your final message is one short paragraph: done or not, how many listed parts now rest on another source, how many were cut or kept, and anything that blocked you.`
const checkPrompt = (n) => `Check chapter ${n} of ${book} (book: ${book}, chapter: ${n}): content/${book}/chapters/${pad(n)}.yaml with its ledger content/${book}/evidence/${pad(n)}.yaml. You did not write it.

${common(n)}

The writer's report is at ${scratch}/reports/${pad(n)}-writer.md and its proposed sources.yaml entries at ${scratch}/proposed/${pad(n)}.yaml; keep that proposed file accurate. Write your findings to ${scratch}/reports/${pad(n)}-check.md. That file is required working output, the reviewer's input in this pipeline, not a report or documentation file: write it. If the write fails, save your full findings anywhere under ${scratch}/reports/ and say where in your final message.

Do the reading with the scripts your instructions name, not one fetch at a time. The skip list for this book: node scripts/ledger-context.mjs ${book} ${n} --skip-keys ${skipKeys}.`
const chapters = args.chapters
const codexPrompt = (n) => `From the repository root, run: node scripts/codex-read.mjs ${book} ${n} --inline
It is Codex's reading of chapter ${n} of ${book} and takes several minutes. Run it in the foreground with the Bash tool's longest timeout (600000 ms); don't poll, sleep or run anything else meanwhile. If the command is cut off by the timeout, look at ${scratch}/reports/${pad(n)}-codex.md: if it was written in this run and is not empty, that is the reading; otherwise run the command once more. Change no file yourself. Your final message is one line: the last line the command printed, or what failed.`
const results = await pipeline(
  chapters,
  (n) => agent(writePrompt(n), { label: `repair:${n}`, phase: 'Write', agentType: 'chapter-writer', model: args.writerModel ?? 'opus' }),
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
