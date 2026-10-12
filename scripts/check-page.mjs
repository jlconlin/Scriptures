// Runs every check on one guide or theme page that an agent would otherwise run one at a time, prints a one-line result for each
// and, under it, only the lines that concern this page, and exits 1 if any fails. It is check-chapter.mjs for a page. In order:
//   build         PREVIEW=1 BUILD_OUT=.cache/batch/<owner>/dist-<page> node scripts/build.mjs, so a page or a book in preview is built
//                 and no other agent's output is touched; fails on a warning that names this page or one of its [[references]]
//                 (“unknown source key” for a key in the page's proposed file is expected and only listed)
//   check-quotes  the page's scripture quotations against the scripture (scripts/check-quotes.mjs)
//   check-content the page's sourcing, its ledger's form, a citation with no row under its section, a source announced in the text,
//                 a theme page's length, with the page's proposed sources added in memory (scripts/check-content.mjs)
//   check-ledger  reopens every ledger row's URL and confirms the quote is on the page (scripts/check-ledger.mjs)
//   check-sources the page's proposed sources.yaml entries, each beside its page's own title (scripts/check-sources.mjs); left out
//                 when .cache/batch/<owner>/proposed/<page file name>.yaml does not exist
// and it prints the page's word count. <owner> is a book or a volume (old-testament); the page is named by its file name, with
// or without .md (01-women-and-marriage).
// Usage: node scripts/check-page.mjs <owner> <page file name> [--skip ledger,quotes,build,content,sources] [--fresh]
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { findOwner, ownerPath } from '../src/lib/books.mjs';
import { SCRIPT_ROOT as ROOT, readProposed, proposedFile, pageSections } from '../src/lib/ledger.mjs';

const argv = process.argv.slice(2);
const skipAt = argv.indexOf('--skip');
const skip = skipAt >= 0 ? (argv.splice(skipAt, 2)[1] ?? '').split(',') : [];
const fresh = argv.includes('--fresh');
const [slug, pageArg] = argv.filter((a) => !a.startsWith('--'));
if (!slug || !pageArg || /^\d+$/.test(pageArg)) { console.error('Usage: node scripts/check-page.mjs <book or volume> <page file name> [--skip ledger,quotes,build,content,sources] [--fresh]'); process.exit(1); }
const name = pageArg.replace(/\.(?:md|yaml)$/, '');
const owner = await findOwner(ROOT, slug);
const base = ownerPath(slug);
const sub = ['themes', 'guides'].find((s) => existsSync(path.join(ROOT, base, s, `${name}.md`)));
if (!sub) { console.error(`No page ${name}.md in ${base}/themes/ or ${base}/guides/.`); process.exit(1); }
const file = `${base}/${sub}/${name}.md`;
const hasLedger = existsSync(path.join(ROOT, base, 'evidence', sub, `${name}.yaml`));
const hasProposed = existsSync(proposedFile(slug, name));

// Runs node with the arguments, both output streams together, in order; { out, code }.
const run = (args, env = {}) => {
  const r = spawnSync('sh', ['-c', 'exec "$@" 2>&1', 'sh', 'node', ...args], { cwd: ROOT, env: { ...process.env, ...env }, encoding: 'utf8', maxBuffer: 512e6 });
  return { out: r.stdout ?? '', code: r.status };
};
const lines = (out) => out.split('\n').map((l) => l.trimEnd()).filter(Boolean);
const results = [];
const done = (label, ok, summary, details = []) => {
  results.push({ name: label, ok });
  console.log(`${ok ? '✓' : '✗'} ${label.padEnd(13)} ${summary}`);
  for (const d of details) console.log(`    ${d.trim()}`);
};
const want = (label) => !skip.includes(label) && !(label === 'ledger' && !hasLedger) && !(label === 'sources' && !hasProposed);

