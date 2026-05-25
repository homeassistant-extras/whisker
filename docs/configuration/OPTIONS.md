# Configuration options

| Option      | Type     | Description                                                                                                                                                                    |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `device_id` | string   | **Required.** Home Assistant device id for the Litter-Robot.                                                                                                                   |
| `title`     | string   | Optional. Overrides the card heading; defaults to the device name.                                                                                                             |
| `color`     | string   | Optional. Robot artwork color: `white` (default) or `black`. The model (Litter-Robot 4 / 5 / 5 Pro / Evo) is auto-detected from the device — only the color is a choice.       |
| `footer`    | string[] | Optional. Footer items in display order. `total_cycles`, `status_changed`, `last_seen`, `pet_weight`, `status`, `litter_level`, `waste_drawer`. Omitted entries are not shown. |
| `features`  | string[] | Optional. Feature flags. `percentage` — show fill % on litter and waste gauges.                                                                                                |
