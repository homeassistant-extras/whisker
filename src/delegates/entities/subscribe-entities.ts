/**
 * Shared helpers for processing subscribe_entities state diff format.
 * Used by entity-subscription-manager.
 *
 * @see https://developers.home-assistant.io/docs/api/websocket#subscribe_entities
 */

import type { EntityState } from '@/types/entity';
import type {
  EntityDiff,
  EntityState as HassEntityState,
} from '@hass/ws/entities';

const COMPRESSED_STATE = 's';
const COMPRESSED_ATTRIBUTES = 'a';

export function compressedToEntityState(
  entityId: string,
  comp: HassEntityState,
): EntityState {
  return {
    entity_id: entityId,
    state: comp.s,
    attributes: comp.a ?? {},
    last_changed: new Date(comp.lc * 1000).toISOString(),
  };
}

export function isMeaningfulChange(diff: EntityDiff): boolean {
  const add = diff['+'];
  const remove = diff['-'];
  return (
    add?.[COMPRESSED_STATE] !== undefined ||
    add?.[COMPRESSED_ATTRIBUTES] !== undefined ||
    (remove?.a?.length !== undefined && remove.a.length > 0)
  );
}

export function applyDiff(
  current: EntityState,
  entityId: string,
  diff: EntityDiff,
): EntityState {
  const add = diff['+'];
  const remove = diff['-'];
  let state = current.state;
  let last_changed = current.last_changed;
  const attributes = { ...current.attributes };

  if (add) {
    if (add.s !== undefined) state = add.s;
    if (add.a) Object.assign(attributes, add.a);
    if (add.lc) last_changed = new Date(add.lc * 1000).toISOString();
  }
  if (remove?.a) {
    for (const key of remove.a) delete attributes[key];
  }

  return {
    entity_id: entityId,
    state,
    attributes,
    last_changed,
  };
}
