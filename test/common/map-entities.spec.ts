import type { EntityRegistryDisplayEntry } from '@/hass/data/entity_registry';
import type { EntityState } from '@/types/entity';
import type { DutyReport } from '@/types/types';
import { mapEntitiesByTranslationKey } from '@common/map-entities';
import type { HomeAssistant } from '@hass/types';
import { expect } from 'chai';

const e = (domain: string, name: string, state: string): EntityState => ({
  entity_id: `${domain}.${name}`,
  state,
  attributes: {},
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
          },
          'sensor.lr_status': e('sensor', 'lr_status', 'rdy'),
        },
      } as unknown as HomeAssistant;
    });

    it('should map waste_drawer to waste_drawer', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'sensor.lr_waste',
        device_id: 'd1',
        area_id: '',
        labels: [],
        translation_key: 'waste_drawer',
      };

      expect(mapEntitiesByTranslationKey(hass, entity, report)).to.be.true;
      expect(report.waste_drawer).to.equal('sensor.lr_waste');
    });

    it('should map litter_level to litter_level', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'sensor.lr_litter',
        device_id: 'd1',
        area_id: '',
        labels: [],
        translation_key: 'litter_level',
      };

      expect(mapEntitiesByTranslationKey(hass, entity, report)).to.be.true;
      expect(report.litter_level).to.equal('sensor.lr_litter');
    });

    it('should return false for unknown translation key', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'sensor.lr_waste',
        device_id: 'd1',
        area_id: '',
        labels: [],
        translation_key: 'unknown_key',
      };

      expect(mapEntitiesByTranslationKey(hass, entity, report)).to.be.false;
      expect(report.waste_drawer).to.be.null;
      expect(report.litter_level).to.be.null;
    });

    it('should map status_code translation_key to status EntityState', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'sensor.lr_status',
        device_id: 'd1',
        area_id: '',
        labels: [],
        translation_key: 'status_code',
      };

      expect(mapEntitiesByTranslationKey(hass, entity, report)).to.be.true;
      expect(report.status).to.deep.equal(
        e('sensor', 'lr_status', 'rdy'),
      );
    });

    it('should map reset translation_key to reset', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'button.lr_reset',
        device_id: 'd1',
        area_id: '',
        labels: [],
        translation_key: 'reset',
      };

      expect(mapEntitiesByTranslationKey(hass, entity, report)).to.be.true;
      expect(report.reset).to.equal('button.lr_reset');
    });

    it('should map litter_box translation_key to litter_box vacuum entity', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'vacuum.r2_poop2_litter_box',
        device_id: 'd1',
        area_id: '',
        labels: [],
        translation_key: 'litter_box',
      };

      expect(mapEntitiesByTranslationKey(hass, entity, report)).to.be.true;
      expect(report.litter_box).to.equal('vacuum.r2_poop2_litter_box');
    });

    it('should return false when translation_key is undefined', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'sensor.lr_waste',
        device_id: 'd1',
        area_id: '',
        labels: [],
        translation_key: undefined,
      };

      expect(mapEntitiesByTranslationKey(hass, entity, report)).to.be.false;
    });

    it('should map pet_weight to entity id', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'sensor.lr_pet_weight',
        device_id: 'd1',
        area_id: '',
        labels: [],
        translation_key: 'pet_weight',
      };

      expect(mapEntitiesByTranslationKey(hass, entity, report)).to.be.true;
      expect(report.pet_weight).to.equal('sensor.lr_pet_weight');
    });

    it('should map last_seen to EntityState via getState', () => {
      const entity: EntityRegistryDisplayEntry = {
        entity_id: 'sensor.lr_last_seen',
        device_id: 'd1',
        area_id: '',
        labels: [],
        translation_key: 'last_seen',
      };

      expect(mapEntitiesByTranslationKey(hass, entity, report)).to.be.true;
      expect(report.last_seen).to.deep.equal({
        entity_id: 'sensor.lr_last_seen',
        state: '2024-01-15T10:00:00+00:00',
        attributes: { device_class: 'timestamp' },
      });
    });

    it('should map control selects by translation_key to duty fields', () => {
      const keys = [
        ['globe_light', 'select.lr_globe_light'],
        ['globe_brightness', 'select.lr_globe_brightness'],
        ['brightness_level', 'select.lr_panel_brightness'],
        ['cycle_delay', 'select.lr_cycle_delay'],
      ] as const;

      for (const [translation_key, entity_id] of keys) {
        const entity: EntityRegistryDisplayEntry = {
          entity_id,
          device_id: 'd1',
          area_id: '',
          labels: [],
          translation_key,
        };
        expect(mapEntitiesByTranslationKey(hass, entity, report)).to.be.true;
        expect(report[translation_key]).to.equal(entity_id);
      }
    });
  });
});
