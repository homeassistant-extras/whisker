# Whisker Card

_Litter-Robot status and controls in a single Lovelace card_

![Whisker Card preview](docs/assets/robot.png)

![Home Assistant](https://img.shields.io/badge/home%20assistant-%2341BDF5.svg?style=for-the-badge&logo=home-assistant&logoColor=white)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)

![GitHub Release](https://img.shields.io/github/v/release/homeassistant-extras/whisker?style=for-the-badge&logo=github)
![GitHub Pre-Release](https://img.shields.io/github/v/release/homeassistant-extras/whisker?include_prereleases&style=for-the-badge&logo=github&label=PRERELEASE)
![GitHub Tag](https://img.shields.io/github/v/tag/homeassistant-extras/whisker?style=for-the-badge&color=yellow)
![GitHub branch status](https://img.shields.io/github/checks-status/homeassistant-extras/whisker/main?style=for-the-badge)

![stars](https://img.shields.io/github/stars/homeassistant-extras/whisker.svg?style=for-the-badge)
![home](https://img.shields.io/github/last-commit/homeassistant-extras/whisker.svg?style=for-the-badge)
![commits](https://img.shields.io/github/commit-activity/y/homeassistant-extras/whisker?style=for-the-badge)
![license](https://img.shields.io/github/license/homeassistant-extras/whisker?style=for-the-badge&logo=opensourceinitiative&logoColor=white&color=0080ff)

## Overview

Whisker Card is a custom Lovelace card for Home Assistant that shows your **Litter-Robot** at a glance, using the official **[Litter-Robot integration](https://www.home-assistant.io/integrations/litterrobot/)** (`litterrobot`). On **Litter-Robot 4** with a **LitterHopper** attached, the card can also show hopper connection and refill status.

## Documentation

**Full documentation is available at: [homeassistant-extras.github.io/whisker](https://homeassistant-extras.github.io/whisker/)**

## Quick Start

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
```

Replace `YOUR_DEVICE_ID` with the id from the device page in Home Assistant, or use the UI editor to pick the device.

## Installation

### HACS (recommended)

[![HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=homeassistant-extras&repository=whisker&category=dashboard)

1. Open **HACS** in Home Assistant.
2. Open the menu → **Custom repositories**.
3. Add `https://github.com/homeassistant-extras/whisker` and category **Dashboard**.
4. Install **Whisker Card** and restart if prompted.

### Manual installation

1. Download **`whisker.js`** from the [latest release](https://github.com/homeassistant-extras/whisker/releases) (`dist/whisker.js`).
2. Copy to `www/community/whisker/`.
3. Add the Lovelace resource — see [Installation](docs/INSTALLATION.md) for `configuration.yaml` details.

## Contributing

- [Join the Discussions](https://github.com/homeassistant-extras/whisker/discussions) — Share feedback or ask questions.
- [Report Issues](https://github.com/homeassistant-extras/whisker/issues) — Bugs, model-specific gaps, or feature requests ([issue templates](https://github.com/homeassistant-extras/whisker/tree/main/.github/ISSUE_TEMPLATE)).
- [Submit Pull Requests](https://github.com/homeassistant-extras/whisker/blob/main/CONTRIBUTING.md) — See contributing guidelines when available.
- [Discord](https://discord.gg/NpH4Pt8Jmr) — Extra help or chat.
- [More homeassistant-extras projects](https://github.com/orgs/homeassistant-extras/repositories)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file.

## Acknowledgments

- Built with [Lit](https://lit.dev/).
- Status mapping aligns with Home Assistant’s `litterrobot` **status_code** sensor options.
- Thanks to all contributors!
- Maintained by [Patrick Masters](https://github.com/warmfire540) / [Curious Cat Consulting](https://curiouscat.consulting/projects/ha-whisker?utm_source=github-whisker&utm_medium=readme&utm_campaign=oss-presence&utm_content=maintained-by)

[![contributors](https://contrib.rocks/image?repo=homeassistant-extras/whisker)](https://github.com/homeassistant-extras/whisker/graphs/contributors)

[![ko-fi](https://img.shields.io/badge/buy%20me%20a%20coffee-72A5F2?style=for-the-badge&logo=kofi&logoColor=white)](https://ko-fi.com/N4N71AQZQG)

## Project Roadmap

- [x] **Litter-Robot device discovery** via `translation_key` mapping
- [x] **Visual card** — status, gauges, pet weight, last seen
- [x] **Tap / hold** actions on status icons (cycle / reset vs more-info)
- [x] **Controls dialog** with native entity rows
- [x] **Lovelace card editor** (device selector + title)
- [x] **Automated tests** (Mocha)
- [x] **Gauge percentages** — optional percentage labels on litter/waste gauges - thanks reddit!
- [x] **Customizable footer** — choose footer metrics and order - thanks @alicia86
- [x] **Model-aware artwork** — auto-detects Litter-Robot model - thanks @adude007
- [x] **Litter Hopper status** — hopper badge & footer items on LR4 when a LitterHopper is attached - thanks @chrispgriffin & @adude007
