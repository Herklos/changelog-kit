import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { Badge } from '../components.js';
import { ArtSlot } from '../image.js';
import { LinearFill } from '../gradients.js';
import { RichText } from '../text.js';

/**
 * 9:16 story: progress pips, a tall artwork panel, then the features as a
 * numbered stack. Built for Instagram / TikTok stories and phone in-app modals.
 */
export const storyStack = {
  id: 'story-stack',
  name: 'Story stack',
  description: 'Vertical 9:16 story — progress pips, tall artwork and a numbered feature stack.',
  aspect: [9, 16],
  maxEntries: 4,
  render(ctx) {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const entries = doc.entries.slice(0, 4);
    const onDark = theme.colors.onDark;

    return h(
      View,
      { style: { width: ctx.size.width, height: ctx.size.height, overflow: 'hidden', padding: theme.spacing.outer, gap: u(24) } },
      h(LinearFill, {
        colors: [{ color: theme.colors.heroFrom, offset: '0%' }, { color: theme.colors.heroTo, offset: '62%' }, { color: theme.colors.heroTo, offset: '100%' }],
        angle: 180
      }),
      h(View, { style: { flexDirection: 'row', gap: u(8) } }, ...entries.map((_, i) =>
        h(View, { key: i, style: { flex: 1, height: u(6), borderRadius: u(6), backgroundColor: i === 0 ? onDark : 'rgba(255,255,255,.28)' } })
      )),
      h(
        View,
        { style: { gap: u(2) } },
        h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '600', fontSize: u(34), opacity: 0.85, color: onDark } }, doc.product),
        h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(160), lineHeight: u(160) * 0.85, letterSpacing: u(-7), color: onDark } }, doc.version),
        doc.tagline ? h(Text, { style: { fontSize: u(28), opacity: 0.85, marginTop: u(10), color: onDark } }, doc.tagline) : null
      ),
      h(ArtSlot, { image: doc.hero, theme, resolveImageSource: ctx.resolveImageSource, borderRadius: theme.radius.hero, style: { position: 'relative', flex: 1, minHeight: u(300), boxShadow: theme.shadow.hero } }),
      h(
        View,
        { style: { gap: u(16) } },
        ...entries.map((entry, i) =>
          h(
            View,
            { key: i, style: { flexDirection: 'row', gap: u(16), alignItems: 'flex-start' } },
            h(
              Text,
              {
                style: {
                  fontFamily: theme.fonts.display,
                  fontWeight: '800',
                  fontSize: u(24),
                  lineHeight: u(24),
                  paddingVertical: u(10),
                  paddingHorizontal: u(12),
                  borderRadius: u(12),
                  backgroundColor: 'rgba(255,255,255,.16)',
                  minWidth: u(52),
                  textAlign: 'center',
                  color: onDark
                }
              },
              String(i + 1).padStart(2, '0')
            ),
            h(
              View,
              { style: { flex: 1, minWidth: 0, gap: u(6) } },
              h(
                View,
                { style: { flexDirection: 'row', alignItems: 'center', gap: u(12), flexWrap: 'wrap' } },
                h(Badge, { entry, theme, u, fontSize: 17, paddingVertical: 6, paddingHorizontal: 13 }),
                entry.title
                  ? h(RichText, { value: entry.title, style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(34), lineHeight: u(34) * 1.1, color: onDark } })
                  : null
              ),
              entry.body ? h(RichText, { value: entry.body, style: { fontSize: u(24), lineHeight: u(24) * 1.3, opacity: 0.8, color: onDark } }) : null
            )
          )
        )
      ),
      doc.footer ? h(Text, { style: { fontSize: u(20), opacity: 0.6, color: onDark } }, doc.footer) : null
    );
  }
};

export default storyStack;
