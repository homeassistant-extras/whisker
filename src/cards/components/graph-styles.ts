import { css } from 'lit';

/** Shared styles for the graph components (pet weight, pet visits). */
export const graphStyles = css`
  :host {
    display: block;
  }

  /**
   * The wrapped HA graph card renders asynchronously, so it can have zero
   * height when ha-expansion-panel measures scrollHeight for its open
   * animation. A 0px -> 0px height "transition" never fires transitionend —
   * the only thing that unlocks the panel's container to height: auto — and
   * the chart then spills out of a zero-height container. A nonzero
   * min-height guarantees the transition always runs.
   */
  .graph {
    min-height: 48px;
  }

  /**
   * Flatten the embedded graph card. These ha-card custom properties inherit
   * through the card's shadow DOM into its internal <ha-card>.
   */
  .graph hui-history-graph-card,
  .graph hui-statistics-graph-card {
    --ha-card-background: transparent;
    --ha-card-box-shadow: none;
    --ha-card-border-width: 0;
    --ha-card-border-radius: 0;
  }
`;
