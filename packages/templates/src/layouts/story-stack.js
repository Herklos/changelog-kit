import { htmlDocument, u, imageBackground } from '../base.js';
import { badge, badgeCss } from '../components.js';
import { esc, inlineMd } from '@changelog-kit/core';

/**
 * 9:16 story: progress pips, a tall artwork panel, then the features as a
 * numbered stack. Built for Instagram / TikTok stories and phone in-app modals.
 */
export const storyStack = {
  id: 'story-stack',
  name: 'Story stack',
  description: 'Vertical 9:16 story — progress pips, tall artwork and a numbered feature stack.',
  aspect: [9, 16],
  maxEntries: 4,
  render(ctx) {
    const { doc } = ctx;
    const entries = doc.entries.slice(0, 4);
    const body = `<div class="sheet story">
  <div class="pips">${entries.map((_, i) => `<span class="pip${i === 0 ? ' pip--on' : ''}"></span>`).join('')}</div>
  <header class="story-head">
    <span class="story-product">${esc(doc.product)}</span>
    <span class="story-version">${esc(doc.version)}</span>
    ${doc.tagline ? `<span class="story-tagline">${esc(doc.tagline)}</span>` : ''}
  </header>
  <div class="story-art" style="${imageBackground(doc.hero)}"></div>
  <ul class="story-list">
    ${entries.map((e, i) => `<li class="story-item">
      <span class="story-num">${String(i + 1).padStart(2, '0')}</span>
      <div class="story-copy">
        <div class="story-line">${badge(e)}<h3 class="story-title">${inlineMd(e.title ?? '')}</h3></div>
        ${e.body ? `<p class="story-text">${inlineMd(e.body)}</p>` : ''}
      </div>
    </li>`).join('')}
  </ul>
  ${doc.footer ? `<p class="story-footer">${esc(doc.footer)}</p>` : ''}
</div>`;

    const css = `
${badgeCss}
.badge{font-size:${u(17)};padding:${u(6)} ${u(13)};}
.story{
  background:linear-gradient(180deg,var(--brand-color-heroFrom) 0%,var(--brand-color-heroTo) 62%,var(--brand-color-heroTo) 100%);
  color:var(--brand-color-onDark,#fff);gap:${u(24)};}
.pips{display:flex;gap:${u(8)};}
.pip{flex:1;height:${u(6)};border-radius:${u(6)};background:rgba(255,255,255,.28);}
.pip--on{background:var(--brand-color-onDark,#fff);}
.story-head{display:flex;flex-direction:column;gap:${u(2)};}
.story-product{font-family:var(--brand-font-display);font-weight:600;font-size:${u(34)};opacity:.85;}
.story-version{font-family:var(--brand-font-display);font-weight:800;font-size:${u(160)};line-height:.85;letter-spacing:${u(-7)};}
.story-tagline{font-size:${u(28)};opacity:.85;margin-top:${u(10)};}
.story-art{flex:1 1 auto;min-height:${u(300)};border-radius:calc(var(--brand-radius-hero) * var(--u));box-shadow:var(--brand-shadow-hero);}
.story-list{list-style:none;display:flex;flex-direction:column;gap:${u(16)};flex:0 0 auto;}
.story-item{display:flex;gap:${u(16)};align-items:flex-start;}
.story-num{
  font-family:var(--brand-font-display);font-weight:800;font-size:${u(24)};line-height:1;
  padding:${u(10)} ${u(12)};border-radius:${u(12)};background:rgba(255,255,255,.16);min-width:${u(52)};text-align:center;
}
.story-copy{display:flex;flex-direction:column;gap:${u(6)};min-width:0;}
.story-line{display:flex;align-items:center;gap:${u(12)};flex-wrap:wrap;}
.story-title{font-family:var(--brand-font-display);font-weight:700;font-size:${u(34)};line-height:1.1;}
.story-text{font-size:${u(24)};line-height:1.3;opacity:.8;text-wrap:pretty;}
.story-footer{font-size:${u(20)};opacity:.6;}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default storyStack;
