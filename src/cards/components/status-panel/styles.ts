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

  .item {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-family: inherit;
    line-height: 0;
    cursor: pointer;
    color: var(--primary-text-color);
    background: color-mix(
      in srgb,
      var(--card-background-color, #fff) 88%,
      transparent
    );
    border: 1px solid var(--divider-color);
    border-radius: 50%;
    box-shadow: 0 1px 3px rgb(0 0 0 / 12%);
  }

  .item hui-state-icon-element {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    --mdc-icon-size: 22px;
  }

  /**
   * Spin the vacuum (cycle) icon while the parent whisker-card has reflected cycling.
   */
  :host-context(whisker-card[cycling]):host([item-type='vacuum'])
    .item
    hui-state-icon-element {
    animation: whisker-status-icon-spin 1.1s linear infinite;
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
    :host-context(whisker-card[cycling]):host([item-type='vacuum'])
      .item
      hui-state-icon-element {
      animation: none;
    }
  }
`;
