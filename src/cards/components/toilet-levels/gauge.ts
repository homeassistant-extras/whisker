import { SubscribeEntityStateMixin } from '@cards/mixins/subscribe-entity-state-mixin';
import { openEntityMoreInfo } from '@common/open-entity-more-info';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { numericLevelFromEntityState } from './numeric-level';
import { gaugeStyles as styles } from './styles';
import { wasteSeverityClass } from './waste-severity';

@customElement('whisker-gauge')
export class WhiskerGauge extends SubscribeEntityStateMixin(LitElement) {
  static override readonly styles = styles;

  @property({ type: String, reflect: true })
  kind: 'litter' | 'waste' = 'litter';

  private _openMoreInfo(): void {
    openEntityMoreInfo(this, this.entity);
  }

  override render(): TemplateResult | typeof nothing {
    if (!this.entity) {
      return nothing;
    }
    const raw = numericLevelFromEntityState(this.state);
    const pct = Math.min(100, raw);
    const variant = this.kind === 'waste' ? wasteSeverityClass(raw) : '';
    const tip = this.kind === 'litter' ? `Litter: ${pct}%` : `Waste: ${pct}%`;
    const barClass =
      this.kind === 'litter' ? 'bar litter' : `bar waste ${variant}`.trim();

    return html`
      <div class="hit" @click=${this._openMoreInfo}>
        <span class="label"
          >${this.kind === 'litter' ? 'Litter' : 'Waste'}</span
        >
        <div class=${barClass} style=${styleMap({ '--fill': `${pct}%` })}></div>
        <span class="tooltip">${tip}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-gauge': WhiskerGauge;
  }
}
