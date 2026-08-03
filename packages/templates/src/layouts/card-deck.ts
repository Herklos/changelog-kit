import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { Badge } from '../components.js';
import { ArtSlot } from '../image.js';
import { RadialFill } from '../gradients.js';
import { RichText } from '../text.js';
import type { ReactElement } from 'react';
import type { Ctx, TemplateDef } from '../context.js';

const TILT = [-4, -1.5, 1.5, 4];

/**
 * A fanned stack of feature cards over an outsized version numeral: depth and
 * motion in a still frame. Best with three or four short entries.
 */
export const cardDeck: TemplateDef = {
  id: 'card-deck',
  name: 'Card deck',
  description: 'Fanned stack of feature cards over an oversized version numeral — playful depth.',
  aspect: [4, 5],
  maxEntries: 4,
  render(ctx: Ctx): ReactElement {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const entries = doc.entries.slice(0, 4);
    const onDark = theme.colors.onDark;

    return h(
      View,
      { style: { position: 'relative', width: ctx.size.width, height: ctx.size.height, overflow: 'hidden', padding: theme.spacing.outer, alignItems: 'center' } },
      h(RadialFill, { colors: [theme.colors.heroFrom, theme.colors.heroTo], cx: '50%', cy: '0%', r: '80%' }),
      h(
        View,
        { style: { position: 'absolute', left: 0, right: 0, top: u(210), alignItems: 'center' } },
        h(
          Text,
          { style: { fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(460), lineHeight: u(460) * 0.8, letterSpacing: u(-20), color: 'rgba(255,255,255,.07)' } },
          doc.version
        )
      ),
      h(
        View,
        { style: { alignItems: 'center', gap: u(8) } },
        h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(58), letterSpacing: u(-1.4), color: onDark, textAlign: 'center' } }, doc.product),
        doc.tagline ? h(Text, { style: { fontSize: u(28), opacity: 0.85, maxWidth: u(620), color: onDark, textAlign: 'center' } }, doc.tagline) : null
      ),
      h(
        View,
        { style: { flex: 1, alignSelf: 'stretch', minHeight: 0, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', gap: u(26), paddingVertical: u(20), paddingHorizontal: u(10) } },
        ...entries.map((entry, i) =>
          h(
            View,
            { key: i, style: { flexBasis: '50%', flexGrow: 0, flexShrink: 0, minHeight: 0 } },
            h(
              View,
              {
                style: {
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.radius.card,
                  boxShadow: theme.shadow.hero,
                  padding: u(22),
                  gap: u(12),
                  minHeight: 0,
                  overflow: 'hidden',
                  // The original also nudged alternating cards vertically
                  // (`translateY(±3%)`); RN transforms need fixed pixel
                  // offsets, not percentages of an unmeasured height, so
                  // only the tilt survives — the fan still reads from rotation alone.
                  transform: [{ rotate: `${TILT[i] ?? 0}deg` }]
                }
              },
              entry.image
                ? h(ArtSlot, { image: entry.image, theme, resolveImageSource: ctx.resolveImageSource, borderRadius: theme.radius.image, style: { position: 'relative', flex: 1, minHeight: u(90) } })
                : null,
              h(
                View,
                { style: { gap: u(8) } },
                h(Badge, { entry, theme, u, fontSize: 15, paddingVertical: 5, paddingHorizontal: 12 }),
                entry.title
                  ? h(RichText, { value: entry.title, style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(30), lineHeight: u(30) * 1.1, color: theme.colors.ink } })
                  : null,
                entry.body ? h(RichText, { value: entry.body, style: { fontSize: u(21), lineHeight: u(21) * 1.3, color: theme.colors.inkMuted } }) : null
              )
            )
          )
        )
      ),
      doc.footer ? h(Text, { style: { fontSize: u(18), opacity: 0.7, marginTop: u(16), color: onDark } }, doc.footer) : null
    );
  }
};

export default cardDeck;
