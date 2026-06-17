import { WhiskerHopper } from '@cards/components/hopper/hopper';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { fixture } from '@open-wc/testing-helpers';
import type { EntityState } from '@type/entity';
import type { CardHelpers } from '@type/lovelace';
import { expect } from 'chai';
import { html, nothing } from 'lit';
import { stub, useFakeTimers } from 'sinon';

const RESUBSCRIBE_DEBOUNCE_MS = 50;

describe('hopper.ts (WhiskerHopper)', () => {
  let mockHass: HomeAssistant;
  let capturedSubscribeCallback: ((ev: unknown) => void) | null;

  const deliverState = (entityId: string, state: string) => {
    capturedSubscribeCallback?.({
      a: {
        [entityId]: {
          s: state,
          a: {},
          c: '',
          lc: 0,
          lu: 0,
        },
      },
      c: {},
    });
  };

  beforeEach(() => {
    const helpers: CardHelpers = {
      createCardElement: stub(),
      createRowElement: stub(),
      createHuiElement: stub().returns(document.createElement('div')),
    };
    globalThis.poatCardHelpers = helpers;

    capturedSubscribeCallback = null;
    mockHass = {
      connection: {
        subscribeMessage: (callback: (ev: unknown) => void) => {
          capturedSubscribeCallback = callback;
          return Promise.resolve(() => {});
        },
      },
      localize: (key: string, values?: Record<string, unknown>) => {
        if (key.endsWith('.tap')) return 'Tap:';
        if (key.endsWith('.more_info')) {
          return `Show more info: ${values?.name ?? ''}`;
        }
        return key;
      },
      states: {
        'sensor.hopper_status': {
          entity_id: 'sensor.hopper_status',
          state: 'Enabled',
          attributes: { friendly_name: 'Hopper status' },
          last_changed: '2024-06-01T10:00:00+00:00',
        } as EntityState,
        'binary_sensor.hopper_connected': {
          entity_id: 'binary_sensor.hopper_connected',
          state: 'on',
          attributes: { friendly_name: 'Hopper connected' },
          last_changed: '2024-06-01T10:00:00+00:00',
        } as EntityState,
      },
    } as unknown as HomeAssistant;
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'poatCardHelpers');
  });

  it('renders nothing when both entities are missing', () => {
    const el = new WhiskerHopper();
    el.hass = mockHass;

    expect(el.render()).to.equal(nothing);
  });

  it('renders a disconnected badge when hopper is not connected', async () => {
    const clock = useFakeTimers();
    try {
      const el = await fixture<WhiskerHopper>(
        html`<whisker-hopper
          .hass=${mockHass}
          .statusEntity=${'sensor.hopper_status'}
          .connectedEntity=${'binary_sensor.hopper_connected'}
        ></whisker-hopper>`,
      );
      clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
      deliverState('binary_sensor.hopper_connected', 'off');
      await el.updateComplete;

      const icon = el.shadowRoot?.querySelector('.badge ha-icon');
      expect(icon?.getAttribute('icon')).to.equal('mdi:filter-remove');
    } finally {
      clock.restore();
    }
  });

  it('renders an empty badge when connected and status is empty', async () => {
    const clock = useFakeTimers();
    try {
      const el = await fixture<WhiskerHopper>(
        html`<whisker-hopper
          .hass=${mockHass}
          .statusEntity=${'sensor.hopper_status'}
          .connectedEntity=${'binary_sensor.hopper_connected'}
        ></whisker-hopper>`,
      );
      clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
      deliverState('sensor.hopper_status', 'Empty');
      deliverState('binary_sensor.hopper_connected', 'on');
      await el.updateComplete;

      const icon = el.shadowRoot?.querySelector('.badge ha-icon');
      expect(icon?.getAttribute('icon')).to.equal('mdi:filter-minus-outline');
    } finally {
      clock.restore();
    }
  });
});
