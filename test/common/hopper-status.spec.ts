import { hopperStatusPresentation } from '@common/hopper-status';
import { expect } from 'chai';

describe('hopper-status.ts', () => {
  it('maps Enabled to ready presentation', () => {
    const p = hopperStatusPresentation('Enabled');
    expect(p.icon).to.equal('mdi:filter-check');
    expect(p.color).to.equal('var(--success-color, #2ecc71)');
  });

  it('maps Empty to warn presentation', () => {
    const p = hopperStatusPresentation('Empty');
    expect(p.icon).to.equal('mdi:filter-minus-outline');
    expect(p.color).to.equal('var(--warning-color, #ff9800)');
  });

  it('maps disconnected hopper to filter-remove', () => {
    expect(hopperStatusPresentation('Enabled', 'off').icon).to.equal(
      'mdi:filter-remove',
    );
  });

  it('maps motor faults to HA status icons when connected', () => {
    expect(hopperStatusPresentation('motor_fault_short', 'on').icon).to.equal(
      'mdi:flash-off',
    );
    expect(hopperStatusPresentation('motor_ot_amps', 'on').icon).to.equal(
      'mdi:flash-alert',
    );
    expect(hopperStatusPresentation('motor_disconnected', 'on').icon).to.equal(
      'mdi:engine-off',
    );
  });

  it('maps unknown to unavailable presentation', () => {
    const p = hopperStatusPresentation('unknown');
    expect(p.icon).to.equal('mdi:filter');
    expect(p.color).to.equal(
      'var(--disabled-text-color, var(--secondary-text-color))',
    );
  });
});
