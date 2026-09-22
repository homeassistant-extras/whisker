# Pet card

`whisker-pet-card` is a second card for the cats themselves. The Litter-Robot integration reports pet weight and visits **per pet**, not per robot, so a household with more than one Litter-Robot would otherwise repeat the same cat data on every robot card.

```yaml
type: custom:whisker-pet-card
```

That's the whole config — every pet the integration reports is picked up automatically. By default the card lists each cat with its current weight and visits today, which keeps it compact.

## Options

| Option    | Type     | Description                                                                                                                                           |
| --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`   | string   | Optional. Card heading. Defaults to "Pets".                                                                                                           |
| `pets`    | string[] | Optional. Home Assistant **device** ids of the pets to show. When omitted, the card shows every pet it finds.                                         |
| `display` | string   | Optional. `states` (default) lists each pet's current values, `graphs` shows the weight and visits graphs, `both` shows the rows above the graphs.    |
| `chonk`   | object   | Optional. Pet weight graph options — identical to the robot card's [`chonk`](OPTIONS.md#pet-weight-graph). Only used when `display` includes graphs.  |
| `visits`  | object   | Optional. Pet visits graph options — identical to the robot card's [`visits`](OPTIONS.md#pet-visits-graph). Only used when `display` includes graphs. |

Pets come from the device registry, so **the pet's name is its device name** — rename the device in Home Assistant and the card follows.

## Examples

### States and graphs together

```yaml
type: custom:whisker-pet-card
title: The Cats
display: both
```

### One cat, graphs only

Pick the pet's device from the visual editor, or paste its device id:

```yaml
type: custom:whisker-pet-card
title: Ziggy
pets:
  - 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d
display: graphs
```

### Graphs tuned the same way as the robot card

```yaml
type: custom:whisker-pet-card
display: both
chonk:
  graph_type: statistics
  days_to_show: 60
  stat_types:
    - mean
visits:
  collapsed: true
```

## Using it with the robot card

The robot card is unchanged and still shows both graphs. To keep the cat data in one place, hide the graphs there and add the pet card alongside:

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
chonk:
  hide: true
visits:
  hide: true
```

Both cards read the same [`litterrobot` integration](https://www.home-assistant.io/integrations/litterrobot/) entities, so nothing else needs configuring.
