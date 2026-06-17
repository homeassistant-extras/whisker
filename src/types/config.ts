/**
 * Card configuration and Litter Robot state types.
 */

/** Footer row item keys (order in `footer` array controls display order). */
export type FooterItem =
  | 'last_seen'
  | 'status_changed'
  | 'pet_weight'
  | 'total_cycles'
  | 'litter_level'
  | 'waste_drawer'
  | 'status'
  | 'hopper_status'
  | 'hopper_connected';

/** Default footer when `footer` is omitted: cycle counts, status last changed, last seen. */
export const DEFAULT_FOOTER: FooterItem[] = [
  'total_cycles',
  'status_changed',
  'last_seen',
];

/** Robot artwork color variant. Defaults to {@link DEFAULT_COLOR}. */
export type RobotColor = 'white' | 'black';

/** Color used when `color` is omitted (preserves the original white artwork). */
export const DEFAULT_COLOR: RobotColor = 'white';

/** Default `hours_to_show` for the pet weight graph when not configured. */
export const DEFAULT_WEIGHT_HOURS_TO_SHOW = 24 * 7;

/**
 * Which underlying HA card the weight graph wraps. `history` uses the live
 * `history-graph`; `statistics` uses the long-term-statistics `statistics-graph`.
 */
export type WeightGraphType = 'history' | 'statistics';

/** Weight graph type used when `graph_type` is omitted. */
export const DEFAULT_WEIGHT_GRAPH_TYPE: WeightGraphType = 'statistics';

/** Default `days_to_show` for the statistics weight graph when not configured. */
export const DEFAULT_WEIGHT_DAYS_TO_SHOW = 30;

/** Aggregation period for the statistics weight graph. `auto` lets HA pick. */
export type WeightStatisticPeriod =
  | 'auto'
  | '5minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month';

/** Statistic series plotted by the statistics weight graph. */
export type WeightStatisticType =
  | 'change'
  | 'state'
  | 'sum'
  | 'min'
  | 'max'
  | 'mean';

/** Chart style for the statistics weight graph. */
export type WeightChartType = 'line' | 'line-stack' | 'bar' | 'bar-stack';

/** Chart style used when `chart_type` is omitted. */
export const DEFAULT_WEIGHT_CHART_TYPE: WeightChartType = 'line';

/** Statistic series used when `stat_types` is omitted. */
export const DEFAULT_WEIGHT_STAT_TYPES: WeightStatisticType[] = [
  'mean',
  'max',
  'min',
];

export interface Config {
  /** Unique identifier for the device */
  device_id: string;

  /** Optional display title */
  title?: string;

  /** Robot artwork color variant. Defaults to {@link DEFAULT_COLOR}. */
  color?: RobotColor;

  /** Options to enable or disable features **/
  features?: Features[];

  /** Footer items to show, in order. Defaults to {@link DEFAULT_FOOTER}. */
  footer?: FooterItem[];

  /** Options for the pet weight chonk */
  chonk?: {
    /**
     * Pet weight series shown in the weight graph (requires the `weight_graph`
     * feature). When omitted, the card auto-detects per-cat weight sensors.
     */
    kitties?: string[];

    /**
     * Which graph to render. `history` wraps HA's `history-graph`; `statistics`
     * wraps `statistics-graph` (long-term statistics). Defaults to
     * {@link DEFAULT_WEIGHT_GRAPH_TYPE}.
     */
    graph_type?: WeightGraphType;

    /**
     * (history graph) Hours of history shown in the weight graph. Defaults to
     * {@link DEFAULT_WEIGHT_HOURS_TO_SHOW}.
     */
    hours_to_show?: number;

    /**
     * (statistics graph) Days of statistics shown in the weight graph. Defaults
     * to {@link DEFAULT_WEIGHT_DAYS_TO_SHOW}.
     */
    days_to_show?: number;

    /**
     * (statistics graph) Aggregation period. When omitted, HA chooses
     * automatically (`auto`).
     */
    period?: WeightStatisticPeriod;

    /**
     * (statistics graph) Statistic series to plot. Defaults to
     * {@link DEFAULT_WEIGHT_STAT_TYPES}.
     */
    stat_types?: WeightStatisticType[];

    /**
     * (statistics graph) Chart style. Defaults to
     * {@link DEFAULT_WEIGHT_CHART_TYPE}.
     */
    chart_type?: WeightChartType;

    /** Whether to hide the chonk. Defaults to `false`. */
    hide?: boolean;

    /**
     * Whether to hide entity names in the weight graph. For the history graph
     * this sets `show_names: false`; for the statistics graph it sets
     * `hide_legend: true`. Defaults to `false`.
     */
    hide_names?: boolean;
  };
}

/** Features to enable or disable functionality */
export type Features = 'percentage' | 'hide_pet_weight';
