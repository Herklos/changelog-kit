import test from 'node:test';
import assert from 'node:assert/strict';
import { MockImageProvider, buildPrompt, createProvider, listProviders } from '../src/index.js';
import { brandPresets } from '@changelog-kit/brand';

test('registry exposes every adapter', () => {
  assert.deepEqual(listProviders().sort(), ['gemini', 'mock', 'openai', 'replicate', 'stability']);
});

test('createProvider returns an instance with the requested model', async () => {
  const provider = await createProvider('openai', { model: 'dall-e-3' });
  assert.equal(provider.id, 'openai');
  assert.equal(provider.model, 'dall-e-3');
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
  assert.match(prompt, /#6d5efc/);
  assert.match(prompt, /"3\.0"/);
  assert.match(prompt, /No text/);
});

test('mock provider is deterministic and offline', async () => {
  const provider = new MockImageProvider();
  const request = { prompt: 'octopus', brand: brandPresets.octobotDark, role: 'card' };
  const a = await provider.generate(request);
  const b = await provider.generate(request);
  assert.equal(a.dataUri, b.dataUri);
  assert.match(a.dataUri, /^data:image\/svg\+xml;base64,/);
});

test('unknown providers fail loudly', async () => {
  await assert.rejects(() => createProvider('nope'), /Unknown image provider/);
});
