import '@/cards/components/controls/controls-entity-row';
import type { HomeAssistant } from '@hass/types';
import { css, html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';

const DIALOG_HEADING = 'All controls';

const styles = css`
  :host {
    display: contents;
  }

  .controls-menu-trigger {
    position: absolute;
    top: 8px;
    left: 12px;
    z-index: 3;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 6px;
    border-radius: 999px;
    border: 1px solid var(--divider-color);
    color: var(--primary-text-color);
    background: color-mix(
      in srgb,
      var(--card-background-color, #fff) 88%,
      transparent
    );
    box-shadow: 0 1px 3px rgb(0 0 0 / 12%);
    cursor: pointer;
    font-family: inherit;
  }

  .controls-menu-trigger:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .controls-menu-trigger ha-icon {
    display: block;
    color: var(--secondary-text-color);
    --mdc-icon-size: 22px;
  }

  .controls-dialog-rows {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .controls-dialog-rows whisker-controls-entity-row:not(:last-of-type) {
    border-bottom: 1px solid var(--divider-color);
  }
`;

@customElement('whisker-controls-entity')
export class WhiskerControlsEntity extends LitElement {
  static override readonly styles = styles;

  hass!: HomeAssistant;
  globeLightEntity = '';
  globeBrightnessEntity = '';
  panelBrightnessEntity = '';
  cycleDelayEntity = '';

  @state()
  private _dialogOpen = false;

  private get _hasAnyEntity(): boolean {
    return [
      this.globeLightEntity,
      this.globeBrightnessEntity,
      this.panelBrightnessEntity,
      this.cycleDelayEntity,
    ].some((id) => typeof id === 'string' && id.length > 0);
  }

  private _openDialog(ev: Event): void {
    ev.preventDefault();
    if (!this._hasAnyEntity) {
      return;
    }
    this._dialogOpen = true;
  }

  private _onDialogClosed(): void {
    this._dialogOpen = false;
  }

  override render(): TemplateResult | typeof nothing {
    if (!this._hasAnyEntity) {
      return nothing;
    }

    return html`
      <button
        type="button"
        class="controls-menu-trigger"
        aria-label=${DIALOG_HEADING}
        @click=${this._openDialog}
      >
        <ha-icon icon="mdi:menu"></ha-icon>
      </button>
      <ha-dialog
        ?open=${this._dialogOpen}
        .heading=${DIALOG_HEADING}
        .scrimClickAction=${'close'}
        .escapeKeyAction=${'close'}
        @closed=${this._onDialogClosed}
      >
        <div class="controls-dialog-rows">
          <whisker-controls-entity-row
            .hass=${this.hass}
            .entity=${this.globeLightEntity}
          ></whisker-controls-entity-row>
          <whisker-controls-entity-row
            .hass=${this.hass}
            .entity=${this.globeBrightnessEntity}
          ></whisker-controls-entity-row>
          <whisker-controls-entity-row
            .hass=${this.hass}
            .entity=${this.panelBrightnessEntity}
          ></whisker-controls-entity-row>
          <whisker-controls-entity-row
            .hass=${this.hass}
            .entity=${this.cycleDelayEntity}
          ></whisker-controls-entity-row>
        </div>
      </ha-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-controls-entity': WhiskerControlsEntity;
  }
}
