import {
  isPetVisitsEntity,
  isPetWeightEntity,
  LITTERROBOT_PLATFORM,
} from '@common/pet-entities';
import type { EntityRegistryDisplayEntry } from '@homeassistant-extras/hass/data/entity/entity_registry';
import type { CustomCardSuggestion } from '@homeassistant-extras/hass/data/lovelace_custom_cards';
import { getDevice } from '@homeassistant-extras/hass/delegates/retrievers/device';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';

/**
 * Whether this Litter-Robot entity belongs to a pet (weight or visits) rather
 * than a robot. Weight needs a live state for its device class; visits does not.
 */
const isLitterRobotPetEntity = (
  hass: HomeAssistant,
  entity: EntityRegistryDisplayEntry,
): boolean =>
  entity.platform === LITTERROBOT_PLATFORM &&
  (isPetVisitsEntity(entity) ||
    (!!hass.states?.[entity.entity_id] && isPetWeightEntity(hass, entity)));

/**
 * Suggest a Whisker card when the picker is given a Litter-Robot entity.
 *
 * Resolves the entity to its device and only suggests when that device is
 * owned by the `litterrobot` integration, so the card stays out of the picker
 * for unrelated entities. Pet sensors are left to {@link getPetEntitySuggestion}.
 * The card is configured by `device_id`, so the suggested config maps the
 * entity back to its device rather than the entity itself.
 *
 * @returns a suggestion for Litter-Robot entities, otherwise `null`.
 */
export const getEntitySuggestion = (
  hass: HomeAssistant,
  entityId: string,
): CustomCardSuggestion | null => {
  const entity = hass.entities[entityId];
  if (!entity?.device_id) return null;
  if (isLitterRobotPetEntity(hass, entity)) return null;

  const device = getDevice(hass, entity.device_id);
  if (!device) return null;

  const isLitterRobot = device.identifiers.some(
    ([integration]) => integration === LITTERROBOT_PLATFORM,
  );
  if (!isLitterRobot) return null;

  return {
    config: {
      type: 'custom:whisker-card',
      device_id: device.id,
    },
  };
};

/**
 * Suggest the pet card when the picker is given a pet weight or visits sensor.
 *
 * Each pet is its own device, and the card is configured by those device ids,
 * so the suggestion is the picked pet rather than every cat in the house.
 *
 * @returns a suggestion for pet entities, otherwise `null`.
 */
export const getPetEntitySuggestion = (
  hass: HomeAssistant,
  entityId: string,
): CustomCardSuggestion | null => {
  const entity = hass.entities[entityId];
  if (!entity?.device_id) return null;
  if (!isLitterRobotPetEntity(hass, entity)) return null;

  const device = getDevice(hass, entity.device_id);
  if (!device) return null;

  return {
    config: {
      type: 'custom:whisker-pet-card',
      pets: [device.id],
    },
  };
};
