export const meta = {
  name: 'codex-pass',
  description: 'A prose and language pass: Opus applies supported wording repairs and returns substantive findings for focused writer/source review before completion',
  whenToUse: 'A batch of chapters has passed review and been committed; the final prose/language step before completion. args: { book, chapters, codexModel, applyModel }',
  phases: [{ title: 'Apply' }],
}
// args:
//   book        the book's slug
//   chapters    the chapter numbers of one batch, e.g. [13, 14, …, 24]; they are also read together, first to last
//   codexModel  optional Codex model, when the configured one is at capacity
//   applyModel  'opus' (default) or 'sonnet', for the agents that apply the findings (Sonnet 5.5 was tried on Deuteronomy, 2026-10-15, and did harm: AUTHORING.md, “Why these models”; keep opus)
// Codex (another model family) reads prose and language and edits nothing: the coordinator runs
// `node scripts/codex-read.mjs <book> <from>-<to> --batch` first, which saves numbered findings in
// .cache/batch/<book>/reports/ (NN-codex.md for a chapter, NN-NN-codex.md for the chapters read side by side).
// This workflow then runs one Opus agent per chapter, which decides each finding, makes the edits, adding nothing,
// and reruns check-chapter. Findings requiring added meaning go to needsWriter, not declined.
// Those chapters are not ready until focused writer/checker/reviewer work and a fresh reading resolve them.
const book = args.book
const chapters = args.chapters
const pad = (n) => String(n).padStart(2, '0')
const scratch = `.cache/batch/${book}/reports`
const first = chapters[0]
const last = chapters[chapters.length - 1]
const acrossFile = `${scratch}/${pad(first)}-${pad(last)}-codex.md`
const model = args.codexModel ? ` --model ${args.codexModel}` : ''
const APPLIED = {
  type: 'object',
  properties: {
    findings: { type: 'number', description: 'How many findings concerned this chapter (its own file and the side-by-side file together)' },
    applied: { type: 'number', description: 'How many you acted on' },
    declined: { type: 'array', items: { type: 'string' }, description: 'Each finding you did not act on, with the reason, one line each' },
    needsWriter: { type: 'array', items: { type: 'object', properties: {
      where: { type: 'string' }, evidence: { type: 'string' }, repairNeeded: { type: 'string' },
    }, required: ['where', 'evidence', 'repairNeeded'] }, description: 'Correct substantive findings that cannot be repaired while preserving existing meaning; keep these open for focused writer and source review, not in declined' },
    words: { type: 'string', description: 'The chapter file’s word count before and after' },
    checks: { type: 'string', description: 'Final one-line results of check-chapter.mjs' },
    problems: { type: 'string', description: 'Anything that blocked you; empty if none' },
  },
  required: ['findings', 'applied', 'declined', 'needsWriter', 'words', 'checks', 'problems'],
}
const applyPrompt = (n) => `Decide a second reader's prose and language findings for chapter ${n} of ${book}: content/${book}/chapters/${pad(n)}.yaml with its ledger content/${book}/evidence/${pad(n)}.yaml. The chapter has been written, source-checked and reviewed. In this stage apply only repairs that preserve existing meaning; return any correct substantive gap that needs added meaning for focused writer/source review.

The findings are in ${scratch}/${pad(n)}-codex.md (this chapter read alone) and ${acrossFile} (chapters ${first}–${last} read side by side; act only on the items that name chapter ${n}, and only on chapter ${n}'s part of each). The second reader did not see the sources. If the chapter's own findings file is missing or empty, stop: edit nothing and say so under problems. The coordinator must have completed the reader batch successfully for the current source before this workflow runs. Read STANDARDS.md sections 2 and 3, content/${book}/BRIEF.md (its conventions and “Learned from the first twelve chapters”, if it has that section) and the chapter, then decide each finding:

- Act on it when it is right: a sentence hard to follow, a point said twice, a note whose first sentence withholds its subject, a source announced in running text, a reading stated as fact, a plain paraphrase that adds to its verses, two places that contradict each other, a slip of fact that the chapter's own verses show. The finding's suggested wording is a suggestion: write your own if it is better.
- Decline a finding when the supposed gap is already explained or reasonably implied, the objection is wrong, or the brief or standard settles it otherwise. A suggested fix may be wrong even when the underlying problem is real: decide the problem separately from the suggested wording. Preserve useful symbolic repetition, legitimate uncertainty and alternative readings; do not require every inferential step to be explicit.
- A [prose] label is provisional. Decide answer, progression and integration against the actual text. When a real problem can be repaired by cutting an off-topic aside, reordering or rewording without changing claims, make that focused repair. If needed reasoning, an interpretation or a connection would add meaning not already established, leave that substantive repair open in needsWriter with its location, exact evidence and what repair must accomplish. Do not put a correct finding in declined merely because it is outside a language-only fix. Do not cut sound material just to avoid necessary writer/source work, invent a bridge, or open new sources in this stage.
- **Add nothing.** No new fact, reference, quotation, interpretation or connection: you may cut, merge, reorder and reword only. A reworded sentence must claim no more than the old one. Leave every passage inside quotation marks exactly as it is, or cut the whole quotation.
- Where the side-by-side file says another chapter should keep an explanation, shorten it here to what this chapter needs and point to the other with a [[reference]] (“see the note on [[Ezek. 1:5]]”), after confirming with grep that the other chapter has a note on that verse. Where it says this chapter keeps it, leave it.
- Keep each note's title unless a finding is about the title; if you change one, change the “where” of its ledger rows to match. When you cut a sentence, delete a ledger row that now supports nothing in the chapter; never add a row.
- Touch only chapter ${n}'s two files. Other agents are doing the same for the other chapters at this moment.

Work in few steps, several edits in one message. Then run node scripts/check-chapter.mjs ${book} ${n} and fix what it reports about your edits (a quoted passage with no row, a “where” that names no note, a pointer to a note that is not there). A build message that names another chapter is not yours. Any failed check or execution block belongs in problems; needsWriter is empty only when no substantive repair remains.`

