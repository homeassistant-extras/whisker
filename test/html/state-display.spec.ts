import type { HomeAssistant } from '@hass/types';
import { stateDisplay } from '@html/state-display';
import { fixture } from '@open-wc/testing-helpers';
import type { EntityState } from '@type/entity';
import { expect } from 'chai';
import { type TemplateResult } from 'lit';

describe('stateDisplay.ts', () => {
  let mockHass: HomeAssistant;
  let mockEntity: EntityState;

  beforeEach(() => {
    mockEntity = {
      entity_id: 'sensor.test',
      state: '42',
      attributes: {},
    };

    mockHass = {
      states: {
        'sensor.test': mockEntity,
      },
    } as any as HomeAssistant;
  });

  it('should render state-display with correct hass, stateObj, and content properties', async () => {
    const result = stateDisplay(mockHass, mockEntity);
    const el = await fixture(result as TemplateResult);

    expect(el.tagName.toLowerCase()).to.equal('state-display');
    expect((el as { hass?: HomeAssistant }).hass).to.equal(mockHass);
    expect((el as { stateObj?: EntityState }).stateObj).to.equal(mockEntity);
    expect((el as { content?: string }).content).to.be.undefined;

    const withContent = stateDisplay(mockHass, mockEntity, 'last_changed');
    const el2 = await fixture(withContent as TemplateResult);
    expect((el2 as { content?: string }).content).to.equal('last_changed');
  });
});
