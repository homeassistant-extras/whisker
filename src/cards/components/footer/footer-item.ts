import {
  isRelativeFooterSlot,
  type FooterSlot,
} from '@common/resolve-footer-items';
import { moreInfo } from '@homeassistant-extras/hass/events/more-info';
import { HassConfigMixin } from '@homeassistant-extras/hass/mixins/hass-config-mixin';
import { SubscribeEntityStateMixin } from '@homeassistant-extras/hass/mixins/subscribe-entity-state-mixin';
import { computeTooltip } from '@homeassistant-extras/hass/panels/lovelace/common/compute-tooltip';
import { HOLD_AND_DOUBLE_TAP_NONE } from '@homeassistant-extras/hass/render/constants';
import { createHuiElement } from '@homeassistant-extras/hass/render/create-hui-element';
import { stateDisplay } from '@homeassistant-extras/hass/render/state-display';
import { stateIconLabel } from '@homeassistant-extras/hass/render/state-icon-label';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { footerItemStyles as styles } from './footer-item-styles';

@customElement('whisker-card-footer-item')
export class WhiskerCardFooterItem extends SubscribeEntityStateMixin(
  HassConfigMixin(LitElement),
) {
  static override readonly styles = styles;

  @property({ attribute: false })
  item!: FooterSlot;

  /**
   * Subscribes to the entity if we need to render a state display.
   */
  override connectedCallback(): void {
    if (this.item && isRelativeFooterSlot(this.item)) {
      this.entity = this.item.entity;
    }
    super.connectedCallback();
  }

  /**
   * Determines if the component should update.
   * We need to update if:
   * - we have set an entity and have a state
   * - we don't have an entity and the item has an entity_id
   * @returns true if we should update the component
   */
  protected override shouldUpdate(): boolean {
    return (
      (this.entity !== undefined && this.state !== undefined) ||
      (this.entity === undefined && this.item.entity !== undefined)
    );
  }

  /**
   * renders the lit element card
   * @returns {TemplateResult} The rendered HTML template
   */
  override render(): TemplateResult | typeof nothing {
    if (isRelativeFooterSlot(this.item)) {
      return this._renderRelativeSlot();
    }

    return stateIconLabel(this.hass, this.item.entity, {
      state_color: true,
      wrapperClass: 'footer-item-content',
    });
  }

  private _renderRelativeSlot(): TemplateResult | typeof nothing {
    if (!this.state) {
      return nothing;
    }

    if (!this.hass) {
      return nothing;
    }

    const icon = createHuiElement(this.hass, {
      type: 'state-icon',
      entity: this.item.entity,
      state_color: true,
      tap_action: { action: 'none' },
      ...HOLD_AND_DOUBLE_TAP_NONE,
    });

    const content =
      this.item.content === 'last_changed' ? 'last_changed' : undefined;

    return html`
      <div class="footer-item-content" role="presentation">
        ${icon}
        <div
          class="footer-item-state"
          role="button"
          tabindex="0"
          title=${computeTooltip(this.hass, {
            entity: this.item.entity,
            tap_action: { action: 'more-info' },
            hold_action: { action: 'none' },
          })}
          @click=${this._onRelativeClick}
        >
          ${stateDisplay(this.hass, this.state, content)}
        </div>
      </div>
    `;
  }

  private _onRelativeClick(): void {
    moreInfo(this, this.item.entity);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-card-footer-item': WhiskerCardFooterItem;
  }
}
