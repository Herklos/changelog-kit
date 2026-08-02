import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { Canvas } from '../canvas.js';
import { RichText } from '../text.js';

/** Pull the most quotable number out of an entry ("10× faster" → "10×"). */
function statOf(entry, index) {
  if (entry.stat) return String(entry.stat);
  const source = `${entry.title ?? ''} ${entry.body ?? ''}`;
  const match = source.match(/(\d+[\d.,]*\s*(?:×|x\b|%|k\b|\+)?)/i);
  return match ? match[1].replace(/\s+/g, '').replace(/x$/i, '×') : String(index + 1).padStart(2, '0');
}

const ACCENT_KEY = { update: 'update', bugfix: 'bugfix', improvement: 'improvement', soon: 'soon' };

/**
 * "By the numbers": the release as three or four oversized figures. Reads in
 * a scroll — the format for a launch-day square post.
 */
export const metricCards = {
  id: 'metric-cards',
  name: 'Metric cards',
  description: 'Release by the numbers — oversized figures pulled from each entry, with the claim underneath.',
  aspect: [1, 1],
  maxEntries: 4,
  render(ctx) {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const entries = doc.entries.slice(0, 4);

    const header = h(
      View,
      { style: { gap: u(6) } },
      h(
        View,
        { style: { flexDirection: 'row', alignItems: 'baseline', gap: u(14) } },
        doc.product ? h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(44), letterSpacing: u(-1), color: theme.colors.ink } }, doc.product) : null,
        h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(44), color: theme.colors.primary } }, doc.version)
      ),
      doc.tagline ? h(Text, { style: { fontSize: u(24), color: theme.colors.inkMuted } }, doc.tagline) : null
    );

    const grid = h(
      View,
      { style: { flex: 1, minHeight: 0, flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.gap } },
      ...entries.map((entry, i) =>
        h(
          View,
          { key: i, style: { flexBasis: '50%', flexGrow: 0, flexShrink: 0 } },
          h(
            View,
            {
              style: {
                position: 'relative',
                justifyContent: 'center',
                gap: u(6),
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.card,
                boxShadow: theme.shadow.card,
                padding: u(28),
                overflow: 'hidden',
                minHeight: u(180)
              }
            },
            h(View, { style: { position: 'absolute', left: 0, right: 0, bottom: 0, height: u(6), backgroundColor: theme.colors.badge[ACCENT_KEY[entry.kind]] ?? theme.colors.primary } }),
            h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(118), lineHeight: u(118) * 0.86, letterSpacing: u(-5), color: theme.colors.primary, marginBottom: u(6) } }, statOf(entry, i)),
            entry.title
              ? h(RichText, { value: entry.title, style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(30), lineHeight: u(30) * 1.12, color: theme.colors.ink } })
              : null,
            entry.body ? h(RichText, { value: entry.body, style: { fontSize: u(21), lineHeight: u(21) * 1.3, color: theme.colors.inkMuted } }) : null,
            entry.badge
              ? h(Text, { style: { position: 'absolute', top: u(24), right: u(24), fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(16), letterSpacing: u(1.4), color: theme.colors.inkMuted } }, entry.badge)
              : null
          )
        )
      )
    );

    return h(Canvas, { size: ctx.size, theme }, header, grid, doc.footer ? h(Text, { style: { fontSize: u(18), color: theme.colors.inkMuted } }, doc.footer) : null);
  }
};

export default metricCards;
