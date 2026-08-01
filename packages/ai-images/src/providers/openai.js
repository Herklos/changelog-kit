import { ImageProvider, toDataUri } from '../provider.js';

/** OpenAI Images (gpt-image-1 / dall-e-3). Uses fetch — no SDK dependency. */
export class OpenAIImageProvider extends ImageProvider {
  static providerId = 'openai';
  static defaultModel = 'gpt-image-1';

  constructor(config = {}) {
    super({ id: 'openai', model: config.model ?? OpenAIImageProvider.defaultModel, ...config });
    this.apiKey = config.apiKey ?? process.env.OPENAI_API_KEY;
    this.baseUrl = config.baseUrl ?? 'https://api.openai.com/v1';
    this.quality = config.quality ?? 'high';
  }

  async check() {
    if (!this.apiKey) return { ok: false, provider: this.id, reason: 'OPENAI_API_KEY is not set' };
    return { ok: true, provider: this.id, model: this.model };
  }

  async generate(request) {
    const req = this.prepare(request);
    if (!this.apiKey) throw new Error('OpenAIImageProvider: missing apiKey / OPENAI_API_KEY');
    const size = nearestSize(req.width, req.height);
    const res = await fetch(`${this.baseUrl}/images/generations`, {
      method: 'POST',
      signal: req.signal,
      headers: { 'content-type': 'application/json', authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        model: this.model,
        prompt: req.prompt,
        size,
        n: req.n ?? 1,
        ...(this.model === 'gpt-image-1'
          ? { quality: this.quality, background: req.transparent ? 'transparent' : 'auto' }
          : { response_format: 'b64_json' })
      })
    });
    if (!res.ok) throw new Error(`OpenAI images ${res.status}: ${await res.text()}`);
    const json = await res.json();
    const item = json.data?.[0];
    return {
      provider: this.id,
      model: this.model,
      revisedPrompt: item?.revised_prompt ?? req.prompt,
      dataUri: item?.b64_json ? toDataUri(item.b64_json) : undefined,
      url: item?.url
    };
  }
}

function nearestSize(width, height) {
  const ratio = width / height;
  if (ratio > 1.2) return '1536x1024';
  if (ratio < 0.85) return '1024x1536';
  return '1024x1024';
}

export default OpenAIImageProvider;
