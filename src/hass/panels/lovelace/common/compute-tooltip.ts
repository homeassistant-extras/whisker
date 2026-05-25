/**
 * https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/common/compute-tooltip.ts
 */

import { computeStateName } from '@hass/common/entity/compute_state_name';
import type { ActionConfig } from '@hass/data/lovelace/config/action';
import type { HomeAssistant } from '@hass/types';

export interface TooltipConfig {
  entity?: string;
  title?: string | null;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

function computeActionTooltip(
  hass: HomeAssistant,
  state: string,
  config: ActionConfig,
  isHold: boolean,
): string {
  if (!config?.action || config.action === 'none') {
    return '';
  }

  const localize = hass.localize ?? ((key: string) => key);

  let tooltip = isHold
    ? localize('ui.panel.lovelace.cards.picture-elements.hold')
    : localize('ui.panel.lovelace.cards.picture-elements.tap');

  switch (config.action) {
    case 'navigate':
      tooltip += ` ${localize(
        'ui.panel.lovelace.cards.picture-elements.navigate_to',
        { location: (config as { navigation_path?: string }).navigation_path },
      )}`;
      break;
    case 'url':
      tooltip += ` ${localize('ui.panel.lovelace.cards.picture-elements.url', {
        url_path: (config as { url_path?: string }).url_path,
      })}`;
      break;
    case 'toggle':
      tooltip += ` ${localize(
        'ui.panel.lovelace.cards.picture-elements.toggle',
        { name: state },
      )}`;
      break;
    case 'call-service':
      tooltip += `${localize(
        'ui.panel.lovelace.cards.picture-elements.perform_action',
        { name: (config as { service?: string }).service },
      )}`;
      break;
    case 'more-info':
      tooltip += `${localize(
        'ui.panel.lovelace.cards.picture-elements.more_info',
        { name: state },
      )}`;
      break;
  }

  return tooltip;
}

export const computeTooltip = (
  hass: HomeAssistant,
  config: TooltipConfig,
): string => {
  if (config.title === null) {
    return '';
  }

  if (config.title) {
    return config.title;
  }

  let stateName = '';
  if (config.entity) {
    stateName =
      config.entity in hass.states
        ? computeStateName(hass.states[config.entity]!)
        : config.entity;
  }

  if (!config.tap_action && !config.hold_action) {
    return stateName;
  }

  const tapTooltip = config.tap_action
    ? computeActionTooltip(hass, stateName, config.tap_action, false)
    : '';
  const holdTooltip = config.hold_action
    ? computeActionTooltip(hass, stateName, config.hold_action, true)
    : '';

  const newline = tapTooltip && holdTooltip ? '\n' : '';

  return tapTooltip + newline + holdTooltip;
};
