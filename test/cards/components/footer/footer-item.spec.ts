import { WhiskerCardFooterItem } from '@cards/components/footer/footer-item';
import type { FooterSlot } from '@common/resolve-footer-items';
import type { HomeAssistant } from '@hass/types';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { EntityState } from '@type/entity';
import { expect } from 'chai';
import { html, nothing } from 'lit';
import { stub, useFakeTimers } from 'sinon';

const RESUBSCRIBE_DEBOUNCE_MS = 50;

describe('footer-item.ts (WhiskerCardFooterItem)', () => {
  const config: Config = { device_id: 'd1' };

  const labelSlot: FooterSlot = {
    key: 'total_cycles',
    entity: 'sensor.total_cycles',
  };

  const statusChangedSlot: FooterSlot = {
    key: 'status_changed',
    entity: 'sensor.status',
    content: 'last_changed',
  };

  const lastSeenSlot: FooterSlot = {
    key: 'last_seen',
    entity: 'sensor.last_seen',
  };

  let mockHass: HomeAssistant;
  let mockState: EntityState;
  let mockCreateHuiElement: sinon.SinonStub;
  let mockElement: HTMLElement & { hass?: HomeAssistant };
  let capturedSubscribeCallback: ((ev: unknown) => void) | null;

  const toCompressedLc = (iso: string) =>
    Math.floor(new Date(iso).getTime() / 1000);

  const deliverSubscribeEntitiesAdd = (
    entities: Record<
      string,
      {
        state: string;
        attributes?: Record<string, unknown>;
        lastChanged?: string;
      }
    >,
  ) => {
    expect(capturedSubscribeCallback).to.not.be.null;
    capturedSubscribeCallback!({
      a: Object.fromEntries(
        Object.entries(entities).map(
          ([entityId, { state, attributes = {}, lastChanged }]) => [
            entityId,
            {
              s: state,
              a: attributes,
              c: '',
              lc: lastChanged ? toCompressedLc(lastChanged) : 0,
              lu: 0,
            },
          ],
        ),
      ),
      c: {},
    });
  };

  const mountRelativeFooterItem = async (slot: FooterSlot) => {
    const clock = useFakeTimers();
    try {
      const el = await fixture<WhiskerCardFooterItem>(
        html`<whisker-card-footer-item
          .hass=${mockHass}
          .config=${config}
          .item=${slot}
        ></whisker-card-footer-item>`,
      );
      clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
      await Promise.resolve();
      return el;
    } finally {
      clock.restore();
    }
  };

  beforeEach(() => {
    if (!customElements.get('state-display')) {
      customElements.define(
        'state-display',
        class extends HTMLElement {
          hass?: unknown;
          stateObj?: EntityState;
          content?: string;
        },
      );
    }

    mockElement = document.createElement('div') as HTMLElement & {
      hass?: HomeAssistant;
    };
    mockCreateHuiElement = stub().returns(mockElement);

    globalThis.poatCardHelpers = {
      createRowElement: stub().returns(document.createElement('div')),
      createHuiElement: mockCreateHuiElement,
    };

    mockState = {
      entity_id: 'sensor.status',
      state: 'rdy',
      attributes: {
        friendly_name: 'Status',
      },
      last_changed: '2024-06-01T10:00:00+00:00',
    };

    capturedSubscribeCallback = null;
    mockHass = {
      connection: {
        subscribeMessage: (callback: (ev: unknown) => void) => {
          capturedSubscribeCallback = callback;
          return Promise.resolve(() => {});
        },
      },
      localize: (key: string, values?: Record<string, unknown>) => {
        if (key.endsWith('.tap')) {
          return 'Tap:';
        }
        if (key.endsWith('.more_info')) {
          return `Show more info: ${values?.name ?? ''}`;
        }
        return key;
      },
      states: {
        'sensor.total_cycles': {
          entity_id: 'sensor.total_cycles',
          state: '1234',
          attributes: {},
        },
        'sensor.status': mockState,
        'sensor.last_seen': {
          entity_id: 'sensor.last_seen',
          state: '2024-06-01T12:00:00+00:00',
          attributes: {},
        },
      },
    } as unknown as HomeAssistant;
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'poatCardHelpers');
  });

  it('renders state-icon and state-label with hold and double-tap disabled', async () => {
    const el = await fixture<WhiskerCardFooterItem>(
      html`<whisker-card-footer-item
        .hass=${mockHass}
        .config=${config}
        .item=${labelSlot}
      ></whisker-card-footer-item>`,
    );
    await el.updateComplete;

    expect(mockCreateHuiElement.callCount).to.equal(2);
    expect(mockCreateHuiElement.firstCall.args[0]).to.deep.include({
      type: 'state-icon',
      entity: 'sensor.total_cycles',
      hold_action: { action: 'none' },
      double_tap_action: { action: 'none' },
    });
    expect(mockCreateHuiElement.secondCall.args[0]).to.deep.include({
      type: 'state-label',
      entity: 'sensor.total_cycles',
      hold_action: { action: 'none' },
      double_tap_action: { action: 'none' },
    });
    expect(el.shadowRoot?.querySelector('.footer-item-content')).to.exist;
    expect(el.shadowRoot?.querySelector('.footer-item-state')).to.be.null;
  });

  it('renders state-display with last_changed for status_changed slots', async () => {
    const el = await mountRelativeFooterItem(statusChangedSlot);
    deliverSubscribeEntitiesAdd({
      'sensor.status': {
        state: 'rdy',
        attributes: { friendly_name: 'Status' },
        lastChanged: mockState.last_changed,
      },
    });
    await el.updateComplete;

    const display = el.shadowRoot?.querySelector('state-display');
    expect(display).to.exist;
    expect((display as { content?: string }).content).to.equal('last_changed');
    expect((display as { stateObj?: EntityState }).stateObj).to.deep.equal({
      entity_id: 'sensor.status',
      state: 'rdy',
      attributes: { friendly_name: 'Status' },
      last_changed: new Date(
        toCompressedLc(mockState.last_changed as string) * 1000,
      ).toISOString(),
    });

    const stateWrapper = el.shadowRoot?.querySelector(
      '.footer-item-state',
    ) as HTMLElement;
    expect(stateWrapper).to.exist;
    expect(stateWrapper.title).to.equal('Tap:Show more info: Status');
    expect(mockCreateHuiElement.firstCall.args[0]).to.deep.include({
      type: 'state-icon',
      tap_action: { action: 'none' },
      hold_action: { action: 'none' },
      double_tap_action: { action: 'none' },
    });
  });

  it('fires hass-more-info when a relative slot is clicked', async () => {
    const el = await mountRelativeFooterItem(lastSeenSlot);
    deliverSubscribeEntitiesAdd({
      'sensor.last_seen': {
        state: '2024-06-01T12:00:00+00:00',
        attributes: { friendly_name: 'Last seen' },
      },
    });
    await el.updateComplete;

    const stateWrapper = el.shadowRoot?.querySelector(
      '.footer-item-state',
    ) as HTMLElement;
    const dispatchStub = stub(el, 'dispatchEvent').returns(true);
    stateWrapper.click();

    expect(dispatchStub.calledOnce).to.be.true;
    const ev = dispatchStub.firstCall.args[0] as Event & {
      detail: { entityId: string };
    };
    expect(ev.type).to.equal('hass-more-info');
    expect(ev.detail).to.deep.equal({ entityId: 'sensor.last_seen' });

    dispatchStub.restore();
  });

  it('returns nothing when relative slot entity state is missing', () => {
    delete mockHass.states['sensor.status'];

    const el = new WhiskerCardFooterItem();
    el.hass = mockHass;
    el.config = config;
    el.item = statusChangedSlot;

    expect(el.render()).to.equal(nothing);
  });

  it('wires hass onto createHuiElement results', async () => {
    const el = await fixture<WhiskerCardFooterItem>(
      html`<whisker-card-footer-item
        .hass=${mockHass}
        .config=${config}
        .item=${labelSlot}
      ></whisker-card-footer-item>`,
    );
    await el.updateComplete;

    expect(mockElement.hass).to.equal(mockHass);
  });
});
