# AGENTS.md - Home Assistant Code

This folder contains copied or adapted Home Assistant frontend types, helpers, and integration glue.

- Treat these files as upstream Home Assistant frontend code unless clearly documented otherwise.
- Keep copied files matching upstream 100% when they are vendored from Home Assistant.
- If a local change is unavoidable, document why it diverges from upstream.
- Prefer copying the smallest needed upstream surface instead of inventing parallel types.
- Be careful with import paths so shared HASS helpers stay portable across card repos.

## Local usage

`data/device_registry.ts` exposes `serial_number` and `model` on `DeviceRegistryEntry`. The card reads these via `getDevice()` for robot artwork selection — keep these fields present when syncing from upstream.
