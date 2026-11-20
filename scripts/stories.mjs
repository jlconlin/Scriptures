// The stories of the four Gospels, for a writer: which stories a chapter tells, where else each is told, every account
// of a story side by side, and where its shared research is kept (content/volumes/new-testament/GOSPELS.md, “How a
// story's research is shared”). The stories are content/volumes/new-testament/stories.yaml; a story told in more than
// one Gospel has a research file, content/volumes/new-testament/stories/<id>.yaml, written by the first writer to meet
// the story and corrected by the later ones.
// Usage: node scripts/stories.mjs <gospel> <chapter>   the chapter's stories in order: verses here, the other tellings,
//                                                      and each research file with whether it is written yet
//        node scripts/stories.mjs <id> --text          every account of one story, in the King James Version
//        node scripts/stories.mjs --stale              written chapters that tell a story whose research file has been
//                                                      committed since the chapter was (their notes may need the change)
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import YAML from 'yaml';

process.stdout.on('error', (e) => { if (e.code === 'EPIPE') process.exit(0); });
const ROOT = new URL('..', import.meta.url).pathname;
const DIR = 'content/volumes/new-testament';
const GOSPELS = ['matthew', 'mark', 'luke', 'john'];
const NAME = { matthew: 'Matthew', mark: 'Mark', luke: 'Luke', john: 'John' };
const ALIAS = { matt: 'matthew', mt: 'matthew', mk: 'mark', lk: 'luke', jn: 'john' };

const { stories } = YAML.parse(readFileSync(path.join(ROOT, DIR, 'stories.yaml'), 'utf8'));
const text = Object.fromEntries(GOSPELS.map((g) => [g, JSON.parse(readFileSync(path.join(ROOT, `data/kjv/${g}.json`), 'utf8')).chapters]));
const fileOf = (story) => `${DIR}/stories/${story.id}.yaml`;
const shared = (story) => GOSPELS.filter((g) => story[g]).length > 1;

/** "14:13-21" → [[14,13] … [14,21]] */
function verses(list) {
  const out = [];
  for (const r of list ?? []) {
    const m = /^(\d+):(\d+)(?:-(\d+))?$/.exec(r);
    if (m) for (let v = +m[2]; v <= +(m[3] ?? m[2]); v++) out.push([+m[1], v]);
  }
  return out;
}
const pretty = (g, list) => `${NAME[g]} ${list.join('; ').replace(/-/g, '–')}`;
const elsewhere = (story, g) => GOSPELS.filter((o) => o !== g && story[o]).map((o) => pretty(o, story[o]));
function research(story) {
  if (!shared(story)) return 'told only here: its research is this chapter\'s own ledger';
  const file = fileOf(story);
  if (!existsSync(path.join(ROOT, file))) return `${file} (not written yet: you write it)`;
  const doc = YAML.parse(readFileSync(path.join(ROOT, file), 'utf8')) ?? {};
  return `${file} (${(doc.findings ?? []).length} findings, ${(doc.differences ?? []).length} differences: read it first)`;
}

const argv = process.argv.slice(2);
const usage = () => {
  console.error('Usage: node scripts/stories.mjs <gospel> <chapter>\n       node scripts/stories.mjs <id> --text\n       node scripts/stories.mjs --stale');
  process.exit(1);
};

if (argv.includes('--stale')) {
  const committed = (file) => {
    try {
      return +execFileSync('git', ['log', '-1', '--format=%ct', '--', file], { cwd: ROOT, encoding: 'utf8' }).trim() || 0;
    } catch {
      return 0;
    }
  };
  let found = 0;
  for (const story of stories.filter(shared)) {
    const when = committed(fileOf(story));
    if (!when) continue;
    for (const g of GOSPELS) {
      for (const c of new Set(verses(story[g]).map(([ch]) => ch))) {
        const chapter = `content/${g}/chapters/${String(c).padStart(2, '0')}.yaml`;
        const then = existsSync(path.join(ROOT, chapter)) ? committed(chapter) : 0;
        if (then && then < when) {
          found++;
          console.log(`${NAME[g]} ${c} was last committed before “${story.title}” changed: ${fileOf(story)}`);
        }
      }
    }
  }
  if (!found) console.log('No written chapter is older than the research file of a story it tells.');
} else if (argv.includes('--text')) {
  const id = argv.find((a) => !a.startsWith('--'));
  const story = stories.find((s) => s.id === id);
  if (!story) {
    console.error(`No story “${id}”. A chapter's stories and their ids: node scripts/stories.mjs <gospel> <chapter>`);
    process.exit(1);
  }
  console.log(`${story.title} (${story.period})\n`);
  for (const g of GOSPELS.filter((o) => story[o])) {
    console.log(`=== ${pretty(g, story[g])}`);
    for (const [c, v] of verses(story[g])) console.log(`${c}:${v} ${text[g][c - 1]?.[v - 1] ?? '(no such verse)'}`);
    console.log('');
  }
} else {
  const g = ALIAS[argv[0]?.toLowerCase()] ?? argv[0]?.toLowerCase();
  const chapter = +argv[1];
  if (!GOSPELS.includes(g) || !chapter) usage();
  const here = stories
    .map((story) => ({ story, mine: verses(story[g]).filter(([c]) => c === chapter) }))
    .filter((x) => x.mine.length)
    .sort((a, b) => a.mine[0][1] - b.mine[0][1]);
  console.log(`${NAME[g]} ${chapter}: ${here.length} ${here.length === 1 ? 'story' : 'stories'}, ${here.filter((x) => shared(x.story)).length} told in another Gospel too.\n`);
  for (const { story, mine } of here) {
    const vs = mine.map(([, v]) => v);
    const span = vs.length > 1 ? `${chapter}:${vs[0]}–${vs[vs.length - 1]}` : `${chapter}:${vs[0]}`;
    const whole = verses(story[g]).some(([c]) => c !== chapter) ? ` (the story is ${pretty(g, story[g])})` : '';
    console.log(`${span}  ${story.title}  [${story.id}]${whole}`);
    const others = elsewhere(story, g);
    if (others.length) console.log(`    also told: ${others.join('; ')}`);
    console.log(`    research: ${research(story)}`);
  }
  // The other tellings, ready for the chapter file's `parallels` (STANDARDS.md, “Chapter file structure”).
  const ABBR = { matthew: 'Matt.', mark: 'Mark', luke: 'Luke', john: 'John' };
  const lines = here.flatMap(({ story }) =>
    GOSPELS.filter((o) => o !== g && story[o]).flatMap((o) => story[o].map((r) => `  - { ref: '${ABBR[o]} ${r.replace(/-/g, '–')}', note: '${story.title.replace(/'/g, "''")}' }`)));
  if (lines.length) console.log(`\nFor the chapter file:\nparallels:\n${lines.join('\n')}`);
  const told = new Set(here.flatMap((x) => x.mine.map(([, v]) => v)));
  const none = text[g][chapter - 1].map((_, i) => i + 1).filter((v) => !told.has(v));
  if (none.length) console.log(`\nVerses in no story (the author's chronology has no row for them): ${none.map((v) => `${chapter}:${v}`).join(', ')}`);
}
