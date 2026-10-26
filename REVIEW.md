# The review of the theme pages and the guides

The plan for going over every theme page and every guide on the site, begun 2026-10-25. This file holds the plan, where it stands, and the decisions still open; what has been done is in git (`git log -- REVIEW.md`, and each page's own history). It is deleted when the review is finished.

## Why

The author, 2026-10-25: the theme pages were “rather bland and boring.” “The themes are opportunities to identify new connections across multiple chapters that a scholar has not made before… These pages can be longer essays instead of simple ‘devotionals’… They are intended to be semi-academic.” And: “It's okay if no insights are found; we just won't make a theme.”

The cause was found over two days and three drafts of the same two essays. The form rules that had accumulated for theme pages (a table of steps, a few sentences per step, “set beside,” a hedge after every reading, an outline relayed to a writer who could add nothing) produced prose the author called “*very* AI-generated.” Under those, a second cause: when every sentence must have a ledger row, writers write one sentence per row in the source's words, and the prose takes the shape of the evidence file. The older guides, which never had the theme rules, have the same voice, so the second cause reaches guides too (and probably chapter notes, not yet checked).

## What has changed already

- `STANDARDS.md` §8, “How a theme page is written”: six instructions and no rules about form; a paragraph on how an essay reads, settled over the three drafts; the Fable session writes the essay itself; the reviewer judges thesis, sourcing, doctrine, application and padding, not form. `DECISIONS.md` records it.
- Two pages rewritten as the models, in preview on the branch `claude/theme-pages-review-7ba220`: Deuteronomy's *Let It Suffice Thee* and Leviticus's *Accepted for Him*. The author read both: “Yes! this is so much easier to read.”
- `check-content` no longer warns a theme page for naming a source in running text.

## Decisions still open (the author's)

1. **The triage below.** Made on 2026-10-25 from each page's opening and table, before the standard changed. Being gone over with the author on 2026-10-26: bin D is closed (three deleted, one moved to B), bin A is approved, and 19 of bin B's 25 are approved; the six doubtful, the two merges and bin C are still to be gone over.
2. **What happens to the “leave” bin.** The standard now says a theme page without an insight is not written. The pages in bin C are sound and carry arcs the manuals already teach; whether they stay in the old form, are rewritten last, or are deleted is the author's call.
3. **Guides.** Proposed, not yet made: new guides get the essay's deal minus the license to make readings of their own (sourcing rules, no own readings, the pacing paragraph, one writer start to finish); existing guides are not rewritten until there is a reason to open one. And a sentence in §4–§5 that the ledger documents the page and the page is not written to the ledger (paraphrase the default, one row may stand behind a paragraph), which would reach chapters, guides and essays alike.
4. **Chapter notes.** Not checked. The author's standing rule is to bring a volume up to every new rule at its full review; read a few chapters then with this question in mind.
5. **Order and pace.** Each essay costs a Sonnet research run, a Fable writing session, and one Opus review; the author's Fable budget is the limit. A few pages a session, the strongest first, is the working assumption.

## How a page is done

1. Start the dossier (`node scripts/theme-dossier.mjs …`) and run one `theme-researcher` (Sonnet) with the old page's ledger as verified evidence to carry in and the questions the essay needs answered beyond it. **Sonnet stays the researcher** (author, 2026-10-26, asked whether a more capable model was needed: “approved” the arrangement): the judgment sits at both ends with the Fable session, which frames the questions and reads the dossier whole; Sonnet finds, reads and verifies. Its known limit is that it answers what it is asked and does not notice what it was not asked, so the session's questions always include the adversarial ones: *who has already made this connection*, and *what in the text or the Hebrew works against it*. A dossier thin at the page's crux is finished by the session itself, not written around; the researcher is promoted to Opus only by exception, for a page whose crux is hard (how the New Testament reads the book, say), and a first Opus run is measured against a Sonnet one before the switch is adopted.
2. The Fable session reads the dossier whole, decides whether there is an insight, and writes the essay and its ledger under the six instructions (`STANDARDS.md` §8). The old page and ledger are removed from the working tree first (git keeps them) so nothing of the old form is inherited.
3. One `theme-reviewer` (Opus). The session makes the repairs and applies Codex's reading without compressing.
4. `check-page.mjs`, `merge-sources.mjs`, commit with `status: preview`; the chapter notes that point to the page are reworded to say what it argues; the author reads it in the preview or in the artifact page.
5. A page judged to have no insight is deleted with its ledger, and the chapter notes that pointed to it lose the pointer.

## The theme pages: the triage of 2026-10-25

84 pages, judged from each page's opening and table, with eight read whole. Not approved. Two bins were first drawn as “rewrite as essays” (39) and then split when the author asked whether an essay would add value to each: about a dozen carry an argument with several moves, and the rest have a real but single insight that wants stating in a shorter page at the same pace.

### A. An argument worth an essay (12)

The insight has stakes, needs the Hebrew or the setting or another book to carry it, and a reader could object at several points. **Approved as the list of essays to write** (author, 2026-10-26: “All right, approved,” after the ten remaining were shown with the insight each argues). The session's note at the time: Hosea is the one most carried by existing scholarship on Matthew's use of the Old Testament, and Daniel's ending leans furthest beyond its book; neither weak enough to cut.

- deuteronomy / let-it-suffice-thee — **done**
- leviticus / accepted-for-him — **done**
- numbers / between-the-dead-and-the-living (kipper's last use and Amulek's infinite atonement)
- haggai / shall-it-be-holy (holiness does not pass by touch; the Holy One touches the unclean; a two-chapter book, so the Gospels carry much of it)
- micah / plead-my-cause (the lawsuit changes sides; the Judge becomes the Advocate)
- psalms / the-unanswered-prayer (Psalm 88 never turns; the Savior prayed Psalm 22)
- psalms / the-law-and-the-lost-sheep (the longest praise of the law ends as a lost sheep)
- genesis / in-anothers-place (a substitute provided, then a man who offers to become one, and he is Judah)
- ezekiel / stand-in-the-gap (no man found; “I will seek”)
- daniel / secrets-revealed (the interpreter ends unable to understand; the sealed book opened by the Lamb)
- deuteronomy / speak-not-in-thine-heart (four sayings of the heart; Romans 10)
- hosea / out-of-egypt (how Matthew reads Hosea 11:1)

### B. A single insight, worth stating at the new pace in a shorter page (25)

Real, but one move. Rewrite so the page says what it concludes and argues it in a page of ordinary length, not an essay. On 2026-10-26 a Sonnet agent read all 25 and the six merge candidates and reported each page's single insight, who carries it, and where the page undercuts itself; the bin was then split.

**Approved for rewriting at the new pace (21)** (author, 2026-10-26: “Yes,” to the block): amos / jacob-arise · daniel / but-if-not (the Hebrew verbs differ; the link is in the English, and the page must say so) · exodus / that-ye-may-know (from the doubtful six, the author's ruling below) · exodus / the-firstborn (from the doubtful six: the thesis is the reversal, the oppressor's firstborn dies and God's firstborn goes free in Egypt, God's own Firstborn dies and the captives go free in the gospel, with the law of Ex. 13 between) · deuteronomy / curse-into-blessing · deuteronomy / for-he-is-thy-life · ezekiel / a-little-sanctuary · ezekiel / new-heart-new-spirit (overlaps the Deuteronomy heart page; write it to differ) · genesis / brothers-reconciled (from bin D: reconciliation comes only when the wrong is named) · hosea / heal-their-backsliding · jeremiah / cup-of-fury · joel / overflowing-vats · joshua / in-the-midst-of-israel · joshua / no-part-in-the-lord · leviticus / i-will-be-sanctified · leviticus / them-that-come-nigh-me · numbers / pray-unto-the-lord · psalms / my-portion-for-ever · psalms / the-broken-crown · psalms / who-can-ransom · zechariah / every-pot-in-jerusalem · zechariah / i-am-returned-with-mercies

**Doubtful, to be gone over one at a time (6):** the agent found each mostly restates its chapter notes or concedes its own links; deletion or bin C is the likely outcome. malachi / god-of-judgment · numbers / seek-not-after-your-own-eyes (overlaps pray-unto-the-lord). Decided: exodus / what-israel-builds → **deleted** (author: “What Israel builds is to be deleted”; the session had recommended B on the *avodah* thread, service changing masters, with the Servant of Isa. 53 as the step to Christ. The session first recorded the author's “C” as bin C and then misapplied the correction to the Malachi page; both were put right before anything was committed). exodus / the-firstborn → **bin B** (author: “Yes”; the arc from Ex. 1 through Num. 3 to Luke 2 is not in any one note, and the reversal is about the Atonement). exodus / proved-in-the-wilderness → **bin C** (author: “C”; sound and well sourced, the verb in both directions is the notes' observation and the Matthew 4 step is the manual's). exodus / that-ye-may-know → **bin B** (author, 2026-10-26: “even though there are lots of others who have made this connection, I want to include it on this site… even if we don't add anything else, I still want to keep it”). Its thesis: Egypt is to know the Lord by His hand and Israel by His dwelling, and the one who says “Now I know” is an outsider; the research checks whether the dwelling turn has been argued and what works against it, but the page stays either way. **The ruling applies to every remaining page**: the test is not whether anyone has made the connection before (§8 already allows a connection a scholar has made) but whether the connection is worth having on the site; “no insight” means no connection at all, as in the Abraham pages.

**Two merges, revised after the reading, not yet decided:** exodus / moses-the-mediator + deuteronomy / hear-ye-him into one page (both turn on the prophet like Moses of Deut. 18); exodus / offered-at-sinai stays its own page (the priesthood offered and withdrawn is a different thread, though it starts at the same verse). The three Lamentations pages (hand-and-heart, look-upon-us, none-to-comfort) into one: three views of the book that ends with no reply.

### C. Sound, but the arc is one the manuals and scholars already carry (37, less the merges)

Leave in the old form until decision 2 is made.

daniel / desolate-sanctuary · daniel / kingdom-never-destroyed · exodus / blood-of-the-covenant · exodus / proved-in-the-wilderness (from bin B, 2026-10-26) · exodus / sabbath-and-tabernacle · exodus / that-i-may-dwell-among-them · exodus / when-your-children-ask · ezekiel / one-shepherd · ezekiel / the-strangers-inheritance · ezekiel / waters-out-of-the-sanctuary · genesis / babel-to-blessing · genesis / covenant-with-abraham · genesis / god-who-sees · genesis / hiding-to-meeting · hosea / betroth-thee · hosea / mercy-not-sacrifice · isaiah / arm-of-the-lord · isaiah / light · isaiah / new-exodus · isaiah / servant-songs (really a guide; could be reclassified) · isaiah / zion-and-her-husband · jeremiah / new-covenant · jeremiah / root-and-plant · jeremiah / scattered-and-gathered · jeremiah / shepherds-and-the-branch · joel / two-gatherings · joshua / rest-round-about · leviticus / one-of-his-brethren · malachi / preparing-the-way · malachi / purified-offering · moses / one-plan-and-rebellion · moses / plan-from-the-beginning · numbers / there-lacketh-not-one-man · psalms / forget-and-remember · psalms / the-sacrifice-god-desires · psalms / what-is-man · psalms / who-may-enter · zechariah / awake-o-sword

### D. No insight beyond the chapter notes: delete (4)

Gone over with the author on 2026-10-26, one page at a time, each described with the reason before the decision.

- abraham / council-to-creation — **deleted** (author: “Yes”)
- abraham / fathers-blessing — **deleted** (author: “this theme isn't needed because this isn't a new connection”). Abraham now has no theme page.
- genesis / blessing-outsiders — **deleted** (author: “Delete the page”); the author asked whether to merge it into the covenant page, and the answer was no (nothing to carry over; the covenant page follows one line, and is in bin C awaiting decision 2)
- genesis / brothers-reconciled — **moved to bin B** (author: “Move to B”). Triaged as “three brother pairs, no step to Christ,” but the arc runs the whole book (blood; an embrace with the wrong unspoken; a reunion where the wronged brother names the wrong and forgives), and the step to Christ is the Savior revealing himself with the wounds shown. If the research does not bear that out, it is deleted then.

Bin D is closed.

## The guides

Twenty-three guides. The period guides (volume guides 8–13, 2026-10-20 to 22) are tables with a few hundred words of prose: a reader consults them, and the tables are the right form; leave them. The guides that are read, and have the one-sentence-per-source voice, are the narrative ones. In order of how much prose each carries:

| Guide | Prose words | Note |
|---|---|---|
| Women and Marriage in the Old Testament | 3,100 | the longest; the author once cut a 4,000-word draft of it as too long to read |
| A Timeline of the Old Testament | 2,160 | its story sections have the voice; the timeline itself is fine |
| How the Old Testament Came to Us | 2,080 | |
| The Temple and Worship | 2,000 | |
| How to Read Isaiah | 1,865 | book guide |
| The Law and the Covenant | 1,810 | |
| Names, Places & Symbols (Isaiah) | 1,610 | reference; likely fine as it is |
| Hebrew Poetry and the Prophets' Speech | 1,330 | |
| The Land | 1,330 | half tables |
| Isaiah and the Restoration | 1,300 | book guide |
| the five Jeremiah guides and the other Isaiah guides | 470–710 each | short; read one to judge |

Proposed: no guide is rewritten in this review. Each narrative guide is read once, by the author or by the session, and the ones that need it are listed here for rewriting when their volume comes up for its full review. New guides are written under the guide's deal (decision 3).

## Where it stands

- 2026-10-26: standard changed; two essays done and in preview; guides read (the newest and the oldest) and the finding recorded. The triage is being gone over with the author: bin D closed, bin A approved as the essays to write, Sonnet confirmed as researcher; bins B and C and decisions 2–5 still open. Nothing pushed.
