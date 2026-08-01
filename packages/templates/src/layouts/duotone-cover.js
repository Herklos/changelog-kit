import { htmlDocument, u, imageBackground } from '../base.js';
import { esc } from '@changelog-kit/core';

/**
 * Poster cover: full-bleed artwork pushed through a brand duotone, an outlined
 * version numeral the height of the canvas and a single line of copy.
 * Maximum impact, minimum text.
 */
export const duotoneCover = {
  id: 'duotone-cover',
  name: 'Duotone cover',
  description: 'Full-bleed duotone artwork behind an outlined version numeral — a cover, not a list.',
  aspect: [4, 5],
  maxEntries: 3,
  render(ctx) {
    const { doc } = ctx;
    const chips = doc.entries.slice(0, 3);
    const body = `<div class="cover">
  <div class="cover-art" style="${imageBackground(doc.hero ?? doc.entries[0]?.image)}"></div>
  <div class="cover-tint cover-tint--a"></div>
  <div class="cover-tint cover-tint--b"></div>
  <div class="cover-inner">
    <div class="cover-top">
      <span class="cover-product">${esc(doc.product)}</span>
      <span class="cover-date">${esc(doc.date || (doc.status === 'upcoming' ? 'Coming soon' : 'Out now'))}</span>
    </div>
    <div class="cover-mid">
      <span class="cover-version">${esc(doc.version)}</span>
    </div>
    <div class="cover-bottom">
      ${doc.tagline ? `<p class="cover-tagline">${esc(doc.tagline)}</p>` : ''}
      <div class="cover-chips">
        ${chips.map((e) => `<span class="cover-chip">${esc(e.title ?? '')}</span>`).join('')}
      </div>
      ${doc.footer ? `<p class="cover-footer">${esc(doc.footer)}</p>` : ''}
    </div>
  </div>
</div>`;

    const css = `
.cover{position:relative;width:var(--w);height:var(--h);overflow:hidden;background:var(--brand-color-heroTo);}
.cover-art{position:absolute;inset:0;filter:grayscale(1) contrast(1.15);}
.cover-tint{position:absolute;inset:0;}
.cover-tint--a{background:var(--brand-color-heroFrom);mix-blend-mode:multiply;opacity:.85;}
.cover-tint--b{background:var(--brand-color-secondary);mix-blend-mode:screen;opacity:.22;}
.cover-inner{
  position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;justify-content:space-between;
  padding:calc(var(--brand-space-outer) * var(--u));color:var(--brand-color-onDark,#fff);
}
.cover-top{
  display:flex;align-items:center;justify-content:space-between;
  font-family:var(--brand-font-display);font-weight:600;font-size:${u(24)};
  letter-spacing:${u(2)};text-transform:uppercase;
}
.cover-mid{display:flex;align-items:center;justify-content:center;flex:1 1 auto;}
.cover-version{
  font-family:var(--brand-font-display);font-weight:800;font-size:${u(400)};line-height:.78;
  letter-spacing:${u(-18)};color:transparent;
  -webkit-text-stroke:${u(4)} var(--brand-color-onDark,#fff);
  text-shadow:0 ${u(30)} ${u(80)} rgba(0,0,0,.35);
}
.cover-bottom{display:flex;flex-direction:column;gap:${u(16)};}
.cover-tagline{font-family:var(--brand-font-display);font-weight:700;font-size:${u(48)};line-height:1.06;letter-spacing:${u(-1.2)};max-width:${u(760)};text-wrap:balance;}
.cover-chips{display:flex;flex-wrap:wrap;gap:${u(10)};}
.cover-chip{
  font-size:${u(22)};padding:${u(9)} ${u(18)};
  border-radius:calc(var(--brand-radius-badge) * var(--u));
  border:${u(1)} solid rgba(255,255,255,.45);background:rgba(255,255,255,.12);
}
.cover-footer{font-size:${u(18)};opacity:.7;}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default duotoneCover;
