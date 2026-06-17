# Troubleshooting

## Model compatibility

The card has been **developed and tested with a Litter-Robot 5 Pro (LR5)**. Other models (for example LR3 or LR4) may work when the integration exposes the same entity types and translation keys; behavior can differ (for example how **reset** is exposed).

If controls or gauges are missing:

- Confirm the **Litter-Robot** integration is configured and the robot **device** exists.
- Verify `device_id` in YAML matches **Settings → Devices & services → Litter-Robot →** your device (or use the card editor).
- Check that expected entities exist in **Developer tools → States** for that device.

## Pet weight graph is empty

- **History graph** (`graph_type: history`): uses the **history** integration (enabled by default). Confirm it's loaded and the weight sensor(s) have recorded history (Developer tools → History) and aren't excluded from the `recorder`.
- **Statistics graph** (`graph_type: statistics`, the default for new cards): uses **long-term statistics**, which accumulate over time. A brand-new sensor may show nothing until statistics have been generated, and only entities tracked by the recorder will appear. Try a shorter `period` (e.g. `hour`) or switch to the history graph to confirm data exists.
- If auto-detection finds nothing, set `chonk.kitties` explicitly. See [Pet weight graph](configuration/OPTIONS.md#pet-weight-graph).

## Getting help

- [GitHub issues](https://github.com/homeassistant-extras/whisker/issues) — include HA version, integration version, and robot model when possible.
- [Discussions](https://github.com/homeassistant-extras/whisker/discussions)
- [Discord](https://discord.gg/NpH4Pt8Jmr)
