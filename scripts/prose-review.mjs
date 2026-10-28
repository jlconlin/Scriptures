// Completion metadata shared by the chapter commit and status scripts.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Increment when the meaning of a completed prose check changes.
export const PROSE_REVIEW_VERSION = '1';
export const proseSourceHash = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
export const proseReviewTrailers = (slug, chapter, file) =>
  `Prose-Review: ${PROSE_REVIEW_VERSION}\nReviewed-Chapter: ${slug}/${chapter}\nReviewed-Source: ${proseSourceHash(file)}`;

// git log is newest first. Include empty review commits: path-filtered history
// omits them, even though a chapter that needed no edits was still reviewed.
export function parseProseReviews(log) {
  const latest = new Map();
  for (const message of log.split('\0')) {
    const identity = message.match(/^Reviewed-Chapter: ([a-z0-9-]+)\/(\d+)$/m);
    const version = message.match(/^Prose-Review: (\S+)$/m);
    const source = message.match(/^Reviewed-Source: ([a-f0-9]{64})$/m);
    if (!identity || !version || !source) continue;
    const key = `${identity[1]}/${Number(identity[2])}`;
    if (!latest.has(key)) latest.set(key, { slug: identity[1], chapter: Number(identity[2]), version: version[1], source: source[1] });
  }
  return latest;
}
