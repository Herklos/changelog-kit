import { View } from '@changelog-kit/templates/rn';
import { h } from './h.js';
import type { ReactElement, ReactNode } from 'react';
import type { Theme } from './theme.js';

export interface CanvasProps {
  size: { width: number; height: number };
  theme: Theme;
  style?: unknown;
  children?: ReactNode;
}

/**
 * Root wrapper most layouts return: exactly `size.width x size.height`,
 * clipped, canvas-colored, padded — the RN equivalent of the old shared
 * `body` + `.sheet` shell (`packages/templates/src/base.js`, removed).
 * A layout that fully repaints the canvas itself (a hero gradient, a
 * full-bleed background image) builds its own root `<View>` instead and
 * skips this, matching what `whats-new-sheet`/`story-stack`/`teaser-poster`
 * already did in the HTML version.
 */
export function Canvas({ size, theme, style, children }: CanvasProps): ReactElement {
  return h(
    View,
    {
      style: [
        {
          width: size.width,
          height: size.height,
          overflow: 'hidden',
          backgroundColor: theme.colors.canvas,
          flexDirection: 'column',
          padding: theme.spacing.outer,
          gap: theme.spacing.gap
        },
        style
      ]
    },
    children
  );
}
