import {
  SubscribeEntityStateMixin,
  type EntityStates,
} from '@cards/mixins/subscribe-entity-state-mixin';
import type { HomeAssistant } from '@hass/types';
import { expect } from 'chai';
import { LitElement } from 'lit';
import { stub, useFakeTimers } from 'sinon';

const RESUBSCRIBE_DEBOUNCE_MS = 50;

type MixinTestElement = LitElement & {
  hass?: HomeAssistant;
  config?: { device_id: string };
  entity?: string | string[];
  states?: EntityStates;
};

describe('SubscribeEntityStateMixin', () => {
  let TestElement: ReturnType<typeof SubscribeEntityStateMixin>;
  let element: MixinTestElement;
  let hass: HomeAssistant;
  let unsubscribeSpy: ReturnType<typeof stub>;
  let capturedCallback: ((ev: unknown) => void) | null;
  let elementCounter = 0;

  beforeEach(() => {
    unsubscribeSpy = stub();
    capturedCallback = null;
    const subscribeMessage = (callback: (ev: unknown) => void) => {
      capturedCallback = callback;
      return Promise.resolve(unsubscribeSpy);
    };

    const elementName = `test-sub-entity-${elementCounter++}`;
    TestElement = SubscribeEntityStateMixin(LitElement);

    if (!customElements.get(elementName)) {
      customElements.define(elementName, TestElement);
    }

    element = new TestElement() as unknown as MixinTestElement;
    hass = {
      language: 'en',
      localize: (key: string) => key,
      connection: { subscribeMessage },
      states: {
        'light.bedroom': {
          entity_id: 'light.bedroom',
          state: 'on',
          attributes: { friendly_name: 'Bedroom Light' },
        },
      },
    } as unknown as HomeAssistant;
    element.config = { device_id: 'test' };
  });

  it('should have states undefined initially', () => {
    expect(element.states).to.be.undefined;
  });

  it('should subscribe when connected with entityId and hass set', async () => {
    const clock = useFakeTimers();
    try {
      element.hass = hass;
      element.entity = 'light.bedroom';

      element.connectedCallback();
      clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
      await Promise.resolve();

      expect(capturedCallback).to.not.be.null;
    } finally {
      clock.restore();
    }
  });

  it('should set initial state from hass.states on subscribe', async () => {
    const clock = useFakeTimers();
    try {
      element.hass = hass;
      element.entity = 'light.bedroom';

      element.connectedCallback();
      clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
      await Promise.resolve();

      expect(capturedCallback).to.not.be.null;
      capturedCallback!({
        a: {
          'light.bedroom': {
            s: 'on',
            a: { friendly_name: 'Bedroom Light' },
            c: '',
            lc: 0,
            lu: 0,
          },
        },
        c: {},
      });

      expect(element.states?.['light.bedroom']).to.deep.equal({
        entity_id: 'light.bedroom',
        state: 'on',
        attributes: { friendly_name: 'Bedroom Light' },
        last_changed: '1970-01-01T00:00:00.000Z',
      });
    } finally {
      clock.restore();
    }
  });

  it('should expose entityId and no-arg entityState for a single subscription', async () => {
    const clock = useFakeTimers();
    try {
      const el = element as MixinTestElement & {
        entityId(): string | undefined;
        entityState(): { state: string } | undefined;
        entityState(entityId: string): { state: string } | undefined;
      };
      el.hass = hass;
      el.entity = 'light.bedroom';

      el.connectedCallback();
      clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
      await Promise.resolve();

      capturedCallback!({
        a: {
          'light.bedroom': {
            s: 'on',
            a: {},
            c: '',
            lc: 0,
            lu: 0,
          },
        },
        c: {},
      });

      expect(el.entityId()).to.equal('light.bedroom');
      expect(el.entityState()?.state).to.equal('on');
      expect(el.entityState()).to.equal(el.entityState('light.bedroom'));
    } finally {
      clock.restore();
    }
  });

  it('should track multiple entities in states', async () => {
    const clock = useFakeTimers();
    try {
      element.hass = hass;
      element.entity = ['light.bedroom', 'light.kitchen'];

      element.connectedCallback();
      clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
      await Promise.resolve();

      capturedCallback!({
        a: {
          'light.bedroom': {
            s: 'on',
            a: {},
            c: '',
            lc: 0,
            lu: 0,
          },
          'light.kitchen': {
            s: 'off',
            a: {},
            c: '',
            lc: 0,
            lu: 0,
          },
        },
        c: {},
      });

      expect(element.states?.['light.bedroom']?.state).to.equal('on');
      expect(element.states?.['light.kitchen']?.state).to.equal('off');
    } finally {
      clock.restore();
    }
  });

  it('should not subscribe without entityId', () => {
    element.hass = hass;

    element.connectedCallback();

    expect(capturedCallback).to.be.null;
  });

  it('should not subscribe without hass', () => {
    element.entity = 'light.bedroom';

    element.connectedCallback();

    expect(capturedCallback).to.be.null;
  });
});
