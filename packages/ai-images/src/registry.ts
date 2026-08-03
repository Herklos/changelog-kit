import { ImageProvider } from './provider.js';
import type { ImageProviderConfig, ImageRequest, ImageResult } from './provider.js';

/** Registry so providers can be selected by string from config / CLI flags. */
type ProviderFactory = (config?: ImageProviderConfig) => ImageProvider | Promise<ImageProvider>;

const registry = new Map<string, ProviderFactory>();

export function registerProvider(id: string, factory: ProviderFactory): void {
  registry.set(id, factory);
}

export function listProviders(): string[] {
  return [...registry.keys()];
}

/**
 * @param spec provider id, or an instance.
 */
export async function createProvider(
  spec?: string | ImageProvider,
  config: ImageProviderConfig = {}
): Promise<ImageProvider | undefined> {
  if (!spec) return undefined;
  if (typeof spec !== 'string') return spec;
  if (!registry.has(spec)) {
    throw new Error(`Unknown image provider "${spec}". Known: ${listProviders().join(', ')}`);
  }
  const factory = registry.get(spec)!;
  return factory(config);
}

export interface CachedProviderOptions {
  dir?: string;
  fs?: typeof import('node:fs/promises');
  path?: typeof import('node:path');
  crypto?: typeof import('node:crypto');
}

/** Wraps any provider with an on-disk cache keyed by the resolved prompt. */
export class CachedProvider extends ImageProvider {
  inner: ImageProvider;
  dir: string;
  _fs?: typeof import('node:fs/promises');
  _path?: typeof import('node:path');
  _crypto?: typeof import('node:crypto');

  constructor(inner: ImageProvider, { dir = '.cache/changelog-images', fs, path, crypto }: CachedProviderOptions = {}) {
    super({ id: `${inner.id}+cache`, model: inner.model });
    this.inner = inner;
    this.dir = dir;
    this._fs = fs;
    this._path = path;
    this._crypto = crypto;
  }

  async generate(request: ImageRequest): Promise<ImageResult> {
    const fs = this._fs ?? (await import('node:fs/promises'));
    const path = this._path ?? (await import('node:path'));
    const crypto = this._crypto ?? (await import('node:crypto'));
    const prepared = this.inner.prepare(request);
    const key = crypto.createHash('sha1').update(`${this.inner.id}|${this.inner.model}|${prepared.prompt}|${prepared.width}x${prepared.height}`).digest('hex');
    const file = path.join(this.dir, `${key}.bin`);
    // Cached bytes need their original mime back on a hit — providers don't
    // all emit PNG (e.g. `MockImageProvider` emits `image/svg+xml`), and
    // browsers refuse to decode an <img> whose data-URI mime disagrees with
    // its actual bytes. A small sidecar keeps the two in sync.
    const metaFile = path.join(this.dir, `${key}.json`);
    try {
      const [cached, meta] = await Promise.all([fs.readFile(file), fs.readFile(metaFile, 'utf8')]);
      const { mime } = JSON.parse(meta) as { mime: string };
      return { provider: this.inner.id, model: this.inner.model, revisedPrompt: prepared.prompt, path: file, dataUri: `data:${mime};base64,${cached.toString('base64')}`, cached: true };
    } catch { /* miss */ }

    const result = await this.inner.generate(request);
    const match = result.dataUri?.match(/^data:([^;]+);base64,(.*)$/s);
    if (match) {
      const [, mime, base64] = match;
      await fs.mkdir(this.dir, { recursive: true });
      await Promise.all([
        fs.writeFile(file, Buffer.from(base64, 'base64')),
        fs.writeFile(metaFile, JSON.stringify({ mime }))
      ]);
      result.path = file;
    }
    return result;
  }
}
