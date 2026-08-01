import { htmlDocument, u } from '../base.js';
import { badge, badgeCss } from '../components.js';
import { esc, inlineMd } from '@changelog-kit/core';

/**
 * The release as a ticket: perforated stub, monospace serials, features as
 * printed rows. Collectible feel for milestone versions.
 */
export const ticketStub = {
  id: 'ticket-stub',
  name: 'Ticket stub',
  description: 'The release as a printed ticket — perforated stub, serials and feature rows.',
  aspect: [1, 1],
  maxEntries: 4,
  render(ctx) {
    const { doc } = ctx;
    const entries = doc.entries.slice(0, 4);
    const serial = [
      (doc.product || 'REL').slice(0, 3).toUpperCase(),
      doc.version.replace(/[^0-9a-z]/gi, '').toUpperCase(),
      (doc.date || '').replace(/\D/g, '').slice(0, 8)
    ].filter(Boolean).join('-');

    const body = `<div class="sheet ticket-sheet">
  <div class="ticket">
    <div class="ticket-main">
      <div class="ticket-head">
        <span class="ticket-brand">${esc(doc.product)}</span>
        <span class="ticket-serial">${esc(serial)}</span>
      </div>
      <div class="ticket-lead">
        <span class="ticket-label">Release</span>
        <span class="ticket-version">${esc(doc.version)}</span>
        ${doc.tagline ? `<p class="ticket-tagline">${esc(doc.tagline)}</p>` : ''}
      </div>
      <ul class="ticket-rows">
        ${entries.map((e) => `<li class="ticket-row">
          ${badge(e)}
          <span class="ticket-row-title">${inlineMd(e.title ?? '')}</span>
          ${e.body ? `<span class="ticket-row-text">${inlineMd(e.body)}</span>` : ''}
        </li>`).join('')}
      </ul>
    </div>
    <div class="ticket-perf">
      <span class="notch notch--top"></span>
      <span class="notch notch--bottom"></span>
    </div>
    <div class="ticket-stub">
      <span class="stub-version">${esc(doc.version)}</span>
      <span class="stub-meta">${esc(doc.date || 'admit one')}</span>
    </div>
  </div>
  ${doc.footer ? `<p class="ticket-footer">${esc(doc.footer)}</p>` : ''}
</div>`;

    const css = `
${badgeCss}
.badge{font-size:${u(14)};padding:${u(5)} ${u(11)};}
.ticket-sheet{gap:${u(18)};}
.ticket{
  flex:1 1 auto;display:flex;min-height:0;overflow:hidden;
  background:var(--brand-color-surface);
  border-radius:calc(var(--brand-radius-hero) * var(--u));
  box-shadow:var(--brand-shadow-hero);
}
.ticket-main{flex:1 1 auto;display:flex;flex-direction:column;gap:${u(20)};padding:${u(38)};min-width:0;}
.ticket-head{
  display:flex;align-items:center;justify-content:space-between;
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:${u(19)};
  letter-spacing:${u(2)};text-transform:uppercase;color:var(--brand-color-inkMuted);
}
.ticket-brand{font-family:var(--brand-font-display);font-weight:700;letter-spacing:${u(1)};color:var(--brand-color-ink);}
.ticket-lead{display:flex;flex-direction:column;gap:${u(2)};margin:auto 0;}
.ticket-label{font-size:${u(20)};letter-spacing:${u(4)};text-transform:uppercase;color:var(--brand-color-inkMuted);}
.ticket-version{
  font-family:var(--brand-font-display);font-weight:800;font-size:${u(140)};line-height:.88;
  letter-spacing:${u(-6)};color:var(--brand-color-ink);
}
.ticket-tagline{font-size:${u(24)};color:var(--brand-color-inkMuted);margin-top:${u(8)};text-wrap:pretty;}
.ticket-rows{list-style:none;display:flex;flex-direction:column;gap:${u(10)};}
.ticket-row{
  display:flex;align-items:baseline;gap:${u(12)};flex-wrap:wrap;
  padding-top:${u(12)};border-top:${u(1)} dashed var(--brand-color-inkMuted);
}
.ticket-row-title{font-family:var(--brand-font-display);font-weight:700;font-size:${u(24)};}
.ticket-row-text{font-size:${u(20)};color:var(--brand-color-inkMuted);}
.ticket-perf{position:relative;width:${u(2)};background:repeating-linear-gradient(to bottom,var(--brand-color-inkMuted) 0 ${u(10)},transparent ${u(10)} ${u(22)});}
.notch{
  position:absolute;left:50%;transform:translate(-50%,-50%);
  width:${u(44)};height:${u(44)};border-radius:99px;background:var(--brand-color-canvas);
}
.notch--top{top:0;}
.notch--bottom{top:100%;}
.ticket-stub{
  flex:0 0 ${u(190)};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${u(14)};
  background:linear-gradient(200deg,var(--brand-color-heroFrom),var(--brand-color-heroTo));
  color:var(--brand-color-onDark,#fff);
}
.stub-version{
  font-family:var(--brand-font-display);font-weight:800;font-size:${u(76)};letter-spacing:${u(-2)};
  writing-mode:vertical-rl;transform:rotate(180deg);
}
.stub-meta{
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:${u(17)};letter-spacing:${u(3)};
  text-transform:uppercase;writing-mode:vertical-rl;transform:rotate(180deg);opacity:.8;
}
.ticket-footer{font-size:${u(18)};color:var(--brand-color-inkMuted);text-align:center;}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default ticketStub;
