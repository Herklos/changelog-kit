import { htmlDocument, u, imageBackground } from '../base.js';
import { badge, badgeCss } from '../components.js';
import { esc, inlineMd } from '@changelog-kit/core';

/**
 * One feature, told properly: full-bleed artwork with an edge-to-edge caption
 * plate. Square by default — the format for a single-feature announcement.
 */
export const spotlight = {
  id: 'spotlight',
  name: 'Spotlight',
  description: 'Single-feature announcement: full-bleed artwork with a caption plate and version chip.',
  aspect: [1, 1],
  maxEntries: 1,
  render(ctx) {
    const { doc } = ctx;
    const lead = doc.entries[0] ?? {};
    const body = `<div class="spot">
  <div class="spot-art" style="${imageBackground(lead.image ?? doc.hero)}"></div>
  <div class="spot-chip">${esc(doc.product)} <b>${esc(doc.version)}</b></div>
  <div class="spot-plate">
    <div class="spot-meta">${badge(lead)}${doc.date ? `<span class="spot-date">${esc(doc.date)}</span>` : ''}</div>
    <h1 class="spot-title">${inlineMd(lead.title ?? '')}</h1>
    ${lead.body ? `<p class="spot-text">${inlineMd(lead.body)}</p>` : ''}
  </div>
</div>`;

    const css = `
${badgeCss}
.spot{position:relative;width:var(--w);height:var(--h);overflow:hidden;background:var(--brand-color-heroTo);}
.spot-art{position:absolute;inset:0;}
.spot-chip{
  position:absolute;top:${u(38)};left:${u(38)};z-index:2;
  font-family:var(--brand-font-display);font-weight:500;font-size:${u(24)};
  color:var(--brand-color-onDark,#fff);background:rgba(255,255,255,.14);
  border:${u(1)} solid rgba(255,255,255,.28);backdrop-filter:blur(${u(14)});
  padding:${u(10)} ${u(20)};border-radius:calc(var(--brand-radius-badge) * var(--u));
}
.spot-chip b{font-weight:800;}
.spot-plate{
  position:absolute;left:${u(34)};right:${u(34)};bottom:${u(34)};z-index:2;
  background:var(--brand-color-surface);
  border-radius:calc(var(--brand-radius-hero) * var(--u));
  padding:${u(38)} ${u(40)};display:flex;flex-direction:column;gap:${u(14)};
  box-shadow:var(--brand-shadow-hero);
}
.spot-meta{display:flex;align-items:center;gap:${u(14)};}
.spot-date{font-size:${u(20)};color:var(--brand-color-inkMuted);}
.spot-title{font-family:var(--brand-font-display);font-weight:800;font-size:${u(66)};line-height:1.04;letter-spacing:${u(-2)};text-wrap:balance;}
.spot-text{font-size:${u(28)};line-height:1.35;color:var(--brand-color-inkMuted);max-width:${u(760)};text-wrap:pretty;}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default spotlight;
