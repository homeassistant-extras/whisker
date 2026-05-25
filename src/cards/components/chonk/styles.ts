import { css } from 'lit';

export const chonkStyles = css`
  :host {
    display: block;
    margin-bottom: 10%;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid var(--divider-color);
    box-shadow: 0 1px 3px rgb(0 0 0 / 12%);
    font-size: 0.75rem;
  }

  .chip hui-state-icon-element {
    --mdc-icon-size: 18px;
  }
`;
