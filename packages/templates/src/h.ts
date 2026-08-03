import React from 'react';
import type { ReactElement, ReactNode } from 'react';

/**
 * No JSX, no build step — every layout builds its tree with this.
 *
 * Typed loosely on purpose: a single tree here must satisfy both React
 * Native's real components (native path) and react-native-web / raw DOM SVG
 * tags (web SSR path) at once — two different runtimes with two different
 * prop typings for the "same" component name. Rather than fight that with
 * per-component generics, `h`'s props are an open bag; the real type safety
 * in this package lives in the data model (`ChangelogDoc`, `Theme`,
 * `BrandKit`) and each component/layout's own typed props, not in the RN
 * element boundary.
 */
export const h = React.createElement as (
  type: unknown,
  props?: Record<string, unknown> | null,
  ...children: ReactNode[]
) => ReactElement;

export default h;
