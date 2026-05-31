import type { Config } from '@/types/config';
import type { DutyReport } from '@/types/types';
import { resolveFooterSlots as resolveFooterItems } from '@common/resolve-footer-items';
import { HassConfigMixin } from '@homeassistant-extras/hass/mixins/hass-config-mixin';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import './footer-item';
import { footerStyles as styles } from './styles';

@customElement('whisker-card-footer')
export class WhiskerCardFooter extends HassConfigMixin<
  typeof LitElement,
  Config
>(LitElement) {
  static override readonly styles = styles;

  @property({ attribute: false })
  duty?: DutyReport;

  /**
   * renders the lit element card
   * @returns {TemplateResult} The rendered HTML template
   */
  override render(): TemplateResult | typeof nothing {
    if (!this.duty) {
      return nothing;
    }

    const items = resolveFooterItems(this.config, this.duty);
    if (!items.length) {
      return nothing;
    }

    return html`
      <div class="footer">
        ${repeat(
          items,
          (item) => `${item.key}:${item.entity}`,
          (item) => html`
            <whisker-card-footer-item
              .hass=${this.hass}
              .config=${this.config}
              .item=${item}
            ></whisker-card-footer-item>
          `,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-card-footer': WhiskerCardFooter;
  }
}
