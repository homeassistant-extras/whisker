import { WhiskerControlsEntity } from '@cards/components/controls/controls-entity';
import type { HomeAssistant } from '@hass/types';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import { html } from 'lit';
import { stub } from 'sinon';

describe('controls-entity.ts (WhiskerControlsEntity)', () => {
  const hass = {
    connection: {
      subscribeMessage: () => Promise.resolve(() => {}),
    },
  } as unknown as HomeAssistant;

  beforeEach(() => {
    globalThis.loadCardHelpers = stub().resolves({
      createRowElement: stub().callsFake(() => document.createElement('div')),
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'loadCardHelpers');
  });

  it('renders nothing when no control entity ids are set', async () => {
    const el = await fixture<WhiskerControlsEntity>(
      html`<whisker-controls-entity .hass=${hass}></whisker-controls-entity>`,
    );
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('.controls-menu-trigger')).to.be.null;
  });

  it('renders menu trigger, dialog heading, and four entity rows with ids', async () => {
    const el = await fixture<WhiskerControlsEntity>(
      html`<whisker-controls-entity
        .hass=${hass}
        .globeLightEntity=${'select.globe'}
        .globeBrightnessEntity=${'number.globe_b'}
        .panelBrightnessEntity=${'number.panel_b'}
        .cycleDelayEntity=${'number.cycle'}
      ></whisker-controls-entity>`,
    );
    await el.updateComplete;

    const trigger = el.shadowRoot?.querySelector('.controls-menu-trigger');
    expect(trigger).to.not.be.null;
    expect(trigger?.getAttribute('aria-label')).to.equal('All controls');

    const dialog = el.shadowRoot?.querySelector('ha-dialog');
    expect(dialog).to.not.be.null;
    expect((dialog as HTMLElement & { heading?: string }).heading).to.equal(
      'All controls',
    );

    const rows = el.shadowRoot?.querySelectorAll(
      'whisker-controls-entity-row',
    );
    expect(rows?.length).to.equal(4);
    expect(rows?.item(0).entity).to.equal('select.globe');
    expect(rows?.item(1).entity).to.equal('number.globe_b');
    expect(rows?.item(2).entity).to.equal('number.panel_b');
    expect(rows?.item(3).entity).to.equal('number.cycle');
  });

  it('opens the dialog when the menu trigger is clicked', async () => {
    const el = await fixture<WhiskerControlsEntity>(
      html`<whisker-controls-entity
        .hass=${hass}
        .globeLightEntity=${'select.globe'}
      ></whisker-controls-entity>`,
    );
    await el.updateComplete;

    const trigger = el.shadowRoot?.querySelector(
      '.controls-menu-trigger',
    ) as HTMLButtonElement | null;
    if (!trigger) {
      throw new Error('expected .controls-menu-trigger');
    }
    trigger.click();
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('ha-dialog')?.hasAttribute('open')).to
      .be.true;
  });
});
