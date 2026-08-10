import {
  litterSeverityClass,
  wasteZoneSeverityClass,
} from '@cards/components/svg-levels/severity';
import { expect } from 'chai';

describe('severity.ts', () => {
  it('maps litter bands to zone classes (high is healthy)', () => {
    expect(litterSeverityClass(100)).to.equal('');
    expect(litterSeverityClass(70)).to.equal('');
    expect(litterSeverityClass(40)).to.equal('zone-warn');
    expect(litterSeverityClass(39)).to.equal('zone-error');
    expect(litterSeverityClass(150)).to.equal('');
  });

  it('maps waste bands to zone classes (high is worse)', () => {
    expect(wasteZoneSeverityClass(0)).to.equal('');
    expect(wasteZoneSeverityClass(49)).to.equal('');
    expect(wasteZoneSeverityClass(50)).to.equal('zone-warn');
    expect(wasteZoneSeverityClass(80)).to.equal('zone-error');
    expect(wasteZoneSeverityClass(150)).to.equal('zone-error');
  });
});
