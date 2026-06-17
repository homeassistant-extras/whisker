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
 * Get Litter Robot state from Home Assistant for the configured device.
 * Returns mock state when no real device/entities exist (e.g. preview).
 */
export const scoopDroppings = (
  hass: HomeAssistant,
  config: Config,
): DutyReport | undefined => {
  const device = getDevice(hass, config.device_id);
  if (!device) return undefined;

  const litterRobotState: Partial<DutyReport> = {
    name: device.name ?? 'Litter Robot',
    model: device.model ?? null,
    serial_number: device.serial_number ?? null,
    kitties: config.chonk?.kitties ?? [],
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
      entity.translation_key === undefined &&
      hass.states[entity.entity_id]?.attributes.device_class ===
        WEIGHT_DEVICE_CLASS;
    if (isPetWeight && !config.chonk?.kitties?.length) {
      litterRobotState.kitties!.push(entity.entity_id);
    }
  });

  return litterRobotState as DutyReport;
};
