import { WhiskerControlsEntityRow } from '@cards/components/controls/controls-entity-row';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import { html, nothing } from 'lit';
import { stub } from 'sinon';

describe('controls-entity-row.ts (WhiskerControlsEntityRow)', () => {
  const hass = {
    connection: {
      subscribeMessage: () => Promise.resolve(() => {}),
    },
  } as unknown as HomeAssistant;

  let createRowElement: sinon.SinonStub;

  beforeEach(() => {
    createRowElement = stub().callsFake(() => document.createElement('div'));
    globalThis.poatCardHelpers = {
      createRowElement,
      createHuiElement: stub(),
    };
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'poatCardHelpers');
  });

  it('renders nothing when entity is not set', async () => {
    const el = await fixture<WhiskerControlsEntityRow>(
      html`<whisker-controls-entity-row
        .hass=${hass}
      ></whisker-controls-entity-row>`,
    );

    expect(el.shadowRoot?.querySelector('.row-host')).to.be.null;
    expect(createRowElement.called).to.be.false;
  });

  it('renders nothing if card helpers are not resolved yet', () => {
    Reflect.deleteProperty(globalThis, 'poatCardHelpers');

    const el = new WhiskerControlsEntityRow();
    el.hass = hass;
    el.entity = 'select.lr_globe_light';

    expect(el.render()).to.equal(nothing);
  });

  it('createRowElement config, assigns hass, and wraps in .row-host', async () => {
    interface RowHost extends HTMLElement {
      hass?: HomeAssistant;
    }
    const mockRow = document.createElement('div') as RowHost;
    createRowElement.returns(mockRow);

    const el = await fixture<WhiskerControlsEntityRow>(
      html`<whisker-controls-entity-row
        .hass=${hass}
        .entity=${'select.lr_globe_light'}
      ></whisker-controls-entity-row>`,
    );
    await el.updateComplete;

    expect(createRowElement.calledOnce).to.be.true;
    expect(createRowElement.firstCall.args[0]).to.deep.equal({
      entity: 'select.lr_globe_light',
    });
    expect(mockRow.hass).to.equal(hass);

    const host = el.shadowRoot?.querySelector('.row-host');
    expect(host).to.not.be.null;
    expect(host!.contains(mockRow)).to.be.true;
  });
});
