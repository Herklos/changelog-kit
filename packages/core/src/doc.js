/** Document model: normalisation, validation and small helpers. */

const KINDS = ['new', 'update', 'bugfix', 'improvement', 'removed', 'soon'];

const DEFAULT_BADGES = {
  new: 'NEW',
  update: 'UPDATE',
  bugfix: 'BUGFIX',
  improvement: 'IMPROVED',
  removed: 'REMOVED',
  soon: 'SOON'
};

export class ChangelogError extends Error {}

/**
 * Validate + fill defaults. Always call this before handing a doc to a template.
 * @param {Partial<import('./types.js').ChangelogDoc>} input
 * @returns {import('./types.js').ChangelogDoc}
 */
export function normalizeDoc(input) {
  if (!input || typeof input !== 'object') throw new ChangelogError('doc must be an object');
  if (!input.version) throw new ChangelogError('doc.version is required');
  if (!Array.isArray(input.entries) || input.entries.length === 0) {
    throw new ChangelogError('doc.entries must be a non-empty array');
  }

  const entries = input.entries.map((entry, i) => {
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
    product: input.product ?? '',
    version: String(input.version),
    tagline: input.tagline ?? '',
    date: input.date ?? '',
    status: input.status ?? 'released',
    hero: input.hero,
    footer: input.footer ?? '',
    meta: input.meta ?? {},
    entries
  };
}

/** Entries that need an AI-generated image (have a prompt but no src). */
export function pendingImages(doc) {
  const out = [];
  if (doc.hero?.prompt && !doc.hero.src) out.push({ key: 'hero', image: doc.hero });
  doc.entries.forEach((entry, i) => {
    if (entry.image?.prompt && !entry.image.src) out.push({ key: `entry.${i}`, image: entry.image, entry });
  });
  return out;
}

/** Escape for HTML text nodes / attributes. */
export function esc(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Tokenize the same tiny inline-markdown subset `inlineMd` renders to HTML:
 * `**bold**`, `*italic*`, `` `code` ``, line breaks. One consumer per output
 * (HTML string vs. a native `<Text>` tree) means one markdown spec, not two.
 * @param {string} [value]
 * @returns {Array<{type: 'text'|'bold'|'italic'|'code'|'break', value?: string}>}
 */
export function inlineTokens(value = '') {
  const tokens = [];
  const lines = String(value).split('\n');
  lines.forEach((line, i) => {
    if (i > 0) tokens.push({ type: 'break' });
    // Order matches inlineMd's replace chain: bold, then italic, then code.
    const re = /\*\*(.+?)\*\*|(^|[^*])\*([^*]+?)\*|`(.+?)`/g;
    let last = 0;
    let match;
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

const TAG = { bold: 'strong', italic: 'em', code: 'code' };

/** Tiny inline markdown: **bold**, *italic*, `code`, line breaks. */
export function inlineMd(value = '') {
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
