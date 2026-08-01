import { htmlDocument, u } from '../base.js';
import { esc, inlineMd } from '@changelog-kit/core';

/**
 * Developer-flavoured release note: a window chrome, a `git log`-ish header and
 * changes as monospace lines with kind sigils. Reads well on GitHub, Discord
 * and in a docs site — and prints cleanly.
 */
export const terminalNotes = {
  id: 'terminal-notes',
  name: 'Terminal notes',
  description: 'Monospace release note in a window chrome — sigil-prefixed change lines for dev audiences.',
  aspect: [4, 5],
  maxEntries: 14,
  render(ctx) {
    const { doc } = ctx;
    const sigil = { new: '+', update: '~', improvement: '^', bugfix: '!', removed: '-', soon: '>' };

    const body = `<div class="sheet term">
  <div class="win">
    <div class="win-bar">
      <span class="dot dot--a"></span><span class="dot dot--b"></span><span class="dot dot--c"></span>
      <span class="win-title">${esc(doc.product.toLowerCase() || 'changelog')} — release ${esc(doc.version)}</span>
    </div>
    <div class="win-body">
      <p class="cmd"><span class="prompt">$</span> ${esc(doc.product.toLowerCase() || 'app')} changelog --version ${esc(doc.version)}</p>
      <h1 class="term-version">v${esc(doc.version)}${doc.date ? `<span class="term-date">${esc(doc.date)}</span>` : ''}</h1>
      ${doc.tagline ? `<p class="term-lede">${esc(doc.tagline)}</p>` : ''}
      <ul class="lines">
        ${doc.entries.slice(0, 14).map((e) => `<li class="line line--${e.kind}">
          <span class="sig">${sigil[e.kind] ?? '*'}</span>
          <span class="line-copy"><b>${inlineMd(e.title ?? '')}</b>${e.body ? ` <span class="line-body">${inlineMd(e.body)}</span>` : ''}</span>
        </li>`).join('')}
      </ul>
      <p class="cmd cmd--last"><span class="prompt">$</span> <span class="caret"></span></p>
    </div>
  </div>
  ${doc.footer ? `<p class="term-footer">${esc(doc.footer)}</p>` : ''}
</div>`;

    const css = `
body{background:var(--brand-color-canvas);}
.term{gap:${u(20)};}
.win{
  flex:1 1 auto;display:flex;flex-direction:column;overflow:hidden;
  background:var(--brand-color-surfaceAlt);
  border-radius:calc(var(--brand-radius-hero) * var(--u));
  box-shadow:var(--brand-shadow-hero);
}
.win-bar{
  display:flex;align-items:center;gap:${u(10)};padding:${u(20)} ${u(26)};
  border-bottom:${u(1)} solid rgba(255,255,255,.1);
}
.dot{width:${u(14)};height:${u(14)};border-radius:99px;}
.dot--a{background:var(--brand-color-accent);}
.dot--b{background:var(--brand-color-secondary);}
.dot--c{background:var(--brand-color-primary);}
.win-title{
  margin-left:${u(12)};font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
  font-size:${u(20)};color:rgba(255,255,255,.55);
}
.win-body{
  flex:1 1 auto;padding:${u(34)} ${u(36)};display:flex;flex-direction:column;gap:${u(16)};
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:rgba(255,255,255,.9);
}
.cmd{font-size:${u(22)};color:rgba(255,255,255,.5);}
.prompt{color:var(--brand-color-secondary);}
.term-version{
  font-family:var(--brand-font-display);font-weight:800;font-size:${u(96)};line-height:1;
  letter-spacing:${u(-3)};color:var(--brand-color-onDark,#fff);display:flex;align-items:baseline;gap:${u(20)};
}
.term-date{font-family:ui-monospace,monospace;font-size:${u(22)};font-weight:400;color:rgba(255,255,255,.45);letter-spacing:0;}
.term-lede{font-size:${u(24)};color:rgba(255,255,255,.7);text-wrap:pretty;}
.lines{list-style:none;display:flex;flex-direction:column;gap:${u(12)};margin-top:${u(8)};flex:1 1 auto;}
.line{display:flex;gap:${u(14)};font-size:${u(23)};line-height:1.35;}
.sig{
  width:${u(34)};min-width:${u(34)};height:${u(34)};display:flex;align-items:center;justify-content:center;
  border-radius:${u(9)};font-weight:700;background:rgba(255,255,255,.08);
}
.line--new .sig{background:var(--brand-color-badge-new);color:var(--brand-color-badgeInk-new,#fff);}
.line--update .sig{background:var(--brand-color-badge-update);color:var(--brand-color-badgeInk-update,#fff);}
.line--improvement .sig{background:var(--brand-color-badge-improvement);color:var(--brand-color-badgeInk-improvement,#fff);}
.line--bugfix .sig{background:var(--brand-color-badge-bugfix);color:var(--brand-color-badgeInk-bugfix,#fff);}
.line--removed .sig{background:var(--brand-color-badge-removed);color:var(--brand-color-badgeInk-removed,#fff);}
.line--soon .sig{background:var(--brand-color-badge-soon);color:var(--brand-color-badgeInk-soon,#fff);}
.line-copy b{font-weight:700;color:var(--brand-color-onDark,#fff);}
.line-body{color:rgba(255,255,255,.6);}
.cmd--last{margin-top:auto;}
.caret{display:inline-block;width:${u(12)};height:${u(24)};background:var(--brand-color-secondary);vertical-align:${u(-4)};}
.term-footer{font-size:${u(18)};color:var(--brand-color-inkMuted);text-align:center;}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default terminalNotes;
