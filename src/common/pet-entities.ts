import type { EntityRegistryDisplayEntry } from '@homeassistant-extras/hass/data/entity/entity_registry';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';

/** Integration platform that owns Litter Robot / pet entities. */
export const LITTERROBOT_PLATFORM = 'litterrobot';

/** Sensor device class for pet weight entities. */
const WEIGHT_DEVICE_CLASS = 'weight';

/**
 * Translation key for the per-pet daily visit counter. Unlike pet weight (which
 * upstream registers with no translation key, hence the device-class check
 * below), `visits_today` carries no device class but does have a stable key.
 */
const VISITS_TRANSLATION_KEY = 'visits_today';

/**
 * Whether an entity is a pet's weight sensor. The robot's own `pet_weight`
 * sensor has a translation key, so it never matches here.
 */
export const isPetWeightEntity = (
  hass: HomeAssistant,
  entity: EntityRegistryDisplayEntry,
): boolean =>
  entity.translation_key === undefined &&
  hass.states[entity.entity_id]?.attributes.device_class ===
    WEIGHT_DEVICE_CLASS;

/** Whether an entity is a pet's daily visit counter. */
export const isPetVisitsEntity = (
  entity: EntityRegistryDisplayEntry,
): boolean => entity.translation_key === VISITS_TRANSLATION_KEY;
