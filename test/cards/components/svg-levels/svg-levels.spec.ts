import { WhiskerSvgLevels } from '@cards/components/svg-levels/svg-levels';
import type { HassEntity } from '@homeassistant-extras/hass/ws/types';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import { nothing, type TemplateResult } from 'lit';

type SvgLevelsWithStates = WhiskerSvgLevels & {
  states: Record<string, HassEntity | undefined>;
};

describe('svg-levels.ts', () => {
  it('should render nothing when no level entities are set', () => {
    const el = new WhiskerSvgLevels();
    expect(el.render()).to.equal(nothing);
  });

  it('should color litter and waste zones from entity levels', async () => {
    const row = new WhiskerSvgLevels() as SvgLevelsWithStates;
    row.config = { device_id: 'dev' };
    row.hass = {} as never;
    row.litter_level = 'sensor.litter';
    row.waste_drawer = 'sensor.waste';
    row.states = {
      'sensor.litter': {
        entity_id: 'sensor.litter',
        state: '35',
        attributes: {},
        last_changed: '1970-01-01T00:00:00.000Z',
        last_updated: '1970-01-01T00:00:00.000Z',
      },
      'sensor.waste': {
        entity_id: 'sensor.waste',
        state: '60',
        attributes: {},
        last_changed: '1970-01-01T00:00:00.000Z',
        last_updated: '1970-01-01T00:00:00.000Z',
      },
    };

    const tpl = row.render();
    if (tpl === nothing) {
      throw new Error('expected TemplateResult');
    }
    const el = await fixture(tpl as TemplateResult);
    const litter = el.querySelector('.zone.litter');
    const waste = el.querySelector('.zone.waste');

    expect(litter?.classList.contains('zone-error')).to.be.true;
    expect(waste?.classList.contains('zone-warn')).to.be.true;
    // fills come from CSS classes (not presentation attrs — var() is unreliable there)
    expect(litter?.hasAttribute('fill')).to.be.false;
    expect(waste?.hasAttribute('fill')).to.be.false;
    expect(el.querySelector('.body-white')).to.exist;
    expect(el.querySelector('.label-row')).to.be.null;

    row.config = { device_id: 'dev', color: 'black' };
    const blackBody = await fixture(row.render() as TemplateResult);
    expect(blackBody.querySelector('.body-black')).to.exist;
    expect(blackBody.querySelector('.body-white')).to.be.null;

    row.config = { device_id: 'dev', features: ['percentage'] };
    const withPct = await fixture(row.render() as TemplateResult);
    expect(withPct.querySelector('.label-row')).to.exist;
  });
});
