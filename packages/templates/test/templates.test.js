import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeDoc, resolveSize } from '@changelog-kit/core';
import { brandPresets } from '@changelog-kit/brand';
import { builtinTemplates } from '../src/index.js';

const doc = normalizeDoc({
  product: 'OctoBot',
  version: '3.0',
  date: '2026-08-01',
  tagline: 'Out now',
  hero: { src: 'data:image/svg+xml;utf8,<svg/>' },
  footer: 'OctoBot',
  entries: [
    { kind: 'new', title: 'Strategy Designer', body: 'Visual builder', image: { src: 'a.png' } },
    { kind: 'new', title: 'TradingView signals', body: 'From your alerts', image: { src: 'b.png' } },
    { kind: 'improvement', title: 'Backtesting', body: '10x faster', image: { src: 'c.png' } },
    { kind: 'update', title: 'Portfolio', body: 'Live PnL', image: { src: 'd.png' } },
    { kind: 'bugfix', title: 'Stability', body: 'Over **40 fixes**' }
  ]
});

const SIZES = ['instagram-portrait', 'instagram-story', 'og-image', 'a4'];

for (const template of Object.values(builtinTemplates)) {
  test(`${template.id} renders at every size`, () => {
    assert.ok(template.name && typeof template.render === 'function');
    for (const preset of SIZES) {
      const size = resolveSize({ format: 'png', preset }, template);
      const html = template.render({ doc, brand: brandPresets.octobotDark, size, target: { format: 'png' }, template });
      assert.match(html, /^<!doctype html>/);
      assert.ok(!html.includes('undefined'), `${template.id}@${preset} leaked "undefined"`);
      assert.ok(!html.includes('NaN'), `${template.id}@${preset} leaked "NaN"`);
      assert.ok(html.includes(`--w:${size.width}px`));
    }
  });

  test(`${template.id} uses only brand tokens and the scale unit`, () => {
    const size = resolveSize({ format: 'png', preset: 'instagram-portrait' }, template);
    const html = template.render({ doc, brand: brandPresets.paper, size, target: { format: 'png' }, template });
    const css = html.slice(html.indexOf('*,*::before'), html.indexOf('</style>')).replace(/var\([^)]*\)/g, '').replace(/rgba?\([^)]*\)/g, '');
    assert.ok(!/#[0-9a-f]{3,8}\b/i.test(css), `${template.id} hardcodes a hex color`);
  });
}

test('escapes html in user content', () => {
  const hostile = normalizeDoc({ version: '1.0', product: '<script>', entries: [{ title: '<img src=x>' }] });
  const size = resolveSize({ format: 'png', preset: 'instagram-portrait' });
  const html = builtinTemplates['feature-grid'].render({
    doc: hostile, brand: brandPresets.octobotDark, size, target: { format: 'png' }
  });
  assert.ok(!html.includes('<img src=x>'));
  assert.ok(html.includes('&lt;img src=x&gt;'));
});
