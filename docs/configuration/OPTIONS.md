# Configuration options

| Option            | Type     | Description                                                                                                                                                                                    |
| ----------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `device_id`       | string   | **Required.** Home Assistant device id for the Litter-Robot.                                                                                                                                   |
| `title`           | string   | Optional. Overrides the card heading; defaults to the device name.                                                                                                                             |
| `cleaning_entity` | string   | Optional. Entity (`input_boolean`, `alert`, `binary_sensor`, or `switch`) whose active state shows a "needs cleaning" header badge + card glow. See [Cleaning reminder](CLEANING-REMINDER.md). |
| `color`           | string   | Optional. Robot artwork color: `white` (default) or `black`.                                                                                                                                   |
| `footer`          | string[] | Optional. Footer metrics in display order. See [footer items](#footer-items) below.                                                                                                            |
| `features`        | string[] | Optional. Feature flags. `percentage` — show fill % on litter and waste gauges; `hide_pet_weight` — hide the pet weight chip on the robot image. See [Feature flags](FEATURE-FLAGS.md).        |
| `chonk`           | object   | Optional. Pet weight graph options (history or statistics graph). See [Pet weight graph](#pet-weight-graph) below.                                                                             |

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

The card shows a pet weight graph below the gauges. It can render either Home Assistant's built-in **history graph** (live recorder data) or its **statistics graph** (long-term statistics — mean/min/max aggregated over days). Pick the mode with `graph_type`. Cards added through the dashboard UI start on the **statistics graph** (mean/min/max, daily); manually written YAML without `graph_type` falls back to the history graph.

Configure it with the `chonk` object:

| Key             | Type     | Graph      | Description                                                                                                                  |
| --------------- | -------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `kitties`       | string[] | both       | Optional. Weight sensor entity ids to plot. When omitted, the card auto-detects per-cat weight sensors from the integration. |
| `graph_type`    | string   | both       | Optional. `history` (default) or `statistics`.                                                                               |
| `hide`          | boolean  | both       | Optional. Hide the weight graph entirely. Defaults to `false`.                                                               |
| `hide_names`    | boolean  | both       | Optional. History graph: hide entity names. Statistics graph: hide the legend. Defaults to `false`.                          |
| `hours_to_show` | number   | history    | Optional. Hours of history to show. Defaults to `168` (7 days).                                                              |
| `days_to_show`  | number   | statistics | Optional. Days of statistics to show. Defaults to `30`.                                                                      |
| `period`        | string   | statistics | Optional. Aggregation period: `auto` (default), `5minute`, `hour`, `day`, `week`, or `month`.                                |
| `stat_types`    | string[] | statistics | Optional. Statistic series to plot: `mean` (default), `min`, `max`, `state`, `change`, `sum`.                                |
| `chart_type`    | string   | statistics | Optional. Chart style: `line` (default), `line-stack`, `bar`, or `bar-stack`.                                                |

#### History graph

![Pet weight history graph](../assets/history.png)

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
chonk:
  graph_type: history
  kitties:
    - sensor.kitty_weight
    - sensor.mittens_weight
  hours_to_show: 168
```

#### Statistics graph

Plots long-term statistics, which is ideal for spotting weight trends over weeks or months.

![Pet weight statistics graph](../assets/statistics.png)

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
chonk:
  graph_type: statistics
  kitties:
    - sensor.kitty_weight
    - sensor.mittens_weight
  days_to_show: 30
  period: day
  stat_types:
    - mean
    - max
    - min
  chart_type: line
```

Use a stacked chart (`line-stack` or `bar-stack`) to compare combined weight across cats:

![Stacked line statistics graph](../assets/line-stack.png)

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
chonk:
  graph_type: statistics
  chart_type: line-stack
  stat_types:
    - mean
```
