import { css } from 'lit';

export const footerStyles = css`
  :host {
    display: block;
  }

  .footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 8px 16px;
    padding: 12px 20px 14px;
    border-top: 1px solid var(--divider-color);
    font-size: 0.75rem;
    color: var(--secondary-text-color);
  }
`;
