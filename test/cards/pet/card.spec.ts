import { WhiskerPetCard } from '@cards/pet/card';
import { styles } from '@cards/pet/styles';
import * as herdModule from '@delegates/utils/herd-kitties';
import type { HomeAssistant } from '@homeassistant-extras/hass/types';
import { fixture } from '@open-wc/testing-helpers';
import type { CardHelpers } from '@type/lovelace';
import type { PetReport } from '@type/types';
import { expect } from 'chai';
import { nothing, type TemplateResult } from 'lit';
import { stub } from 'sinon';

describe('pet/card.ts', () => {
  let card: WhiskerPetCard;
  let mockHass: HomeAssistant;
  let herdStub: sinon.SinonStub;
  let mockPets: PetReport[];

  beforeEach(() => {
    herdStub = stub(herdModule, 'herdKitties');
    mockPets = [
      {
        id: 'pet-1',
        name: 'Ziggy',
        weight: 'sensor.ziggy_weight',
        visits: 'sensor.ziggy_visits',
      },
      { id: 'pet-2', name: 'Aster', weight: 'sensor.aster_weight' },
    ];
    herdStub.returns(mockPets);

    mockHass = {
      connection: {
        subscribeMessage: () => Promise.resolve(() => {}),
      },
      states: {},
      entities: {},
      devices: {},
    } as unknown as HomeAssistant;

    if (!customElements.get('whisker-pet-card')) {
      customElements.define('whisker-pet-card', WhiskerPetCard);
    }

    card = new WhiskerPetCard();
    card.setConfig({});
    card.hass = mockHass;
    (card as unknown as { _cardHelpers: CardHelpers })._cardHelpers =
      {} as CardHelpers;
  });

  afterEach(() => {
    herdStub.restore();
  });

  describe('configuration', () => {
    it('should stub an empty config — every pet is picked up automatically', () => {
      expect(WhiskerPetCard.getStubConfig()).to.deep.equal({});
    });

    it('should not replace config when deeply equal', () => {
      const original = card['_config'];
      card.setConfig({});
      expect(card['_config']).to.equal(original);
    });

    it('should pass the configured pets through to the delegate', () => {
      card.setConfig({ pets: ['pet-1'] });
      card.hass = mockHass;
      expect(herdStub.lastCall.args[1]).to.deep.equal(['pet-1']);
    });

    it('should not update pets when the delegate returns the same data', () => {
      const first = card['_pets'];
      card.hass = mockHass;
      expect(card['_pets']).to.equal(first);
    });

    it('should return expected styles', () => {
      expect(WhiskerPetCard.styles).to.deep.equal(styles);
    });
  });

  describe('rendering', () => {
    it('should render nothing when card helpers are not resolved yet', () => {
      (
        card as unknown as { _cardHelpers: CardHelpers | undefined }
      )._cardHelpers = undefined;
      expect(card.render()).to.equal(nothing);
    });

    it('should render nothing when no pets were found', () => {
      herdStub.returns([]);
      card.hass = mockHass;
      expect(card.render()).to.equal(nothing);
    });

    it('should render states only by default', async () => {
      const el = await fixture(card.render() as TemplateResult);

      expect(el.tagName.toLowerCase()).to.equal('ha-card');
      expect(el.querySelector('.card-title')?.textContent).to.equal('Pets');
      expect(el.querySelector('whisker-pet-states')).to.not.be.null;
      expect(el.querySelectorAll('whisker-pet-graph')).to.have.length(0);
    });

    it('should render both sections with a custom title when asked', async () => {
      card.setConfig({ title: 'The Cats', display: 'both' });
      card.hass = mockHass;

      const el = await fixture(card.render() as TemplateResult);
      const graphs = el.querySelectorAll('whisker-pet-graph');

      expect(el.querySelector('.card-title')?.textContent).to.equal('The Cats');
      expect(el.querySelector('whisker-pet-states')).to.not.be.null;
      expect(graphs).to.have.length(2);
      // weight comes from both pets, visits only from the pet that reports it
      expect((graphs[0] as any).kitties).to.deep.equal([
        'sensor.ziggy_weight',
        'sensor.aster_weight',
      ]);
      expect((graphs[1] as any).kitties).to.deep.equal(['sensor.ziggy_visits']);
    });

    it('should drop the states rows and hidden graphs in graphs mode', async () => {
      card.setConfig({
        display: 'graphs',
        chonk: { kitties: ['sensor.only_this_cat'] },
        visits: { hide: true },
      });
      card.hass = mockHass;

      const el = await fixture(card.render() as TemplateResult);
      const graphs = el.querySelectorAll('whisker-pet-graph');

      expect(el.querySelector('whisker-pet-states')).to.be.null;
      expect(graphs).to.have.length(1);
      // a configured entity list wins over the detected pets
      expect((graphs[0] as any).kitties).to.deep.equal([
        'sensor.only_this_cat',
      ]);
    });
  });
});
