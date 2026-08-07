import { WhiskerPetGraph } from '@cards/components/pet-graph/pet-graph';
import {
  VISITS_GRAPH_DEFAULTS,
  WEIGHT_GRAPH_DEFAULTS,
} from '@delegates/utils/graph-config';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { fixture } from '@open-wc/testing-helpers';
import {
  DEFAULT_VISITS_DAYS_TO_SHOW,
  DEFAULT_VISITS_HOURS_TO_SHOW,
  DEFAULT_VISITS_STAT_TYPES,
  DEFAULT_WEIGHT_DAYS_TO_SHOW,
  DEFAULT_WEIGHT_HOURS_TO_SHOW,
  DEFAULT_WEIGHT_STAT_TYPES,
} from '@type/config';
import type { CardHelpers } from '@type/lovelace';
import { expect } from 'chai';
import { nothing, type TemplateResult } from 'lit';
import { stub } from 'sinon';

describe('pet-graph.ts (WhiskerPetGraph)', () => {
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

  const mountWeight = () => {
    const el = new WhiskerPetGraph();
    el.hass = mockHass;
    el.header = 'Pet weight';
    el.defaults = WEIGHT_GRAPH_DEFAULTS;
    return el;
  };

  const mountVisits = () => {
    const el = new WhiskerPetGraph();
    el.hass = mockHass;
    el.header = 'Pet visits';
    el.defaults = VISITS_GRAPH_DEFAULTS;
    return el;
  };

  it('renders nothing when there are no entities', () => {
    expect(mountWeight().render()).to.equal(nothing);
  });

  it('creates a statistics-graph card with weight defaults when options are omitted', () => {
    const el = mountWeight();
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

  it('creates a statistics-graph of daily totals as bars for visits by default', () => {
    const el = mountVisits();
    el.kitties = ['sensor.ellie_visits_today'];

    el.render();

    expect(mockCreateCardElement.firstCall.args[0]).to.deep.equal({
      type: 'statistics-graph',
      entities: ['sensor.ellie_visits_today'],
      days_to_show: DEFAULT_VISITS_DAYS_TO_SHOW,
      stat_types: DEFAULT_VISITS_STAT_TYPES,
      chart_type: 'bar-stack',
      hide_legend: false,
      period: 'day',
    });
  });

  it('creates a history-graph card with the weight default hours_to_show', () => {
    const el = mountWeight();
    el.options = { graph_type: 'history' };
    el.kitties = ['sensor.cat_weight'];

    el.render();

    expect(mockCreateCardElement.firstCall.args[0]).to.deep.equal({
      type: 'history-graph',
      entities: ['sensor.cat_weight'],
      hours_to_show: DEFAULT_WEIGHT_HOURS_TO_SHOW,
      show_names: true,
    });
  });

  it('creates a history-graph card with the visits default hours_to_show', () => {
    const el = mountVisits();
    el.options = { graph_type: 'history' };
    el.kitties = ['sensor.ellie_visits_today'];

    el.render();

    expect(mockCreateCardElement.firstCall.args[0]).to.deep.equal({
      type: 'history-graph',
      entities: ['sensor.ellie_visits_today'],
      hours_to_show: DEFAULT_VISITS_HOURS_TO_SHOW,
      show_names: true,
    });
  });

  it('uses the configured hours_to_show when set', () => {
    const el = mountWeight();
    el.options = { graph_type: 'history', hours_to_show: 48 };
    el.kitties = ['sensor.cat_weight'];

    el.render();

    expect(mockCreateCardElement.firstCall.args[0].hours_to_show).to.equal(48);
  });

  it('sets show_names to false when hide_names is enabled', () => {
    const el = mountWeight();
    el.options = { graph_type: 'history', hide_names: true };
    el.kitties = ['sensor.cat_weight'];

    el.render();

    expect(mockCreateCardElement.firstCall.args[0].show_names).to.equal(false);
  });

  it('passes configured statistics options through', () => {
    const el = mountWeight();
    el.options = {
      graph_type: 'statistics',
      days_to_show: 90,
      period: 'week',
      stat_types: ['mean', 'max'],
      chart_type: 'bar',
      hide_names: true,
    };
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

  it('always wraps the graph in a collapsible section', async () => {
    const el = mountWeight();
    el.options = { collapsed: true };
    el.kitties = ['sensor.cat_weight'];

    const rendered = await fixture(el.render() as TemplateResult);
    const section = rendered.matches('whisker-collapsible-section')
      ? rendered
      : rendered.querySelector('whisker-collapsible-section');

    expect(section).to.not.be.null;
    expect(
      (section as HTMLElement & { collapsed?: boolean }).collapsed,
    ).to.equal(true);
  });

  it('defers creating the card while the section starts collapsed', () => {
    const el = mountWeight();
    el.options = { collapsed: true };
    el.kitties = ['sensor.cat_weight'];

    el.render();

    // a card created inside an unrendered slot bakes in empty computed
    // styles (black chart), so nothing may be created until first expand
    expect(mockCreateCardElement.called).to.be.false;
  });

  it('creates the card once the collapsed section is expanded', () => {
    const el = mountWeight();
    el.options = { collapsed: true };
    el.kitties = ['sensor.cat_weight'];

    el.render();
    expect(mockCreateCardElement.called).to.be.false;

    (
      el as unknown as {
        _onExpandedWillChange: (ev: CustomEvent<{ expanded: boolean }>) => void;
      }
    )._onExpandedWillChange(
      new CustomEvent('expanded-will-change', { detail: { expanded: true } }),
    );
    el.render();

    expect(mockCreateCardElement.calledOnce).to.be.true;
  });

  it('keeps the card mounted after a viewer collapse', () => {
    const el = mountWeight();
    el.options = { collapsed: true };
    el.kitties = ['sensor.cat_weight'];

    const reveal = (expanded: boolean) =>
      (
        el as unknown as {
          _onExpandedWillChange: (
            ev: CustomEvent<{ expanded: boolean }>,
          ) => void;
        }
      )._onExpandedWillChange(
        new CustomEvent('expanded-will-change', { detail: { expanded } }),
      );

    reveal(true);
    el.render();
    reveal(false);
    el.render();

    expect(mockCreateCardElement.calledTwice).to.be.true;
  });

  it('starts the section expanded when collapsed is not set', async () => {
    const el = mountVisits();
    el.kitties = ['sensor.ellie_visits_today'];

    const rendered = await fixture(el.render() as TemplateResult);
    const section = rendered.matches('whisker-collapsible-section')
      ? rendered
      : rendered.querySelector('whisker-collapsible-section');

    expect(section).to.not.be.null;
    expect((section as HTMLElement & { collapsed?: boolean }).collapsed).to.not
      .be.true;
  });

  it('uses the provided section header', async () => {
    const el = mountVisits();
    el.kitties = ['sensor.ellie_visits_today'];

    const rendered = await fixture(el.render() as TemplateResult);
    const section = rendered.matches('whisker-collapsible-section')
      ? rendered
      : rendered.querySelector('whisker-collapsible-section');

    expect((section as HTMLElement & { header?: string }).header).to.equal(
      'Pet visits',
    );
  });

  it('reads the options prop, not a sibling section', () => {
    const el = mountVisits();
    el.options = { days_to_show: 14 };
    el.kitties = ['sensor.ellie_visits_today'];

    el.render();

    const result = mockCreateCardElement.firstCall.args[0];
    expect(result.type).to.equal('statistics-graph');
    expect(result.days_to_show).to.equal(14);
  });
});
