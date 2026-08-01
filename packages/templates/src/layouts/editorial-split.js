import { htmlDocument, u, imageBackground } from '../base.js';
import { badge, badgeCss } from '../components.js';
import { esc, inlineMd } from '@changelog-kit/core';

/**
 * Magazine spread: a tall art column, a kicker rule, an oversized version and
 * the features as a numbered, hairline-separated list. Typographic, calm.
 */
export const editorialSplit = {
  id: 'editorial-split',
  name: 'Editorial split',
  description: 'Magazine spread — kicker rule, oversized version, numbered feature list beside a tall art column.',
  aspect: [4, 5],
  maxEntries: 5,
  render(ctx) {
    const { doc } = ctx;
    const entries = doc.entries.slice(0, 5);
    const body = `<div class="sheet ed">
  <div class="ed-kicker">
    <span>${esc(doc.product)}</span>
    <span class="ed-rule"></span>
    <span>${esc(doc.date || doc.tagline)}</span>
  </div>
  <div class="ed-cols">
    <div class="ed-main">
      <h1 class="ed-version"><span class="ed-v">v</span>${esc(doc.version)}</h1>
      ${doc.tagline ? `<p class="ed-lede">${esc(doc.tagline)}</p>` : ''}
      <ol class="ed-list">
        ${entries.map((e, i) => `<li class="ed-item">
          <span class="ed-index">${String(i + 1).padStart(2, '0')}</span>
          <div class="ed-copy">
            <div class="ed-line">${badge(e)}<h3 class="ed-title">${inlineMd(e.title ?? '')}</h3></div>
            ${e.body ? `<p class="ed-text">${inlineMd(e.body)}</p>` : ''}
          </div>
        </li>`).join('')}
      </ol>
    </div>
    <aside class="ed-aside">
      <div class="ed-art" style="${imageBackground(doc.hero ?? entries[0]?.image)}"></div>
    </aside>
  </div>
  ${doc.footer ? `<p class="ed-footer">${esc(doc.footer)}</p>` : ''}
</div>`;

    const css = `
${badgeCss}
.badge{font-size:${u(15)};padding:${u(5)} ${u(12)};}
.ed{gap:${u(22)};}
.ed-kicker{
  display:flex;align-items:center;gap:${u(16)};
  font-family:var(--brand-font-display);font-weight:600;font-size:${u(20)};
  letter-spacing:${u(2)};text-transform:uppercase;color:var(--brand-color-inkMuted);
}
.ed-rule{flex:1 1 auto;height:${u(1)};background:var(--brand-color-inkMuted);opacity:.4;}
.ed-cols{flex:1 1 auto;display:grid;grid-template-columns:1.12fr .88fr;gap:calc(var(--brand-space-gap) * var(--u));min-height:0;}
.ed-main{display:flex;flex-direction:column;gap:${u(14)};min-height:0;}
.ed-version{
  font-family:var(--brand-font-display);font-weight:800;font-size:${u(150)};line-height:.82;
  letter-spacing:${u(-7)};display:flex;align-items:flex-start;
}
.ed-v{font-size:${u(52)};font-weight:600;letter-spacing:0;color:var(--brand-color-primary);margin-top:${u(14)};}
.ed-lede{font-size:${u(26)};line-height:1.3;color:var(--brand-color-inkMuted);max-width:${u(460)};text-wrap:pretty;}
.ed-list{list-style:none;display:flex;flex-direction:column;margin-top:${u(6)};flex:1 1 auto;min-height:0;}
.ed-item{display:flex;gap:${u(16)};padding:${u(16)} 0;border-top:${u(1)} solid var(--brand-color-inkMuted);flex:1 1 auto;align-items:center;}
.ed-item:last-child{border-bottom:${u(1)} solid var(--brand-color-inkMuted);}
.ed-index{
  font-family:var(--brand-font-display);font-weight:700;font-size:${u(18)};
  color:var(--brand-color-primary);min-width:${u(34)};
}
.ed-copy{display:flex;flex-direction:column;gap:${u(6)};min-width:0;}
.ed-line{display:flex;align-items:center;gap:${u(12)};flex-wrap:wrap;}
.ed-title{font-family:var(--brand-font-display);font-weight:700;font-size:${u(28)};line-height:1.14;text-wrap:balance;}
.ed-text{font-size:${u(21)};line-height:1.32;color:var(--brand-color-inkMuted);text-wrap:pretty;}
.ed-aside{display:flex;min-height:0;}
.ed-art{
  flex:1 1 auto;border-radius:calc(var(--brand-radius-hero) * var(--u));
  box-shadow:var(--brand-shadow-hero);
}
.ed-footer{font-size:${u(18)};color:var(--brand-color-inkMuted);}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default editorialSplit;
