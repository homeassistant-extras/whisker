import type { PetReport } from '@/types/types';
import {
  isPetVisitsEntity,
  isPetWeightEntity,
  LITTERROBOT_PLATFORM,
} from '@common/pet-entities';
import { getDevice } from '@homeassistant-extras/hass/delegates/retrievers/device';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';

/** Name used when a pet device has none of its own. */
const UNNAMED_PET = 'Kitty';

/**
 * Collects the household's pets from Home Assistant. The integration gives each
 * pet its own device, so entities are grouped by `device_id` and the device
 * name is the pet's name.
 *
 * @param {HomeAssistant} hass - The Home Assistant instance
 * @param {string[]} [pets] - Pet device ids to keep; all pets when omitted
 * @returns {PetReport[]} One entry per pet, sorted by name
 */
export const herdKitties = (
  hass: HomeAssistant,
  pets?: string[],
): PetReport[] => {
  const wanted = pets?.length ? new Set(pets) : undefined;
  const byDevice = new Map<string, PetReport>();

  Object.values(hass.entities).forEach((entity) => {
    if (entity.platform !== LITTERROBOT_PLATFORM) return;

    const deviceId = entity.device_id;
    if (!deviceId || (wanted && !wanted.has(deviceId))) return;

    const weight = isPetWeightEntity(hass, entity);
    if (!weight && !isPetVisitsEntity(entity)) return;

    const pet = byDevice.get(deviceId) ?? {
      id: deviceId,
      name: getDevice(hass, deviceId)?.name ?? UNNAMED_PET,
    };

    if (weight) {
      pet.weight = entity.entity_id;
    } else {
      pet.visits = entity.entity_id;
    }

    byDevice.set(deviceId, pet);
  });

  return [...byDevice.values()].sort((a, b) => a.name.localeCompare(b.name));
};
