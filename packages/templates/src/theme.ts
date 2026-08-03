import { fontStack } from '@changelog-kit/brand';
import { createScale } from './scale.js';
import type { BrandColors, BrandKit, BrandRadius, BrandShadow, BrandSpacing } from '@changelog-kit/brand';
import type { Ctx } from './context.js';
import type { Scale } from './scale.js';

export interface ThemeFonts {
  display?: string;
  body?: string;
  scale: number;
}

/** RN-ready style values derived from a `BrandKit` — what every layout reads. */
export interface Theme {
  colors: BrandColors;
  shadow: BrandShadow;
  radius: BrandRadius;
  spacing: BrandSpacing;
  fonts: ThemeFonts;
}

function scaleAll<T extends object>(obj: T, unit: number): T {
  return Object.fromEntries(
    Object.entries(obj as Record<string, number>).map(([k, v]) => [k, v * unit])
  ) as T;
}

/**
 * Turn a BrandKit (`@changelog-kit/brand`) into RN-ready style values. Colors
 * and shadows are already valid CSS strings — RN's `boxShadow` style prop
 * accepts the same shorthand syntax `--brand-shadow-*` was injected as
 * verbatim, negative spread included — so those pass through unchanged, the
 * same way the HTML templates used them directly with no `calc()` wrapping.
 * Radius and spacing are unitless numbers in the brand kit (the same
 * contract templates used with `calc(N * var(--u))`); here they're resolved
 * to canvas pixels once, at theme-build time, using the layout's `unit`.
 * @param fontFamilies host-supplied font family names — brand fonts are
 *   Google-loaded via a `<link>` on the web path (`@changelog-kit/brand`'s
 *   `fontHead`), which a native app cannot do; native callers must pass real
 *   family names (e.g. loaded with `expo-font`) or fall back to the system font.
 */
export function brandToTheme(brand: BrandKit, unit: number, fontFamilies: { display?: string; body?: string } = {}): Theme {
  return {
    // `defineBrandKit`'s own BASE already defaults onDark to white, so this
    // is normally a no-op — the fallback here is only for a brand object
    // built by hand rather than through `defineBrandKit`. Resolved once here
    // so every layout can read `theme.colors.onDark` directly instead of
    // repeating a literal-hex fallback (banned by the "brand tokens only" rule).
    colors: { ...brand.colors, onDark: brand.colors.onDark ?? '#fff' },
    shadow: brand.shadow,
    radius: scaleAll(brand.radius, unit),
    spacing: scaleAll(brand.spacing, unit),
    fonts: {
      display: fontFamilies.display,
      body: fontFamilies.body,
      scale: brand.fonts?.scale ?? 1
    }
  };
}

/**
 * The two lines every layout starts with: derive `unit`/`u` from `ctx.size` and
 * `ctx.baseWidth`, and resolve the brand into an RN theme. Web/export rendering
 * (no host app) has no `ctx.fontFamilies` — default to the CSS font-stack
 * `fontHead()` actually loads, so `<Text style={{fontFamily}}>` matches. A
 * native host must pass real, single family names it loaded itself (see
 * `<Changelog>` and `brand/src/fonts.ts`) — RN native ignores CSS fallback lists.
 */
export function themeFromContext(ctx: Ctx): Scale & { theme: Theme } {
  const { unit, u } = createScale(ctx.size.width, ctx.baseWidth);
  const fontFamilies = ctx.fontFamilies ?? {
    display: fontStack(ctx.brand.fonts.display),
    body: fontStack(ctx.brand.fonts.body)
  };
  return { unit, u, theme: brandToTheme(ctx.brand, unit, fontFamilies) };
}
