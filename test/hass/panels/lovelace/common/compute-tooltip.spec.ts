import { computeTooltip } from '@hass/panels/lovelace/common/compute-tooltip';
import type { HomeAssistant } from '@hass/types';
import { expect } from 'chai';

describe('compute-tooltip.ts', () => {
  const hass = {
    states: {
      'sensor.status': {
        entity_id: 'sensor.status',
        state: 'rdy',
        attributes: { friendly_name: 'Status' },
        last_changed: '2024-01-01T00:00:00+00:00',
      },
    },
    localize: (key: string, values?: Record<string, unknown>) => {
      switch (key) {
        case 'ui.panel.lovelace.cards.picture-elements.tap':
          return 'Tap:';
        case 'ui.panel.lovelace.cards.picture-elements.hold':
          return 'Hold:';
        case 'ui.panel.lovelace.cards.picture-elements.more_info':
          return `Show more info: ${values?.name ?? ''}`;
        default:
          return key;
      }
    },
  } as unknown as HomeAssistant;

  it('returns explicit title when configured', () => {
    expect(
      computeTooltip(hass, {
        entity: 'sensor.status',
        title: 'Custom title',
        tap_action: { action: 'more-info' },
      }),
    ).to.equal('Custom title');
  });

  it('returns empty string when title is null', () => {
    expect(
      computeTooltip(hass, {
        entity: 'sensor.status',
        title: null,
        tap_action: { action: 'more-info' },
      }),
    ).to.equal('');
  });

  it('returns only tap tooltip when hold is none', () => {
    expect(
      computeTooltip(hass, {
        entity: 'sensor.status',
        tap_action: { action: 'more-info' },
        hold_action: { action: 'none' },
      }),
    ).to.equal('Tap:Show more info: Status');
  });

  it('returns tap and hold tooltips on separate lines', () => {
    expect(
      computeTooltip(hass, {
        entity: 'sensor.status',
        tap_action: { action: 'more-info' },
        hold_action: { action: 'more-info' },
      }),
    ).to.equal('Tap:Show more info: Status\nHold:Show more info: Status');
  });

  it('returns friendly name when no actions are configured', () => {
    expect(
      computeTooltip(hass, {
        entity: 'sensor.status',
      }),
    ).to.equal('Status');
  });
});
