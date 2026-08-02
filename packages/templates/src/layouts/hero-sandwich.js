import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { Canvas } from '../canvas.js';
import { Card, VersionMark } from '../components.js';
import { ArtSlot } from '../image.js';

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
  render(ctx) {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const entries = doc.entries.filter((e) => !e.heroOnly).slice(0, 4);
    const top = entries.slice(0, 2);
    const bottom = entries.slice(2, 4);
    const heroArt = doc.hero?.src;
    const heroLabel = doc.status === 'upcoming' ? 'Coming soon' : '';

    const row = (list) =>
      h(
        View,
        { style: { flexDirection: 'row', gap: theme.spacing.gap } },
        ...list.map((entry, i) =>
          h(
            View,
            { key: i, style: { flex: 1, minHeight: u(230) } },
            h(Card, { entry, theme, u, dark: entry.dark, resolveImageSource: ctx.resolveImageSource })
          )
        )
      );

    const hero = h(
      View,
      {
        style: {
          flex: 1,
          minHeight: u(500),
          borderRadius: theme.radius.hero,
          boxShadow: theme.shadow.hero,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }
      },
      h(ArtSlot, { image: doc.hero, theme, resolveImageSource: ctx.resolveImageSource }),
      heroArt ? null : h(VersionMark, { doc, theme, u, size: 300, label: heroLabel }),
      doc.footer
        ? h(
            Text,
            { style: { position: 'absolute', left: u(30), bottom: u(24), color: theme.colors.onDark, opacity: 0.85, fontSize: u(22) } },
            doc.footer
          )
        : null
    );

    return h(Canvas, { size: ctx.size, theme }, row(top), hero, row(bottom));
  }
};

export default heroSandwich;
