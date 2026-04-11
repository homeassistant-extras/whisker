import { WhiskerLitterStatus } from '@cards/components/status/status';
import type { HomeAssistant } from '@hass/types';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import { html } from 'lit';

describe('status.ts (WhiskerLitterStatus)', () => {
  const mockHass = {
    language: 'en',
    localize: (key: string) => key,
  } as unknown as HomeAssistant;

  it('renders nothing when there is no entity state', async () => {
    const el = await fixture<WhiskerLitterStatus>(
      html`<whisker-litter-status .hass=${mockHass}></whisker-litter-status>`,
    );

    expect(el.shadowRoot?.querySelector('state-display')).to.be.null;
    expect(el.shadowRoot?.querySelector('ha-icon.status-icon')).to.be.null;
  });

  it('renders state-display and status icon from litter robot state', async () => {
    const el = await fixture<WhiskerLitterStatus>(
      html`<whisker-litter-status .hass=${mockHass}></whisker-litter-status>`,
    );

    el['state'] = {
      entity_id: 'sensor.litter_robot_status',
      state: 'rdy',
      attributes: {},
    };
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('state-display')).to.not.be.null;
    const icon = el.shadowRoot?.querySelector('ha-icon.status-icon');
    expect(icon?.getAttribute('icon')).to.equal('mdi:check-circle-outline');
    expect(icon?.getAttribute('style')).to.include('success-color');
  });
});
