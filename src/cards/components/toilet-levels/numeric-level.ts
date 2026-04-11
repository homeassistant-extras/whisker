import type { EntityState } from '@type/entity';

/**
 * Parses a finite percentage (or level) from an entity state string for gauge display.
 */
export function numericLevelFromEntityState(
  state: EntityState | undefined,
): number {
  if (!state) {
    return 0;
  }
  const raw = state.state;
  if (raw == null || raw === '') {
    return 0;
  }
  const n = Number.parseFloat(String(raw));
  return Number.isFinite(n) ? n : 0;
}
