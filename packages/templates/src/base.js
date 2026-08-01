import { cssVarBlock, fontHead } from '@changelog-kit/brand';
import { esc } from '@changelog-kit/core';

/** All templates design against this width; everything else scales from it. */
export const DESIGN_WIDTH = 1080;

/**
 * Shell for a render document. `--u` is the scale unit: write sizes as
 * `calc(24 * var(--u))` and the layout adapts to any output resolution.
 * @param {import('@changelog-kit/core').RenderContext} ctx
 * @param {{css: string, body: string, bodyClass?: string}} parts
 */
export function htmlDocument(ctx, { css, body, bodyClass = '' }) {
  const { brand, size, doc } = ctx;
  const unit = size.width / DESIGN_WIDTH;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(doc.product)} ${esc(doc.version)}</title>
${fontHead(brand)}
<style>
${cssVarBlock(brand)}
:root{
  --u:${unit.toFixed(6)}px;
  --w:${size.width}px;
  --h:${size.height}px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{width:var(--w);height:var(--h);}
body{
  background:var(--brand-color-canvas);
  color:var(--brand-color-ink);
  font-family:var(--brand-font-body);
  -webkit-font-smoothing:antialiased;
  text-rendering:geometricPrecision;
  overflow:hidden;
}
img{display:block;max-width:100%;}
strong{font-weight:700;}
code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:0.92em;}
.sheet{
  width:var(--w);height:var(--h);
  display:flex;flex-direction:column;
  padding:calc(var(--brand-space-outer) * var(--u));
  gap:calc(var(--brand-space-gap) * var(--u));
}
${css}
</style>
</head>
<body class="${bodyClass}">
${body}
</body>
</html>`;
}

/** px value that scales with the canvas. */
export const u = (n) => `calc(${n} * var(--u))`;

/** Background CSS for an image slot (or a graceful placeholder). */
export function imageBackground(image, brand) {
  if (image?.src) {
    // Single quotes: this string is injected into a double-quoted style attribute.
    const src = String(image.src).replace(/'/g, '%27');
    return `background-image:url('${src}');background-size:${image.fit ?? 'cover'};` +
      `background-position:${image.focal ?? '50% 50%'};background-repeat:no-repeat;`;
  }
  return `background:linear-gradient(135deg, var(--brand-color-heroFrom), var(--brand-color-heroTo));`;
}
