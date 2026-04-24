# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A growing collection of TypeScript exercises covering various type-system topics. Each exercise is a self-contained implementation challenge with tests. This is a **learning repo**, not a production application. Exercises are added incrementally and progress from fundamentals toward advanced type-level programming.

## Commands

- **Run all tests:** `npm test`
- **Run a single exercise's tests:** `npx jest exercises/type-narrowing` (pass the folder name)
- **Run a specific test file:** `npx jest exercises/type-narrowing/type-narrowing.test.ts`
- **Type-check without running tests:** `npm run typecheck`

Jest runs via `ts-jest` — no separate compile step needed. Some exercises define type aliases (`IsArray`, `Nullable`, etc.) that are verified at compile time — always run `npm run typecheck` in addition to `npm test` for those exercises.

## Exercise Structure

Each exercise lives in `exercises/<name>/` and contains:

- `<name>.md` — Problem description, real-world context, task breakdown, and key concepts table.
- `<name>.ts` — Starter code with `TODO` stubs. Exports via named ES-module exports (compiled to CommonJS by ts-jest).
- `<name>.test.ts` — Jest tests. Tests are the source of truth for runtime correctness.
- `<name>-result.ts` (some exercises) — Completed solution for reference.
- `<name>-result.md` (some exercises) — Detailed walkthrough of the solution.

## Current Exercises

| Exercise | Topics | Has result.md |
|---|---|---|
| `type-narrowing` | `typeof`, discriminated unions, truthiness guards | ✓ |
| `generics` | type parameters, constraints, `keyof`, `Pick` | ✓ |
| `utility-types` | `Partial`, `Required`, `Omit`, `Parameters`, `ReturnType` | — |
| `mapped-types` | `{ [K in keyof T] }`, `T[K]`, value transformation | — |
| `conditional-types` | `T extends U ? A : B`, `infer`, `UnwrapPromise`, `ElementType` | — |
| `exhaustive-unions` | `assertNever`, `never`, exhaustiveness checking in `switch` | — |

## Conventions

- All source files are TypeScript (`.ts`). No plain `.js` files inside `exercises/`.
- `strict: true` is enabled in `tsconfig.json` — solutions must satisfy strict type-checking.
- No external runtime dependencies — exercises use only built-in TypeScript/Node APIs.
- Tests use `jest.fn()` for mocking where needed; no real network calls or I/O.
- Exports use named exports (`export function …`), imported with `import { … } from './name'`.

## Writing result.md Files

Result walkthroughs follow a strict, repeatable format. Every file in this repo and in the companion JS repo (`training-javascript`) uses the same structure — keep them consistent.

### Mandatory structure (in order)

1. **`# <Exercise Name> - Solution`** — H1 title. No preamble, no intro sentence before the code.
2. **Full solution code block** — the complete `<name>-result.ts` content in one fenced TypeScript block, immediately after the title.
3. **`## How the <X> pattern works`** (or "How each function works") — H2 intro, 1–3 plain-English sentences explaining what the code does at a high level before diving into details.
4. **`### <Why/How question>` subsections** — one per exported function or key concept. Each subsection:
   - Repeats the relevant snippet in a smaller fenced block (isolated, easier to read).
   - Answers the question in the heading — explains **why** the approach was chosen, not what it does.
   - Names any non-obvious language feature or API (e.g. `padStart`, `Array.from`, `infer`, `Object.fromEntries`) and explains it.
   - Flags the **central insight** explicitly: "The key insight:", "This is the most important line:", etc.
5. **`### Step-by-step trace`** — a fenced ASCII block (not prose) walking through a concrete example. Use real values from the tests. Show intermediate state at each step with labels (e.g. `i=0: …`, `t=100ms: …`). Include at least one happy path and one failure/edge-case path.
6. **`## Mental model`** — H2 at the very end. A real-world analogy described in 1–2 sentences, followed by a bulleted list that maps each code concept to the analogy (e.g. `cache → queue board`, `fn(key) → dispatching a taxi`).

### Style rules

- **Explain the why, not the what.** If the code is already readable, the prose adds the non-obvious constraint, trade-off, or alternative the code can't express.
- **Contrasting code blocks.** When showing a common mistake, label the blocks `// BROKEN` and then show the correct version. Use `// WITH await` / `// WITHOUT await` for await-vs-not comparisons.
- **Alternative approaches.** If two correct approaches exist (e.g. `for/await` vs `.reduce`), show both, say both are correct, then recommend one with a reason.
- **Edge cases get their own subsection** if they're covered by a test — quote the exact test name when the explanation is tied to a specific test.
- **Comparison tables** for related exercises or closely related concepts (e.g. `Partial` vs `Required`, `Pick` vs `Omit`). Use 3–5 rows of meaningful behavioral differences, not surface-level syntax.
- Keep prose tight — one focused paragraph per subsection is usually right. Short declarative sentences.
- Use inline code for all type names, function names, keywords, and operators.
- `as SomeCast` casts: acceptable when runtime logic is correct but the type system can't follow it — always explain why the cast is safe.

### What does NOT belong in result files

- The problem statement (reader has already read `<name>.md`).
- Test file contents or setup instructions.
- Grading criteria or hints.
