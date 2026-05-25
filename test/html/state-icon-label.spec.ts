import { stateIconLabel, stateLabel } from '@/html/state-icon-label';
import type { HomeAssistant } from '@hass/types';
import { fixture } from '@open-wc/testing-helpers';
import type { CardHelpers } from '@type/lovelace';
import { expect } from 'chai';
import { html, nothing, type TemplateResult } from 'lit';
import { stub } from 'sinon';

describe('state-icon-label.ts', () => {
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
      createRowElement: stub().returns(document.createElement('div')),
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

  it('returns nothing when hass or entity is missing', () => {
    expect(stateIconLabel(undefined, 'sensor.weight')).to.equal(nothing);
    expect(stateIconLabel(mockHass, undefined)).to.equal(nothing);
  });

  it('returns nothing when card helpers are not resolved', () => {
    Reflect.deleteProperty(globalThis, 'poatCardHelpers');

    expect(stateIconLabel(mockHass, 'sensor.weight')).to.equal(nothing);
    expect(mockCreateHuiElement.called).to.be.false;
  });

  it('creates state-icon and state-label with optional wrapper', async () => {
    const result = stateIconLabel(mockHass, 'sensor.pet_weight', {
      state_color: true,
      wrapperClass: 'chip',
    });
    const root = await fixture(result as unknown as TemplateResult);

    expect(mockCreateHuiElement.callCount).to.equal(2);
    expect(mockCreateHuiElement.firstCall.args[0]).to.deep.include({
      type: 'state-icon',
      entity: 'sensor.pet_weight',
      state_color: true,
      hold_action: { action: 'none' },
      double_tap_action: { action: 'none' },
    });
    expect(mockCreateHuiElement.secondCall.args[0]).to.deep.include({
      type: 'state-label',
      entity: 'sensor.pet_weight',
      hold_action: { action: 'none' },
      double_tap_action: { action: 'none' },
    });

    expect(mockCreateHuiElement.firstCall.returnValue.hass).to.equal(mockHass);
    expect(mockCreateHuiElement.secondCall.returnValue.hass).to.equal(mockHass);
    expect(root.classList.contains('chip')).to.be.true;
    expect(root.getAttribute('part')).to.equal('chip');
    expect(root.getAttribute('role')).to.equal('presentation');
    expect(root.childElementCount).to.equal(2);
  });

  it('renders icon and label without a wrapper when wrapperClass is omitted', async () => {
    const result = stateIconLabel(mockHass, 'sensor.total_cycles');
    const root = await fixture(
      html`<div>${result as unknown as TemplateResult}</div>`,
    );

    expect(root.querySelector('.chip')).to.be.null;
    expect(root.childElementCount).to.equal(2);
  });

  it('stateLabel creates a state-label element', () => {
    const result = stateLabel(mockHass, 'sensor.litter_robot_status');

    expect(mockCreateHuiElement.calledOnce).to.be.true;
    expect(mockCreateHuiElement.firstCall.args[0]).to.deep.include({
      type: 'state-label',
      entity: 'sensor.litter_robot_status',
      hold_action: { action: 'none' },
      double_tap_action: { action: 'none' },
    });
    expect(result).to.not.equal(nothing);
    expect(mockCreateHuiElement.firstCall.returnValue.hass).to.equal(mockHass);
  });
});
