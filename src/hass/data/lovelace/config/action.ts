/**
 * https://github.com/home-assistant/frontend/blob/dev/src/data/lovelace/config/action.ts
 */

export interface ToggleActionConfig extends BaseActionConfig {
  action: 'toggle';
}

export interface NavigateActionConfig extends BaseActionConfig {
  action: 'navigate';
  navigation_path: string;
  navigation_replace?: boolean;
}

export interface MoreInfoActionConfig extends BaseActionConfig {
  action: 'more-info';
}

export interface NoActionConfig extends BaseActionConfig {
  action: 'none';
}

export interface UrlActionConfig extends BaseActionConfig {
  action: 'url';
  url_path: string;
}

export interface CallServiceActionConfig extends BaseActionConfig {
  action: 'call-service';
  service?: string;
  service_data?: Record<string, unknown>;
  target?: Record<string, unknown>;
}

export interface BaseActionConfig {
  action: string;
}

export type ActionConfig =
  | ToggleActionConfig
  | NavigateActionConfig
  | NoActionConfig
  | MoreInfoActionConfig
  | UrlActionConfig
  | CallServiceActionConfig;
