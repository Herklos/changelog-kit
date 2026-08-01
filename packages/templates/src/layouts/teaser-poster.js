import { htmlDocument, u, imageBackground } from '../base.js';
import { esc, inlineMd } from '@changelog-kit/core';

/**
 * Single-message teaser poster: "COMING SOON 2.9" over a full-bleed
 * gradient, one piece of artwork, an icon row and a footer line.
 */
export const teaserPoster = {
  id: 'teaser-poster',
  name: 'Teaser poster',
  description: 'One-message announcement poster for upcoming releases.',
  aspect: [4, 5],
  maxEntries: 1,
  render(ctx) {
    const { doc } = ctx;
    const lead = doc.entries[0];
    const label = doc.status === 'upcoming' ? 'Coming soon' : 'Out now';

    const body = `<div class="sheet poster">
  <div class="poster-head">
    <span class="poster-ribbon">${esc(label)}</span>
    <span class="poster-version">${esc(doc.version)}</span>
  </div>
  <div class="poster-art" style="${imageBackground(doc.hero)}"></div>
  ${lead ? `<div class="poster-copy">
    <h2 class="poster-title">${inlineMd(lead.title ?? '')}</h2>
    ${lead.body ? `<p class="poster-body">${inlineMd(lead.body)}</p>` : ''}
  </div>` : ''}
  ${doc.footer ? `<p class="poster-footer">${esc(doc.footer)}</p>` : ''}
</div>`;

    const css = `
.poster{
  background:linear-gradient(160deg,var(--brand-color-heroFrom) 0%,var(--brand-color-heroTo) 100%);
  color:var(--brand-color-onDark,#fff);align-items:center;text-align:center;
}
.poster-head{
  display:flex;align-items:center;justify-content:center;gap:${u(18)};
  align-self:stretch;padding:${u(10)} 0 ${u(6)};
}
.poster-ribbon{
  font-family:var(--brand-font-display);font-weight:800;text-transform:uppercase;
  font-size:${u(60)};line-height:.95;letter-spacing:${u(-1)};max-width:${u(430)};
  background:var(--brand-color-accent);color:var(--brand-color-onDark,#fff);
  padding:${u(24)} ${u(38)};border-radius:calc(var(--brand-radius-badge) * var(--u));
  transform:rotate(-6deg);text-align:center;
}
.poster-version{
  font-family:var(--brand-font-display);font-weight:800;font-size:${u(190)};
  line-height:.82;letter-spacing:${u(-8)};
}
.poster-art{
  flex:1 1 auto;align-self:stretch;margin:${u(28)} 0;
  border-radius:calc(var(--brand-radius-hero) * var(--u));
  background-size:contain;background-repeat:no-repeat;background-position:center;
}
.poster-copy{display:flex;flex-direction:column;gap:${u(10)};max-width:${u(840)};}
.poster-title{font-family:var(--brand-font-display);font-weight:700;font-size:${u(46)};line-height:1.1;text-wrap:balance;}
.poster-body{font-size:${u(28)};line-height:1.35;opacity:.9;text-wrap:pretty;}
.poster-footer{margin-top:${u(26)};font-size:${u(20)};opacity:.65;}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default teaserPoster;
