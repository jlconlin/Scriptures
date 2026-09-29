// Word-level comparison of a KJV verse with the Book of Mormon’s reading of it.
import { esc } from './markdown.mjs';

// Small words whose presence or absence rarely changes the meaning.
const MINOR = new Set(
  'a an the and of that which who whom yea even it is are was be been to unto for in on upon shall will they them their thy thine thou ye you i me my he his him she her as so all also there then when with from by this these those'.split(' '),
);
const SPELLING = { honour: 'honor', saviour: 'savior', neighbour: 'neighbor', labour: 'labor', favour: 'favor', carcase: 'carcass', shew: 'show', shewed: 'showed', towards: 'toward', cockatrices: 'cockatrice', hath: 'has', doth: 'does', bare: 'bore', spake: 'spoke', sware: 'swore', shewn: 'shown' };

const norm = (w) => {
  const x = w.toLowerCase().replace(/[’']/g, '').replace(/[^a-z]/g, '');
  return SPELLING[x] ?? x;
};
const tokens = (s) => s.split(/\s+/).filter(Boolean).map((raw) => ({ raw, n: norm(raw) })).filter((t) => t.n);

/** Longest-common-subsequence diff of two token arrays. */
function diff(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) dp[i][j] = a[i].n === b[j].n ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const ops = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (a[i].n === b[j].n) ops.push(['=', b[j++]]), i++;
    else if (dp[i + 1][j] >= dp[i][j + 1]) ops.push(['-', a[i++]]);
    else ops.push(['+', b[j++]]);
  }
  while (i < m) ops.push(['-', a[i++]]);
  while (j < n) ops.push(['+', b[j++]]);
  return ops;
}

/**
 * Compare a KJV verse with a Book of Mormon verse.
 * @returns {{significant:boolean, html:string, added:number, removed:number}}
 */
export function compareVerse(kjv, bom) {
  const ops = diff(tokens(kjv), tokens(bom));
  const changed = ops.filter(([op]) => op !== '=');
  // Ignore differences that are only small words, or only spacing (“dryshod” vs “dry shod”).
  const content = changed.filter(([, t]) => !MINOR.has(t.n));
  const joinedA = changed.filter(([op]) => op === '-').map(([, t]) => t.n).join('');
  const joinedB = changed.filter(([op]) => op === '+').map(([, t]) => t.n).join('');
  const significant = content.length > 0 && joinedA !== joinedB;

  let html = '';
  let run = null;
  const flush = () => {
    if (!run) return;
    const text = esc(run.words.join(' '));
    html += run.op === '+' ? `<ins>${text}</ins> ` : `<del>${text}</del> `;
    run = null;
  };
  for (const [op, t] of ops) {
    if (op === '=') {
      flush();
      html += esc(t.raw) + ' ';
    } else {
      if (run && run.op !== op) flush();
      run ??= { op, words: [] };
      run.words.push(t.raw);
    }
  }
  flush();
  return {
    significant,
    html: html.trim(),
    added: changed.filter(([op]) => op === '+').length,
    removed: changed.filter(([op]) => op === '-').length,
  };
}
