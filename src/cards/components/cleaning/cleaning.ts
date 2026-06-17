import type { Config } from '@/types/config';
import { stateActive } from '@homeassistant-extras/hass/common/entity/state_active';
import { moreInfo } from '@homeassistant-extras/hass/events/more-info';
import { HassConfigMixin } from '@homeassistant-extras/hass/mixins/hass-config-mixin';
import { SubscribeEntityStateMixin } from '@homeassistant-extras/hass/mixins/subscribe-entity-state-mixin';
import { computeTooltip } from '@homeassistant-extras/hass/panels/lovelace/common/compute-tooltip';
import {
  html,
  LitElement,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { cleaningStyles as styles } from './styles';

/** Badge color for the "needs cleaning" reminder (theme warning color). */
const CLEANING_COLOR = 'var(--warning-color, #ff9800)';

/** Badge icon for the "needs cleaning" reminder. */
const CLEANING_ICON = 'mdi:broom';

/**
 * Header badge shown when a user-configured entity (input_boolean / alert /
 * binary_sensor / switch) is active, signalling the unit needs cleaning.
 */
@customElement('whisker-cleaning')
export class WhiskerCleaning extends SubscribeEntityStateMixin(
  HassConfigMixin<typeof LitElement, Config>(LitElement),
) {
  /**
   * Returns the component's styles
   */
  static override readonly styles = styles;

  /**
   * Reflected while the configured entity is active. Parent card CSS uses
   * `:has(whisker-cleaning[needs-cleaning])` for the card glow.
   */
  @property({ type: Boolean, reflect: true, attribute: 'needs-cleaning' })
  needsCleaning = false;

  /**
   * updates the needs cleaning state
   * @param {PropertyValues<this>} _changedProperties - the changed properties
   */
  protected override willUpdate(
    _changedProperties: PropertyValues<this>,
  ): void {
    super.willUpdate(_changedProperties);
    this.needsCleaning = this.state ? stateActive(this.state) : false;
  }

  /**
   * opens the more info dialog
   */
  private _openMoreInfo(): void {
    if (typeof this.entity === 'string') {
      moreInfo(this, this.entity);
    }
  }

  /**
   * renders the lit element card
   * @returns {TemplateResult} The rendered HTML template
   */
  override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.state || !this.needsCleaning) {
      return nothing;
    }

    const tooltip = computeTooltip(this.hass, {
      entity: this.entity,
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
        <ha-icon
          icon=${CLEANING_ICON}
          style="color: ${CLEANING_COLOR};"
        ></ha-icon>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-cleaning': WhiskerCleaning;
  }
}
