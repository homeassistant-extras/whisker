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
