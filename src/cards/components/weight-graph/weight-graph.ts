import type { LovelaceCardConfig } from '@homeassistant-extras/hass/data/lovelace/config/card';
import { HassConfigMixin } from '@homeassistant-extras/hass/mixins/hass-config-mixin';
import { createCardElement } from '@homeassistant-extras/hass/render/create-card-element';
import {
  DEFAULT_WEIGHT_CHART_TYPE,
  DEFAULT_WEIGHT_DAYS_TO_SHOW,
  DEFAULT_WEIGHT_GRAPH_TYPE,
  DEFAULT_WEIGHT_HOURS_TO_SHOW,
  DEFAULT_WEIGHT_STAT_TYPES,
  type Config,
} from '@type/config';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { weightGraphStyles as styles } from './styles';

/**
 * Renders pet weight by wrapping one of HA's built-in graph cards, created
 * through the loaded card helpers (no charting dependency bundled). Defaults to
 * the live `history-graph`, but can render the long-term-statistics
 * `statistics-graph` instead via the `graph_type` config option.
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

    return html`<div class="weight-graph">
      ${createCardElement(this.hass, this._graphConfig())}
    </div>`;
  }

  /**
   * Builds the wrapped card config for the configured `graph_type`.
   * @returns {LovelaceCardConfig} The history-graph or statistics-graph config
   */
  private _graphConfig(): LovelaceCardConfig {
    const chonk = this.config.chonk;

    if ((chonk?.graph_type ?? DEFAULT_WEIGHT_GRAPH_TYPE) === 'statistics') {
      return {
        type: 'statistics-graph',
        entities: this.kitties,
        days_to_show: chonk?.days_to_show ?? DEFAULT_WEIGHT_DAYS_TO_SHOW,
        stat_types: chonk?.stat_types?.length
          ? chonk.stat_types
          : DEFAULT_WEIGHT_STAT_TYPES,
        chart_type: chonk?.chart_type ?? DEFAULT_WEIGHT_CHART_TYPE,
        hide_legend: !!chonk?.hide_names,
        period: chonk?.period ?? 'day',
      };
    }

    return {
      type: 'history-graph',
      entities: this.kitties,
      hours_to_show: chonk?.hours_to_show ?? DEFAULT_WEIGHT_HOURS_TO_SHOW,
      show_names: !chonk?.hide_names,
    };
  }
}
