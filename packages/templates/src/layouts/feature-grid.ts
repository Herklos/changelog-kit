import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { Canvas } from '../canvas.js';
import { Card } from '../components.js';
import type { ReactElement } from 'react';
import type { Ctx, TemplateDef } from '../context.js';

/**
 * Header + wrapping grid of feature cards. No hero — scales from 2 to 8
 * entries and to any aspect ratio, so it is the safe default for odd sizes.
 */
export const featureGrid: TemplateDef = {
  id: 'feature-grid',
  name: 'Feature grid',
  description: 'Version header with a responsive grid of feature cards. No artwork required.',
  aspect: [4, 5],
  maxEntries: 8,
  render(ctx: Ctx): ReactElement {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const entries = doc.entries.slice(0, 8);

    const header = h(
      View,
      { style: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: u(20), paddingBottom: u(24) } },
      h(
        View,
        { style: { flexDirection: 'row', alignItems: 'baseline', gap: u(16) } },
        doc.product
          ? h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(46), color: theme.colors.ink } }, doc.product)
          : null,
        h(
          Text,
          { style: { fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(92), lineHeight: u(92) * 0.9, letterSpacing: u(-3), color: theme.colors.primary } },
          doc.version
        )
      ),
      h(
        View,
        { style: { alignItems: 'flex-end', gap: u(4) } },
        doc.tagline ? h(Text, { style: { color: theme.colors.inkMuted, fontSize: u(24) } }, doc.tagline) : null,
        doc.date ? h(Text, { style: { color: theme.colors.inkMuted, fontSize: u(24) } }, doc.date) : null
      )
    );

    // CSS Grid's `1fr 1fr` correctly subtracts the gap from each track;
    // flex-wrap with a percentage basis doesn't, so a full row can overrun
    // its container by one gap's width — a few px, silently clipped by
    // Canvas's overflow:hidden. Accepted per the native-port fidelity bar.
    const grid = h(
      View,
      { style: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.gap, alignContent: 'flex-start' } },
      ...entries.map((entry, i) =>
        h(
          View,
          { key: i, style: { flexBasis: entry.span && entry.span > 1 ? '100%' : '50%', flexGrow: 0, flexShrink: 0 } },
          h(Card, { entry, theme, u, dark: entry.dark, resolveImageSource: ctx.resolveImageSource })
        )
      )
    );

    return h(Canvas, { size: ctx.size, theme }, header, grid);
  }
};

export default featureGrid;
