import { SubscribeEntityStateMixin } from '@cards/mixins/subscribe-entity-state-mixin';
import { Task } from '@lit/task';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { stateIconContent } from './state-icon-content';
import { statusPanelItemStyles as styles } from './styles';

export type StatusPanelItemType = 'vacuum' | 'reset';

@customElement('whisker-status-panel-item')
export class WhiskerStatusPanelItem extends SubscribeEntityStateMixin(
  LitElement,
) {
  static override readonly styles = styles;

  @property({ type: String, reflect: true, attribute: 'item-type' })
  itemType: StatusPanelItemType = 'reset';

  private readonly _stateIconTask = new Task(this, {
    task: async ([entityId, hass, entityState]) => {
      if (!entityId || !hass) {
        return html``;
      }
      return stateIconContent(hass, entityId, entityState);
    },
    args: () => [this.entity, this.hass, this.state],
  });

  override render(): TemplateResult | typeof nothing {
    if (!this.entity) {
      return nothing;
    }

    return html`${this._stateIconTask.render({
      initial: () => nothing,
      pending: () => nothing,
      error: () => nothing,
      complete: (content) => content,
    })}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-status-panel-item': WhiskerStatusPanelItem;
  }
}
