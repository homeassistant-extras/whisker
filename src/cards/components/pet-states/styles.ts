import { css } from 'lit';

export const petStatesStyles = css`
  :host {
    display: block;
  }

  .pets {
    display: flex;
    flex-direction: column;
  }

  .pet {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 20px;
    min-width: 0;
  }

  .pet + .pet {
    border-top: 1px solid var(--divider-color);
  }

  .pet-name {
    font-size: 0.95rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pet-stats {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
    font-size: 0.875rem;
    color: var(--secondary-text-color);
  }

  .pet-stat {
    display: inline-flex;
    align-items: center;
    min-width: 0;
    cursor: pointer;
  }
`;
