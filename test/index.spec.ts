import { expect } from 'chai';
import { stub, type SinonStub } from 'sinon';
import { version } from '../package.json';

describe('index.ts', () => {
  let customElementsStub: SinonStub;
  let customCardsStub: Array<Object> | undefined;
  let consoleInfoStub: sinon.SinonStub;

  beforeEach(() => {
    // Stub customElements.define to prevent actual registration
    customElementsStub = stub(customElements, 'define');
    consoleInfoStub = stub(console, 'info');

    // Create a stub for window.customCards
    customCardsStub = [];
    Object.defineProperty(globalThis, 'customCards', {
      get: () => customCardsStub,
      set: (value) => {
        customCardsStub = value;
      },
      configurable: true,
    });

    // Delete require.cache for gauge and levels so they are re-imported
    delete require.cache[
      require.resolve('@cards/components/toilet-levels/gauge')
    ];
    delete require.cache[
      require.resolve('@cards/components/toilet-levels/levels')
    ];
  });

  afterEach(() => {
    customElementsStub.restore();
    consoleInfoStub.restore();
    customCardsStub = undefined;
    delete require.cache[require.resolve('@/index.ts')];
  });

  it('should register all custom elements', () => {
    require('@/index.ts');
    expect(customElementsStub.callCount).to.equal(4);
    expect(customElementsStub.firstCall.args[0]).to.equal('whisker-gauge');
    expect(customElementsStub.secondCall.args[0]).to.equal(
      'whisker-robot-levels',
    );
    expect(customElementsStub.thirdCall.args[0]).to.equal('whisker-card');
    expect(customElementsStub.getCall(3).args[0]).to.equal(
      'whisker-card-editor',
    );
  });

  it('should initialize window.customCards if undefined', () => {
    customCardsStub = undefined;
    require('@/index.ts');

    expect(globalThis.customCards).to.be.an('array');
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
    expect(customElementsStub.callCount).to.equal(4);
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
