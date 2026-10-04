// Tests that what scripts/source.mjs prints is found by check-ledger's own comparison (src/lib/pages.mjs, onPage), for each
// kind of page it reads. For each page it takes two passages of 25 words from the printed text (and one from a note, where the
// page has notes), puts them through onPage() against the page's URL, and checks that the same passage with one word changed fails.
// --sweep also tries every 20-word stretch of every paragraph and note. Fetches real pages (through the cache).
// Usage: node scripts/test-source.mjs [--sweep]
import { readPage, fetchPage, pageText, onPage } from '../src/lib/pages.mjs';

const GL = 'https://www.churchofjesuschrist.org/study';
const PAGES = [
  ['Gospel Library scripture chapter', `${GL}/scriptures/ot/gen/22?lang=eng`],
  ['Scripture Helps (manual)', `${GL}/manual/scripture-helps-old-testament/08-genesis-18-23?lang=eng`],
  ['Bible Dictionary entry', `${GL}/scriptures/bd/moriah?lang=eng`],
  ['general conference talk', `${GL}/general-conference/2000/04/the-creation?lang=eng`],
  ['Scripture Central KnoWhy', 'https://scripturecentral.org/knowhy/how-abrahams-sacrifice-of-isaac-illuminates-the-atonement'],
  ['Joseph Smith Papers', 'https://www.josephsmithpapers.org/paper-summary/old-testament-revision-1/55'],
  ['Joseph Smith Papers, with pop-ups', 'https://www.josephsmithpapers.org/paper-summary/letter-to-emma-smith-4-november-1838/1'],
  ['PDF', 'https://storage.googleapis.com/scripturecentral-prod-strapi-uploads/ry_and_welch_isaiah_in_the_book_of_mormon_1998_184195e137/ry_and_welch_isaiah_in_the_book_of_mormon_1998_184195e137.pdf'],
  ['Bible Hub lexicon', 'https://biblehub.com/hebrew/7225.htm'],
  ['Bible Hub commentary', 'https://biblehub.com/commentaries/kad/genesis/22.htm'],
  ['Bible Hub interlinear', 'https://biblehub.com/interlinear/genesis/22-8.htm'],
  ['Bible Hub Septuagint', 'https://biblehub.com/sep/genesis/22.htm'],
  ['rsc.byu.edu article', 'https://rsc.byu.edu/abinadi/isaiah-52-53-mosiah-13-14'],
  ['byustudies.byu.edu article', 'https://byustudies.byu.edu/article/did-abraham-lie-about-his-wife-sarai'],
  ['archive.org full text', 'https://archive.org/download/annalsofsennache00senn_0/annalsofsennache00senn_0_djvu.txt'],
  ['Bible Gateway chapter', 'https://www.biblegateway.com/passage/?search=Genesis+22&version=NRSVUE'],
];
const passage = (text, at) => { const w = text.split(/\s+/); return w.length < 25 ? null : w.slice(Math.floor((w.length - 25) * at), Math.floor((w.length - 25) * at) + 25).join(' '); };
const sweep = process.argv.includes('--sweep'); // also every 20-word stretch of every paragraph and note
let failed = 0;
for (const [name, url] of PAGES) {
  const page = await readPage(url);
  if (page.error) { console.log(`✗ ${name}: ${page.error}`); failed++; continue; }
  const raw = (await fetchPage(url)).raw, found = pageText(raw);
  const long = page.paras.filter((p) => p.text.split(/\s+/).length >= 60);
  const picks = [long[Math.floor(long.length / 3)], long[Math.floor((2 * long.length) / 3)]].filter(Boolean).map((p, i) => [`paragraph ${p.n}`, passage(p.text, i ? 0.7 : 0.3)]);
  const note = [...page.notes].sort((a, b) => b.text.length - a.text.length)[0];
  if (note && passage(note.text, 0.2)) picks.push([`note ${note.marker}`, passage(note.text, 0.2)]);
  if (picks.length < 2 && page.paras.length) picks.push(...page.paras.slice(0, 2).map((p) => [`paragraph ${p.n}`, p.text.split(/\s+/).slice(0, 25).join(' ')]));
  for (const [label, q] of picks) {
    const ok = onPage(found, q), bad = onPage(found, q.replace(/\p{L}+(?=\P{L}*$)/u, 'zzyzxqwv'));
    if (!ok || bad) failed++;
    console.log(`${ok && !bad ? '✓' : '✗'} ${name}, ${label}: ${ok ? 'found' : 'NOT FOUND'}${bad ? ', and the altered copy was found too' : ''}\n    “${q.slice(0, 110)}…”`);
  }
  if (sweep) {
    let total = 0, missed = [];
    for (const text of [...page.paras.map((p) => p.text), ...page.notes.map((n) => n.text)]) {
      const w = text.split(/\s+/);
      for (let i = 0; i + 20 <= w.length; i += 20) { total++; const q = w.slice(i, i + 20).join(' '); if (!onPage(found, q)) missed.push(q); }
    }
    if (missed.length) failed++;
    console.log(`  ${missed.length ? '✗' : '✓'} ${name}: ${total - missed.length} of ${total} stretches of 20 words found${missed.length ? `; first missed: “${missed[0]}”` : ''}`);
  }
}
console.log(failed ? `\n${failed} failed.` : '\nAll found.');
process.exit(failed ? 1 : 0);