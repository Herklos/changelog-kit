/**
 * The one interface every image backend implements.
 */
import type { BrandKit } from '@changelog-kit/brand';

/** Minimal doc shape `buildPrompt()` reads — deliberately not core's `ChangelogDoc` (this package has no dependency on `@changelog-kit/core`). */
export interface ImageRequestDoc {
  version?: string;
  [key: string]: unknown;
}

/** Minimal entry shape `buildPrompt()` reads — deliberately not core's `ChangelogEntry`. */
export interface ImageRequestEntry {
  title?: string;
  [key: string]: unknown;
}

export interface ImageRequest {
  prompt: string;
  negativePrompt?: string;
  brand?: BrandKit;
  doc?: ImageRequestDoc;
  entry?: ImageRequestEntry;
  role?: 'hero' | 'card' | 'background';
  width?: number;
  height?: number;
  /** e.g. "4:5" */
  aspect?: string;
  n?: number;
  signal?: AbortSignal;
  /** Provider-specific extra request fields (e.g. `transparent` for OpenAI). */
  [key: string]: unknown;
}

export interface ImageResult {
  url?: string;
  dataUri?: string;
  path?: string;
  provider: string;
  model?: string;
  revisedPrompt: string;
  /** Set by `CachedProvider` on a cache hit. */
  cached?: boolean;
}

export interface ProviderCheckResult {
  ok: boolean;
  provider: string;
  model?: string;
  reason?: string;
}

export interface ImageProviderConfig {
  id?: string;
  model?: string;
  defaults?: Record<string, unknown>;
}

export class ImageProvider {
  static providerId?: string;
  static defaultModel?: string;

  id: string;
  model?: string;
  defaults: Record<string, unknown>;
  config: ImageProviderConfig;

  constructor(config: ImageProviderConfig = {}) {
    this.id = config.id ?? (this.constructor as typeof ImageProvider).providerId ?? 'provider';
    this.model = config.model ?? (this.constructor as typeof ImageProvider).defaultModel;
    this.defaults = config.defaults ?? {};
    this.config = config;
  }

  /** Subclasses implement this. Must return an ImageResult. */
  // eslint-disable-next-line no-unused-vars
  async generate(_request: ImageRequest): Promise<ImageResult> {
    throw new Error(`${this.id}: generate() not implemented`);
  }

  /** Cheap capability probe used by the CLI to fail early. */
  async check(): Promise<ProviderCheckResult> {
    return { ok: true, provider: this.id, model: this.model };
  }

  /** Normalise a request: apply defaults, brand style, size from role. */
  prepare(request: ImageRequest): ImageRequest {
    const merged: ImageRequest = { n: 1, ...this.defaults, ...request };
    merged.prompt = buildPrompt(merged);
    merged.negativePrompt = merged.negativePrompt ?? merged.brand?.imagery?.negative;
    if (!merged.width || !merged.height) {
      const [w, h] = sizeForRole(merged.role);
      merged.width ??= w;
      merged.height ??= h;
    }
    merged.aspect ??= `${merged.width}:${merged.height}`;
    return merged;
  }
}

function sizeForRole(role?: ImageRequest['role']): [number, number] {
  if (role === 'hero') return [1024, 1024];
  if (role === 'background') return [1024, 1536];
  return [768, 768];
}

/** Compose the final prompt from the entry text + brand imagery guidance. */
export function buildPrompt(request: ImageRequest): string {
  const { prompt, brand, doc, entry, role } = request;
  const bits: (string | undefined)[] = [prompt];
  if (entry?.title && !prompt.includes(entry.title)) bits.push(`Subject: ${entry.title}.`);
  if (brand?.imagery?.style) bits.push(brand.imagery.style);
  if (role === 'hero' && doc?.version) bits.push(`Composition leaves room for the large numeral "${doc.version}".`);
  if (brand?.imagery?.background) bits.push(brand.imagery.background);
  if (brand?.colors) {
    bits.push(`Palette: ${[brand.colors.primary, brand.colors.secondary, brand.colors.accent].filter(Boolean).join(', ')}.`);
  }
  bits.push('No text, no lettering, no watermark.');
  return bits.filter(Boolean).join(' ');
}

export function toDataUri(buffer: Buffer | Uint8Array | string, mime = 'image/png'): string {
  const b64 = typeof buffer === 'string' ? buffer : Buffer.from(buffer).toString('base64');
  return `data:${mime};base64,${b64}`;
}
