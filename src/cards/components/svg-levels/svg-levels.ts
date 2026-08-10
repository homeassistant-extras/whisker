import { DEFAULT_COLOR, type Config } from '@/types/config';
import { numericLevelFromEntityState } from '@cards/components/toilet-levels/numeric-level';
import { hasFeature } from '@homeassistant-extras/hass/common/config/feature';
import { moreInfo } from '@homeassistant-extras/hass/events/more-info';
import { HassConfigMixin } from '@homeassistant-extras/hass/mixins/hass-config-mixin';
import { SubscribeEntityStateMixin } from '@homeassistant-extras/hass/mixins/subscribe-entity-state-mixin';
import { stateDisplay } from '@homeassistant-extras/hass/render/state-display';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { LITTER_ZONE_D, ROBOT_BODY_D, WASTE_ZONE_D } from './paths';
import { litterSeverityClass, wasteZoneSeverityClass } from './severity';
import { svgLevelsStyles as styles } from './styles';

/**
 * Opt-in SVG robot silhouette with litter/waste zones colored from live levels.
 * Replaces both the marketing artwork and the thin bar gauges when enabled.
 *
 * Zone `<path>`s must live in the same `html` template as the parent `<svg>`.
 * Nested `html\`\`` fragments create HTML-namespace nodes that do not paint.
 */
@customElement('whisker-svg-levels')
export class WhiskerSvgLevels extends SubscribeEntityStateMixin(
  HassConfigMixin<typeof LitElement, Config>(LitElement),
) {
  static override readonly styles = styles;

  /** Litter level sensor entity id. */
  litter_level: string | null = null;

  /** Waste drawer sensor entity id. */
  waste_drawer: string | null = null;

  /**
   * Populate the mixin's entity list before it subscribes (same pattern as the
   * hopper badge). Ids come from the device lookup, so they don't change after
   * connect.
   */
  override connectedCallback(): void {
    this.entities = [this.litter_level, this.waste_drawer].filter(
      (id): id is string => !!id,
    );
    super.connectedCallback();
  }

  private _openLitter(): void {
    moreInfo(this, this.litter_level ?? undefined);
  }

  private _openWaste(): void {
    moreInfo(this, this.waste_drawer ?? undefined);
  }

  override render(): TemplateResult | typeof nothing {
    if (!this.litter_level && !this.waste_drawer) {
      return nothing;
    }

    const litterState = this.litter_level
      ? this.states[this.litter_level]
      : undefined;
    const wasteState = this.waste_drawer
      ? this.states[this.waste_drawer]
      : undefined;

    const litterSeverity = litterSeverityClass(
      numericLevelFromEntityState(litterState),
    );
    const wasteSeverity = wasteZoneSeverityClass(
      numericLevelFromEntityState(wasteState),
    );
    const bodyClass = `body body-${this.config?.color ?? DEFAULT_COLOR}`;

    // Keep every <path> in this same template so Lit creates SVG-namespace nodes.
    return html`
      <div class="wrap">
        <svg
          class="graphic"
          viewBox="0 0 24 24"
          role="img"
          aria-label="Litter and waste levels"
        >
          <path class=${bodyClass} fill-rule="evenodd" d=${ROBOT_BODY_D}></path>
          <path
            class="zone litter ${litterSeverity}"
            d=${LITTER_ZONE_D}
            ?hidden=${!this.litter_level}
            @click=${this._openLitter}
          ></path>
          <path
            class="zone waste ${wasteSeverity}"
            d=${WASTE_ZONE_D}
            ?hidden=${!this.waste_drawer}
            @click=${this._openWaste}
          ></path>
        </svg>
        ${hasFeature(this.config, 'percentage') && this.hass
          ? html`<div class="label-row">
              <span
                >Litter
                <span class="pct"
                  >${litterState
                    ? stateDisplay(this.hass, litterState)
                    : '—'}</span
                ></span
              >
              <span
                >Waste
                <span class="pct"
                  >${wasteState
                    ? stateDisplay(this.hass, wasteState)
                    : '—'}</span
                ></span
              >
            </div>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-svg-levels': WhiskerSvgLevels;
  }
}
