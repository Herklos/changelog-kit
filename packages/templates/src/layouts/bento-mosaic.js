import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { Canvas } from '../canvas.js';
import { Badge } from '../components.js';
import { ArtSlot } from '../image.js';
import { LinearFill } from '../gradients.js';
import { RichText } from '../text.js';

function Tile({ entry, theme, u, large = false, resolveImageSource }) {
  const onDark = theme.colors.onDark;
  const hasArt = !!entry.image;
  return h(
    View,
    {
      style: {
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'flex-end',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.card,
        boxShadow: theme.shadow.card,
        padding: large ? u(32) : u(26),
        gap: u(10),
        minHeight: 0
      }
    },
    hasArt ? h(ArtSlot, { image: entry.image, theme, resolveImageSource, style: { borderRadius: 0 } }) : null,
    hasArt
      ? h(LinearFill, {
          colors: [{ color: 'rgba(4,6,20,.9)', offset: '0%' }, { color: 'rgba(4,6,20,.62)', offset: '42%' }, { color: 'rgba(4,6,20,.2)', offset: '100%' }],
          angle: 0
        })
      : null,
    h(
      View,
      { style: { gap: u(9) } },
      h(Badge, { entry, theme, u }),
      entry.title
        ? h(RichText, {
            value: entry.title,
            style: {
              fontFamily: theme.fonts.display,
              fontWeight: '700',
              fontSize: large ? u(52) : u(30),
              lineHeight: (large ? u(52) : u(30)) * 1.14,
              letterSpacing: large ? u(-1.4) : u(-0.4),
              maxWidth: large ? u(620) : u(460),
              color: hasArt ? onDark : theme.colors.ink
            }
          })
        : null,
      entry.body
        ? h(RichText, {
            value: entry.body,
            style: { fontSize: large ? u(26) : u(21), lineHeight: (large ? u(26) : u(21)) * 1.3, maxWidth: large ? u(620) : u(420), color: hasArt ? 'rgba(255,255,255,.82)' : theme.colors.inkMuted }
          })
        : null
    )
  );
}

/**
 * Asymmetric bento: one tall lead tile with artwork, a wide version tile and
 * a run of small tiles. The most "designed" of the grid layouts.
 *
 * The original CSS used a 6-column grid with explicit `span` per tile —
 * exact for a fixed entry count, but CSS Grid auto-placement has no RN
 * equivalent. This ports the visual intent (a tall lead+version row, then a
 * wide tile, then paired small tiles) as nested flex rows with `flexGrow`
 * ratios standing in for column/row spans — it adapts to any entry count
 * instead of replicating the exact 6-track math.
 */
export const bentoMosaic = {
  id: 'bento-mosaic',
  name: 'Bento mosaic',
  description: 'Asymmetric bento grid — a tall lead feature, a version tile and small supporting tiles.',
  aspect: [4, 5],
  maxEntries: 5,
  render(ctx) {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const [lead, ...rest] = doc.entries;
    const small = rest.slice(0, 4);
    const onDark = theme.colors.onDark;

    const versionTile = h(
      View,
      { style: { flexGrow: 2, minHeight: 0, justifyContent: 'center', alignItems: 'flex-start', gap: u(2), padding: u(26), borderRadius: theme.radius.card, overflow: 'hidden' } },
      h(LinearFill, { colors: [theme.colors.heroFrom, theme.colors.heroTo], angle: 150 }),
      h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '600', fontSize: u(30), opacity: 0.85, color: onDark } }, doc.product),
      h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(140), lineHeight: u(140) * 0.88, letterSpacing: u(-6), color: onDark } }, doc.version),
      doc.tagline ? h(Text, { style: { fontSize: u(21), opacity: 0.85, marginTop: u(8), color: onDark } }, doc.tagline) : null
    );

    const rows = [
      h(
        View,
        { key: 'lead-row', style: { flexGrow: 3, minHeight: 0, flexDirection: 'row', gap: theme.spacing.gap } },
        h(View, { style: { flexGrow: 4, minHeight: 0 } }, h(Tile, { entry: lead, theme, u, large: true, resolveImageSource: ctx.resolveImageSource })),
        versionTile
      )
    ];

    if (small.length) {
      rows.push(h(View, { key: 'wide-row', style: { flexGrow: 2, minHeight: 0 } }, h(Tile, { entry: small[0], theme, u, resolveImageSource: ctx.resolveImageSource })));
      for (let i = 1; i < small.length; i += 2) {
        const pair = small.slice(i, i + 2);
        rows.push(
          h(
            View,
            { key: `pair-${i}`, style: { flexGrow: 2, minHeight: 0, flexDirection: 'row', gap: theme.spacing.gap } },
            ...pair.map((entry, j) => h(View, { key: j, style: { flexGrow: 1, minHeight: 0 } }, h(Tile, { entry, theme, u, resolveImageSource: ctx.resolveImageSource })))
          )
        );
      }
    }

    return h(Canvas, { size: ctx.size, theme }, ...rows);
  }
};

export default bentoMosaic;