const text = await readFile(path.join(ROOT, file), 'utf8');
const body = text.replace(/^---\n[\s\S]*?\n---\n?/, '');
// Words as a reader counts them (check-content's count): no citations, tags or link addresses, and none of a table's rules.
const words = pageSections(body).reduce((n, s) => n + s.text.replace(/\[@[^\]]*\]/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\]\([^)]*\)/g, ' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length, 0);
console.log(`${owner.name} ${sub === 'themes' ? 'theme' : 'guide'} ${name} (${file}; ${words} words${hasLedger ? '' : '; no ledger yet'}${/^status:\s*preview\b/m.test(text.split(/\n---\n/)[0]) ? '; status: preview' : ''})\n`);

// ---------- build ----------
if (want('build')) {
  const r = run(['scripts/build.mjs'], { PREVIEW: '1', BUILD_OUT: `.cache/batch/${slug}/dist-${name}` });
  let proposed = {};
  try { proposed = await readProposed(slug, name); } catch {}
  const mine = [], expected = [];
  for (const l of lines(r.out)) {
    const m = l.match(/^\s*⚠ (.*)$/);
    if (!m) continue;
    const w = m[1], ref = w.match(/^unrecognized scripture reference: \[\[(.*)\]\]$/);
    if (w.startsWith(`${slug}/${sub}/${name}.md:`) || (ref && text.includes(`[[${ref[1]}`))) {
      const key = w.match(/unknown source key “([^”]+)”/)?.[1] ?? w.match(/\[@([a-z0-9-]+)/)?.[1];
      (key && key in proposed ? expected : mine).push(w);
    }
  }
  done('build', r.code === 0 && !mine.length, r.code ? `the build failed (exit ${r.code})` : mine.length ? `${mine.length} warning(s) name this page` : `no warning names this page${expected.length ? `; ${expected.length} for proposed keys (expected)` : ''}`, r.code ? lines(r.out).slice(-8) : [...mine, ...expected.map((w) => `(expected) ${w}`)]);
}

// ---------- check-quotes ----------
if (want('quotes')) {
  const r = run(['scripts/check-quotes.mjs', slug, name]);
  const l = lines(r.out);
  done('check-quotes', r.code === 0, `${l.find((x) => /^Checked/.test(x)) ?? l.at(-1) ?? 'no output'}${r.code ? ' Some are not in the scripture they cite.' : ''}`, r.code ? l.filter((x) => !/^Checked/.test(x)) : []);
}

// ---------- check-content ----------
if (want('content')) {
  const r = run(['scripts/check-content.mjs', slug, name]);
  const l = lines(r.out), summary = l.at(-1) ?? '', rest = l.filter((x) => x !== summary && x !== 'Global checks');
  done('check-content', r.code === 0, summary.replace(/^\d+ chapter\(s\) in \d+ book\(s\); 0 strict; /, ''), rest);
}

// ---------- check-ledger ----------
if (want('ledger')) {
  const r = run(['scripts/check-ledger.mjs', slug, name, ...(fresh ? ['--fresh'] : [])]);
  const l = lines(r.out), line = l.find((x) => /rows confirmed/.test(x)) ?? l.at(-1) ?? 'no output';
  done('check-ledger', r.code === 0, line.replace(/^.*?: /, ''), l.filter((x) => /^\s*[✗?] /.test(x)));
} else if (!skip.includes('ledger')) console.log('- check-ledger   skipped: the page has no ledger yet');

// ---------- check-sources ----------
if (want('sources')) {
  const r = run(['scripts/check-sources.mjs', slug, name, ...(fresh ? ['--fresh'] : [])]);
  const l = lines(r.out);
  done('check-sources', r.code === 0, l.at(-1) ?? 'no output', r.code ? l.slice(0, -1) : []);
}

const failed = results.filter((r) => !r.ok).map((r) => r.name);
console.log(`\n${failed.length ? `Failed: ${failed.join(', ')}.` : 'Every check passed.'} (${results.length} run${skip.length ? `; left out: ${skip.join(', ')}` : ''}. Warnings under check-content are for the writer or reviewer to decide.)`);
process.exit(failed.length ? 1 : 0);
