import { fireEvent } from '@homeassistant-extras/hass/common/dom/fire_event';
import type { HaFormSchema } from '@homeassistant-extras/hass/components/ha-form/types';
import '@homeassistant-extras/hass/panels/lovelace/editor/hui-element-editor';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import {
  DEFAULT_COLOR,
  DEFAULT_WEIGHT_HOURS_TO_SHOW,
  type Config,
} from '@type/config';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';

const SCHEMA: HaFormSchema[] = [
  {
    name: 'device_id',
    label: 'Litter Robot Device',
    required: true,
    selector: {
      device: {
        filter: { integration: 'litterrobot' },
        entity: { domain: 'vacuum' },
      },
    },
  },
  {
    name: 'content',
    label: 'Content',
    type: 'expandable',
    flatten: true,
    icon: 'mdi:text-short',
    schema: [
      {
        name: 'title',
        label: 'Card Title',
        required: false,
        selector: { text: {} },
      },
      {
        name: 'color',
        label: 'Robot color',
        selector: {
          select: {
            options: [
              { value: 'white', label: 'White' },
              { value: 'black', label: 'Black' },
            ],
          },
        },
      },
    ],
  },
  {
    name: 'chonk',
    label: 'Pet weight chonk',
    type: 'expandable',
    icon: 'mdi:weight',
    schema: [
      {
        name: 'kitties',
        label: 'Weight entities',
        selector: {
          entity: {
            multiple: true,
            reorder: true,
            filter: { integration: 'litterrobot', device_class: 'weight' },
          },
        },
      },
      {
        name: 'hours_to_show',
        label: 'Weight graph hours to show',
        selector: {
          number: {
            min: 1,
            max: 720,
            mode: 'box',
            unit_of_measurement: 'hours',
          },
        },
      },
      {
        name: 'hide',
        label: 'Hide chonk',
        selector: {
          boolean: {},
        },
      },
      {
        name: 'hide_names',
        label: 'Hide pet names',
        selector: {
          boolean: {},
        },
      },
    ],
  },
  {
    name: 'footer',
    label: 'Footer items',
    selector: {
      select: {
        options: [
          { value: 'total_cycles', label: 'Total cycles' },
          { value: 'status_changed', label: 'Status last changed' },
          { value: 'last_seen', label: 'Last seen' },
          { value: 'pet_weight', label: 'Pet weight' },
          { value: 'status', label: 'Status' },
          { value: 'litter_level', label: 'Litter level' },
          { value: 'waste_drawer', label: 'Waste drawer' },
          { value: 'hopper_status', label: 'Hopper status' },
          { value: 'hopper_connected', label: 'Hopper connected' },
        ],
        multiple: true,
      },
    },
  },
  {
    name: 'features',
    label: 'Features',
    selector: {
      select: {
        options: [
          { value: 'percentage', label: 'Show gauge percentages' },
          { value: 'hide_pet_weight', label: 'Hide pet weight chip' },
        ],
        multiple: true,
      },
    },
  },
];

export class WhiskerCardEditor extends LitElement {
  @state()
  private _config!: Config;

  public hass!: HomeAssistant;

  override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${(s: HaFormSchema) => s.label}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  setConfig(config: Config) {
    this._config = config;
  }

  private _valueChanged(ev: CustomEvent) {
    const config = ev.detail.value as Config;

    // clean up chonk property
    if (!config.chonk?.hide) {
      delete config.chonk?.hide;
    }

    if (!config.chonk?.hide_names) {
      delete config.chonk?.hide_names;
    }

    if (!config.chonk?.kitties?.length) {
      delete config.chonk?.kitties;
    }

    if (
      !config.chonk?.hours_to_show ||
      config.chonk?.hours_to_show === DEFAULT_WEIGHT_HOURS_TO_SHOW
    ) {
      delete config.chonk?.hours_to_show;
    }

    if (
      !config.chonk?.hide &&
      !config.chonk?.hide_names &&
      !config.chonk?.kitties?.length &&
      !config.chonk?.hours_to_show
    ) {
      delete config.chonk;
    }

    // handle features
    if (!config.features?.length) {
      delete config.features;
    }

    // handle color
    if (!config.color || config.color === DEFAULT_COLOR) {
      delete config.color;
    }

    fireEvent(this, 'config-changed', { config });
  }
}
