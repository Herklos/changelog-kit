/** Turns brand fonts into <link>/@font-face markup for the render document. */

const GOOGLE = 'https://fonts.googleapis.com/css2';

function googleHref(fonts) {
  /** @type {Map<string, Set<number>>} */
  const byFamily = new Map();
  for (const font of fonts) {
    if (font?.source !== 'google') continue;
    const set = byFamily.get(font.family) ?? new Set();
    for (const weight of font.weights ?? [400, 700]) set.add(weight);
    byFamily.set(font.family, set);
  }
  if (!byFamily.size) return '';
  const families = [...byFamily.entries()].map(
    ([family, weights]) =>
      `family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@${[...weights].sort((a, b) => a - b).join(';')}`
  );
  return `${GOOGLE}?${families.join('&')}&display=swap`;
}

/**
 * @param {import('./brand-kit.js').BrandKit} brand
 * @returns {string} markup to inject in <head>
 */
export function fontHead(brand) {
  const fonts = [brand.fonts.display, brand.fonts.body].filter(Boolean);
  const out = [];
  const href = googleHref(fonts);
  if (href) {
    out.push('<link rel="preconnect" href="https://fonts.googleapis.com">');
    out.push('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
    out.push(`<link rel="stylesheet" href="${href}">`);
  }
  const faces = fonts
    .filter((f) => f.source === 'url' || f.source === 'local')
    .map((f) =>
      (f.weights ?? [400])
        .map(
          (w) => `@font-face{font-family:"${f.family}";font-weight:${w};font-display:block;` +
            `src:url("${f.source === 'local' ? fileUrl(f.path, w) : f.url}") format("woff2");}`
        )
        .join('\n')
    )
    .join('\n');
  if (faces) out.push(`<style>${faces}</style>`);
  return out.join('\n');
}

function fileUrl(path, weight) {
  if (!path) return '';
  const resolved = path.includes('{weight}') ? path.replace('{weight}', String(weight)) : path;
  return resolved.startsWith('file:') || resolved.startsWith('http') ? resolved : `file://${resolved}`;
}

/** True when the renderer must wait for webfonts before shooting. */
export function usesWebfonts(brand) {
  return [brand.fonts.display, brand.fonts.body].some((f) => f && f.source && f.source !== 'system');
}
