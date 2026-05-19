/**
 * Card configuration and Litter Robot state types.
 */

export interface Config {
  /** Unique identifier for the device */
  device_id: string;

  /** Optional display title */
  title?: string;

  /** Options to enable or disable features **/
  features?: Features[];
}

/** Features to enable or disable functionality */
export type Features = 'percentage';
