/** All templates design against this width; everything else scales from it. */
export const DESIGN_WIDTH = 1080;

/**
 * The scale-unit contract every layout is built on: one canvas-relative
 * number, `unit`, that every length is multiplied by. No CSS, no `calc()` —
 * `u(n)` just returns `n * unit`, a plain number RN style props accept.
 * @param {number} width canvas width in the same units as size presets (design pixels)
 * @param {number} [baseWidth] divisor for `unit`; default DESIGN_WIDTH (poster-faithful)
 * @returns {{unit: number, u: (n: number) => number}}
 */
export function createScale(width, baseWidth = DESIGN_WIDTH) {
  const unit = width / baseWidth;
  return { unit, u: (n) => n * unit };
}
