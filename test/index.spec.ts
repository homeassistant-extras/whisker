import { getEntitySuggestion } from '@delegates/utils/entity-suggestion';
import { resetPoatCardHelpersForTests } from '@homeassistant-extras/hass/helpers/card-helpers';
import { expect } from 'chai';
import { stub, type SinonStub } from 'sinon';
import { version } from '../package.json';

// Path to the hass module that captures `customCards` at import time. It must
// be reset alongside index.ts so each test re-captures the current global.
const customCardsModule =
  require.resolve('@homeassistant-extras/hass/data/lovelace_custom_cards');

describe('index.ts', () => {
  let customElementsStub: SinonStub;
  let consoleInfoStub: sinon.SinonStub;
  let loadCardHelpersStub: sinon.SinonStub | undefined;

  beforeEach(() => {
    resetPoatCardHelpersForTests();
    // Stub customElements.define to prevent actual registration
    customElementsStub = stub(customElements, 'define');
    consoleInfoStub = stub(console, 'info');

    // Start each test with a clean global. The hass module snapshots
    // `globalThis.customCards` when it first loads, so the global must be set
    // up before requiring index.ts (which transitively loads that module).
    (globalThis as { customCards?: Array<Object> }).customCards = [];
  });

  afterEach(() => {
    customElementsStub.restore();
    consoleInfoStub.restore();
    resetPoatCardHelpersForTests();
    delete require.cache[require.resolve('@/index.ts')];
    delete require.cache[customCardsModule];
  });

  it('should call loadCardHelpers when available (preload)', () => {
    loadCardHelpersStub = stub().resolves({
      createRowElement: stub().returns(document.createElement('div')),
      createHuiElement: stub().returns(document.createElement('div')),
    });
    globalThis.loadCardHelpers =
      loadCardHelpersStub as typeof globalThis.loadCardHelpers;

    require('@/index.ts');

    expect(loadCardHelpersStub.calledOnce).to.be.true;
  });

  it('should register all custom elements', () => {
    require('@/index.ts');
    expect(customElementsStub.callCount).to.equal(2);
    expect(customElementsStub.firstCall.args[0]).to.equal('whisker-card');
    expect(customElementsStub.secondCall.args[0]).to.equal(
      'whisker-card-editor',
    );
  });

  it('should add card configuration with all fields to window.customCards', () => {
    require('@/index.ts');

    expect(globalThis.customCards).to.have.lengthOf(1);
    expect(globalThis.customCards[0]).to.deep.equal({
      type: 'whisker-card',
      name: 'Whisker Card',
      description:
        'A card for Litter Robot / Whisker devices with visual status.',
      preview: true,
      documentationURL: 'https://github.com/homeassistant-extras/whisker',
      getEntitySuggestion,
    });
  });

  it('should preserve existing cards when adding new card', () => {
    globalThis.customCards = [
      {
        type: 'existing-card',
        name: 'Existing Card',
        description: 'Existing Card Description',
        preview: true,
        documentationURL: 'https://github.com/homeassistant-extras/whisker',
      },
    ];

    require('@/index.ts');

    expect(globalThis.customCards).to.have.lengthOf(2);
    expect(globalThis.customCards[0]).to.deep.equal({
      type: 'existing-card',
      name: 'Existing Card',
      description: 'Existing Card Description',
      preview: true,
      documentationURL: 'https://github.com/homeassistant-extras/whisker',
    });
  });

  it('should handle multiple imports without duplicating registration', () => {
    require('@/index.ts');
    require('@/index.ts');

    expect(globalThis.customCards).to.have.lengthOf(1);
    expect(customElementsStub.callCount).to.equal(2);
  });

  it('should log the version with proper formatting', () => {
    require('@/index.ts');

    expect(consoleInfoStub.calledOnce).to.be.true;

    expect(
      consoleInfoStub.calledWithExactly(
        `%c🐱 Poat's Tools: whisker-card - ${version}`,
        'color: #CFC493;',
      ),
    ).to.be.true;
  });
});
