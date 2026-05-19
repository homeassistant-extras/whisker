/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/selector.ts
 */

export type Selector = DeviceSelector | StringSelector | SelectSelector;

export interface DeviceSelector {
  device: {
    filter?: { integration?: string };
  } | null;
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
