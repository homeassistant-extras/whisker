import { computeObjectId } from '@hass/common/entity/compute_object_id';
import { expect } from 'chai';

describe('compute_object_id.ts', () => {
  it('extracts the object id after the domain', () => {
    expect(computeObjectId('light.living_room')).to.equal('living_room');
    expect(computeObjectId('sensor.kitchen_temperature')).to.equal(
      'kitchen_temperature',
    );
  });

  it('returns the full string when no domain separator is present', () => {
    expect(computeObjectId('invalid_entity_id')).to.equal('invalid_entity_id');
  });
});
