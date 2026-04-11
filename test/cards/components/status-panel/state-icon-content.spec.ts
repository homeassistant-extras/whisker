import { stateIconContent } from '@cards/components/status-panel/state-icon-content';
import type { HomeAssistant } from '@hass/types';
import type { EntityState } from '@type/entity';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import { stub } from 'sinon';

describe('state-icon-content.ts (stateIconContent)', () => {
  interface MockHuiElement extends HTMLElement {
    hass?: HomeAssistant;
    setConfig?: (config: unknown) => void;
  }

  let mockHass: HomeAssistant;
  let mockCreateHuiElement: sinon.SinonStub;
  let mockLoadCardHelpers: sinon.SinonStub;
  let mockElement: MockHuiElement;

  beforeEach(() => {
    mockElement = document.createElement('div') as MockHuiElement;

    mockCreateHuiElement = stub().returns(mockElement);
    mockLoadCardHelpers = stub().resolves({
      createHuiElement: mockCreateHuiElement,
    });
    globalThis.loadCardHelpers = mockLoadCardHelpers;

    mockHass = {
      connection: {
        subscribeMessage: () => Promise.resolve(() => {}),
      },
    } as unknown as HomeAssistant;
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'loadCardHelpers');
  });

  it('loads helpers, creates state-icon element with button.press + more-info, sets hass, wraps in .item', async () => {
    const entityState: EntityState = {
      entity_id: 'button.lr_reset',
      state: 'unknown',
      attributes: { friendly_name: 'Reset' },
    };

    const result = await stateIconContent(
      mockHass,
      'button.lr_reset',
      entityState,
    );
    const root = await fixture(result);

    expect(mockLoadCardHelpers.calledOnce).to.be.true;
    expect(mockCreateHuiElement.calledOnce).to.be.true;

    const config = mockCreateHuiElement.firstCall.args[0] as Record<
      string,
      unknown
    >;
    expect(config.type).to.equal('state-icon');
    expect(config.entity).to.equal('button.lr_reset');
    expect(config.title).to.equal('Reset');
    expect(config.state_color).to.equal(true);
    expect(config.icon).to.equal('mdi:close');
    expect(config.tap_action).to.deep.equal({
      action: 'call-service',
      service: 'button.press',
      service_data: { entity_id: 'button.lr_reset' },
    });
    expect(config.hold_action).to.deep.equal({ action: 'more-info' });
    expect(config.double_tap_action).to.deep.equal({ action: 'none' });

    expect(mockElement.hass).to.equal(mockHass);
    expect(root.classList.contains('item')).to.be.true;
    expect(root.contains(mockElement)).to.be.true;
  });

  it('uses a derived title when friendly_name is missing', async () => {
    await stateIconContent(mockHass, 'button.lr_reset', undefined);

    const config = mockCreateHuiElement.firstCall.args[0] as { title: string };
    expect(config.title).to.equal('lr reset');
  });

  it('uses vacuum.start + target for vacuum entities', async () => {
    const entityState: EntityState = {
      entity_id: 'vacuum.r2_poop2_litter_box',
      state: 'docked',
      attributes: { friendly_name: 'Litter box' },
    };

    await stateIconContent(mockHass, 'vacuum.r2_poop2_litter_box', entityState);

    const config = mockCreateHuiElement.firstCall.args[0] as Record<
      string,
      unknown
    >;
    expect(config.icon).to.equal('mdi:autorenew');
    expect(config.tap_action).to.deep.equal({
      action: 'call-service',
      service: 'vacuum.start',
      target: { entity_id: 'vacuum.r2_poop2_litter_box' },
    });
  });
});
