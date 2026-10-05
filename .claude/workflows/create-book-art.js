export const meta = {
  name: 'create-book-art',
  description: 'Prepare a review-only book-image request after a book’s chapter content is complete',
  whenToUse: 'All chapters of a book have passed review and the author wants a book-page illustration. args: { book }',
  phases: [{ title: 'Direct' }, { title: 'Generate' }, { title: 'Approve' }],
}

const book = args.book
const prompt = `Create a review-only visual brief for the completed book ${book}.

Use the book-art-director instructions. Read content/visual-style.yaml, content/${book}/book.yaml, content/${book}/BRIEF.md, the book's division blurbs and chapter titles, and only the chapter sections needed to test the symbols you consider. Save the proposed brief to content/${book}/visual.yaml with status: proposed. Do not add an asset, alter the page template, or mark anything approved.

Your final response must include generationPrompt: a complete, dispatch-ready prompt for an image-capable ChatGPT agent. The next phase is deliberately a human-supervised handoff: that agent generates one candidate, the author reviews it, and only then may a coordinator add the file and set status: approved.`

const direction = await agent(prompt, {
  label: `direct:${book}`,
  phase: 'Direct',
  agentType: 'book-art-director',
  model: args.model ?? 'sonnet',
})

return {
  direction,
  next: 'Pass generationPrompt to an image-capable ChatGPT agent. Show its one candidate to the author; after explicit approval, add the asset and mark the visual brief approved.',
}
