import { WhiskerPetStates } from '@cards/components/pet-states/pet-states';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { fixture } from '@open-wc/testing-helpers';
import type { CardHelpers } from '@type/lovelace';
import type { PetReport } from '@type/types';
import { expect } from 'chai';
import { html, nothing } from 'lit';
import { stub, useFakeTimers } from 'sinon';

const RESUBSCRIBE_DEBOUNCE_MS = 50;

describe('pet-states.ts (WhiskerPetStates)', () => {
  let mockHass: HomeAssistant;
  let capturedSubscribeCallback: ((ev: unknown) => void) | null;

  const pets: PetReport[] = [
    {
      id: 'pet-1',
      name: 'Ziggy',
      weight: 'sensor.ziggy_weight',
      visits: 'sensor.ziggy_visits',
    },
    { id: 'pet-2', name: 'Aster', weight: 'sensor.aster_weight' },
  ];

  const deliverState = (entityId: string, state: string) => {
    capturedSubscribeCallback?.({
      a: { [entityId]: { s: state, a: {}, c: '', lc: 0, lu: 0 } },
      c: {},
    });
  };

  beforeEach(() => {
    globalThis.poatCardHelpers = {
      createCardElement: stub(),
      createRowElement: stub(),
      createHuiElement: stub().callsFake(() => document.createElement('div')),
    } as CardHelpers;

    capturedSubscribeCallback = null;
    mockHass = {
      connection: {
        subscribeMessage: (callback: (ev: unknown) => void) => {
          capturedSubscribeCallback = callback;
          return Promise.resolve(() => {});
        },
      },
      localize: (key: string) => key,
      states: {},
    } as unknown as HomeAssistant;
  });

  it('renders nothing without pets', async () => {
    const el = (await fixture(
      html`<whisker-pet-states .hass=${mockHass}></whisker-pet-states>`,
    )) as WhiskerPetStates;

    expect(el.render()).to.equal(nothing);
  });

  it('renders a row per pet, with only the metrics that have state', async () => {
    const clock = useFakeTimers();
    try {
      const el = (await fixture(
        html`<whisker-pet-states
          .hass=${mockHass}
          .pets=${pets}
        ></whisker-pet-states>`,
      )) as WhiskerPetStates;

      // subscribes to every pet sensor
      expect(el.entities).to.deep.equal([
        'sensor.ziggy_weight',
        'sensor.ziggy_visits',
        'sensor.aster_weight',
      ]);

      clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
      deliverState('sensor.ziggy_weight', '12.4');
      deliverState('sensor.ziggy_visits', '3');
      await el.updateComplete;

      const rows = el.shadowRoot!.querySelectorAll('.pet');
      expect(rows).to.have.length(2);
      expect(rows[0]!.querySelector('.pet-name')?.textContent).to.equal(
        'Ziggy',
      );
      expect(rows[0]!.querySelectorAll('.pet-stat')).to.have.length(2);
      // Aster's weight has not arrived yet, so nothing is rendered for it
      expect(rows[1]!.querySelectorAll('.pet-stat')).to.have.length(0);
    } finally {
      clock.restore();
    }
  });
});
