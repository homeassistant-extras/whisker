import { getEntitySubscriptionManager } from '@delegates/entities/subscriptions';
import type { HomeAssistant } from '@hass/types';
import type { SubscriptionUnsubscribe } from '@hass/ws/types';
import type { Config } from '@type/config';
import type { EntityState } from '@type/entity';
import type { LitElement } from 'lit';
import { state } from 'lit/decorators.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mixin constructor
export type Constructor<T = object> = new (...args: any[]) => T;

export type EntityStates = Record<string, EntityState | undefined>;

/** Normalizes {@link SubscribeEntityStateMixin} `entity` to a list of entity ids. */
export const entityIds = (entity?: string | string[]): string[] => {
  if (!entity) {
    return [];
  }
  return (Array.isArray(entity) ? entity : [entity]).filter(Boolean);
};

/** When `entity` is a single id, returns that id; otherwise undefined. */
export const singleEntityId = (
  entity?: string | string[],
): string | undefined => {
  const ids = entityIds(entity);
  return ids.length === 1 ? ids[0] : undefined;
};

export interface SubscribeEntityStateElement {
  /**
   * The Home Assistant instance.
   */
  hass?: HomeAssistant;

  /**
   * The card config.
   */
  config?: Config;
}

/**
 * Mixin that subscribes to entity state changes via subscribe_entities.
 * Only notifies on meaningful changes (state/attributes), not context/last_updated.
 * Set `entity` to one or more entity ids; read `states` keyed by entity id.
 * Single-entity components can use `entityId()` and `entityState()` with no arguments.
 */
export const SubscribeEntityStateMixin = <
  T extends Constructor<LitElement & SubscribeEntityStateElement>,
>(
  superClass: T,
) => {
  class SubscribeEntityStateClass extends superClass {
    /**
     * Unsubscribe callbacks for active entity subscriptions.
     */
    private _unsubscribes: SubscriptionUnsubscribe[] = [];

    /**
     * Serialized entity id list for the active subscription (skips redundant resubscribe).
     */
    private _subscribedKey?: string;

    /**
     * The entity_id(s) to subscribe to. Set this property to specify which entity to watch.
     */
    protected entity?: string | string[];

    /**
     * The current state of each subscribed entity, keyed by entity_id.
     * Updates cause re-render of the component.
     */
    @state()
    protected states: EntityStates | undefined;

    /** Returns the subscribed entity id when {@link entity} is a single id. */
    protected entityId(): string | undefined {
      return singleEntityId(this.entity);
    }

    /**
     * Returns subscribed state for `entityId`, or the sole subscription when omitted.
     */
    protected entityState(entityId: string): EntityState | undefined;
    protected entityState(): EntityState | undefined;
    protected entityState(entityId?: string): EntityState | undefined {
      const id = entityId ?? singleEntityId(this.entity);
      if (!id) {
        return undefined;
      }
      return this.states?.[id];
    }

    /**
     * Setup the entity subscription.
     */
    override connectedCallback(): void {
      super.connectedCallback();
      this._setupEntitySubscription();
    }

    /**
     * Teardown the entity subscription.
     */
    override disconnectedCallback(): void {
      this._teardownEntitySubscription();
      super.disconnectedCallback();
    }

    /**
     * Teardown the entity subscription.
     */
    private _teardownEntitySubscription(): void {
      for (const unsubscribe of this._unsubscribes) {
        unsubscribe();
      }
      this._unsubscribes = [];
      this._subscribedKey = undefined;
    }

    /**
     * Setup the entity subscription.
     */
    private _setupEntitySubscription(): void {
      const ids = entityIds(this.entity);
      const hass = this.hass;

      if (ids.length === 0 || !hass) {
        this._teardownEntitySubscription();
        this.states = undefined;
        return;
      }

      const key = ids.join('\0');
      if (this._subscribedKey === key) {
        return;
      }

      this._teardownEntitySubscription();
      this._subscribedKey = key;

      const manager = getEntitySubscriptionManager(hass);
      const map: EntityStates = {};

      this._unsubscribes = ids.map((id) =>
        manager.subscribe(id, (entityState) => {
          map[id] = entityState;
          this.states = { ...map };
        }),
      );
    }
  }

  return SubscribeEntityStateClass;
};
