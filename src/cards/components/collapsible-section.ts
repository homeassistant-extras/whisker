import {
  css,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * Wraps content in HA's native `ha-expansion-panel` so a section can start
 * closed and be expanded by the viewer. Viewer toggles are kept in component
 * state for the session; they reset when `collapsed` changes or on reload.
 */
@customElement('whisker-collapsible-section')
export class WhiskerCollapsibleSection extends LitElement {
  static override readonly styles = css`
    :host {
      display: block;
    }

    ha-expansion-panel {
      --expansion-panel-summary-padding: 0 8px;
      --expansion-panel-content-padding: 0;
    }
  `;

  /** Header text shown on the collapsed section. */
  @property({ attribute: false })
  header = '';

  /** Whether the section starts closed. */
  @property({ attribute: false })
  collapsed = false;

  /**
   * Viewer override after they toggle the panel. `undefined` means fall back
   * to `!collapsed` so config still drives the initial open/closed state.
   */
  @state()
  private _expanded?: boolean;

  protected override willUpdate(changed: PropertyValues<this>): void {
    super.willUpdate(changed);
    // a config change should re-seed from `collapsed`; drop any viewer override
    if (changed.has('collapsed')) {
      this._expanded = undefined;
    }
  }

  /**
   * renders the lit element card
   * @returns {TemplateResult} The rendered HTML template
   */
  override render(): TemplateResult {
    return html`<ha-expansion-panel
      .header=${this.header}
      .expanded=${this._expanded ?? !this.collapsed}
      @expanded-changed=${this._onExpandedChanged}
    >
      <slot></slot>
    </ha-expansion-panel>`;
  }

  private _onExpandedChanged(ev: CustomEvent<{ expanded: boolean }>): void {
    this._expanded = ev.detail.expanded;
  }
}
