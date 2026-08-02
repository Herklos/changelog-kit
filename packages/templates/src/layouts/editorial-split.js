import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { Canvas } from '../canvas.js';
import { Badge } from '../components.js';
import { ArtSlot } from '../image.js';
import { RichText } from '../text.js';

/**
 * Magazine spread: a tall art column, a kicker rule, an oversized version and
 * the features as a numbered, hairline-separated list. Typographic, calm.
 */
export const editorialSplit = {
  id: 'editorial-split',
  name: 'Editorial split',
  description: 'Magazine spread — kicker rule, oversized version, numbered feature list beside a tall art column.',
  aspect: [4, 5],
  maxEntries: 5,
  render(ctx) {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const entries = doc.entries.slice(0, 5);

    const kicker = h(
      View,
      { style: { flexDirection: 'row', alignItems: 'center', gap: u(16) } },
      h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '600', fontSize: u(20), letterSpacing: u(2), textTransform: 'uppercase', color: theme.colors.inkMuted } }, doc.product),
      h(View, { style: { flex: 1, height: u(1), backgroundColor: theme.colors.inkMuted, opacity: 0.4 } }),
      h(
        Text,
        { style: { fontFamily: theme.fonts.display, fontWeight: '600', fontSize: u(20), letterSpacing: u(2), textTransform: 'uppercase', color: theme.colors.inkMuted } },
        doc.date || doc.tagline
      )
    );

    const list = h(
      View,
      { style: { flex: 1, minHeight: 0, marginTop: u(6) } },
      ...entries.map((entry, i) =>
        h(
          View,
          {
            key: i,
            style: {
              flexDirection: 'row',
              gap: u(16),
              paddingVertical: u(16),
              alignItems: 'center',
              flex: 1,
              borderTopWidth: u(1),
              borderTopColor: theme.colors.inkMuted,
              ...(i === entries.length - 1 ? { borderBottomWidth: u(1), borderBottomColor: theme.colors.inkMuted } : {})
            }
          },
          h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(18), color: theme.colors.primary, minWidth: u(34) } }, String(i + 1).padStart(2, '0')),
          h(
            View,
            { style: { flex: 1, minWidth: 0, gap: u(6) } },
            h(
              View,
              { style: { flexDirection: 'row', alignItems: 'center', gap: u(12), flexWrap: 'wrap' } },
              h(Badge, { entry, theme, u, fontSize: 15, paddingVertical: 5, paddingHorizontal: 12 }),
              entry.title
                ? h(RichText, { value: entry.title, style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(28), lineHeight: u(28) * 1.14, color: theme.colors.ink } })
                : null
            ),
            entry.body ? h(RichText, { value: entry.body, style: { fontSize: u(21), lineHeight: u(21) * 1.32, color: theme.colors.inkMuted } }) : null
          )
        )
      )
    );

    const main = h(
      View,
      { style: { flex: 1.12, minHeight: 0, gap: u(14) } },
      h(
        View,
        { style: { flexDirection: 'row', alignItems: 'flex-start' } },
        h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '600', fontSize: u(52), color: theme.colors.primary, marginTop: u(14) } }, 'v'),
        h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(150), lineHeight: u(150) * 0.82, letterSpacing: u(-7), color: theme.colors.ink } }, doc.version)
      ),
      doc.tagline ? h(Text, { style: { fontSize: u(26), lineHeight: u(26) * 1.3, color: theme.colors.inkMuted, maxWidth: u(460) } }, doc.tagline) : null,
      list
    );

    const aside = h(
      View,
      { style: { flex: 0.88, minHeight: 0 } },
      h(ArtSlot, { image: doc.hero ?? entries[0]?.image, theme, resolveImageSource: ctx.resolveImageSource, borderRadius: theme.radius.hero, style: { position: 'relative', flex: 1, boxShadow: theme.shadow.hero } })
    );

    return h(
      Canvas,
      { size: ctx.size, theme, style: { gap: u(22) } },
      kicker,
      h(View, { style: { flex: 1, flexDirection: 'row', gap: theme.spacing.gap, minHeight: 0 } }, main, aside),
      doc.footer ? h(Text, { style: { fontSize: u(18), color: theme.colors.inkMuted } }, doc.footer) : null
    );
  }
};

export default editorialSplit;
