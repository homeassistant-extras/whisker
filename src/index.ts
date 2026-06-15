import '@cards/components/toilet-levels/gauge';
import '@cards/components/toilet-levels/levels';
import { WhiskerCard } from '@cards/robot/card';
import { WhiskerCardEditor } from '@cards/robot/editor';
import { getEntitySuggestion } from '@delegates/utils/entity-suggestion';
import { customCards } from '@homeassistant-extras/hass/data/lovelace_custom_cards';
import { resolvePoatCardHelpers } from '@homeassistant-extras/hass/helpers/card-helpers';
import { version } from '../package.json';

// Kick off HA card helper resolution once when the bundle loads
void resolvePoatCardHelpers(globalThis.loadCardHelpers);

customElements.define('whisker-card', WhiskerCard);
customElements.define('whisker-card-editor', WhiskerCardEditor);

customCards?.push({
  type: 'whisker-card',
  name: 'Whisker Card',
  description: 'A card for Litter Robot / Whisker devices with visual status.',
  preview: true,
  documentationURL: 'https://github.com/homeassistant-extras/whisker',
  getEntitySuggestion,
});

console.info(`%c🐱 Poat's Tools: whisker-card - ${version}`, 'color: #CFC493;');
