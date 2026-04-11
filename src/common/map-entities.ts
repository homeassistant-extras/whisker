import type { EntityRegistryDisplayEntry } from '@/hass/data/entity_registry';
import { getState } from '@delegates/retrievers/state';
import type { DutyReport } from '@/types/types';
import type { HomeAssistant } from '@hass/types';

const entityIdKeyToProperty = {
  waste_drawer: 'waste_drawer',
  litter_level: 'litter_level',
  reset: 'reset',
  litter_box: 'litter_box',
  pet_weight: 'pet_weight',
  globe_light: 'globe_light',
  globe_brightness: 'globe_brightness',
  brightness_level: 'brightness_level',
  cycle_delay: 'cycle_delay',
} as const;

const stateKeyToProperty = {
  last_seen: 'last_seen',
  status_code: 'status',
} as const;

type EntityIdTranslationKey = keyof typeof entityIdKeyToProperty;
type StateTranslationKey = keyof typeof stateKeyToProperty;

/**
 * Fills {@link DutyReport} fields from entity translation keys.
 * @returns true when this entity was handled (matched a known key).
 */
export const mapEntitiesByTranslationKey = (
  hass: HomeAssistant,
  entity: EntityRegistryDisplayEntry,
  report: Partial<DutyReport>,
): boolean => {
  const key = entity.translation_key;
  if (!key) {
    return false;
  }

  if (key in stateKeyToProperty) {
    const prop = stateKeyToProperty[key as StateTranslationKey];
    const st = getState(hass, entity.entity_id);
    if (st) {
      report[prop] = st;
    }
    return true;
  }

  if (key in entityIdKeyToProperty) {
    const prop = entityIdKeyToProperty[key as EntityIdTranslationKey];
    report[prop] = entity.entity_id;
    return true;
  }

  return false;
};
