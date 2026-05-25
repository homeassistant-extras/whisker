import { WhiskerCardFooter } from '@cards/components/footer/footer';
import { resolveFooterSlots } from '@common/resolve-footer-items';
import type { HomeAssistant } from '@hass/types';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { DutyReport } from '@type/types';
import { expect } from 'chai';
import { html, type TemplateResult } from 'lit';

describe('footer.ts (WhiskerCardFooter)', () => {
  const config: Config = { device_id: 'd1' };
  const mockConnection = {
    subscribeMessage: () => Promise.resolve(() => {}),
  };
  const hass = {
    language: 'en',
    connection: mockConnection,
  } as unknown as HomeAssistant;
  const duty: DutyReport = {
    name: 'LR',
    waste_drawer: null,
    litter_level: null,
    reset: null,
    total_cycles: 'sensor.total_cycles',
    status: 'sensor.status',
    last_seen: 'sensor.last_seen',
  };

  it('renders nothing when duty is missing', async () => {
    const el = await fixture<WhiskerCardFooter>(
      html`<whisker-card-footer
        .hass=${hass}
        .config=${config}
      ></whisker-card-footer>`,
    );
    expect(el.shadowRoot?.querySelector('.footer')).to.be.null;
  });

  it('renders default footer items via whisker-card-footer-item', async () => {
    expect(resolveFooterSlots(config, duty)).to.have.length(3);

    const el = await fixture<WhiskerCardFooter>(
      html`<whisker-card-footer
        .hass=${hass}
        .config=${config}
        .duty=${duty}
      ></whisker-card-footer>`,
    );

    expect(el.shadowRoot?.querySelector('.footer')).to.exist;
    expect(
      el.shadowRoot?.querySelectorAll('whisker-card-footer-item'),
    ).to.have.length(3);
  });

  it('renders only configured footer items', async () => {
    const hassWithWeight = {
      language: 'en',
      connection: mockConnection,
      states: {
        'sensor.weight': {
          entity_id: 'sensor.weight',
          state: '10.5',
          attributes: {},
        },
      },
    } as unknown as HomeAssistant;

    const el = new WhiskerCardFooter();
    (
      el as unknown as { createRenderRoot: () => HTMLElement }
    ).createRenderRoot = () => document.createElement('div');
    el.hass = hassWithWeight;
    el.config = { device_id: 'd1', footer: ['pet_weight'] };
    el.duty = { ...duty, pet_weight: 'sensor.weight' };

    const root = await fixture(el.render() as TemplateResult);

    expect(root.querySelectorAll('whisker-card-footer-item')).to.have.length(1);
  });
});
