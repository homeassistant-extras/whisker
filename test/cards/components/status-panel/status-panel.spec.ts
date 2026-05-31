import { WhiskerStatusPanel } from '@cards/components/status-panel/status-panel';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import { html } from 'lit';

describe('status-panel.ts (WhiskerStatusPanel)', () => {
  const hass = {
    connection: {
      subscribeMessage: () => Promise.resolve(() => {}),
    },
  } as unknown as HomeAssistant;

  it('renders .panel and passes hass and entities to all three items', async () => {
    const el = await fixture<WhiskerStatusPanel>(
      html`<whisker-status-panel
        .hass=${hass}
        .resetEntity=${'button.lr_reset'}
        .litterBoxEntity=${'vacuum.r2_poop2_litter_box'}
        .resetWasteDrawerEntity=${'button.lr_reset_waste_drawer'}
      ></whisker-status-panel>`,
    );

    expect(el.shadowRoot?.querySelector('.panel')).to.not.be.null;
    const items = el.shadowRoot?.querySelectorAll('whisker-status-panel-item');
    expect(items).to.have.length(3);
    const vacuumProps = items![0] as unknown as {
      hass?: HomeAssistant;
      entity?: string | null;
    };
    const resetProps = items![1] as unknown as {
      hass?: HomeAssistant;
      entity?: string | null;
    };
    const wasteDrawerProps = items![2] as unknown as {
      hass?: HomeAssistant;
      entity?: string | null;
    };
    expect(vacuumProps.hass).to.equal(hass);
    expect(vacuumProps.entity).to.equal('vacuum.r2_poop2_litter_box');
    expect(resetProps.hass).to.equal(hass);
    expect(resetProps.entity).to.equal('button.lr_reset');
    expect(wasteDrawerProps.hass).to.equal(hass);
    expect(wasteDrawerProps.entity).to.equal('button.lr_reset_waste_drawer');
    expect(items![0]!.getAttribute('item-type')).to.equal('vacuum');
    expect(items![1]!.getAttribute('item-type')).to.equal('reset');
    expect(items![2]!.getAttribute('item-type')).to.equal('reset_waste_drawer');
  });

  it('renders .panel but no items when all entities are null', async () => {
    const el = await fixture<WhiskerStatusPanel>(
      html`<whisker-status-panel
        .resetEntity=${null}
        .litterBoxEntity=${null}
        .resetWasteDrawerEntity=${null}
      ></whisker-status-panel>`,
    );

    expect(el.shadowRoot?.querySelector('.panel')).to.not.be.null;
    const items = el.shadowRoot?.querySelectorAll('whisker-status-panel-item');
    expect(items).to.have.length(0);
  });
});
