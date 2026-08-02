import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { themeFromContext } from '../theme.js';
import { Canvas } from '../canvas.js';
import { Badge } from '../components.js';
import { LinearFill } from '../gradients.js';
import { RichText } from '../text.js';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

/**
 * The release as a ticket: perforated stub, monospace serials, features as
 * printed rows. Collectible feel for milestone versions.
 */
export const ticketStub = {
  id: 'ticket-stub',
  name: 'Ticket stub',
  description: 'The release as a printed ticket — perforated stub, serials and feature rows.',
  aspect: [1, 1],
  maxEntries: 4,
  render(ctx) {
    const { doc } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const entries = doc.entries.slice(0, 4);
    const onDark = theme.colors.onDark;
    const serial = [
      (doc.product || 'REL').slice(0, 3).toUpperCase(),
      doc.version.replace(/[^0-9a-z]/gi, '').toUpperCase(),
      (doc.date || '').replace(/\D/g, '').slice(0, 8)
    ]
      .filter(Boolean)
      .join('-');

    const perforation = h(
      View,
      { style: { width: u(2), alignItems: 'center', justifyContent: 'space-evenly' } },
      // `repeating-linear-gradient` (the dashed line) has no RN prop equivalent
      // — a fixed run of small dashes reads the same and needs no SVG.
      ...Array.from({ length: 14 }, (_, i) => h(View, { key: i, style: { width: u(2), height: u(10), backgroundColor: theme.colors.inkMuted } }))
    );

    const notch = (edge) =>
      h(View, {
        style: {
          position: 'absolute',
          left: 0,
          right: 0,
          [edge]: -u(22),
          alignItems: 'center'
        }
      }, h(View, { style: { width: u(44), height: u(44), borderRadius: 99, backgroundColor: theme.colors.canvas } }));

    return h(
      Canvas,
      { size: ctx.size, theme, style: { gap: u(18) } },
      h(
        View,
        { style: { flex: 1, minHeight: 0, flexDirection: 'row', overflow: 'hidden', backgroundColor: theme.colors.surface, borderRadius: theme.radius.hero, boxShadow: theme.shadow.hero } },
        h(
          View,
          { style: { flex: 1, minWidth: 0, gap: u(20), padding: u(38) } },
          h(
            View,
            { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } },
            h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '700', letterSpacing: u(1), color: theme.colors.ink } }, doc.product),
            h(Text, { style: { fontFamily: MONO, fontSize: u(19), letterSpacing: u(2), textTransform: 'uppercase', color: theme.colors.inkMuted } }, serial)
          ),
          h(
            View,
            { style: { gap: u(2), marginVertical: 'auto' } },
            h(Text, { style: { fontSize: u(20), letterSpacing: u(4), textTransform: 'uppercase', color: theme.colors.inkMuted } }, 'Release'),
            h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(140), lineHeight: u(140) * 0.88, letterSpacing: u(-6), color: theme.colors.ink } }, doc.version),
            doc.tagline ? h(Text, { style: { fontSize: u(24), color: theme.colors.inkMuted, marginTop: u(8) } }, doc.tagline) : null
          ),
          h(
            View,
            { style: { gap: u(10) } },
            ...entries.map((entry, i) =>
              h(
                View,
                { key: i, style: { flexDirection: 'row', alignItems: 'baseline', gap: u(12), flexWrap: 'wrap', paddingTop: u(12), borderTopWidth: u(1), borderTopColor: theme.colors.inkMuted, borderStyle: 'dashed' } },
                h(Badge, { entry, theme, u, fontSize: 14, paddingVertical: 5, paddingHorizontal: 11 }),
                entry.title ? h(RichText, { value: entry.title, style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(24), color: theme.colors.ink } }) : null,
                entry.body ? h(RichText, { value: entry.body, style: { fontSize: u(20), color: theme.colors.inkMuted } }) : null
              )
            )
          )
        ),
        h(View, { style: { position: 'relative' } }, perforation, notch('top'), notch('bottom')),
        h(
          View,
          { style: { flexGrow: 0, flexShrink: 0, flexBasis: u(190), position: 'relative', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', gap: u(14) } },
          h(LinearFill, { colors: [theme.colors.heroFrom, theme.colors.heroTo], angle: 200 }),
          // CSS `writing-mode: vertical-rl` + `rotate(180deg)` (sideways,
          // top-to-bottom reading) — a plain rotated `<Text>` reads the same.
          h(
            Text,
            { style: { fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(76), letterSpacing: u(-2), color: onDark, transform: [{ rotate: '-90deg' }] } },
            doc.version
          ),
          h(
            Text,
            { style: { fontFamily: MONO, fontSize: u(17), letterSpacing: u(3), textTransform: 'uppercase', opacity: 0.8, color: onDark, transform: [{ rotate: '-90deg' }] } },
            doc.date || 'admit one'
          )
        )
      ),
      doc.footer ? h(Text, { style: { fontSize: u(18), color: theme.colors.inkMuted, textAlign: 'center' } }, doc.footer) : null
    );
  }
};

export default ticketStub;
