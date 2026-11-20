// The author's chronology of the four Gospels, converted to data for this site
// (content/volumes/new-testament/GOSPELS.md, “The table of parallels”).
//
// The original is Appendices/Chronology.tex in the author's private repository jlconlin/WitnessesofChrist
// and stays the master: this script is run again whenever it changes, and nothing is edited in its output.
//
// Usage: node scripts/chronology.mjs [path/to/Chronology.tex] [--check]
//   With no path the file is read through the GitHub CLI (`gh`, signed in as the author).
//   Writes content/volumes/new-testament/chronology.yaml:
//     periods: [{ title, events: [{ event, place?, day?, label?, matthew?, mark?, luke?, john? }] }]
//   A Gospel's value is a list of ranges, "14:13" or "14:14-21", or "5-7" for whole chapters.
//   Then prints what the author is shown before anything in the original is changed: every reference that
//   does not exist, every verse two events claim, and every verse no event has.
//   --check prints the report without writing the file.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import YAML from 'yaml';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = path.join(ROOT, 'content/volumes/new-testament/chronology.yaml');
const REPO_FILE = 'repos/jlconlin/WitnessesofChrist/contents/Appendices/Chronology.tex';
export const GOSPELS = ['matthew', 'mark', 'luke', 'john'];

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const file = args.find((a) => !a.startsWith('--'));

/** The author's LaTeX names and marks, as plain text. */
function plain(tex) {
  return tex
    .replace(/\\tnotex\{[^}]*\}/g, '')
    .replace(/\\(?:Judea|judea)\s*/g, 'Judæa')
    .replace(/\\(?:J|Jesus)\{([^}]*)\}/g, 'Jesus$1')
    .replace(/\\(?:C|Christ)\{([^}]*)\}/g, 'Christ$1')
    .replace(/\\(?:J|Jesus)(?![A-Za-z])\\?/g, 'Jesus')
    .replace(/\\(?:C|Christ)(?![A-Za-z])\\?/g, 'Christ')
    .replace(/\\ae\s?/g, 'æ')
    .replace(/\\AE\s?/g, 'Æ')
    .replace(/---/g, '—')
    .replace(/--/g, '–')
    .replace(/``|''/g, '"')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** "9:18--19, 23--26" → ["9:18-19", "9:23-26"]; "18:38, 19:4" → ["18:38", "19:4"]; "5--7" → ["5-7"] (chapters). */
function ranges(cell, where, problems) {
  const text = cell.replace(/\\tnotex\{[^}]*\}/g, '').replace(/-+/g, '-').trim();
  if (!text) return undefined;
  const out = [];
  let chapter;
  for (const part of text.split(',').map((p) => p.trim()).filter(Boolean)) {
    let m;
    if ((m = /^(\d+):(\d+)(?:-(\d+))?$/.exec(part))) {
      chapter = m[1];
      out.push(m[3] ? `${m[1]}:${m[2]}-${m[3]}` : `${m[1]}:${m[2]}`);
    } else if ((m = /^(\d+)(?:-(\d+))?$/.exec(part)) && chapter) {
      out.push(m[2] ? `${chapter}:${m[1]}-${m[2]}` : `${chapter}:${m[1]}`);
    } else if ((m = /^(\d+)-(\d+)$/.exec(part))) {
      out.push(`${m[1]}-${m[2]}`);
    } else {
      problems.push(`${where}: cannot read the reference “${cell.trim()}”`);
    }
  }
  return out.length ? out : undefined;
}

/** Every verse of a list of ranges, as [chapter, verse] pairs; `lengths[c - 1]` is the number of verses in chapter c. */
export function verses(list, lengths) {
  const out = [];
  for (const r of list ?? []) {
    let m;
    if ((m = /^(\d+):(\d+)(?:-(\d+))?$/.exec(r))) {
      for (let v = +m[2]; v <= +(m[3] ?? m[2]); v++) out.push([+m[1], v]);
    } else if ((m = /^(\d+)-(\d+)$/.exec(r))) {
      for (let c = +m[1]; c <= +m[2]; c++) for (let v = 1; v <= (lengths?.[c - 1] ?? 0); v++) out.push([c, v]);
    }
  }
  return out;
}

