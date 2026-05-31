import { WhiskerGauge } from '@cards/components/toilet-levels/gauge';
import type { HassEntity } from '@homeassistant-extras/hass/ws/types';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import { nothing, type TemplateResult } from 'lit';
import { stub } from 'sinon';

type GaugeWithStates = WhiskerGauge & {
  states: Record<string, HassEntity | undefined> | undefined;
};

function setGaugeState(
  row: GaugeWithStates,
  entityId: string,
  state: HassEntity,
): void {
  row.entity = entityId;
  row.states = { [entityId]: state };
}

describe('gauge.ts', () => {
  it('should render nothing when entity is not set', () => {
    const row = new WhiskerGauge();
    row.kind = 'litter';
    expect(row.render()).to.equal(nothing);
  });

  it('should render litter gauge with fill from entity state', async () => {
    const row = new WhiskerGauge() as GaugeWithStates;
    row.kind = 'litter';
    row.config = { device_id: 'dev' };
    row.hass = {} as never;
    const state: HassEntity = {
      entity_id: 'sensor.litter',
      state: '42',
      attributes: {},
      last_changed: '1970-01-01T00:00:00.000Z',
    };
    setGaugeState(row, 'sensor.litter', state);

    const tpl = row.render();
    const el = await fixture(tpl as TemplateResult);
    const bar = el.querySelector('.bar.litter');

    expect((bar as HTMLElement)?.style.getPropertyValue('--fill')).to.equal(
      '42%',
    );
    expect(el.querySelector('.pct')).to.be.null;
    expect(el.querySelector('.label-row')).to.be.null;

    row.config = { device_id: 'dev', features: ['percentage'] };
    const tplWithPct = row.render();
    const withPct = await fixture(tplWithPct as TemplateResult);
    expect(withPct.querySelector('.label-row')).to.exist;
    const stateDisplayEl = withPct.querySelector('.pct state-display');
    expect(stateDisplayEl).to.exist;
    expect(
      (stateDisplayEl as unknown as { stateObj: unknown }).stateObj,
    ).to.equal(state);
  });

  it('should render waste gauge with variant classes from entity state', async () => {
    const row = new WhiskerGauge() as GaugeWithStates;
    row.kind = 'waste';
    setGaugeState(row, 'sensor.waste', {
      entity_id: 'sensor.waste',
      state: '60',
      attributes: {},
      last_changed: '1970-01-01T00:00:00.000Z',
    });

    const tpl = row.render();
    if (tpl === nothing) {
      throw new Error('expected TemplateResult');
    }
    const el = await fixture(tpl);
    const bar = el.querySelector('.bar.waste');

    expect(bar?.classList.contains('gauge-warn')).to.be.true;
  });

  it('should cap level at 100% for bar fill', async () => {
    const row = new WhiskerGauge() as GaugeWithStates;
    row.kind = 'litter';
    setGaugeState(row, 'sensor.litter', {
      entity_id: 'sensor.litter',
      state: '150',
      attributes: {},
      last_changed: '1970-01-01T00:00:00.000Z',
    });

    const tpl = row.render();
    if (tpl === nothing) {
      throw new Error('expected TemplateResult');
    }
    const el = await fixture(tpl);
    const bar = el.querySelector('.bar.litter');

    expect((bar as HTMLElement)?.style.getPropertyValue('--fill')).to.equal(
      '100%',
    );
  });

  it('should fire hass-more-info with entity id when hit area is clicked', async () => {
    const row = new WhiskerGauge() as GaugeWithStates;
    row.kind = 'litter';
    row.hass = {
      connection: { subscribeMessage: () => Promise.resolve(() => {}) },
    } as never;
    setGaugeState(row, 'sensor.litter', {
      entity_id: 'sensor.litter',
      state: '10',
      attributes: {},
      last_changed: '1970-01-01T00:00:00.000Z',
    });

    document.body.appendChild(row);
    await row.updateComplete;

    const hit = row.shadowRoot?.querySelector('.hit');
    if (!hit) {
      throw new Error('expected .hit');
    }

    const dispatchStub = stub(row, 'dispatchEvent').returns(true);
    (hit as HTMLElement).click();

    expect(dispatchStub.calledOnce).to.be.true;
    const ev = dispatchStub.firstCall.args[0];
    expect(ev.type).to.equal('hass-more-info');
    expect((ev as unknown as { detail: unknown }).detail).to.deep.equal({
      entityId: 'sensor.litter',
    });

    dispatchStub.restore();
    row.remove();
  });
});
