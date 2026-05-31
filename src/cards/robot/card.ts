import '@/cards/components/chonk/chonk';
import '@/cards/components/controls/controls-entity';
import '@/cards/components/footer/footer';
import '@/cards/components/hopper/hopper';
import '@/cards/components/status-panel/status-panel';
import '@/cards/components/status/status';
import { hasFeature } from '@/config/feature';
import { scoopDroppings } from '@/delegates/utils/scoop-droppings';
import type { DutyReport } from '@/types/types';
import { styles } from '@cards/robot/styles';
import {
  resolvePoatCardHelpers,
  type CardHelpers,
} from '@homeassistant-extras/hass/helpers/card-helpers';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import type { Config } from '@type/config';
import equal from 'fast-deep-equal';
import {
  html,
  LitElement,
  nothing,
  type CSSResult,
  type TemplateResult,
} from 'lit';
import { state } from 'lit/decorators.js';
import { resolveRobotImage } from './assets';

export class WhiskerCard extends LitElement {
  /**
   * Card configuration object
   */
  private _config!: Config;

  /**
   * Duty report object
   */
  @state()
  private _duty: DutyReport | undefined;

  /**
   * Resolved once from {@link globalThis.loadCardHelpers}; used via global helper accessor.
   */
  @state()
  private _cardHelpers?: CardHelpers;

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
  static getStubConfig(hass: HomeAssistant): Config {
    const bot = Object.values(hass.devices).find(
      (d) =>
        d.identifiers?.some(
          ([domain]: [string, string]) => domain === 'litterrobot',
        ) && !!d.model?.includes('Litter-Robot'),
    );

    return {
      device_id: bot?.id ?? '',
    };
  }

  /**
   * Resolves the card helpers once for every sub element
   */
  override connectedCallback(): void {
    super.connectedCallback();
    void resolvePoatCardHelpers(globalThis.loadCardHelpers).then((helpers) => {
      this._cardHelpers = helpers;
    });
  }

  /**
   * renders the lit element card
   * @returns {TemplateResult} The rendered HTML template
   */
  override render(): TemplateResult | typeof nothing {
    if (!this._duty || !this._cardHelpers) {
      return nothing;
    }

    const title = this._config?.title ?? this._duty.name;
    const robotImage = resolveRobotImage(
      this._duty.model,
      this._duty.serial_number,
      this._config?.color,
    );
    const hasHopper = !!(
      this._duty.hopper_status || this._duty.hopper_connected
    );

    return html`
      <ha-card>
        <div class="card-title-row">
          <h2 class="card-title">${title}</h2>
          <div class="card-title-status">
            <whisker-litter-status
              .hass=${this._hass}
              .entity=${this._duty.status}
            ></whisker-litter-status>
            ${hasHopper
              ? html`<whisker-hopper
                  .hass=${this._hass}
                  .config=${this._config}
                  .statusEntity=${this._duty.hopper_status}
                  .connectedEntity=${this._duty.hopper_connected}
                ></whisker-hopper>`
              : nothing}
          </div>
        </div>
        <div class="robot-image-stack">
          <div class="status-panel-row">
            <div class="status-panel-wrap">
              <whisker-status-panel
                .hass=${this._hass}
                .resetEntity=${this._duty.reset}
                .litterBoxEntity=${this._duty.litter_box ?? null}
                .resetWasteDrawerEntity=${this._duty.reset_waste_drawer ?? null}
              ></whisker-status-panel>
            </div>
            <whisker-controls-entity
              .hass=${this._hass}
              .globeLightEntity=${this._duty.globe_light}
              .globeBrightnessEntity=${this._duty.globe_brightness}
              .panelBrightnessEntity=${this._duty.brightness_level}
              .cycleDelayEntity=${this._duty.cycle_delay}
              .panelLockoutEntity=${this._duty.panel_lockout}
            ></whisker-controls-entity>
          </div>
          ${hasFeature(this._config, 'hide_pet_weight')
            ? nothing
            : html`<whisker-chonk
                class="status-chonk"
                .hass=${this._hass}
                .entity=${this._duty.pet_weight}
              ></whisker-chonk>`}
          <img src=${robotImage} alt="Litter Robot" loading="lazy" />
        </div>
        <whisker-robot-levels
          .hass=${this._hass}
          .config=${this._config}
          .litter_level=${this._duty.litter_level}
          .waste_drawer=${this._duty.waste_drawer}
        ></whisker-robot-levels>
        <whisker-card-footer
          .hass=${this._hass}
          .config=${this._config}
          .duty=${this._duty}
        ></whisker-card-footer>
      </ha-card>
    `;
  }
}
