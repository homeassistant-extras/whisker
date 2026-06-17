import { WhiskerWeightGraph } from '@cards/components/weight-graph/weight-graph';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import {
  DEFAULT_WEIGHT_DAYS_TO_SHOW,
  DEFAULT_WEIGHT_HOURS_TO_SHOW,
  DEFAULT_WEIGHT_STAT_TYPES,
  type Config,
} from '@type/config';
import type { CardHelpers } from '@type/lovelace';
import { expect } from 'chai';
import { nothing } from 'lit';
import { stub } from 'sinon';

describe('weight-graph.ts (WhiskerWeightGraph)', () => {
  let mockHass: HomeAssistant;
  let mockCreateCardElement: sinon.SinonStub;

  beforeEach(() => {
    mockCreateCardElement = stub().callsFake(() =>
      document.createElement('div'),
    );

    globalThis.poatCardHelpers = {
      createCardElement: mockCreateCardElement,
      createRowElement: stub(),
      createHuiElement: stub(),
    } as CardHelpers;

    mockHass = {
      connection: {
        subscribeMessage: () => Promise.resolve(() => {}),
      },
    } as unknown as HomeAssistant;
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'poatCardHelpers');
  });

  it('renders nothing when there are no entities', () => {
    const el = new WhiskerWeightGraph();
    el.hass = mockHass;
    el.config = { device_id: 'lr-1' };

    expect(el.render()).to.equal(nothing);
  });

  it('creates a statistics-graph card with defaults when graph_type is omitted', () => {
    const el = new WhiskerWeightGraph();
    el.hass = mockHass;
    el.config = { device_id: 'lr-1' };
    el.kitties = ['sensor.cat_weight'];

    el.render();

    expect(mockCreateCardElement.calledOnce).to.be.true;
    expect(mockCreateCardElement.firstCall.args[0]).to.deep.equal({
      type: 'statistics-graph',
      entities: ['sensor.cat_weight'],
      days_to_show: DEFAULT_WEIGHT_DAYS_TO_SHOW,
      stat_types: DEFAULT_WEIGHT_STAT_TYPES,
      chart_type: 'line',
      hide_legend: false,
      period: 'day',
    });
  });

  it('creates a history-graph card with the default hours_to_show', () => {
    const el = new WhiskerWeightGraph();
    el.hass = mockHass;
    el.config = { device_id: 'lr-1', chonk: { graph_type: 'history' } };
    el.kitties = ['sensor.cat_weight'];

    el.render();

    expect(mockCreateCardElement.calledOnce).to.be.true;
    expect(mockCreateCardElement.firstCall.args[0]).to.deep.equal({
      type: 'history-graph',
      entities: ['sensor.cat_weight'],
      hours_to_show: DEFAULT_WEIGHT_HOURS_TO_SHOW,
      show_names: true,
    });
  });

  it('uses the configured hours_to_show when set', () => {
    const config: Config = {
      device_id: 'lr-1',
      chonk: { graph_type: 'history', hours_to_show: 48 },
    };
    const el = new WhiskerWeightGraph();
    el.hass = mockHass;
    el.config = config;
    el.kitties = ['sensor.cat_weight'];

    el.render();

    expect(mockCreateCardElement.firstCall.args[0].hours_to_show).to.equal(48);
  });

  it('sets show_names to false when hide_names is enabled', () => {
    const config: Config = {
      device_id: 'lr-1',
      chonk: { graph_type: 'history', hide_names: true },
    };
    const el = new WhiskerWeightGraph();
    el.hass = mockHass;
    el.config = config;
    el.kitties = ['sensor.cat_weight'];

    el.render();

    expect(mockCreateCardElement.firstCall.args[0].show_names).to.equal(false);
  });

  it('creates a statistics-graph card with defaults when graph_type is statistics', () => {
    const config: Config = {
      device_id: 'lr-1',
      chonk: { graph_type: 'statistics' },
    };
    const el = new WhiskerWeightGraph();
    el.hass = mockHass;
    el.config = config;
    el.kitties = ['sensor.cat_weight'];

    el.render();

    expect(mockCreateCardElement.firstCall.args[0]).to.deep.equal({
      type: 'statistics-graph',
      entities: ['sensor.cat_weight'],
      days_to_show: DEFAULT_WEIGHT_DAYS_TO_SHOW,
      stat_types: DEFAULT_WEIGHT_STAT_TYPES,
      chart_type: 'line',
      hide_legend: false,
      period: 'day',
    });
  });

  it('passes configured statistics options through', () => {
    const config: Config = {
      device_id: 'lr-1',
      chonk: {
        graph_type: 'statistics',
        days_to_show: 90,
        period: 'week',
        stat_types: ['mean', 'max'],
        chart_type: 'bar',
        hide_names: true,
      },
    };
    const el = new WhiskerWeightGraph();
    el.hass = mockHass;
    el.config = config;
    el.kitties = ['sensor.cat_weight'];

    el.render();

    expect(mockCreateCardElement.firstCall.args[0]).to.deep.equal({
      type: 'statistics-graph',
      entities: ['sensor.cat_weight'],
      days_to_show: 90,
      period: 'week',
      stat_types: ['mean', 'max'],
      chart_type: 'bar',
      hide_legend: true,
    });
  });
});
