/**
 * A BrandKit is a plain, serialisable object. Everything a template is allowed
 * to style with must come from here — templates never hardcode colors.
 */

export interface BrandFont {
  /** CSS family name, e.g. "Inter". */
  family: string;
  source?: 'google' | 'local' | 'url' | 'system';
  weights?: number[];
  /** woff2 URL when source === 'url'. */
  url?: string;
  /** Absolute file path when source === 'local'. */
  path?: string;
  /** Fallback stack. */
  fallback?: string;
}

export interface BadgeColorMap {
  new: string;
  update: string;
  bugfix: string;
  improvement: string;
  removed: string;
  soon: string;
}

export interface BrandColors {
  canvas: string;
  surface: string;
  surfaceAlt: string;
  ink: string;
  inkMuted: string;
  onDark: string;
  primary: string;
  secondary: string;
  accent: string;
  heroFrom: string;
  heroTo: string;
  badge: BadgeColorMap;
  badgeInk: BadgeColorMap;
}

export interface BrandFonts {
  display: BrandFont;
  body: BrandFont;
  scale?: number;
}

export interface BrandRadius {
  card: number;
  hero: number;
  badge: number;
  image: number;
}

export interface BrandShadow {
  card: string;
  hero: string;
}

export interface BrandSpacing {
  gap: number;
  pad: number;
  outer: number;
}

export interface BrandLogo {
  src: string;
  width: number;
  position: string;
}

export interface BrandImagery {
  /** Style guidance handed to AI image providers. */
  style: string;
  negative: string;
  background: string;
}

export interface BrandKit {
  id: string;
  name: string;
  colors: BrandColors;
  fonts: BrandFonts;
  radius: BrandRadius;
  shadow: BrandShadow;
  spacing: BrandSpacing;
  logo: BrandLogo;
  imagery: BrandImagery;
}

/** Every nested property optional, arbitrarily deep — for merge inputs. */
export type DeepPartial<T> = T extends (infer U)[]
  ? U[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

const BASE: Omit<BrandKit, 'id' | 'name'> = {
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

function isPlain(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlain(override)) return override === undefined ? base : (override as T);
  const baseRecord = (isPlain(base) ? base : {}) as Record<string, unknown>;
  const out: Record<string, unknown> = { ...baseRecord };
  for (const [key, value] of Object.entries(override)) {
    out[key] = isPlain(value) && isPlain(baseRecord[key]) ? deepMerge(baseRecord[key], value) : value;
  }
  return out as T;
}

export interface DefineBrandKitInput extends DeepPartial<BrandKit> {
  extends?: BrandKit;
}

/** Create a brand kit, merged over sensible defaults (and optionally over a preset). */
export function defineBrandKit(input: DefineBrandKitInput = {}): BrandKit {
  const { extends: parent, ...rest } = input;
  const merged = deepMerge(deepMerge(BASE, parent ?? {}), rest) as BrandKit;
  merged.id = merged.id ?? 'custom';
  merged.name = merged.name ?? 'Custom brand';
  return merged;
}

/** Flatten a brand kit into CSS custom properties. */
export function brandToCssVars(brand: BrandKit): Record<string, string | number> {
  const vars: Record<string, string | number> = {};
  const walk = (obj: Record<string, unknown> | undefined, path: string[]) => {
    for (const [key, value] of Object.entries(obj ?? {})) {
      const name = [...path, key].join('-');
      if (isPlain(value)) walk(value, [...path, key]);
      else if (typeof value === 'string' || typeof value === 'number') vars[`--brand-${name}`] = value;
    }
  };
  walk(brand.colors as unknown as Record<string, unknown>, ['color']);
  walk(brand.radius as unknown as Record<string, unknown>, ['radius']);
  walk(brand.shadow as unknown as Record<string, unknown>, ['shadow']);
  walk(brand.spacing as unknown as Record<string, unknown>, ['space']);
  vars['--brand-font-display'] = fontStack(brand.fonts.display);
  vars['--brand-font-body'] = fontStack(brand.fonts.body);
  vars['--brand-font-scale'] = brand.fonts.scale ?? 1;
  return vars;
}

export function cssVarBlock(brand: BrandKit, selector = ':root'): string {
  const vars = brandToCssVars(brand);
  // Numbers stay unitless on purpose: templates multiply them by the
  // canvas scale unit, e.g. `calc(var(--brand-radius-card) * var(--u))`.
  const body = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  return `${selector} {\n${body}\n}`;
}

export function fontStack(font?: BrandFont): string {
  if (!font) return 'system-ui, sans-serif';
  return `"${font.family}", ${font.fallback ?? 'system-ui, sans-serif'}`;
}

export { BASE as BASE_BRAND };
