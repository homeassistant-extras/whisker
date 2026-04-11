import { WhiskerControlsEntityRow } from '@cards/components/controls/controls-entity-row';
import type { HomeAssistant } from '@hass/types';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import { html } from 'lit';
import { stub } from 'sinon';

async function flushRowTask(el: WhiskerControlsEntityRow): Promise<void> {
  await el.updateComplete;
  await new Promise<void>((r) => queueMicrotask(r));
  await el.updateComplete;
  await new Promise<void>((r) => setTimeout(r, 0));
  await el.updateComplete;
}

describe('controls-entity-row.ts (WhiskerControlsEntityRow)', () => {
  const hass = {
    connection: {
      subscribeMessage: () => Promise.resolve(() => {}),
    },
  } as unknown as HomeAssistant;

  let mockLoadCardHelpers: sinon.SinonStub;

  beforeEach(() => {
    mockLoadCardHelpers = stub().resolves({
      createRowElement: stub().callsFake(() => document.createElement('div')),
    });
    globalThis.loadCardHelpers = mockLoadCardHelpers;
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'loadCardHelpers');
  });

  it('renders nothing when entity is not set', async () => {
    const el = await fixture<WhiskerControlsEntityRow>(
      html`<whisker-controls-entity-row .hass=${hass}></whisker-controls-entity-row>`,
    );

    expect(el.shadowRoot?.querySelector('.row-host')).to.be.null;
    expect(mockLoadCardHelpers.called).to.be.false;
  });

  it('loads helpers, createRowElement config, assigns hass, and wraps in .row-host', async () => {
    interface RowHost extends HTMLElement {
      hass?: HomeAssistant;
    }
    const mockRow = document.createElement('div') as RowHost;
    const createRowElement = stub().returns(mockRow);
    mockLoadCardHelpers.resolves({ createRowElement });

    const el = await fixture<WhiskerControlsEntityRow>(
      html`<whisker-controls-entity-row
        .hass=${hass}
        .entity=${'select.lr_globe_light'}
      ></whisker-controls-entity-row>`,
    );

    await flushRowTask(el);

    expect(mockLoadCardHelpers.called).to.be.true;
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
