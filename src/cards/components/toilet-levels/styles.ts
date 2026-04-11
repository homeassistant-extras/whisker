import { css } from 'lit';

export const gaugeStyles = css`
  :host {
    display: block;
    position: relative;
    width: 100%;
    box-sizing: border-box;
  }

  .hit {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    cursor: pointer;
  }

  .label {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--secondary-text-color);
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .tooltip {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 100%;
    margin-top: 6px;
    font-size: 0.75rem;
    white-space: nowrap;
    padding: 0.25rem 0.5rem;
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
    z-index: 1;
  }

  .hit:hover .tooltip {
    opacity: 1;
  }

  .bar {
    position: relative;
    width: 100%;
    height: 6px;
    background: var(--divider-color);
    border-radius: 3px;
    overflow: hidden;
  }

  .bar::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: var(--fill, 0%);
    background: var(--success-color);
    transition: width 0.3s ease;
  }

  .bar.waste::after {
    background: var(--success-color);
  }

  .bar.waste.gauge-warn::after {
    background: var(--warning-color);
  }

  .bar.waste.gauge-error::after {
    background: var(--error-color);
  }
`;
