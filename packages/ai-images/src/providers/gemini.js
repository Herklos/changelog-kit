import { ImageProvider, toDataUri } from '../provider.js';

/** Google Gemini / Imagen image generation. */
export class GeminiImageProvider extends ImageProvider {
  static providerId = 'gemini';
  static defaultModel = 'imagen-3.0-generate-002';

  constructor(config = {}) {
    super({ id: 'gemini', model: config.model ?? GeminiImageProvider.defaultModel, ...config });
    this.apiKey = config.apiKey ?? process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
    this.baseUrl = config.baseUrl ?? 'https://generativelanguage.googleapis.com/v1beta';
  }

  async check() {
    return this.apiKey
      ? { ok: true, provider: this.id, model: this.model }
      : { ok: false, provider: this.id, reason: 'GOOGLE_API_KEY is not set' };
  }

  async generate(request) {
    const req = this.prepare(request);
    if (!this.apiKey) throw new Error('GeminiImageProvider: missing apiKey / GOOGLE_API_KEY');
    const res = await fetch(`${this.baseUrl}/models/${this.model}:predict?key=${this.apiKey}`, {
      method: 'POST',
      signal: req.signal,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: req.prompt }],
        parameters: { sampleCount: req.n ?? 1, aspectRatio: aspect(req.width, req.height) }
      })
    });
    if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
    const json = await res.json();
    const b64 = json.predictions?.[0]?.bytesBase64Encoded;
    return { provider: this.id, model: this.model, revisedPrompt: req.prompt, dataUri: b64 ? toDataUri(b64) : undefined };
  }
}

function aspect(width, height) {
  const ratio = width / height;
  const options = { '1:1': 1, '3:4': 0.75, '4:3': 1.333, '9:16': 0.5625, '16:9': 1.778 };
  return Object.entries(options).sort((a, b) => Math.abs(a[1] - ratio) - Math.abs(b[1] - ratio))[0][0];
}

export default GeminiImageProvider;
