import type { ActionConfig } from '@hass/data/lovelace/config/action';
import type { HomeAssistant } from '@hass/types';
import type { EntityState } from '@type/entity';
import { html, type TemplateResult } from 'lit';

declare global {
  // eslint-disable-next-line no-var
  var loadCardHelpers: () => Promise<{
    createHuiElement: (config: StateIconPictureConfig) => LovelaceElementHost;
  }>;
}

interface StateIconPictureConfig {
  type: 'state-icon';
  entity: string;
  icon?: string;
  title?: string;
  state_color?: boolean;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

interface LovelaceElementHost extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: StateIconPictureConfig): void;
}

/**
 * Builds a `hui-state-icon-element` via HA’s `createHuiElement`, same idea as
 * device-card’s `stateContent` + `createRowElement`.
 */
function tapActionForEntity(entityId: string): ActionConfig {
  const domain = entityId.split('.', 1)[0];
  if (domain === 'vacuum') {
    return {
      action: 'call-service',
      service: 'vacuum.start',
      target: { entity_id: entityId },
    };
  }
  return {
    action: 'call-service',
    service: 'button.press',
    service_data: { entity_id: entityId },
  };
}

function iconForEntity(entityId: string): string {
  return entityId.startsWith('vacuum.') ? 'mdi:autorenew' : 'mdi:close';
}

export async function stateIconContent(
  hass: HomeAssistant,
  entityId: string,
  entityState: EntityState | undefined,
): Promise<TemplateResult> {
  const helpers = await globalThis.loadCardHelpers();
  const title =
    entityState?.attributes?.friendly_name ??
    entityId.replace(/^.*\./, '').replaceAll('_', ' ');

  const config: StateIconPictureConfig = {
    type: 'state-icon',
    entity: entityId,
    icon: iconForEntity(entityId),
    title,
    state_color: true,
    tap_action: tapActionForEntity(entityId),
    hold_action: { action: 'more-info' },
    double_tap_action: { action: 'none' },
  };

  const element = helpers.createHuiElement(config);
  element.hass = hass;

  return html` <div class="item" role="presentation">${element}</div> `;
}
