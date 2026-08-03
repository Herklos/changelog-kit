/**
 * Only reachable under plain Node — see rn.web.ts. react-native-svg's own
 * web build still eagerly requires Fabric native-component modules deep in
 * its shared `elements.js` (verified: `Circle.js` -> `fabric/CircleNativeComponent.js`
 * -> `react-native/Libraries/Utilities/codegenNativeComponent`, which does not
 * exist outside a real RN/Metro runtime), so it cannot be loaded under bare
 * Node no matter which entry file is required. Bypass it entirely: on the
 * web/SSR path there is no reason to go through react-native-svg at all —
 * `react-dom/server` renders lowercase SVG tags natively, and DOM SVG accepts
 * the same camelCase attribute names (`stopColor`, `strokeDasharray`, ...)
 * this package's `gradients.ts` and SVG-dependent layouts already use.
 *
 * Typed as plain `string` (not the literal `'svg'` etc. `const` would infer)
 * so `h(Svg, ...)` goes through `h`'s loose-props overload rather than
 * React's strict `JSX.IntrinsicElements['svg']` typing.
 */
export const Svg: string = 'svg';
export const Path: string = 'path';
export const Defs: string = 'defs';
export const LinearGradient: string = 'linearGradient';
export const RadialGradient: string = 'radialGradient';
export const Stop: string = 'stop';
export const Rect: string = 'rect';
export const ClipPath: string = 'clipPath';
export const Polygon: string = 'polygon';
export const Line: string = 'line';
export const G: string = 'g';
export const SvgText: string = 'text';
export const SvgImage: string = 'image';
