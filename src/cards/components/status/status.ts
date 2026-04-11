import { SubscribeEntityStateMixin } from '@cards/mixins/subscribe-entity-state-mixin';
import { litterRobotStatusPresentation } from '@common/litterrobot-status';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('whisker-litter-status')
export class WhiskerLitterStatus extends SubscribeEntityStateMixin(LitElement) {
  override render(): TemplateResult | typeof nothing {
    if (!this.state) {
      return nothing;
    }

    const { icon, color } = litterRobotStatusPresentation(this.state.state);

    return html`
      <state-display .hass=${this.hass} .stateObj=${this.state}></state-display>
      <ha-icon
        class="status-icon"
        icon=${icon}
        style="color: ${color}; padding-left: 3px;"
      ></ha-icon>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-litter-status': WhiskerLitterStatus;
  }
}
