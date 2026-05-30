import { HassConfigMixin } from '@/cards/mixins/hass-config-mixin';
import {
  entityIds,
  SubscribeEntityStateMixin,
} from '@/cards/mixins/subscribe-entity-state-mixin';
import { hopperStatusPresentation } from '@common/hopper-status';
import { openEntityMoreInfo } from '@common/open-entity-more-info';
import { computeTooltip } from '@hass/panels/lovelace/common/compute-tooltip';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { hopperStyles as styles } from './styles';

/** Header badge for LitterHopper refill status (LR4 with LitterHopper attached). */
@customElement('whisker-hopper')
export class WhiskerHopper extends SubscribeEntityStateMixin(
  HassConfigMixin(LitElement),
) {
  static override readonly styles = styles;

  /** Hopper status sensor entity id (`translation_key` hopper_status). */
  statusEntity?: string;

  /** Hopper connected binary sensor entity id (`translation_key` hopper_connected). */
  connectedEntity?: string;

  override connectedCallback(): void {
    this.entity = [this.statusEntity, this.connectedEntity].filter(
      (id): id is string => !!id,
    );
    super.connectedCallback();
  }

  private _openMoreInfo(): void {
    openEntityMoreInfo(
      this,
      this.statusEntity ?? this.connectedEntity ?? undefined,
    );
  }

  override render(): TemplateResult | typeof nothing {
    if (!this.hass || entityIds(this.entity).length === 0) {
      return nothing;
    }

    const { icon, color } = hopperStatusPresentation(
      this.statusEntity
        ? this.entityState(this.statusEntity)?.state
        : undefined,
      this.connectedEntity
        ? this.entityState(this.connectedEntity)?.state
        : undefined,
    );
    const tooltipEntity = this.statusEntity ?? this.connectedEntity;

    const tooltip = computeTooltip(this.hass, {
      entity: tooltipEntity,
      tap_action: { action: 'more-info' },
      hold_action: { action: 'none' },
    });

    return html`
      <span
        class="badge"
        role="button"
        tabindex="0"
        title=${tooltip}
        @click=${this._openMoreInfo}
      >
        <ha-icon icon=${icon} style="color: ${color};"></ha-icon>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-hopper': WhiskerHopper;
  }
}
