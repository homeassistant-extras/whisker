import '@/cards/components/chonk/chonk';
import '@/cards/components/controls/controls-entity';
import '@/cards/components/status-panel/status-panel';
import '@/cards/components/status/status';
import { scoopDroppings } from '@/delegates/utils/scoop-droppings';
import type { DutyReport } from '@/types/types';
import { styles } from '@cards/robot/styles';
import { isLitterRobotCycling } from '@common/litterrobot-status';
import type { HomeAssistant } from '@hass/types';
import type { Config } from '@type/config';
import { CSSResult, html, LitElement, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { robotImageSrc } from './assets';
const equal = require('fast-deep-equal');

export class WhiskerCard extends LitElement {
  /**
   * Card configuration object
   */
  private _config!: Config;

  /**
   * Reflected while `status_code` indicates a running cycle (ccp / ec / cst).
   * Drives CSS on the card and in descendant panel items (`:host-context`).
   */
  @property({ type: Boolean, reflect: true })
  cycling = false;

  /**
   * Duty report object
   */
  @state()
  private _duty: DutyReport | undefined;

  /**
   * Home Assistant instance
   */
  private _hass!: HomeAssistant;

  /**
   * Returns the component's styles
   */
  static override get styles(): CSSResult {
    return styles;
  }

  /**
   * Sets up the card configuration
   * @param {Config} config - The card configuration
   */
  setConfig(config: Config) {
    if (!equal(config, this._config)) {
      this._config = config;
    }
  }

  /**
   * Updates the card's state when Home Assistant state changes
   * @param {HomeAssistant} hass - The Home Assistant instance
   */
  set hass(hass: HomeAssistant) {
    this._hass = hass;
    const scoopedDuty = scoopDroppings(hass, this._config);
    this.cycling = isLitterRobotCycling(scoopedDuty?.status?.state);

    if (!equal(scoopedDuty, this._duty)) {
      this._duty = scoopedDuty;
    }
  }

  // card configuration
  static getConfigElement() {
    return document.createElement('whisker-card-editor');
  }

  /**
   * Returns a stub configuration for the card
   * @param {HomeAssistant} hass - The Home Assistant instance
   */
  static async getStubConfig(hass: HomeAssistant): Promise<Config> {
    const bot = Object.values(hass.devices).find((d) =>
      d.identifiers?.some(
        ([domain]: [string, string]) => domain === 'litterrobot',
      ),
    );

    return {
      device_id: bot?.id ?? '',
    };
  }

  /**
   * renders the lit element card
   * @returns {TemplateResult} The rendered HTML template
   */
  override render(): TemplateResult | typeof nothing {
    if (!this._duty) {
      return nothing;
    }

    const title = this._config?.title ?? this._duty.name;
    return html`
      <ha-card>
        <div class="card-title-row">
          <h2 class="card-title">${title}</h2>
          <whisker-litter-status
            .hass=${this._hass}
            .entity=${this._duty.status?.entity_id}
          ></whisker-litter-status>
        </div>
        <div class="robot-image-stack">
          <div class="status-panel-row">
            <div class="status-panel-wrap">
              <whisker-status-panel
                .hass=${this._hass}
                .resetEntity=${this._duty.reset}
                .litterBoxEntity=${this._duty.litter_box ?? null}
              ></whisker-status-panel>
            </div>
            <whisker-controls-entity
              .hass=${this._hass}
              .globeLightEntity=${this._duty.globe_light}
              .globeBrightnessEntity=${this._duty.globe_brightness}
              .panelBrightnessEntity=${this._duty.brightness_level}
              .cycleDelayEntity=${this._duty.cycle_delay}
            ></whisker-controls-entity>
          </div>
          <whisker-chonk
            class="status-chonk"
            .hass=${this._hass}
            .entity=${this._duty.pet_weight}
          ></whisker-chonk>
          <img src=${robotImageSrc} alt="Litter Robot" loading="lazy" />
        </div>
        <whisker-robot-levels
          .hass=${this._hass}
          .config=${this._config}
          .litter_level=${this._duty.litter_level}
          .waste_drawer=${this._duty.waste_drawer}
        ></whisker-robot-levels>
        <div class="last-seen-row">
          ${this._duty.last_seen
            ? html`<state-display
                .hass=${this._hass}
                .stateObj=${this._duty.last_seen}
              ></state-display>`
            : nothing}
        </div>
      </ha-card>
    `;
  }
}
