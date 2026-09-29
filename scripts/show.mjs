// Print chapters of the KJV text with verse numbers (authoring aid). Usage: node scripts/show.mjs 1 2 3
import { readFileSync } from 'node:fs';
const { chapters } = JSON.parse(readFileSync(new URL('../data/kjv/isaiah.json', import.meta.url)));
for (const c of process.argv.slice(2)) {
  console.log(`\n=== Isaiah ${c} ===`);
  chapters[c - 1].forEach((v, i) => console.log(`${i + 1} ${v}`));
}
