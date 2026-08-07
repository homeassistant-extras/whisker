import type { EntityState } from '@/types/entity';
import { scoopDroppings } from '@delegates/utils/scoop-droppings';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
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
  last_changed: '2024-06-01T12:00:00+00:00',
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
        platform: 'litterrobot',
        translation_key: 'waste_drawer',
      },
      'sensor.lr_litter': {
        entity_id: 'sensor.lr_litter',
        device_id: deviceId,
        platform: 'litterrobot',
        translation_key: 'litter_level',
      },
      'sensor.other_device': {
        entity_id: 'sensor.other_device',
        device_id: 'other',
        platform: 'litterrobot',
        translation_key: 'waste_drawer',
      },
      'sensor.lr_pet_weight': {
        entity_id: 'sensor.lr_pet_weight',
        device_id: deviceId,
        platform: 'litterrobot',
        translation_key: 'pet_weight',
      },
      'sensor.lr_last_seen': {
        entity_id: 'sensor.lr_last_seen',
        device_id: deviceId,
        platform: 'litterrobot',
        translation_key: 'last_seen',
      },
      'sensor.lr_total_cycles': {
        entity_id: 'sensor.lr_total_cycles',
        device_id: deviceId,
        platform: 'litterrobot',
        translation_key: 'total_cycles',
      },
      'sensor.lr_status': {
        entity_id: 'sensor.lr_status',
        device_id: deviceId,
        platform: 'litterrobot',
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
      'sensor.lr_total_cycles': e('sensor', 'lr_total_cycles', '1234'),
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
      model: null,
      serial_number: null,
      kitties: [],
      visits: [],
      waste_drawer: 'sensor.lr_waste',
      litter_level: 'sensor.lr_litter',
      status: 'sensor.lr_status',
      pet_weight: 'sensor.lr_pet_weight',
      last_seen: 'sensor.lr_last_seen',
      total_cycles: 'sensor.lr_total_cycles',
    });
  });

  it('should auto-detect weight entities from other devices into kitties', () => {
    const hass = {
      ...mockHass,
      entities: {
        ...mockHass.entities,
        'sensor.cat_weight': {
          entity_id: 'sensor.cat_weight',
          device_id: 'other',
          platform: 'litterrobot',
        },
      },
      states: {
        ...mockHass.states,
        'sensor.cat_weight': e('sensor', 'cat_weight', '11.2', {
          device_class: 'weight',
        }),
      },
    } as unknown as HomeAssistant;

    const report = scoopDroppings(hass, config);
    expect(report?.kitties).to.deep.equal(['sensor.cat_weight']);
  });

  it('should not auto-detect weight entities when chonk entities are configured', () => {
    const hass = {
      ...mockHass,
      entities: {
        ...mockHass.entities,
        'sensor.cat_weight': {
          entity_id: 'sensor.cat_weight',
          device_id: 'other',
          platform: 'litterrobot',
        },
      },
      states: {
        ...mockHass.states,
        'sensor.cat_weight': e('sensor', 'cat_weight', '11.2', {
          device_class: 'weight',
        }),
      },
    } as unknown as HomeAssistant;

    const report = scoopDroppings(hass, {
      device_id: deviceId,
      chonk: { kitties: ['sensor.my_cat'] },
    });
    expect(report?.kitties).to.deep.equal(['sensor.my_cat']);
  });

  /** hass fixture with a pet device exposing both weight and visits sensors */
  const hassWithPet = {
    ...mockHass,
    entities: {
      ...mockHass.entities,
      'sensor.cat_weight': {
        entity_id: 'sensor.cat_weight',
        device_id: 'pet-1',
        platform: 'litterrobot',
      },
      'sensor.ellie_visits_today': {
        entity_id: 'sensor.ellie_visits_today',
        device_id: 'pet-1',
        platform: 'litterrobot',
        translation_key: 'visits_today',
      },
    },
    states: {
      ...mockHass.states,
      'sensor.cat_weight': e('sensor', 'cat_weight', '11.2', {
        device_class: 'weight',
      }),
      'sensor.ellie_visits_today': e('sensor', 'ellie_visits_today', '3', {
        state_class: 'total',
        unit_of_measurement: 'visits',
      }),
    },
  } as unknown as HomeAssistant;

  it('should auto-detect visits entities from other devices into visits', () => {
    const report = scoopDroppings(hassWithPet, config);
    expect(report?.visits).to.deep.equal(['sensor.ellie_visits_today']);
  });

  it('should keep weight and visits detection separate', () => {
    const report = scoopDroppings(hassWithPet, config);
    expect(report?.kitties).to.deep.equal(['sensor.cat_weight']);
    expect(report?.visits).to.deep.equal(['sensor.ellie_visits_today']);
  });

  it('should not auto-detect visits entities when they are configured', () => {
    const report = scoopDroppings(hassWithPet, {
      device_id: deviceId,
      visits: { kitties: ['sensor.my_cat_visits'] },
    });
    expect(report?.visits).to.deep.equal(['sensor.my_cat_visits']);
  });

  it('should ignore a visits_today entity on the configured device', () => {
    const hass = {
      ...mockHass,
      entities: {
        ...mockHass.entities,
        'sensor.lr_visits_today': {
          entity_id: 'sensor.lr_visits_today',
          device_id: deviceId,
          platform: 'litterrobot',
          translation_key: 'visits_today',
        },
      },
      states: {
        ...mockHass.states,
        'sensor.lr_visits_today': e('sensor', 'lr_visits_today', '9'),
      },
    } as unknown as HomeAssistant;

    const report = scoopDroppings(hass, config);
    expect(report?.visits).to.deep.equal([]);
  });

  it('should not collect entities for a hidden visits graph', () => {
    const report = scoopDroppings(hassWithPet, {
      device_id: deviceId,
      visits: { hide: true, kitties: ['sensor.my_cat_visits'] },
    });
    expect(report?.visits).to.deep.equal([]);
    // the weight graph is unaffected
    expect(report?.kitties).to.deep.equal(['sensor.cat_weight']);
  });

  it('should not collect entities for a hidden weight graph', () => {
    const report = scoopDroppings(hassWithPet, {
      device_id: deviceId,
      chonk: { hide: true, kitties: ['sensor.my_cat'] },
    });
    expect(report?.kitties).to.deep.equal([]);
    // the visits graph is unaffected
    expect(report?.visits).to.deep.equal(['sensor.ellie_visits_today']);
  });

  it('should ignore visits entities from other integrations', () => {
    const hass = {
      ...mockHass,
      entities: {
        ...mockHass.entities,
        'sensor.other_visits': {
          entity_id: 'sensor.other_visits',
          device_id: 'pet-1',
          platform: 'some_other_integration',
          translation_key: 'visits_today',
        },
      },
      states: {
        ...mockHass.states,
        'sensor.other_visits': e('sensor', 'other_visits', '5'),
      },
    } as unknown as HomeAssistant;

    const report = scoopDroppings(hass, config);
    expect(report?.visits).to.deep.equal([]);
  });
});
