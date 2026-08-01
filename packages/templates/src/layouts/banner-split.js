import { htmlDocument, u, imageBackground } from '../base.js';
import { card, cardCss } from '../components.js';
import { esc } from '@changelog-kit/core';

/**
 * Landscape split: artwork on one side, version + up to three compact
 * features on the other. For OG images, email heroes and X posts.
 */
export const bannerSplit = {
  id: 'banner-split',
  name: 'Banner split',
  description: 'Landscape banner — artwork on the left, version and compact features on the right.',
  aspect: [16, 9],
  maxEntries: 2,
  render(ctx) {
    const { doc } = ctx;
    const body = `<div class="sheet banner">
  <div class="banner-art" style="${imageBackground(doc.hero)}">
    <div class="banner-badge">${esc(doc.version)}</div>
  </div>
  <div class="banner-copy">
    <div class="banner-head">
      ${doc.product ? `<span class="banner-product">${esc(doc.product)}</span>` : ''}
      ${doc.tagline ? `<span class="banner-tagline">${esc(doc.tagline)}</span>` : ''}
    </div>
    <div class="banner-list">
      ${doc.entries.slice(0, 2).map((e) => card({ ...e, image: undefined })).join('')}
    </div>
  </div>
</div>`;

    const css = `
${cardCss}
.banner{flex-direction:row;gap:calc(var(--brand-space-gap) * var(--u));}
.banner-art{
  flex:0 0 46%;border-radius:calc(var(--brand-radius-hero) * var(--u));
  box-shadow:var(--brand-shadow-hero);position:relative;
}
.banner-badge{
  position:absolute;left:${u(28)};bottom:${u(26)};
  font-family:var(--brand-font-display);font-weight:800;font-size:${u(120)};line-height:1;
  color:var(--brand-color-onDark,#fff);letter-spacing:${u(-4)};
}
.banner-copy{flex:1 1 auto;min-width:0;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:${u(18)};justify-content:center;}
.banner-head{display:flex;flex-direction:column;gap:${u(4)};}
.banner-product{font-family:var(--brand-font-display);font-weight:700;font-size:${u(52)};letter-spacing:${u(-1)};}
.banner-tagline{font-size:${u(26)};color:var(--brand-color-inkMuted);}
.banner-list{display:flex;flex-direction:column;gap:${u(12)};min-height:0;}
.banner-list .card{padding:${u(14)} ${u(20)};align-items:center;gap:${u(12)};}
.banner-list .card-text{flex-direction:row;align-items:baseline;flex-wrap:wrap;gap:${u(10)};}
.banner-list .badge{align-self:center;font-size:${u(15)};padding:${u(5)} ${u(12)};}
.banner-list .card-title{font-size:${u(26)};}
.banner-list .card-body{font-size:${u(19)};flex:1 1 100%;}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default bannerSplit;
