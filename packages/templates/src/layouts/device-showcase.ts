import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { Badge } from '../components.js';
import { ArtSlot } from '../image.js';
import { RadialFill, LinearFill } from '../gradients.js';
import { RichText } from '../text.js';
import type { ReactElement } from 'react';
import type { ChangelogEntry } from '@changelog-kit/core';
import type { Ctx, TemplateDef } from '../context.js';

/**
 * The release inside a device: a phone bezel holding the artwork, headline
 * above, feature captions flanking it. Product-launch flavour.
 */
export const deviceShowcase: TemplateDef = {
  id: 'device-showcase',
  name: 'Device showcase',
  description: 'Artwork inside a phone bezel, headline above, feature captions flanking the device.',
  aspect: [4, 5],
  maxEntries: 4,
  render(ctx: Ctx): ReactElement {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const entries = doc.entries.slice(0, 4);
    const onDark = theme.colors.onDark;

    const caption = (entry: ChangelogEntry, i: number, align: 'left' | 'right'): ReactElement =>
      h(
        View,
        { key: i, style: { gap: u(8), alignItems: align === 'right' ? 'flex-end' : 'flex-start' } },
        h(Badge, { entry, theme, u, fontSize: 15, paddingVertical: 5, paddingHorizontal: 12 }),
        entry.title
          ? h(RichText, { value: entry.title, style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(28), lineHeight: u(28) * 1.14, color: onDark, textAlign: align } })
          : null,
        entry.body ? h(RichText, { value: entry.body, style: { fontSize: u(21), lineHeight: u(21) * 1.3, opacity: 0.78, color: onDark, textAlign: align } }) : null
      );

    const phone = h(
      View,
      {
        style: {
          position: 'relative',
          flexGrow: 1.05,
          alignSelf: 'center',
          aspectRatio: 9 / 19,
          maxHeight: u(760),
          borderRadius: u(54),
          padding: u(12),
          boxShadow: theme.shadow.hero
        }
      },
      h(LinearFill, { colors: ['rgba(255,255,255,.35)', 'rgba(255,255,255,.08)'], angle: 160, borderRadius: u(54) }),
      // The screen sits inset within the bezel's own padding (revealing the
      // gradient behind as a frame), so `ArtSlot`'s absolute-fill default is
      // overridden to size it via the bezel's own flex layout instead.
      h(ArtSlot, {
        image: doc.hero ?? entries[0]?.image,
        theme,
        resolveImageSource: ctx.resolveImageSource,
        borderRadius: u(44),
        style: { position: 'relative', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }
      }),
      h(View, { style: { position: 'absolute', top: u(24), left: 0, right: 0, alignItems: 'center' } }, h(View, { style: { width: u(120), height: u(20), borderRadius: u(20), backgroundColor: 'rgba(0,0,0,.55)' } }))
    );

    return h(
      View,
      { style: { width: ctx.size.width, height: ctx.size.height, overflow: 'hidden', padding: theme.spacing.outer, gap: u(24), alignItems: 'center' } },
      h(RadialFill, { colors: [theme.colors.heroFrom, theme.colors.heroTo], cx: '50%', cy: '0%', r: '80%' }),
      h(
        View,
        { style: { alignItems: 'center', gap: u(8) } },
        h(
          Text,
          { style: { fontFamily: theme.fonts.display, fontWeight: '600', fontSize: u(52), letterSpacing: u(-1), lineHeight: u(52) * 1.06, color: onDark, textAlign: 'center' } },
          `${doc.product} `,
          h(Text, { style: { fontWeight: '800' } }, doc.version)
        ),
        doc.tagline ? h(Text, { style: { fontSize: u(26), opacity: 0.85, maxWidth: u(620), color: onDark, textAlign: 'center' } }, doc.tagline) : null
      ),
      h(
        View,
        { style: { flex: 1, minHeight: 0, alignSelf: 'stretch', flexDirection: 'row', gap: u(18), alignItems: 'center' } },
        h(View, { style: { flex: 1, gap: u(22) } }, ...entries.slice(0, 2).map((e, i) => caption(e, i, 'left'))),
        phone,
        h(View, { style: { flex: 1, gap: u(22), alignItems: 'flex-end' } }, ...entries.slice(2, 4).map((e, i) => caption(e, i, 'right')))
      ),
      doc.footer ? h(Text, { style: { fontSize: u(18), opacity: 0.65, color: onDark } }, doc.footer) : null
    );
  }
};

export default deviceShowcase;
