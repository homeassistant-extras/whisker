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

  .last-seen-row {
    padding: 12px 20px 14px;
    border-top: 1px solid var(--divider-color);
    font-size: 0.75rem;
    color: var(--secondary-text-color);
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

  /** Pet weight chip: bottom-left overlay on robot image */
  .status-chonk {
    position: absolute;
    bottom: 8px;
    left: 12px;
    z-index: 3;
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

  /** While status_code is a running cycle (ccp / ec / cst); cycling is on :host */
  :host([cycling]) .robot-image-stack img {
    animation: whisker-cycle-glow 2.4s ease-in-out infinite;
    will-change: filter, transform;
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
    :host([cycling]) .robot-image-stack img {
      animation: none;
      filter: drop-shadow(
        0 0 8px color-mix(in srgb, var(--primary-color) 35%, transparent)
      );
      transform: none;
      will-change: auto;
    }
  }

  :host([cycling]) ha-card {
    box-shadow:
      var(--ha-card-box-shadow, none),
      inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 35%, transparent);
  }
`;
