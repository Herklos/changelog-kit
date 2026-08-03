import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { Canvas } from '../canvas.js';
import { RichText } from '../text.js';
import type { ReactElement } from 'react';
import type { Ctx, TemplateDef } from '../context.js';

/**
 * Swiss typographic poster: the version set as large as the canvas allows,
 * the changes as a tight index. No artwork, no chrome — type carries it.
 */
export const megaType: TemplateDef = {
  id: 'mega-type',
  name: 'Mega type',
  description: 'Typographic poster — the version set huge, the changes as a tight index. No artwork needed.',
  aspect: [4, 5],
  maxEntries: 6,
  render(ctx: Ctx): ReactElement {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const entries = doc.entries.slice(0, 6);

    const top = h(
      View,
      { style: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: u(14), borderBottomWidth: u(3), borderBottomColor: theme.colors.ink } },
      h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(22), letterSpacing: u(3), textTransform: 'uppercase', color: theme.colors.inkMuted } }, doc.product),
      h(
        Text,
        { style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(22), letterSpacing: u(3), textTransform: 'uppercase', color: theme.colors.inkMuted } },
        doc.date || (doc.status === 'upcoming' ? 'Coming soon' : 'Out now')
      )
    );

    const typeBlock = h(
      View,
      { style: { flex: 1, justifyContent: 'center', minHeight: 0 } },
      h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(360), lineHeight: u(360) * 0.78, letterSpacing: u(-20), color: theme.colors.ink } }, doc.version),
      doc.tagline
        ? h(RichText, {
            value: doc.tagline,
            style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(46), lineHeight: u(46) * 1.05, letterSpacing: u(-1), color: theme.colors.primary, marginTop: u(18), maxWidth: u(780) }
          })
        : null
    );

    const index = h(
      View,
      { style: { gap: 0 } },
      ...entries.map((entry, i) =>
        h(
          View,
          { key: i, style: { flexDirection: 'row', alignItems: 'baseline', gap: u(14), paddingVertical: u(13), borderTopWidth: u(1), borderTopColor: theme.colors.inkMuted } },
          h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(20), color: theme.colors.primary, width: u(56) } }, String(i + 1).padStart(2, '0')),
          h(RichText, { value: entry.title ?? '', style: { flex: 1, fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(30), lineHeight: u(30) * 1.1, color: theme.colors.ink } }),
          h(Text, { style: { fontSize: u(17), letterSpacing: u(2), textTransform: 'uppercase', color: theme.colors.inkMuted } }, entry.badge ?? '')
        )
      )
    );

    return h(
      Canvas,
      { size: ctx.size, theme, style: { gap: u(18) } },
      top,
      typeBlock,
      index,
      doc.footer
        ? h(Text, { style: { fontSize: u(18), color: theme.colors.inkMuted, paddingTop: u(10), borderTopWidth: u(3), borderTopColor: theme.colors.ink } }, doc.footer)
        : null
    );
  }
};

export default megaType;