export function parse(tex) {
  const periods = [];
  const problems = [];
  let period;
  let day;
  tex.split('\n').forEach((raw, i) => {
    const line = raw.trim();
    const n = i + 1;
    if (!line || line.startsWith('%')) return;
    let m;
    if ((m = /^\\begin\{chronotable\}\{(.*)\}$/.exec(line))) {
      period = { title: plain(m[1]).replace(/^(.)/, (c) => c.toUpperCase()), events: [] };
      periods.push(period);
      day = undefined;
      return;
    }
    if (/^\\end\{chronotable\}/.test(line)) return void (period = undefined);
    if (!period) return;
    if ((m = /^\\multicolumn\{\d+\}\{\w\}\{\\scshape\s+([^}]*)\}/.exec(line))) return void (day = plain(m[1]));
    if (!line.includes('&')) return;
    const cells = line.replace(/\\\\\s*$/, '').split('&').map((c) => c.trim());
    while (cells.length < 7) cells.push('');
    if (cells.length > 7) problems.push(`line ${n}: ${cells.length} columns, 7 expected`);
    const [label, event, place, ...refs] = cells;
    const where = `line ${n} (“${plain(event)}”)`;
    const entry = { event: plain(event) };
    if (place) entry.place = plain(place);
    if (day) entry.day = day;
    if (label && label !== '---' && label !== '—') entry.label = label;
    GOSPELS.forEach((g, k) => {
      const r = ranges(refs[k] ?? '', `${where}, ${g}`, problems);
      if (r) entry[g] = r;
    });
    if (!GOSPELS.some((g) => entry[g])) problems.push(`${where}: no reference in any Gospel`);
    entry.line = n;
    period.events.push(entry);
  });
  return { periods, problems };
}

/** [[1,1],[1,2],[1,3],[2,5]] → "1:1–3; 2:5" */
function compress(pairs) {
  const out = [];
  let start;
  let prev;
  const flush = () => start && out.push(start[1] === prev[1] ? `${start[0]}:${start[1]}` : `${start[0]}:${start[1]}–${prev[1]}`);
  for (const p of pairs) {
    if (prev && p[0] === prev[0] && p[1] === prev[1] + 1) prev = p;
    else {
      flush();
      start = prev = p;
    }
  }
  flush();
  return out.join('; ');
}

