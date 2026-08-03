import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { MockImageProvider, CachedProvider, buildPrompt, createProvider, listProviders } from '../src/index.js';
import { brandPresets } from '@changelog-kit/brand';

test('registry exposes every adapter', () => {
  assert.deepEqual(listProviders().sort(), ['gemini', 'mock', 'openai', 'replicate', 'stability']);
});

test('createProvider returns an instance with the requested model', async () => {
  const provider = await createProvider('openai', { model: 'dall-e-3' });
  assert.equal(provider!.id, 'openai');
  assert.equal(provider!.model, 'dall-e-3');
});

test('prompt composition folds in brand imagery and palette', () => {
  const prompt = buildPrompt({
    prompt: 'an octopus at a trading desk',
    brand: brandPresets.octobotDark,
    entry: { title: 'Strategy Designer' },
    role: 'hero',
    doc: { version: '3.0' }
  });
  assert.match(prompt, /octopus at a trading desk/);
  assert.match(prompt, /Strategy Designer/);
  assert.match(prompt, /#85d6d7/);
  assert.match(prompt, /"3\.0"/);
  assert.match(prompt, /No text/);
});

test('mock provider is deterministic and offline', async () => {
  const provider = new MockImageProvider();
  const request = { prompt: 'octopus', brand: brandPresets.octobotDark, role: 'card' as const };
  const a = await provider.generate(request);
  const b = await provider.generate(request);
  assert.equal(a.dataUri, b.dataUri);
  assert.match(a.dataUri!, /^data:image\/svg\+xml;base64,/);
});

test('unknown providers fail loudly', async () => {
  await assert.rejects(() => createProvider('nope'), /Unknown image provider/);
});

test('CachedProvider preserves the wrapped provider\'s mime through a cache hit', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'changelog-kit-image-cache-'));
  try {
    const provider = new CachedProvider(new MockImageProvider(), { dir });
    const request = { prompt: 'octopus', brand: brandPresets.octobotDark, role: 'card' as const };

    const miss = await provider.generate(request);
    assert.equal(miss.cached, undefined);
    assert.match(miss.dataUri!, /^data:image\/svg\+xml;base64,/);

    const hit = await provider.generate(request);
    assert.equal(hit.cached, true);
    assert.equal(hit.dataUri, miss.dataUri, 'a cache hit must round-trip the exact same mime + bytes as the original generate()');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
