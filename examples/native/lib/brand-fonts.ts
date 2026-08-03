import type { BrandKit } from '@changelog-kit/brand';

const DISPLAY_FONT: Record<string, string> = {
  'DM Sans': 'DMSans_700Bold',
  Fraunces: 'Fraunces_700Bold',
  Poppins: 'Poppins_800ExtraBold'
};

const BODY_FONT: Record<string, string> = {
  'DM Sans': 'DMSans_400Regular',
  'IBM Plex Sans': 'IBMPlexSans_400Regular',
  Poppins: 'Poppins_400Regular'
};

/**
 * A native host can't use the `<link>`-based Google Fonts loading the
 * web/export path uses (`@changelog-kit/brand`'s `fontHead()`) — it loads
 * and names its own fonts instead. One concrete weight per role (whatever
 * this app actually loaded with `useFonts` in `app/_layout.tsx`), not the
 * brand's full weight list — React Native has no bold-synthesis for custom
 * fonts, so `fontWeight` alongside a pinned `fontFamily` can't fetch a
 * different file the way it can on the web/export path.
 */
export function fontFamiliesFor(brand: BrandKit): { display?: string; body?: string } {
  return {
    display: DISPLAY_FONT[brand.fonts.display.family],
    body: BODY_FONT[brand.fonts.body.family]
  };
}
