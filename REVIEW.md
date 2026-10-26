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

1. **The triage below.** It was made on 2026-10-25 from each page's opening and table, before the standard changed, and never approved; only the two test pages were chosen from it. The bins need the author's eye, above all the four proposed for deletion.
2. **What happens to the “leave” bin.** The standard now says a theme page without an insight is not written. The pages in bin C are sound and carry arcs the manuals already teach; whether they stay in the old form, are rewritten last, or are deleted is the author's call.
3. **Guides.** Proposed, not yet made: new guides get the essay's deal minus the license to make readings of their own (sourcing rules, no own readings, the pacing paragraph, one writer start to finish); existing guides are not rewritten until there is a reason to open one. And a sentence in §4–§5 that the ledger documents the page and the page is not written to the ledger (paraphrase the default, one row may stand behind a paragraph), which would reach chapters, guides and essays alike.
4. **Chapter notes.** Not checked. The author's standing rule is to bring a volume up to every new rule at its full review; read a few chapters then with this question in mind.
5. **Order and pace.** Each essay costs a Sonnet research run, a Fable writing session, and one Opus review; the author's Fable budget is the limit. A few pages a session, the strongest first, is the working assumption.

## How a page is done

1. Start the dossier (`node scripts/theme-dossier.mjs …`) and run one `theme-researcher` (Sonnet) with the old page's ledger as verified evidence to carry in and the questions the essay needs answered beyond it.
2. The Fable session reads the dossier whole, decides whether there is an insight, and writes the essay and its ledger under the six instructions (`STANDARDS.md` §8). The old page and ledger are removed from the working tree first (git keeps them) so nothing of the old form is inherited.
3. One `theme-reviewer` (Opus). The session makes the repairs and applies Codex's reading without compressing.
4. `check-page.mjs`, `merge-sources.mjs`, commit with `status: preview`; the chapter notes that point to the page are reworded to say what it argues; the author reads it in the preview or in the artifact page.
5. A page judged to have no insight is deleted with its ledger, and the chapter notes that pointed to it lose the pointer.

## The theme pages: the triage of 2026-10-25

84 pages, judged from each page's opening and table, with eight read whole. Not approved. Two bins were first drawn as “rewrite as essays” (39) and then split when the author asked whether an essay would add value to each: about a dozen carry an argument with several moves, and the rest have a real but single insight that wants stating in a shorter page at the same pace.

### A. An argument worth an essay (12)

The insight has stakes, needs the Hebrew or the setting or another book to carry it, and a reader could object at several points.

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

### B. A single insight, worth stating at the new pace in a shorter page (24)

Real, but one move. Rewrite so the page says what it concludes and argues it in a page of ordinary length, not an essay.

amos / jacob-arise · daniel / but-if-not · deuteronomy / curse-into-blessing · deuteronomy / for-he-is-thy-life · exodus / proved-in-the-wilderness · exodus / that-ye-may-know · exodus / the-firstborn · exodus / what-israel-builds · ezekiel / a-little-sanctuary · ezekiel / new-heart-new-spirit · hosea / heal-their-backsliding · jeremiah / cup-of-fury · joel / overflowing-vats · joshua / in-the-midst-of-israel · joshua / no-part-in-the-lord · leviticus / i-will-be-sanctified · leviticus / them-that-come-nigh-me · malachi / god-of-judgment · numbers / pray-unto-the-lord · numbers / seek-not-after-your-own-eyes · psalms / my-portion-for-ever · psalms / the-broken-crown · psalms / who-can-ransom · zechariah / every-pot-in-jerusalem · zechariah / i-am-returned-with-mercies

Two merges proposed: exodus / offered-at-sinai + exodus / moses-the-mediator + deuteronomy / hear-ye-him into one page on Sinai's refusal and the Mediator (they tell one story three times); the three Lamentations pages (hand-and-heart, look-upon-us, none-to-comfort) into one, since each ends on the same unrecorded reply.

### C. Sound, but the arc is one the manuals and scholars already carry (37, less the merges)

Leave in the old form until decision 2 is made.

daniel / desolate-sanctuary · daniel / kingdom-never-destroyed · exodus / blood-of-the-covenant · exodus / sabbath-and-tabernacle · exodus / that-i-may-dwell-among-them · exodus / when-your-children-ask · ezekiel / one-shepherd · ezekiel / the-strangers-inheritance · ezekiel / waters-out-of-the-sanctuary · genesis / babel-to-blessing · genesis / covenant-with-abraham · genesis / god-who-sees · genesis / hiding-to-meeting · hosea / betroth-thee · hosea / mercy-not-sacrifice · isaiah / arm-of-the-lord · isaiah / light · isaiah / new-exodus · isaiah / servant-songs (really a guide; could be reclassified) · isaiah / zion-and-her-husband · jeremiah / new-covenant · jeremiah / root-and-plant · jeremiah / scattered-and-gathered · jeremiah / shepherds-and-the-branch · joel / two-gatherings · joshua / rest-round-about · leviticus / one-of-his-brethren · malachi / preparing-the-way · malachi / purified-offering · moses / one-plan-and-rebellion · moses / plan-from-the-beginning · numbers / there-lacketh-not-one-man · psalms / forget-and-remember · psalms / the-sacrifice-god-desires · psalms / what-is-man · psalms / who-may-enter · zechariah / awake-o-sword

### D. No insight beyond the chapter notes: delete (4)

- abraham / council-to-creation
- abraham / fathers-blessing
- genesis / blessing-outsiders (the page itself says Genesis never shows the promise coming to pass in these scenes)
- genesis / brothers-reconciled (three brother pairs, no step to Christ)

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

- 2026-10-26: standard changed; two essays done and in preview; the triage above awaiting the author; guides read (the newest and the oldest) and the finding recorded; decisions 1–5 open. Nothing pushed.
