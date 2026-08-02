import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { Canvas } from '../canvas.js';
import { Badge } from '../components.js';
import { ArtSlot } from '../image.js';
import { RichText } from '../text.js';

const NODE_COLOR_KEY = { update: 'update', bugfix: 'bugfix', improvement: 'improvement', soon: 'soon' };
const GUTTER = 32;

/**
 * Vertical rail: a connector line with a node per change. Reads as a journey,
 * which suits multi-part releases and roadmap posts.
 *
 * The original centered each node with `top:50%; transform:translateY(-50%)`
 * inside a variable-height row — RN transforms need fixed pixel offsets, not
 * percentages of an unmeasured height. Each node is a normal flex sibling in
 * a centered gutter column instead, which centers correctly without a
 * measured height and needs no transform at all.
 */
export const timelineRail = {
  id: 'timeline-rail',
  name: 'Timeline rail',
  description: 'Connector rail with a node per change — reads as a journey through the release.',
  aspect: [4, 5],
  maxEntries: 6,
  render(ctx) {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const entries = doc.entries.slice(0, 6);
    const inset = `${(50 / Math.max(entries.length, 1)).toFixed(2)}%`;

    const head = h(
      View,
      { style: { gap: u(14) } },
      h(
        View,
        { style: { flexDirection: 'row', alignItems: 'baseline', gap: u(16) } },
        h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(46), letterSpacing: u(-1), color: theme.colors.ink } }, doc.product),
        h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(104), lineHeight: u(104) * 0.9, letterSpacing: u(-4), color: theme.colors.primary } }, doc.version)
      ),
      doc.hero?.src
        ? h(ArtSlot, { image: doc.hero, theme, resolveImageSource: ctx.resolveImageSource, borderRadius: theme.radius.hero, style: { position: 'relative', height: u(280), boxShadow: theme.shadow.hero } })
        : null,
      doc.tagline ? h(Text, { style: { fontSize: u(26), color: theme.colors.inkMuted } }, doc.tagline) : null
    );

    const list = h(
      View,
      { style: { flex: 1, minHeight: 0, gap: u(16) } },
      h(View, { style: { position: 'absolute', left: u(15), top: inset, bottom: inset, width: u(2), backgroundColor: theme.colors.inkMuted, opacity: 0.35 } }),
      ...entries.map((entry, i) =>
        h(
          View,
          { key: i, style: { flexDirection: 'row', alignItems: 'center', gap: u(14), flex: 1, minHeight: 0 } },
          h(
            View,
            { style: { width: u(GUTTER), alignItems: 'center' } },
            h(View, {
              style: {
                width: u(16),
                height: u(16),
                borderRadius: 99,
                backgroundColor: theme.colors.badge[NODE_COLOR_KEY[entry.kind]] ?? theme.colors.primary,
                boxShadow: `0 0 0 ${u(6)}px ${theme.colors.canvas}`
              }
            })
          ),
          h(
            View,
            { style: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: theme.radius.card, boxShadow: theme.shadow.card, paddingVertical: u(20), paddingHorizontal: u(24), gap: u(6), justifyContent: 'center' } },
            h(
              View,
              { style: { flexDirection: 'row', alignItems: 'center', gap: u(12), flexWrap: 'wrap' } },
              h(Badge, { entry, theme, u, fontSize: 16, paddingVertical: 5, paddingHorizontal: 13 }),
              entry.title
                ? h(RichText, { value: entry.title, style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(30), lineHeight: u(30) * 1.12, color: theme.colors.ink } })
                : null
            ),
            entry.body ? h(RichText, { value: entry.body, style: { fontSize: u(22), lineHeight: u(22) * 1.32, color: theme.colors.inkMuted } }) : null
          )
        )
      )
    );

    return h(Canvas, { size: ctx.size, theme, style: { gap: u(22) } }, head, list, doc.footer ? h(Text, { style: { fontSize: u(18), color: theme.colors.inkMuted } }, doc.footer) : null);
  }
};

export default timelineRail;
