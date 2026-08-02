import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { Canvas } from '../canvas.js';
import { Card } from '../components.js';
import { ArtSlot } from '../image.js';

/**
 * Gradient hero built entirely from brand tokens (no artwork required):
 * big version wordmark on a brand gradient, cards above and below.
 */
export const gradientHero = {
  id: 'gradient-hero',
  name: 'Gradient hero',
  description: 'Brand-gradient hero panel with an oversized version number; artwork optional.',
  aspect: [4, 5],
  maxEntries: 4,
  render(ctx) {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const entries = doc.entries.slice(0, 4);
    const onDark = theme.colors.onDark;

    const row = (list, dark = false) =>
      h(
        View,
        { style: { flexDirection: 'row', gap: theme.spacing.gap } },
        ...list.map((entry, i) =>
          h(View, { key: i, style: { flex: 1, minHeight: u(215) } }, h(Card, { entry, theme, u, dark: dark || entry.dark, resolveImageSource: ctx.resolveImageSource }))
        )
      );

    const hero = h(
      View,
      {
        style: {
          position: 'relative',
          flex: 1,
          minHeight: u(520),
          overflow: 'hidden',
          borderRadius: theme.radius.hero,
          backgroundColor: theme.colors.heroTo,
          boxShadow: theme.shadow.hero,
          alignItems: 'center',
          justifyContent: 'center'
        }
      },
      doc.hero?.src ? h(ArtSlot, { image: doc.hero, theme, resolveImageSource: ctx.resolveImageSource }) : null,
      h(
        View,
        { style: { alignItems: 'center', paddingHorizontal: u(56), width: '100%' } },
        doc.product
          ? h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(56), letterSpacing: u(-1), color: onDark, textAlign: 'center' } }, doc.product)
          : null,
        h(
          Text,
          {
            style: {
              fontFamily: theme.fonts.display,
              fontWeight: '800',
              fontSize: u(250),
              lineHeight: u(250) * 0.88,
              letterSpacing: u(-10),
              color: onDark,
              textAlign: 'center',
              textShadowColor: 'rgba(0,0,0,.22)',
              textShadowOffset: { width: 0, height: u(10) },
              textShadowRadius: u(30)
            }
          },
          doc.version
        ),
        doc.tagline
          ? h(Text, { style: { fontSize: u(32), fontWeight: '500', opacity: 0.95, marginTop: u(10), color: onDark, textAlign: 'center' } }, doc.tagline)
          : null
      )
    );

    return h(Canvas, { size: ctx.size, theme }, row(entries.slice(0, 2)), hero, row(entries.slice(2, 4)));
  }
};

export default gradientHero;
