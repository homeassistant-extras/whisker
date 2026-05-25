import {
  computeStateName,
  computeStateNameFromEntityAttributes,
} from '@hass/common/entity/compute_state_name';
import type { HassEntity } from '@hass/ws/types';
import { expect } from 'chai';

describe('compute_state_name.ts', () => {
  describe('computeStateNameFromEntityAttributes', () => {
    it('returns friendly_name when present', () => {
      expect(
        computeStateNameFromEntityAttributes('light.living_room', {
          friendly_name: 'Living Room Light',
        }),
      ).to.equal('Living Room Light');
    });

    it('derives a readable name from the entity id when friendly_name is missing', () => {
      expect(
        computeStateNameFromEntityAttributes('sensor.kitchen_temperature', {}),
      ).to.equal('kitchen temperature');
    });

    it('treats an empty friendly_name as blank', () => {
      expect(
        computeStateNameFromEntityAttributes('sensor.test', {
          friendly_name: '',
        }),
      ).to.equal('');
    });
  });

  describe('computeStateName', () => {
    it('delegates to computeStateNameFromEntityAttributes', () => {
      const stateObj = {
        entity_id: 'sensor.status',
        state: 'rdy',
        attributes: { friendly_name: 'Status' },
        last_changed: '2024-01-01T00:00:00+00:00',
      } as HassEntity;

      expect(computeStateName(stateObj)).to.equal('Status');
    });
  });
});
