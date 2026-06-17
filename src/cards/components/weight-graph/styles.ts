import { css } from 'lit';

export const weightGraphStyles = css`
  :host {
    display: block;
  }

  .weight-graph {
    margin-top: 8px;
  }

  /**
   * Flatten the embedded history-graph card. These ha-card custom properties
   * inherit through the card's shadow DOM into its internal <ha-card>.
   */
  .weight-graph hui-history-graph-card {
    --ha-card-background: transparent;
    --ha-card-box-shadow: none;
    --ha-card-border-width: 0;
    --ha-card-border-radius: 0;
  }
`;
