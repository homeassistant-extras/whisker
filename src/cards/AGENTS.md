# AGENTS.md - Cards

This folder contains Lit-based card UI, editors, mixins, and card-specific components.

- Keep rendering logic declarative and close to the component that owns the UI state.
- Use delegates, helpers, or common utilities for business logic that can be tested without DOM rendering.
- Preserve Home Assistant custom element registration patterns used by the repo.
- Keep editor components focused on config editing and emitting config change events.
- Prefer existing local component, mixin, and style patterns before adding new abstractions.

## Layout

- **`robot/`** — main card (`card.ts`), visual editor (`editor.ts`), shared `styles.ts`, bundled artwork (`assets.ts`), and model detection (`detect-model.ts`).
- **`components/`** — focused sub-components: `status`, `status-panel`, `controls`, `footer`, `toilet-levels`, `chonk`.
- **`mixins/`** — shared Lit mixins; see [mixins/AGENTS.md](./mixins/AGENTS.md).

## Robot artwork

- **`detect-model.ts`** — maps device `serial_number` (authoritative prefix: `LR4`, `LR5`, `LRE`) and `model` string (LR5 Pro) to a `ModelKey` (`lr4`, `lr5`, `lr5-pro`, `lre`). Defaults to `lr5`.
- **`assets.ts`** — resolves the bundled AVIF URL from model key + config `color` (`white` | `black`). Each `new URL(...)` **must** use a string literal path; Parcel only inlines literal `new URL('…', import.meta.url)` calls.
- **`src/assets/`** — source AVIF files keyed `${modelKey}-${color}` (e.g. `lr5-pro-black.avif`).
- Tests stub `./assets` via `test/helpers/card-assets-stub.cjs` so `import.meta.url` is not evaluated under the CommonJS test tsconfig.

When adding a new robot family or color, update `detect-model.ts`, add AVIF assets, extend the `ROBOT_IMAGES` map in `assets.ts`, and add tests in `test/cards/robot/`.
