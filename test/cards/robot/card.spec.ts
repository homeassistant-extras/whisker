import { WhiskerCard } from '@cards/robot/card';
import { styles } from '@cards/robot/styles';
import * as scoopModule from '@/delegates/utils/scoop-droppings';
import type { HomeAssistant } from '@hass/types';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { DutyReport } from '@type/types';
import { expect } from 'chai';
import { nothing, type TemplateResult } from 'lit';
import { stub } from 'sinon';

describe('card.ts', () => {
  let card: WhiskerCard;
  let mockHass: HomeAssistant;
  let mockConfig: Config;
  let mockDuty: DutyReport;
  let scoopStub: sinon.SinonStub;

  beforeEach(() => {
    scoopStub = stub(scoopModule, 'scoopDroppings');

    mockConfig = { device_id: 'lr-1' };
    mockDuty = {
      name: 'Living Room LR',
      waste_drawer: 'sensor.waste',
      litter_level: 'sensor.litter',
      reset: 'button.lr_reset',
    };

    mockHass = {
      connection: {
        subscribeMessage: () => Promise.resolve(() => {}),
      },
      devices: {
        lr_found: {
          id: 'lr_found',
          name: 'Litter Robot',
          identifiers: [['litterrobot', 'serial']] as [string, string][],
        },
      },
    } as unknown as HomeAssistant;

    scoopStub.returns(mockDuty);

    if (!customElements.get('whisker-card')) {
      customElements.define('whisker-card', WhiskerCard);
    }

    card = new WhiskerCard();
    card.setConfig(mockConfig);
    card.hass = mockHass;
  });

  afterEach(() => {
    scoopStub.restore();
  });

  describe('setConfig', () => {
    it('should set the configuration', () => {
      const config: Config = { device_id: 'lr-2' };
      card.setConfig(config);
      expect(card['_config']).to.equal(config);
    });

    it('should not replace config when deeply equal', () => {
      const original = card['_config'];
      card.setConfig({ device_id: 'lr-1' });
      expect(card['_config']).to.equal(original);
    });
  });

  describe('hass property setter', () => {
    it('should call scoopDroppings with hass and config', () => {
      expect(scoopStub.calledWith(mockHass, card['_config'])).to.be.true;
    });

    it('should not update duty when scoopDroppings returns the same data', () => {
      const first = card['_duty'];
      card.hass = mockHass;
      expect(card['_duty']).to.equal(first);
    });
  });

  describe('styles', () => {
    it('should return expected styles', () => {
      expect(WhiskerCard.styles).to.deep.equal(styles);
    });
  });

  describe('rendering', () => {
    it('should render nothing when there is no duty report', () => {
      scoopStub.returns(undefined);
      card.hass = mockHass;
      expect(card.render()).to.equal(nothing);
    });

    it('should render ha-card with gauges and title from duty', async () => {
      const el = await fixture(card.render() as TemplateResult);
      expect(el.tagName.toLowerCase()).to.equal('ha-card');
      expect(el.querySelector('.card-title')?.textContent).to.equal(
        'Living Room LR',
      );
      expect(el.querySelectorAll('whisker-robot-levels')).to.have.length(1);
      expect(el.querySelector('whisker-status-panel')).to.not.be.null;
      expect(el.querySelector('whisker-chonk')).to.not.be.null;
    });

    it('should pass litter_box vacuum entity to the status panel', async () => {
      scoopStub.returns({
        ...mockDuty,
        litter_box: 'vacuum.r2_poop2_litter_box',
      });
      card.hass = mockHass;
      const el = await fixture(card.render() as TemplateResult);
      const panel = el.querySelector('whisker-status-panel') as HTMLElement & {
        litterBoxEntity?: string | null;
      };
      expect(panel.litterBoxEntity).to.equal('vacuum.r2_poop2_litter_box');
    });

    it('should reflect cycling on the card host when status_code is ccp', async () => {
      scoopStub.returns({
        ...mockDuty,
        status: {
          entity_id: 'sensor.lr_status',
          state: 'ccp',
          attributes: {},
        },
      });
      // Reflected attributes flush only after connect; Lit update queue awaits enableUpdating from connectedCallback.
      document.body.appendChild(card);
      try {
        card.hass = mockHass;
        await card.updateComplete;
        expect(card.hasAttribute('cycling')).to.be.true;
        await fixture(card.render() as TemplateResult);
      } finally {
        card.remove();
      }
    });

    it('should not set cycling on the card host when status is ready', async () => {
      scoopStub.returns({
        ...mockDuty,
        status: {
          entity_id: 'sensor.lr_status',
          state: 'rdy',
          attributes: {},
        },
      });
      card.hass = mockHass;
      expect(card.hasAttribute('cycling')).to.be.false;
      await fixture(card.render() as TemplateResult);
    });

    it('should use title from config when set', async () => {
      card.setConfig({ ...mockConfig, title: 'Custom' });
      card.hass = mockHass;
      const el = await fixture(card.render() as TemplateResult);
      expect(el.querySelector('.card-title')?.textContent).to.equal('Custom');
    });

    it('should not render controls menu when no control entities are configured', async () => {
      const el = await fixture(card.render() as TemplateResult);
      const panel = el.querySelector('whisker-controls-entity');
      expect(panel?.shadowRoot?.querySelector('.controls-menu-trigger')).to.be
        .null;
    });

    it('should render controls menu and rows from duty translation_key fields', async () => {
      scoopStub.returns({
        ...mockDuty,
        globe_light: 'select.lr_globe_light',
        brightness_level: 'select.lr_panel_brightness',
      });
      card.hass = mockHass;
      const el = await fixture(card.render() as TemplateResult);
      const panel = el.querySelector('whisker-controls-entity');
      expect(panel?.shadowRoot?.querySelector('.controls-menu-trigger')).to.not
        .be.null;
      const rows = panel?.shadowRoot?.querySelectorAll(
        'whisker-controls-entity-row',
      );
      expect(rows?.length).to.equal(4);
      expect(rows?.item(0).entity).to.equal('select.lr_globe_light');
      expect(rows?.item(1).entity ?? '').to.equal('');
      expect(rows?.item(2).entity).to.equal('select.lr_panel_brightness');
      expect(rows?.item(3).entity ?? '').to.equal('');
    });
  });

  describe('getConfigElement()', () => {
    it('should return a whisker-card-editor element', () => {
      const el = WhiskerCard.getConfigElement();
      expect(el.tagName.toLowerCase()).to.equal('whisker-card-editor');
    });
  });

  describe('getStubConfig()', () => {
    it('should return device_id for a Litter Robot device when present', async () => {
      const config = await WhiskerCard.getStubConfig(mockHass);
      expect(config.device_id).to.equal('lr_found');
    });

    it('should return empty device_id when no Litter Robot device exists', async () => {
      const hassNoLr = {
        devices: {
          other: {
            id: 'other',
            identifiers: [['other', 'x']] as [string, string][],
          },
        },
      } as unknown as HomeAssistant;
      const config = await WhiskerCard.getStubConfig(hassNoLr);
      expect(config.device_id).to.equal('');
    });
  });
});
