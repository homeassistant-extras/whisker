import { HassConfigMixin } from '@/cards/mixins/hass-config-mixin';
import { getPoatCardHelpers } from '@/helpers/card-helpers';
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

/**
 * Hosts a single Lovelace entity row via HA’s `loadCardHelpers().createRowElement`.
 */
@customElement('whisker-controls-entity-row')
export class WhiskerControlsEntityRow extends HassConfigMixin(LitElement) {
  static override readonly styles = styles;
  entity = '';

  /**
   * Resolved once from {@link globalThis.loadCardHelpers}; used via global helper accessor.
   */

  override render(): TemplateResult | typeof nothing {
    if (!this.entity) {
      return nothing;
    }

    const helpers = getPoatCardHelpers();
    if (!helpers) {
      return nothing;
    }

    const row = helpers.createRowElement({ entity: this.entity });
    row.hass = this.hass;

    return html`<div class="row-host">${row}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-controls-entity-row': WhiskerControlsEntityRow;
  }
}
