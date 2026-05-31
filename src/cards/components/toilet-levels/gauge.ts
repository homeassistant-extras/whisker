import type { Config } from '@/types/config';
import { openEntityMoreInfo } from '@common/open-entity-more-info';
import { hasFeature } from '@homeassistant-extras/hass/common/config/feature';
import { HassConfigMixin } from '@homeassistant-extras/hass/mixins/hass-config-mixin';
import { SubscribeEntityStateMixin } from '@homeassistant-extras/hass/mixins/subscribe-entity-state-mixin';
import { stateDisplay } from '@homeassistant-extras/hass/render/state-display';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { numericLevelFromEntityState } from './numeric-level';
import { gaugeStyles as styles } from './styles';
import { wasteSeverityClass } from './waste-severity';

@customElement('whisker-gauge')
export class WhiskerGauge extends SubscribeEntityStateMixin(
  HassConfigMixin<typeof LitElement, Config>(LitElement),
) {
  static override readonly styles = styles;

  @property({ type: String, reflect: true })
  kind: 'litter' | 'waste' = 'litter';

  private _openMoreInfo(): void {
    openEntityMoreInfo(this, this.entity);
  }

  override render(): TemplateResult | typeof nothing {
    if (!this.state) {
      return nothing;
    }

    const value = stateDisplay(this.hass, this.state);
    const raw = numericLevelFromEntityState(this.state);
    const pct = Math.min(100, raw);
    const variant = this.kind === 'waste' ? wasteSeverityClass(raw) : '';
    const barClass =
      this.kind === 'litter' ? 'bar litter' : `bar waste ${variant}`.trim();
    const label = this.kind === 'litter' ? 'Litter' : 'Waste';

    return html`
      <div class="hit" @click=${this._openMoreInfo}>
        ${hasFeature(this.config, 'percentage')
          ? html`<div class="label-row">
              <span class="label">${label}</span>
              <span class="pct">${value}</span>
            </div>`
          : html`<span class="label">${label}</span>`}
        <div class=${barClass} style=${styleMap({ '--fill': `${pct}%` })}></div>
        <span class="tooltip">${label}: ${value}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-gauge': WhiskerGauge;
  }
}
