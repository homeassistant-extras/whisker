import { WhiskerCard } from '@cards/robot/card';
import { styles } from '@cards/robot/styles';
import * as scoopModule from '@delegates/utils/scoop-droppings';
import * as cardHelpersModule from '@homeassistant-extras/hass/helpers/card-helpers';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { CardHelpers } from '@type/lovelace';
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
  let resolvePoatCardHelpersStub: sinon.SinonStub;

  beforeEach(() => {
    cardHelpersModule.resetPoatCardHelpersForTests();
    scoopStub = stub(scoopModule, 'scoopDroppings');

    mockConfig = { device_id: 'lr-1' };
    mockDuty = {
      name: 'Living Room LR',
      waste_drawer: 'sensor.waste',
      litter_level: 'sensor.litter',
      reset: 'button.lr_reset',
      status: 'sensor.lr_status',
    };

    mockHass = {
      connection: {
        subscribeMessage: () => Promise.resolve(() => {}),
      },
      devices: {
        lr_found: {
          id: 'lr_found',
          name: 'Litter Robot',
          model: 'Litter-Robot 4',
          identifiers: [['litterrobot', 'serial']] as [string, string][],
        },
      },
      states: {
        'sensor.lr_status': {
          entity_id: 'sensor.lr_status',
          state: 'ccp',
          attributes: {},
          last_changed: '2024-06-01T10:00:00+00:00',
        },
      },
    } as unknown as HomeAssistant;

    resolvePoatCardHelpersStub = stub(
      cardHelpersModule,
      'resolvePoatCardHelpers',
    );

    scoopStub.returns(mockDuty);

    if (!customElements.get('whisker-card')) {
      customElements.define('whisker-card', WhiskerCard);
    }

    card = new WhiskerCard();
    card.setConfig(mockConfig);
    card.hass = mockHass;
  });

  afterEach(() => {
    resolvePoatCardHelpersStub.restore();
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

  describe('connectedCallback', () => {
    it('should resolve and store card helpers', async () => {
      (card as any)._cardHelpers = undefined;
      const helpers = {} as CardHelpers;
      resolvePoatCardHelpersStub.resolves(helpers);
      (globalThis as any).loadCardHelpers = () => Promise.resolve(helpers);

      // Avoid Lit style adoption in jsdom; test only helper resolution.
      (card as any).createRenderRoot = () => document.createElement('div');
      card.connectedCallback();
      await Promise.resolve();

      expect(resolvePoatCardHelpersStub.calledOnce).to.be.true;
      expect((card as any)._cardHelpers).to.equal(helpers);
    });
  });

  describe('rendering', () => {
    beforeEach(() => {
      (card as unknown as { _cardHelpers: CardHelpers })._cardHelpers =
        {} as CardHelpers;
    });

    it('should render nothing when card helpers are not resolved yet', () => {
      (
        card as unknown as { _cardHelpers: CardHelpers | undefined }
      )._cardHelpers = undefined;
      expect(card.render()).to.equal(nothing);
    });

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
      expect(el.querySelector('whisker-hopper')).to.be.null;
      expect(el.querySelector('whisker-card-footer')).to.not.be.null;
    });

    it('should not render pet weight chip when hide_pet_weight feature is set', async () => {
      card.setConfig({ device_id: 'lr-1', features: ['hide_pet_weight'] });
      const el = await fixture(card.render() as TemplateResult);
      expect(el.querySelector('whisker-chonk')).to.be.null;
    });

    it('should render hopper badge in the title row when hopper entities exist', async () => {
      scoopStub.returns({
        ...mockDuty,
        hopper_status: 'sensor.lr_hopper_status',
        hopper_connected: 'binary_sensor.lr_hopper_connected',
      });
      card.hass = mockHass;
      const el = await fixture(card.render() as TemplateResult);
      const titleStatus = el.querySelector('.card-title-status');
      const hopper = titleStatus?.querySelector(
        'whisker-hopper',
      ) as HTMLElement & {
        statusEntity?: string | null;
        connectedEntity?: string | null;
      };
      expect(hopper).to.exist;
      expect(hopper.statusEntity).to.equal('sensor.lr_hopper_status');
      expect(hopper.connectedEntity).to.equal(
        'binary_sensor.lr_hopper_connected',
      );
      expect(el.querySelector('.robot-image-stack whisker-hopper')).to.be.null;
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

    it('should resolve the robot image from duty model/serial and config color', async () => {
      scoopStub.returns({
        ...mockDuty,
        model: 'Litter-Robot 5 Pro',
        serial_number: 'LR5-02-40',
      });
      card.setConfig({ ...mockConfig, color: 'black' });
      card.hass = mockHass;
      const el = await fixture(card.render() as TemplateResult);
      const img = el.querySelector('img');
      // Stub echoes the args passed to resolveRobotImage (model|serial|color).
      expect(img?.getAttribute('src')).to.equal(
        'img:Litter-Robot 5 Pro|LR5-02-40|black',
      );
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
      expect(rows?.length).to.equal(5);
      expect(rows?.item(0).entity).to.equal('select.lr_globe_light');
      expect(rows?.item(1).entity ?? '').to.equal('');
      expect(rows?.item(2).entity).to.equal('select.lr_panel_brightness');
      expect(rows?.item(3).entity ?? '').to.equal('');
      expect(rows?.item(4).entity ?? '').to.equal('');
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
