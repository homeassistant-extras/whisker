# Configuration options

| Option      | Type     | Description                                                                                                                                                                             |
| ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `device_id` | string   | **Required.** Home Assistant device id for the Litter-Robot.                                                                                                                            |
| `title`     | string   | Optional. Overrides the card heading; defaults to the device name.                                                                                                                      |
| `color`     | string   | Optional. Robot artwork color: `white` (default) or `black`.                                                                                                                            |
| `footer`    | string[] | Optional. Footer metrics in display order. See [footer items](#footer-items) below.                                                                                                     |
| `features`  | string[] | Optional. Feature flags. `percentage` — show fill % on litter and waste gauges; `hide_pet_weight` — hide the pet weight chip on the robot image. See [Feature flags](FEATURE-FLAGS.md). |
| `chonk`     | object   | Optional. Pet weight history graph options. See [Pet weight graph](#pet-weight-graph) below.                                                                                            |

### Footer items

Values for `footer`:

- `total_cycles`
- `status_changed`
- `last_seen`
- `pet_weight`
- `status`
- `litter_level`
- `waste_drawer`
- `hopper_status`
- `hopper_connected`

`hopper_status` and `hopper_connected` apply only on **LR4** with a **LitterHopper** attached.

More detail in [Footer configuration](FOOTER.md).

### Pet weight graph

The card shows a pet weight **history graph** below the gauges, powered by Home Assistant's built-in `history-graph` card. Configure it with the `chonk` object:

| Key             | Type     | Description                                                                                                                  |
| --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `kitties`       | string[] | Optional. Weight sensor entity ids to plot. When omitted, the card auto-detects per-cat weight sensors from the integration. |
| `hours_to_show` | number   | Optional. Hours of history to show. Defaults to `168` (7 days).                                                              |
| `hide`          | boolean  | Optional. Hide the weight graph entirely. Defaults to `false`.                                                               |
| `hide_names`    | boolean  | Optional. Hide entity names in the graph legend. Defaults to `false`.                                                        |

![Pet weight graph](../assets/history.png)

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
chonk:
  kitties:
    - sensor.kitty_weight
    - sensor.mittens_weight
  hours_to_show: 168
```
