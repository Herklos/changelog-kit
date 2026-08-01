import { defineBrandKit } from './brand-kit.js';

/*
 * OctoBot brand kits, built from the Drakkar Software "Charte Graphique":
 *   bleu-sombre  #0f1237   blanc-perle #f3f6f8   bleu-givré     #85d6d7
 *   turquoise    #65e7cf   turquoise-foncé #31bac9
 *   bleu-octobot #5ba0cc   bleu-octobot-foncé #4d7db9
 *   tertiaires   #f5de3e #f0c53b #152166 #26448e #a9d1a8 #82b084 #6cb596 #19283e
 *   halo         #32f1ce #57f5f7 #26ddf1 #55b7f5 #4893f1
 * Typography: DM Sans — Black/Bold for headlines, the lighter weights for text.
 */

/** Dark theme: bleu-sombre ground, blanc-perle type, bleu-givré call-outs. */
export const octobotDark = defineBrandKit({
  id: 'octobot-dark',
  name: 'OctoBot — Dark',
  colors: {
    canvas: '#0f1237',
    surface: '#19283e',
    surfaceAlt: '#152166',
    ink: '#f3f6f8',
    inkMuted: '#a9bcd6',
    onDark: '#f3f6f8',
    primary: '#85d6d7',
    secondary: '#65e7cf',
    accent: '#5ba0cc',
    heroFrom: '#26448e',
    heroTo: '#0f1237',
    badge: { new: '#85d6d7', update: '#65e7cf', bugfix: '#f0c53b', improvement: '#5ba0cc', removed: '#4d7db9', soon: '#f5de3e' },
    badgeInk: { new: '#0f1237', update: '#0f1237', bugfix: '#19283e', improvement: '#0f1237', removed: '#f3f6f8', soon: '#19283e' }
  },
  fonts: {
    display: { family: 'DM Sans', source: 'google', weights: [700, 900], fallback: 'system-ui, sans-serif' },
    body: { family: 'DM Sans', source: 'google', weights: [400, 500, 700], fallback: 'system-ui, sans-serif' }
  },
  radius: { card: 24, hero: 30, image: 18, badge: 999 },
  shadow: {
    card: '0 20px 50px -34px rgba(0,0,0,.85)',
    hero: '0 40px 90px -46px rgba(0,0,0,.9)'
  },
  imagery: {
    style: 'clean 3D render, friendly stylised octopus mascot wearing the OctoBot helmet, glossy turquoise and frosted-blue materials, trading charts and candlesticks, soft studio lighting',
    background: 'deep bleu-sombre gradient with a turquoise halo glow',
    negative: 'text, lettering, watermark, extra limbs, clutter'
  }
});

/** Light theme: blanc-perle ground, bleu-sombre type, same accents. */
export const octobotLight = defineBrandKit({
  extends: octobotDark,
  id: 'octobot-light',
  name: 'OctoBot — Light',
  colors: {
    canvas: '#f3f6f8',
    surface: '#ffffff',
    surfaceAlt: '#0f1237',
    ink: '#0f1237',
    inkMuted: '#4d7db9',
    primary: '#31bac9',
    secondary: '#5ba0cc',
    accent: '#f0c53b',
    heroFrom: '#55b7f5',
    heroTo: '#152166',
    badge: { new: '#0f1237', update: '#31bac9', bugfix: '#f0c53b', improvement: '#5ba0cc', removed: '#a9bcd6', soon: '#f5de3e' },
    badgeInk: { new: '#f3f6f8', update: '#0f1237', bugfix: '#19283e', improvement: '#0f1237', removed: '#0f1237', soon: '#19283e' }
  },
  shadow: {
    card: '0 18px 44px -28px rgba(15, 18, 55, 0.35)',
    hero: '0 32px 80px -40px rgba(15, 18, 55, 0.45)'
  }
});

/** Halo: the octobot.cloud landing-page gradient, for launch covers. */
export const octobotHalo = defineBrandKit({
  extends: octobotDark,
  id: 'octobot-halo',
  name: 'OctoBot — Halo',
  colors: {
    canvas: '#0f1237',
    surface: '#19283e',
    surfaceAlt: '#152166',
    primary: '#32f1ce',
    secondary: '#26ddf1',
    accent: '#4893f1',
    heroFrom: '#57f5f7',
    heroTo: '#26448e',
    badge: { new: '#32f1ce', update: '#26ddf1', bugfix: '#f5de3e', improvement: '#55b7f5', removed: '#4d7db9', soon: '#4893f1' },
    badgeInk: { new: '#0f1237', update: '#0f1237', bugfix: '#19283e', improvement: '#0f1237', removed: '#f3f6f8', soon: '#f3f6f8' }
  }
});

/** High-contrast celebratory kit for milestone releases. */
export const midnight = defineBrandKit({
  extends: octobotLight,
  id: 'midnight',
  name: 'Midnight',
  colors: {
    canvas: '#f2f4f8',
    surface: '#ffffff',
    surfaceAlt: '#14161c',
    ink: '#0d1220',
    inkMuted: '#4d5876',
    primary: '#2f6bff',
    secondary: '#23c9d9',
    accent: '#f5c451',
    heroFrom: '#1b1d24',
    heroTo: '#0a0b0f'
  }
});

/** Quiet, ink-on-paper kit for PDF release notes. */
export const paper = defineBrandKit({
  id: 'paper',
  name: 'Paper',
  colors: {
    canvas: '#ffffff',
    surface: '#ffffff',
    surfaceAlt: '#1c1c18',
    ink: '#16160f',
    inkMuted: '#5f5f55',
    primary: '#1a1a17',
    secondary: '#7a7a6c',
    accent: '#c8462f',
    heroFrom: '#f4f4f2',
    heroTo: '#e9e9e4'
  },
  fonts: {
    display: { family: 'Fraunces', source: 'google', weights: [600, 700], fallback: 'Georgia, serif' },
    body: { family: 'IBM Plex Sans', source: 'google', weights: [400, 500, 600], fallback: 'system-ui, sans-serif' }
  },
  radius: { card: 6, hero: 8, image: 4, badge: 4 },
  shadow: { card: 'none', hero: 'none' },
  spacing: { gap: 18, pad: 26, outer: 56 }
});

export const brandPresets = { octobotDark, octobotLight, octobotHalo, midnight, paper };

export function getBrandPreset(id) {
  const found = Object.values(brandPresets).find((b) => b.id === id) ?? brandPresets[id];
  if (!found) throw new Error(`Unknown brand preset "${id}". Known: ${Object.values(brandPresets).map((b) => b.id).join(', ')}`);
  return found;
}
