import { htmlDocument, u } from '../base.js';
import { card, cardCss } from '../components.js';
import { esc } from '@changelog-kit/core';

/**
 * Header + masonry-ish grid of feature cards. No hero — scales from 2 to 8
 * entries and to any aspect ratio, so it is the safe default for odd sizes.
 */
export const featureGrid = {
  id: 'feature-grid',
  name: 'Feature grid',
  description: 'Version header with a responsive grid of feature cards. No artwork required.',
  aspect: [4, 5],
  maxEntries: 8,
  render(ctx) {
    const { doc } = ctx;
    const entries = doc.entries.slice(0, 8);
    const body = `<div class="sheet">
  <header class="head">
    <div class="head-left">
      ${doc.product ? `<span class="head-product">${esc(doc.product)}</span>` : ''}
      <span class="head-version">${esc(doc.version)}</span>
    </div>
    <div class="head-right">
      ${doc.tagline ? `<span class="head-tagline">${esc(doc.tagline)}</span>` : ''}
      ${doc.date ? `<span class="head-date">${esc(doc.date)}</span>` : ''}
    </div>
  </header>
  <div class="grid">
    ${entries.map((e) => `<div class="cell" style="grid-column:span ${e.span > 1 ? 2 : 1}">${card(e, { dark: e.dark })}</div>`).join('')}
  </div>
</div>`;

    const css = `
${cardCss}
.head{display:flex;align-items:flex-end;justify-content:space-between;gap:${u(20)};padding-bottom:${u(24)};}
.head-left{display:flex;align-items:baseline;gap:${u(16)};}
.head-product{font-family:var(--brand-font-display);font-weight:700;font-size:${u(46)};}
.head-version{
  font-family:var(--brand-font-display);font-weight:800;font-size:${u(92)};line-height:.9;
  letter-spacing:${u(-3)};color:var(--brand-color-primary);
}
.head-right{display:flex;flex-direction:column;align-items:flex-end;gap:${u(4)};color:var(--brand-color-inkMuted);font-size:${u(24)};}
.grid{
  flex:1 1 auto;display:grid;grid-template-columns:1fr 1fr;
  gap:calc(var(--brand-space-gap) * var(--u));align-content:start;
}
.cell{display:flex;}
.cell .card{width:100%;}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default featureGrid;
