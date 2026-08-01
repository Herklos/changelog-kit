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

/** Tiny inline markdown: **bold**, *italic*, `code`, line breaks. */
export function inlineMd(value = '') {
  return esc(value)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+?)\*/g, '$1<em>$2</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

export { KINDS, DEFAULT_BADGES };
