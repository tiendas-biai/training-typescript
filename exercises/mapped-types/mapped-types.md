# Mapped Types

## The Problem

Built-in utility types like `Partial<T>` and `Readonly<T>` are themselves written as mapped types. A mapped type iterates over the keys of an existing type and produces a new type — transforming the values, making keys optional, or adding modifiers. Writing your own mapped types lets you express transformations that the built-ins don't cover.

## Real-World Context

You're building a data layer that needs a few type-level transformations: marking every field as nullable when loading from a sparse cache, converting all values to strings for serialization, and transforming an object's values uniformly with a callback. Rather than writing a separate type for each data shape, you write generic mapped types once and apply them to any object type.

## Your Task

### 1. Define `Nullable<T>`

A mapped type that makes every property of `T` nullable (`T[K] | null`).

```ts
type NullableUser = Nullable<{ id: number; name: string }>;
// → { id: number | null; name: string | null }
```

Implement `nullify<T extends object>(obj: T): Nullable<T>` — return a new object with the same keys but every value set to `null`.

### 2. Define `Stringified<T>`

A mapped type that converts every property value to `string`.

```ts
type StringifiedUser = Stringified<{ id: number; active: boolean }>;
// → { id: string; active: string }
```

Implement `stringifyValues<T extends object>(obj: T): Stringified<T>` — return a new object with every value converted via `String(value)`.

### 3. Implement `mapValues`

```ts
export function mapValues<T extends object, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => U
): { [K in keyof T]: U }
```

Apply `fn` to each value in `obj` and return a new object with the same keys. The return type is an inline mapped type — every key of `T` is preserved, but the value type becomes `U`.

Note: `stringifyValues` can be implemented in terms of `mapValues`.

## Key Concepts

| Syntax | What it does |
|---|---|
| `{ [K in keyof T]: ... }` | Iterate over all keys of `T` |
| `T[K]` | The value type at key `K` |
| `T[K] \| null` | Make each value nullable |
| `-?` modifier (e.g. `[K in keyof T]-?`) | Remove optionality from all keys |
| `readonly [K in keyof T]` | Make all properties readonly |

## Verification

Both `npm test` (runtime) and `npm run typecheck` (compile-time) must pass. Type aliases like `Nullable<T>` and `Stringified<T>` are verified at compile time — if the mapped type is wrong, TypeScript will reject functions that depend on it.
