import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }

  .card-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 20px;
    border-bottom: 1px solid var(--divider-color);
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 500;
    margin: 0;
    padding: 0;
    flex: 1;
    min-width: 0;
  }

  .card-title-status {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .status-panel-row {
    position: relative;
    z-index: 2;
  }

  .status-panel-wrap {
    display: flex;
    justify-content: center;
    padding: 8px 12px 4px;
  }

  .robot-image-stack {
    position: relative;
    display: block;
  }

  .robot-image-stack img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    vertical-align: top;
  }

  /**
   * :host(:has()) only sees light-DOM descendants, not shadow content.
   * ha-card:has() matches within this shadow tree; the custom property
   * inherits into nested component shadows (e.g. status-panel vacuum spin).
   */
  ha-card {
    --whisker-cycling-play-state: paused;
  }

  /** While status_code is a running cycle (ccp / ec / cst) */
  ha-card:has(whisker-litter-status[cycling]) {
    --whisker-cycling-play-state: running;
    box-shadow:
      var(--ha-card-box-shadow, none),
      inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 35%, transparent);
  }

  ha-card:has(whisker-litter-status[cycling]) .robot-image-stack img {
    animation: whisker-cycle-glow 2.4s ease-in-out infinite;
    will-change: filter, transform;
  }

  /** While the configured needs-cleaning entity is active */
  ha-card:has(whisker-cleaning[needs-cleaning]) {
    background-image: linear-gradient(
      160deg,
      color-mix(in srgb, var(--warning-color, #ff9800) 14%, transparent) 0%,
      color-mix(in srgb, var(--warning-color, #ff9800) 4%, transparent) 45%,
      transparent 100%
    );
    box-shadow:
      var(--ha-card-box-shadow, none),
      inset 0 0 0 2px
        color-mix(in srgb, var(--warning-color, #ff9800) 70%, transparent),
      0 0 14px
        color-mix(in srgb, var(--warning-color, #ff9800) 30%, transparent);
  }

  @keyframes whisker-cycle-glow {
    0%,
    100% {
      filter: drop-shadow(
        0 0 5px color-mix(in srgb, var(--primary-color) 30%, transparent)
      );
      transform: scale(1);
    }
    50% {
      filter: drop-shadow(
        0 0 16px color-mix(in srgb, var(--primary-color) 50%, transparent)
      );
      transform: scale(1.015);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    ha-card:has(whisker-litter-status[cycling]) {
      --whisker-cycling-play-state: paused;
    }

    ha-card:has(whisker-litter-status[cycling]) .robot-image-stack img {
      animation: none;
      filter: drop-shadow(
        0 0 8px color-mix(in srgb, var(--primary-color) 35%, transparent)
      );
      transform: none;
      will-change: auto;
    }
  }
`;
