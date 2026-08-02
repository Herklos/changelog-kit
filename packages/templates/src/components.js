import { View, Text } from '@changelog-kit/templates/rn';
import { h } from './h.js';
import { RichText } from './text.js';
import { ArtSlot } from './image.js';

/**
 * Badge pill, colored by entry kind through brand tokens. Mirrors the HTML
 * `badge()`; `fontSize`/padding are overridable the way `whats-new-sheet`'s
 * CSS overrode `.badge` for its smaller icon-row badges.
 */
export function Badge({ entry, theme, u, fontSize = 19, paddingVertical = 7, paddingHorizontal = 16 }) {
  if (!entry.badge) return null;
  return h(
    View,
    {
      style: {
        alignSelf: 'flex-start',
        backgroundColor: theme.colors.badge[entry.kind],
        borderRadius: theme.radius.badge,
        paddingVertical: u(paddingVertical),
        paddingHorizontal: u(paddingHorizontal)
      }
    },
    h(
      Text,
      {
        style: {
          fontFamily: theme.fonts.display,
          fontWeight: '700',
          fontSize: u(fontSize),
          lineHeight: u(fontSize),
          letterSpacing: u(0.6),
          color: theme.colors.badgeInk[entry.kind]
        }
      },
      entry.badge
    )
  );
}

/**
 * Feature card: badge + title + body on one side, art on the other.
 * Mirrors the HTML `card()` + `cardCss`.
 * @param {{entry: object, theme: object, u: Function, dark?: boolean, align?: 'left'|'right'|'center', artRatio?: number, resolveImageSource?: Function}} props
 */
export function Card({ entry, theme, u, dark = false, align = 'left', artRatio = 0.42, resolveImageSource }) {
  const isDark = dark || !!entry.dark;
  const center = align === 'center';
  const textColor = isDark ? theme.colors.onDark : theme.colors.ink;
  const bodyColor = isDark ? textColor : theme.colors.inkMuted;

  const art = entry.image
    ? h(ArtSlot, {
        image: entry.image,
        theme,
        resolveImageSource,
        borderRadius: theme.radius.image,
        // `ArtSlot` defaults to an absolute fill of a `position:'relative'`
        // parent (a full-bleed background layer) — here it's a normal flex
        // sibling instead, so `position:'relative'` overrides that default
        // (the inherited `top/left/right/bottom:0` are then no-op offsets).
        style: center
          ? { position: 'relative', width: '100%', flexGrow: 1, flexShrink: 1, minHeight: u(120) }
          : { position: 'relative', flexGrow: 0, flexShrink: 0, flexBasis: `${Math.round(artRatio * 100)}%`, alignSelf: 'stretch', minHeight: u(120) }
      })
    : null;

  const text = h(
    View,
    { style: { flexGrow: 1, flexShrink: 1, minWidth: 0, gap: u(10), alignItems: center ? 'center' : 'flex-start' } },
    h(Badge, { entry, theme, u }),
    entry.title
      ? h(RichText, {
          value: entry.title,
          style: {
            fontFamily: theme.fonts.display,
            fontWeight: '700',
            fontSize: u(34),
            lineHeight: u(34) * 1.12,
            letterSpacing: u(-0.4),
            color: textColor,
            textAlign: center ? 'center' : 'left'
          }
        })
      : null,
    entry.body
      ? h(RichText, {
          value: entry.body,
          style: {
            fontSize: u(24),
            lineHeight: u(24) * 1.32,
            color: bodyColor,
            textAlign: center ? 'center' : 'left'
          }
        })
      : null
  );

  const order = align === 'right' ? [art, text] : [text, art];

  return h(
    View,
    {
      style: {
        flexDirection: center ? 'column' : 'row',
        alignItems: center ? 'center' : 'flex-start',
        gap: u(14),
        backgroundColor: isDark ? theme.colors.surfaceAlt : theme.colors.surface,
        borderRadius: theme.radius.card,
        padding: u(26),
        boxShadow: theme.shadow.card,
        overflow: 'hidden'
      }
    },
    ...order
  );
}

/**
 * Version wordmark used inside hero panels. Mirrors the HTML `versionMark()`.
 * @param {{doc: object, theme: object, u: Function, size?: number, label?: string}} props
 */
export function VersionMark({ doc, theme, u, size = 260, label = '' }) {
  const onDark = theme.colors.onDark;
  return h(
    View,
    { style: { alignItems: 'center', gap: u(6) } },
    doc.product
      ? h(Text, { style: { fontFamily: theme.fonts.display, fontWeight: '700', fontSize: u(54), letterSpacing: u(-1), color: onDark, textAlign: 'center' } }, doc.product)
      : null,
    label
      ? h(
          Text,
          {
            style: {
              fontFamily: theme.fonts.display,
              fontWeight: '800',
              fontSize: u(40),
              letterSpacing: u(3),
              textTransform: 'uppercase',
              opacity: 0.9,
              color: onDark,
              textAlign: 'center'
            }
          },
          label
        )
      : null,
    h(
      Text,
      {
        style: {
          fontFamily: theme.fonts.display,
          fontWeight: '800',
          fontSize: u(size),
          lineHeight: u(size) * 0.9,
          letterSpacing: u(-8),
          color: onDark,
          textAlign: 'center',
          textShadowColor: 'rgba(0,0,0,0.28)',
          textShadowOffset: { width: 0, height: u(14) },
          textShadowRadius: u(40)
        }
      },
      doc.version
    ),
    doc.tagline
      ? h(Text, { style: { fontSize: u(30), fontWeight: '500', opacity: 0.95, color: onDark, textAlign: 'center' } }, doc.tagline)
      : null
  );
}
