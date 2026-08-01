import { htmlDocument, u, imageBackground } from '../base.js';
import { badge, badgeCss } from '../components.js';
import { esc, inlineMd } from '@changelog-kit/core';

/**
 * The release inside a device: a phone bezel holding the artwork, headline
 * above, feature captions flanking it. Product-launch flavour.
 */
export const deviceShowcase = {
  id: 'device-showcase',
  name: 'Device showcase',
  description: 'Artwork inside a phone bezel, headline above, feature captions flanking the device.',
  aspect: [4, 5],
  maxEntries: 4,
  render(ctx) {
    const { doc } = ctx;
    const entries = doc.entries.slice(0, 4);
    const caption = (e) => `<div class="dev-cap">
      ${badge(e)}
      <h3 class="dev-cap-title">${inlineMd(e.title ?? '')}</h3>
      ${e.body ? `<p class="dev-cap-text">${inlineMd(e.body)}</p>` : ''}
    </div>`;

    const body = `<div class="sheet dev">
  <header class="dev-head">
    <span class="dev-product">${esc(doc.product)} <b>${esc(doc.version)}</b></span>
    ${doc.tagline ? `<p class="dev-tagline">${esc(doc.tagline)}</p>` : ''}
  </header>
  <div class="dev-stage">
    <div class="dev-col">${entries.slice(0, 2).map(caption).join('')}</div>
    <div class="dev-phone">
      <div class="dev-screen" style="${imageBackground(doc.hero ?? entries[0]?.image)}"></div>
      <span class="dev-notch"></span>
    </div>
    <div class="dev-col dev-col--right">${entries.slice(2, 4).map(caption).join('')}</div>
  </div>
  ${doc.footer ? `<p class="dev-footer">${esc(doc.footer)}</p>` : ''}
</div>`;

    const css = `
${badgeCss}
.badge{font-size:${u(15)};padding:${u(5)} ${u(12)};}
.dev{
  background:radial-gradient(100% 70% at 50% 0%,var(--brand-color-heroFrom) 0%,var(--brand-color-heroTo) 72%);
  color:var(--brand-color-onDark,#fff);align-items:center;text-align:center;gap:${u(24)};
}
.dev-head{display:flex;flex-direction:column;gap:${u(8)};align-items:center;}
.dev-product{font-family:var(--brand-font-display);font-weight:600;font-size:${u(52)};letter-spacing:${u(-1)};line-height:1.06;white-space:nowrap;}
.dev-product b{font-weight:800;}
.dev-tagline{font-size:${u(26)};opacity:.85;max-width:${u(620)};text-wrap:pretty;}
.dev-stage{
  flex:1 1 auto;min-height:0;align-self:stretch;
  display:grid;grid-template-columns:1fr 1.05fr 1fr;gap:${u(18)};align-items:center;
}
.dev-col{display:flex;flex-direction:column;gap:${u(22)};text-align:left;}
.dev-col--right{text-align:right;align-items:flex-end;}
.dev-col--right .badge{align-self:flex-end;}
.dev-cap{display:flex;flex-direction:column;gap:${u(8)};}
.dev-cap-title{font-family:var(--brand-font-display);font-weight:700;font-size:${u(28)};line-height:1.14;text-wrap:balance;}
.dev-cap-text{font-size:${u(21)};line-height:1.3;opacity:.78;text-wrap:pretty;}
.dev-phone{
  position:relative;height:100%;max-height:${u(760)};aspect-ratio:9 / 19;justify-self:center;
  border-radius:${u(54)};padding:${u(12)};
  background:linear-gradient(160deg,rgba(255,255,255,.35),rgba(255,255,255,.08));
  box-shadow:var(--brand-shadow-hero);
}
.dev-screen{width:100%;height:100%;border-radius:${u(44)};background-color:var(--brand-color-surfaceAlt);}
.dev-notch{
  position:absolute;top:${u(24)};left:50%;transform:translateX(-50%);
  width:${u(120)};height:${u(20)};border-radius:${u(20)};background:rgba(0,0,0,.55);
}
.dev-footer{font-size:${u(18)};opacity:.65;}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default deviceShowcase;
