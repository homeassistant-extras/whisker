import { WhiskerChonk } from '@cards/components/chonk/chonk';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { fixture } from '@open-wc/testing-helpers';
import type { CardHelpers } from '@type/lovelace';
import { expect } from 'chai';
import { html, nothing } from 'lit';
import { stub } from 'sinon';

describe('chonk.ts (WhiskerChonk)', () => {
  interface MockHuiElement extends HTMLElement {
    hass?: HomeAssistant;
  }

  let mockHass: HomeAssistant;
  let mockCreateHuiElement: sinon.SinonStub;

  beforeEach(() => {
    mockCreateHuiElement = stub().callsFake(() => {
      const element = document.createElement('div') as MockHuiElement;
      return element;
    });

    const helpers: CardHelpers = {
      createCardElement: stub(),
      createRowElement: stub(),
      createHuiElement: mockCreateHuiElement,
    };
    globalThis.poatCardHelpers = helpers;

    mockHass = {
      connection: {
        subscribeMessage: () => Promise.resolve(() => {}),
      },
    } as unknown as HomeAssistant;
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'poatCardHelpers');
  });

  it('renders nothing when entity is missing', () => {
    const el = new WhiskerChonk();
    el.hass = mockHass;

    expect(el.render()).to.equal(nothing);
  });

  it('renders nothing when card helpers are not resolved', () => {
    Reflect.deleteProperty(globalThis, 'poatCardHelpers');

    const el = new WhiskerChonk();
    el.hass = mockHass;
    el.entity = 'sensor.pet_weight';

    expect(el.render()).to.equal(nothing);
  });

  it('renders state-icon and state-label in chip wrapper', async () => {
    const el = await fixture<WhiskerChonk>(
      html`<whisker-chonk
        .hass=${mockHass}
        .entity=${'sensor.pet_weight'}
      ></whisker-chonk>`,
    );

    expect(mockCreateHuiElement.callCount).to.equal(2);
    expect(mockCreateHuiElement.firstCall.args[0]).to.deep.include({
      type: 'state-icon',
      entity: 'sensor.pet_weight',
      state_color: true,
    });
    expect(mockCreateHuiElement.secondCall.args[0]).to.deep.include({
      type: 'state-label',
      entity: 'sensor.pet_weight',
    });

    const chip = el.shadowRoot?.querySelector('.chip');
    expect(chip).to.exist;
    expect(chip?.getAttribute('part')).to.equal('chip');
    expect(chip?.childElementCount).to.equal(2);
    expect(mockCreateHuiElement.firstCall.returnValue.hass).to.equal(mockHass);
  });
});
