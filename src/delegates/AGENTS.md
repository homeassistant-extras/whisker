# AGENTS.md - Delegates

This folder contains business logic, retrievers, action handlers, subscriptions, and data-processing helpers.

- Keep delegate code independent from Lit rendering whenever practical.
- Prefer pure functions for transforms, filtering, sorting, and state calculations.
- Keep Home Assistant API access behind `@homeassistant-extras/hass` retrievers and subscription patterns.
- Add or update focused unit tests when changing behavior here.
- Do not move UI concerns into delegates; return data that cards can render.

## Duty report

`utils/scoop-droppings.ts` builds the card's `DutyReport` from the device registry and entity translation keys via `getDevice()` and `mapEntitiesByTranslationKey()`. It passes through `model` and `serial_number` from the device entry — the card uses those for robot artwork, not for entity mapping.

Entity-to-field mapping lives in `src/common/map-entities.ts`. Live entity subscriptions live under `entities/subscriptions/`.

Pet sensors live on **other** devices than the configured robot, so they are auto-detected rather than mapped by key. The two heuristics differ because upstream registers them differently:

- **weight** (`kitties`) — no `translation_key`, matched on `device_class: weight`.
- **visits** (`visits`) — no device class, matched on `translation_key: visits_today`.

Either list is skipped when the user configures `chonk.kitties` / `visits.kitties` explicitly.

## Graph config

`utils/graph-config.ts` exposes `buildGraphConfig(entities, options, defaults)`, a pure builder returning the `history-graph` or `statistics-graph` config that `whisker-pet-graph` wraps. It also exports `WEIGHT_GRAPH_DEFAULTS` and `VISITS_GRAPH_DEFAULTS` for the card to pass in as props.
