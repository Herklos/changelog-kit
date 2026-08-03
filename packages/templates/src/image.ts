import { Image } from '@changelog-kit/templates/rn';
import { h } from './h.js';
import { LinearFill } from './gradients.js';
import type { ReactElement } from 'react';
import type { ChangelogImage } from '@changelog-kit/core';
import type { Theme } from './theme.js';

export interface ResolvedImage {
  source: unknown;
  resizeMode: 'cover' | 'contain';
}

/**
 * Map a `ChangelogImage` to an RN `<Image>` source + resizeMode.
 * `image.focal` (CSS `object-position`) has no RN analogue — dropped in
 * favor of `resizeMode: 'cover'`, an accepted "close enough" approximation.
 * @param resolveSource defaults to `{ uri: src }`
 */
export function resolveImage(
  image?: ChangelogImage,
  resolveSource: (src: string) => unknown = (src) => ({ uri: src })
): ResolvedImage | null {
  if (!image?.src) return null;
  return { source: resolveSource(image.src), resizeMode: image.fit === 'contain' ? 'contain' : 'cover' };
}

const FILL_STYLE = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 };

export interface ArtSlotProps {
  image?: ChangelogImage;
  theme: Theme;
  style?: unknown;
  resolveImageSource?: (src: string) => unknown;
  borderRadius?: number;
}

/**
 * An art slot: the image when there is one, or a brand-gradient placeholder
 * (mirrors `imageBackground()`'s HTML fallback) when there isn't.
 *
 * Defaults to absolutely filling a `position:'relative'` parent (a full-bleed
 * background layer, e.g. `hero-sandwich`'s hero panel). Callers that need it
 * as a normal flex sibling instead (e.g. `Card`'s side-by-side art) must pass
 * `position:'relative'` in `style` to override the default.
 */
export function ArtSlot({ image, theme, style, resolveImageSource, borderRadius = 0 }: ArtSlotProps): ReactElement {
  const resolved = resolveImage(image, resolveImageSource);
  if (resolved) {
    return h(Image, {
      source: resolved.source,
      resizeMode: resolved.resizeMode,
      style: [FILL_STYLE, { borderRadius }, style]
    });
  }
  return h(LinearFill, { colors: [theme.colors.heroFrom, theme.colors.heroTo], angle: 135, style, borderRadius });
}
