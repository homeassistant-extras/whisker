/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/selector.ts
 */

export type Selector = DeviceSelector | StringSelector;

export interface DeviceSelector {
  device: {
    filter?: { integration?: string };
  } | null;
}

export interface StringSelector {
  text: { type?: string };
}
