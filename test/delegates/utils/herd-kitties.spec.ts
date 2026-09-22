import { herdKitties } from '@delegates/utils/herd-kitties';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { expect } from 'chai';

describe('herd-kitties.ts', () => {
  const mockHass = {
    devices: {
      'pet-1': { id: 'pet-1', name: 'Ziggy' },
      'pet-2': { id: 'pet-2', name: 'Aster' },
      'lr-1': { id: 'lr-1', name: 'Living Room LR' },
    },
    entities: {
      'sensor.ziggy_weight': {
        entity_id: 'sensor.ziggy_weight',
        device_id: 'pet-1',
        platform: 'litterrobot',
      },
      'sensor.ziggy_visits': {
        entity_id: 'sensor.ziggy_visits',
        device_id: 'pet-1',
        platform: 'litterrobot',
        translation_key: 'visits_today',
      },
      'sensor.aster_weight': {
        entity_id: 'sensor.aster_weight',
        device_id: 'pet-2',
        platform: 'litterrobot',
      },
      // the robot's own pet weight sensor — has a translation key, so it is
      // never mistaken for a pet
      'sensor.lr_pet_weight': {
        entity_id: 'sensor.lr_pet_weight',
        device_id: 'lr-1',
        platform: 'litterrobot',
        translation_key: 'pet_weight',
      },
      // another integration's weight sensor
      'sensor.scale_weight': {
        entity_id: 'sensor.scale_weight',
        device_id: 'scale-1',
        platform: 'esphome',
      },
    },
    states: {
      'sensor.ziggy_weight': {
        entity_id: 'sensor.ziggy_weight',
        state: '12.4',
        attributes: { device_class: 'weight' },
        last_changed: '2024-06-01T12:00:00+00:00',
      },
      'sensor.aster_weight': {
        entity_id: 'sensor.aster_weight',
        state: '9.1',
        attributes: { device_class: 'weight' },
        last_changed: '2024-06-01T12:00:00+00:00',
      },
      'sensor.lr_pet_weight': {
        entity_id: 'sensor.lr_pet_weight',
        state: '12.4',
        attributes: { device_class: 'weight' },
        last_changed: '2024-06-01T12:00:00+00:00',
      },
      'sensor.scale_weight': {
        entity_id: 'sensor.scale_weight',
        state: '70',
        attributes: { device_class: 'weight' },
        last_changed: '2024-06-01T12:00:00+00:00',
      },
    },
  } as unknown as HomeAssistant;

  it('groups pet sensors by device, sorted by name', () => {
    expect(herdKitties(mockHass)).to.deep.equal([
      { id: 'pet-2', name: 'Aster', weight: 'sensor.aster_weight' },
      {
        id: 'pet-1',
        name: 'Ziggy',
        weight: 'sensor.ziggy_weight',
        visits: 'sensor.ziggy_visits',
      },
    ]);
  });

  it('keeps only the configured pets', () => {
    const pets = herdKitties(mockHass, ['pet-1']);
    expect(pets.map((pet) => pet.id)).to.deep.equal(['pet-1']);
  });

  it('falls back to a name when the device has none', () => {
    const nameless = {
      ...mockHass,
      devices: { 'pet-3': { id: 'pet-3' } },
      entities: {
        'sensor.mystery_visits': {
          entity_id: 'sensor.mystery_visits',
          device_id: 'pet-3',
          platform: 'litterrobot',
          translation_key: 'visits_today',
        },
      },
    } as unknown as HomeAssistant;

    expect(herdKitties(nameless)).to.deep.equal([
      { id: 'pet-3', name: 'Kitty', visits: 'sensor.mystery_visits' },
    ]);
  });
});
