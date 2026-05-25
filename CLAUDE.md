# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Cross-agent instructions and the rule for diagnosing `yarn test` failures live in [AGENTS.md](./AGENTS.md) and per-folder `AGENTS.md` files (`test/`, `src/cards/` (+ `mixins/`), `src/delegates/`, `src/hass/`, `src/html/`, `src/common/`, `src/config/`, `src/types/`). Read the nearest one before editing files in a subdirectory.

## Project

**Whisker Card** is a Home Assistant custom Lovelace card that surfaces Litter-Robot status and controls. It depends on the official Home Assistant `litterrobot` integration and is configured with a `device_id` plus optional `title`, `color`, `footer`, and `features`. Supports LR4, LR5, LR5 Pro, and Litter-Robot Evo artwork (auto-detected from device serial/model). Developed and tested against a Litter-Robot 5 (LR5).

The bundled output is a single ES module at `dist/whisker.js`, intended to be loaded as a Lovelace resource.

## Package Manager

Yarn project — use `yarn`, not `npm`.

## Commands

- `yarn build` — Parcel build → `dist/whisker.js`
- `yarn watch` — Parcel watch mode
- `yarn test` — Mocha test suite (uses `tsconfig.test.json` via `ts-node`)
- `yarn test:coverage` — Mocha + NYC coverage
- `yarn test:watch` — Mocha watch mode
- `yarn lint` — ESLint (TypeScript + Lit + web component best practices)
- `yarn lint:fix` — ESLint with auto-fix where safe
- `yarn typecheck` — `tsc` against `tsconfig.test.json`
- `yarn format` — Prettier (with import-sort plugins)
- `yarn pass` — format + typecheck + lint + test (run before shipping)
- `yarn update` — `npx npm-check-updates -u && yarn install`

### Single test

```bash
TS_NODE_PROJECT='./tsconfig.test.json' npx mocha test/path/to/specific.spec.ts
```

### Diagnosing `yarn test` ERR_MODULE_NOT_FOUND

If `yarn test` reports `Cannot find package '@cards/...'` (or any `@*` alias) with `ERR_MODULE_NOT_FOUND`, it is almost never a path-alias / `tsconfig-paths` issue — those aliases are wired through `tsconfig.json` and registered at runtime by the Mocha setup. The real cause is usually a TypeScript compile error in the imported file or one of its transitive imports, which `ts-node` surfaces as a misleading module-resolution failure.

Diagnose with:

```bash
npx tsc -p tsconfig.test.json --noEmit
```

Fix the type errors first, then rerun `yarn test`. Do not investigate path aliases or test config until the typecheck is clean.

## Architecture

### Entry point and registration

[src/index.ts](src/index.ts) imports the `WhiskerCard` and `WhiskerCardEditor` components, registers them as the `whisker-card` and `whisker-card-editor` custom elements, and pushes a `customCards` descriptor onto `globalThis` so Home Assistant discovers the card. It also eagerly imports the toilet-level gauge/levels components so they are defined before first render.

### Layered structure under `src/`

- **`cards/`** — Lit components. `cards/robot/` holds the main card ([card.ts](src/cards/robot/card.ts)), visual editor ([editor.ts](src/cards/robot/editor.ts)), shared `styles.ts`, bundled artwork ([assets.ts](src/cards/robot/assets.ts)), and model detection ([detect-model.ts](src/cards/robot/detect-model.ts)). `cards/components/` contains focused sub-components (`status`, `status-panel`, `controls`, `footer`, `toilet-levels`, `chonk`). `cards/mixins/` holds Lit mixins shared across components.
- **`delegates/`** — Business logic, kept independent of Lit rendering: `retrievers/` for reading HASS state/entities, `entities/` for entity selection/mapping, `utils/` for pure transforms and action handlers. Cards call into delegates; delegates do not import from cards.
- **`hass/`** — Vendored / adapted Home Assistant frontend types and helpers (`common`, `components`, `data`, `dialogs`, `panels`, `state`, `ws`, plus `types.ts`). Treat these as upstream code; keep them matching upstream unless a divergence is documented.
- **`html/`** — Small, side-effect-free helpers that return Lit templates (state displays, icons, sections, rows). No business logic.
- **`common/`** — Cross-cutting utilities ([litterrobot-status.ts](src/common/litterrobot-status.ts), [map-entities.ts](src/common/map-entities.ts), [open-entity-more-info.ts](src/common/open-entity-more-info.ts)). Must not import from `cards/` (avoid cycles).
- **`types/`** — TypeScript contracts: `config.ts` (user config / public card API), `entity.ts`, `types.ts`, `assets.d.ts`. Reuse HASS types from `src/hass/` instead of duplicating them.

### Data flow

1. HA dashboard hands the card a config (`device_id`, optional `title`, `color`, `footer`, `features`).
2. Delegates resolve the device's entities from HA's entity/device registries and current state; `scoop-droppings` also reads `model` and `serial_number` from the device registry.
3. Robot artwork is selected from bundled AVIFs via serial-prefix detection (`detect-model.ts`) and config `color`.
4. Status is derived from the `status_code` sensor; an active cycle (`ccp`, `ec`, `cst`) triggers "cycling" visual emphasis.
5. The card and its sub-components render gauges (litter/waste), configurable footer metrics, pet weight chip, status header, and quick actions.
6. Interactions: litter-box tap → `vacuum.start`, reset tap → `button.press`; hold on either opens the standard HA more-info dialog. The hamburger menu opens a dialog of native Lovelace entity rows for globe light, brightness, panel brightness, and cycle delay (when present).

### TypeScript path aliases

Defined in `tsconfig.json` and registered at test runtime via `tsconfig-paths`:

```
@/*          → ./src/*
@cards/*     → ./src/cards/*
@common/*    → ./src/common/*
@delegates/* → ./src/delegates/*
@hass/*      → ./src/hass/*
@html/*      → ./src/html/*
@type/*      → ./src/types/*
@util/*      → ./src/util/*
@test/*      → ./test/*
```

TypeScript is in strict mode with `noUncheckedIndexedAccess` and `noImplicitOverride`, plus `experimentalDecorators` for Lit.

### Build & test toolchain

- **Bundler:** Parcel 2 with `@parcel/transformer-inline-string`; single-module target including node_modules, source `src/index.ts` → `dist/whisker.js`.
- **Tests:** Mocha + Chai + Sinon + `@open-wc/testing` + JSDOM. `.mocharc.json` requires `test/helpers/card-assets-stub.cjs` (stubs Parcel's inline-string asset imports), `ts-node/register`, `tsconfig-paths/register`, and `mocha.setup.ts` (sets up JSDOM globals). Tests live in `test/` mirroring `src/` layout.
- **Coverage:** NYC with `@istanbuljs/nyc-config-typescript`.
