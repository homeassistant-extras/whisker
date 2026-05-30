import { fireEvent } from '@hass/common/dom/fire_event';
import type { HaFormSchema } from '@hass/components/ha-form/types';
import '@hass/panels/lovelace/editor/hui-element-editor';
import type { HomeAssistant } from '@hass/types';
import { type Config } from '@type/config';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';

const SCHEMA: HaFormSchema[] = [
  {
    name: 'device_id',
    label: 'Litter Robot Device',
    required: true,
    selector: {
      device: {
        filter: { integration: 'litterrobot' },
        entity: { domain: 'vacuum' },
      },
    },
  },
  {
    name: 'title',
    label: 'Card Title',
    required: false,
    selector: { text: {} },
  },
  {
    name: 'color',
    label: 'Robot color',
    selector: {
      select: {
        options: [
          { value: 'white', label: 'White' },
          { value: 'black', label: 'Black' },
        ],
      },
    },
  },
  {
    name: 'footer',
    label: 'Footer items',
    selector: {
      select: {
        options: [
          { value: 'total_cycles', label: 'Total cycles' },
          { value: 'status_changed', label: 'Status last changed' },
          { value: 'last_seen', label: 'Last seen' },
          { value: 'pet_weight', label: 'Pet weight' },
          { value: 'status', label: 'Status' },
          { value: 'litter_level', label: 'Litter level' },
          { value: 'waste_drawer', label: 'Waste drawer' },
          { value: 'hopper_status', label: 'Hopper status' },
          { value: 'hopper_connected', label: 'Hopper connected' },
        ],
        multiple: true,
      },
    },
  },
  {
    name: 'features',
    label: 'Features',
    selector: {
      select: {
        options: [{ value: 'percentage', label: 'Show gauge percentages' }],
        multiple: true,
      },
    },
  },
];

export class WhiskerCardEditor extends LitElement {
  @state()
  private _config!: Config;

  public hass!: HomeAssistant;

  override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${(s: HaFormSchema) => s.label}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  setConfig(config: Config) {
    this._config = config;
  }

  private _valueChanged(ev: CustomEvent) {
    const config = ev.detail.value as Config;
    fireEvent(this, 'config-changed', { config });
  }
}
