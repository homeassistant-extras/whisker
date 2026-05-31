# Feature flags

## Gauge percentages

Show fill **percentages** on litter and waste gauge labels:

![Gauge percentages](assets/percentages.png)

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
features:
  - percentage
```

## Hide pet weight chip

Hide the **pet weight** chip on the robot image when a single shared `pet_weight` sensor is not useful (for example, multiple cats on one Litter-Robot). The integration sensor stays available for automations; you can still show weight in the [footer](FOOTER.md) if you want.

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
features:
  - hide_pet_weight
```
