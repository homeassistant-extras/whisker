import { openEntityMoreInfo } from '@common/open-entity-more-info';
import { expect } from 'chai';
import { stub } from 'sinon';

describe('open-entity-more-info.ts', () => {
  let target: HTMLElement;
  let dispatchStub: sinon.SinonStub;

  beforeEach(() => {
    target = document.createElement('div');
    dispatchStub = stub(target, 'dispatchEvent').returns(true);
  });

  afterEach(() => {
    dispatchStub.restore();
  });

  it('does not dispatch when entityId is missing', () => {
    openEntityMoreInfo(target, undefined);
    openEntityMoreInfo(target, null);
    openEntityMoreInfo(target, '');
    expect(dispatchStub.called).to.be.false;
  });

  it('dispatches hass-more-info with entityId on target', () => {
    openEntityMoreInfo(target, 'sensor.cat_weight');

    expect(dispatchStub.calledOnce).to.be.true;
    const ev = dispatchStub.firstCall.args[0] as Event & {
      detail: { entityId: string };
    };
    expect(ev.type).to.equal('hass-more-info');
    expect(ev.detail).to.deep.equal({ entityId: 'sensor.cat_weight' });
  });
});
