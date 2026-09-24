import type { PetReport } from '@/types/types';
import { HassConfigMixin } from '@homeassistant-extras/hass/mixins/hass-config-mixin';
import { SubscribeEntityStateMixin } from '@homeassistant-extras/hass/mixins/subscribe-entity-state-mixin';
import { stateIconLabel } from '@homeassistant-extras/hass/render/state-icon-label';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { petStatesStyles as styles } from './styles';

/** One row per pet: its name, current weight, and visits today. */
@customElement('whisker-pet-states')
export class WhiskerPetStates extends SubscribeEntityStateMixin(
  HassConfigMixin(LitElement),
) {
  static override readonly styles = styles;

  /** Pets to list, in display order. */
  @property({ attribute: false })
  pets: PetReport[] = [];

  /**
   * Populate the mixin's entity list before it subscribes (same pattern as the
   * hopper badge). Pets come from the device registry, so the list is settled
   * by the time the card renders this element.
   */
  override connectedCallback(): void {
    // check?
    this.entities = this.pets.flatMap((pet) =>
      [pet.weight, pet.visits].filter((id): id is string => !!id),
    );
    super.connectedCallback();
  }

  /**
   * renders the lit element card
   * @returns {TemplateResult} The rendered HTML template
   */
  override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.pets.length) {
      return nothing;
    }

    return html`
      <div class="pets">
        ${repeat(
          this.pets,
          (pet) => pet.id,
          (pet) => html`
            <div class="pet">
              <span class="pet-name">${pet.name}</span>
              <div class="pet-stats">
                ${this._renderStat(pet.weight)} ${this._renderStat(pet.visits)}
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }

  /**
   * Renders one metric as an icon + state pair, or nothing when the pet has no
   * such sensor. Reading through `states` keeps the value live.
   * @param {string} [entityId] - The pet sensor to render
   * @returns {TemplateResult} The rendered metric
   */
  private _renderStat(entityId?: string): TemplateResult | typeof nothing {
    if (!entityId || !this.states[entityId]) {
      return nothing;
    }

    return stateIconLabel(this.hass, entityId, {
      state_color: true,
      wrapperClass: 'pet-stat',
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-pet-states': WhiskerPetStates;
  }
}
