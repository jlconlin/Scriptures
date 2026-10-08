export const meta = {
  name: 'codex-pass',
  description: 'A language pass on reviewed chapters: Codex reads each chapter and the batch side by side, then an Opus agent applies the findings that hold up and reruns the checks',
  whenToUse: 'A batch of chapters has passed review and been committed. The fourth step of writing a chapter (author, 2026-10-07). args: { book, chapters, codexModel }',
  phases: [{ title: 'Read' }, { title: 'Apply' }],
}
// args:
//   book        the book's slug
//   chapters    the chapter numbers of one batch, e.g. [13, 14, …, 24]; they are also read together, first to last
//   codexModel  optional Codex model, when the configured one is at capacity
// Codex (another model family) reads for language only and edits nothing: scripts/codex-read.mjs runs it read-only
// and saves numbered findings in .cache/batch/<book>/reports/ (NN-codex.md for a chapter, NN-NN-codex.md for the
// chapters read side by side). A Workflow script cannot run a command itself, so a small agent runs the script.
// Then one Opus agent per chapter decides each finding and makes the edits, adding nothing, and reruns
// check-chapter. The Sonnet source check is not repeated: no claim is added, so none needs a page.
const book = args.book
const chapters = args.chapters
const pad = (n) => String(n).padStart(2, '0')
const scratch = `.cache/batch/${book}/reports`
const first = chapters[0]
const last = chapters[chapters.length - 1]
const acrossFile = `${scratch}/${pad(first)}-${pad(last)}-codex.md`
const model = args.codexModel ? ` --model ${args.codexModel}` : ''
const RAN = {
  type: 'object',
  properties: { ok: { type: 'boolean' }, problem: { type: 'string', description: 'The script’s last lines if it failed; empty if it worked' } },
  required: ['ok', 'problem'],
}
const run = (file, command) => `If the file ${file} already exists and is not empty, report ok without running anything. Otherwise run this one command from the repository root with the Bash tool, with a timeout of 1800000 ms: ${command}
If it fails because the Codex model is at capacity, wait a minute and run it once more. Do nothing else: don't read the findings and don't edit any file.`

const APPLIED = {
  type: 'object',
  properties: {
    findings: { type: 'number', description: 'How many findings concerned this chapter (its own file and the side-by-side file together)' },
    applied: { type: 'number', description: 'How many you acted on' },
    declined: { type: 'array', items: { type: 'string' }, description: 'Each finding you did not act on, with the reason, one line each' },
    words: { type: 'string', description: 'The chapter file’s word count before and after' },
    checks: { type: 'string', description: 'Final one-line results of check-chapter.mjs' },
    problems: { type: 'string', description: 'Anything that blocked you; empty if none' },
  },
  required: ['findings', 'applied', 'declined', 'words', 'checks', 'problems'],
}
const applyPrompt = (n) => `Apply a second reader's findings to chapter ${n} of ${book}: content/${book}/chapters/${pad(n)}.yaml with its ledger content/${book}/evidence/${pad(n)}.yaml. The chapter has been written, source-checked and reviewed; this is a language pass only, not another review.

The findings are in ${scratch}/${pad(n)}-codex.md (this chapter read alone) and ${acrossFile} (chapters ${first}–${last} read side by side; act only on the items that name chapter ${n}, and only on chapter ${n}'s part of each). They come from a copy editor that did not see the sources. Read content/${book}/BRIEF.md (its conventions and “Learned from the first twelve chapters”, if it has that section) and the chapter, then decide each finding:

- Act on it when it is right: a sentence hard to follow, a point said twice, a note whose first sentence withholds its subject, a source announced in running text, a reading stated as fact, a plain paraphrase that adds to its verses, two places that contradict each other, a slip of fact that the chapter's own verses show. The finding's suggested wording is a suggestion: write your own if it is better.
- Decline it when it is wrong, when its fix would change what a sentence claims, or when the brief or the standard says otherwise. Say why in one line.
- **Add nothing.** No new fact, reference, quotation, interpretation or connection: you may cut, merge, reorder and reword only. A reworded sentence must claim no more than the old one. Leave every passage inside quotation marks exactly as it is, or cut the whole quotation.
- Where the side-by-side file says another chapter should keep an explanation, shorten it here to what this chapter needs and point to the other with a [[reference]] (“see the note on [[Ezek. 1:5]]”), after confirming with grep that the other chapter has a note on that verse. Where it says this chapter keeps it, leave it.
- Keep each note's title unless a finding is about the title; if you change one, change the “where” of its ledger rows to match. When you cut a sentence, delete a ledger row that now supports nothing in the chapter; never add a row.
- Touch only chapter ${n}'s two files. Other agents are doing the same for the other chapters at this moment.

Work in few steps, several edits in one message. Then run node scripts/check-chapter.mjs ${book} ${n} and fix what it reports about your edits (a quoted passage with no row, a “where” that names no note, a pointer to a note that is not there). A build message that names another chapter is not yours.`

phase('Read')
const across = await agent(run(acrossFile, `node scripts/codex-read.mjs ${book} ${first}-${last} --across${model}`),
  { label: `codex:${first}-${last}`, phase: 'Read', model: 'haiku', effort: 'low', schema: RAN })
if (!across?.ok) log(`No side-by-side findings (${across?.problem ?? 'no result'}): chapters get their own findings only`)

const results = await pipeline(
  chapters,
  (n) => agent(run(`${scratch}/${pad(n)}-codex.md`, `node scripts/codex-read.mjs ${book} ${n}${model}`),
    { label: `codex:${n}`, phase: 'Read', model: 'haiku', effort: 'low', schema: RAN }),
  (r, n) => {
    if (!r?.ok) { log(`Chapter ${n}: Codex gave no findings (${r?.problem ?? 'no result'}); nothing applied`); return null }
    return agent(applyPrompt(n), { label: `apply:${n}`, phase: 'Apply', agentType: 'chapter-reviewer', model: 'opus', schema: APPLIED })
      .then((a) => (a ? { chapter: n, ...a } : null))
  },
)
const done = results.filter(Boolean)
const missing = chapters.filter((n) => !done.some((d) => d.chapter === n))
return { results: done, missing, findings: done.reduce((t, d) => t + d.findings, 0), applied: done.reduce((t, d) => t + d.applied, 0) }
