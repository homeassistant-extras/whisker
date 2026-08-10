import { fillClipRect } from '@cards/components/svg-levels/fill';
import { expect } from 'chai';

const BOUNDS = { top: 10, height: 4 };

describe('fill.ts', () => {
  it('fills the zone from the bottom up', () => {
    // Empty: zero-height rect sitting on the bottom edge.
    expect(fillClipRect(0, BOUNDS)).to.deep.equal({ y: 14, height: 0 });
    // Half full: covers the lower half only.
    expect(fillClipRect(50, BOUNDS)).to.deep.equal({ y: 12, height: 2 });
    // Full: the whole zone.
    expect(fillClipRect(100, BOUNDS)).to.deep.equal({ y: 10, height: 4 });
  });

  it('clamps levels outside 0-100', () => {
    expect(fillClipRect(-20, BOUNDS)).to.deep.equal({ y: 14, height: 0 });
    expect(fillClipRect(150, BOUNDS)).to.deep.equal({ y: 10, height: 4 });
  });
});
