import {
  applyDiff,
  compressedToEntityState,
  isMeaningfulChange,
} from '@delegates/entities/subscribe-entities';
import type { EntityDiff, EntityState as HassEntityState } from '@hass/ws/entities';
import type { EntityState } from '@/types/entity';
import { expect } from 'chai';

describe('subscribe-entities', () => {
  describe('compressedToEntityState', () => {
    it('maps compressed state and attributes to EntityState', () => {
      const result = compressedToEntityState('light.kitchen', {
        s: 'on',
        a: { brightness: 128 },
        c: '',
      });
      expect(result.entity_id).to.equal('light.kitchen');
      expect(result.state).to.equal('on');
      expect(result.attributes).to.deep.equal({ brightness: 128 });
    });

    it('defaults attributes to empty object when a is missing', () => {
      const result = compressedToEntityState('sensor.x', {
        s: '42',
        c: '',
      } as HassEntityState);
      expect(result.attributes).to.deep.equal({});
    });
  });

  describe('isMeaningfulChange', () => {
    it('is true when state is added', () => {
      expect(isMeaningfulChange({ '+': { s: 'on' } })).to.be.true;
    });

    it('is true when attributes are added', () => {
      expect(isMeaningfulChange({ '+': { a: { x: 1 } } })).to.be.true;
    });

    it('is true when attributes are removed', () => {
      expect(isMeaningfulChange({ '-': { a: ['brightness'] } })).to.be.true;
    });

    it('is false for empty diff', () => {
      expect(isMeaningfulChange({})).to.be.false;
    });

    it('is false when add only has unrelated keys', () => {
      expect(
        isMeaningfulChange({ '+': { c: '' } } as EntityDiff),
      ).to.be.false;
    });

    it('is false when remove has empty attribute list', () => {
      expect(isMeaningfulChange({ '-': { a: [] } })).to.be.false;
    });
  });

  describe('applyDiff', () => {
    const base = (): EntityState => ({
      entity_id: 'light.x',
      state: 'off',
      attributes: { brightness: 100 },
    });

    it('updates state from add.s', () => {
      const current = base();
      const next = applyDiff(current, 'light.x', { '+': { s: 'on' } });
      expect(next.state).to.equal('on');
      expect(next.entity_id).to.equal('light.x');
    });

    it('merges add.a into attributes', () => {
      const current = base();
      const next = applyDiff(current, 'light.x', {
        '+': { a: { color_mode: 'hs' } },
      });
      expect(next.attributes).to.deep.equal({
        brightness: 100,
        color_mode: 'hs',
      });
    });

    it('removes keys listed in remove.a', () => {
      const current = base();
      const next = applyDiff(current, 'light.x', {
        '-': { a: ['brightness'] },
      });
      expect(next.attributes).to.deep.equal({});
    });
  });
});
