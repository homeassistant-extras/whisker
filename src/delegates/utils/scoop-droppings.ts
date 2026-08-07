import type { DutyReport } from '@/types/types';
import { mapEntitiesByTranslationKey } from '@common/map-entities';
import { getDevice } from '@homeassistant-extras/hass/delegates/retrievers/device';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import type { Config } from '@type/config';

/** Integration platform that owns Litter Robot / pet entities. */
const LITTERROBOT_PLATFORM = 'litterrobot';

/** Sensor device class for pet weight entities. */
const WEIGHT_DEVICE_CLASS = 'weight';

/**
 * Translation key for the per-pet daily visit counter. Unlike pet weight (which
 * upstream registers with no translation key, hence the device-class check
 * below), `visits_today` carries no device class but does have a stable key.
 */
const VISITS_TRANSLATION_KEY = 'visits_today';

/**
 * Get Litter Robot state from Home Assistant for the configured device.
 * Returns mock state when no real device/entities exist (e.g. preview).
 */
export const scoopDroppings = (
  hass: HomeAssistant,
  config: Config,
): DutyReport | undefined => {
  const device = getDevice(hass, config.device_id);
  if (!device) return undefined;

  // a hidden graph never renders, so skip collecting its entities entirely
  const wantsWeight = !config.chonk?.hide;
  const wantsVisits = !config.visits?.hide;

  const litterRobotState: Partial<DutyReport> = {
    name: device.name ?? 'Litter Robot',
    model: device.model ?? null,
    serial_number: device.serial_number ?? null,
    kitties: wantsWeight ? (config.chonk?.kitties ?? []) : [],
    visits: wantsVisits ? (config.visits?.kitties ?? []) : [],
  };

  Object.values(hass.entities).forEach((entity) => {
    // check if this is a whisker integration entity
    if (entity.platform !== LITTERROBOT_PLATFORM) return;

    // if this entity belongs to the configured device, map it
    if (entity.device_id === config.device_id) {
      mapEntitiesByTranslationKey(entity, litterRobotState);
      return;
    }

    // otherwise, auto-detect pet weight entities from other devices, unless
    // the user configured their own
    const isPetWeight =
      wantsWeight &&
      entity.translation_key === undefined &&
      hass.states[entity.entity_id]?.attributes.device_class ===
        WEIGHT_DEVICE_CLASS;
    if (isPetWeight && !config.chonk?.kitties?.length) {
      litterRobotState.kitties!.push(entity.entity_id);
    }

    // same for the per-pet daily visit counters
    const isPetVisits =
      wantsVisits && entity.translation_key === VISITS_TRANSLATION_KEY;
    if (isPetVisits && !config.visits?.kitties?.length) {
      litterRobotState.visits!.push(entity.entity_id);
    }
  });

  return litterRobotState as DutyReport;
};
