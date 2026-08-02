import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { AppRegistry } from 'react-native-web';
import { fontHead } from '@changelog-kit/brand';
import { esc } from '@changelog-kit/core';

// react-native-web's `AppRegistry` has no unregister API — every
// `registerComponent` call permanently retains its entry (and the closure
// over `element`) in the module's internal `runnables` map. Reusing one
// fixed key instead of a fresh one per call makes each `registerComponent`
// simply overwrite the same slot, so repeated `toStaticHtml` calls (e.g. a
// batch export) don't leak. Safe because `render()` is synchronous — there
// is never more than one in-flight registration at a time.
const APP_KEY = 'changelog-kit';

/**
 * Turn a template's React element into a full HTML document — the
 * `serializer` `ChangelogKit` needs to produce `html`/png/jpg/webp/pdf, and
 * the only place `@changelog-kit/render-web` touches HTML at all. The
 * element itself (built by `@changelog-kit/templates`) carries its own size,
 * background and layout; this shell only adds what a browser requires that
 * a component tree cannot: the doctype, the page title, web font `<link>`s
 * (`fontHead()` — a native host loads fonts itself, see `theme.js`), and the
 * react-native-web stylesheet.
 * @type {import('@changelog-kit/core').Serializer}
 */
export function toStaticHtml(element, ctx) {
  const { brand, doc, size } = ctx;
  AppRegistry.registerComponent(APP_KEY, () => () => element);
  const { element: rootElement, getStyleElement } = AppRegistry.getApplication(APP_KEY);

  const bodyHtml = ReactDOMServer.renderToStaticMarkup(rootElement);
  const styleHtml = ReactDOMServer.renderToStaticMarkup(getStyleElement());

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(doc.product)} ${esc(doc.version)}</title>
${fontHead(brand)}
<style>*,*::before,*::after{box-sizing:border-box;}html,body{margin:0;padding:0;width:${size.width}px;height:${size.height}px;overflow:hidden;}</style>
${styleHtml}
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

export { AppRegistry, React, ReactDOMServer };
