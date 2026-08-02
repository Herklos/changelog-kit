import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { Badge } from '../components.js';
import { ArtSlot } from '../image.js';
import { LinearFill, RadialFill } from '../gradients.js';
import { RichText } from '../text.js';

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
    const { u, theme } = themeFromContext(ctx);
    const entries = doc.entries.slice(0, 4);
    const cta = doc.meta?.cta ?? (doc.status === 'upcoming' ? 'Notify me' : 'See what changed');
    const onDark = theme.colors.onDark;

    const glow = h(
      View,
      { style: { position: 'absolute', width: '130%', aspectRatio: 1, left: '-15%', top: '-42%', borderRadius: 99999, opacity: 0.35, overflow: 'hidden' } },
      h(RadialFill, { colors: [{ color: theme.colors.primary, offset: '0%' }, { color: 'transparent', offset: '62%' }] })
    );

    const rows = h(
      View,
      { style: { flex: 1, minHeight: 0, flexDirection: 'column', gap: u(18), justifyContent: 'center' } },
      ...entries.map((entry, i) => {
        const icon = entry.image
          ? h(ArtSlot, { image: entry.image, theme, resolveImageSource: ctx.resolveImageSource, borderRadius: theme.radius.image, style: { position: 'relative', flexGrow: 0, flexShrink: 0, width: u(84), height: u(84) } })
          : h(View, { style: { flexGrow: 0, flexShrink: 0, width: u(84), height: u(84), borderRadius: theme.radius.image, backgroundColor: theme.colors.heroFrom } });
        return h(
          View,
          { key: i, style: { flexDirection: 'row', gap: u(16), alignItems: 'center' } },
          icon,
          h(
            View,
            { style: { flex: 1, minWidth: 0, gap: u(5) } },
            h(
              View,
              { style: { flexDirection: 'row', alignItems: 'center', gap: u(10), flexWrap: 'wrap' } },
              h(Badge, { entry, theme, u, fontSize: 15, paddingVertical: 5, paddingHorizontal: 12 }),
              h(RichText, { value: entry.title ?? '', style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(28), lineHeight: u(28) * 1.1, color: theme.colors.ink } })
            ),
            entry.body
              ? h(RichText, { value: entry.body, style: { fontSize: u(21), lineHeight: u(21) * 1.3, color: theme.colors.inkMuted } })
              : null
          )
        );
      })
    );

    const sheetcard = h(
      View,
      {
        style: {
          width: '100%',
          maxHeight: '100%',
          minHeight: '74%',
          flexDirection: 'column',
          gap: u(22),
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.hero,
          boxShadow: theme.shadow.hero,
          paddingTop: u(30),
          paddingHorizontal: u(30),
          paddingBottom: u(26)
        }
      },
      h(View, { style: { width: u(72), height: u(7), borderRadius: 99, backgroundColor: theme.colors.inkMuted, opacity: 0.35, alignSelf: 'center' } }),
      h(
        View,
        { style: { gap: u(8) } },
        h(
          View,
          { style: { alignSelf: 'flex-start', backgroundColor: theme.colors.primary, borderRadius: theme.radius.badge, paddingVertical: u(7), paddingHorizontal: u(16) } },
          h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(19), color: theme.colors.surfaceAlt } }, `${doc.product} ${doc.version}`)
        ),
        h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(58), lineHeight: u(58) * 1.02, letterSpacing: u(-1.6), color: theme.colors.ink } }, 'What’s new'),
        doc.tagline
          ? h(Text, { style: { fontSize: u(24), lineHeight: u(24) * 1.32, color: theme.colors.inkMuted } }, doc.tagline)
          : null
      ),
      rows,
      h(
        View,
        { style: { alignItems: 'center', gap: u(12) } },
        h(
          View,
          { style: { alignSelf: 'stretch', borderRadius: theme.radius.card, backgroundColor: theme.colors.surfaceAlt, padding: u(20) } },
          h(Text, { style: { textAlign: 'center', fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(26), color: onDark } }, cta)
        ),
        doc.footer ? h(Text, { style: { fontSize: u(17), color: theme.colors.inkMuted } }, doc.footer) : null
      )
    );

    return h(
      View,
      {
        style: {
          width: ctx.size.width,
          height: ctx.size.height,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: theme.spacing.outer
        }
      },
      h(LinearFill, { colors: [{ color: theme.colors.heroFrom, offset: '0%' }, { color: theme.colors.heroTo, offset: '74%' }], angle: 190 }),
      glow,
      sheetcard
    );
  }
};

export default whatsNewSheet;
