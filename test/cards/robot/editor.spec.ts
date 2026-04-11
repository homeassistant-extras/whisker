import { WhiskerCardEditor } from '@cards/robot/editor';
import type { HomeAssistant } from '@hass/types';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
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
      callService: stub().resolves(undefined),
      states: {},
      entities: {},
      devices: {},
    } as HomeAssistant;

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
            },
          },
        },
        {
          name: 'title',
          label: 'Card Title',
          required: false,
          selector: { text: {} },
        },
      ]);
    });
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
  });
});
