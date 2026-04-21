# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A growing collection of TypeScript exercises covering various topics. Each exercise is a self-contained implementation challenge with tests. This is a **learning repo**, not a production application. Exercises are added incrementally — the current set starts with type-system fundamentals and will expand to generics, utility types, decorators, mapped/conditional types, and more.

## Commands

- **Run all tests:** `npm test`
- **Run a single exercise's tests:** `npx jest exercises/type-narrowing` (pass the folder name)
- **Run a specific test file:** `npx jest exercises/type-narrowing/type-narrowing.test.ts`
- **Type-check without running tests:** `npm run typecheck`

Jest runs via `ts-jest` — no separate compile step needed.

## Exercise Structure

Each exercise lives in `exercises/<name>/` and contains:

- `<name>.md` — Problem description, real-world context, and key concepts
- `<name>.ts` — Starter code with `TODO` stubs. Exports via named ES-module exports (compiled to CommonJS by ts-jest).
- `<name>.test.ts` — Jest tests using `import`. Tests are the source of truth for correctness.
- `<name>-result.ts` (some exercises) — Completed solution for reference.
- `<name>-result.md` (some exercises) — Detailed walkthrough.

## Conventions

- All source files are TypeScript (`.ts`). No plain `.js` files inside `exercises/`.
- `strict: true` is enabled in `tsconfig.json` — solutions must satisfy strict type-checking.
- No external runtime dependencies — exercises use only built-in TypeScript/Node APIs.
- Tests use `jest.fn()` for mocking where needed; no real network calls or I/O.
- Exports use named exports (`export function …`), imported with `import { … } from './name'`.
