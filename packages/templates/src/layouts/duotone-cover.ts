import { h } from '../h.js';
import { View, Text, Image } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { RichText } from '../text.js';
import type { ReactElement } from 'react';
import type { Ctx, TemplateDef } from '../context.js';

const FILL = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 };

/**
 * Poster cover: full-bleed artwork pushed through a brand duotone, an outlined
 * version numeral the height of the canvas and a single line of copy.
 * Maximum impact, minimum text.
 *
 * `filter`, `mixBlendMode` and `WebkitTextStroke` are plain style props here
 * (not routed through `react-native-svg`) — react-native-web forwards any
 * style key it doesn't specially handle straight through as real CSS
 * (verified), so the web/export path is pixel-exact. On native these need
 * RN's New Architecture (`filter`/`mixBlendMode` are View style props there
 * too, per RN's own docs) — the one part of this port assumed, not verified
 * on-device.
 */
export const duotoneCover: TemplateDef = {
  id: 'duotone-cover',
  name: 'Duotone cover',
  description: 'Full-bleed duotone artwork behind an outlined version numeral — a cover, not a list.',
  aspect: [4, 5],
  maxEntries: 3,
  render(ctx: Ctx): ReactElement {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const chips = doc.entries.slice(0, 3);
    const onDark = theme.colors.onDark;
    const image = doc.hero ?? doc.entries[0]?.image;

    return h(
      View,
      { style: { position: 'relative', width: ctx.size.width, height: ctx.size.height, overflow: 'hidden', backgroundColor: theme.colors.heroTo } },
      image?.src
        ? h(Image, { source: ctx.resolveImageSource ? ctx.resolveImageSource(image.src) : { uri: image.src }, resizeMode: 'cover', style: [FILL, { filter: 'grayscale(1) contrast(1.15)' }] })
        : null,
      h(View, { style: [FILL, { backgroundColor: theme.colors.heroFrom, mixBlendMode: 'multiply', opacity: 0.85 }] }),
      h(View, { style: [FILL, { backgroundColor: theme.colors.secondary, mixBlendMode: 'screen', opacity: 0.22 }] }),
      h(
        View,
        { style: [FILL, { padding: theme.spacing.outer, justifyContent: 'space-between' }] },
        h(
          View,
          { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } },
          h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '600', fontSize: u(24), letterSpacing: u(2), textTransform: 'uppercase', color: onDark } }, doc.product),
          h(
            Text,
            { style: { fontFamily: theme.fonts.display, fontWeight: '600', fontSize: u(24), letterSpacing: u(2), textTransform: 'uppercase', color: onDark } },
            doc.date || (doc.status === 'upcoming' ? 'Coming soon' : 'Out now')
          )
        ),
        h(
          View,
          { style: { flex: 1, alignItems: 'center', justifyContent: 'center' } },
          h(
            Text,
            {
              style: {
                fontFamily: theme.fonts.display,
                fontWeight: '800',
                fontSize: u(400),
                lineHeight: u(400) * 0.78,
                letterSpacing: u(-18),
                color: 'transparent',
                WebkitTextStroke: `${u(4)}px ${onDark}`,
                textShadowColor: 'rgba(0,0,0,.35)',
                textShadowOffset: { width: 0, height: u(30) },
                textShadowRadius: u(80)
              }
            },
            doc.version
          )
        ),
        h(
          View,
          { style: { gap: u(16) } },
          doc.tagline
            ? h(RichText, {
                value: doc.tagline,
                style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(48), lineHeight: u(48) * 1.06, letterSpacing: u(-1.2), maxWidth: u(760), color: onDark }
              })
            : null,
          h(
            View,
            { style: { flexDirection: 'row', flexWrap: 'wrap', gap: u(10) } },
            ...chips.map((entry, i) =>
              h(
                Text,
                {
                  key: i,
                  style: {
                    fontSize: u(22),
                    paddingVertical: u(9),
                    paddingHorizontal: u(18),
                    borderRadius: theme.radius.badge,
                    borderWidth: u(1),
                    borderColor: 'rgba(255,255,255,.45)',
                    backgroundColor: 'rgba(255,255,255,.12)',
                    color: onDark
                  }
                },
                entry.title ?? ''
              )
            )
          ),
          doc.footer ? h(Text, { style: { fontSize: u(18), opacity: 0.7, color: onDark } }, doc.footer) : null
        )
      )
    );
  }
};

export default duotoneCover;
