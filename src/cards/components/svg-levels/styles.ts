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

  .body {
    pointer-events: none;
  }

  /* Matches config color: black artwork. */
  .body.body-black {
    fill: #1a1a1a;
    stroke: none;
  }

  /* Matches config color: white artwork — light shell with dark outline. */
  .body.body-white {
    fill: #f5f5f5;
    stroke: #1a1a1a;
    stroke-width: 0.35;
    paint-order: stroke fill;
  }

  /*
   * Zone fills must live in CSS — SVG presentation attributes do not reliably
   * resolve CSS variables, which left the litter/waste holes blank in HA.
   */
  .zone {
    fill: var(--success-color, #4caf50);
    cursor: pointer;
    pointer-events: auto;
    transition: fill 0.25s ease;
  }

  .zone.zone-warn {
    fill: var(--warning-color, #ff9800);
  }

  .zone.zone-error {
    fill: var(--error-color, #f44336);
  }

  /* the hidden attribute is not honored on SVG elements by default */
  .zone[hidden] {
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
