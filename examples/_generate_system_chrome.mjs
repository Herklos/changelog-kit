import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { ChangelogKit } from '@changelog-kit/core';
import { builtinTemplates } from '@changelog-kit/templates';
import { PlaywrightRenderer } from '@changelog-kit/renderer-playwright';
import { toStaticHtml } from '@changelog-kit/render-web';
import { MockImageProvider, CachedProvider } from '@changelog-kit/ai-images';
import brand from './octobot.brand.js';

const doc = JSON.parse(await readFile(new URL('./octobot-3.0.json', import.meta.url), 'utf8'));

// Sandbox has no Playwright-bundled Chromium build for this OS — drive the
// system-installed Google Chrome via Playwright's `channel` launch option
// instead. Scratch-only script, not part of the shipped example.
const browser = await chromium.launch({ channel: 'chrome', args: ['--font-render-hinting=none'] });

const kit = new ChangelogKit({
  brand,
  templates: builtinTemplates,
  renderer: new PlaywrightRenderer({ browser }),
  serializer: toStaticHtml,
  imageProvider: new CachedProvider(new MockImageProvider()),
  onEvent: (event, p) => console.log(event, p.template ?? p.key ?? '')
});

const outDir = path.resolve('out');
await mkdir(outDir, { recursive: true });

await kit.generate({
  doc,
  template: Object.keys(builtinTemplates),
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

await browser.close();
