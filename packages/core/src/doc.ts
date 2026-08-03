/** Document model: normalisation, validation and small helpers. */

import type { ChangelogDoc, ChangelogEntry, ChangelogImage, EntryKind } from './types.js';

const KINDS: EntryKind[] = ['new', 'update', 'bugfix', 'improvement', 'removed', 'soon'];

const DEFAULT_BADGES: Record<EntryKind, string> = {
  new: 'NEW',
  update: 'UPDATE',
  bugfix: 'BUGFIX',
  improvement: 'IMPROVED',
  removed: 'REMOVED',
  soon: 'SOON'
};

export class ChangelogError extends Error {}

/**
 * Validate + fill defaults. Always call this before handing a doc to a
 * template. Accepts `unknown` since its whole job is validating untrusted
 * input (a doc loaded from JSON).
 */
export function normalizeDoc(input: unknown): ChangelogDoc {
  if (!input || typeof input !== 'object') throw new ChangelogError('doc must be an object');
  const source = input as Partial<ChangelogDoc> & { entries?: unknown };
  if (!source.version) throw new ChangelogError('doc.version is required');
  if (!Array.isArray(source.entries) || source.entries.length === 0) {
    throw new ChangelogError('doc.entries must be a non-empty array');
  }

  const entries: ChangelogEntry[] = (source.entries as Partial<ChangelogEntry>[]).map((entry, i) => {
    if (!entry?.title && !entry?.body) {
      throw new ChangelogError(`doc.entries[${i}] needs a title or a body`);
    }
    const kind = entry.kind ?? 'new';
    if (!KINDS.includes(kind)) {
      throw new ChangelogError(`doc.entries[${i}].kind "${kind}" is not one of ${KINDS.join(', ')}`);
    }
    return {
      ...entry,
      kind,
      badge: entry.badge ?? DEFAULT_BADGES[kind],
      span: entry.span ?? 1,
      featured: entry.featured ?? false
    };
  });

  return {
    product: source.product ?? '',
    version: String(source.version),
    tagline: source.tagline ?? '',
    date: source.date ?? '',
    status: source.status ?? 'released',
    hero: source.hero,
    footer: source.footer ?? '',
    meta: source.meta ?? {},
    entries
  };
}

export interface PendingImageJob {
  key: string;
  image: ChangelogImage;
  entry?: ChangelogEntry;
}

/** Entries that need an AI-generated image (have a prompt but no src). */
export function pendingImages(doc: ChangelogDoc): PendingImageJob[] {
  const out: PendingImageJob[] = [];
  if (doc.hero?.prompt && !doc.hero.src) out.push({ key: 'hero', image: doc.hero });
  doc.entries.forEach((entry, i) => {
    if (entry.image?.prompt && !entry.image.src) out.push({ key: `entry.${i}`, image: entry.image, entry });
  });
  return out;
}

/** Escape for HTML text nodes / attributes. */
export function esc(value = ''): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type InlineToken =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'italic'; value: string }
  | { type: 'code'; value: string }
  | { type: 'break' };

/**
 * Tokenize the same tiny inline-markdown subset `inlineMd` renders to HTML:
 * `**bold**`, `*italic*`, `` `code` ``, line breaks. One consumer per output
 * (HTML string vs. a native `<Text>` tree) means one markdown spec, not two.
 */
export function inlineTokens(value = ''): InlineToken[] {
  const tokens: InlineToken[] = [];
  const lines = String(value).split('\n');
  lines.forEach((line, i) => {
    if (i > 0) tokens.push({ type: 'break' });
    // Order matches inlineMd's replace chain: bold, then italic, then code.
    const re = /\*\*(.+?)\*\*|(^|[^*])\*([^*]+?)\*|`(.+?)`/g;
    let last = 0;
    let match: RegExpExecArray | null;
    while ((match = re.exec(line))) {
      if (match.index > last) tokens.push({ type: 'text', value: line.slice(last, match.index) });
      if (match[1] !== undefined) {
        tokens.push({ type: 'bold', value: match[1] });
      } else if (match[3] !== undefined) {
        if (match[2]) tokens.push({ type: 'text', value: match[2] });
        tokens.push({ type: 'italic', value: match[3] });
      } else {
        tokens.push({ type: 'code', value: match[4] });
      }
      last = re.lastIndex;
    }
    if (last < line.length) tokens.push({ type: 'text', value: line.slice(last) });
  });
  return tokens;
}

const TAG: Record<string, string> = { bold: 'strong', italic: 'em', code: 'code' };

/** Tiny inline markdown: **bold**, *italic*, `code`, line breaks. */
export function inlineMd(value = ''): string {
  return inlineTokens(value)
    .map((tok) => {
      if (tok.type === 'break') return '<br>';
      const text = esc(tok.value);
      const tag = TAG[tok.type];
      return tag ? `<${tag}>${text}</${tag}>` : text;
    })
    .join('');
}

export { KINDS, DEFAULT_BADGES };
