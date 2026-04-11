import {
  WhiskerRobotLevels,
  wasteSeverityClass,
} from '@cards/components/toilet-levels/levels';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import { html } from 'lit';

describe('levels.ts', () => {
  describe('WhiskerRobotLevels', () => {
    it('should default entity ids to null and always mount two gauges', async () => {
      const row = await fixture<WhiskerRobotLevels>(
        html`<whisker-robot-levels></whisker-robot-levels>`,
      );
      expect(row.litter_level).to.be.null;
      expect(row.waste_drawer).to.be.null;
      expect(row.shadowRoot?.querySelectorAll('whisker-gauge').length).to.equal(
        2,
      );
    });

    it('should render both gauges with passed entity ids', async () => {
      const row = await fixture<WhiskerRobotLevels>(
        html`<whisker-robot-levels
          .litter_level=${'sensor.litter'}
          .waste_drawer=${'sensor.waste'}
        ></whisker-robot-levels>`,
      );

      const gauges = row.shadowRoot?.querySelectorAll('whisker-gauge');
      expect(gauges?.length).to.equal(2);
      const [litterGauge, wasteGauge] = gauges ?? [];
      if (!litterGauge || !wasteGauge) {
        throw new Error('Expected two whisker-gauge elements');
      }
      expect(litterGauge.getAttribute('kind')).to.equal('litter');
      expect(wasteGauge.getAttribute('kind')).to.equal('waste');
    });
  });

  describe('wasteSeverityClass', () => {
    it('should return empty below 50%', () => {
      expect(wasteSeverityClass(0)).to.equal('');
      expect(wasteSeverityClass(49)).to.equal('');
    });

    it('should return gauge-warn from 50% through 79%', () => {
      expect(wasteSeverityClass(50)).to.equal('gauge-warn');
      expect(wasteSeverityClass(79)).to.equal('gauge-warn');
    });

    it('should return gauge-error at 80% and above', () => {
      expect(wasteSeverityClass(80)).to.equal('gauge-error');
      expect(wasteSeverityClass(100)).to.equal('gauge-error');
    });

    it('should cap input at 100% for severity', () => {
      expect(wasteSeverityClass(150)).to.equal('gauge-error');
    });
  });
});
