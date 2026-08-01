import { htmlDocument, u } from '../base.js';
import { esc, inlineMd } from '@changelog-kit/core';

/**
 * Swiss typographic poster: the version set as large as the canvas allows,
 * the changes as a tight index. No artwork, no chrome — type carries it.
 */
export const megaType = {
  id: 'mega-type',
  name: 'Mega type',
  description: 'Typographic poster — the version set huge, the changes as a tight index. No artwork needed.',
  aspect: [4, 5],
  maxEntries: 6,
  render(ctx) {
    const { doc } = ctx;
    const entries = doc.entries.slice(0, 6);
    const body = `<div class="sheet mega">
  <div class="mega-top">
    <span>${esc(doc.product)}</span>
    <span>${esc(doc.date || (doc.status === 'upcoming' ? 'Coming soon' : 'Out now'))}</span>
  </div>
  <div class="mega-type">
    <span class="mega-version">${esc(doc.version)}</span>
    ${doc.tagline ? `<p class="mega-tagline">${esc(doc.tagline)}</p>` : ''}
  </div>
  <ol class="mega-index">
    ${entries.map((e, i) => `<li class="mega-row">
      <span class="mega-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="mega-title">${inlineMd(e.title ?? '')}</span>
      <span class="mega-kind">${esc(e.badge ?? '')}</span>
    </li>`).join('')}
  </ol>
  ${doc.footer ? `<p class="mega-footer">${esc(doc.footer)}</p>` : ''}
</div>`;

    const css = `
.mega{gap:${u(18)};}
.mega-top{
  display:flex;justify-content:space-between;
  font-family:var(--brand-font-display);font-weight:700;font-size:${u(22)};
  letter-spacing:${u(3)};text-transform:uppercase;color:var(--brand-color-inkMuted);
  padding-bottom:${u(14)};border-bottom:${u(3)} solid var(--brand-color-ink);
}
.mega-type{flex:1 1 auto;display:flex;flex-direction:column;justify-content:center;min-height:0;}
.mega-version{
  font-family:var(--brand-font-display);font-weight:800;font-size:${u(360)};line-height:.78;
  letter-spacing:${u(-20)};color:var(--brand-color-ink);
}
.mega-tagline{
  font-family:var(--brand-font-display);font-weight:700;font-size:${u(46)};line-height:1.05;
  letter-spacing:${u(-1)};color:var(--brand-color-primary);margin-top:${u(18)};max-width:${u(780)};
  text-wrap:balance;
}
.mega-index{list-style:none;display:flex;flex-direction:column;}
.mega-row{
  display:grid;grid-template-columns:${u(56)} 1fr auto;align-items:baseline;gap:${u(14)};
  padding:${u(13)} 0;border-top:${u(1)} solid var(--brand-color-inkMuted);
}
.mega-num{font-family:var(--brand-font-display);font-weight:700;font-size:${u(20)};color:var(--brand-color-primary);}
.mega-title{font-family:var(--brand-font-display);font-weight:700;font-size:${u(30)};line-height:1.1;}
.mega-kind{
  font-size:${u(17)};letter-spacing:${u(2)};text-transform:uppercase;color:var(--brand-color-inkMuted);
}
.mega-footer{font-size:${u(18)};color:var(--brand-color-inkMuted);padding-top:${u(10)};border-top:${u(3)} solid var(--brand-color-ink);}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default megaType;