// Codex's readings are made from the shell before this workflow runs (node scripts/codex-read.mjs <book> <from>-<to> --batch):
// a Workflow script cannot run a command, and an agent spawned only to run one was a waste (2026-10-11). An apply
// agent whose findings file is missing says so under `problems` and edits nothing.

const results = await parallel(chapters.map((n) => () =>
  agent(applyPrompt(n), { label: `apply:${n}`, phase: 'Apply', agentType: 'chapter-reviewer', model: args.applyModel ?? 'opus', schema: APPLIED })
    .then((a) => (a ? { ...a, chapter: n } : null))))
const done = results.filter(Boolean)
const missing = chapters.filter((n) => !done.some((d) => d.chapter === n))
const needsWriter = done.filter((d) => d.needsWriter?.length).map((d) => ({ chapter: d.chapter, findings: d.needsWriter }))
const readyChapters = done.filter((d) => Array.isArray(d.needsWriter) && d.needsWriter.length === 0 && typeof d.problems === 'string' && !d.problems.trim()).map((d) => d.chapter)
const notReady = chapters.filter((n) => !readyChapters.includes(n))
return { results: done, missing, needsWriter, readyChapters, notReady, ready: notReady.length === 0,
  next: needsWriter.length ? 'Resolve needsWriter through focused Opus writer, Sonnet source check and Opus review; commit that sourced repair, rerun the affected Codex readings, and resolve findings before recording the language pass. Do not commit a completed pass for notReady chapters.' : notReady.length ? 'Resolve missing results or problems before recording the pass.' : 'Record the completed pass for readyChapters, including chapters that needed no edits.',
  findings: done.reduce((t, d) => t + d.findings, 0), applied: done.reduce((t, d) => t + d.applied, 0) }
