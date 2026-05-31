import type { DutyReport } from '@/types/types';
import { mapEntitiesByTranslationKey } from '@common/map-entities';
import type { EntityRegistryDisplayEntry } from '@homeassistant-extras/hass/data/entity/entity_registry';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import type { HassEntity } from '@homeassistant-extras/hass/ws/types';
import { expect } from 'chai';

const e = (domain: string, name: string, state: string): HassEntity => ({
  entity_id: `${domain}.${name}`,
  state,
  attributes: {},
  last_changed: '2024-01-01T00:00:00+00:00',
});

describe('map-entities.ts', () => {
  describe('mapEntitiesByTranslationKey', () => {
    let hass: HomeAssistant;
    let report: DutyReport;

    beforeEach(() => {
      report = {
        name: 'Test LR',
        waste_drawer: null,
        litter_level: null,
        reset: null,
      };
      hass = {
        states: {
          'sensor.lr_waste': e('sensor', 'lr_waste', '55'),
          'sensor.lr_litter': e('sensor', 'lr_litter', '3.25'),
          'sensor.lr_pet_weight': e('sensor', 'lr_pet_weight', '12.3'),
          'sensor.lr_last_seen': {
            entity_id: 'sensor.lr_last_seen',
            state: '2024-01-15T10:00:00+00:00',
            attributes: { device_class: 'timestamp' },
            last_changed: '2024-01-15T10:00:00+00:00',
          },
          'sensor.lr_status': e('sensor', 'lr_status', 'rdy'),
        },
      } as unknown as HomeAssistant;
    });

    it('should map waste_drawer to waste_drawer', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'sensor.lr_waste',
        device_id: 'd1',
        translation_key: 'waste_drawer',
      };

      expect(mapEntitiesByTranslationKey(entity, report)).to.be.true;
      expect(report.waste_drawer).to.equal('sensor.lr_waste');
    });

    it('should map litter_level to litter_level', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'sensor.lr_litter',
        device_id: 'd1',
        translation_key: 'litter_level',
      };

      expect(mapEntitiesByTranslationKey(entity, report)).to.be.true;
      expect(report.litter_level).to.equal('sensor.lr_litter');
    });

    it('should return false for unknown translation key', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'sensor.lr_waste',
        device_id: 'd1',
        translation_key: 'unknown_key',
      };

      expect(mapEntitiesByTranslationKey(entity, report)).to.be.false;
      expect(report.waste_drawer).to.be.null;
      expect(report.litter_level).to.be.null;
    });

    it('should map status_code translation_key to status EntityState', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'sensor.lr_status',
        device_id: 'd1',
        translation_key: 'status_code',
      };

      expect(mapEntitiesByTranslationKey(entity, report)).to.be.true;
      expect(report.status).to.equal('sensor.lr_status');
    });

    it('should map reset_waste_drawer translation_key to reset_waste_drawer', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'button.lr_reset_waste_drawer',
        device_id: 'd1',
        translation_key: 'reset_waste_drawer',
      };

      expect(mapEntitiesByTranslationKey(entity, report)).to.be.true;
      expect(report.reset_waste_drawer).to.equal(
        'button.lr_reset_waste_drawer',
      );
    });

    it('should map reset translation_key to reset', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'button.lr_reset',
        device_id: 'd1',
        translation_key: 'reset',
      };

      expect(mapEntitiesByTranslationKey(entity, report)).to.be.true;
      expect(report.reset).to.equal('button.lr_reset');
    });

    it('should map litter_box translation_key to litter_box vacuum entity', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'vacuum.r2_poop2_litter_box',
        device_id: 'd1',
        translation_key: 'litter_box',
      };

      expect(mapEntitiesByTranslationKey(entity, report)).to.be.true;
      expect(report.litter_box).to.equal('vacuum.r2_poop2_litter_box');
    });

    it('should return false when translation_key is undefined', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'sensor.lr_waste',
        device_id: 'd1',
        translation_key: undefined,
      };

      expect(mapEntitiesByTranslationKey(entity, report)).to.be.false;
    });

    it('should map pet_weight to entity id', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'sensor.lr_pet_weight',
        device_id: 'd1',
        translation_key: 'pet_weight',
      };

      expect(mapEntitiesByTranslationKey(entity, report)).to.be.true;
      expect(report.pet_weight).to.equal('sensor.lr_pet_weight');
    });

    it('should map total_cycles to EntityState via getState', () => {
      hass.states['sensor.lr_total_cycles'] = e(
        'sensor',
        'lr_total_cycles',
        '1234',
      );
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'sensor.lr_total_cycles',
        device_id: 'd1',
        translation_key: 'total_cycles',
      };

      expect(mapEntitiesByTranslationKey(entity, report)).to.be.true;
      expect(report.total_cycles).to.equal('sensor.lr_total_cycles');
    });

    it('should map last_seen to EntityState via getState', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'sensor.lr_last_seen',
        device_id: 'd1',
        translation_key: 'last_seen',
      };

      expect(mapEntitiesByTranslationKey(entity, report)).to.be.true;
      expect(report.last_seen).to.equal('sensor.lr_last_seen');
    });

    it('should map control selects by translation_key to duty fields', () => {
      const keys = [
        ['globe_light', 'select.lr_globe_light'],
        ['globe_brightness', 'select.lr_globe_brightness'],
        ['brightness_level', 'select.lr_panel_brightness'],
        ['cycle_delay', 'select.lr_cycle_delay'],
        ['panel_lockout', 'switch.lr_panel_lockout'],
      ] as const;

      for (const [translation_key, entity_id] of keys) {
        const entity: EntityRegistryDisplayEntry = {
          entity_id,
          device_id: 'd1',
          translation_key,
        };
        expect(mapEntitiesByTranslationKey(entity, report)).to.be.true;
        expect(report[translation_key]).to.equal(entity_id);
      }
    });
  });
});
