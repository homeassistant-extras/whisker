import { numericLevelFromEntityState } from '@cards/components/toilet-levels/numeric-level';
import { expect } from 'chai';

describe('numeric-level.ts', () => {
  it('returns 0 when state is undefined', () => {
    expect(numericLevelFromEntityState(undefined)).to.equal(0);
  });

  it('returns 0 when state string is empty', () => {
    expect(
      numericLevelFromEntityState({
        entity_id: 'sensor.x',
        state: '',
        attributes: {},
      }),
    ).to.equal(0);
  });

  it('returns 0 for non-numeric state', () => {
    expect(
      numericLevelFromEntityState({
        entity_id: 'sensor.x',
        state: 'unknown',
        attributes: {},
      }),
    ).to.equal(0);
  });

  it('parses integer and decimal state strings', () => {
    expect(
      numericLevelFromEntityState({
        entity_id: 'sensor.x',
        state: '42',
        attributes: {},
      }),
    ).to.equal(42);
    expect(
      numericLevelFromEntityState({
        entity_id: 'sensor.x',
        state: '3.25',
        attributes: {},
      }),
    ).to.equal(3.25);
  });
});
