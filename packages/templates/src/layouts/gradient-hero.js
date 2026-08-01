import { htmlDocument, u, imageBackground } from '../base.js';
import { card, cardCss } from '../components.js';
import { esc } from '@changelog-kit/core';

/**
 * Gradient hero built entirely from brand tokens (no artwork required):
 * big version wordmark on a brand gradient, cards above and below.
 */
export const gradientHero = {
  id: 'gradient-hero',
  name: 'Gradient hero',
  description: 'Brand-gradient hero panel with an oversized version number; artwork optional.',
  aspect: [4, 5],
  maxEntries: 4,
  render(ctx) {
    const { doc } = ctx;
    const entries = doc.entries.slice(0, 4);
    const row = (list, dark = false) =>
      `<div class="row">${list.map((e) => card(e, { dark: dark || e.dark })).join('')}</div>`;

    const body = `<div class="sheet">
  ${row(entries.slice(0, 2))}
  <section class="ghero">
    <div class="ghero-art" style="${doc.hero?.src ? imageBackground(doc.hero) : 'background:none'}"></div>
    <div class="ghero-copy">
      ${doc.product ? `<span class="ghero-product">${esc(doc.product)}</span>` : ''}
      <span class="ghero-version">${esc(doc.version)}</span>
      ${doc.tagline ? `<span class="ghero-tagline">${esc(doc.tagline)}</span>` : ''}
    </div>
  </section>
  ${row(entries.slice(2, 4))}
</div>`;

    const css = `
${cardCss}
.row{display:grid;grid-template-columns:1fr 1fr;gap:calc(var(--brand-space-gap) * var(--u));}
.row .card{min-height:${u(215)};}
.ghero{
  position:relative;flex:1 1 auto;min-height:${u(520)};overflow:hidden;
  border-radius:calc(var(--brand-radius-hero) * var(--u));
  background:linear-gradient(135deg,var(--brand-color-heroFrom) 0%,var(--brand-color-heroTo) 100%);
  box-shadow:var(--brand-shadow-hero);
  display:flex;align-items:center;
}
.ghero-art{position:absolute;inset:0;}
.ghero-copy{
  position:relative;display:flex;flex-direction:column;align-items:center;
  padding-left:${u(56)};padding-right:${u(56)};width:100%;
  color:var(--brand-color-onDark,#fff);text-align:center;
}
.ghero-product{font-family:var(--brand-font-display);font-weight:700;font-size:${u(56)};letter-spacing:${u(-1)};}
.ghero-version{
  font-family:var(--brand-font-display);font-weight:800;font-size:${u(250)};line-height:.88;
  letter-spacing:${u(-10)};text-shadow:0 ${u(10)} ${u(30)} rgba(0,0,0,.22);
}
.ghero-tagline{font-size:${u(32)};font-weight:500;opacity:.95;margin-top:${u(10)};}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default gradientHero;
