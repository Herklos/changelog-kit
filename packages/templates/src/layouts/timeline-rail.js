import { htmlDocument, u, imageBackground } from '../base.js';
import { badge, badgeCss } from '../components.js';
import { esc, inlineMd } from '@changelog-kit/core';

/**
 * Vertical rail: a connector line with a node per change. Reads as a journey,
 * which suits multi-part releases and roadmap posts.
 */
export const timelineRail = {
  id: 'timeline-rail',
  name: 'Timeline rail',
  description: 'Connector rail with a node per change — reads as a journey through the release.',
  aspect: [4, 5],
  maxEntries: 6,
  render(ctx) {
    const { doc } = ctx;
    const entries = doc.entries.slice(0, 6);
    const body = `<div class="sheet rail">
  <header class="rail-head">
    <div class="rail-headline">
      <span class="rail-product">${esc(doc.product)}</span>
      <span class="rail-version">${esc(doc.version)}</span>
    </div>
    ${doc.hero?.src ? `<div class="rail-art" style="${imageBackground(doc.hero)}"></div>` : ''}
    ${doc.tagline ? `<p class="rail-tagline">${esc(doc.tagline)}</p>` : ''}
  </header>
  <ol class="rail-list" style="--rail-inset:${(50 / Math.max(entries.length, 1)).toFixed(2)}%">
    ${entries.map((e) => `<li class="rail-item">
      <span class="rail-node rail-node--${e.kind}"></span>
      <div class="rail-card">
        <div class="rail-line">${badge(e)}<h3 class="rail-title">${inlineMd(e.title ?? '')}</h3></div>
        ${e.body ? `<p class="rail-text">${inlineMd(e.body)}</p>` : ''}
      </div>
    </li>`).join('')}
  </ol>
  ${doc.footer ? `<p class="rail-footer">${esc(doc.footer)}</p>` : ''}
</div>`;

    const css = `
${badgeCss}
.badge{font-size:${u(16)};padding:${u(5)} ${u(13)};}
.rail{gap:${u(22)};}
.rail-head{display:flex;flex-direction:column;gap:${u(14)};}
.rail-headline{display:flex;align-items:baseline;gap:${u(16)};}
.rail-product{font-family:var(--brand-font-display);font-weight:700;font-size:${u(46)};letter-spacing:${u(-1)};}
.rail-version{
  font-family:var(--brand-font-display);font-weight:800;font-size:${u(104)};line-height:.9;
  letter-spacing:${u(-4)};color:var(--brand-color-primary);
}
.rail-art{height:${u(280)};border-radius:calc(var(--brand-radius-hero) * var(--u));box-shadow:var(--brand-shadow-hero);}
.rail-tagline{font-size:${u(26)};color:var(--brand-color-inkMuted);text-wrap:pretty;}
.rail-list{
  list-style:none;position:relative;flex:1 1 auto;min-height:0;
  display:flex;flex-direction:column;gap:${u(16)};padding-left:${u(46)};
}
.rail-list::before{
  content:'';position:absolute;left:${u(15)};top:var(--rail-inset);bottom:var(--rail-inset);width:${u(2)};
  background:var(--brand-color-inkMuted);opacity:.35;
}
.rail-item{position:relative;display:flex;flex:1 1 auto;min-height:0;}
.rail-node{
  position:absolute;left:${u(-38)};top:50%;transform:translateY(-50%);
  width:${u(16)};height:${u(16)};border-radius:99px;
  background:var(--brand-color-primary);
  box-shadow:0 0 0 ${u(6)} var(--brand-color-canvas);
}
.rail-node--update{background:var(--brand-color-badge-update);}
.rail-node--bugfix{background:var(--brand-color-badge-bugfix);}
.rail-node--improvement{background:var(--brand-color-badge-improvement);}
.rail-node--soon{background:var(--brand-color-badge-soon);}
.rail-card{
  flex:1 1 auto;background:var(--brand-color-surface);
  border-radius:calc(var(--brand-radius-card) * var(--u));
  box-shadow:var(--brand-shadow-card);
  padding:${u(20)} ${u(24)};display:flex;flex-direction:column;justify-content:center;gap:${u(6)};
}
.rail-line{display:flex;align-items:center;gap:${u(12)};flex-wrap:wrap;}
.rail-title{font-family:var(--brand-font-display);font-weight:700;font-size:${u(30)};line-height:1.12;text-wrap:balance;}
.rail-text{font-size:${u(22)};line-height:1.32;color:var(--brand-color-inkMuted);text-wrap:pretty;}
.rail-footer{font-size:${u(18)};color:var(--brand-color-inkMuted);}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default timelineRail;
