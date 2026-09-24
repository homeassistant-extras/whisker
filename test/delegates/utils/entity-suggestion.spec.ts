import {
  getEntitySuggestion,
  getPetEntitySuggestion,
} from '@delegates/utils/entity-suggestion';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { expect } from 'chai';

describe('entity-suggestion.ts', () => {
  const deviceId = 'lr-device-1';
  const petDeviceId = 'pet-ziggy';

  const mockHass = {
    devices: {
      [deviceId]: {
        id: deviceId,
        name: 'Living Room LR',
        identifiers: [['litterrobot', 'serial-123']],
      },
      [petDeviceId]: {
        id: petDeviceId,
        name: 'Ziggy',
        identifiers: [['litterrobot', 'pet-ziggy']],
      },
      'other-device': {
        id: 'other-device',
        name: 'Some Light',
        identifiers: [['hue', 'abc']],
      },
      'scale-device': {
        id: 'scale-device',
        name: 'Bathroom Scale',
        identifiers: [['withings', 'scale']],
      },
    },
    entities: {
      'sensor.lr_status': {
        entity_id: 'sensor.lr_status',
        device_id: deviceId,
        platform: 'litterrobot',
        translation_key: 'status_code',
      },
      'sensor.ziggy_weight': {
        entity_id: 'sensor.ziggy_weight',
        device_id: petDeviceId,
        platform: 'litterrobot',
      },
      'sensor.ziggy_visits': {
        entity_id: 'sensor.ziggy_visits',
        device_id: petDeviceId,
        platform: 'litterrobot',
        translation_key: 'visits_today',
      },
      'light.kitchen': {
        entity_id: 'light.kitchen',
        device_id: 'other-device',
        platform: 'hue',
      },
      'sensor.scale': {
        entity_id: 'sensor.scale',
        device_id: 'scale-device',
        platform: 'withings',
      },
      'sensor.orphan': {
        entity_id: 'sensor.orphan',
        device_id: 'missing-device',
        platform: 'litterrobot',
      },
      'sensor.no_device': {
        entity_id: 'sensor.no_device',
      },
    },
    states: {
      'sensor.ziggy_weight': {
        attributes: { device_class: 'weight' },
      },
      'sensor.scale': {
        attributes: { device_class: 'weight' },
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

  it('should leave pet sensors to the pet card', () => {
    expect(getEntitySuggestion(mockHass, 'sensor.ziggy_weight')).to.be.null;
    expect(getEntitySuggestion(mockHass, 'sensor.ziggy_visits')).to.be.null;
  });

  it('should suggest the pet card for a pet weight sensor', () => {
    expect(
      getPetEntitySuggestion(mockHass, 'sensor.ziggy_weight'),
    ).to.deep.equal({
      config: {
        type: 'custom:whisker-pet-card',
        pets: [petDeviceId],
      },
    });
  });

  it('should suggest the pet card for a pet visits sensor', () => {
    expect(
      getPetEntitySuggestion(mockHass, 'sensor.ziggy_visits'),
    ).to.deep.equal({
      config: {
        type: 'custom:whisker-pet-card',
        pets: [petDeviceId],
      },
    });
  });

  it('should not suggest the pet card for a robot or unrelated weight sensor', () => {
    expect(getPetEntitySuggestion(mockHass, 'sensor.lr_status')).to.be.null;
    expect(getPetEntitySuggestion(mockHass, 'sensor.scale')).to.be.null;
    expect(getPetEntitySuggestion(mockHass, 'sensor.does_not_exist')).to.be
      .null;
  });
});
