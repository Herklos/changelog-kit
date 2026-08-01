import { htmlDocument, u, imageBackground } from '../base.js';
import { card, cardCss, versionMark, versionMarkCss } from '../components.js';
import { esc } from '@changelog-kit/core';

/**
 * Two cards, a full-bleed hero panel carrying the version, two more cards.
 * The workhorse layout for portrait social posts.
 */
export const heroSandwich = {
  id: 'hero-sandwich',
  name: 'Hero sandwich',
  description: 'Feature cards above and below a full-bleed hero panel with the version number.',
  aspect: [4, 5],
  maxEntries: 4,
  options: { heroLabel: '', heroFlex: 1.35 },
  render(ctx) {
    const { doc, brand } = ctx;
    const entries = doc.entries.filter((e) => !e.heroOnly).slice(0, 4);
    const top = entries.slice(0, 2);
    const bottom = entries.slice(2, 4);
    const heroArt = doc.hero?.src;
    const heroLabel = doc.status === 'upcoming' ? 'Coming soon' : '';

    const row = (list) =>
      `<div class="row">${list.map((entry) => card(entry, { dark: entry.dark })).join('')}</div>`;

    const body = `<div class="sheet">
  ${row(top)}
  <section class="hero" style="${imageBackground(doc.hero, brand)}">
    ${heroArt ? '' : versionMark(doc, { size: 300, label: heroLabel })}
    ${doc.footer ? `<span class="hero-footer">${esc(doc.footer)}</span>` : ''}
  </section>
  ${row(bottom)}
</div>`;

    const css = `
${cardCss}
${versionMarkCss}
.row{display:grid;grid-template-columns:1fr 1fr;gap:calc(var(--brand-space-gap) * var(--u));flex:0 0 auto;}
.row .card{min-height:${u(230)};}
.hero{
  flex:1 1 auto;min-height:${u(500)};
  border-radius:calc(var(--brand-radius-hero) * var(--u));
  box-shadow:var(--brand-shadow-hero);
  display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;
}
.hero-footer{
  position:absolute;left:${u(30)};bottom:${u(24)};
  color:var(--brand-color-onDark,#fff);opacity:.85;font-size:${u(22)};
}`;
    return htmlDocument(ctx, { css, body });
  }
};

export default heroSandwich;
