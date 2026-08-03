import type { RenderSize, Target, Template } from './types.js';

/** `resolveSize` only ever reads `aspect` off a template. */
export type AspectSource = Pick<Template, 'aspect'>;

/** Named canvas sizes. `scale` is the default DPR for that preset. */
export const SIZE_PRESETS = {
  // Social
  'instagram-portrait': { width: 1080, height: 1350, scale: 2 },
  'instagram-square': { width: 1080, height: 1080, scale: 2 },
  'instagram-story': { width: 1080, height: 1920, scale: 2 },
  'x-landscape': { width: 1600, height: 900, scale: 2 },
  linkedin: { width: 1200, height: 1500, scale: 2 },
  'og-image': { width: 1200, height: 630, scale: 2 },
  'appstore-ipad': { width: 2048, height: 2732, scale: 1 },
  'appstore-iphone': { width: 1290, height: 2796, scale: 1 },
  // Print / documents (CSS px at 96dpi)
  a4: { width: 794, height: 1123, scale: 3 },
  letter: { width: 816, height: 1056, scale: 3 },
  'a4-landscape': { width: 1123, height: 794, scale: 3 },
  // Screen
  'email-hero': { width: 1200, height: 800, scale: 2 },
  'in-app': { width: 750, height: 1200, scale: 3 }
} as const satisfies Record<string, RenderSize>;

export type SizePresetName = keyof typeof SIZE_PRESETS;

/** Resolve a target into a concrete canvas size. */
export function resolveSize(target: Target, template?: AspectSource): RenderSize {
  const preset = target.preset ? (SIZE_PRESETS as Record<string, RenderSize>)[target.preset] : undefined;
  if (target.preset && !preset) {
    throw new Error(`Unknown size preset "${target.preset}". Known: ${Object.keys(SIZE_PRESETS).join(', ')}`);
  }
  let width = target.width ?? preset?.width;
  let height = target.height ?? preset?.height;
  const scale = target.scale ?? preset?.scale ?? 1;

  if (!width && !height) {
    width = 1080;
  }
  if (width && !height) {
    const [aw, ah] = template?.aspect ?? [4, 5];
    height = Math.round((width * ah) / aw);
  }
  if (height && !width) {
    const [aw, ah] = template?.aspect ?? [4, 5];
    width = Math.round((height * aw) / ah);
  }
  return { width: width as number, height: height as number, scale };
}
