# Footer configuration

Choose which metrics appear in the card footer and in what order. Defaults to **total cycles**, **status last changed**, and **last seen**.

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
footer:
  - total_cycles
  - status_changed
  - pet_weight
  - last_seen
```

**Available footer items:** `total_cycles`, `status_changed`, `last_seen`, `pet_weight`, `status`, `litter_level`, `waste_drawer`, `hopper_status`, `hopper_connected`.

**LitterHopper (LR4):** `hopper_status` and `hopper_connected` are only available when you have a **Litter-Robot 4** with a **LitterHopper** attached and the [`litterrobot` integration](https://www.home-assistant.io/integrations/litterrobot/) exposes those entities. If they are missing, the card omits those footer slots. A hopper status badge also appears in the card header when hopper entities are present — see [LitterHopper header badge](../FEATURES.md#litterhopper-header-badge) for how the badge icon and color are chosen.

See [Home Assistant entity states](https://www.home-assistant.io/docs/configuration/state_object/) for how `last_changed` differs from `last_updated`.
