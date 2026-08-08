import { fireEvent } from '@homeassistant-extras/hass/common/dom/fire_event';
import type { HaFormSchema } from '@homeassistant-extras/hass/components/ha-form/types';
import type { EntitySelectorFilter } from '@homeassistant-extras/hass/data/selector';
import '@homeassistant-extras/hass/panels/lovelace/editor/hui-element-editor';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import {
  DEFAULT_COLOR,
  DEFAULT_VISITS_CHART_TYPE,
  DEFAULT_VISITS_DAYS_TO_SHOW,
  DEFAULT_VISITS_GRAPH_TYPE,
  DEFAULT_VISITS_HOURS_TO_SHOW,
  DEFAULT_VISITS_PERIOD,
  DEFAULT_VISITS_STAT_TYPES,
  DEFAULT_WEIGHT_CHART_TYPE,
  DEFAULT_WEIGHT_DAYS_TO_SHOW,
  DEFAULT_WEIGHT_GRAPH_TYPE,
  DEFAULT_WEIGHT_HOURS_TO_SHOW,
  DEFAULT_WEIGHT_STAT_TYPES,
  type ChartType,
  type Config,
  type GraphSectionConfig,
  type GraphType,
  type StatisticPeriod,
  type StatisticType,
} from '@type/config';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';

/** Statistic series offered for the pet weight graph (a continuous measurement). */
const WEIGHT_STAT_OPTIONS = [
  { value: 'mean', label: 'Mean' },
  { value: 'min', label: 'Min' },
  { value: 'max', label: 'Max' },
];

/**
 * Statistic series offered for the visits graph. `visits_today` resets daily,
 * so only running totals make sense — mean/min/max would be meaningless.
 */
const VISITS_STAT_OPTIONS = [
  { value: 'change', label: 'Total per period' },
  { value: 'sum', label: 'Sum' },
];

/**
 * Builds the fields shown only for the live `history-graph`.
 * @param {string} prefix - Section label prefix, e.g. `Weight graph`
 * @returns {HaFormSchema[]} The history-graph-only fields
 */
