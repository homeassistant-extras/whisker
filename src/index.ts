import '@cards/components/toilet-levels/gauge';
import '@cards/components/toilet-levels/levels';
import { WhiskerCard } from '@cards/robot/card';
import { WhiskerCardEditor } from '@cards/robot/editor';
import { version } from '../package.json';

declare global {
  // eslint-disable-next-line no-var
  var customCards: Array<{
    type: string;
    name: string;
    description: string;
    preview: boolean;
    documentationURL: string;
  }>;
}

customElements.define('whisker-card', WhiskerCard);
customElements.define('whisker-card-editor', WhiskerCardEditor);

globalThis.customCards = globalThis.customCards ?? [];

globalThis.customCards.push({
  type: 'whisker-card',
  name: 'Whisker Card',
  description: 'A card for Litter Robot / Whisker devices with visual status.',
  preview: true,
  documentationURL: 'https://github.com/homeassistant-extras/whisker',
});

console.info(`%c🐱 Poat's Tools: whisker-card - ${version}`, 'color: #CFC493;');
