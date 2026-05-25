import { WhiskerStatusPanelItem } from '@cards/components/status-panel/status-panel-item';
import type { HomeAssistant } from '@hass/types';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import { expect } from 'chai';
import { html, nothing } from 'lit';
import { stub } from 'sinon';

describe('status-panel-item.ts (WhiskerStatusPanelItem)', () => {
  const config: Config = { device_id: 'd1' };

  const hass = (extras: Record<string, unknown> = {}): HomeAssistant =>
    ({
      connection: {
        subscribeMessage: () => Promise.resolve(() => {}),
      },
      callService: stub().resolves(undefined),
      ...extras,
    }) as unknown as HomeAssistant;

  interface MockHui extends HTMLElement {
    hass?: HomeAssistant;
  }

  let mockElement: MockHui;
  let mockCreateHuiElement: sinon.SinonStub;

  beforeEach(() => {
    mockElement = document.createElement('div') as MockHui;
    mockCreateHuiElement = stub().returns(mockElement);
    globalThis.poatCardHelpers = {
      createRowElement: stub(),
      createHuiElement: mockCreateHuiElement,
    };
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'poatCardHelpers');
  });

  it('renders nothing if card helpers are not resolved yet', () => {
    Reflect.deleteProperty(globalThis, 'poatCardHelpers');

    const el = new WhiskerStatusPanelItem();
    el.hass = hass();
    el.config = config;
    el.entity = 'button.lr_reset';

    expect(el.render()).to.equal(nothing);
  });

  it('creates state-icon with reset button config and hass assignment', async () => {
    const el = await fixture<WhiskerStatusPanelItem>(
      html`<whisker-status-panel-item
        .hass=${hass()}
        .config=${config}
        .entity=${'button.lr_reset'}
      ></whisker-status-panel-item>`,
    );

    expect(mockCreateHuiElement.called).to.be.true;

    const cfg = mockCreateHuiElement.lastCall.args[0] as Record<
      string,
      unknown
    >;
    expect(cfg.type).to.equal('state-icon');
    expect(cfg.entity).to.equal('button.lr_reset');
    expect(cfg.state_color).to.equal(true);
    expect(cfg.icon).to.equal('mdi:close');
    expect(cfg.tap_action).to.deep.equal({
      action: 'call-service',
      service: 'button.press',
      service_data: { entity_id: 'button.lr_reset' },
    });
    expect(cfg.hold_action).to.deep.equal({ action: 'more-info' });

    expect(mockElement.hass).to.equal(el.hass);
    expect(el.shadowRoot?.contains(mockElement)).to.be.true;
  });

  it('uses mdi:delete-variant for reset_waste_drawer panel items', async () => {
    await fixture<WhiskerStatusPanelItem>(
      html`<whisker-status-panel-item
        item-type="reset_waste_drawer"
        .hass=${hass()}
        .config=${config}
        .entity=${'button.lr_reset_waste_drawer'}
      ></whisker-status-panel-item>`,
    );

    const cfg = mockCreateHuiElement.lastCall.args[0] as Record<
      string,
      unknown
    >;
    expect(cfg.icon).to.equal('mdi:delete-variant');
    expect(cfg.tap_action).to.deep.equal({
      action: 'call-service',
      service: 'button.press',
      service_data: { entity_id: 'button.lr_reset_waste_drawer' },
    });
  });

  it('uses vacuum.start + target for vacuum panel items', async () => {
    await fixture<WhiskerStatusPanelItem>(
      html`<whisker-status-panel-item
        item-type="vacuum"
        .hass=${hass()}
        .config=${config}
        .entity=${'vacuum.r2_poop2_litter_box'}
      ></whisker-status-panel-item>`,
    );

    const cfg = mockCreateHuiElement.lastCall.args[0] as Record<
      string,
      unknown
    >;
    expect(cfg.icon).to.equal('mdi:autorenew');
    expect(cfg.tap_action).to.deep.equal({
      action: 'call-service',
      service: 'vacuum.start',
      target: { entity_id: 'vacuum.r2_poop2_litter_box' },
    });
  });

  it('reflects item-type attribute', async () => {
    const el = await fixture<WhiskerStatusPanelItem>(
      html`<whisker-status-panel-item
        item-type="vacuum"
        .hass=${hass()}
        .config=${config}
        .entity=${'vacuum.lr_box'}
      ></whisker-status-panel-item>`,
    );
    expect(el.getAttribute('item-type')).to.equal('vacuum');
  });
});
