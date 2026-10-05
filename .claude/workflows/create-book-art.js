export const meta = {
  name: 'create-book-art',
  description: 'Propose a finished book’s visual brief and have Codex draw one candidate image for the author’s review',
  whenToUse: 'All chapters of a book have passed review. write-chapters runs it when called with lastBatch: true; run it by name otherwise. args: { book, model, codexModel }',
  phases: [{ title: 'Direct' }, { title: 'Generate' }],
}
// args:
//   book        the book's slug
//   model       optional model for the book-art-director ('sonnet' by default)
//   codexModel  optional Codex model for the drawing step, when the configured one is at capacity
// Two steps. The book-art-director reads the finished book and writes content/<book>/visual.yaml (status: proposed).
// Then scripts/book-art.mjs builds the prompt from content/visual-style.yaml and that brief and has Codex draw one
// candidate into .cache/book-art/<book>/ (not committed). The second agent only runs that script: a Workflow script
// cannot run a command itself. Approval is the author's, afterwards: node scripts/book-art.mjs approve <book>.
const book = args.book
const prompt = `Create a review-only visual brief for the completed book ${book}.

Use the book-art-director instructions. Read content/visual-style.yaml, content/${book}/book.yaml, content/${book}/BRIEF.md, the book's division blurbs and chapter titles, and only the chapter sections needed to test the symbols you consider. Save the proposed brief to content/${book}/visual.yaml with status: proposed. Do not add an asset, alter the page template, or mark anything approved.

Your final response is a short report: the primary symbol and supporting motifs you chose, why the finished book supports each, and anything you considered and set aside.`

const direction = await agent(prompt, {
  label: `direct:${book}`,
  phase: 'Direct',
  agentType: 'book-art-director',
  model: args.model ?? 'sonnet',
})
if (!direction) return { direction, candidate: null, next: `The director returned nothing: run create-book-art for ${book} again.` }

const command = `node scripts/book-art.mjs generate ${book}${args.codexModel ? ` --model ${args.codexModel}` : ''}`
const CANDIDATE_SCHEMA = {
  type: 'object',
  properties: {
    candidate: { type: 'string', description: 'The path the script printed after “Candidate:”, or an empty string if it made none' },
    problem: { type: 'string', description: 'The script’s last lines if it failed; empty if it worked' },
  },
  required: ['candidate', 'problem'],
}
const made = await agent(`Run this one command from the repository root with the Bash tool, with a timeout of 600000 ms, and report what it prints: ${command}

It has Codex draw one image (one to three minutes) and saves it under .cache/book-art/${book}/. If it fails saying Codex's model is at capacity, wait a minute and run it once more. Do nothing else: do not read the image, edit any file, or try another way to make an image.`, {
  label: `generate:${book}`,
  phase: 'Generate',
  model: 'haiku',
  schema: CANDIDATE_SCHEMA,
})

return {
  direction,
  candidate: made?.candidate || null,
  problem: made?.problem || (made ? '' : 'The generating agent returned nothing.'),
  next: made?.candidate
    ? `Show ${made.candidate} to the author with the proposed content/${book}/visual.yaml. For another candidate: ${command}. After the author's explicit approval: node scripts/book-art.mjs approve ${book}, then make the brief describe the image that was kept.`
    : `No candidate was drawn. Run it yourself: ${command}`,
}
