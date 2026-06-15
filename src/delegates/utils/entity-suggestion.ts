import type { CustomCardSuggestion } from '@homeassistant-extras/hass/data/lovelace_custom_cards';
import { getDevice } from '@homeassistant-extras/hass/delegates/retrievers/device';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';

/** Integration that owns Litter-Robot / Whisker devices. */
const LITTERROBOT_INTEGRATION = 'litterrobot';

/**
 * Suggest a Whisker card when the picker is given a Litter-Robot entity.
 *
 * Resolves the entity to its device and only suggests when that device is
 * owned by the `litterrobot` integration, so the card stays out of the picker
 * for unrelated entities. The card is configured by `device_id`, so the
 * suggested config maps the entity back to its device rather than the entity
 * itself.
 *
 * @returns a suggestion for Litter-Robot entities, otherwise `null`.
 */
export const getEntitySuggestion = (
  hass: HomeAssistant,
  entityId: string,
): CustomCardSuggestion | null => {
  const entity = hass.entities[entityId];
  if (!entity?.device_id) return null;

  const device = getDevice(hass, entity.device_id);
  if (!device) return null;

  const isLitterRobot = device.identifiers.some(
    ([integration]) => integration === LITTERROBOT_INTEGRATION,
  );
  if (!isLitterRobot) return null;

  return {
    config: {
      type: 'custom:whisker-card',
      device_id: device.id,
    },
  };
};
