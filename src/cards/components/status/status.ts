import { SubscribeEntityStateMixin } from '@cards/mixins/subscribe-entity-state-mixin';
import {
  isLitterRobotCycling,
  litterRobotStatusPresentation,
} from '@common/litterrobot-status';
import { openEntityMoreInfo } from '@common/open-entity-more-info';
import { computeTooltip } from '@hass/panels/lovelace/common/compute-tooltip';
import { stateLabel } from '@html/state-icon-label';
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
export class WhiskerLitterStatus extends SubscribeEntityStateMixin(LitElement) {
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
    this.cycling = isLitterRobotCycling(this.entityState()?.state);
  }

  private _onIconClick(): void {
    openEntityMoreInfo(this, this.entityId());
  }

  override render(): TemplateResult | typeof nothing {
    const entityId = this.entityId();
    const entityState = this.entityState();
    if (!entityState || !entityId) {
      return nothing;
    }

    const { icon, color } = litterRobotStatusPresentation(entityState.state);
    const tooltip = computeTooltip(this.hass!, {
      entity: entityId,
      tap_action: { action: 'more-info' },
      hold_action: { action: 'none' },
    });

    return html`
      ${stateLabel(this.hass, entityId)}
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
