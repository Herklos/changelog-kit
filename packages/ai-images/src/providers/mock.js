import { ImageProvider, toDataUri } from '../provider.js';

/**
 * Deterministic offline provider: paints a brand-colored SVG gradient with a
 * hashed blob pattern. Used in tests, CI and `--dry-run` so a full generation
 * never needs network or API keys.
 */
export class MockImageProvider extends ImageProvider {
  static providerId = 'mock';
  static defaultModel = 'gradient-v1';

  constructor(config = {}) {
    super({ id: 'mock', model: MockImageProvider.defaultModel, ...config });
  }

  async generate(request) {
    const req = this.prepare(request);
    const colors = req.brand?.colors ?? {};
    const seed = hash(req.prompt);
    const from = colors.heroFrom ?? '#2a4a86';
    const to = colors.heroTo ?? '#0d1a3a';
    const accent = colors.accent ?? '#ff5a5f';
    const blobs = Array.from({ length: 5 }, (_, i) => {
      const r = 60 + ((seed >> (i * 3)) % 140);
      const cx = ((seed >> (i * 5)) % 100) + i * 7;
      const cy = ((seed >> (i * 7)) % 100);
      return `<circle cx="${cx}%" cy="${cy}%" r="${r}" fill="${i % 2 ? accent : colors.secondary ?? '#12b5cb'}" opacity="0.${3 + (i % 4)}"/>`;
    }).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${req.width}" height="${req.height}" viewBox="0 0 ${req.width} ${req.height}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>
<filter id="b"><feGaussianBlur stdDeviation="${Math.round(req.width / 14)}"/></filter></defs>
<rect width="100%" height="100%" fill="url(#g)"/><g filter="url(#b)">${blobs}</g></svg>`;
    return {
      provider: this.id,
      model: this.model,
      revisedPrompt: req.prompt,
      dataUri: toDataUri(Buffer.from(svg, 'utf8'), 'image/svg+xml')
    };
  }
}

function hash(value = '') {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) h = Math.imul(h ^ value.charCodeAt(i), 16777619);
  return Math.abs(h);
}

export default MockImageProvider;
