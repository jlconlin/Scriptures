export const meta = {
  name: 'write-guide',
  description: 'Write one guide page from an approved outline and a research dossier: a writer, a reviewer, the writer’s repairs, then Codex’s reading applied',
  whenToUse: 'A guide’s dossier is gathered and its outline is written (and, for the page the author asked to approve, approved). args: { owner, file, dossier, outline, writerModel, codexModel }',
  phases: [{ title: 'Write' }, { title: 'Review' }, { title: 'Repair' }, { title: 'Language' }],
}
// args:
//   owner        the book's slug, or a volume's (old-testament) for a guide that serves more than one book
//   file         the page's file name without .md, with its number: '01-women-and-marriage'
//   dossier      path of the research dossier (theme-researcher's; verbatim quotes with their URLs)
//   outline      path of the outline: what the guide says, section by section, and which dossier row carries each claim.
//                The coordinating session writes it (STANDARDS.md §8); the writer adds nothing to it.
//   writerModel  'sonnet' (default: the writer adds nothing of its own) or 'opus', if a reviewer's list came back long
//   codexModel   optional Codex model, when the configured one is at capacity
// The writing half of a guide (content/volumes/old-testament/GUIDES.md, “The workflow”). Research is one agent call
// before this, and the outline between the two is the session's, so neither is here. Every agent runs
// node scripts/check-page.mjs <owner> <file>: the build, check-quotes, check-content, check-ledger and check-sources for the page.
const { owner, file, dossier, outline } = args
const VOLUMES = ['old-testament', 'new-testament', 'book-of-mormon', 'doctrine-and-covenants', 'pearl-of-great-price']
const base = VOLUMES.includes(owner) ? `content/volumes/${owner}` : `content/${owner}`
const page = `${base}/guides/${file}.md`
const ledger = `${base}/evidence/guides/${file}.yaml`
const scratch = `.cache/batch/${owner}`
const proposed = `${scratch}/proposed/${file}.yaml`
const check = `node scripts/check-page.mjs ${owner} ${file}`
const decisions = VOLUMES.includes(owner) ? `${base}/GUIDES.md (the author's decisions about this volume's guides)` : `${base}/BRIEF.md`
const intro = `The page is a guide, not a theme page: follow “When the page is a guide” in your instructions. It is ${page}, with its ledger ${ledger}. Read ${decisions} first. Work in few steps: call several tools in one message whenever the calls don't depend on each other.`
const checks = `Run the checks with ${check} and read only its output.`
const common = `${intro} Touch only the page, its ledger, and ${proposed} (the sources.yaml entries the page needs that are not in content/sources.yaml yet, one per line: key: { type, author, title, pub, url }); never content/sources.yaml. ${checks}`

const writePrompt = `Write the guide ${file} for ${owner} from its outline (${outline}) and its research dossier (${dossier}).

${common}

Write the page, its ledger, and the proposed entries, with \`status: preview\` in the page's front matter (the author reads it in the preview before it goes live). If the page or its ledger already exists, an earlier run was cut off: read both, keep what is sound, and finish. Then run ${check} and fix what it reports. Your final message is your report, as your instructions describe it.`
const reviewPrompt = `Review the guide ${file} of ${owner}. You did not write it. The outline it was written from is ${outline} and its dossier ${dossier}.

${intro} You edit nothing. The proposed sources.yaml entries are in ${proposed}.

Start with ${check}; its output is part of your report.`
const REVIEW = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['ready for the author', 'ready after the fixes below', 'does not hold up'], description: 'A decision, not a doubt' },
    summary: { type: 'string', description: 'Three or four sentences: what the guide does, and the weight of what must change' },
    fixes: { type: 'array', items: { type: 'string' }, description: 'Required fixes, most serious first: the sentence or row quoted, what is wrong, and what would fix it' },
    suggestions: { type: 'array', items: { type: 'string' }, description: 'Not required; for the coordinator to apply or drop' },
    rowsRead: { type: 'string', description: 'Which ledger rows you read against their pages and whether each held' },
    checks: { type: 'string', description: 'The one-line results of check-page.mjs' },
  },
  required: ['verdict', 'summary', 'fixes', 'suggestions', 'rowsRead', 'checks'],
}
const repairPrompt = (r) => `Repair the guide ${file} of ${owner}, which you (a writer like you) wrote from ${outline} and ${dossier}. A reviewer who did not write it requires these fixes:

${r.fixes.map((f, i) => `${i + 1}. ${f}`).join('\n')}

${common}

Make every fix: cut, reword to what the source says, cite, or mark as uncertain. Add nothing the outline and the dossier do not carry; where a fix would need a source the dossier lacks, cut the sentence and say so. Keep the ledger in step (a row for every claim, no row that supports nothing), then run ${check}. Report each fix and what you did.`
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
const languagePrompt = `Give the guide ${file} of ${owner} its language pass (${page}, ledger ${ledger}). It has been written, reviewed and repaired; this is not another review.

First have a copy editor of another model family read it: run node scripts/codex-read.mjs ${owner} ${file}${args.codexModel ? ` --model ${args.codexModel}` : ''} (it takes a few minutes, edits nothing, and writes numbered findings to ${findings}; skip the run if that file exists and is not empty). If it fails twice, stop and say so under problems.

Then decide each finding. Act on it when it is right: a sentence hard to follow, a point said twice, a source announced in running text, a reading stated as fact, two places that contradict each other. Decline it when it is wrong, when its fix would change what a sentence claims, or when the standard says otherwise, and say why in one line. **Add nothing**: no new fact, reference, quotation or connection; cut, merge, reorder and reword only, and a reworded sentence claims no more than the old one. Leave every passage inside quotation marks exactly as it is, or cut the whole quotation. Keep each heading unless a finding is about it; if you change one, change the “where” of its ledger rows to match. Delete a ledger row that now supports nothing; never add one. Touch only the page and its ledger. Then run ${check} and fix what it reports about your edits.`

const written = await agent(writePrompt, { label: `write:${file}`, phase: 'Write', agentType: 'theme-writer', model: args.writerModel ?? 'sonnet' })
const review = await agent(reviewPrompt, { label: `review:${file}`, phase: 'Review', agentType: 'theme-reviewer', model: 'opus', schema: REVIEW })
if (!review) return { file, writer: String(written).slice(0, 1500), review: null, next: 'The reviewer returned nothing: run the workflow again (finished agents are not repeated with resumeFromRunId).' }
if (review.verdict === 'does not hold up') return { file, writer: String(written).slice(0, 1500), review, next: 'The reviewer says the guide does not hold up: read its summary, and rework the outline before anything else.' }
let repair = null
if (review.fixes.length) repair = await agent(repairPrompt(review), { label: `repair:${file}`, phase: 'Repair', agentType: 'theme-writer', model: args.writerModel ?? 'sonnet' })
const language = await agent(languagePrompt, { label: `language:${file}`, phase: 'Language', agentType: 'theme-writer', model: 'opus', schema: APPLIED })
return {
  file, page, ledger, proposed,
  writer: String(written).slice(0, 1500),
  review,
  repair: repair ? String(repair).slice(0, 1500) : null,
  language,
  next: `Coordinator: node scripts/merge-sources.mjs ${owner} ${file} --write, then ${check}; settle the reviewer's suggestions and the declined findings by the standard; commit the page with its ledger; show it in the preview.`,
}
