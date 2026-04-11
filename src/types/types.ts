import type { EntityState } from '@/types/entity';

/** Resolved state for the Litter Robot visualization */

export interface DutyReport {
  /** Name of the Litter Robot */
  name: string;

  /** Entity id for waste drawer level sensor */
  waste_drawer: string | null;

  /** Entity id for litter level sensor */
  litter_level: string | null;

  /** Status code sensor (`translation_key` status_code), when present */
  status?: EntityState;

  /** Entity id for reset button (LR4+) or reset waste drawer (LR3) */
  reset: string | null;

  /**
   * Main litter box vacuum entity (`translation_key` litter_box in Whisker integration).
   * Tap triggers `vacuum.start` (clean cycle).
   */
  litter_box?: string | null;

  /** Entity id for pet weight sensor (translation_key pet_weight), when present */
  pet_weight?: string | null;

  /** Last seen sensor state (from translation_key last_seen), when present */
  last_seen?: EntityState;

  /** Entity id for globe light select (`translation_key` globe_light) */
  globe_light?: string | null;

  /** Entity id for globe brightness select (`translation_key` globe_brightness) */
  globe_brightness?: string | null;

  /** Entity id for panel brightness select (`translation_key` brightness_level) */
  brightness_level?: string | null;

  /** Entity id for cycle delay select (`translation_key` cycle_delay) */
  cycle_delay?: string | null;
}
