import { ImageProvider, toDataUri } from '../provider.js';
import type { ImageProviderConfig, ImageRequest, ImageResult, ProviderCheckResult } from '../provider.js';

export interface StabilityProviderConfig extends ImageProviderConfig {
  apiKey?: string;
  baseUrl?: string;
}

/** Stability AI (Stable Image Core / Ultra / SD3). */
export class StabilityImageProvider extends ImageProvider {
  static providerId = 'stability';
  static defaultModel = 'core';

  apiKey?: string;
  baseUrl: string;

  constructor(config: StabilityProviderConfig = {}) {
    super({ id: 'stability', model: config.model ?? StabilityImageProvider.defaultModel, ...config });
    this.apiKey = config.apiKey ?? process.env.STABILITY_API_KEY;
    this.baseUrl = config.baseUrl ?? 'https://api.stability.ai/v2beta/stable-image/generate';
  }

  async check(): Promise<ProviderCheckResult> {
    return this.apiKey
      ? { ok: true, provider: this.id, model: this.model }
      : { ok: false, provider: this.id, reason: 'STABILITY_API_KEY is not set' };
  }

  async generate(request: ImageRequest): Promise<ImageResult> {
    const req = this.prepare(request);
    if (!this.apiKey) throw new Error('StabilityImageProvider: missing apiKey / STABILITY_API_KEY');
    const form = new FormData();
    form.set('prompt', req.prompt);
    if (req.negativePrompt) form.set('negative_prompt', req.negativePrompt);
    form.set('aspect_ratio', stabilityAspect(req.width!, req.height!));
    form.set('output_format', 'png');
    const res = await fetch(`${this.baseUrl}/${this.model}`, {
      method: 'POST',
      signal: req.signal,
      headers: { authorization: `Bearer ${this.apiKey}`, accept: 'image/*' },
      body: form
    });
    if (!res.ok) throw new Error(`Stability ${res.status}: ${await res.text()}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    return { provider: this.id, model: this.model, revisedPrompt: req.prompt, dataUri: toDataUri(buffer) };
  }
}

function stabilityAspect(width: number, height: number): string {
  const allowed: Record<string, number> = { '1:1': 1, '4:5': 0.8, '2:3': 0.667, '9:16': 0.5625, '3:2': 1.5, '16:9': 1.778, '21:9': 2.33 };
  const ratio = width / height;
  return Object.entries(allowed).sort((a, b) => Math.abs(a[1] - ratio) - Math.abs(b[1] - ratio))[0][0];
}

export default StabilityImageProvider;
