export const meta = {
  name: 'write-theme',
  description: 'Write one theme page from the session’s outline and a research dossier: a writer, a reviewer, the writer’s repairs, then Codex’s reading applied',
  whenToUse: 'A theme’s dossier is gathered and the coordinating session has written its outline (STANDARDS.md §8). args: { book, file, dossier, outline, writerModel, codexModel }',
  phases: [{ title: 'Write' }, { title: 'Review' }, { title: 'Repair' }, { title: 'Language' }],
}
// The theme twin of write-guide.js (same four agents, the theme instructions instead of the guide ones).
// args:
//   book         the book's slug
//   file         the page's file name without .md: 'the-firstborn'
//   dossier      path of the research dossier (theme-researcher's; verbatim quotes with their URLs)
//   outline      path of the outline: the arc step by step, which dossier row carries each step, and which connections are the page's own
//   writerModel  'sonnet' (default) or 'opus'
//   codexModel   optional Codex model, when the configured one is at capacity
const { book, file, dossier, outline } = args
const base = `content/${book}`
const page = `${base}/themes/${file}.md`
const ledger = `${base}/evidence/themes/${file}.yaml`
const scratch = `.cache/batch/${book}`
const proposed = `${scratch}/proposed/${file}.yaml`
const check = `node scripts/check-page.mjs ${book} ${file}`
const intro = `The page is a theme page of ${book}: ${page}, with its ledger ${ledger}. Read ${base}/BRIEF.md and ${base}/THEME-CANDIDATES.md (the entry for this theme) first. Work in few steps: call several tools in one message whenever the calls don't depend on each other.`
const checks = `Run the checks with ${check} (the build, check-quotes, check-content, check-ledger and check-sources for the page in one result; use it in place of the separate commands in your instructions) and read only its output.`
const common = `${intro} Touch only the page, its ledger, and ${proposed} (the sources.yaml entries the page needs that are not in content/sources.yaml yet, one per line: key: { type, author, title, pub, url }); never content/sources.yaml. ${checks}`

const writePrompt = `Write the theme page ${file} for ${book} from its outline (${outline}) and its research dossier (${dossier}).

${common}

Write the page, its ledger, and the proposed entries, with \`status: preview\` in the page's front matter (the author reads it in the preview before it goes live). If the page or its ledger already exists, an earlier run was cut off: read both, keep what is sound, and finish. Then run ${check} and fix what it reports. Your final message is your report, as your instructions describe it.`
const reviewPrompt = `Review the theme page ${file} of ${book}. You did not write it. The outline it was written from is ${outline} and its dossier ${dossier}.

${intro} You edit nothing. The proposed sources.yaml entries are in ${proposed}. ${checks} Its output is part of your report.`
const REVIEW = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['ready for the author', 'ready after the fixes below', 'does not hold up as a theme'], description: 'A decision, not a doubt' },
    summary: { type: 'string', description: 'Three or four sentences: what the arc is, whether it holds, and the weight of what must change' },
    fixes: { type: 'array', items: { type: 'string' }, description: 'Required fixes, most serious first: the sentence or row quoted, what is wrong, and what would fix it' },
    suggestions: { type: 'array', items: { type: 'string' }, description: 'Not required; for the coordinator to apply or drop' },
    rowsRead: { type: 'string', description: 'Which ledger rows you read against their pages and whether each held' },
    checks: { type: 'string', description: 'The one-line results of check-page.mjs' },
    forAuthor: { type: 'string', description: 'A question only the author can settle, or empty' },
  },
  required: ['verdict', 'summary', 'fixes', 'suggestions', 'rowsRead', 'checks', 'forAuthor'],
}
const repairPrompt = (r) => `Repair the theme page ${file} of ${book}, which you (a writer like you) wrote from ${outline} and ${dossier}. A reviewer who did not write it requires these fixes:

${r.fixes.map((f, i) => `${i + 1}. ${f}`).join('\n')}

${common}

Make every fix: cut, reword to what the source says, cite, or mark as uncertain; a connection of the page's own that fails the limits in STANDARDS.md §8 is cut, not defended. Add nothing the outline and the dossier do not carry; where a fix would need a source the dossier lacks, cut the sentence and say so. Keep the ledger in step (a row for every claim, no row that supports nothing), then run ${check}. Report each fix and what you did.`
const APPLIED = {
  type: 'object',
  properties: {
    findings: { type: 'number' },
    applied: { type: 'number' },
    declined: { type: 'array', items: { type: 'string' }, description: 'Each finding you did not act on, with the reason, one line each' },
    words: { type: 'string', description: 'The page’s word count before and after' },
    checks: { type: 'string', description: 'The one-line results of check-page.mjs' },
    problems: { type: 'string', description: 'Anything that blocked you; empty if none' },
  },
  required: ['findings', 'applied', 'declined', 'words', 'checks', 'problems'],
}
const findings = `${scratch}/reports/${file}-codex.md`
const languagePrompt = `Give the theme page ${file} of ${book} its language pass (${page}, ledger ${ledger}). It has been written, reviewed and repaired; this is not another review.

First have a copy editor of another model family read it: run node scripts/codex-read.mjs ${book} ${file}${args.codexModel ? ` --model ${args.codexModel}` : ''} (it takes a few minutes, edits nothing, and writes numbered findings to ${findings}; skip the run if that file exists and is not empty). If it fails twice, stop and say so under problems.

Then decide each finding. Act on it when it is right: a sentence hard to follow, a point said twice, a source announced in running text, a reading stated as fact, two places that contradict each other. Decline it when it is wrong, when its fix would change what a sentence claims, or when the standard says otherwise, and say why in one line. **Add nothing**: no new fact, reference, quotation or connection; cut, merge, reorder and reword only, and a reworded sentence claims no more than the old one. Leave every passage inside quotation marks exactly as it is, or cut the whole quotation. Keep each heading unless a finding is about it; if you change one, change the “where” of its ledger rows to match. Delete a ledger row that now supports nothing; never add one. Touch only the page and its ledger. Then run ${check} and fix what it reports about your edits.`

const written = await agent(writePrompt, { label: `write:${file}`, phase: 'Write', agentType: 'theme-writer', model: args.writerModel ?? 'sonnet' })
const review = await agent(reviewPrompt, { label: `review:${file}`, phase: 'Review', agentType: 'theme-reviewer', model: 'opus', schema: REVIEW })
if (!review) return { file, writer: String(written).slice(0, 1500), review: null, next: 'The reviewer returned nothing: run the workflow again (finished agents are not repeated with resumeFromRunId).' }
if (review.verdict === 'does not hold up as a theme') return { file, writer: String(written).slice(0, 1500), review, next: 'The reviewer says the theme does not hold up: read its summary, and rework the outline or drop the page.' }
let repair = null
if (review.fixes.length) repair = await agent(repairPrompt(review), { label: `repair:${file}`, phase: 'Repair', agentType: 'theme-writer', model: args.writerModel ?? 'sonnet' })
const language = await agent(languagePrompt, { label: `language:${file}`, phase: 'Language', agentType: 'theme-writer', model: 'opus', schema: APPLIED })
return {
  file, page, ledger, proposed,
  writer: String(written).slice(0, 1500),
  review,
  repair: repair ? String(repair).slice(0, 1500) : null,
  language,
  next: `Coordinator: node scripts/merge-sources.mjs ${book} ${file} --write, then ${check}; settle the reviewer's suggestions, forAuthor and the declined findings by the standard; commit the page with its ledger; link the chapters (scripts/link-theme.mjs); show it in the preview.`,
}
