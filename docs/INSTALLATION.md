# Installation

## Requirements

- Home Assistant with the **Litter-Robot** integration configured and at least one robot **device** present.
- The card is configured with a **`device_id`** (pick the robot in the visual editor, or paste the id from **Settings → Devices & services → Litter-Robot → device**).

## HACS (recommended)

[![HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=homeassistant-extras&repository=whisker&category=dashboard)

1. Open **HACS** in Home Assistant.
2. Open the menu → **Custom repositories**.
3. Add `https://github.com/homeassistant-extras/whisker` and category **Dashboard**.
4. Install **Whisker Card** (or the name shown for this repository) and restart if prompted.
5. Add the Lovelace resource if HACS does not do it automatically (see manual steps below for the exact URL pattern).

## Manual installation

1. Download **`whisker.js`** from the **`dist`** folder attached to the [latest release](https://github.com/homeassistant-extras/whisker/releases) (the build artifact is `dist/whisker.js`).
2. Copy it to `www/community/whisker/` (create the folder if needed).
3. Register the module under **Settings → Dashboards → Resources** (or in `configuration.yaml`):

```yaml
lovelace:
  resources:
    - url: /local/community/whisker/whisker.js
      type: module
```

## Compatibility

The card has been **developed and tested with a Litter-Robot 5 Pro (LR5)**. Other models (for example LR3 or LR4) may work as long as the core integration exposes the same kinds of entities and translation keys; behavior can differ slightly (for example how **reset** is exposed).

If something does not show up or act correctly on your model, see [Troubleshooting](TROUBLESHOOTING.md) or **[open an issue](https://github.com/homeassistant-extras/whisker/issues)** — include your HA version, integration version, and robot model when you can.
