import { css } from 'lit';

export const chonkStyles = css`
  :host {
    display: block;
  }

  .chip {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    max-width: min(42vw, 160px);
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid var(--divider-color);
    color: var(--primary-text-color);
    background: color-mix(
      in srgb,
      var(--card-background-color, #fff) 88%,
      transparent
    );
    box-shadow: 0 1px 3px rgb(0 0 0 / 12%);
    font-size: 0.75rem;
    line-height: 1.2;
    font-family: inherit;
    cursor: pointer;
  }

  .chip:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .chip ha-icon {
    flex-shrink: 0;
    color: var(--secondary-text-color);
    --mdc-icon-size: 18px;
  }

  .placeholder {
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  state-display {
    min-width: 0;
    overflow: hidden;
  }
`;
