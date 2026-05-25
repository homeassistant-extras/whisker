import { css } from 'lit';

export const statusPanelStyles = css`
  :host {
    display: block;
  }

  .panel {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
`;

export const statusPanelItemStyles = css`
  :host {
    display: inline-block;
  }

  hui-state-icon-element {
    display: inline-flex;
    cursor: pointer;
    border: 1px solid var(--divider-color);
    border-radius: 50%;
  }

  /**
   * Spin the vacuum icon while cycling; play-state is set on ha-card in card styles
   * and inherits through shadow boundaries.
   */
  :host([item-type='vacuum']) hui-state-icon-element {
    animation: whisker-status-icon-spin 4s linear infinite;
    animation-play-state: var(--whisker-cycling-play-state, paused);
    transform-origin: center center;
  }

  @keyframes whisker-status-icon-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :host([item-type='vacuum']) hui-state-icon-element {
      animation: none;
    }
  }
`;
