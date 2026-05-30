import { HassConfigMixin } from '@/cards/mixins/hass-config-mixin';
import { SubscribeEntityStateMixin } from '@/cards/mixins/subscribe-entity-state-mixin';
import { getPoatCardHelpers } from '@/helpers/card-helpers';
import { openEntityMoreInfo } from '@common/open-entity-more-info';
import {
  isRelativeFooterSlot,
  type FooterSlot,
} from '@common/resolve-footer-items';
import { computeTooltip } from '@hass/panels/lovelace/common/compute-tooltip';
import type { LovelaceElementConfig } from '@hass/panels/lovelace/elements/types';
import { stateDisplay } from '@html/state-display';
import {
  HOLD_AND_DOUBLE_TAP_NONE,
  stateIconLabel,
} from '@html/state-icon-label';
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
    this.entity =
      this.item && isRelativeFooterSlot(this.item)
        ? this.item.entity
        : undefined;
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
      (this.entityId() !== undefined && this.entityState() !== undefined) ||
      (this.entityId() === undefined && this.item.entity !== undefined)
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
    const entityState = this.entityState();
    if (!entityState) {
      return nothing;
    }

    const icon = this._createHuiElement({
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
          ${stateDisplay(this.hass, entityState, content)}
        </div>
      </div>
    `;
  }

  private _onRelativeClick(): void {
    openEntityMoreInfo(this, this.item.entity);
  }

  private _createHuiElement(
    config: LovelaceElementConfig,
  ): HTMLElement | typeof nothing {
    const helpers = getPoatCardHelpers();
    if (!helpers || !this.hass) {
      return nothing;
    }

    const element = helpers.createHuiElement(config);
    element.hass = this.hass;
    return element;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-card-footer-item': WhiskerCardFooterItem;
  }
}
