import { htmlDocument, u, imageBackground } from '../base.js';
import { badge, cardCss } from '../components.js';import { esc, inlineMd } from '@changelog-kit/core';

/**
 * Document layout: title block, optional hero strip, then a typographic list
 * of changes. Built for A4/Letter PDF release notes — flows, no fixed slots.
 */
export const releaseNotes = {
  id: 'release-notes',
  name: 'Release notes',
  description: 'Editorial one-pager for PDF release notes: title block plus a list of changes.',
  aspect: [794, 1123],
  maxEntries: 24,
  render(ctx) {
    const { doc } = ctx;
    const groups = new Map();
    for (const entry of doc.entries) {
      if (!groups.has(entry.kind)) groups.set(entry.kind, []);
      groups.get(entry.kind).push(entry);
    }

    const body = `<div class="sheet doc">
  <header class="doc-head">
    <div class="doc-eyebrow">${esc(doc.product || 'Release notes')}${doc.date ? ` · ${esc(doc.date)}` : ''}</div>
    <h1 class="doc-title">Version ${esc(doc.version)}</h1>
    ${doc.tagline ? `<p class="doc-lede">${esc(doc.tagline)}</p>` : ''}
  </header>
  ${doc.hero?.src ? `<div class="doc-hero" style="${imageBackground(doc.hero)}"></div>` : ''}
  <main class="doc-body">
    ${[...groups.entries()].map(([kind, list]) => `<section class="group">
      <div class="group-head">${badge({ kind, badge: list[0].badge })}<span class="group-count">${list.length}</span></div>
      <ul class="items">
        ${list.map((e) => `<li class="item">
          ${e.title ? `<h3 class="item-title">${inlineMd(e.title)}</h3>` : ''}
          ${e.body ? `<p class="item-body">${inlineMd(e.body)}</p>` : ''}
        </li>`).join('')}
      </ul>
    </section>`).join('')}
  </main>
  ${doc.footer ? `<footer class="doc-footer">${esc(doc.footer)}</footer>` : ''}
</div>`;

    const css = `
${cardCss}
.doc{gap:${u(26)};}
.doc-head{border-bottom:${u(2)} solid var(--brand-color-ink);padding-bottom:${u(16)};}
.doc-eyebrow{font-size:${u(18)};letter-spacing:${u(2)};text-transform:uppercase;color:var(--brand-color-inkMuted);}
.doc-title{font-family:var(--brand-font-display);font-size:${u(72)};line-height:1;letter-spacing:${u(-2)};margin-top:${u(8)};}
.doc-lede{font-size:${u(24)};color:var(--brand-color-inkMuted);margin-top:${u(10)};max-width:${u(640)};text-wrap:pretty;}
.doc-hero{height:${u(260)};border-radius:calc(var(--brand-radius-image) * var(--u));}
.doc-body{display:flex;flex-direction:column;gap:${u(28)};flex:1 1 auto;}
.group-head{display:flex;align-items:center;gap:${u(10)};margin-bottom:${u(12)};}
.group-count{font-size:${u(18)};color:var(--brand-color-inkMuted);}
.items{list-style:none;display:flex;flex-direction:column;gap:${u(14)};}
.item{padding-left:${u(18)};border-left:${u(3)} solid var(--brand-color-primary);}
.item-title{font-family:var(--brand-font-display);font-size:${u(26)};line-height:1.2;}
.item-body{font-size:${u(20)};line-height:1.45;color:var(--brand-color-inkMuted);text-wrap:pretty;}
.doc-footer{border-top:${u(1)} solid var(--brand-color-inkMuted);padding-top:${u(12)};font-size:${u(16)};color:var(--brand-color-inkMuted);}
@media print{html,body{height:auto;overflow:visible;}.doc{height:auto;}}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default releaseNotes;
