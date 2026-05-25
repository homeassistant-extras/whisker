# AGENTS.md - Config

This folder contains feature flags, config schemas, defaults, and config-related helpers.

- Preserve backwards compatibility for shipped dashboard config unless the user explicitly asks for a breaking change.
- Keep config defaults and validation behavior close together when possible.
- Update editor schemas and tests when adding or changing user-facing config options.
- Avoid silently changing persisted config shape without a migration or cleanup path.

## User-facing options

Types and defaults live in `src/types/config.ts`; the visual editor schema mirrors them in `src/cards/robot/editor.ts`:

- **`color`** — robot artwork variant (`white` | `black`; default `white`).
- **`footer`** — ordered list of footer metric keys; default `DEFAULT_FOOTER`.
- **`features`** — toggles such as `percentage` (show gauge percentage labels).

Runtime feature checks use `feature.ts` (`isFeatureEnabled`).
