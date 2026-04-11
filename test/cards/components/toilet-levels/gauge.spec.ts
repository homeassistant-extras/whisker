import { WhiskerGauge } from '@cards/components/toilet-levels/gauge';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import { nothing } from 'lit';
import { stub } from 'sinon';

describe('gauge.ts', () => {
  it('should render nothing when entity is not set', () => {
    const row = new WhiskerGauge();
    row.kind = 'litter';
    expect(row.render()).to.equal(nothing);
  });

  it('should render litter gauge with fill from entity state', async () => {
    const row = new WhiskerGauge();
    row.kind = 'litter';
    row['entity'] = 'sensor.litter';
    row['state'] = {
      entity_id: 'sensor.litter',
      state: '42',
      attributes: {},
    };

    const tpl = row.render();
    if (tpl === nothing) {
      throw new Error('expected TemplateResult');
    }
    const el = await fixture(tpl);
    const bar = el.querySelector('.bar.litter');

    expect((bar as HTMLElement)?.style.getPropertyValue('--fill')).to.equal(
      '42%',
    );
  });

  it('should render waste gauge with variant classes from entity state', async () => {
    const row = new WhiskerGauge();
    row.kind = 'waste';
    row['entity'] = 'sensor.waste';
    row['state'] = {
      entity_id: 'sensor.waste',
      state: '60',
      attributes: {},
    };

    const tpl = row.render();
    if (tpl === nothing) {
      throw new Error('expected TemplateResult');
    }
    const el = await fixture(tpl);
    const bar = el.querySelector('.bar.waste');

    expect(bar?.classList.contains('gauge-warn')).to.be.true;
  });

  it('should cap level at 100% for bar fill', async () => {
    const row = new WhiskerGauge();
    row.kind = 'litter';
    row['entity'] = 'sensor.litter';
    row['state'] = {
      entity_id: 'sensor.litter',
      state: '150',
      attributes: {},
    };

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
    const row = new WhiskerGauge();
    row.kind = 'litter';
    row['entity'] = 'sensor.litter';
    row['state'] = {
      entity_id: 'sensor.litter',
      state: '10',
      attributes: {},
    };

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
