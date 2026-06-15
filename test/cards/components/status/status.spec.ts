import { WhiskerLitterStatus } from '@cards/components/status/status';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import type { HassEntity } from '@homeassistant-extras/hass/ws/types';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import { html } from 'lit';
import { stub } from 'sinon';

describe('status.ts (WhiskerLitterStatus)', () => {
  const mockHass = {
    language: 'en',
    localize: (key: string, values?: Record<string, unknown>) => {
      if (key.endsWith('.tap')) {
        return 'Tap:';
      }
      if (key.endsWith('.more_info')) {
        return `Show more info: ${values?.name ?? ''}`;
      }
      return key;
    },
    connection: {
      subscribeMessage: () => Promise.resolve(() => {}),
    },
    states: {
      'sensor.litter_robot_status': {
        entity_id: 'sensor.litter_robot_status',
        state: 'rdy',
        attributes: { friendly_name: 'Status' },
      },
    },
  } as unknown as HomeAssistant;

  beforeEach(() => {
    if (!customElements.get('state-display')) {
      customElements.define(
        'state-display',
        class extends HTMLElement {
          hass?: HomeAssistant;
          stateObj?: HassEntity;
          content?: string | string[];
        },
      );
    }
  });

  it('renders nothing when there is no entity state', async () => {
    const el = await fixture<WhiskerLitterStatus>(
      html`<whisker-litter-status .hass=${mockHass}></whisker-litter-status>`,
    );

    expect(el.shadowRoot?.querySelector('state-display')).to.be.null;
    expect(el.shadowRoot?.querySelector('ha-icon.status-icon')).to.be.null;
  });

  it('renders state-display and status icon from litter robot state', async () => {
    const el = await fixture<WhiskerLitterStatus>(
      html`<whisker-litter-status
        .hass=${mockHass}
        .entity=${'sensor.litter_robot_status'}
      ></whisker-litter-status>`,
    );

    const stateObj = {
      entity_id: 'sensor.litter_robot_status',
      state: 'rdy',
      attributes: {},
      last_changed: '1970-01-01T00:00:00.000Z',
      last_updated: '1970-01-01T00:00:00.000Z',
    };
    el['states'] = {
      'sensor.litter_robot_status': stateObj,
    };
    await el.updateComplete;

    const display = el.shadowRoot?.querySelector('state-display') as
      | (HTMLElement & { hass?: HomeAssistant; stateObj?: HassEntity })
      | null;
    expect(display).to.exist;
    expect(display?.hass).to.equal(mockHass);
    expect(display?.stateObj).to.deep.equal(stateObj);

    const iconWrap = el.shadowRoot?.querySelector('.status-icon-wrap');
    expect(iconWrap?.getAttribute('title')).to.equal(
      'Tap:Show more info: Status',
    );

    const icon = el.shadowRoot?.querySelector('ha-icon.status-icon');
    expect(icon?.getAttribute('icon')).to.equal('mdi:check-circle-outline');
    expect(icon?.getAttribute('style')).to.include('success-color');
  });

  it('fires hass-more-info when the status icon is clicked', async () => {
    const el = await fixture<WhiskerLitterStatus>(
      html`<whisker-litter-status
        .hass=${mockHass}
        .entity=${'sensor.litter_robot_status'}
      ></whisker-litter-status>`,
    );

    el['states'] = {
      'sensor.litter_robot_status': {
        entity_id: 'sensor.litter_robot_status',
        state: 'rdy',
        attributes: {},
        last_changed: '1970-01-01T00:00:00.000Z',
        last_updated: '1970-01-01T00:00:00.000Z',
      },
    };
    await el.updateComplete;

    const iconWrap = el.shadowRoot?.querySelector(
      '.status-icon-wrap',
    ) as HTMLElement;
    if (!iconWrap) {
      throw new Error('expected status icon wrapper');
    }

    const dispatchStub = stub(el, 'dispatchEvent').returns(true);
    iconWrap.click();

    expect(dispatchStub.calledOnce).to.be.true;
    const ev = dispatchStub.firstCall.args[0] as Event & {
      detail: { entityId: string };
    };
    expect(ev.type).to.equal('hass-more-info');
    expect(ev.detail).to.deep.equal({
      entityId: 'sensor.litter_robot_status',
    });

    dispatchStub.restore();
  });

  it('reflects cycling when status_code is ccp', async () => {
    const el = await fixture<WhiskerLitterStatus>(
      html`<whisker-litter-status
        .hass=${mockHass}
        .entity=${'sensor.litter_robot_status'}
      ></whisker-litter-status>`,
    );

    el['states'] = {
      'sensor.litter_robot_status': {
        entity_id: 'sensor.litter_robot_status',
        state: 'ccp',
        attributes: {},
        last_changed: '1970-01-01T00:00:00.000Z',
        last_updated: '1970-01-01T00:00:00.000Z',
      },
    };
    await el.updateComplete;

    expect(el.hasAttribute('cycling')).to.be.true;
  });

  it('does not reflect cycling when status is ready', async () => {
    const el = await fixture<WhiskerLitterStatus>(
      html`<whisker-litter-status
        .hass=${mockHass}
        .entity=${'sensor.litter_robot_status'}
      ></whisker-litter-status>`,
    );

    el['states'] = {
      'sensor.litter_robot_status': {
        entity_id: 'sensor.litter_robot_status',
        state: 'rdy',
        attributes: {},
        last_changed: '1970-01-01T00:00:00.000Z',
        last_updated: '1970-01-01T00:00:00.000Z',
      },
    };
    await el.updateComplete;

    expect(el.hasAttribute('cycling')).to.be.false;
  });
});
