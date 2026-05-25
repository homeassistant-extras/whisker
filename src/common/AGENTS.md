# AGENTS.md - Common

This folder contains shared utilities used across cards, delegates, and helpers.

- Keep utilities generic enough to justify living in `src/common/`.
- Prefer pure, well-named functions with narrow inputs and outputs.
- Avoid importing card components from this folder to prevent dependency cycles.
- Add focused tests for sorting, filtering, mapping, or formatting changes.

## Notable utilities

- **`map-entities.ts`** — maps Whisker integration `translation_key` values onto `DutyReport` fields.
- **`resolve-footer-items.ts`** — resolves configured footer slots from `DutyReport` entity ids.
- **`litterrobot-status.ts`** — status code → presentation (icon, color, cycling detection).
