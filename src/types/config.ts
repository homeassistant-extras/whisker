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

    /** Hours of history shown in the weight graph. Defaults to {@link DEFAULT_WEIGHT_HOURS_TO_SHOW}. */
    hours_to_show?: number;

    /** Whether to hide the chonk. Defaults to `false`. */
    hide?: boolean;

    /**
     * Whether to hide entity names in the weight graph. When `true`, the
     * underlying `history-graph` card is created with `show_names: false`.
     * Defaults to `false`.
     */
    hide_names?: boolean;
  };
}

/** Features to enable or disable functionality */
export type Features = 'percentage' | 'hide_pet_weight';
