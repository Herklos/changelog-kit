import { htmlDocument, u, imageBackground } from '../base.js';
import { badge, badgeCss } from '../components.js';
import { esc, inlineMd } from '@changelog-kit/core';

/**
 * Asymmetric bento: one tall lead tile with artwork, a wide version tile and
 * a run of small tiles. The most "designed" of the grid layouts.
 */
export const bentoMosaic = {
  id: 'bento-mosaic',
  name: 'Bento mosaic',
  description: 'Asymmetric bento grid — a tall lead feature, a version tile and small supporting tiles.',
  aspect: [4, 5],
  maxEntries: 5,
  render(ctx) {
    const { doc } = ctx;
    const [lead, ...rest] = doc.entries;
    const small = rest.slice(0, 4);

    const tile = (entry, cls = '') => `<article class="tile ${entry.image ? 'tile--art' : ''} ${cls}">
      ${entry.image ? `<div class="tile-art tile-art--fill" style="${imageBackground(entry.image)}"></div>` : ''}
      <div class="tile-body">
        ${badge(entry)}
        ${entry.title ? `<h3 class="tile-title">${inlineMd(entry.title)}</h3>` : ''}
        ${entry.body ? `<p class="tile-text">${inlineMd(entry.body)}</p>` : ''}
      </div>
    </article>`;

    const body = `<div class="sheet mosaic">
  <article class="tile tile--lead tile--art">
    <div class="tile-art tile-art--fill" style="${imageBackground(lead.image ?? doc.hero)}"></div>
    <div class="tile-body">
      ${badge(lead)}
      <h3 class="tile-title tile-title--lg">${inlineMd(lead.title ?? '')}</h3>
      ${lead.body ? `<p class="tile-text tile-text--lg">${inlineMd(lead.body)}</p>` : ''}
    </div>
  </article>
  <article class="tile tile--version">
    <span class="v-product">${esc(doc.product)}</span>
    <span class="v-number">${esc(doc.version)}</span>
    ${doc.tagline ? `<span class="v-tagline">${esc(doc.tagline)}</span>` : ''}
  </article>
  ${small.map((e, i) => tile(e, i === 0 ? 'tile--wide' : '')).join('')}
</div>`;

    const css = `
${badgeCss}
.mosaic{
  display:grid;
  grid-template-columns:repeat(6,1fr);
  grid-auto-rows:1fr;
  gap:calc(var(--brand-space-gap) * var(--u));
}
.tile{
  position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;
  background:var(--brand-color-surface);
  border-radius:calc(var(--brand-radius-card) * var(--u));
  box-shadow:var(--brand-shadow-card);
  padding:${u(26)};gap:${u(10)};min-height:0;
  grid-column:span 3;grid-row:span 2;
}
.tile--lead{grid-column:span 4;grid-row:span 3;padding:${u(32)};}
.tile--version{
  grid-column:span 2;grid-row:span 3;justify-content:center;align-items:flex-start;gap:${u(2)};
  background:linear-gradient(150deg,var(--brand-color-heroFrom),var(--brand-color-heroTo));
  color:var(--brand-color-onDark,#fff);
}
.tile--wide{grid-column:span 6;grid-row:span 2;}
.tile-body{display:flex;flex-direction:column;gap:${u(9)};position:relative;z-index:2;}
.tile-art{position:absolute;inset:0;}
.tile-art--fill{border-radius:0;}
.tile--art::after{
  content:'';position:absolute;inset:0;z-index:1;
  background:linear-gradient(to top,rgba(4,6,20,.9) 0%,rgba(4,6,20,.62) 42%,rgba(4,6,20,.2) 100%);
}
.tile--art .tile-body{color:var(--brand-color-onDark,#fff);}
.tile--art .tile-text{color:rgba(255,255,255,.82);}
.tile-title{font-family:var(--brand-font-display);font-weight:700;font-size:${u(30)};line-height:1.14;letter-spacing:${u(-0.4)};text-wrap:balance;max-width:${u(460)};}
.tile-title--lg{font-size:${u(52)};letter-spacing:${u(-1.4)};max-width:${u(620)};}
.tile-text{font-size:${u(21)};line-height:1.3;color:var(--brand-color-inkMuted);max-width:${u(420)};text-wrap:pretty;}
.tile-text--lg{font-size:${u(26)};max-width:${u(620)};}
.v-product{font-family:var(--brand-font-display);font-weight:600;font-size:${u(30)};opacity:.85;}
.v-number{font-family:var(--brand-font-display);font-weight:800;font-size:${u(140)};line-height:.88;letter-spacing:${u(-6)};}
.v-tagline{font-size:${u(21)};opacity:.85;margin-top:${u(8)};text-wrap:pretty;}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default bentoMosaic;
