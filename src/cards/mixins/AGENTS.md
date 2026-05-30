# AGENTS.md - Card Mixins

Lit class mixins shared by the cards.

- **`subscribe-entity-state-mixin.ts`** — `SubscribeEntityStateMixin`. Subscribes to entity state changes via `subscribe_entities` through the entity subscription manager. Only notifies on meaningful changes (state/attributes), not context/last_updated. Set `entity` to one or more entity ids (`string | string[]`); read `states` keyed by entity id. Single-entity components use `entityId()` and `entityState()` with no arguments. Multi-entity components pass an id to `entityState(id)`. Also exports `SubscribeEntityStateElement`, `EntityStates`, `entityIds`, `singleEntityId`, and the `Constructor<T>` helper used by the other mixin. Used by gauge, status, hopper, and footer-item (composed with `HassConfigMixin`).
- **`hass-config-mixin.ts`** — `HassConfigMixin`. Adds plain `hass` and `config` fields. Intentionally **not** `@property()` — we don't want Lit's attribute reflection / reactive-property plumbing for these. Used by inner components that receive these values from their parent (`<whisker-card-footer>`, `<whisker-controls-entity-row>`) and composed with `SubscribeEntityStateMixin` on `<whisker-card-footer-item>`.

## Conventions

- Pick the right mixin: components that need live entity state updates set `entity` and use `SubscribeEntityStateMixin`; inner components that just consume `hass`/`config` from their parent use `HassConfigMixin`. Compose both when a child needs parent-assigned config and its own entity subscription (see `footer-item.ts`).
- Don't convert the `HassConfigMixin` fields into `@property()` — the absence of reactivity here is deliberate, and changing it will trigger extra re-renders.
