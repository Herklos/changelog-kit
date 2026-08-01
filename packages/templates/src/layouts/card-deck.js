import { htmlDocument, u, imageBackground } from '../base.js';
import { badge, badgeCss } from '../components.js';
import { esc, inlineMd } from '@changelog-kit/core';

/**
 * A fanned stack of feature cards over an outsized version numeral: depth and
 * motion in a still frame. Best with three or four short entries.
 */
export const cardDeck = {
  id: 'card-deck',
  name: 'Card deck',
  description: 'Fanned stack of feature cards over an oversized version numeral — playful depth.',
  aspect: [4, 5],
  maxEntries: 4,
  render(ctx) {
    const { doc } = ctx;
    const entries = doc.entries.slice(0, 4);
    const tilt = [-4, -1.5, 1.5, 4];
    const lift = [3, 0, 0, 3];

    const body = `<div class="deck">
  <span class="deck-ghost">${esc(doc.version)}</span>
  <header class="deck-head">
    <span class="deck-product">${esc(doc.product)}</span>
    ${doc.tagline ? `<p class="deck-tagline">${esc(doc.tagline)}</p>` : ''}
  </header>
  <div class="deck-fan">
    ${entries.map((e, i) => `<article class="deck-card" style="transform:rotate(${tilt[i] ?? 0}deg) translateY(${lift[i] ?? 0}%);z-index:${10 - Math.abs(i - 1.5)}">
      ${e.image ? `<div class="deck-art" style="${imageBackground(e.image)}"></div>` : ''}
      <div class="deck-copy">
        ${badge(e)}
        <h3 class="deck-title">${inlineMd(e.title ?? '')}</h3>
        ${e.body ? `<p class="deck-text">${inlineMd(e.body)}</p>` : ''}
      </div>
    </article>`).join('')}
  </div>
  ${doc.footer ? `<p class="deck-footer">${esc(doc.footer)}</p>` : ''}
</div>`;

    const css = `
${badgeCss}
.badge{font-size:${u(15)};padding:${u(5)} ${u(12)};}
.deck{
  position:relative;width:var(--w);height:var(--h);overflow:hidden;
  display:flex;flex-direction:column;align-items:center;
  padding:calc(var(--brand-space-outer) * var(--u));
  background:radial-gradient(120% 80% at 50% 0%,var(--brand-color-heroFrom) 0%,var(--brand-color-heroTo) 70%);
  color:var(--brand-color-onDark,#fff);
}
.deck-ghost{
  position:absolute;left:50%;top:${u(210)};transform:translateX(-50%);
  font-family:var(--brand-font-display);font-weight:800;font-size:${u(460)};line-height:.8;
  letter-spacing:${u(-20)};color:rgba(255,255,255,.07);white-space:nowrap;
}
.deck-head{position:relative;display:flex;flex-direction:column;align-items:center;gap:${u(8)};text-align:center;}
.deck-product{font-family:var(--brand-font-display);font-weight:700;font-size:${u(58)};letter-spacing:${u(-1.4)};}
.deck-tagline{font-size:${u(28)};opacity:.85;max-width:${u(620)};text-wrap:pretty;}
.deck-fan{
  position:relative;flex:1 1 auto;align-self:stretch;min-height:0;
  display:grid;grid-template-columns:repeat(2,1fr);grid-template-rows:1fr 1fr;gap:${u(26)};
  align-content:center;padding:${u(20)} ${u(10)};
}
.deck-card{
  background:var(--brand-color-surface);color:var(--brand-color-ink);
  border-radius:calc(var(--brand-radius-card) * var(--u));
  box-shadow:var(--brand-shadow-hero);
  padding:${u(22)};display:flex;flex-direction:column;gap:${u(12)};
  height:100%;min-height:0;overflow:hidden;transform-origin:50% 50%;
}
.deck-art{flex:1 1 auto;min-height:${u(90)};border-radius:calc(var(--brand-radius-image) * var(--u));}
.deck-copy{display:flex;flex-direction:column;gap:${u(8)};}
.deck-title{font-family:var(--brand-font-display);font-weight:700;font-size:${u(30)};line-height:1.1;text-wrap:balance;}
.deck-text{font-size:${u(21)};line-height:1.3;color:var(--brand-color-inkMuted);text-wrap:pretty;}
.deck-footer{position:relative;font-size:${u(18)};opacity:.7;margin-top:${u(16)};}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default cardDeck;
