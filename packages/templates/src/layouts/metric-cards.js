import { htmlDocument, u } from '../base.js';
import { badgeCss } from '../components.js';
import { esc, inlineMd } from '@changelog-kit/core';

/** Pull the most quotable number out of an entry ("10× faster" → "10×"). */
function statOf(entry, index) {
  if (entry.stat) return String(entry.stat);
  const source = `${entry.title ?? ''} ${entry.body ?? ''}`;
  const match = source.match(/(\d+[\d.,]*\s*(?:×|x\b|%|k\b|\+)?)/i);
  return match ? match[1].replace(/\s+/g, '').replace(/x$/i, '×') : String(index + 1).padStart(2, '0');
}

/**
 * "By the numbers": the release as three or four oversized figures. Reads in
 * a scroll — the format for a launch-day square post.
 */
export const metricCards = {
  id: 'metric-cards',
  name: 'Metric cards',
  description: 'Release by the numbers — oversized figures pulled from each entry, with the claim underneath.',
  aspect: [1, 1],
  maxEntries: 4,
  render(ctx) {
    const { doc } = ctx;
    const entries = doc.entries.slice(0, 4);
    const body = `<div class="sheet metrics">
  <header class="m-head">
    <div class="m-title">
      <span class="m-product">${esc(doc.product)}</span>
      <span class="m-version">${esc(doc.version)}</span>
    </div>
    ${doc.tagline ? `<p class="m-tagline">${esc(doc.tagline)}</p>` : ''}
  </header>
  <div class="m-grid">
    ${entries.map((e, i) => `<article class="m-card m-card--${e.kind}">
      <span class="m-stat">${esc(statOf(e, i))}</span>
      <h3 class="m-label">${inlineMd(e.title ?? '')}</h3>
      ${e.body ? `<p class="m-note">${inlineMd(e.body)}</p>` : ''}
      <span class="m-kind">${esc(e.badge ?? '')}</span>
    </article>`).join('')}
  </div>
  ${doc.footer ? `<p class="m-footer">${esc(doc.footer)}</p>` : ''}
</div>`;

    const css = `
${badgeCss}
.metrics{gap:calc(var(--brand-space-gap) * var(--u));}
.m-head{display:flex;flex-direction:column;gap:${u(6)};}
.m-title{display:flex;align-items:baseline;gap:${u(14)};}
.m-product{font-family:var(--brand-font-display);font-weight:700;font-size:${u(44)};letter-spacing:${u(-1)};}
.m-version{
  font-family:var(--brand-font-display);font-weight:800;font-size:${u(44)};
  color:var(--brand-color-primary);
}
.m-tagline{font-size:${u(24)};color:var(--brand-color-inkMuted);}
.m-grid{flex:1 1 auto;display:grid;grid-template-columns:1fr 1fr;gap:calc(var(--brand-space-gap) * var(--u));min-height:0;}
.m-card{
  position:relative;display:flex;flex-direction:column;justify-content:center;gap:${u(6)};
  background:var(--brand-color-surface);
  border-radius:calc(var(--brand-radius-card) * var(--u));
  box-shadow:var(--brand-shadow-card);padding:${u(28)};overflow:hidden;min-height:0;
}
.m-card::before{
  content:'';position:absolute;inset:auto 0 0 0;height:${u(6)};
  background:var(--brand-color-primary);
}
.m-card--update::before{background:var(--brand-color-badge-update);}
.m-card--bugfix::before{background:var(--brand-color-badge-bugfix);}
.m-card--improvement::before{background:var(--brand-color-badge-improvement);}
.m-card--soon::before{background:var(--brand-color-badge-soon);}
.m-stat{
  font-family:var(--brand-font-display);font-weight:800;font-size:${u(118)};line-height:.86;
  letter-spacing:${u(-5)};color:var(--brand-color-primary);margin-bottom:${u(6)};
}
.m-label{font-family:var(--brand-font-display);font-weight:700;font-size:${u(30)};line-height:1.12;text-wrap:balance;}
.m-note{font-size:${u(21)};line-height:1.3;color:var(--brand-color-inkMuted);text-wrap:pretty;}
.m-kind{
  position:absolute;top:${u(24)};right:${u(24)};
  font-family:var(--brand-font-display);font-weight:700;font-size:${u(16)};
  letter-spacing:${u(1.4)};color:var(--brand-color-inkMuted);
}
.m-footer{font-size:${u(18)};color:var(--brand-color-inkMuted);}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default metricCards;
