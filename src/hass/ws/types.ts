/**
 * https://github.com/home-assistant/home-assistant-js-websocket/blob/master/lib/types.ts
 */

export type SubscriptionUnsubscribe = () => void;

export type MessageBase = {
  id?: number;
  type: string;
  [key: string]: any;
};

export type Context = {
  id: string;
  user_id: string | null;
  parent_id: string | null;
};

export type HassEntityBase = {
  entity_id: string;
  state: string;
  attributes: HassEntityAttributeBase;
};

export type HassEntityAttributeBase = {
  friendly_name?: string;
  unit_of_measurement?: string;
  icon?: string;
  entity_picture?: string;
  [key: string]: unknown;
};

export type HassEntity = HassEntityBase & {
  attributes: { [key: string]: unknown };
};

export type HassEntities = { [entity_id: string]: HassEntity };

export interface Connection {
  subscribeMessage<Result>(
    callback: (result: Result) => void,
    subscribeMessage: MessageBase,
    options?: {
      resubscribe?: boolean;
      preCheck?: () => boolean | Promise<boolean>;
    },
  ): Promise<SubscriptionUnsubscribe>;
}
