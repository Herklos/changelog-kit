import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { ArtSlot } from '../image.js';
import { LinearFill } from '../gradients.js';
import { RichText } from '../text.js';
import type { ReactElement } from 'react';
import type { Ctx, TemplateDef } from '../context.js';

/**
 * Single-message teaser poster: "COMING SOON 2.9" over a full-bleed
 * gradient, one piece of artwork, an icon row and a footer line.
 */
export const teaserPoster: TemplateDef = {
  id: 'teaser-poster',
  name: 'Teaser poster',
  description: 'One-message announcement poster for upcoming releases.',
  aspect: [4, 5],
  maxEntries: 1,
  render(ctx: Ctx): ReactElement {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const lead = doc.entries[0];
    const label = doc.status === 'upcoming' ? 'Coming soon' : 'Out now';
    const onDark = theme.colors.onDark;

    return h(
      View,
      {
        style: { width: ctx.size.width, height: ctx.size.height, overflow: 'hidden', padding: theme.spacing.outer, gap: theme.spacing.gap, alignItems: 'center' }
      },
      h(LinearFill, { colors: [theme.colors.heroFrom, theme.colors.heroTo], angle: 160 }),
      h(
        View,
        { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: u(18), alignSelf: 'stretch', paddingTop: u(10), paddingBottom: u(6) } },
        h(
          Text,
          {
            style: {
              fontFamily: theme.fonts.display,
              fontWeight: '800',
              textTransform: 'uppercase',
              fontSize: u(60),
              lineHeight: u(60) * 0.95,
              letterSpacing: u(-1),
              maxWidth: u(430),
              backgroundColor: theme.colors.accent,
              color: onDark,
              paddingVertical: u(24),
              paddingHorizontal: u(38),
              borderRadius: theme.radius.badge,
              textAlign: 'center',
              transform: [{ rotate: '-6deg' }]
            }
          },
          label
        ),
        h(
          Text,
          { style: { fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(190), lineHeight: u(190) * 0.82, letterSpacing: u(-8), color: onDark } },
          doc.version
        )
      ),
      h(ArtSlot, {
        image: doc.hero,
        theme,
        resolveImageSource: ctx.resolveImageSource,
        borderRadius: theme.radius.hero,
        style: { position: 'relative', flex: 1, alignSelf: 'stretch', marginVertical: u(28) }
      }),
      lead
        ? h(
            View,
            { style: { gap: u(10), maxWidth: u(840) } },
            lead.title
              ? h(RichText, { value: lead.title, style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(46), lineHeight: u(46) * 1.1, color: onDark, textAlign: 'center' } })
              : null,
            lead.body
              ? h(RichText, { value: lead.body, style: { fontSize: u(28), lineHeight: u(28) * 1.35, opacity: 0.9, color: onDark, textAlign: 'center' } })
              : null
          )
        : null,
      doc.footer ? h(Text, { style: { marginTop: u(26), fontSize: u(20), opacity: 0.65, color: onDark, textAlign: 'center' } }, doc.footer) : null
    );
  }
};

export default teaserPoster;
