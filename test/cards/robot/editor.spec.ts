import { WhiskerCardEditor } from '@cards/robot/editor';
import type { HaFormSchema } from '@homeassistant-extras/hass/components/ha-form/types';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { fixture } from '@open-wc/testing-helpers';
import {
  DEFAULT_COLOR,
  DEFAULT_WEIGHT_HOURS_TO_SHOW,
  type Config,
} from '@type/config';
import { expect } from 'chai';
import { nothing, type TemplateResult } from 'lit';
import { stub } from 'sinon';

describe('editor.ts', () => {
  let editor: WhiskerCardEditor;
  let hass: HomeAssistant;
  let dispatchStub: sinon.SinonStub;

  beforeEach(() => {
    hass = {
      connection: {
        subscribeMessage: () => Promise.resolve(() => {}),
      },
      localize: (key: string) => key,
      states: {},
      entities: {},
      devices: {},
    } as unknown as HomeAssistant;

    if (!customElements.get('whisker-card-editor')) {
      customElements.define('whisker-card-editor', WhiskerCardEditor);
    }

    editor = new WhiskerCardEditor();
    dispatchStub = stub(editor, 'dispatchEvent');
    editor.hass = hass;
  });

  afterEach(() => {
    dispatchStub.restore();
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(editor).to.be.instanceOf(WhiskerCardEditor);
    });

    it('should have hass set and config unset until setConfig', () => {
      expect(editor.hass).to.exist;
      expect(editor['_config']).to.be.undefined;
    });
  });

  describe('setConfig', () => {
    it('should set the configuration', () => {
      const testConfig: Config = { device_id: 'lr-1', title: 'My LR' };
      editor.setConfig(testConfig);
      expect(editor['_config']).to.deep.equal(testConfig);
    });
  });

  describe('render', () => {
    it('should return nothing when hass is not set', () => {
      editor.hass = undefined as unknown as HomeAssistant;
      expect(editor.render()).to.equal(nothing);
    });

    it('should return nothing when config is not set', () => {
      expect(editor.render()).to.equal(nothing);
    });

    it('should render ha-form when both hass and config are set', async () => {
      editor.setConfig({ device_id: 'lr-1' });
      const el = await fixture(editor.render() as TemplateResult);
      expect(el.outerHTML).to.equal('<ha-form></ha-form>');
    });

    it('should pass correct props to ha-form', async () => {
      const testConfig: Config = { device_id: 'lr-1', title: 'T' };
      editor.setConfig(testConfig);
      const el = await fixture(editor.render() as TemplateResult);
      expect((el as HTMLElement & { hass: HomeAssistant }).hass).to.deep.equal(
        hass,
      );
      expect((el as HTMLElement & { data: Config }).data).to.deep.equal(
        testConfig,
      );
      expect((el as HTMLElement & { schema: unknown }).schema).to.deep.equal([
        {
          name: 'device_id',
          label: 'Litter Robot Device',
          required: true,
          selector: {
            device: {
              filter: { integration: 'litterrobot' },
              entity: { domain: 'vacuum' },
            },
          },
        },
        {
          name: 'content',
          label: 'Content',
          type: 'expandable',
          flatten: true,
          icon: 'mdi:text-short',
          schema: [
            {
              name: 'title',
              label: 'Card Title',
              required: false,
              selector: { text: {} },
            },
            {
              name: 'color',
              label: 'Robot color',
              selector: {
                select: {
                  options: [
                    { value: 'white', label: 'White' },
                    { value: 'black', label: 'Black' },
                  ],
                },
              },
            },
          ],
        },
        {
          name: 'chonk',
          label: 'Pet weight chonk',
          type: 'expandable',
          icon: 'mdi:weight',
          schema: [
            {
              name: 'kitties',
              label: 'Weight entities',
              selector: {
                entity: {
                  multiple: true,
                  reorder: true,
                  filter: {
                    integration: 'litterrobot',
                    device_class: 'weight',
                  },
                },
              },
            },
            {
              name: 'graph_type',
              label: 'Graph type',
              selector: {
                select: {
                  options: [
                    { value: 'history', label: 'History' },
                    { value: 'statistics', label: 'Statistics' },
                  ],
                },
              },
            },
            {
              name: 'days_to_show',
              label: 'Weight graph days to show',
              selector: {
                number: {
                  min: 1,
                  max: 365,
                  mode: 'box',
                  unit_of_measurement: 'days',
                },
              },
            },
            {
              name: 'period',
              label: 'Statistics period',
              selector: {
                select: {
                  options: [
                    { value: 'auto', label: 'Automatic' },
                    { value: '5minute', label: '5 minutes' },
                    { value: 'hour', label: 'Hour' },
                    { value: 'day', label: 'Day' },
                    { value: 'week', label: 'Week' },
                    { value: 'month', label: 'Month' },
                  ],
                },
              },
            },
            {
              name: 'stat_types',
              label: 'Statistic types',
              selector: {
                select: {
                  options: [
                    { value: 'mean', label: 'Mean' },
                    { value: 'min', label: 'Min' },
                    { value: 'max', label: 'Max' },
                  ],
                  multiple: true,
                },
              },
            },
            {
              name: 'chart_type',
              label: 'Chart type',
              selector: {
                select: {
                  options: [
                    { value: 'line', label: 'Line' },
                    { value: 'line-stack', label: 'Stacked line' },
                    { value: 'bar', label: 'Bar' },
                    { value: 'bar-stack', label: 'Stacked bar' },
                  ],
                },
              },
            },
            {
              name: 'hide',
              label: 'Hide chonk',
              selector: {
                boolean: {},
              },
            },
            {
              name: 'hide_names',
              label: 'Hide pet names',
              selector: {
                boolean: {},
              },
            },
          ],
        },
        {
          name: 'footer',
          label: 'Footer items',
          selector: {
            select: {
              options: [
                { value: 'total_cycles', label: 'Total cycles' },
                { value: 'status_changed', label: 'Status last changed' },
                { value: 'last_seen', label: 'Last seen' },
                { value: 'pet_weight', label: 'Pet weight' },
                { value: 'status', label: 'Status' },
                { value: 'litter_level', label: 'Litter level' },
                { value: 'waste_drawer', label: 'Waste drawer' },
                { value: 'hopper_status', label: 'Hopper status' },
                { value: 'hopper_connected', label: 'Hopper connected' },
              ],
              multiple: true,
            },
          },
        },
        {
          name: 'features',
          label: 'Features',
          selector: {
            select: {
              options: [
                { value: 'percentage', label: 'Show gauge percentages' },
                { value: 'hide_pet_weight', label: 'Hide pet weight chip' },
              ],
              multiple: true,
            },
          },
        },
      ]);
    });
  });

  it('should swap in statistics fields when graph_type is statistics', async () => {
    editor.setConfig({
      device_id: 'lr-1',
      chonk: { graph_type: 'statistics' },
    });
    const el = await fixture(editor.render() as TemplateResult);
    const schema = (el as HTMLElement & { schema: HaFormSchema[] }).schema;
    const chonk = schema.find(
      (s) => (s as { name?: string }).name === 'chonk',
    ) as unknown as { schema: { name: string }[] };
    const names = chonk.schema.map((s) => s.name);

    expect(names).to.deep.equal([
      'kitties',
      'graph_type',
      'days_to_show',
      'period',
      'stat_types',
      'chart_type',
      'hide',
      'hide_names',
    ]);
  });

  describe('form behavior', () => {
    it('should compute labels from schema', async () => {
      editor.setConfig({ device_id: 'lr-1' });
      const el = await fixture(editor.render() as TemplateResult);
      const computeLabel = (
        el as HTMLElement & { computeLabel: (s: { label?: string }) => string }
      ).computeLabel;
      expect(computeLabel({ label: 'X' })).to.equal('X');
    });
  });

  describe('_valueChanged', () => {
    const fireValueChanged = (value: Config): Config => {
      editor['_valueChanged'](
        new CustomEvent('value-changed', { detail: { value } }),
      );
      return dispatchStub.firstCall.args[0].detail.config as Config;
    };

    it('should fire config-changed with updated config', () => {
      editor.setConfig({ device_id: 'lr-1' });
      const next: Config = { device_id: 'lr-1', title: 'Updated' };
      editor['_valueChanged'](
        new CustomEvent('value-changed', { detail: { value: next } }),
      );
      expect(dispatchStub.calledOnce).to.be.true;
      expect(dispatchStub.firstCall.args[0].type).to.equal('config-changed');
      expect(dispatchStub.firstCall.args[0].detail.config).to.deep.equal(next);
    });

    it('should drop an empty chonk object', () => {
      editor.setConfig({ device_id: 'lr-1' });
      const config = fireValueChanged({
        device_id: 'lr-1',
        chonk: { hide: false, kitties: [], hours_to_show: undefined },
      } as Config);
      expect(config.chonk).to.be.undefined;
    });

    it('should drop the default hours_to_show but keep hide and kitties', () => {
      editor.setConfig({ device_id: 'lr-1' });
      const config = fireValueChanged({
        device_id: 'lr-1',
        chonk: {
          hide: true,
          kitties: ['sensor.pet_weight'],
          hours_to_show: DEFAULT_WEIGHT_HOURS_TO_SHOW,
        },
      });
      expect(config.chonk).to.deep.equal({
        hide: true,
        kitties: ['sensor.pet_weight'],
      });
    });

    it('should drop hide_names when false', () => {
      editor.setConfig({ device_id: 'lr-1' });
      const config = fireValueChanged({
        device_id: 'lr-1',
        chonk: { hours_to_show: 48, hide_names: false },
      } as Config);
      expect(config.chonk).to.deep.equal({ hours_to_show: 48 });
    });

    it('should keep hide_names when true', () => {
      editor.setConfig({ device_id: 'lr-1' });
      const config = fireValueChanged({
        device_id: 'lr-1',
        chonk: { hide_names: true },
      });
      expect(config.chonk).to.deep.equal({ hide_names: true });
    });

    it('should keep a non-default hours_to_show', () => {
      editor.setConfig({ device_id: 'lr-1' });
      const config = fireValueChanged({
        device_id: 'lr-1',
        chonk: { hours_to_show: 48 },
      });
      expect(config.chonk).to.deep.equal({ hours_to_show: 48 });
    });

    it('should keep statistics options and graph_type', () => {
      editor.setConfig({ device_id: 'lr-1' });
      const config = fireValueChanged({
        device_id: 'lr-1',
        chonk: {
          graph_type: 'statistics',
          days_to_show: 60,
          period: 'week',
          stat_types: ['mean', 'max'],
          chart_type: 'bar',
        },
      } as Config);
      expect(config.chonk).to.deep.equal({
        days_to_show: 60,
        period: 'week',
        stat_types: ['mean', 'max'],
        chart_type: 'bar',
      });
    });

    it('should drop default/auto statistics values and keep history graph_type', () => {
      editor.setConfig({ device_id: 'lr-1' });
      const config = fireValueChanged({
        device_id: 'lr-1',
        chonk: {
          graph_type: 'history',
          days_to_show: 30,
          period: 'auto',
          stat_types: [],
          chart_type: 'line',
        },
      } as Config);
      expect(config.chonk).to.deep.equal({ graph_type: 'history' });
    });

    it('should drop empty features and default color', () => {
      editor.setConfig({ device_id: 'lr-1' });
      const config = fireValueChanged({
        device_id: 'lr-1',
        features: [],
        color: DEFAULT_COLOR,
      });
      expect(config.features).to.be.undefined;
      expect(config.color).to.be.undefined;
    });
  });
});
