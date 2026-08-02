import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeDoc, resolveSize, pendingImages, inlineMd, inlineTokens } from '../src/index.js';

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

test('inlineMd renders bold, italic, code and line breaks', () => {
  assert.equal(inlineMd(''), '');
  assert.equal(inlineMd('plain text'), 'plain text');
  assert.equal(inlineMd('**bold**'), '<strong>bold</strong>');
  assert.equal(inlineMd('*italic*'), '<em>italic</em>');
  assert.equal(inlineMd('`code`'), '<code>code</code>');
  assert.equal(inlineMd('a **bold** b *italic* c `code` d'), 'a <strong>bold</strong> b <em>italic</em> c <code>code</code> d');
  assert.equal(inlineMd('Over **40 fixes**'), 'Over <strong>40 fixes</strong>');
  assert.equal(inlineMd('line1\nline2'), 'line1<br>line2');
  assert.equal(inlineMd('unmatched * star'), 'unmatched * star');
  assert.equal(inlineMd('unmatched ** double'), 'unmatched ** double');
  // The first "*" opens the italic run (matches the original sequential regex-chain
  // behavior) — a stray "*" is not "safe", it greedily starts emphasis.
  assert.equal(inlineMd('5 * 3 = 15, not *this*'), '5 <em> 3 = 15, not </em>this*');
});

test('inlineMd escapes html in every token', () => {
  assert.equal(inlineMd('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
  assert.equal(inlineMd('a & b < c > d "quoted"'), 'a &amp; b &lt; c &gt; d &quot;quoted&quot;');
  assert.equal(inlineMd('**a & b**'), '<strong>a &amp; b</strong>');
});

test('inlineMd does not nest emphasis inside bold (documented, non-nesting spec)', () => {
  assert.equal(
    inlineMd('**bold *not nested* still bold**'),
    '<strong>bold *not nested* still bold</strong>'
  );
});

test('inlineTokens is the shared spec that inlineMd serializes to HTML', () => {
  assert.deepEqual(inlineTokens('a **b** c'), [
    { type: 'text', value: 'a ' },
    { type: 'bold', value: 'b' },
    { type: 'text', value: ' c' }
  ]);
  assert.deepEqual(inlineTokens('line1\nline2'), [
    { type: 'text', value: 'line1' },
    { type: 'break' },
    { type: 'text', value: 'line2' }
  ]);
});
