import type { HomeAssistant } from '@hass/types';
import type { Config } from '@type/config';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

export { wasteSeverityClass } from './waste-severity';

/**
 * Robot image with optional litter and waste gauge rows (via whisker-gauge).
 */
@customElement('whisker-robot-levels')
export class WhiskerRobotLevels extends LitElement {
  static override readonly styles = css`
    .levels {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px 20%;
      box-sizing: border-box;
    }
  `;

  hass?: HomeAssistant;
  config?: Config;
  litter_level: string | null = null;
  waste_drawer: string | null = null;

  override render() {
    return html`
      <div class="levels">
        <whisker-gauge
          kind="litter"
          .hass=${this.hass}
          .config=${this.config}
          .entity=${this.litter_level}
        ></whisker-gauge>
        <whisker-gauge
          kind="waste"
          .hass=${this.hass}
          .config=${this.config}
          .entity=${this.waste_drawer}
        ></whisker-gauge>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-robot-levels': WhiskerRobotLevels;
  }
}
