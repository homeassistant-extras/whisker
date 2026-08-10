/** Bottom-up proportional fill geometry for the SVG level zones. */

/** Vertical extent of a zone in viewBox units. */
export interface ZoneBounds {
  /** Y coordinate of the zone's top edge. */
  top: number;
  /** Zone height, top edge to bottom edge. */
  height: number;
}

/** Clip rectangle covering the filled portion of a zone. */
export interface ClipRect {
  y: number;
  height: number;
}

/**
 * Clip rect covering the bottom `level`% of a zone, so fills rise from the
 * bottom as the level climbs. Level is clamped to 0–100: 0 yields a zero-height
 * rect (nothing painted), 100 the full bounds.
 */
export function fillClipRect(level: number, bounds: ZoneBounds): ClipRect {
  const fraction = Math.min(100, Math.max(0, level)) / 100;
  const height = bounds.height * fraction;
  return { y: bounds.top + bounds.height - height, height };
}
