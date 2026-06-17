import { HassConfigMixin } from '@homeassistant-extras/hass/mixins/hass-config-mixin';
import { createCardElement } from '@homeassistant-extras/hass/render/create-card-element';
import { DEFAULT_WEIGHT_HOURS_TO_SHOW, type Config } from '@type/config';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { weightGraphStyles as styles } from './styles';

/**
 * Renders pet weight history by wrapping HA's built-in `history-graph` card,
 * created through the loaded card helpers (no charting dependency bundled).
 */
@customElement('whisker-weight-graph')
export class WhiskerWeightGraph extends HassConfigMixin<
  typeof LitElement,
  Config
>(LitElement) {
  /**
   * Returns the component's styles
   */
  static override readonly styles = styles;

  /**
   * The entities to show in the weight graph
   */
  @property({ attribute: false })
  kitties: string[] = [];

  /**
   * renders the lit element card
   * @returns {TemplateResult} The rendered HTML template
   */
  override render(): TemplateResult | typeof nothing {
    if (!this.kitties.length) {
      return nothing;
    }

    const hoursToShow =
      this.config.chonk?.hours_to_show ?? DEFAULT_WEIGHT_HOURS_TO_SHOW;

    return html`<div class="weight-graph">
      ${createCardElement(this.hass, {
        type: 'history-graph',
        entities: this.kitties,
        hours_to_show: hoursToShow,
        show_names: !this.config.chonk?.hide_names,
      })}
    </div>`;
  }
}
