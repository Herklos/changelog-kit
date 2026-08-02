import { Svg, Defs, LinearGradient as SvgLinearGradient, RadialGradient as SvgRadialGradient, Stop, Rect } from '@changelog-kit/templates/svg';
import { h } from './h.js';

let gid = 0;
/** Exported so layouts building raw SVG defs (e.g. `split-diagonal`'s clip/veil) avoid id collisions when two templates render in the same document. */
export const nextId = (prefix) => `${prefix}-${gid++}`;

const FILL_STYLE = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 };

/**
 * `Svg`/`Rect` are raw DOM tags on the web path (see `svg.web.js`) — DOM's
 * `style` prop must be a plain object, unlike RN/react-native-web's `View`
 * which also accepts style arrays. Always flatten here so this file stays
 * shared between both backends.
 */
function fillStyle(style) {
  return { ...FILL_STYLE, ...style };
}

/**
 * Each entry is either a plain color (evenly spaced, like CSS's implicit
 * stop positions) or `{color, offset}` for an explicit stop — e.g.
 * `linear-gradient(190deg, heroFrom 0%, heroTo 74%)`'s non-even split.
 */
function stops(colors) {
  return colors.map((c, i) => {
    const isStop = c && typeof c === 'object';
    const color = isStop ? c.color : c;
    const offset = isStop && c.offset != null ? c.offset : `${(i / Math.max(colors.length - 1, 1)) * 100}%`;
    return h(Stop, { key: i, offset, stopColor: color });
  });
}

/**
 * CSS gradient angle (0deg = up, clockwise) → an SVG gradient vector on the
 * unit square. Exported for layouts (e.g. `split-diagonal`) that need a
 * `<linearGradient>` inline rather than through `LinearFill`.
 */
export function angleToLine(angle) {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  return { x1: 0.5 - dx / 2, y1: 0.5 - dy / 2, x2: 0.5 + dx / 2, y2: 0.5 + dy / 2 };
}

/**
 * Absolutely-fills its parent with a CSS-style `linear-gradient(angle, ...colors)`.
 * There is no RN style equivalent to CSS gradients (`experimental_backgroundImage`
 * is unsupported under react-native-web) — every gradient in every layout goes
 * through this SVG fill instead, on both native and the web SSR path.
 */
export function LinearFill({ colors, angle = 135, style, borderRadius = 0 }) {
  const id = nextId('lg');
  const { x1, y1, x2, y2 } = angleToLine(angle);
  return h(
    Svg,
    { style: fillStyle(style), width: '100%', height: '100%' },
    h(Defs, null, h(SvgLinearGradient, { id, x1, y1, x2, y2 }, stops(colors))),
    h(Rect, { x: 0, y: 0, width: '100%', height: '100%', rx: borderRadius, fill: `url(#${id})` })
  );
}

/** Absolutely-fills its parent with a CSS-style `radial-gradient(circle, ...colors)`. */
export function RadialFill({ colors, cx = '50%', cy = '50%', r = '50%', style, borderRadius = 0 }) {
  const id = nextId('rg');
  return h(
    Svg,
    { style: fillStyle(style), width: '100%', height: '100%' },
    h(Defs, null, h(SvgRadialGradient, { id, cx, cy, r }, stops(colors))),
    h(Rect, { x: 0, y: 0, width: '100%', height: '100%', rx: borderRadius, fill: `url(#${id})` })
  );
}
