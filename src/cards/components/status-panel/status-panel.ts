import type { HomeAssistant } from '@hass/types';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import './status-panel-item';
import { statusPanelStyles as styles } from './styles';

@customElement('whisker-status-panel')
export class WhiskerStatusPanel extends LitElement {
  static override readonly styles = styles;
  resetEntity: string | null = null;
  litterBoxEntity: string | null = null;
  hass!: HomeAssistant;

  override render(): TemplateResult | typeof nothing {
    return html`
      <div class="panel">
        <whisker-status-panel-item
          item-type="vacuum"
          .hass=${this.hass}
          .entity=${this.litterBoxEntity}
        ></whisker-status-panel-item>
        <whisker-status-panel-item
          item-type="reset"
          .hass=${this.hass}
          .entity=${this.resetEntity}
        ></whisker-status-panel-item>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-status-panel': WhiskerStatusPanel;
  }
}
