# AGENTS.md

Project instructions for AI coding agents (Claude Code, Cursor, Codex, etc.). All agents working in this repo should read this file. For deeper architecture and conventions, see [CLAUDE.md](./CLAUDE.md).

## Before you change code

Read the **nearest** `AGENTS.md` before editing files in a subdirectory. Scoped guidance lives in:

| Path                                                       | Scope                                     |
| ---------------------------------------------------------- | ----------------------------------------- |
| [test/AGENTS.md](./test/AGENTS.md)                         | Mocha setup, test commands, asset stubs   |
| [src/cards/AGENTS.md](./src/cards/AGENTS.md)               | Lit card UI, editor, components           |
| [src/cards/mixins/AGENTS.md](./src/cards/mixins/AGENTS.md) | Shared card mixins                        |
| [src/delegates/AGENTS.md](./src/delegates/AGENTS.md)       | Business logic, retrievers, subscriptions |
| [src/hass/AGENTS.md](./src/hass/AGENTS.md)                 | Vendored Home Assistant frontend code     |
| [src/html/AGENTS.md](./src/html/AGENTS.md)                 | Lit template helpers                      |
| [src/common/AGENTS.md](./src/common/AGENTS.md)             | Cross-cutting utilities                   |
| [src/config/AGENTS.md](./src/config/AGENTS.md)             | Feature flags and config helpers          |
| [src/types/AGENTS.md](./src/types/AGENTS.md)               | TypeScript contracts                      |

When a change spans layers (e.g. config type + editor schema + card render), read every scoped file that touches those folders.

## Validation

Before shipping, run:

```bash
yarn pass
```

This runs format, typecheck, lint, and the full test suite. All steps must pass.
