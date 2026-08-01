import { ImageProvider } from './provider.js';

/** Registry so providers can be selected by string from config / CLI flags. */
const registry = new Map();

export function registerProvider(id, factory) {
  registry.set(id, factory);
}

export function listProviders() {
  return [...registry.keys()];
}

/**
 * @param {string|ImageProvider|undefined} spec  provider id, or an instance.
 * @param {object} [config]
 * @returns {Promise<ImageProvider|undefined>}
 */
export async function createProvider(spec, config = {}) {
  if (!spec) return undefined;
  if (typeof spec !== 'string') return spec;
  if (!registry.has(spec)) {
    throw new Error(`Unknown image provider "${spec}". Known: ${listProviders().join(', ')}`);
  }
  const factory = registry.get(spec);
  return factory(config);
}

/** Wraps any provider with an on-disk cache keyed by the resolved prompt. */
export class CachedProvider extends ImageProvider {
  constructor(inner, { dir = '.cache/changelog-images', fs, path, crypto } = {}) {
    super({ id: `${inner.id}+cache`, model: inner.model });
    this.inner = inner;
    this.dir = dir;
    this._fs = fs;
    this._path = path;
    this._crypto = crypto;
  }

  async generate(request) {
    const fs = this._fs ?? (await import('node:fs/promises'));
    const path = this._path ?? (await import('node:path'));
    const crypto = this._crypto ?? (await import('node:crypto'));
    const prepared = this.inner.prepare(request);
    const key = crypto.createHash('sha1').update(`${this.inner.id}|${this.inner.model}|${prepared.prompt}|${prepared.width}x${prepared.height}`).digest('hex');
    const file = path.join(this.dir, `${key}.png`);
    try {
      const cached = await fs.readFile(file);
      return { provider: this.inner.id, model: this.inner.model, revisedPrompt: prepared.prompt, path: file, dataUri: `data:image/png;base64,${cached.toString('base64')}`, cached: true };
    } catch { /* miss */ }

    const result = await this.inner.generate(request);
    const base64 = result.dataUri?.split(',')[1];
    if (base64) {
      await fs.mkdir(this.dir, { recursive: true });
      await fs.writeFile(file, Buffer.from(base64, 'base64'));
      result.path = file;
    }
    return result;
  }
}
