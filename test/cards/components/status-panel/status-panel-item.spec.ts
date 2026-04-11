import { WhiskerStatusPanelItem } from '@cards/components/status-panel/status-panel-item';
import type { HomeAssistant } from '@hass/types';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { EntityState } from '@type/entity';
import { expect } from 'chai';
import { html } from 'lit';
import { stub } from 'sinon';

async function flushStateIconTask(el: WhiskerStatusPanelItem): Promise<void> {
  await el.updateComplete;
  await new Promise<void>((r) => queueMicrotask(r));
  await el.updateComplete;
  await new Promise<void>((r) => setTimeout(r, 0));
  await el.updateComplete;
}

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
  let mockLoadCardHelpers: sinon.SinonStub;

  beforeEach(() => {
    mockElement = document.createElement('div') as MockHui;
    mockCreateHuiElement = stub().returns(mockElement);
    mockLoadCardHelpers = stub().resolves({
      createHuiElement: mockCreateHuiElement,
    });
    globalThis.loadCardHelpers = mockLoadCardHelpers;
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'loadCardHelpers');
  });

  it('renders nothing when entity is not set', async () => {
    const el = await fixture<WhiskerStatusPanelItem>(
      html`<whisker-status-panel-item
        .hass=${hass()}
        .config=${config}
      ></whisker-status-panel-item>`,
    );

    expect(el.shadowRoot?.querySelector('.item')).to.be.null;
    expect(mockLoadCardHelpers.called).to.be.false;
  });

  it('runs Task + stateIconContent: helpers, createHuiElement config, hass, .item wrapper', async () => {
    const el = await fixture<WhiskerStatusPanelItem>(
      html`<whisker-status-panel-item
        .hass=${hass()}
        .config=${config}
        .entity=${'button.lr_reset'}
      ></whisker-status-panel-item>`,
    );

    const entityState: EntityState = {
      entity_id: 'button.lr_reset',
      state: 'unknown',
      attributes: { friendly_name: 'Reset' },
    };
    el['state'] = entityState;
    el.requestUpdate();
    await flushStateIconTask(el);

    expect(mockLoadCardHelpers.called).to.be.true;
    expect(mockCreateHuiElement.called).to.be.true;

    const cfg = mockCreateHuiElement.lastCall.args[0] as Record<
      string,
      unknown
    >;
    expect(cfg.type).to.equal('state-icon');
    expect(cfg.entity).to.equal('button.lr_reset');
    expect(cfg.title).to.equal('Reset');
    expect(cfg.icon).to.equal('mdi:close');
    expect(cfg.tap_action).to.deep.equal({
      action: 'call-service',
      service: 'button.press',
      service_data: { entity_id: 'button.lr_reset' },
    });

    expect(mockElement.hass).to.equal(el.hass);

    const item = el.shadowRoot?.querySelector('.item');
    expect(item).to.not.be.null;
    expect(item!.contains(mockElement)).to.be.true;
  });

  it('still builds state-icon via helpers when HA reports unavailable', async () => {
    const el = await fixture<WhiskerStatusPanelItem>(
      html`<whisker-status-panel-item
        .hass=${hass()}
        .config=${config}
        .entity=${'button.lr_reset'}
      ></whisker-status-panel-item>`,
    );

    el['state'] = {
      entity_id: 'button.lr_reset',
      state: 'unavailable',
      attributes: {},
    };
    el.requestUpdate();
    await flushStateIconTask(el);

    expect(mockCreateHuiElement.called).to.be.true;
    expect(el.shadowRoot?.querySelector('.item')?.contains(mockElement)).to.be
      .true;
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
