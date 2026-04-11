import type { EntityState } from '@/types/entity';
import type { HomeAssistant } from '@hass/types';

/**
 * Retrieves the state of an entity
 *
 * @param {HomeAssistant} hass - The Home Assistant instance
 * @param {string} [entityId] - The ID of the entity
 * @returns {State | undefined} The entity's state or undefined
 */

export const getState = (
  hass: HomeAssistant,
  entityId?: string,
): EntityState | undefined => {
  if (!entityId) return undefined;

  const state = (hass.states as { [key: string]: any })[entityId];

  if (!state) return undefined;

  return {
    state: state.state,
    attributes: state.attributes,
    entity_id: state.entity_id,
  };
};

/**
 * Parses the entity's state string as a finite number, or null if missing/invalid.
 */
export const getStateFloat = (
  hass: HomeAssistant,
  entityId?: string,
): number | null => {
  const s = getState(hass, entityId);
  if (s?.state == null || s.state === '') return null;
  const n = Number.parseFloat(s.state);
  return Number.isFinite(n) ? n : null;
};
