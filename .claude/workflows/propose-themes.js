export const meta = {
  name: 'propose-themes',
  description: 'Fable reads a finished book and proposes the arcs that would make insightful theme pages, for the author to choose from',
  whenToUse: 'All chapters of a book have passed review. write-chapters runs it when called with lastBatch: true, beside the illustration; run it by name otherwise. args: { book, leads, model }',
  phases: [{ title: 'Propose' }],
}
// args:
//   book    the book's slug
//   leads   optional: the chapter reviewers' theme leads (an array of strings); write-chapters passes them. Without
//           them the agent reads .cache/batch/<book>/theme-leads.md if it exists.
//   model   optional; 'fable' by default (author, 2026-10-14: finding the candidates and setting the outline are the
//           steps that need the bigger thinking: “Let's set Fable for that task”)
// One agent reads the whole book and proposes theme pages. It looks for what a reader would not see chapter by chapter:
// an arc in which something changes, across chapters, that leads to Jesus Christ (STANDARDS.md §8). Codex's
// independent list (scripts/codex-themes.mjs, run by batch-finish) comes afterwards; the coordinator shows the author
// both, every candidate numbered (AUTHORING.md, “Theme candidates at the end of a book”), and only the author's
// choice goes into THEME-CANDIDATES.md.
const book = args.book
const out = `.cache/batch/${book}/reports/themes-fable.md`
const leads = args.leads?.length ? args.leads.map((l) => `- ${l}`).join('\n') : `(read .cache/batch/${book}/theme-leads.md if it exists)`

const prompt = `Propose theme pages for the book ${book} on this Latter-day Saint scripture study site. Write your proposal to ${out} and edit nothing else.

Read first: STANDARDS.md section 8 ("Guides and theme pages": "What earns a theme page" and "Where the meaning comes from"); content/${book}/BRIEF.md; content/${book}/THEME-CANDIDATES.md (what is already proposed, chosen or written; content/${book}/themes/ has the written pages); and every chapter, content/${book}/chapters/*.yaml, with the text in data/kjv/${book}.json. Read the whole book before proposing anything.

What the author wants from this step (2026-10-14): candidates that are insightful. Of an earlier list for Amos the author said none of the proposals "are screaming out to me as that insightful": they regrouped what the chapter notes already say (a list of the book's charges, a topic the notes already explain). The one the author chose was an arc a reader only sees by reading several chapters together, in which something changes: the prophet pleads and the Lord relents, then the pleading is cut off, and the book ends with the Lord raising what had fallen, which leads to Christ the Advocate. Look for arcs like that one: a development, a turn, an answer one passage gives to another, something the book does across chapters that changes how a passage reads, and that leads to Jesus Christ from scripture. A theme page may make connections of its own that rest on words a reader can check (a shared Hebrew word, the same act, one verse answering another); check a shared English word in the Hebrew with node scripts/hebrew.mjs ${book} --word <strongs> and counts with node scripts/occurrences.mjs before you rely on it. No new doctrine.

The chapter reviewers reported these leads; most are topics, not arcs, and you need not use any of them:
${leads}

Write, plainly and briefly:
1. Your proposals, ranked, as many as the book truly earns (a handful is a rule of thumb; a big book may need more, a small one fewer; one strong page beats several thin ones). For each: a short title (a phrase from the text is good); the passages in order; the arc in two or three sentences, saying what changes from the first to the last; how it leads to Christ, naming the scripture or Church source that makes the link and marking any link that would be the page's own; how it applies to the reader (STANDARDS.md section 8, "It applies the arc to the reader": where the same principle reaches a disciple's life now, as scripture and the prophets state it, never as a question to the reader); and what the reader would see that the chapter notes don't already show.
2. "Considered and set aside": the other arcs you tested, one line each with the reason.

Your final response is a short summary: how many you propose and their titles.`

const report = await agent(prompt, { label: `themes:${book}`, phase: 'Propose', model: args.model ?? 'fable' })
return { report, file: out, next: `Show the author ${out} beside Codex's .cache/batch/${book}/reports/themes-codex.md, every candidate numbered.` }
