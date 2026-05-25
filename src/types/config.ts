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
  | 'status';

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
}

/** Features to enable or disable functionality */
export type Features = 'percentage';
