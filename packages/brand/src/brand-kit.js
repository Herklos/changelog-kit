/**
 * A BrandKit is a plain, serialisable object. Everything a template is allowed
 * to style with must come from here — templates never hardcode colors.
 *
 * @typedef {Object} BrandFont
 * @property {string} family        CSS family name, e.g. "Inter".
 * @property {'google'|'local'|'url'|'system'} [source]
 * @property {number[]} [weights]
 * @property {string} [url]         woff2 URL when source === 'url'.
 * @property {string} [path]        Absolute file path when source === 'local'.
 * @property {string} [fallback]    Fallback stack.
 *
 * @typedef {Object} BrandKit
 * @property {string} id
 * @property {string} name
 * @property {Object} colors
 * @property {Object} fonts
 * @property {Object} [radius]
 * @property {Object} [shadow]
 * @property {Object} [spacing]
 * @property {Object} [logo]
 * @property {Object} [imagery]     Style guidance handed to AI image providers.
 */

const BASE = {
  colors: {
    canvas: '#eef2fb',
    surface: '#ffffff',
    surfaceAlt: '#101828',
    ink: '#0f1b3d',
    inkMuted: '#5a6785',
    onDark: '#ffffff',
    primary: '#2f6bff',
    secondary: '#00b8d9',
    accent: '#ff5a5f',
    heroFrom: '#1d2a5b',
    heroTo: '#0b1330',
    badge: { new: '#101828', update: '#22c55e', bugfix: '#3b9dff', improvement: '#7c5cff', removed: '#94a3b8', soon: '#ff2d78' },
    badgeInk: { new: '#ffffff', update: '#062d16', bugfix: '#ffffff', improvement: '#ffffff', removed: '#0f1b3d', soon: '#ffffff' }
  },
  fonts: {
    display: { family: 'Poppins', source: 'google', weights: [600, 700, 800], fallback: 'system-ui, sans-serif' },
    body: { family: 'Poppins', source: 'google', weights: [400, 500, 600], fallback: 'system-ui, sans-serif' },
    scale: 1
  },
  radius: { card: 28, hero: 34, badge: 999, image: 20 },
  shadow: {
    card: '0 18px 44px -28px rgba(15, 27, 61, 0.45)',
    hero: '0 32px 80px -40px rgba(15, 27, 61, 0.6)'
  },
  spacing: { gap: 22, pad: 34, outer: 40 },
  logo: { src: '', width: 180, position: 'hero' },
  imagery: {
    style: '3D render, soft studio lighting, glossy plastic materials, playful mascot',
    negative: 'text, watermark, logo, deformed hands',
    background: 'clean gradient backdrop'
  }
};

function isPlain(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

export function deepMerge(base, override) {
  if (!isPlain(override)) return override === undefined ? base : override;
  const out = { ...base };
  for (const [key, value] of Object.entries(override)) {
    out[key] = isPlain(value) && isPlain(base?.[key]) ? deepMerge(base[key], value) : value;
  }
  return out;
}

/**
 * Create a brand kit, merged over sensible defaults (and optionally over a preset).
 * @param {Partial<BrandKit> & {extends?: BrandKit}} input
 * @returns {BrandKit}
 */
export function defineBrandKit(input = {}) {
  const { extends: parent, ...rest } = input;
  const merged = deepMerge(deepMerge(BASE, parent ?? {}), rest);
  merged.id = merged.id ?? 'custom';
  merged.name = merged.name ?? 'Custom brand';
  return merged;
}

/** Flatten a brand kit into CSS custom properties. */
export function brandToCssVars(brand) {
  const vars = {};
  const walk = (obj, path) => {
    for (const [key, value] of Object.entries(obj ?? {})) {
      const name = [...path, key].join('-');
      if (isPlain(value)) walk(value, [...path, key]);
      else if (typeof value === 'string' || typeof value === 'number') vars[`--brand-${name}`] = value;
    }
  };
  walk(brand.colors, ['color']);
  walk(brand.radius, ['radius']);
  walk(brand.shadow, ['shadow']);
  walk(brand.spacing, ['space']);
  vars['--brand-font-display'] = fontStack(brand.fonts.display);
  vars['--brand-font-body'] = fontStack(brand.fonts.body);
  vars['--brand-font-scale'] = brand.fonts.scale ?? 1;
  return vars;
}

export function cssVarBlock(brand, selector = ':root') {
  const vars = brandToCssVars(brand);
  // Numbers stay unitless on purpose: templates multiply them by the
  // canvas scale unit, e.g. `calc(var(--brand-radius-card) * var(--u))`.
  const body = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n');
  return `${selector} {\n${body}\n}`;
}

export function fontStack(font) {
  if (!font) return 'system-ui, sans-serif';
  return `"${font.family}", ${font.fallback ?? 'system-ui, sans-serif'}`;
}

export { BASE as BASE_BRAND };
