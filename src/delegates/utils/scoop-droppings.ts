import type { DutyReport } from '@/types/types';
import { mapEntitiesByTranslationKey } from '@common/map-entities';
import { getDevice } from '@delegates/retrievers/device';
import type { HomeAssistant } from '@hass/types';
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

  const litterRobotState: Partial<DutyReport> = {
    name: device.name ?? 'Litter Robot',
  };

  Object.values(hass.entities).forEach((entity) => {
    if (entity.device_id !== config.device_id) return;
    mapEntitiesByTranslationKey(hass, entity, litterRobotState);
  });

  return litterRobotState as DutyReport;
};
