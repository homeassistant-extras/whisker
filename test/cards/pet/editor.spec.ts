import { WhiskerPetCardEditor } from '@cards/pet/editor';
import type { HaFormSchema } from '@homeassistant-extras/hass/components/ha-form/types';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { fixture } from '@open-wc/testing-helpers';
import { DEFAULT_WEIGHT_DAYS_TO_SHOW, type PetConfig } from '@type/config';
import { expect } from 'chai';
import { nothing, type TemplateResult } from 'lit';
import { stub } from 'sinon';

/** Collects schema names, descending into nested (expandable) sections. */
const schemaNames = (schema: HaFormSchema[] = []): string[] =>
  schema.flatMap((entry) => {
    const nested = (entry as { schema?: HaFormSchema[] }).schema;
    return [entry.name, ...(nested ? schemaNames(nested) : [])];
  });

describe('pet/editor.ts', () => {
  let editor: WhiskerPetCardEditor;
  let dispatchStub: sinon.SinonStub;

  /** Renders the editor and reads the schema off the rendered ha-form. */
  const renderedSchema = async (config: PetConfig): Promise<string[]> => {
    editor.setConfig(config);
    const el = await fixture(editor.render() as TemplateResult);
    return schemaNames((el as unknown as { schema: HaFormSchema[] }).schema);
  };

  beforeEach(() => {
    if (!customElements.get('whisker-pet-card-editor')) {
      customElements.define('whisker-pet-card-editor', WhiskerPetCardEditor);
    }

    editor = new WhiskerPetCardEditor();
    dispatchStub = stub(editor, 'dispatchEvent');
    editor.hass = {
      connection: { subscribeMessage: () => Promise.resolve(() => {}) },
      localize: (key: string) => key,
      states: {},
      entities: {},
      devices: {},
    } as unknown as HomeAssistant;
  });

  afterEach(() => {
    dispatchStub.restore();
  });

  describe('render', () => {
    it('should render nothing until a config is set', () => {
      expect(editor.render()).to.equal(nothing);
    });

    it('should offer the graph sections only once graphs are shown', async () => {
      expect(await renderedSchema({})).to.deep.equal([
        'title',
        'pets',
        'display',
      ]);

      const withGraphs = await renderedSchema({ display: 'both' });
      expect(withGraphs).to.include.members([
        'chonk',
        'visits',
        'days_to_show',
      ]);
    });
  });

  describe('config changes', () => {
    /** Fires a value-changed and returns the config the editor emitted. */
    const emit = (value: PetConfig): PetConfig => {
      editor['_valueChanged'](
        new CustomEvent('value-changed', { detail: { value } }),
      );
      return (dispatchStub.lastCall.args[0] as CustomEvent).detail.config;
    };

    it('should drop empty and default values', () => {
      expect(
        emit({
          title: 'The Cats',
          pets: [],
          display: 'states',
          chonk: { days_to_show: DEFAULT_WEIGHT_DAYS_TO_SHOW },
        }),
      ).to.deep.equal({ title: 'The Cats' });
    });

    it('should keep meaningful values', () => {
      expect(
        emit({
          pets: ['pet-1'],
          display: 'both',
          visits: { hide: true },
        }),
      ).to.deep.equal({
        pets: ['pet-1'],
        display: 'both',
        visits: { hide: true },
      });
    });
  });
});
