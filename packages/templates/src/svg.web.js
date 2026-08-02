/**
 * Only reachable under plain Node — see rn.web.js. react-native-svg's own
 * web build still eagerly requires Fabric native-component modules deep in
 * its shared `elements.js` (verified: `Circle.js` -> `fabric/CircleNativeComponent.js`
 * -> `react-native/Libraries/Utilities/codegenNativeComponent`, which does not
 * exist outside a real RN/Metro runtime), so it cannot be loaded under bare
 * Node no matter which entry file is required. Bypass it entirely: on the
 * web/SSR path there is no reason to go through react-native-svg at all —
 * `react-dom/server` renders lowercase SVG tags natively, and DOM SVG accepts
 * the same camelCase attribute names (`stopColor`, `strokeDasharray`, ...)
 * this package's `gradients.js` and SVG-dependent layouts already use.
 */
export const Svg = 'svg';
export const Path = 'path';
export const Defs = 'defs';
export const LinearGradient = 'linearGradient';
export const RadialGradient = 'radialGradient';
export const Stop = 'stop';
export const Rect = 'rect';
export const ClipPath = 'clipPath';
export const Polygon = 'polygon';
export const Line = 'line';
export const G = 'g';
export const SvgText = 'text';
export const SvgImage = 'image';
