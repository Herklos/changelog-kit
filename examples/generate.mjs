import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { ChangelogKit } from '@changelog-kit/core';
import { builtinTemplates } from '@changelog-kit/templates';
import { PlaywrightRenderer } from '@changelog-kit/renderer-playwright';
import { MockImageProvider, CachedProvider } from '@changelog-kit/ai-images';
import brand from './octobot.brand.js';

const doc = JSON.parse(await readFile(new URL('./octobot-3.0.json', import.meta.url), 'utf8'));

// Swap MockImageProvider for OpenAIImageProvider / ReplicateImageProvider /
// StabilityImageProvider / GeminiImageProvider — same interface, no other change.
const kit = new ChangelogKit({
  brand,
  templates: builtinTemplates,
  renderer: new PlaywrightRenderer(),
  imageProvider: new CachedProvider(new MockImageProvider()),
  onEvent: (event, p) => console.log(event, p.template ?? p.key ?? '')
});

const outDir = path.resolve('out');
await mkdir(outDir, { recursive: true });

await kit.generate({
  doc,
  template: ['hero-sandwich', 'bento-mosaic', 'spotlight', 'story-stack', 'terminal-notes', 'banner-split', 'release-notes'],
  targets: [
    { format: 'png', preset: 'instagram-portrait' },
    { format: 'jpg', preset: 'instagram-square', quality: 92 },
    { format: 'webp', width: 1200, height: 1500 },
    { format: 'png', preset: 'instagram-story' },
    { format: 'png', preset: 'og-image' },
    { format: 'pdf', preset: 'a4' }
  ],
  write: async (file) => {
    await writeFile(path.join(outDir, file.filename), file.data);
    console.log('→', file.filename);
  }
});

await kit.dispose();
