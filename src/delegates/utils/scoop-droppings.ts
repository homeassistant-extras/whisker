import type { DutyReport } from '@/types/types';
import { mapEntitiesByTranslationKey } from '@common/map-entities';
import {
  isPetVisitsEntity,
  isPetWeightEntity,
  LITTERROBOT_PLATFORM,
} from '@common/pet-entities';
import { getDevice } from '@homeassistant-extras/hass/delegates/retrievers/device';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import type { Config } from '@type/config';

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
    const isPetWeight = wantsWeight && isPetWeightEntity(hass, entity);
    if (isPetWeight && !config.chonk?.kitties?.length) {
      litterRobotState.kitties!.push(entity.entity_id);
    }

    // same for the per-pet daily visit counters
    const isPetVisits = wantsVisits && isPetVisitsEntity(entity);
    if (isPetVisits && !config.visits?.kitties?.length) {
      litterRobotState.visits!.push(entity.entity_id);
    }
  });

  return litterRobotState as DutyReport;
};
