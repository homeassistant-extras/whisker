# A Card For The Cats 🐈‍⬛📈

## 🐈 New Pet Card

Your cats now get a card of their own — add **Whisker Pet Card** from the dashboard's card picker - fixes #66

```yaml
type: custom:whisker-pet-card
```

That's the whole config. Every pet the [`litterrobot` integration](https://www.home-assistant.io/integrations/litterrobot/) reports shows up automatically, each with its current weight and visits today.

Pet stats are reported per cat rather than per robot, so with more than one Litter-Robot the same numbers used to repeat on every robot card. Now they can live in one place:

```yaml
type: custom:whisker-pet-card
title: The Cats
display: both # states, graphs, or both — states by default
```

You can also point the card at particular pets, and the weight and visits graphs take all the same options as the ones on the robot card. See the [pet card docs](https://homeassistant-extras.github.io/whisker/configuration/PET-CARD/).

The robot card is unchanged — hide its graphs with `chonk: {hide: true}` and `visits: {hide: true}` if you'd rather see them only on the pet card.