const historyGraphSchema = (prefix: string): HaFormSchema[] => [
  {
    name: 'hours_to_show',
    label: `${prefix} hours to show`,
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

/**
 * Builds the fields shown only for the `statistics-graph`.
 * @param {string} prefix - Section label prefix, e.g. `Weight graph`
 * @param {object[]} statOptions - Statistic series options for this section
 * @returns {HaFormSchema[]} The statistics-graph-only fields
 */
const statisticsGraphSchema = (
  prefix: string,
  statOptions: { value: string; label: string }[],
): HaFormSchema[] => [
  {
    name: 'days_to_show',
    label: `${prefix} days to show`,
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
    label: `${prefix} statistics period`,
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
    label: `${prefix} statistic types`,
    selector: {
      select: {
        options: statOptions,
        multiple: true,
      },
    },
  },
  {
    name: 'chart_type',
    label: `${prefix} chart type`,
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

/** Inputs shared by both graph editor sections. */
interface GraphSectionSchemaOptions {
  name: 'chonk' | 'visits';
  label: string;
  icon: string;
  entitiesLabel: string;
  hideLabel: string;
  entityFilter: EntitySelectorFilter;
  prefix: string;
  graphType: GraphType;
  statOptions: { value: string; label: string }[];
}

/**
 * Builds one expandable graph section (`chonk` / `visits`) for the editor.
 * @param {GraphSectionSchemaOptions} opts - Section labels, filters, and type
 * @returns {HaFormSchema} The expandable section schema
 */
const graphSectionSchema = (opts: GraphSectionSchemaOptions): HaFormSchema => ({
  name: opts.name,
  label: opts.label,
  type: 'expandable',
  icon: opts.icon,
  schema: [
    {
      name: 'kitties',
      label: opts.entitiesLabel,
      selector: {
        entity: {
          multiple: true,
          reorder: true,
          filter: opts.entityFilter,
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
    ...(opts.graphType === 'statistics'
      ? statisticsGraphSchema(opts.prefix, opts.statOptions)
      : historyGraphSchema(opts.prefix)),
    {
      name: 'hide',
      label: opts.hideLabel,
      selector: {
        boolean: {},
      },
    },
    {
      name: 'collapsed',
      label: 'Start collapsed',
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
});

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
    // gauges render in both layouts, so `percentage` always applies
    {
      name: 'features',
      label: 'Features',
      selector: {
        select: {
          options: [{ value: 'percentage', label: 'Show gauge percentages' }],
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
      // weight sensors expose device_class; visits_today does not, so the
      // visits picker below can only narrow to litterrobot sensors
      entityFilter: {
        integration: 'litterrobot',
        device_class: 'weight',
      },
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
      entityFilter: { integration: 'litterrobot', domain: 'sensor' },
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

/** Values a graph section drops as redundant when saving the config. */
interface GraphSectionDefaults {
  graph_type: GraphType;
  hours_to_show: number;
  days_to_show: number;
  period: StatisticPeriod;
  chart_type: ChartType;
  stat_types: StatisticType[];
}

const WEIGHT_SECTION_DEFAULTS: GraphSectionDefaults = {
  graph_type: DEFAULT_WEIGHT_GRAPH_TYPE,
  hours_to_show: DEFAULT_WEIGHT_HOURS_TO_SHOW,
  days_to_show: DEFAULT_WEIGHT_DAYS_TO_SHOW,
  // the weight graph has always stripped `auto` rather than its render default
  period: 'auto',
  chart_type: DEFAULT_WEIGHT_CHART_TYPE,
  stat_types: DEFAULT_WEIGHT_STAT_TYPES,
};

const VISITS_SECTION_DEFAULTS: GraphSectionDefaults = {
  graph_type: DEFAULT_VISITS_GRAPH_TYPE,
  hours_to_show: DEFAULT_VISITS_HOURS_TO_SHOW,
  days_to_show: DEFAULT_VISITS_DAYS_TO_SHOW,
  period: DEFAULT_VISITS_PERIOD,
  chart_type: DEFAULT_VISITS_CHART_TYPE,
  stat_types: DEFAULT_VISITS_STAT_TYPES,
};

/**
 * Whether two statistic-type lists match in order and length.
 * @param {StatisticType[]} [a] - Candidate list from the config
 * @param {StatisticType[]} b - Default list to compare against
 * @returns {boolean} True when both lists are identical
 */
const sameStatTypes = (
  a: StatisticType[] | undefined,
  b: StatisticType[],
): boolean =>
  !!a && a.length === b.length && a.every((value, index) => value === b[index]);

/**
 * Strips empty/default values from a graph section (`chonk` / `visits`) in
 * place, deleting the whole object when nothing meaningful remains. Keeps
 * stored configs minimal.
 * @param {Config} config - The card config to normalize
 * @param {'chonk' | 'visits'} key - Which graph section to clean
 * @param {GraphSectionDefaults} defaults - Values considered redundant
 */
const cleanGraphSection = (
  config: Config,
  key: 'chonk' | 'visits',
  defaults: GraphSectionDefaults,
): void => {
  const section = config[key];
  if (!section) {
    return;
  }

  const isDefault: Partial<Record<keyof GraphSectionConfig, boolean>> = {
    hide: !section.hide,
    collapsed: !section.collapsed,
    hide_names: !section.hide_names,
    kitties: !section.kitties?.length,
    graph_type:
      !section.graph_type || section.graph_type === defaults.graph_type,
    hours_to_show:
      !section.hours_to_show ||
      section.hours_to_show === defaults.hours_to_show,
    days_to_show:
      !section.days_to_show || section.days_to_show === defaults.days_to_show,
    period: !section.period || section.period === defaults.period,
    stat_types:
      !section.stat_types?.length ||
      sameStatTypes(section.stat_types, defaults.stat_types),
    chart_type:
      !section.chart_type || section.chart_type === defaults.chart_type,
  };

  for (const [prop, drop] of Object.entries(isDefault)) {
    if (drop) {
      delete section[prop as keyof typeof section];
    }
  }

  if (Object.keys(section).length === 0) {
    delete config[key];
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
