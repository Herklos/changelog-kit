import { ImageProvider, toDataUri } from '../provider.js';

/** Replicate — any image model, polled to completion. */
export class ReplicateImageProvider extends ImageProvider {
  static providerId = 'replicate';
  static defaultModel = 'black-forest-labs/flux-1.1-pro';

  constructor(config = {}) {
    super({ id: 'replicate', model: config.model ?? ReplicateImageProvider.defaultModel, ...config });
    this.apiKey = config.apiKey ?? process.env.REPLICATE_API_TOKEN;
    this.baseUrl = config.baseUrl ?? 'https://api.replicate.com/v1';
    this.pollInterval = config.pollInterval ?? 1200;
    this.timeout = config.timeout ?? 120000;
    this.inline = config.inline ?? true; // fetch the result and inline it as a data URI
  }

  async check() {
    return this.apiKey
      ? { ok: true, provider: this.id, model: this.model }
      : { ok: false, provider: this.id, reason: 'REPLICATE_API_TOKEN is not set' };
  }

  async generate(request) {
    const req = this.prepare(request);
    if (!this.apiKey) throw new Error('ReplicateImageProvider: missing apiKey / REPLICATE_API_TOKEN');
    const headers = { authorization: `Bearer ${this.apiKey}`, 'content-type': 'application/json' };
    const start = await fetch(`${this.baseUrl}/models/${this.model}/predictions`, {
      method: 'POST',
      headers,
      signal: req.signal,
      body: JSON.stringify({
        input: {
          prompt: req.prompt,
          aspect_ratio: `${Math.round(req.width / gcd(req.width, req.height))}:${Math.round(req.height / gcd(req.width, req.height))}`,
          output_format: 'png',
          ...this.config.input
        }
      })
    });
    if (!start.ok) throw new Error(`Replicate ${start.status}: ${await start.text()}`);

    let prediction = await start.json();
    const deadline = Date.now() + this.timeout;
    while (['starting', 'processing'].includes(prediction.status)) {
      if (Date.now() > deadline) throw new Error('Replicate: prediction timed out');
      await new Promise((r) => setTimeout(r, this.pollInterval));
      const poll = await fetch(`${this.baseUrl}/predictions/${prediction.id}`, { headers, signal: req.signal });
      prediction = await poll.json();
    }
    if (prediction.status !== 'succeeded') {
      throw new Error(`Replicate failed: ${prediction.error ?? prediction.status}`);
    }
    const url = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
    if (!this.inline) return { provider: this.id, model: this.model, revisedPrompt: req.prompt, url };
    const image = Buffer.from(await (await fetch(url)).arrayBuffer());
    return { provider: this.id, model: this.model, revisedPrompt: req.prompt, url, dataUri: toDataUri(image) };
  }
}

const gcd = (a, b) => (b ? gcd(b, a % b) : a);

export default ReplicateImageProvider;
