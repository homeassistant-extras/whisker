import { WhiskerChonk } from '@cards/components/chonk/chonk';
import type { HomeAssistant } from '@hass/types';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import { html } from 'lit';
import { stub } from 'sinon';

describe('chonk.ts (WhiskerChonk)', () => {
  const mockHass = {
    language: 'en',
    localize: (key: string) => key,
    connection: {
      subscribeMessage: () => Promise.resolve(() => {}),
    },
  } as unknown as HomeAssistant;

  it('renders nothing when there is no subscribed state yet', async () => {
    const el = await fixture<WhiskerChonk>(
      html`<whisker-chonk .hass=${mockHass}></whisker-chonk>`,
    );

    expect(el.shadowRoot?.querySelector('.chip')).to.be.null;
  });

  it('renders state-display in chip when entity state is available', async () => {
    const el = await fixture<WhiskerChonk>(
      html`<whisker-chonk
        .hass=${mockHass}
        .entity=${'sensor.pet_weight'}
      ></whisker-chonk>`,
    );

    el['state'] = {
      entity_id: 'sensor.pet_weight',
      state: '12.4',
      attributes: { unit_of_measurement: 'lb' },
    };
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('state-display')).to.not.be.null;
    expect(el.shadowRoot?.querySelector('.chip ha-icon')).to.not.be.null;
  });

  it('fires hass-more-info with entity id when chip is clicked', async () => {
    const el = await fixture<WhiskerChonk>(
      html`<whisker-chonk
        .hass=${mockHass}
        .entity=${'sensor.pet_weight'}
      ></whisker-chonk>`,
    );

    el['state'] = {
      entity_id: 'sensor.pet_weight',
      state: '12.4',
      attributes: {},
    };
    await el.updateComplete;

    const chip = el.shadowRoot?.querySelector('.chip');
    if (!chip) {
      throw new Error('expected .chip');
    }

    const dispatchStub = stub(el, 'dispatchEvent').returns(true);
    (chip as HTMLElement).click();

    expect(dispatchStub.calledOnce).to.be.true;
    const ev = dispatchStub.firstCall.args[0] as Event & {
      detail: { entityId: string };
    };
    expect(ev.type).to.equal('hass-more-info');
    expect(ev.detail).to.deep.equal({ entityId: 'sensor.pet_weight' });

    dispatchStub.restore();
  });
});
