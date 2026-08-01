import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeDoc, resolveSize, pendingImages } from '../src/index.js';

const doc = {
  product: 'SuperAge',
  version: '4.7',
  entries: [
    { title: 'A', body: 'b' },
    { title: 'B', kind: 'bugfix', image: { prompt: 'x' } }
  ]
};

test('normalizeDoc fills defaults', () => {
  const out = normalizeDoc(doc);
  assert.equal(out.entries[0].kind, 'new');
  assert.equal(out.entries[0].badge, 'NEW');
  assert.equal(out.entries[1].badge, 'BUGFIX');
});

test('normalizeDoc rejects bad input', () => {
  assert.throws(() => normalizeDoc({ entries: [] }));
  assert.throws(() => normalizeDoc({ version: '1', entries: [{ title: 'x', kind: 'nope' }] }));
});

test('resolveSize derives height from template aspect', () => {
  const size = resolveSize({ format: 'png', width: 1000 }, { aspect: [1, 2] });
  assert.deepEqual(size, { width: 1000, height: 2000, scale: 1 });
});

test('resolveSize uses presets', () => {
  assert.deepEqual(resolveSize({ format: 'png', preset: 'og-image' }), { width: 1200, height: 630, scale: 2 });
});

test('pendingImages finds prompt-only slots', () => {
  assert.equal(pendingImages(normalizeDoc(doc)).length, 1);
});
