import { getPoatCardHelpers } from '@/helpers/card-helpers';
import type { ActionConfig } from '@hass/data/lovelace/config/action';
import type { LovelaceElementConfig } from '@hass/panels/lovelace/elements/types';
import type { HomeAssistant } from '@hass/types';
import { html, nothing, type TemplateResult } from 'lit';

export const HOLD_AND_DOUBLE_TAP_NONE = {
  hold_action: { action: 'none' as const },
  double_tap_action: { action: 'none' as const },
};

export interface StateIconOptions {
  state_color?: boolean;
  icon?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export interface StateIconLabelOptions {
  state_color?: boolean;
  icon?: string;
  wrapperClass?: string;
}

export function createHuiElement(
  hass: HomeAssistant,
  config: LovelaceElementConfig,
): HTMLElement | typeof nothing {
  const helpers = getPoatCardHelpers();
  if (!helpers) {
    return nothing;
  }

  const element = helpers.createHuiElement(config);
  element.hass = hass;
  return element;
}

/**
 * Renders a `hui-state-icon-element` via HA's `createHuiElement`.
 */
export const stateIcon = (
  hass: HomeAssistant,
  entityId: string,
  options: StateIconOptions = {},
): HTMLElement | typeof nothing => {
  const { state_color, icon, tap_action, hold_action, double_tap_action } =
    options;

  return createHuiElement(hass, {
    type: 'state-icon',
    entity: entityId,
    ...(state_color !== undefined && { state_color }),
    ...(icon !== undefined && { icon }),
    ...(tap_action !== undefined && { tap_action }),
    ...(hold_action !== undefined && { hold_action }),
    ...(double_tap_action !== undefined && { double_tap_action }),
  });
};

/**
 * Renders a `hui-state-label-element` via HA's `createHuiElement`.
 */
export const stateLabel = (
  hass: HomeAssistant | undefined,
  entityId: string | undefined,
): HTMLElement | typeof nothing => {
  if (!hass || !entityId) {
    return nothing;
  }

  return createHuiElement(hass, {
    type: 'state-label',
    entity: entityId,
    ...HOLD_AND_DOUBLE_TAP_NONE,
  });
};

/**
 * Renders paired `hui-state-icon-element` and `hui-state-label-element` via HA's
 * `createHuiElement`, matching footer config slots and similar chip UIs.
 */
export const stateIconLabel = (
  hass: HomeAssistant | undefined,
  entityId: string | undefined,
  options: StateIconLabelOptions = {},
): TemplateResult | typeof nothing => {
  if (!hass || !entityId) {
    return nothing;
  }

  const { state_color, icon, wrapperClass } = options;

  const iconElement = stateIcon(hass, entityId, {
    state_color,
    icon,
    ...HOLD_AND_DOUBLE_TAP_NONE,
  });

  const labelElement = stateLabel(hass, entityId);

  if (iconElement === nothing || labelElement === nothing) {
    return nothing;
  }

  const content = html`${iconElement} ${labelElement}`;

  if (wrapperClass) {
    return html`
      <div class=${wrapperClass} part=${wrapperClass} role="presentation">
        ${content}
      </div>
    `;
  }

  return content;
};
