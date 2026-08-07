import type { Config } from '@/types/config';
import '@cards/components/collapsible-section';
import { graphStyles as styles } from '@cards/components/graph-styles';
import {
  buildGraphConfig,
  type GraphDefaults,
  type GraphOptions,
} from '@delegates/utils/graph-config';
import { HassConfigMixin } from '@homeassistant-extras/hass/mixins/hass-config-mixin';
import { createCardElement } from '@homeassistant-extras/hass/render/create-card-element';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * Renders a pet metric graph by wrapping one of HA's built-in graph cards.
 * Shared by weight and visits — callers pass the section header, entities,
 * user options, and per-graph defaults.
 */
@customElement('whisker-pet-graph')
export class WhiskerPetGraph extends HassConfigMixin<typeof LitElement, Config>(
  LitElement,
) {
  /**
   * Returns the component's styles
   */
  static override readonly styles = styles;

  /** Title shown on the collapsible section. */
  @property({ attribute: false })
  header = '';

  /** Entity ids to plot. */
  @property({ attribute: false })
  kitties: string[] = [];

  /** User-supplied graph options for this section. */
  @property({ attribute: false })
  options?: GraphOptions;

  /** Fallbacks for unset options. */
  @property({ attribute: false })
  defaults!: GraphDefaults;

  /**
   * Set once the viewer expands the section. While the section is collapsed,
   * `ha-expansion-panel` does not render its slot, so a card created then
   * initializes its chart with empty computed styles (black bars). We defer
   * creating the card until the panel is first expanded; once revealed it
   * stays mounted across later viewer collapses.
   */
  @state()
  private _revealed = false;

  /**
   * renders the lit element card
   * @returns {TemplateResult} The rendered HTML template
   */
  override render(): TemplateResult | typeof nothing {
    if (!this.kitties.length || !this.defaults) {
      return nothing;
    }

    // an initially-open section reveals immediately
    const revealed = this._revealed || !this.options?.collapsed;

    return html`<whisker-collapsible-section
      .header=${this.header}
      .collapsed=${!!this.options?.collapsed}
      @expanded-will-change=${this._onExpandedWillChange}
    >
      ${revealed
        ? html`<div class="graph">
            ${createCardElement(
              this.hass,
              buildGraphConfig(this.kitties, this.options, this.defaults),
            )}
          </div>`
        : nothing}
    </whisker-collapsible-section>`;
  }

  /**
   * `expanded-will-change` fires before the panel measures its content
   * height, so revealing here lets the card render (Lit updates in a
   * microtask) before the open animation is measured.
   */
  private _onExpandedWillChange(ev: CustomEvent<{ expanded: boolean }>): void {
    if (ev.detail?.expanded) {
      this._revealed = true;
    }
  }
}
