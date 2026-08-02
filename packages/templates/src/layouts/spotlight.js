import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { Badge } from '../components.js';
import { ArtSlot } from '../image.js';
import { RichText } from '../text.js';

/**
 * One feature, told properly: full-bleed artwork with an edge-to-edge caption
 * plate. Square by default — the format for a single-feature announcement.
 */
export const spotlight = {
  id: 'spotlight',
  name: 'Spotlight',
  description: 'Single-feature announcement: full-bleed artwork with a caption plate and version chip.',
  aspect: [1, 1],
  maxEntries: 1,
  render(ctx) {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const lead = doc.entries[0] ?? {};
    const onDark = theme.colors.onDark;

    return h(
      View,
      { style: { width: ctx.size.width, height: ctx.size.height, overflow: 'hidden', backgroundColor: theme.colors.heroTo } },
      h(ArtSlot, { image: lead.image ?? doc.hero, theme, resolveImageSource: ctx.resolveImageSource }),
      h(
        View,
        {
          style: {
            position: 'absolute',
            top: u(38),
            left: u(38),
            flexDirection: 'row',
            alignItems: 'center',
            // backdrop-filter: blur() has no RN/react-native-web equivalent — the
            // translucent fill alone is the approximation (see CLAUDE.md).
            backgroundColor: 'rgba(255,255,255,.14)',
            borderWidth: u(1),
            borderColor: 'rgba(255,255,255,.28)',
            paddingVertical: u(10),
            paddingHorizontal: u(20),
            borderRadius: theme.radius.badge
          }
        },
        h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '500', fontSize: u(24), color: onDark } }, `${doc.product} `),
        h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(24), color: onDark } }, doc.version)
      ),
      h(
        View,
        {
          style: {
            position: 'absolute',
            left: u(34),
            right: u(34),
            bottom: u(34),
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.hero,
            paddingVertical: u(38),
            paddingHorizontal: u(40),
            gap: u(14),
            boxShadow: theme.shadow.hero
          }
        },
        h(
          View,
          { style: { flexDirection: 'row', alignItems: 'center', gap: u(14) } },
          h(Badge, { entry: lead, theme, u }),
          doc.date ? h(Text, { style: { fontSize: u(20), color: theme.colors.inkMuted } }, doc.date) : null
        ),
        lead.title
          ? h(RichText, { value: lead.title, style: { fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(66), lineHeight: u(66) * 1.04, letterSpacing: u(-2), color: theme.colors.ink } })
          : null,
        lead.body
          ? h(RichText, { value: lead.body, style: { fontSize: u(28), lineHeight: u(28) * 1.35, color: theme.colors.inkMuted, maxWidth: u(760) } })
          : null
      )
    );
  }
};

export default spotlight;
