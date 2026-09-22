import '@/cards/components/pet-graph/pet-graph';
import '@/cards/components/pet-states/pet-states';
import type { PetReport } from '@/types/types';
import { styles } from '@cards/pet/styles';
import {
  VISITS_GRAPH_DEFAULTS,
  WEIGHT_GRAPH_DEFAULTS,
  type GraphDefaults,
} from '@delegates/utils/graph-config';
import { herdKitties } from '@delegates/utils/herd-kitties';
import {
  resolvePoatCardHelpers,
  type CardHelpers,
} from '@homeassistant-extras/hass/helpers/card-helpers';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import {
  DEFAULT_PET_DISPLAY,
  type GraphSectionConfig,
  type PetConfig,
} from '@type/config';
import equal from 'fast-deep-equal';
import {
  html,
  LitElement,
  nothing,
  type CSSResult,
  type TemplateResult,
} from 'lit';
import { state } from 'lit/decorators.js';

/**
 * Standalone card for the household's pets. Pet weight and visits are reported
 * per pet rather than per robot, so this card shows them once no matter how
 * many Litter-Robots are on the dashboard.
 */
export class WhiskerPetCard extends LitElement {
  /**
   * Card configuration object
   */
  private _config!: PetConfig;

  /**
   * The pets resolved from Home Assistant
   */
  @state()
  private _pets?: PetReport[];

  /**
   * Resolved once from {@link globalThis.loadCardHelpers}; used via global helper accessor.
   */
  @state()
  private _cardHelpers?: CardHelpers;

  /**
   * Home Assistant instance
   */
  private _hass!: HomeAssistant;

  /**
   * Returns the component's styles
   */
  static override get styles(): CSSResult {
    return styles;
  }

  /**
   * Sets up the card configuration
   * @param {PetConfig} config - The card configuration
   */
  setConfig(config: PetConfig) {
    if (!equal(config, this._config)) {
      this._config = config;
    }
  }

  /**
   * Updates the card's state when Home Assistant state changes
   * @param {HomeAssistant} hass - The Home Assistant instance
   */
  set hass(hass: HomeAssistant) {
    this._hass = hass;
    const herded = herdKitties(hass, this._config?.pets);

    if (!equal(herded, this._pets)) {
      this._pets = herded;
    }
  }

  // card configuration
  static getConfigElement() {
    return document.createElement('whisker-pet-card-editor');
  }

  /**
   * Returns a stub configuration for the card. Every pet is picked up
   * automatically, so there is nothing to seed.
   */
  static getStubConfig(): PetConfig {
    return {};
  }

  /**
   * Resolves the card helpers once for every sub element
   */
  override connectedCallback(): void {
    super.connectedCallback();
    void resolvePoatCardHelpers(globalThis.loadCardHelpers).then((helpers) => {
      this._cardHelpers = helpers;
    });
  }

  /**
   * Renders one graph section, unless it is hidden or no pet reports it.
   * @param {string} header - Section header
   * @param {string[]} entities - Pet sensor entity ids to plot
   * @param {GraphSectionConfig} [options] - The section's config
   * @param {GraphDefaults} defaults - Fallbacks for unset options
   * @returns {TemplateResult} The rendered graph section
   */
  private _renderGraph(
    header: string,
    entities: string[],
    options: GraphSectionConfig | undefined,
    defaults: GraphDefaults,
  ): TemplateResult | typeof nothing {
    if (options?.hide || !entities.length) {
      return nothing;
    }

    return html`<whisker-pet-graph
      .hass=${this._hass}
      .header=${header}
      .kitties=${entities}
      .options=${options}
      .defaults=${defaults}
    ></whisker-pet-graph>`;
  }

  /**
   * renders the lit element card
   * @returns {TemplateResult} The rendered HTML template
   */
  override render(): TemplateResult | typeof nothing {
    if (!this._pets?.length || !this._cardHelpers) {
      return nothing;
    }

    const display = this._config?.display ?? DEFAULT_PET_DISPLAY;

    // a configured entity list wins over the pets resolved from the registry
    const weights = this._config?.chonk?.kitties?.length
      ? this._config.chonk.kitties
      : this._pets.flatMap((pet) => pet.weight ?? []);
    const visits = this._config?.visits?.kitties?.length
      ? this._config.visits.kitties
      : this._pets.flatMap((pet) => pet.visits ?? []);

    return html`
      <ha-card>
        <h2 class="card-title">${this._config?.title ?? 'Pets'}</h2>
        ${display === 'graphs'
          ? nothing
          : html`<whisker-pet-states
              .hass=${this._hass}
              .pets=${this._pets}
            ></whisker-pet-states>`}
        ${display === 'states'
          ? nothing
          : html`${this._renderGraph(
              'Pet weight',
              weights,
              this._config?.chonk,
              WEIGHT_GRAPH_DEFAULTS,
            )}
            ${this._renderGraph(
              'Pet visits',
              visits,
              this._config?.visits,
              VISITS_GRAPH_DEFAULTS,
            )}`}
      </ha-card>
    `;
  }
}
