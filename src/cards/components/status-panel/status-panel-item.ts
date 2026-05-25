import { HassConfigMixin } from '@cards/mixins/hass-config-mixin';
import type { ActionConfig } from '@hass/data/lovelace/config/action';
import { stateIcon } from '@html/state-icon-label';
import { LitElement, type nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { statusPanelItemStyles as styles } from './styles';

export type StatusPanelItemType = 'vacuum' | 'reset' | 'reset_waste_drawer';

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

function iconForPanelItem(
  itemType: StatusPanelItemType,
  entityId: string,
): string {
  switch (itemType) {
    case 'vacuum':
      return 'mdi:autorenew';
    case 'reset_waste_drawer':
      return 'mdi:delete-variant';
    case 'reset':
      return 'mdi:close';
    default:
      return entityId.startsWith('vacuum.') ? 'mdi:autorenew' : 'mdi:close';
  }
}

@customElement('whisker-status-panel-item')
export class WhiskerStatusPanelItem extends HassConfigMixin(LitElement) {
  static override readonly styles = styles;

  @property({ attribute: false })
  entity: string = '';

  @property({ type: String, reflect: true, attribute: 'item-type' })
  itemType: StatusPanelItemType = 'reset';

  override render(): HTMLElement | typeof nothing {
    return stateIcon(this.hass, this.entity, {
      icon: iconForPanelItem(this.itemType, this.entity),
      state_color: true,
      tap_action: tapActionForEntity(this.entity),
      hold_action: { action: 'more-info' },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-status-panel-item': WhiskerStatusPanelItem;
  }
}
