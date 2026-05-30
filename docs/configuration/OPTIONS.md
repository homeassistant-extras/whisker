# Configuration options

| Option      | Type     | Description                                                                         |
| ----------- | -------- | ----------------------------------------------------------------------------------- |
| `device_id` | string   | **Required.** Home Assistant device id for the Litter-Robot.                        |
| `title`     | string   | Optional. Overrides the card heading; defaults to the device name.                  |
| `color`     | string   | Optional. Robot artwork color: `white` (default) or `black`.                        |
| `footer`    | string[] | Optional. Footer metrics in display order. See [footer items](#footer-items) below. |
| `features`  | string[] | Optional. Feature flags. `percentage` — show fill % on litter and waste gauges.     |

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
