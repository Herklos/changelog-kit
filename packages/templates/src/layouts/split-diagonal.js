import { htmlDocument, u, imageBackground } from '../base.js';
import { badge, badgeCss } from '../components.js';
import { esc, inlineMd } from '@changelog-kit/core';

/**
 * Hard diagonal between artwork and copy. The angle does the work — no cards,
 * no shadows, just one confident cut across the canvas.
 */
export const splitDiagonal = {
  id: 'split-diagonal',
  name: 'Split diagonal',
  description: 'A single diagonal cut: full-bleed artwork on one side, version and features on the other.',
  aspect: [4, 5],
  maxEntries: 4,
  render(ctx) {
    const { doc } = ctx;
    const entries = doc.entries.slice(0, 4);
    const body = `<div class="diag">
  <div class="diag-art" style="${imageBackground(doc.hero ?? entries[0]?.image)}"></div>
  <div class="diag-veil"></div>
  <div class="diag-copy">
    <div class="diag-top">
      <span class="diag-product">${esc(doc.product)}</span>
      <span class="diag-meta">${esc(doc.date || (doc.status === 'upcoming' ? 'Coming soon' : 'Out now'))}</span>
    </div>
    <div class="diag-mid">
      <span class="diag-version">${esc(doc.version)}</span>
      ${doc.tagline ? `<p class="diag-tagline">${esc(doc.tagline)}</p>` : ''}
    </div>
    <ul class="diag-list">
      ${entries.map((e) => `<li class="diag-item">
        ${badge(e)}
        <div class="diag-copy-block">
          <h3 class="diag-title">${inlineMd(e.title ?? '')}</h3>
          ${e.body ? `<p class="diag-text">${inlineMd(e.body)}</p>` : ''}
        </div>
      </li>`).join('')}
    </ul>
    ${doc.footer ? `<p class="diag-footer">${esc(doc.footer)}</p>` : ''}
  </div>
</div>`;

    const css = `
${badgeCss}
.badge{font-size:${u(16)};padding:${u(6)} ${u(14)};}
.diag{
  position:relative;width:var(--w);height:var(--h);overflow:hidden;
  background:linear-gradient(200deg,var(--brand-color-heroFrom) 0%,var(--brand-color-heroTo) 68%);
  color:var(--brand-color-onDark,#fff);
}
.diag-art{position:absolute;inset:0;clip-path:polygon(42% 0,100% 0,100% 100%,4% 100%);}
.diag-veil{
  position:absolute;inset:0;clip-path:polygon(42% 0,100% 0,100% 100%,4% 100%);
  background:linear-gradient(200deg,rgba(0,0,0,.15) 0%,rgba(0,0,0,.72) 78%);
}
.diag-copy{
  position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;
  padding:calc(var(--brand-space-outer) * var(--u));gap:${u(20)};
}
.diag-top{
  display:flex;align-items:center;justify-content:space-between;
  font-family:var(--brand-font-display);font-weight:700;font-size:${u(24)};
  letter-spacing:${u(2)};text-transform:uppercase;
}
.diag-meta{opacity:.7;}
.diag-mid{display:flex;flex-direction:column;gap:${u(4)};margin-top:auto;}
.diag-version{
  font-family:var(--brand-font-display);font-weight:800;font-size:${u(210)};line-height:.84;
  letter-spacing:${u(-10)};
}
.diag-tagline{font-size:${u(30)};font-weight:500;opacity:.9;max-width:${u(520)};text-wrap:pretty;}
.diag-list{list-style:none;display:flex;flex-direction:column;gap:${u(14)};margin-top:${u(10)};}
.diag-item{
  display:flex;align-items:center;gap:${u(14)};
  background:rgba(255,255,255,.1);
  border:${u(1)} solid rgba(255,255,255,.16);
  border-radius:calc(var(--brand-radius-card) * var(--u));
  padding:${u(16)} ${u(20)};backdrop-filter:blur(${u(10)});
}
.diag-copy-block{display:flex;flex-direction:column;gap:${u(2)};min-width:0;}
.diag-title{font-family:var(--brand-font-display);font-weight:700;font-size:${u(28)};line-height:1.12;}
.diag-text{font-size:${u(20)};opacity:.78;text-wrap:pretty;}
.diag-footer{font-size:${u(18)};opacity:.6;}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default splitDiagonal;
