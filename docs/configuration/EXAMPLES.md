# Examples

## Minimal

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
```

## Custom title

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
title: Cat HQ
```

## Robot color

The model (Litter-Robot 4 / 5 / 5 Pro / Evo) is auto-detected; pick the color to match your unit (`white` is the default).

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
color: black
```

## Gauge percentages

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
features:
  - percentage
```

## Hide pet weight chip (multi-cat)

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
features:
  - hide_pet_weight
```

## Pet weight history graph

Shown by default; auto-detects per-cat weight sensors. List them explicitly to control which appear:

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
chonk:
  kitties:
    - sensor.tuna_weight
    - sensor.mittens_weight
  hours_to_show: 168
```

Hide the graph entirely:

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
chonk:
  hide: true
```

## Custom footer

Order matters:

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
footer:
  - total_cycles
  - status_changed
  - pet_weight
  - last_seen
```

## LitterHopper footer (LR4)

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
footer:
  - hopper_status
  - hopper_connected
```
