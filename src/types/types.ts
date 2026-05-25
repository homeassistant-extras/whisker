/** Resolved state for the Litter Robot visualization
 *  Super minimal so this cuts back on re-renders
 */
export interface DutyReport {
  /** Name of the Litter Robot */
  name: string;

  /** Device model string (e.g. "Litter-Robot 5 Pro"), when reported. */
  model?: string | null;

  /** Device serial number (e.g. "LR5-..."); its prefix selects the artwork. */
  serial_number?: string | null;

  /** Entity id for waste drawer level sensor */
  waste_drawer: string | null;

  /** Entity id for litter level sensor */
  litter_level: string | null;

  /** Status code sensor (`translation_key` status_code), when present */
  status?: string | null;

  /** Entity id for reset button (LR4+), when present */
  reset: string | null;

  /** Reset waste drawer button (`translation_key` reset_waste_drawer), when enabled */
  reset_waste_drawer?: string | null;

  /**
   * Main litter box vacuum entity (`translation_key` litter_box in Whisker integration).
   * Tap triggers `vacuum.start` (clean cycle).
   */
  litter_box?: string | null;

  /** Entity id for pet weight sensor (translation_key pet_weight), when present */
  pet_weight?: string | null;

  /** Last seen sensor entity id (from translation_key last_seen), when present */
  last_seen?: string | null;

  /** Total cycles sensor entity id (translation_key total_cycles), when present */
  total_cycles?: string | null;

  /** Entity id for globe light select (`translation_key` globe_light) */
  globe_light?: string | null;

  /** Entity id for globe brightness select (`translation_key` globe_brightness) */
  globe_brightness?: string | null;

  /** Entity id for panel brightness select (`translation_key` brightness_level) */
  brightness_level?: string | null;

  /** Entity id for cycle delay select (`translation_key` cycle_delay) */
  cycle_delay?: string | null;

  /** Panel lockout switch (`translation_key` panel_lockout), when enabled */
  panel_lockout?: string | null;
}
