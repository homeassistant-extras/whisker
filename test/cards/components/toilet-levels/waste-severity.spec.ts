import { wasteSeverityClass } from '@cards/components/toilet-levels/waste-severity';
import { expect } from 'chai';

describe('waste-severity.ts', () => {
  it('returns empty below 50%', () => {
    expect(wasteSeverityClass(0)).to.equal('');
    expect(wasteSeverityClass(49)).to.equal('');
  });

  it('returns gauge-warn from 50% up to 79%', () => {
    expect(wasteSeverityClass(50)).to.equal('gauge-warn');
    expect(wasteSeverityClass(79)).to.equal('gauge-warn');
  });

  it('returns gauge-error at 80% and above', () => {
    expect(wasteSeverityClass(80)).to.equal('gauge-error');
    expect(wasteSeverityClass(100)).to.equal('gauge-error');
  });

  it('caps level at 100% for threshold checks', () => {
    expect(wasteSeverityClass(150)).to.equal('gauge-error');
  });
});
