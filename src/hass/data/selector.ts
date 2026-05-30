/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/selector.ts
 */

export type Selector = DeviceSelector | StringSelector | SelectSelector;

export interface DeviceSelector {
  device: {
    filter?: DeviceSelectorFilter | DeviceSelectorFilter[];
    entity?: EntitySelectorFilter | EntitySelectorFilter[];
    multiple?: boolean;
  } | null;
}

export interface DeviceSelectorFilter {
  integration?: string;
  manufacturer?: string;
  model?: string;
  model_id?: string;
}

export interface EntitySelectorFilter {
  integration?: string;
  domain?: string | string[];
  device_class?: string | string[];
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectSelector {
  select: {
    multiple?: boolean;
    options: readonly string[] | readonly SelectOption[];
  } | null;
}

export interface StringSelector {
  text: { type?: string };
}
