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

/**
 * Which underlying HA card a graph wraps. `history` uses the live
 * `history-graph`; `statistics` uses the long-term-statistics `statistics-graph`.
 */
export type GraphType = 'history' | 'statistics';

/** Aggregation period for a statistics graph. `auto` lets HA pick. */
export type StatisticPeriod =
  | 'auto'
  | '5minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month';

/** Statistic series plotted by a statistics graph. */
export type StatisticType = 'change' | 'state' | 'sum' | 'min' | 'max' | 'mean';

/** Chart style for a statistics graph. */
export type ChartType = 'line' | 'line-stack' | 'bar' | 'bar-stack';

/** Default `hours_to_show` for the pet weight graph when not configured. */
export const DEFAULT_WEIGHT_HOURS_TO_SHOW = 24 * 7;

/** Weight graph type used when `graph_type` is omitted. */
export const DEFAULT_WEIGHT_GRAPH_TYPE: GraphType = 'statistics';

/** Default `days_to_show` for the statistics weight graph when not configured. */
export const DEFAULT_WEIGHT_DAYS_TO_SHOW = 30;

/** Chart style used when the weight graph's `chart_type` is omitted. */
export const DEFAULT_WEIGHT_CHART_TYPE: ChartType = 'line';

/** Aggregation period used when the weight graph's `period` is omitted. */
export const DEFAULT_WEIGHT_PERIOD: StatisticPeriod = 'day';

/** Statistic series used when the weight graph's `stat_types` is omitted. */
export const DEFAULT_WEIGHT_STAT_TYPES: StatisticType[] = [
  'mean',
  'max',
  'min',
];

/** Visits graph type used when `graph_type` is omitted. */
export const DEFAULT_VISITS_GRAPH_TYPE: GraphType = 'statistics';

/** Default `hours_to_show` for the history visits graph when not configured. */
export const DEFAULT_VISITS_HOURS_TO_SHOW = 24 * 7;

/** Default `days_to_show` for the statistics visits graph when not configured. */
export const DEFAULT_VISITS_DAYS_TO_SHOW = 30;

/**
 * Chart style used when the visits graph's `chart_type` is omitted. Stacked
 * bars suit a daily-reset counter better than a continuous line, and show the
 * household's total visits per day alongside each cat's share.
 */
export const DEFAULT_VISITS_CHART_TYPE: ChartType = 'bar-stack';

/** Aggregation period used when the visits graph's `period` is omitted. */
export const DEFAULT_VISITS_PERIOD: StatisticPeriod = 'day';

/**
 * Statistic series used when the visits graph's `stat_types` is omitted.
 * `visits_today` is a `total` sensor that resets daily, so `change` (visits per
 * period) is the only meaningful aggregation — mean/min/max say nothing useful.
 */
export const DEFAULT_VISITS_STAT_TYPES: StatisticType[] = ['change'];

/**
 * Shared options for a pet graph section (`chonk` / `visits`). Both graphs
 * render inside a titled collapsible section; `collapsed` only controls the
 * initial open/closed state.
 */
export interface GraphSectionConfig {
  /**
   * Entity ids to plot. When omitted, the card auto-detects matching pet
   * sensors from the integration.
   */
  kitties?: string[];

  /**
   * Which graph to render. `history` wraps HA's `history-graph`; `statistics`
   * wraps `statistics-graph` (long-term statistics).
   */
  graph_type?: GraphType;

  /** (history graph) Hours of history shown. */
  hours_to_show?: number;

  /** (statistics graph) Days of statistics shown. */
  days_to_show?: number;

  /** (statistics graph) Aggregation period. */
  period?: StatisticPeriod;

  /** (statistics graph) Statistic series to plot. */
  stat_types?: StatisticType[];

  /** (statistics graph) Chart style. */
  chart_type?: ChartType;

  /** Whether to hide the graph entirely. Defaults to `false`. */
  hide?: boolean;

  /**
   * Start the graph's collapsible section closed. Viewers can expand it; the
   * choice lasts for the session and resets on reload. Defaults to `false`
   * (section starts open).
   */
  collapsed?: boolean;

  /**
   * Whether to hide entity names in the graph. For the history graph this sets
   * `show_names: false`; for the statistics graph it sets `hide_legend: true`.
   * Defaults to `false`.
   */
  hide_names?: boolean;
}

export interface Config {
  /** Unique identifier for the device */
  device_id: string;

  /** Optional display title */
  title?: string;

  /** Robot artwork color variant. Defaults to {@link DEFAULT_COLOR}. */
  color?: RobotColor;

  /**
   * Entity (input_boolean / alert / binary_sensor / switch) whose active state
   * means the unit needs cleaning. Shows a header badge + card glow.
   */
  cleaning_entity?: string;

  /** Options to enable or disable features **/
  features?: Features[];

  /** Footer items to show, in order. Defaults to {@link DEFAULT_FOOTER}. */
  footer?: FooterItem[];

  /** Options for the pet weight chonk */
  chonk?: GraphSectionConfig;

  /** Options for the pet visits graph (daily litter box visits per cat) */
  visits?: GraphSectionConfig;
}

/** Features to enable or disable functionality */
export type Features = 'percentage';
