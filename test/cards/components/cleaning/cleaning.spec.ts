import { WhiskerCleaning } from '@cards/components/cleaning/cleaning';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import { html, nothing } from 'lit';
import { stub, useFakeTimers } from 'sinon';

const RESUBSCRIBE_DEBOUNCE_MS = 50;

describe('cleaning.ts (WhiskerCleaning)', () => {
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
      states: {},
    } as unknown as HomeAssistant;
  });

  it('renders nothing when no entity is configured', () => {
    const el = new WhiskerCleaning();
    el.hass = mockHass;

    expect(el.render()).to.equal(nothing);
  });

  it('renders nothing when the entity is inactive (off)', async () => {
    const clock = useFakeTimers();
    try {
      const el = await fixture<WhiskerCleaning>(
        html`<whisker-cleaning
          .hass=${mockHass}
          .entity=${'input_boolean.litter_robots_needs_cleaned'}
        ></whisker-cleaning>`,
      );
      clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
      deliverState('input_boolean.litter_robots_needs_cleaned', 'off');
      await el.updateComplete;

      expect(el.needsCleaning).to.be.false;
      expect(el.shadowRoot?.querySelector('.badge')).to.be.null;
    } finally {
      clock.restore();
    }
  });

  it('renders the badge and reflects needs-cleaning when active (on)', async () => {
    const clock = useFakeTimers();
    try {
      const el = await fixture<WhiskerCleaning>(
        html`<whisker-cleaning
          .hass=${mockHass}
          .entity=${'input_boolean.litter_robots_needs_cleaned'}
        ></whisker-cleaning>`,
      );
      clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
      deliverState('input_boolean.litter_robots_needs_cleaned', 'on');
      await el.updateComplete;

      expect(el.needsCleaning).to.be.true;
      expect(el.hasAttribute('needs-cleaning')).to.be.true;
      const icon = el.shadowRoot?.querySelector('.badge ha-icon');
      expect(icon?.getAttribute('icon')).to.equal('mdi:broom');
    } finally {
      clock.restore();
    }
  });

  it('treats an acknowledged alert (off) as active', async () => {
    const clock = useFakeTimers();
    try {
      const el = await fixture<WhiskerCleaning>(
        html`<whisker-cleaning
          .hass=${mockHass}
          .entity=${'alert.clean_litter_robots'}
        ></whisker-cleaning>`,
      );
      clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
      deliverState('alert.clean_litter_robots', 'off');
      await el.updateComplete;

      expect(el.needsCleaning).to.be.true;
      expect(el.shadowRoot?.querySelector('.badge')).to.not.be.null;
    } finally {
      clock.restore();
    }
  });

  it('treats an idle alert as inactive', async () => {
    const clock = useFakeTimers();
    try {
      const el = await fixture<WhiskerCleaning>(
        html`<whisker-cleaning
          .hass=${mockHass}
          .entity=${'alert.clean_litter_robots'}
        ></whisker-cleaning>`,
      );
      clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
      deliverState('alert.clean_litter_robots', 'idle');
      await el.updateComplete;

      expect(el.needsCleaning).to.be.false;
      expect(el.shadowRoot?.querySelector('.badge')).to.be.null;
    } finally {
      clock.restore();
    }
  });

  it('fires hass-more-info when the badge is clicked', async () => {
    const clock = useFakeTimers();
    try {
      const el = await fixture<WhiskerCleaning>(
        html`<whisker-cleaning
          .hass=${mockHass}
          .entity=${'input_boolean.litter_robots_needs_cleaned'}
        ></whisker-cleaning>`,
      );
      clock.tick(RESUBSCRIBE_DEBOUNCE_MS);
      deliverState('input_boolean.litter_robots_needs_cleaned', 'on');
      await el.updateComplete;

      const badge = el.shadowRoot?.querySelector('.badge') as HTMLElement;
      const dispatchStub = stub(el, 'dispatchEvent').returns(true);
      badge.click();

      expect(dispatchStub.calledOnce).to.be.true;
      const ev = dispatchStub.firstCall.args[0] as Event & {
        detail: { entityId: string };
      };
      expect(ev.type).to.equal('hass-more-info');
      expect(ev.detail).to.deep.equal({
        entityId: 'input_boolean.litter_robots_needs_cleaned',
      });
    } finally {
      clock.restore();
    }
  });
});
