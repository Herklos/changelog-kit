/** All templates design against this width; everything else scales from it. */
export const DESIGN_WIDTH = 1080;

export interface Scale {
  unit: number;
  u: (n: number) => number;
}

/**
 * The scale-unit contract every layout is built on: one canvas-relative
 * number, `unit`, that every length is multiplied by. No CSS, no `calc()` —
 * `u(n)` just returns `n * unit`, a plain number RN style props accept.
 * @param width canvas width in the same units as size presets (design pixels)
 * @param baseWidth divisor for `unit`; default DESIGN_WIDTH (poster-faithful)
 */
export function createScale(width: number, baseWidth: number = DESIGN_WIDTH): Scale {
  const unit = width / baseWidth;
  return { unit, u: (n: number) => n * unit };
}
