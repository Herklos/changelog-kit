import { esc, inlineMd } from '@changelog-kit/core';
import { u, imageBackground } from './base.js';

/** Badge pill, colored by entry kind through brand tokens. */
export function badge(entry) {
  if (!entry.badge) return '';
  return `<span class="badge" style="background:var(--brand-color-badge-${entry.kind});color:var(--brand-color-badgeInk-${entry.kind},#fff)">${esc(entry.badge)}</span>`;
}

/**
 * Feature card: badge + title + body on the left, art on the right.
 * @param {import('@changelog-kit/core').ChangelogEntry} entry
 * @param {{dark?:boolean, align?:'left'|'right'|'center', artRatio?:number}} [opt]
 */
export function card(entry, opt = {}) {
  const { dark = false, align = 'left', artRatio = 0.42 } = opt;
  const art = entry.image
    ? `<div class="card-art" style="flex:0 0 ${Math.round(artRatio * 100)}%;${imageBackground(entry.image)}"></div>`
    : '';
  const text = `<div class="card-text">
      ${badge(entry)}
      ${entry.title ? `<h3 class="card-title">${inlineMd(entry.title)}</h3>` : ''}
      ${entry.body ? `<p class="card-body">${inlineMd(entry.body)}</p>` : ''}
    </div>`;
  const order = align === 'right' ? `${art}${text}` : `${text}${art}`;
  return `<article class="card${dark ? ' card--dark' : ''}${align === 'center' ? ' card--center' : ''}">${order}</article>`;
}

/** Badge styling — needed by any layout that calls badge(), card or not. */
export const badgeCss = `
.badge{
  align-self:flex-start;font-family:var(--brand-font-display);
  font-weight:700;font-size:${u(19)};letter-spacing:${u(0.6)};
  padding:${u(7)} ${u(16)};border-radius:calc(var(--brand-radius-badge) * var(--u));
  line-height:1;white-space:nowrap;
}
`;

export const cardCss = badgeCss + `
.card{
  display:flex;align-items:flex-start;gap:${u(14)};
  background:var(--brand-color-surface);
  border-radius:calc(var(--brand-radius-card) * var(--u));
  padding:${u(26)};
  box-shadow:var(--brand-shadow-card);
  overflow:hidden;min-height:0;
}
.card--dark{background:var(--brand-color-surfaceAlt);color:var(--brand-color-onDark,#fff);}
.card--center{flex-direction:column;align-items:center;text-align:center;}
.card-text{display:flex;flex-direction:column;gap:${u(10)};flex:1 1 auto;min-width:0;}
.card-art{align-self:stretch;min-height:${u(120)};border-radius:calc(var(--brand-radius-image) * var(--u));}
.card--center .card-art{width:100%;flex:1 1 auto;}
.card--center .badge{align-self:center;}
.card-title{
  font-family:var(--brand-font-display);font-weight:700;
  font-size:${u(34)};line-height:1.12;letter-spacing:${u(-0.4)};text-wrap:balance;
}
.card-body{
  font-size:${u(24)};line-height:1.32;color:var(--brand-color-inkMuted);text-wrap:pretty;
}
.card--dark .card-body,.card--dark .card-title{color:inherit;}
`;

/** Version wordmark used inside hero panels. */
export function versionMark(doc, { size = 260, label = '' } = {}) {
  return `<div class="vmark">
    ${doc.product ? `<span class="vmark-product">${esc(doc.product)}</span>` : ''}
    ${label ? `<span class="vmark-label">${esc(label)}</span>` : ''}
    <span class="vmark-number" style="font-size:${u(size)}">${esc(doc.version)}</span>
    ${doc.tagline ? `<span class="vmark-tagline">${esc(doc.tagline)}</span>` : ''}
  </div>`;
}

export const versionMarkCss = `
.vmark{display:flex;flex-direction:column;align-items:center;gap:${u(6)};color:var(--brand-color-onDark,#fff);text-align:center;}
.vmark-product{font-family:var(--brand-font-display);font-weight:700;font-size:${u(54)};letter-spacing:${u(-1)};}
.vmark-label{font-family:var(--brand-font-display);font-weight:800;font-size:${u(40)};letter-spacing:${u(3)};text-transform:uppercase;opacity:.9;}
.vmark-number{
  font-family:var(--brand-font-display);font-weight:800;line-height:.9;
  letter-spacing:${u(-8)};text-shadow:0 ${u(14)} ${u(40)} rgba(0,0,0,.28);
}
.vmark-tagline{font-size:${u(30)};font-weight:500;opacity:.95;}
`;
