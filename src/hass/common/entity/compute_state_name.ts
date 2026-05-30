/**
 * https://github.com/home-assistant/frontend/blob/dev/src/common/entity/compute_state_name.ts
 */

import type { HassEntity } from '@hass/ws/types';
import { computeObjectId } from './compute_object_id';

/**
 * The attributes.friendly_name === undefined check is integral since we set
 * the friendly_name to an empty string for fake states so the label is blank.
 */
export const computeStateNameFromEntityAttributes = (
  entityId: string,
  attributes: Record<string, unknown>,
): string => {
  if (attributes.friendly_name === undefined) {
    return computeObjectId(entityId).replaceAll('_', ' ');
  }

  return typeof attributes.friendly_name === 'string'
    ? attributes.friendly_name
    : '';
};

export const computeStateName = (stateObj: HassEntity): string =>
  computeStateNameFromEntityAttributes(stateObj.entity_id, stateObj.attributes);
