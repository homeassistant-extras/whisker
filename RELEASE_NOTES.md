# LitterHopper Status & Gauge Percentages 🐱🪣

## 🪣 Hopper Connection & Refill Status

If you have a **Litter-Robot 4** with a **LitterHopper** attached, the card shows a **header badge** next to the robot status icon when the integration exposes hopper entities. Icons match Home Assistant’s [`litterrobot` icons](https://github.com/home-assistant/core/blob/dev/homeassistant/components/litterrobot/icons.json).

| State        | Icon                                                   | Color  |
| ------------ | ------------------------------------------------------ | ------ |
| Disconnected | `mdi:filter-remove`                                    | Muted  |
| Enabled      | `mdi:filter-check`                                     | Green  |
| Empty        | `mdi:filter-minus-outline`                             | Orange |
| Disabled     | `mdi:filter-remove`                                    | Gray   |
| Motor fault  | `mdi:engine-off` / `mdi:flash-off` / `mdi:flash-alert` | Red    |

![hopper](https://github.com/homeassistant-extras/whisker/blob/main/docs/assets/hopper.png?raw=true)

## 🧾 Optional Footer Items

You can also add "Hopper status" and "Hopper connected" to the card footer from the visual editor, alongside the other metrics.

These rely on the official Home Assistant [`litterrobot` integration](https://www.home-assistant.io/integrations/litterrobot/). The hopper entities only appear when a LitterHopper is attached

## 🧹 Cleaner Litter & Waste Gauge Percentages

Litter and waste gauge percentages are now rendered by Home Assistant itself, so they follow each sensor's configured display precision and unit instead of showing long trailing decimals.

You can control the precision per entity from the entity's settings; see the [Home Assistant sensor docs](https://www.home-assistant.io/integrations/sensor/).
