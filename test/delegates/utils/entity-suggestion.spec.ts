import { getEntitySuggestion } from '@delegates/utils/entity-suggestion';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { expect } from 'chai';

describe('entity-suggestion.ts', () => {
  const deviceId = 'lr-device-1';

  const mockHass = {
    devices: {
      [deviceId]: {
        id: deviceId,
        name: 'Living Room LR',
        identifiers: [['litterrobot', 'serial-123']],
      },
      'other-device': {
        id: 'other-device',
        name: 'Some Light',
        identifiers: [['hue', 'abc']],
      },
    },
    entities: {
      'sensor.lr_status': {
        entity_id: 'sensor.lr_status',
        device_id: deviceId,
      },
      'light.kitchen': {
        entity_id: 'light.kitchen',
        device_id: 'other-device',
      },
      'sensor.orphan': {
        entity_id: 'sensor.orphan',
        device_id: 'missing-device',
      },
      'sensor.no_device': {
        entity_id: 'sensor.no_device',
      },
    },
  } as unknown as HomeAssistant;

  it('should suggest the card for a Litter-Robot entity', () => {
    expect(getEntitySuggestion(mockHass, 'sensor.lr_status')).to.deep.equal({
      config: {
        type: 'custom:whisker-card',
        device_id: deviceId,
      },
    });
  });

  it('should return null for an entity on a non-litterrobot device', () => {
    expect(getEntitySuggestion(mockHass, 'light.kitchen')).to.be.null;
  });

  it('should return null for an unknown entity', () => {
    expect(getEntitySuggestion(mockHass, 'sensor.does_not_exist')).to.be.null;
  });

  it('should return null when the entity has no device', () => {
    expect(getEntitySuggestion(mockHass, 'sensor.no_device')).to.be.null;
  });

  it('should return null when the device is missing from the registry', () => {
    expect(getEntitySuggestion(mockHass, 'sensor.orphan')).to.be.null;
  });
});
