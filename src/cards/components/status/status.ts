import {
  isLitterRobotCycling,
  litterRobotStatusPresentation,
} from '@common/litterrobot-status';
import { moreInfo } from '@homeassistant-extras/hass/events/more-info';
import { HassConfigMixin } from '@homeassistant-extras/hass/mixins/hass-config-mixin';
import { SubscribeEntityStateMixin } from '@homeassistant-extras/hass/mixins/subscribe-entity-state-mixin';
import { computeTooltip } from '@homeassistant-extras/hass/panels/lovelace/common/compute-tooltip';
import { stateDisplay } from '@homeassistant-extras/hass/render/state-display';
import {
  html,
  LitElement,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { statusStyles as styles } from './styles';

@customElement('whisker-litter-status')
export class WhiskerLitterStatus extends SubscribeEntityStateMixin(
  HassConfigMixin(LitElement),
) {
  static override readonly styles = styles;

  /**
   * Reflected while `status_code` indicates a running cycle (ccp / ec / cst).
   * Parent card CSS uses `:has(whisker-litter-status[cycling])` for cycle styling.
   */
  @property({ type: Boolean, reflect: true })
  cycling = false;

  protected override willUpdate(
    _changedProperties: PropertyValues<this>,
  ): void {
    super.willUpdate(_changedProperties);
    this.cycling = isLitterRobotCycling(this.state?.state);
  }

  private _onIconClick(): void {
    const entityId = this.entity;
    if (typeof entityId === 'string') {
      moreInfo(this, entityId);
    }
  }

  override render(): TemplateResult | typeof nothing {
    const entityId = this.entity;
    if (!this.state || typeof entityId !== 'string') {
      return nothing;
    }

    const { icon, color } = litterRobotStatusPresentation(this.state.state);
    const tooltip = computeTooltip(this.hass, {
      entity: entityId,
      tap_action: { action: 'more-info' },
      hold_action: { action: 'none' },
    });

    return html`
      ${stateDisplay(this.hass, this.state)}
      <span
        class="status-icon-wrap"
        role="button"
        tabindex="0"
        title=${tooltip}
        @click=${this._onIconClick}
      >
        <ha-icon
          class="status-icon"
          icon=${icon}
          style="color: ${color};"
        ></ha-icon>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-litter-status': WhiskerLitterStatus;
  }
}
