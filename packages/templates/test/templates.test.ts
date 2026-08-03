import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import ReactDOMServer from 'react-dom/server';
import * as ReactNativeWeb from 'react-native-web';
import { normalizeDoc, resolveSize } from '@changelog-kit/core';
import { brandPresets } from '@changelog-kit/brand';
import { builtinTemplates } from '../src/index.js';
import type { ReactElement } from 'react';
import type { RenderSize } from '@changelog-kit/core';

// A minimal, test-only stand-in for @changelog-kit/render-web's toStaticHtml —
// duplicated rather than depended on, so `templates` doesn't grow a devDependency
// back on the package that depends on it (pnpm would accept the cycle, but the
// architecture invariant in CLAUDE.md is "one-directional", full stop).
// react-native-web's AppRegistry has no unregister API — reusing one fixed
// key (registerComponent just overwrites its slot) keeps this from leaking
// one retained entry per test across this suite's hundreds of render calls.
// `@types/react-native-web` mistypes `AppRegistry` as type-only (see
// rn.web.ts's Platform/StyleSheet comment) — pull the real runtime value
// back out through the namespace object + a cast, same workaround.
const AppRegistry = (
  ReactNativeWeb as unknown as {
    AppRegistry: {
      registerComponent: (appKey: string, factory: () => () => ReactElement) => void;
      getApplication: (appKey: string) => { element: ReactElement; getStyleElement: () => ReactElement };
    };
  }
).AppRegistry;
const APP_KEY = 'test';
function toHtml(element: ReactElement, size: RenderSize): string {
  AppRegistry.registerComponent(APP_KEY, () => () => element);
  const { element: rootElement, getStyleElement } = AppRegistry.getApplication(APP_KEY);
  const body = ReactDOMServer.renderToStaticMarkup(rootElement);
  const style = ReactDOMServer.renderToStaticMarkup(getStyleElement());
  return `<!doctype html><html><head><style>html,body{width:${size.width}px;height:${size.height}px;}</style>${style}</head><body>${body}</body></html>`;
}

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
      const element = template.render({ doc, brand: brandPresets.octobotDark, size, target: { format: 'png' }, template });
      const html = toHtml(element, size);
      assert.match(html, /^<!doctype html>/);
      assert.ok(!html.includes('undefined'), `${template.id}@${preset} leaked "undefined"`);
      assert.ok(!html.includes('NaN'), `${template.id}@${preset} leaked "NaN"`);
      assert.ok(html.includes(`width:${size.width}px`));
    }
  });

  // Every other test in this suite renders with `brandPresets.octobotDark`
  // only — this is the one place a second kit (with a different set of
  // optional tokens, e.g. no `colors.onDark`) is ever exercised, catching a
  // token a layout reads that only `octobotDark` happens to define.
  test(`${template.id} renders with a second brand kit`, () => {
    const size = resolveSize({ format: 'png', preset: 'instagram-portrait' }, template);
    const element = template.render({ doc, brand: brandPresets.paper, size, target: { format: 'png' }, template });
    const html = toHtml(element, size);
    assert.ok(!html.includes('undefined'), `${template.id}@paper leaked "undefined"`);
    assert.ok(!html.includes('NaN'), `${template.id}@paper leaked "NaN"`);
  });
}

// Every color/radius/shadow/font is resolved from the brand theme, never a
// literal — except the one deliberate `theme.colors.onDark ?? '#fff'`
// fallback pattern every layout uses (the RN equivalent of the old CSS
// `var(--brand-color-onDark, #fff)` fallback). A hex literal anywhere else
// in a layout's *source* is a real violation — checked at the source level,
// not the rendered output, because RN style props need concrete color
// values, so brand-token-derived hex is indistinguishable from a hardcoded
// one once rendered (unlike the old CSS-custom-property output).
test('layouts and shared components hardcode no color beyond the onDark fallback', () => {
  // `../../src/` not `../src/` — this test file compiles to dist/test/, two
  // directories below the package root, while the *real* source (what this
  // test actually wants to audit, not the compiled dist/src/*.js output) is
  // packages/templates/src/.
  const srcDir = fileURLToPath(new URL('../../src/', import.meta.url));
  const layoutsDir = `${srcDir}layouts/`;
  const files = [
    ...readdirSync(layoutsDir).map((f) => `${layoutsDir}${f}`),
    ...['components.ts', 'gradients.ts', 'canvas.ts', 'image.ts', 'text.ts', 'theme.ts'].map((f) => `${srcDir}${f}`)
  ];
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    const hex = [...source.matchAll(/#[0-9a-fA-F]{3,8}\b/g)];
    for (const match of hex) {
      const before = source.slice(Math.max(0, match.index - 6), match.index);
      assert.match(before, /\?\?\s*['"]$/, `${file} hardcodes a color: ${match[0]}`);
    }
  }
});

// Every RN primitive must come from the package's own platform-split
// self-reference (`@changelog-kit/templates/rn` / `/svg`), never a bare
// `react-native`/`react-native-web`/`react-native-svg` import — a bare
// import would break the Node/SSR path (see rn.web.ts's comment).
test('layouts never import react-native/-web/-svg directly', () => {
  const layoutsDir = fileURLToPath(new URL('../../src/layouts/', import.meta.url));
  for (const file of readdirSync(layoutsDir)) {
    const source = readFileSync(`${layoutsDir}${file}`, 'utf8');
    assert.ok(!/from ['"]react-native(-web|-svg)?['"]/.test(source), `${file} imports a platform module directly`);
  }
});

test('escapes are never used — RichText/Text render literally', () => {
  const layoutsDir = fileURLToPath(new URL('../../src/layouts/', import.meta.url));
  for (const file of readdirSync(layoutsDir)) {
    const source = readFileSync(`${layoutsDir}${file}`, 'utf8');
    assert.ok(!/\besc\(|\binlineMd\(/.test(source), `${file} uses an HTML-string helper (esc/inlineMd)`);
  }
});
