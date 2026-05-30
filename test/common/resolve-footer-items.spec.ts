import { resolveFooterSlots } from '@common/resolve-footer-items';
import type { DutyReport } from '@type/types';
import { expect } from 'chai';

describe('resolve-footer-items.ts', () => {
  const duty: DutyReport = {
    name: 'LR',
    waste_drawer: 'sensor.waste',
    litter_level: 'sensor.litter',
    reset: null,
    pet_weight: 'sensor.weight',
    status: 'sensor.status',
    last_seen: 'sensor.last_seen',
    total_cycles: 'sensor.total_cycles',
    hopper_status: 'sensor.hopper_status',
    hopper_connected: 'binary_sensor.hopper_connected',
  };

  it('uses DEFAULT_FOOTER when config footer is omitted', () => {
    const slots = resolveFooterSlots({ device_id: 'd1' }, duty);
    expect(slots.map((slot) => slot.key)).to.deep.equal([
      'total_cycles',
      'status_changed',
      'last_seen',
    ]);
  });

  it('uses configured footer items when set', () => {
    const slots = resolveFooterSlots(
      { device_id: 'd1', footer: ['pet_weight', 'status'] },
      duty,
    );
    expect(slots.map((slot) => slot.key)).to.deep.equal([
      'pet_weight',
      'status',
    ]);
  });

  it('resolves entity-backed footer slots from duty', () => {
    const slots = resolveFooterSlots(
      {
        device_id: 'd1',
        footer: ['last_seen', 'status_changed', 'pet_weight', 'total_cycles'],
      },
      duty,
    );
    expect(slots).to.deep.equal([
      { key: 'last_seen', entity: 'sensor.last_seen' },
      {
        key: 'status_changed',
        entity: 'sensor.status',
        content: 'last_changed',
      },
      { key: 'pet_weight', entity: 'sensor.weight' },
      { key: 'total_cycles', entity: 'sensor.total_cycles' },
    ]);
  });

  it('resolves hopper footer slots and omits them when absent', () => {
    const slots = resolveFooterSlots(
      { device_id: 'd1', footer: ['hopper_status', 'hopper_connected'] },
      duty,
    );
    expect(slots).to.deep.equal([
      { key: 'hopper_status', entity: 'sensor.hopper_status' },
      { key: 'hopper_connected', entity: 'binary_sensor.hopper_connected' },
    ]);

    const noHopper = resolveFooterSlots(
      { device_id: 'd1', footer: ['hopper_status', 'hopper_connected'] },
      { ...duty, hopper_status: undefined, hopper_connected: undefined },
    );
    expect(noHopper).to.have.length(0);
  });

  it('omits unavailable footer slots', () => {
    const sparseDuty = {
      ...duty,
      last_seen: undefined,
      total_cycles: undefined,
    };
    const slots = resolveFooterSlots(
      {
        device_id: 'd1',
        footer: ['total_cycles', 'status_changed', 'last_seen'],
      },
      sparseDuty,
    );
    expect(slots).to.have.length(1);
    expect(slots[0]?.key).to.equal('status_changed');
  });
});
