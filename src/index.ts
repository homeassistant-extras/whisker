import '@cards/components/svg-levels/svg-levels';
import '@cards/components/toilet-levels/gauge';
import '@cards/components/toilet-levels/levels';
import { WhiskerPetCard } from '@cards/pet/card';
import { WhiskerPetCardEditor } from '@cards/pet/editor';
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
customElements.define('whisker-pet-card', WhiskerPetCard);
customElements.define('whisker-pet-card-editor', WhiskerPetCardEditor);

customCards?.push({
  type: 'whisker-card',
  name: 'Whisker Card',
  description: 'A card for Litter Robot / Whisker devices with visual status.',
  preview: true,
  documentationURL: 'https://github.com/homeassistant-extras/whisker',
  getEntitySuggestion,
});

customCards?.push({
  type: 'whisker-pet-card',
  name: 'Whisker Pet Card',
  description: 'A card for the cats using your Litter Robots.',
  preview: true,
  documentationURL: 'https://github.com/homeassistant-extras/whisker',
});

console.info(`%c🐱 Poat's Tools: whisker-card - ${version}`, 'color: #CFC493;');
