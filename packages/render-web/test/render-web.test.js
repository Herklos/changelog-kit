import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { View, Text } from '@changelog-kit/templates/rn';
import { toStaticHtml } from '../src/index.js';
import { normalizeDoc, resolveSize } from '@changelog-kit/core';
import { brandPresets } from '@changelog-kit/brand';

const h = React.createElement;

const doc = normalizeDoc({ product: 'OctoBot', version: '3.0', entries: [{ title: 'Hi', body: 'World' }] });
const size = resolveSize({ format: 'png', preset: 'instagram-portrait' });
const brand = brandPresets.octobotDark;

test('toStaticHtml renders a doctype document sized to the canvas', () => {
  const element = h(
    View,
    { style: { width: size.width, height: size.height, backgroundColor: brand.colors.canvas } },
    h(Text, { style: { color: brand.colors.ink, fontSize: 40 } }, 'Hello RN-web')
  );
  const html = toStaticHtml(element, { doc, brand, size, target: { format: 'html' } });
  assert.match(html, /^<!doctype html>/);
  assert.ok(html.includes(`width:${size.width}px`));
  assert.ok(html.includes(`height:${size.height}px`));
  assert.ok(html.includes('Hello RN-web'));
  assert.ok(!html.includes('undefined'));
});

test('toStaticHtml preserves box-shadow with negative spread', () => {
  const element = h(View, { style: { boxShadow: brand.shadow.card } }, null);
  const html = toStaticHtml(element, { doc, brand, size, target: { format: 'html' } });
  assert.ok(html.includes(brand.shadow.card));
});

test('toStaticHtml escapes doc.product/version in the <title>', () => {
  const hostile = normalizeDoc({ version: '1.0<script>', product: '<script>alert(1)</script>', entries: [{ title: 'x' }] });
  const element = h(View, null, null);
  const html = toStaticHtml(element, { doc: hostile, brand, size, target: { format: 'html' } });
  assert.ok(!html.includes('<script>alert(1)</script>'), 'unescaped script tag leaked into the document');
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
});
