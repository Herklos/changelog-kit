import type { RenderContext, Template } from '@changelog-kit/core';
import type { BrandKit } from '@changelog-kit/brand';
import type { ReactElement } from 'react';

/**
 * `@changelog-kit/core` keeps `RenderContext`/`Template` generic over
 * `TBrand`/`TElement` so it never imports `@changelog-kit/brand` or `react`.
 * This package is the one place that specializes them to a concrete
 * `BrandKit` + `ReactElement` — every layout's `render(ctx)` uses these.
 */
export type Ctx = RenderContext<BrandKit, ReactElement>;
export type TemplateDef = Template<BrandKit, ReactElement>;
