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

**Available footer items:** `total_cycles`, `status_changed`, `last_seen`, `pet_weight`, `status`, `litter_level`, `waste_drawer`.

See [Home Assistant entity states](https://www.home-assistant.io/docs/configuration/state_object/) for how `last_changed` differs from `last_updated`.
