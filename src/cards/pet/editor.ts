import {
  cleanGraphSection,
  graphSectionSchema,
  VISITS_ENTITY_FILTER,
  VISITS_SECTION_DEFAULTS,
  VISITS_STAT_OPTIONS,
  WEIGHT_ENTITY_FILTER,
  WEIGHT_SECTION_DEFAULTS,
  WEIGHT_STAT_OPTIONS,
} from '@cards/editors/graph-section';
import { fireEvent } from '@homeassistant-extras/hass/common/dom/fire_event';
import type { HaFormSchema } from '@homeassistant-extras/hass/components/ha-form/types';
// declares the `config-changed` event fired below
import '@homeassistant-extras/hass/panels/lovelace/editor/hui-element-editor';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import {
  DEFAULT_PET_DISPLAY,
  DEFAULT_VISITS_GRAPH_TYPE,
  DEFAULT_WEIGHT_GRAPH_TYPE,
  type PetConfig,
} from '@type/config';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';

/**
 * Builds the pet card schema. The graph sections only appear once the card is
 * actually showing graphs, and swap fields with each section's `graph_type`.
 * @param {PetConfig} [config] - The current card config
 * @returns {HaFormSchema[]} The ha-form schema
 */
const getSchema = (config?: PetConfig): HaFormSchema[] => {
  const display = config?.display ?? DEFAULT_PET_DISPLAY;

  return [
    {
      name: 'title',
      label: 'Card Title',
      required: false,
      selector: { text: {} },
    },
    {
      name: 'pets',
      label: 'Pets (all when empty)',
      selector: {
        device: {
          multiple: true,
          filter: { integration: 'litterrobot' },
        },
      },
    },
    {
      name: 'display',
      label: 'Show',
      selector: {
        select: {
          options: [
            { value: 'states', label: 'States' },
            { value: 'graphs', label: 'Graphs' },
            { value: 'both', label: 'States and graphs' },
          ],
        },
      },
    },
    ...(display === 'states'
      ? []
      : [
          graphSectionSchema({
            name: 'chonk',
            label: 'Pet weight chonk',
            icon: 'mdi:weight',
            entitiesLabel: 'Weight entities',
            hideLabel: 'Hide chonk',
            entityFilter: WEIGHT_ENTITY_FILTER,
            prefix: 'Weight graph',
            graphType: config?.chonk?.graph_type ?? DEFAULT_WEIGHT_GRAPH_TYPE,
            statOptions: WEIGHT_STAT_OPTIONS,
          }),
          graphSectionSchema({
            name: 'visits',
            label: 'Pet visits',
            icon: 'mdi:paw',
            entitiesLabel: 'Visit entities',
            hideLabel: 'Hide visits',
            entityFilter: VISITS_ENTITY_FILTER,
            prefix: 'Visits graph',
            graphType: config?.visits?.graph_type ?? DEFAULT_VISITS_GRAPH_TYPE,
            statOptions: VISITS_STAT_OPTIONS,
          }),
        ]),
  ];
};

export class WhiskerPetCardEditor extends LitElement {
  @state()
  private _config!: PetConfig;

  public hass!: HomeAssistant;

  override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${getSchema(this._config)}
        .computeLabel=${(s: HaFormSchema) => s.label}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  setConfig(config: PetConfig) {
    this._config = config;
  }

  private _valueChanged(ev: CustomEvent) {
    const config = ev.detail.value as PetConfig;

    cleanGraphSection(config, 'chonk', WEIGHT_SECTION_DEFAULTS);
    cleanGraphSection(config, 'visits', VISITS_SECTION_DEFAULTS);

    // handle pets
    if (!config.pets?.length) {
      delete config.pets;
    }

    // handle display
    if (!config.display || config.display === DEFAULT_PET_DISPLAY) {
      delete config.display;
    }

    fireEvent(this, 'config-changed', { config });
  }
}
