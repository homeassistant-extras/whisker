import { SubscribeEntityStateMixin } from '@cards/mixins/subscribe-entity-state-mixin';
import { openEntityMoreInfo } from '@common/open-entity-more-info';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { chonkStyles as styles } from './styles';

@customElement('whisker-chonk')
export class WhiskerChonk extends SubscribeEntityStateMixin(LitElement) {
  static override readonly styles = styles;

  private _onChipClick(): void {
    openEntityMoreInfo(this, this.entity);
  }

  override render(): TemplateResult | typeof nothing {
    if (!this.state) {
      return nothing;
    }

    return html`
      <div
        class="chip"
        part="chip"
        role="button"
        tabindex="0"
        @click=${this._onChipClick}
        @keydown=${this._onChipKeydown}
      >
        <ha-icon icon="mdi:scale-bathroom"></ha-icon>
        <state-display
          .hass=${this.hass}
          .stateObj=${this.state}
        ></state-display>
      </div>
    `;
  }

  private _onChipKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this._onChipClick();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-chonk': WhiskerChonk;
  }
}
