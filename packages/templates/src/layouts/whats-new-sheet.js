import { htmlDocument, u, imageBackground } from '../base.js';
import { badge, badgeCss } from '../components.js';
import { esc, inlineMd } from '@changelog-kit/core';

/**
 * The in-product "What's new" sheet: a modal card over a tinted backdrop,
 * icon-tile rows and a call to action. Ships straight into the app or an
 * email hero at the `in-app` preset.
 */
export const whatsNewSheet = {
  id: 'whats-new-sheet',
  name: "What's new sheet",
  description: 'In-app modal: icon-tile rows, version chip and a call to action. Use at the in-app preset.',
  aspect: [5, 8],
  maxEntries: 4,
  render(ctx) {
    const { doc } = ctx;
    const entries = doc.entries.slice(0, 4);
    const cta = doc.meta?.cta ?? (doc.status === 'upcoming' ? 'Notify me' : 'See what changed');

    const body = `<div class="wrap">
  <div class="wrap-glow"></div>
  <section class="sheetcard">
    <div class="sc-grip"></div>
    <header class="sc-head">
      <span class="sc-chip">${esc(doc.product)} ${esc(doc.version)}</span>
      <h1 class="sc-title">What&rsquo;s new</h1>
      ${doc.tagline ? `<p class="sc-lede">${esc(doc.tagline)}</p>` : ''}
    </header>
    <ul class="sc-rows">
      ${entries.map((e) => `<li class="sc-row">
        <span class="sc-icon" style="${e.image ? imageBackground(e.image) : ''}"></span>
        <div class="sc-copy">
          <div class="sc-line">${badge(e)}<h3 class="sc-row-title">${inlineMd(e.title ?? '')}</h3></div>
          ${e.body ? `<p class="sc-row-text">${inlineMd(e.body)}</p>` : ''}
        </div>
      </li>`).join('')}
    </ul>
    <footer class="sc-foot">
      <span class="sc-cta">${esc(cta)}</span>
      ${doc.footer ? `<span class="sc-note">${esc(doc.footer)}</span>` : ''}
    </footer>
  </section>
</div>`;

    const css = `
${badgeCss}
.badge{font-size:${u(15)};padding:${u(5)} ${u(12)};}
.wrap{
  position:relative;width:var(--w);height:var(--h);overflow:hidden;
  display:flex;align-items:flex-end;justify-content:center;
  padding:calc(var(--brand-space-outer) * var(--u));
  background:linear-gradient(190deg,var(--brand-color-heroFrom) 0%,var(--brand-color-heroTo) 74%);
}
.wrap-glow{
  position:absolute;width:130%;aspect-ratio:1;left:-15%;top:-42%;border-radius:99999px;
  background:radial-gradient(circle,var(--brand-color-primary) 0%,transparent 62%);opacity:.35;
}
.sheetcard{
  position:relative;z-index:2;width:100%;max-height:100%;min-height:74%;
  display:flex;flex-direction:column;gap:${u(22)};
  background:var(--brand-color-surface);color:var(--brand-color-ink);
  border-radius:calc(var(--brand-radius-hero) * var(--u));
  box-shadow:var(--brand-shadow-hero);
  padding:${u(30)} ${u(30)} ${u(26)};
}
.sc-grip{width:${u(72)};height:${u(7)};border-radius:99px;background:var(--brand-color-inkMuted);opacity:.35;align-self:center;}
.sc-head{display:flex;flex-direction:column;gap:${u(8)};}
.sc-chip{
  align-self:flex-start;font-family:var(--brand-font-display);font-weight:700;font-size:${u(19)};
  padding:${u(7)} ${u(16)};border-radius:calc(var(--brand-radius-badge) * var(--u));
  background:var(--brand-color-primary);color:var(--brand-color-surfaceAlt);
}
.sc-title{font-family:var(--brand-font-display);font-weight:800;font-size:${u(58)};line-height:1.02;letter-spacing:${u(-1.6)};}
.sc-lede{font-size:${u(24)};line-height:1.32;color:var(--brand-color-inkMuted);text-wrap:pretty;}
.sc-rows{list-style:none;display:flex;flex-direction:column;gap:${u(18)};flex:1 1 auto;min-height:0;justify-content:center;}
.sc-row{display:flex;gap:${u(16)};align-items:center;}
.sc-icon{
  flex:0 0 ${u(84)};height:${u(84)};border-radius:calc(var(--brand-radius-image) * var(--u));
  background-color:var(--brand-color-heroFrom);
}
.sc-copy{display:flex;flex-direction:column;gap:${u(5)};min-width:0;}
.sc-line{display:flex;align-items:center;gap:${u(10)};flex-wrap:wrap;}
.sc-row-title{font-family:var(--brand-font-display);font-weight:700;font-size:${u(28)};line-height:1.1;}
.sc-row-text{font-size:${u(21)};line-height:1.3;color:var(--brand-color-inkMuted);text-wrap:pretty;}
.sc-foot{display:flex;flex-direction:column;align-items:center;gap:${u(12)};}
.sc-cta{
  align-self:stretch;text-align:center;
  font-family:var(--brand-font-display);font-weight:700;font-size:${u(26)};
  padding:${u(20)};border-radius:calc(var(--brand-radius-card) * var(--u));
  background:var(--brand-color-surfaceAlt);color:var(--brand-color-onDark,#fff);
}
.sc-note{font-size:${u(17)};color:var(--brand-color-inkMuted);}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default whatsNewSheet;
