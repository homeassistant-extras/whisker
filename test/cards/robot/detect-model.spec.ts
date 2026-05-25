import { DEFAULT_MODEL, detectModelKey } from '@cards/robot/detect-model';
import { expect } from 'chai';

describe('detect-model.ts', () => {
  describe('serial prefix (authoritative)', () => {
    it('maps LR5 serial to lr5', () => {
      expect(
        detectModelKey('Litter-Robot 5', 'LR5-02-40-01-2604-08431D'),
      ).to.equal('lr5');
    });

    it('maps LR5 serial + Pro model to lr5-pro', () => {
      expect(
        detectModelKey('Litter-Robot 5 Pro', 'LR5-02-40-01-2604-08431D'),
      ).to.equal('lr5-pro');
    });

    it('maps LR4 serial to lr4 regardless of model string', () => {
      expect(detectModelKey('Litter-Robot 4', 'LR4-12-34')).to.equal('lr4');
    });

    it('maps LRE serial to lre (Litter-Robot Evo)', () => {
      expect(detectModelKey(null, 'LRE-99-00')).to.equal('lre');
    });

    it('is case-insensitive and trims the serial', () => {
      expect(detectModelKey(null, '  lr4-aa  ')).to.equal('lr4');
    });

    it('prefers the serial over a mismatched model string', () => {
      expect(detectModelKey('Litter-Robot 4', 'LR5-xx')).to.equal('lr5');
    });
  });

  describe('model string fallback (no recognized serial)', () => {
    it('detects Evo from the model name', () => {
      expect(detectModelKey('Litter-Robot Evo', null)).to.equal('lre');
    });

    it('detects 5 + Pro from the model name', () => {
      expect(detectModelKey('Litter-Robot 5 Pro', '')).to.equal('lr5-pro');
    });

    it('detects 5 from the model name', () => {
      expect(detectModelKey('Litter-Robot 5', undefined)).to.equal('lr5');
    });

    it('detects 4 from the model name', () => {
      expect(detectModelKey('Litter-Robot 4', null)).to.equal('lr4');
    });
  });

  describe('default', () => {
    it('falls back to DEFAULT_MODEL when nothing matches', () => {
      expect(detectModelKey(null, null)).to.equal(DEFAULT_MODEL);
      expect(detectModelKey('Feeder-Robot', 'FR-1')).to.equal(DEFAULT_MODEL);
    });
  });
});
