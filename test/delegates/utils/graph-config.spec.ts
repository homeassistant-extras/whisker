import {
  buildGraphConfig,
  type GraphDefaults,
} from '@delegates/utils/graph-config';
import { expect } from 'chai';

describe('graph-config.ts', () => {
  const defaults: GraphDefaults = {
    graph_type: 'statistics',
    hours_to_show: 168,
    days_to_show: 30,
    period: 'day',
    stat_types: ['mean', 'max', 'min'],
    chart_type: 'line',
  };

  const entities = ['sensor.cat_weight'];

  describe('statistics graph', () => {
    it('should build a statistics-graph from defaults when no options are set', () => {
      expect(buildGraphConfig(entities, undefined, defaults)).to.deep.equal({
        type: 'statistics-graph',
        entities,
        days_to_show: 30,
        stat_types: ['mean', 'max', 'min'],
        chart_type: 'line',
        hide_legend: false,
        period: 'day',
      });
    });

    it('should pass configured options through', () => {
      const result = buildGraphConfig(
        entities,
        {
          graph_type: 'statistics',
          days_to_show: 90,
          period: 'week',
          stat_types: ['change'],
          chart_type: 'bar',
          hide_names: true,
        },
        defaults,
      );

      expect(result).to.deep.equal({
        type: 'statistics-graph',
        entities,
        days_to_show: 90,
        period: 'week',
        stat_types: ['change'],
        chart_type: 'bar',
        hide_legend: true,
      });
    });

    it('should fall back to default stat_types when configured empty', () => {
      const result = buildGraphConfig(entities, { stat_types: [] }, defaults);

      expect(result.stat_types).to.deep.equal(['mean', 'max', 'min']);
    });

    it('should honour non-statistics defaults for the visits graph', () => {
      const visitsDefaults: GraphDefaults = {
        ...defaults,
        stat_types: ['change'],
        chart_type: 'bar',
      };

      expect(
        buildGraphConfig(
          ['sensor.ellie_visits_today'],
          undefined,
          visitsDefaults,
        ),
      ).to.deep.equal({
        type: 'statistics-graph',
        entities: ['sensor.ellie_visits_today'],
        days_to_show: 30,
        stat_types: ['change'],
        chart_type: 'bar',
        hide_legend: false,
        period: 'day',
      });
    });
  });

  describe('history graph', () => {
    it('should build a history-graph when graph_type is history', () => {
      const result = buildGraphConfig(
        entities,
        { graph_type: 'history' },
        defaults,
      );

      expect(result).to.deep.equal({
        type: 'history-graph',
        entities,
        hours_to_show: 168,
        show_names: true,
      });
    });

    it('should use the configured hours_to_show', () => {
      const result = buildGraphConfig(
        entities,
        { graph_type: 'history', hours_to_show: 48 },
        defaults,
      );

      expect(result.hours_to_show).to.equal(48);
    });

    it('should invert hide_names into show_names', () => {
      const result = buildGraphConfig(
        entities,
        { graph_type: 'history', hide_names: true },
        defaults,
      );

      expect(result.show_names).to.equal(false);
    });

    it('should default to history when the defaults say so', () => {
      const result = buildGraphConfig(entities, undefined, {
        ...defaults,
        graph_type: 'history',
      });

      expect(result.type).to.equal('history-graph');
    });
  });
});
