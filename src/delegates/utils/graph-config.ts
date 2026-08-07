import type { LovelaceCardConfig } from '@homeassistant-extras/hass/data/lovelace/config/card';
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
  DEFAULT_WEIGHT_PERIOD,
  DEFAULT_WEIGHT_STAT_TYPES,
  type ChartType,
  type GraphSectionConfig,
  type GraphType,
  type StatisticPeriod,
  type StatisticType,
} from '@type/config';

/**
 * The user-supplied graph slice of the card config. Both `config.chonk` and
 * `config.visits` satisfy this structurally; `kitties` and `hide` are
 * deliberately omitted since the card resolves those before rendering.
 */
export type GraphOptions = Pick<
  GraphSectionConfig,
  | 'graph_type'
  | 'hours_to_show'
  | 'days_to_show'
  | 'period'
  | 'stat_types'
  | 'chart_type'
  | 'hide_names'
  | 'collapsed'
>;

/** Fallbacks applied when the matching {@link GraphOptions} key is unset. */
export interface GraphDefaults {
  graph_type: GraphType;
  hours_to_show: number;
  days_to_show: number;
  period: StatisticPeriod;
  stat_types: StatisticType[];
  chart_type: ChartType;
}

/** Fallbacks for unset `chonk` graph options. */
export const WEIGHT_GRAPH_DEFAULTS: GraphDefaults = {
  graph_type: DEFAULT_WEIGHT_GRAPH_TYPE,
  hours_to_show: DEFAULT_WEIGHT_HOURS_TO_SHOW,
  days_to_show: DEFAULT_WEIGHT_DAYS_TO_SHOW,
  period: DEFAULT_WEIGHT_PERIOD,
  stat_types: DEFAULT_WEIGHT_STAT_TYPES,
  chart_type: DEFAULT_WEIGHT_CHART_TYPE,
};

/** Fallbacks for unset `visits` graph options. */
export const VISITS_GRAPH_DEFAULTS: GraphDefaults = {
  graph_type: DEFAULT_VISITS_GRAPH_TYPE,
  hours_to_show: DEFAULT_VISITS_HOURS_TO_SHOW,
  days_to_show: DEFAULT_VISITS_DAYS_TO_SHOW,
  period: DEFAULT_VISITS_PERIOD,
  stat_types: DEFAULT_VISITS_STAT_TYPES,
  chart_type: DEFAULT_VISITS_CHART_TYPE,
};

/**
 * Builds the wrapped HA card config for a graph, picking `history-graph` or
 * `statistics-graph` from the configured `graph_type`. Pure — the caller owns
 * both the entity list and the per-graph defaults.
 * @param {string[]} entities - Entity ids to plot
 * @param {GraphOptions} [options] - User-supplied graph options
 * @param {GraphDefaults} defaults - Fallbacks for unset options
 * @returns {LovelaceCardConfig} The history-graph or statistics-graph config
 */
export const buildGraphConfig = (
  entities: string[],
  options: GraphOptions | undefined,
  defaults: GraphDefaults,
): LovelaceCardConfig => {
  if ((options?.graph_type ?? defaults.graph_type) === 'statistics') {
    return {
      type: 'statistics-graph',
      entities,
      days_to_show: options?.days_to_show ?? defaults.days_to_show,
      stat_types: options?.stat_types?.length
        ? options.stat_types
        : defaults.stat_types,
      chart_type: options?.chart_type ?? defaults.chart_type,
      hide_legend: !!options?.hide_names,
      period: options?.period ?? defaults.period,
    };
  }

  return {
    type: 'history-graph',
    entities,
    hours_to_show: options?.hours_to_show ?? defaults.hours_to_show,
    show_names: !options?.hide_names,
  };
};
