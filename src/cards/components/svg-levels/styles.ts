import { css } from 'lit';

export const svgLevelsStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    padding: var(--whisker-svg-levels-padding, 8px 16% 12px);
  }

  .wrap {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }

  .graphic {
    width: 100%;
    height: auto;
    display: block;
    max-height: min(320px, 55vh);
  }

  /*
   * Each shell is outlined in the opposite tone so the silhouette keeps its
   * edge: the white shell takes a dark outline, the black shell a light one.
   * On a dark theme the near-black shell would otherwise vanish into the card.
   */
  .body {
    pointer-events: none;
    stroke-width: 0.35;
    paint-order: stroke fill;
  }

  /* Matches config color: black artwork. */
  .body.body-black {
    fill: #1a1a1a;
    stroke: #f5f5f5;
  }

  /* Matches config color: white artwork. */
  .body.body-white {
    fill: #f5f5f5;
    stroke: #1a1a1a;
  }

  /*
   * Zone fills must live in CSS — SVG presentation attributes do not reliably
   * resolve CSS variables, which left the litter/waste holes blank in HA.
   *
   * Critical uses a dedicated vivid red rather than theme --error-color, which
   * reads as maroon on dark dashboards (#68). Themes can override
   * --whisker-level-error.
   */
  .zone {
    fill: var(--success-color, #4caf50);
    cursor: pointer;
    pointer-events: auto;
    transition: fill 0.25s ease;
  }

  /*
   * The unfilled remainder of each vessel, drawn under the clipped fill so a
   * part-full zone still reads as a container rather than a floating sliver.
   * Tinted from the surrounding text color so it works on light and dark.
   * fill-opacity (not opacity) keeps the glass rim stroke visible.
   */
  .zone-empty {
    fill: var(--secondary-text-color, #727272);
    fill-opacity: 0.25;
    stroke-width: 0.8;
    vector-effect: non-scaling-stroke;
    cursor: pointer;
    pointer-events: auto;
  }

  .body-black ~ .zone-empty {
    stroke: rgba(255, 255, 255, 0.4);
  }

  .body-white ~ .zone-empty {
    stroke: rgba(0, 0, 0, 0.22);
  }

  .zone.zone-warn {
    fill: var(--warning-color, #ff9800);
  }

  .zone.zone-error {
    fill: var(--whisker-level-error, #ff5252);
  }

  /*
   * Glass overlays (Andy Sensor Card tank sheen): a left-edge highlight plus a
   * diagonal band, clipped to the zone path. pointer-events stay off so taps
   * still hit the fill/empty paths underneath.
   */
  .zone-glass,
  .zone-glass-band {
    pointer-events: none;
  }

  /* the hidden attribute is not honored on SVG elements by default */
  .zone[hidden],
  .zone-empty[hidden],
  .zone-glass[hidden],
  .zone-glass-band[hidden] {
    display: none;
  }

  .label-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    color: var(--secondary-text-color);
  }

  .label-row .pct {
    font-weight: 600;
    color: var(--primary-text-color);
  }
`;
