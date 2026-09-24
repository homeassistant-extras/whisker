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
import { hasFeature } from '@homeassistant-extras/hass/common/config/feature';
import { fireEvent } from '@homeassistant-extras/hass/common/dom/fire_event';
import type { HaFormSchema } from '@homeassistant-extras/hass/components/ha-form/types';
import '@homeassistant-extras/hass/panels/lovelace/editor/hui-element-editor';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import {
  DEFAULT_COLOR,
  DEFAULT_VISITS_GRAPH_TYPE,
  DEFAULT_WEIGHT_GRAPH_TYPE,
  type Config,
  type GraphType,
} from '@type/config';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';

/** Robot color picker, shown whenever the photo or illustrated body renders. */
const colorSchema: HaFormSchema = {
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
};

/**
 * Builds the editor schema, swapping the graph-specific fields based on each
 * section's currently selected `graph_type`.
 * @param {Config} [config] - The current card config
 * @returns {HaFormSchema[]} The ha-form schema
 */
const getSchema = (config?: Config): HaFormSchema[] => {
  const weightGraphType =
    config?.chonk?.graph_type ?? DEFAULT_WEIGHT_GRAPH_TYPE;
  const visitsGraphType =
    config?.visits?.graph_type ?? DEFAULT_VISITS_GRAPH_TYPE;

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
        // color drives the robot photo and the illustrated body fill. The mini
        // layout drops the photo, so the picker only has something to act on
        // there once illustrated levels are turned on.
        ...(config?.mini && !hasFeature(config, 'illustrated')
          ? []
          : [colorSchema]),
        {
          name: 'mini',
          label: 'Mini layout',
          selector: { boolean: {} },
        },
      ],
    },
    // the mini layout renders neither graphs nor a footer, so offering their
    // options would imply an effect they cannot have
    ...(config?.mini ? [] : miniHiddenSchema(weightGraphType, visitsGraphType)),
    // gauges / illustrated levels render in both layouts, so these flags always apply
    {
      name: 'features',
      label: 'Features',
      selector: {
        select: {
          options: [
            { value: 'percentage', label: 'Show gauge percentages' },
            {
              value: 'illustrated',
              label: 'Illustrated levels (instead of photo & bars)',
            },
          ],
          multiple: true,
        },
      },
    },
  ];
};

/**
 * Schema entries that only apply to the full layout: both pet graph sections
 * and the footer picker.
 * @param {GraphType} weightGraphType - Currently selected weight graph type
 * @param {GraphType} visitsGraphType - Currently selected visits graph type
 * @returns {HaFormSchema[]} The full-layout-only schema entries
 */
const miniHiddenSchema = (
  weightGraphType: GraphType,
  visitsGraphType: GraphType,
): HaFormSchema[] => {
  return [
    graphSectionSchema({
      name: 'chonk',
      label: 'Pet weight chonk',
      icon: 'mdi:weight',
      entitiesLabel: 'Weight entities',
      hideLabel: 'Hide chonk',
      entityFilter: WEIGHT_ENTITY_FILTER,
      prefix: 'Weight graph',
      graphType: weightGraphType,
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
      graphType: visitsGraphType,
      statOptions: VISITS_STAT_OPTIONS,
    }),
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
  ];
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

    cleanGraphSection(config, 'chonk', WEIGHT_SECTION_DEFAULTS);
    cleanGraphSection(config, 'visits', VISITS_SECTION_DEFAULTS);

    // handle features
    if (!config.features?.length) {
      delete config.features;
    }

    // handle color
    if (!config.color || config.color === DEFAULT_COLOR) {
      delete config.color;
    }

    // handle mini
    if (!config.mini) {
      delete config.mini;
    }

    fireEvent(this, 'config-changed', { config });
  }
}
