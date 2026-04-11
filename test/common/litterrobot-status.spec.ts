import {
  isLitterRobotCycling,
  litterRobotStatusPresentation,
} from '@common/litterrobot-status';
import { expect } from 'chai';

describe('litterrobot-status.ts', () => {
  it('should map rdy to good presentation', () => {
    const p = litterRobotStatusPresentation('rdy');
    expect(p.icon).to.equal('mdi:check-circle-outline');
    expect(p.color).to.include('success');
  });

  it('should map offline to offline icon', () => {
    const p = litterRobotStatusPresentation('offline');
    expect(p.icon).to.equal('mdi:cloud-off-outline');
  });

  it('should map ccp to active', () => {
    const p = litterRobotStatusPresentation('ccp');
    expect(p.icon).to.equal('mdi:autorenew');
  });

  it('should treat unknown codes as unavailable styling', () => {
    const p = litterRobotStatusPresentation('not_a_real_code');
    expect(p.icon).to.equal('mdi:help-circle-outline');
  });

  it('should handle unknown and unavailable states', () => {
    expect(litterRobotStatusPresentation('unknown').icon).to.equal(
      'mdi:help-circle-outline',
    );
    expect(litterRobotStatusPresentation('unavailable').icon).to.equal(
      'mdi:help-circle-outline',
    );
    expect(litterRobotStatusPresentation(null).icon).to.equal(
      'mdi:help-circle-outline',
    );
  });

  describe('isLitterRobotCycling', () => {
    it('should be true for ccp, ec, and cst', () => {
      expect(isLitterRobotCycling('ccp')).to.be.true;
      expect(isLitterRobotCycling('ec')).to.be.true;
      expect(isLitterRobotCycling('cst')).to.be.true;
    });

    it('should be false for ready and unknown codes', () => {
      expect(isLitterRobotCycling('rdy')).to.be.false;
      expect(isLitterRobotCycling('cd')).to.be.false;
      expect(isLitterRobotCycling(null)).to.be.false;
      expect(isLitterRobotCycling('unknown')).to.be.false;
    });
  });
});
