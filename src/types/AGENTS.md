# AGENTS.md - Types

This folder contains TypeScript contracts for configs, entities, locale data, and Home Assistant-facing shapes.

- Keep exported types stable when they represent user config or public card APIs.
- Prefer specific types over broad `any` or unstructured records.
- Reuse Home Assistant types from `hass` (`@homeassistant-extras/hass/*`) rather than duplicating incompatible shapes.
- Keep type-only modules free of runtime side effects.

## Key contracts

- **`config.ts`** — public card config: `device_id`, optional `title`, `color` (`RobotColor`), `footer` (`FooterItem[]`), `features`. Defaults live here (`DEFAULT_FOOTER`, `DEFAULT_COLOR`).
- **`types.ts`** — `DutyReport`, the resolved device/entity snapshot passed to the card. Includes `model` and `serial_number` from the device registry for robot artwork selection.
- **`entity.ts`**, **`lovelace.ts`**, **`assets.d.ts`** — entity shapes, Lovelace types, and Parcel asset module declarations.

When adding user-facing config, update `config.ts`, the editor schema in `src/cards/robot/editor.ts`, and relevant tests.
