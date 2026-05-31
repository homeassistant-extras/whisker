import { stateDisplay } from '@homeassistant-extras/hass/render/state-display';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import type { HassEntity } from '@homeassistant-extras/hass/ws/types';
import { fixture } from '@open-wc/testing-helpers';
import { expect } from 'chai';
import { type TemplateResult } from 'lit';

describe('stateDisplay.ts', () => {
  let mockHass: HomeAssistant;
  let mockEntity: HassEntity;

  beforeEach(() => {
    mockEntity = {
      entity_id: 'sensor.test',
      state: '42',
      attributes: {},
      last_changed: '2024-01-01T00:00:00.000Z',
    };

    mockHass = {
      states: {
        'sensor.test': mockEntity,
      },
    } as unknown as HomeAssistant;
  });

  it('should render state-display with correct hass, stateObj, and content properties', async () => {
    const result = stateDisplay(mockHass, mockEntity);
    const el = await fixture(result as TemplateResult);

    expect(el.tagName.toLowerCase()).to.equal('state-display');
    expect((el as { hass?: HomeAssistant }).hass).to.equal(mockHass);
    expect((el as { stateObj?: HassEntity }).stateObj).to.equal(mockEntity);
    expect((el as { content?: string }).content).to.be.undefined;

    const withContent = stateDisplay(mockHass, mockEntity, 'last_changed');
    const el2 = await fixture(withContent as TemplateResult);
    expect((el2 as { content?: string }).content).to.equal('last_changed');
  });
});
