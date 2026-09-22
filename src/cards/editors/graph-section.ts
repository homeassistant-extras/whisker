import type { HaFormSchema } from '@homeassistant-extras/hass/components/ha-form/types';
import type { EntitySelectorFilter } from '@homeassistant-extras/hass/data/selector';
import {
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
  type GraphSectionConfig,
  type GraphType,
  type StatisticPeriod,
  type StatisticType,
} from '@type/config';

/**
 * Editor pieces for the `chonk` / `visits` graph sections, shared by the robot
 * card and pet card editors — both store the same {@link GraphSectionConfig}.
 */

/** A config with graph sections, i.e. either card's config. */
export type GraphSectionKey = 'chonk' | 'visits';
type ConfigWithGraphs = Partial<Record<GraphSectionKey, GraphSectionConfig>>;

/** Statistic series offered for the pet weight graph (a continuous measurement). */
export const WEIGHT_STAT_OPTIONS = [
  { value: 'mean', label: 'Mean' },
  { value: 'min', label: 'Min' },
  { value: 'max', label: 'Max' },
];

/**
 * Statistic series offered for the visits graph. `visits_today` resets daily,
 * so only running totals make sense — mean/min/max would be meaningless.
 */
export const VISITS_STAT_OPTIONS = [
  { value: 'change', label: 'Total per period' },
  { value: 'sum', label: 'Sum' },
];

/** Entity picker filter for weight sensors (they expose a device class). */
export const WEIGHT_ENTITY_FILTER: EntitySelectorFilter = {
  integration: 'litterrobot',
  device_class: 'weight',
};

/**
 * Entity picker filter for visit counters. `visits_today` has no device class,
 * so this can only narrow to litterrobot sensors.
 */
export const VISITS_ENTITY_FILTER: EntitySelectorFilter = {
  integration: 'litterrobot',
  domain: 'sensor',
};

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
export interface GraphSectionSchemaOptions {
  name: GraphSectionKey;
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
 * Builds one expandable graph section (`chonk` / `visits`) for an editor.
 * @param {GraphSectionSchemaOptions} opts - Section labels, filters, and type
 * @returns {HaFormSchema} The expandable section schema
 */
export const graphSectionSchema = (
  opts: GraphSectionSchemaOptions,
): HaFormSchema => ({
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

/** Values a graph section drops as redundant when saving the config. */
export interface GraphSectionDefaults {
  graph_type: GraphType;
  hours_to_show: number;
  days_to_show: number;
  period: StatisticPeriod;
  chart_type: ChartType;
  stat_types: StatisticType[];
}

export const WEIGHT_SECTION_DEFAULTS: GraphSectionDefaults = {
  graph_type: DEFAULT_WEIGHT_GRAPH_TYPE,
  hours_to_show: DEFAULT_WEIGHT_HOURS_TO_SHOW,
  days_to_show: DEFAULT_WEIGHT_DAYS_TO_SHOW,
  // the weight graph has always stripped `auto` rather than its render default
  period: 'auto',
  chart_type: DEFAULT_WEIGHT_CHART_TYPE,
  stat_types: DEFAULT_WEIGHT_STAT_TYPES,
};

export const VISITS_SECTION_DEFAULTS: GraphSectionDefaults = {
  graph_type: DEFAULT_VISITS_GRAPH_TYPE,
  hours_to_show: DEFAULT_VISITS_HOURS_TO_SHOW,
  days_to_show: DEFAULT_VISITS_DAYS_TO_SHOW,
  period: DEFAULT_VISITS_PERIOD,
  chart_type: DEFAULT_VISITS_CHART_TYPE,
  stat_types: DEFAULT_VISITS_STAT_TYPES,
};

/**
 * Whether two statistic-type lists match in order and length.
 * @param {StatisticType[]} a - Candidate list from the config
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
 * @param {ConfigWithGraphs} config - The card config to normalize
 * @param {GraphSectionKey} key - Which graph section to clean
 * @param {GraphSectionDefaults} defaults - Values considered redundant
 */
export const cleanGraphSection = (
  config: ConfigWithGraphs,
  key: GraphSectionKey,
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
