import { WhiskerStatusPanel } from '@cards/components/status-panel/status-panel';
import type { HomeAssistant } from '@hass/types';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import { html } from 'lit';

describe('status-panel.ts (WhiskerStatusPanel)', () => {
  const hass = {
    connection: {
      subscribeMessage: () => Promise.resolve(() => {}),
    },
  } as unknown as HomeAssistant;

  it('renders .panel and passes hass and entities to both items', async () => {
    const el = await fixture<WhiskerStatusPanel>(
      html`<whisker-status-panel
        .hass=${hass}
        .resetEntity=${'button.lr_reset'}
        .litterBoxEntity=${'vacuum.r2_poop2_litter_box'}
      ></whisker-status-panel>`,
    );

    expect(el.shadowRoot?.querySelector('.panel')).to.not.be.null;
    const items = el.shadowRoot?.querySelectorAll('whisker-status-panel-item');
    expect(items).to.have.length(2);
    const vacuumProps = items![0] as unknown as {
      hass?: HomeAssistant;
      entity?: string | null;
    };
    const resetProps = items![1] as unknown as {
      hass?: HomeAssistant;
      entity?: string | null;
    };
    expect(vacuumProps.hass).to.equal(hass);
    expect(vacuumProps.entity).to.equal('vacuum.r2_poop2_litter_box');
    expect(resetProps.hass).to.equal(hass);
    expect(resetProps.entity).to.equal('button.lr_reset');
    expect(items![0]!.getAttribute('item-type')).to.equal('vacuum');
    expect(items![1]!.getAttribute('item-type')).to.equal('reset');
  });

  it('still renders .panel when reset and litter box entities are null', async () => {
    const el = await fixture<WhiskerStatusPanel>(
      html`<whisker-status-panel
        .resetEntity=${null}
        .litterBoxEntity=${null}
      ></whisker-status-panel>`,
    );

    expect(el.shadowRoot?.querySelector('.panel')).to.not.be.null;
    const items = el.shadowRoot?.querySelectorAll('whisker-status-panel-item');
    expect(items).to.have.length(2);
    const litterBoxProps = items![0] as unknown as { entity?: string | null };
    const resetProps = items![1] as unknown as { entity?: string | null };
    expect(litterBoxProps.entity == null).to.be.true;
    expect(resetProps.entity == null).to.be.true;
  });
});
