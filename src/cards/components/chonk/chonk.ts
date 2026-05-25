import { HassConfigMixin } from '@/cards/mixins/hass-config-mixin';
import { stateIconLabel } from '@html/state-icon-label';
import { LitElement, type nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { chonkStyles as styles } from './styles';

@customElement('whisker-chonk')
export class WhiskerChonk extends HassConfigMixin(LitElement) {
  static override readonly styles = styles;

  @property({ attribute: false })
  entity?: string;

  override render(): TemplateResult | typeof nothing {
    return stateIconLabel(this.hass, this.entity, {
      state_color: true,
      wrapperClass: 'chip',
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'whisker-chonk': WhiskerChonk;
  }
}
