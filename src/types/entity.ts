export interface EntityState {
  /** ID of the entity this state belongs to */
  entity_id: string;

  /** Current state value as a string (e.g., "on", "off", "25.5") */
  state: string;

  /** Additional attributes associated with the state */
  attributes: Record<string, unknown>;

  /** ISO timestamp when the state value last changed (from HA state object) */
  last_changed?: string;
}
