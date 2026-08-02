import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { Canvas } from '../canvas.js';
import { Badge } from '../components.js';
import { ArtSlot } from '../image.js';
import { RichText } from '../text.js';

/**
 * Landscape split: artwork on one side, version + up to three compact
 * features on the other. For OG images, email heroes and X posts.
 */
export const bannerSplit = {
  id: 'banner-split',
  name: 'Banner split',
  description: 'Landscape banner — artwork on the left, version and compact features on the right.',
  aspect: [16, 9],
  maxEntries: 2,
  render(ctx) {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const onDark = theme.colors.onDark;

    const art = h(
      View,
      { style: { flexGrow: 0, flexShrink: 0, flexBasis: '46%', position: 'relative', borderRadius: theme.radius.hero, boxShadow: theme.shadow.hero, overflow: 'hidden' } },
      h(ArtSlot, { image: doc.hero, theme, resolveImageSource: ctx.resolveImageSource }),
      h(
        Text,
        { style: { position: 'absolute', left: u(28), bottom: u(26), fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(120), lineHeight: u(120), color: onDark, letterSpacing: u(-4) } },
        doc.version
      )
    );

    // Compact row item — the HTML version overrode `.card` heavily enough
    // (row layout, inline badge+title) that it's simpler built directly
    // than bent out of the shared `Card` component.
    const item = (entry, i) =>
      h(
        View,
        {
          key: i,
          style: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: u(12),
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.card,
            boxShadow: theme.shadow.card,
            paddingVertical: u(14),
            paddingHorizontal: u(20)
          }
        },
        h(Badge, { entry, theme, u, fontSize: 15, paddingVertical: 5, paddingHorizontal: 12 }),
        entry.title
          ? h(RichText, { value: entry.title, style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(26), color: theme.colors.ink } })
          : null,
        entry.body
          ? h(RichText, { value: entry.body, style: { flexGrow: 1, flexBasis: '100%', fontSize: u(19), color: theme.colors.inkMuted } })
          : null
      );

    const copy = h(
      View,
      { style: { flex: 1, minWidth: 0, minHeight: 0, overflow: 'hidden', gap: u(18), justifyContent: 'center' } },
      h(
        View,
        { style: { gap: u(4) } },
        doc.product ? h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(52), letterSpacing: u(-1), color: theme.colors.ink } }, doc.product) : null,
        doc.tagline ? h(Text, { style: { fontSize: u(26), color: theme.colors.inkMuted } }, doc.tagline) : null
      ),
      h(View, { style: { gap: u(12), minHeight: 0 } }, ...doc.entries.slice(0, 2).map(item))
    );

    return h(Canvas, { size: ctx.size, theme, style: { flexDirection: 'row' } }, art, copy);
  }
};

export default bannerSplit;
