import type { EntityState } from '@/types/entity';
import { scoopDroppings } from '@delegates/utils/scoop-droppings';
import type { HomeAssistant } from '@hass/types';
import type { Config } from '@type/config';
import { expect } from 'chai';

const e = (
  domain: string,
  name: string,
  state: string = 'on',
  attributes = {},
): EntityState => ({
  entity_id: `${domain}.${name}`,
  state,
  attributes,
});

describe('scoop-droppings.ts', () => {
  const deviceId = 'lr-device-1';

  const mockHass = {
    devices: {
      [deviceId]: {
        id: deviceId,
        name: 'Living Room LR',
      },
    },
    entities: {
      'sensor.lr_waste': {
        entity_id: 'sensor.lr_waste',
        device_id: deviceId,
        translation_key: 'waste_drawer',
      },
      'sensor.lr_litter': {
        entity_id: 'sensor.lr_litter',
        device_id: deviceId,
        translation_key: 'litter_level',
      },
      'sensor.other_device': {
        entity_id: 'sensor.other_device',
        device_id: 'other',
        translation_key: 'waste_drawer',
      },
      'sensor.lr_pet_weight': {
        entity_id: 'sensor.lr_pet_weight',
        device_id: deviceId,
        translation_key: 'pet_weight',
      },
      'sensor.lr_last_seen': {
        entity_id: 'sensor.lr_last_seen',
        device_id: deviceId,
        translation_key: 'last_seen',
      },
      'sensor.lr_status': {
        entity_id: 'sensor.lr_status',
        device_id: deviceId,
        translation_key: 'status_code',
      },
    },
    states: {
      'sensor.lr_waste': e('sensor', 'lr_waste', '42'),
      'sensor.lr_litter': e('sensor', 'lr_litter', '7.5'),
      'sensor.other_device': e('sensor', 'other_device', '99'),
      'sensor.lr_pet_weight': e('sensor', 'lr_pet_weight', '10.5'),
      'sensor.lr_last_seen': e(
        'sensor',
        'lr_last_seen',
        '2024-06-01T12:00:00+00:00',
      ),
      'sensor.lr_status': e('sensor', 'lr_status', 'rdy'),
    },
  } as unknown as HomeAssistant;

  const config: Config = { device_id: deviceId };

  it('should return undefined when device is missing', () => {
    expect(scoopDroppings(mockHass, { device_id: 'missing' })).to.be.undefined;
  });

  it('should map device name and only matching device entities to levels', () => {
    const report = scoopDroppings(mockHass, config);
    expect(report).to.deep.equal({
      name: 'Living Room LR',
      waste_drawer: 'sensor.lr_waste',
      litter_level: 'sensor.lr_litter',
      status: e('sensor', 'lr_status', 'rdy'),
      pet_weight: 'sensor.lr_pet_weight',
      last_seen: {
        entity_id: 'sensor.lr_last_seen',
        state: '2024-06-01T12:00:00+00:00',
        attributes: {},
      },
    });
  });
});
