/**
 * Shared type definitions. `TBrand`/`TElement` stay generic (default
 * `unknown`) here so core never actually imports `@changelog-kit/brand` or
 * `react` — `@changelog-kit/templates` re-exports these specialized to its
 * own `BrandKit` and `ReactElement`.
 */

export type EntryKind = 'new' | 'update' | 'bugfix' | 'improvement' | 'removed' | 'soon';

export interface ChangelogImage {
  /** Absolute path, URL or data: URI. */
  src?: string;
  /** AI prompt used when `src` is missing. */
  prompt?: string;
  alt?: string;
  fit?: 'cover' | 'contain';
  /** CSS object-position, e.g. "50% 30%". */
  focal?: string;
  /** Set by ChangelogKit#materializeImages once an AI provider fills `src`. */
  generated?: boolean;
}

export interface ChangelogEntry {
  /** At least one of `title`/`body` is required (enforced by `normalizeDoc`). */
  title?: string;
  /** Supports a tiny subset of markdown: **bold**, *italic*, `code`. */
  body?: string;
  /** Drives the badge label + color. Default 'new'. */
  kind?: EntryKind;
  /** Overrides the badge label. */
  badge?: string;
  image?: ChangelogImage;
  /** Hint for templates that have a hero slot. */
  featured?: boolean;
  /** Grid span hint (1 = half width, 2 = full width). */
  span?: number;
  /** Render this card on the inverted surface. */
  dark?: boolean;
  /** Skip in card rows; only used as hero art. */
  heroOnly?: boolean;
}

export interface ChangelogDoc {
  /** e.g. "SuperAge" */
  product: string;
  /** e.g. "4.7" */
  version: string;
  /** e.g. "Out now on the App Store" */
  tagline?: string;
  /** ISO date. */
  date?: string;
  status?: 'released' | 'upcoming';
  hero?: ChangelogImage;
  entries: ChangelogEntry[];
  footer?: string;
  meta?: Record<string, unknown>;
}

export interface RenderSize {
  /** CSS pixels of the design canvas. */
  width: number;
  /** CSS pixels of the design canvas. */
  height: number;
  /** Device pixel ratio multiplier. Default 1. */
  scale?: number;
}

export interface Target {
  /** 'native' is the live React Native rendering path (`Changelog` component) — not an export format. */
  format: 'png' | 'jpg' | 'jpeg' | 'webp' | 'pdf' | 'svg' | 'html' | 'native';
  /** Name from SIZE_PRESETS. */
  preset?: string;
  width?: number;
  height?: number;
  scale?: number;
  /** jpg / webp only, 1-100. */
  quality?: number;
  /** Output basename override. */
  name?: string;
}

export interface RenderContext<TBrand = unknown, TElement = unknown> {
  doc: ChangelogDoc;
  brand: TBrand;
  size: RenderSize;
  target: Target;
  template?: Template<TBrand, TElement>;
  /** Resolved image src by key. */
  assets?: Record<string, string>;
  /** RN-only: canvas measured width a template scales its `u()` unit against. */
  baseWidth?: number;
  fontFamilies?: { display?: string; body?: string };
  resolveImageSource?: (src: string) => unknown;
}

export interface Template<TBrand = unknown, TElement = unknown> {
  id: string;
  name: string;
  description?: string;
  /** Preferred aspect ratio. */
  aspect?: [number, number];
  maxEntries?: number;
  /** Pure, no I/O, no state. */
  render: (ctx: RenderContext<TBrand, TElement>) => TElement;
}

export interface RendererResult {
  data: Buffer | Uint8Array | string;
  contentType: string;
}

export interface Renderer<TBrand = unknown, TElement = unknown> {
  render: (html: string, ctx: RenderContext<TBrand, TElement>) => Promise<RendererResult>;
  dispose?: () => Promise<void>;
}

/** Turns a template's React element into a full HTML document (server-side render). */
export type Serializer<TBrand = unknown, TElement = unknown> = (
  element: TElement,
  ctx: RenderContext<TBrand, TElement>
) => string;
