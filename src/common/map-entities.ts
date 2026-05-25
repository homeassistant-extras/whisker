import type { EntityRegistryDisplayEntry } from '@/hass/data/entity_registry';
import type { DutyReport } from '@/types/types';
import type { HomeAssistant } from '@hass/types';

const entityIdKeyToProperty = {
  waste_drawer: 'waste_drawer',
  litter_level: 'litter_level',
  reset: 'reset',
  reset_waste_drawer: 'reset_waste_drawer',
  litter_box: 'litter_box',
  pet_weight: 'pet_weight',
  globe_light: 'globe_light',
  globe_brightness: 'globe_brightness',
  brightness_level: 'brightness_level',
  cycle_delay: 'cycle_delay',
  panel_lockout: 'panel_lockout',
  total_cycles: 'total_cycles',
  last_seen: 'last_seen',
  status_code: 'status',
} as const;

type EntityIdTranslationKey = keyof typeof entityIdKeyToProperty;

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

  if (key in entityIdKeyToProperty) {
    const prop = entityIdKeyToProperty[key as EntityIdTranslationKey];
    report[prop] = entity.entity_id;
    return true;
  }

  return false;
};
