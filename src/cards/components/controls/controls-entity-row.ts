import type { HomeAssistant } from '@hass/types';
import { Task } from '@lit/task';
import { css, html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

const styles = css`
  :host {
    display: block;
  }

  .row-host {
    display: block;
  }

  .row-host > * {
    width: 100%;
  }
`;

interface RowHost extends HTMLElement {
  hass?: HomeAssistant;
}

/**
 * Hosts a single Lovelace entity row via HA’s `loadCardHelpers().createRowElement`.
 */
@customElement('whisker-controls-entity-row')
export class WhiskerControlsEntityRow extends LitElement {
  static override readonly styles = styles;
  hass!: HomeAssistant;
  entity = '';

  private readonly _rowTask = new Task(this, {
    task: async ([entityId]: [string]) => {
      if (!entityId) {
        return null;
      }
      const helpers = (await globalThis.loadCardHelpers()) as unknown as {
        createRowElement: (config: { entity: string }) => RowHost;
      };
      return helpers.createRowElement({ entity: entityId });
    },
    args: (): [string] => [this.entity],
  });

  override render(): TemplateResult | typeof nothing {
    if (!this.entity) {
      return nothing;
    }

    return html`${this._rowTask.render({
      initial: () => nothing,
      pending: () => nothing,
      error: () => nothing,
      complete: (row) => {
        if (!row) {
          return nothing;
        }
        row.hass = this.hass;
        return html`<div class="row-host">${row}</div>`;
      },
    })}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-controls-entity-row': WhiskerControlsEntityRow;
  }
}
