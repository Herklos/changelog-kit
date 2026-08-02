import { h } from '../h.js';
import { View, Text } from '@changelog-kit/templates/rn';
import { Svg, Defs, ClipPath, Polygon, Rect, SvgImage, LinearGradient as SvgLinearGradient, Stop } from '@changelog-kit/templates/svg';
import { themeFromContext } from '../theme.js';
import { Badge } from '../components.js';
import { angleToLine, nextId, LinearFill } from '../gradients.js';
import { RichText } from '../text.js';

/**
 * Hard diagonal between artwork and copy. The angle does the work — no cards,
 * no shadows, just one confident cut across the canvas.
 *
 * `clip-path: polygon()` has no RN style-prop equivalent on native (unlike
 * `filter`/`mixBlendMode` — see `duotone-cover.js`), so this is the one
 * layout that genuinely needs `react-native-svg`'s `<ClipPath>`: the art and
 * the veil are drawn as SVG layers sharing one clip, in canvas-pixel
 * coordinates so the shape is exact regardless of resolution.
 */
export const splitDiagonal = {
  id: 'split-diagonal',
  name: 'Split diagonal',
  description: 'A single diagonal cut: full-bleed artwork on one side, version and features on the other.',
  aspect: [4, 5],
  maxEntries: 4,
  render(ctx) {
    const { doc, size } = ctx;
    const { u, theme } = themeFromContext(ctx);
    const entries = doc.entries.slice(0, 4);
    const onDark = theme.colors.onDark;
    const image = doc.hero ?? entries[0]?.image;
    const { width: w, height: h_ } = size;
    const points = `${0.42 * w},0 ${w},0 ${w},${h_} ${0.04 * w},${h_}`;
    const veilLine = angleToLine(200);
    const clipId = nextId('diag-clip');
    const veilId = nextId('diag-veil');

    const clipLayer = h(
      Svg,
      { width: '100%', height: '100%', viewBox: `0 0 ${w} ${h_}`, style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } },
      h(
        Defs,
        null,
        h(ClipPath, { id: clipId }, h(Polygon, { points })),
        h(
          SvgLinearGradient,
          { id: veilId, x1: veilLine.x1, y1: veilLine.y1, x2: veilLine.x2, y2: veilLine.y2 },
          h(Stop, { offset: '0%', stopColor: 'rgba(0,0,0,.15)' }),
          h(Stop, { offset: '78%', stopColor: 'rgba(0,0,0,.72)' })
        )
      ),
      image?.src
        ? h(SvgImage, { href: image.src, x: 0, y: 0, width: w, height: h_, preserveAspectRatio: 'xMidYMid slice', clipPath: `url(#${clipId})` })
        : h(Rect, { x: 0, y: 0, width: w, height: h_, fill: theme.colors.heroFrom, clipPath: `url(#${clipId})` }),
      h(Rect, { x: 0, y: 0, width: w, height: h_, fill: `url(#${veilId})`, clipPath: `url(#${clipId})` })
    );

    return h(
      View,
      { style: { position: 'relative', width: w, height: h_, overflow: 'hidden', backgroundColor: theme.colors.heroTo } },
      h(
        View,
        { style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } },
        // An angled brand gradient sits beneath the clipped art/veil so the
        // copy side (never clipped) still reads the two-stop brand gradient.
        h(LinearFill, { colors: [theme.colors.heroFrom, theme.colors.heroTo], angle: 200 })
      ),
      clipLayer,
      h(
        View,
        { style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: theme.spacing.outer, gap: u(20) } },
        h(
          View,
          { style: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } },
          h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(24), letterSpacing: u(2), textTransform: 'uppercase', color: onDark } }, doc.product),
          h(
            Text,
            { style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(24), letterSpacing: u(2), textTransform: 'uppercase', color: onDark, opacity: 0.7 } },
            doc.date || (doc.status === 'upcoming' ? 'Coming soon' : 'Out now')
          )
        ),
        h(
          View,
          { style: { gap: u(4), marginTop: 'auto' } },
          h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '800', fontSize: u(210), lineHeight: u(210) * 0.84, letterSpacing: u(-10), color: onDark } }, doc.version),
          doc.tagline
            ? h(Text, { style: { fontSize: u(30), fontWeight: '500', opacity: 0.9, maxWidth: u(520), color: onDark } }, doc.tagline)
            : null
        ),
        h(
          View,
          { style: { gap: u(14), marginTop: u(10) } },
          ...entries.map((entry, i) =>
            h(
              View,
              {
                key: i,
                style: {
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: u(14),
                  backgroundColor: 'rgba(255,255,255,.1)',
                  borderWidth: u(1),
                  borderColor: 'rgba(255,255,255,.16)',
                  borderRadius: theme.radius.card,
                  paddingVertical: u(16),
                  paddingHorizontal: u(20)
                }
              },
              h(Badge, { entry, theme, u, fontSize: 16, paddingVertical: 6, paddingHorizontal: 14 }),
              h(
                View,
                { style: { flex: 1, minWidth: 0, gap: u(2) } },
                entry.title
                  ? h(RichText, { value: entry.title, style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(28), lineHeight: u(28) * 1.12, color: onDark } })
                  : null,
                entry.body ? h(RichText, { value: entry.body, style: { fontSize: u(20), opacity: 0.78, color: onDark } }) : null
              )
            )
          )
        ),
        doc.footer ? h(Text, { style: { fontSize: u(18), opacity: 0.6, color: onDark } }, doc.footer) : null
      )
    );
  }
};

export default splitDiagonal;
