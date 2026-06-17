import { fireEvent } from '@homeassistant-extras/hass/common/dom/fire_event';
import type { HaFormSchema } from '@homeassistant-extras/hass/components/ha-form/types';
import '@homeassistant-extras/hass/panels/lovelace/editor/hui-element-editor';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import {
  DEFAULT_COLOR,
  DEFAULT_WEIGHT_CHART_TYPE,
  DEFAULT_WEIGHT_DAYS_TO_SHOW,
  DEFAULT_WEIGHT_GRAPH_TYPE,
  DEFAULT_WEIGHT_HOURS_TO_SHOW,
  type Config,
} from '@type/config';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';

/** Chonk fields shown only for the live `history-graph`. */
const HISTORY_GRAPH_SCHEMA: HaFormSchema[] = [
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
];

/** Chonk fields shown only for the `statistics-graph`. */
const STATISTICS_GRAPH_SCHEMA: HaFormSchema[] = [
  {
    name: 'days_to_show',
    label: 'Weight graph days to show',
    selector: {
      number: {
        min: 1,
        max: 365,
        mode: 'box',
        unit_of_measurement: 'days',
      },
    },
  },
  {
    name: 'period',
    label: 'Statistics period',
    selector: {
      select: {
        options: [
          { value: 'auto', label: 'Automatic' },
          { value: '5minute', label: '5 minutes' },
          { value: 'hour', label: 'Hour' },
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
        ],
      },
    },
  },
  {
    name: 'stat_types',
    label: 'Statistic types',
    selector: {
      select: {
        options: [
          { value: 'mean', label: 'Mean' },
          { value: 'min', label: 'Min' },
          { value: 'max', label: 'Max' },
        ],
        multiple: true,
      },
    },
  },
  {
    name: 'chart_type',
    label: 'Chart type',
    selector: {
      select: {
        options: [
          { value: 'line', label: 'Line' },
          { value: 'line-stack', label: 'Stacked line' },
          { value: 'bar', label: 'Bar' },
          { value: 'bar-stack', label: 'Stacked bar' },
        ],
      },
    },
  },
];

/**
 * Builds the editor schema, swapping the graph-specific chonk fields based on
 * the currently selected `graph_type`.
 * @param {Config} [config] - The current card config
 * @returns {HaFormSchema[]} The ha-form schema
 */
const getSchema = (config?: Config): HaFormSchema[] => {
  const graphType = config?.chonk?.graph_type ?? DEFAULT_WEIGHT_GRAPH_TYPE;

  return [
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
          name: 'cleaning_entity',
          label: 'Needs-cleaning entity',
          selector: {
            entity: {
              filter: {
                domain: ['input_boolean', 'alert', 'binary_sensor', 'switch'],
              },
            },
          },
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
          name: 'graph_type',
          label: 'Graph type',
          selector: {
            select: {
              options: [
                { value: 'history', label: 'History' },
                { value: 'statistics', label: 'Statistics' },
              ],
            },
          },
        },
        ...(graphType === 'statistics'
          ? STATISTICS_GRAPH_SCHEMA
          : HISTORY_GRAPH_SCHEMA),
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
};

/**
 * Strips empty/default values from `config.chonk` in place, deleting the whole
 * object when nothing meaningful remains. Keeps stored configs minimal.
 * @param {Config} config - The card config to normalize
 */
const cleanChonk = (config: Config): void => {
  const chonk = config.chonk;
  if (!chonk) {
    return;
  }

  const isDefault: Partial<
    Record<keyof NonNullable<Config['chonk']>, boolean>
  > = {
    hide: !chonk.hide,
    hide_names: !chonk.hide_names,
    kitties: !chonk.kitties?.length,
    graph_type:
      !chonk.graph_type || chonk.graph_type === DEFAULT_WEIGHT_GRAPH_TYPE,
    hours_to_show:
      !chonk.hours_to_show ||
      chonk.hours_to_show === DEFAULT_WEIGHT_HOURS_TO_SHOW,
    days_to_show:
      !chonk.days_to_show || chonk.days_to_show === DEFAULT_WEIGHT_DAYS_TO_SHOW,
    period: !chonk.period || chonk.period === 'auto',
    stat_types: !chonk.stat_types?.length,
    chart_type:
      !chonk.chart_type || chonk.chart_type === DEFAULT_WEIGHT_CHART_TYPE,
  };

  for (const [key, drop] of Object.entries(isDefault)) {
    if (drop) {
      delete chonk[key as keyof typeof chonk];
    }
  }

  if (Object.keys(chonk).length === 0) {
    delete config.chonk;
  }
};

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
        .schema=${getSchema(this._config)}
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

    cleanChonk(config);

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