export function report({ periods, problems }) {
  const lines = [...problems];
  const events = periods.flatMap((p) => p.events);
  const labels = new Map();
  for (const e of events) if (e.label) labels.set(e.label, [...(labels.get(e.label) ?? []), e]);
  const twice = [...labels].filter(([, es]) => es.length > 1);
  const out = { missing: {}, shared: {}, absent: {} };
  for (const g of GOSPELS) {
    const lengths = JSON.parse(readFileSync(path.join(ROOT, `data/kjv/${g}.json`), 'utf8')).chapters.map((c) => c.length);
    const claimed = new Map();
    out.absent[g] = [];
    for (const e of events) {
      // A row given as whole chapters (“5–7”, the Sermon on the Mount) is a heading over the rows that divide it.
      const heading = (e[g] ?? []).some((r) => !r.includes(':'));
      for (const [c, v] of verses(e[g], lengths)) {
        if (!(v >= 1 && v <= (lengths[c - 1] ?? 0))) {
          out.absent[g].push(`${c}:${v} at line ${e.line} (“${e.event}”)`);
          continue;
        }
        const key = `${c}:${v}`;
        if (heading) claimed.set(key, claimed.get(key) ?? []);
        else claimed.set(key, [...(claimed.get(key) ?? []), e]);
      }
    }
    const missing = [];
    lengths.forEach((len, ci) => {
      for (let v = 1; v <= len; v++) if (!claimed.has(`${ci + 1}:${v}`)) missing.push([ci + 1, v]);
    });
    out.missing[g] = missing;
    // Verses two events claim, grouped by the pair of events that share them.
    const pairs = new Map();
    for (const [key, es] of claimed) {
      if (es.length < 2) continue;
      const id = es.map((e) => e.line).join('+');
      const [c, v] = key.split(':').map(Number);
      if (!pairs.has(id)) pairs.set(id, { es, at: [] });
      pairs.get(id).at.push([c, v]);
    }
    out.shared[g] = [...pairs.values()];
  }
  const name = (g) => g[0].toUpperCase() + g.slice(1);
  lines.push(`${events.length} events in ${periods.length} periods; ${events.filter((e) => GOSPELS.filter((g) => e[g]).length > 1).length} told in more than one Gospel.`);
  if (twice.length) {
    lines.push('', 'A label used by more than one event:');
    for (const [label, es] of twice) lines.push(`  ${label}: ${es.map((e) => `line ${e.line} “${e.event}”`).join('; ')}`);
  }
  for (const g of GOSPELS) {
    if (out.absent[g].length) lines.push('', `${name(g)}: verses that do not exist:`, ...out.absent[g].map((s) => `  ${s}`));
  }
  for (const g of GOSPELS) {
    lines.push('', `${name(g)}: ${out.missing[g].length} verses in no event${out.missing[g].length ? ':' : '.'}`);
    if (out.missing[g].length) lines.push(`  ${compress(out.missing[g])}`);
  }
  for (const g of GOSPELS) {
    lines.push('', `${name(g)}: ${out.shared[g].length} places where two events claim the same verses${out.shared[g].length ? ':' : '.'}`);
    for (const { es, at } of out.shared[g]) lines.push(`  ${compress(at)}: ${es.map((e) => `“${e.event}” (line ${e.line})`).join(' and ')}`);
  }
  // The stories (stories.yaml, written by hand): every event must lie whole inside one story, and a story may hold
  // no verse the chronology does not.
  const storiesFile = path.join(ROOT, 'content/volumes/new-testament/stories.yaml');
  if (existsSync(storiesFile)) {
    const { stories } = YAML.parse(readFileSync(storiesFile, 'utf8'));
    const lengthsOf = (g) => JSON.parse(readFileSync(path.join(ROOT, `data/kjv/${g}.json`), 'utf8')).chapters.map((c) => c.length);
    const loose = [];
    const stale = [];
    for (const g of GOSPELS) {
      const lengths = lengthsOf(g);
      const sets = stories.map((st) => new Set(verses(st[g], lengths).map((p) => p.join(':'))));
      const inEvents = new Set(events.flatMap((e) => verses(e[g], lengths).map((p) => p.join(':'))));
      for (const e of events) {
        const vs = verses((e[g] ?? []).filter((r) => r.includes(':')), lengths).filter(([c, v]) => v <= (lengths[c - 1] ?? 0)).map((p) => p.join(':'));
        if (vs.length && !sets.some((set) => vs.every((v) => set.has(v)))) loose.push(`  ${name(g)} ${e[g].join(', ')}: “${e.event}” (line ${e.line})`);
      }
      stories.forEach((st, k) => {
        const extra = [...sets[k]].filter((v) => !inEvents.has(v));
        if (extra.length) stale.push(`  “${st.title}”: ${name(g)} ${extra.join(', ')}`);
      });
    }
    lines.push('', `${stories.length} stories; ${stories.filter((st) => GOSPELS.filter((g) => st[g]).length > 1).length} told in more than one Gospel.`);
    if (loose.length) lines.push('Events no story holds whole:', ...loose);
    if (stale.length) lines.push('Story verses no event has:', ...stale);
  }
  return lines.join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const tex = file
    ? readFileSync(file, 'utf8')
    : execFileSync('gh', ['api', REPO_FILE, '-H', 'Accept: application/vnd.github.raw'], { encoding: 'utf8', maxBuffer: 1 << 26 });
  const parsed = parse(tex);
  console.log(report(parsed));
  if (!checkOnly) {
    const header =
      '# The author’s chronology of the four Gospels, converted by scripts/chronology.mjs from Appendices/Chronology.tex in\n' +
      '# the author’s repository jlconlin/WitnessesofChrist. Do not edit: change the original and run the script again.\n' +
      '# `line` is the event’s line in the original. The site never shows these events as they are (GOSPELS.md beside\n' +
      '# this file): the stories built on them are in stories.yaml.\n';
    writeFileSync(OUT, header + YAML.stringify({ periods: parsed.periods }, { lineWidth: 0 }));
    console.log(`\nWrote ${path.relative(ROOT, OUT)}`);
  }
}
