// What a batch of chapters cost, from the agents' own transcripts (author, 2026-10-04: state the cost, and
// compare a new arrangement with the last one by the same measure).
// Usage: node scripts/batch-usage.cjs <transcript dir of a Workflow run> [more dirs…] [--calls]
//   The directory is the one a Workflow result names (…/subagents/workflows/wf_…): journal.jsonl and agent-*.jsonl.
//   For each role (write, check, review) and model, a chapter's average:
//     steps       messages in which the model was called (each is charged for all it has read so far)
//     tools       tool calls (several can share one step)
//     out_k       tokens written, thousands
//     fresh_k     tokens read for the first time, thousands
//     reread_M    tokens sent again from the cache on later steps, millions (charged at a fraction)
//     end_k       size of the session at its last step, thousands (what the Workflow result's total adds up)
//   --calls adds, for each role, which commands were run and how many characters each kind returned.
const fs = require('fs'), path = require('path');
const dirs = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const showCalls = process.argv.includes('--calls');
if (!dirs.length) { console.error('Usage: node scripts/batch-usage.cjs <workflow transcript dir> [more…] [--calls]'); process.exit(1); }

const kindOf = (c) => {
  if (c.name === 'Bash') {
    const cmd = c.input.command || '', m = cmd.match(/scripts\/([a-z-]+)\.[cm]?js/);
    return m ? m[1] : /curl/.test(cmd) ? 'curl' : 'other shell';
  }
  if (c.name === 'Read') {
    const p = c.input.file_path || '';
    return 'Read ' + (/STANDARDS/.test(p) ? 'STANDARDS' : /BRIEF/.test(p) ? 'BRIEF' : /evidence/.test(p) ? 'ledger' : /chapters/.test(p) ? 'chapter'
      : /reports/.test(p) ? 'report' : /tool-results|\.output|\.txt/.test(p) ? 'saved output' : 'other');
  }
  return c.name;
};

for (const dir of dirs) {
  const journal = fs.readFileSync(path.join(dir, 'journal.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  const label = {};
  for (const l of journal) if (l.type === 'started') label[l.agentId] = l.label;
  const roles = {};
  for (const id in label) {
    const file = path.join(dir, `agent-${id}.jsonl`);
    if (!fs.existsSync(file)) continue;
    const lines = fs.readFileSync(file, 'utf8').trim().split('\n').map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
    const usage = new Map(), uses = {}, kinds = {}, chars = {};
    let model = '', tools = 0;
    for (const l of lines) {
      const m = l.message;
      if (!m || !Array.isArray(m.content)) continue;
      if (l.type === 'assistant' && m.usage) { usage.set(m.id, m.usage); model = m.model; }
      for (const c of m.content) {
        if (c.type === 'tool_use') { tools++; const k = kindOf(c); uses[c.id] = k; kinds[k] = (kinds[k] || 0) + 1; }
        if (c.type === 'tool_result' && uses[c.tool_use_id]) {
          const s = typeof c.content === 'string' ? c.content : (c.content || []).map((x) => x.text || '').join('');
          chars[uses[c.tool_use_id]] = (chars[uses[c.tool_use_id]] || 0) + s.length;
        }
      }
    }
    if (!usage.size || model === '<synthetic>') continue; // an agent stopped by a usage limit before it did anything
    let out = 0, fresh = 0, reread = 0, last = null;
    for (const u of usage.values()) {
      out += u.output_tokens || 0; fresh += (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0);
      reread += u.cache_read_input_tokens || 0; last = u;
    }
    const end = (last.input_tokens || 0) + (last.cache_read_input_tokens || 0) + (last.cache_creation_input_tokens || 0) + (last.output_tokens || 0);
    const key = `${label[id].split(':')[0]} (${model.replace('claude-', '')})`;
    const r = roles[key] ??= { n: 0, steps: 0, tools: 0, out: 0, fresh: 0, reread: 0, end: 0, kinds: {}, chars: {} };
    r.n++; r.steps += usage.size; r.tools += tools; r.out += out; r.fresh += fresh; r.reread += reread; r.end += end;
    for (const k in kinds) r.kinds[k] = (r.kinds[k] || 0) + kinds[k];
    for (const k in chars) r.chars[k] = (r.chars[k] || 0) + chars[k];
  }
  console.log(`\n${path.basename(dir)}`);
  const table = {};
  for (const k in roles) {
    const r = roles[k];
    table[k] = { agents: r.n, steps: Math.round(r.steps / r.n), tools: Math.round(r.tools / r.n), out_k: Math.round(r.out / r.n / 1e3),
      fresh_k: Math.round(r.fresh / r.n / 1e3), reread_M: +(r.reread / r.n / 1e6).toFixed(1), end_k: Math.round(r.end / r.n / 1e3) };
  }
  console.table(table);
  if (!showCalls) continue;
  for (const k in roles) {
    const r = roles[k];
    console.log(`\n${k}: calls and thousands of characters returned, per agent`);
    console.table(Object.keys(r.kinds).map((kind) => ({ kind, calls: +(r.kinds[kind] / r.n).toFixed(1), k_chars: Math.round((r.chars[kind] || 0) / r.n / 1e3) }))
      .sort((a, b) => b.k_chars - a.k_chars));
  }
}
