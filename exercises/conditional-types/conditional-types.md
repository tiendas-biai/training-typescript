# Conditional Types

## The Problem

Mapped types transform the *shape* of an existing type. Conditional types go a step further: they let TypeScript choose between types based on a condition, and — with the `infer` keyword — extract type information from within another type. This is how TypeScript's built-in `ReturnType<T>`, `Awaited<T>`, and `NonNullable<T>` are implemented.

## Real-World Context

You're writing utilities that operate on heterogeneous data: arrays that may be nested, values that may or may not be wrapped in a `Promise`, and lists that may contain `null` or `undefined` entries. The conditional type aliases you define here describe the *type-level* logic; the functions implement the *runtime* logic. Together, they guarantee correctness in both directions.

## Your Task

### 1. Define `IsArray<T>`

Evaluates to `true` if `T` is an array, `false` otherwise.

```ts
IsArray<string[]>  // → true
IsArray<string>    // → false
```

### 2. Define `ElementType<T>`

Extracts the element type of an array `T`. Use the `infer` keyword to capture it. If `T` is not an array, resolve to `never`.

```ts
ElementType<string[]>  // → string
ElementType<number[]>  // → number
ElementType<string>    // → never
```

### 3. Define `UnwrapPromise<T>`

If `T` is a `Promise<U>`, resolve to `U`. Otherwise resolve to `T` itself.

```ts
UnwrapPromise<Promise<string>>  // → string
UnwrapPromise<number>           // → number
```

### 4. Implement `flatten<T>(arr: T[][]): T[]`

Flatten one level of nesting. `[[1, 2], [3]]` → `[1, 2, 3]`.

### 5. Implement `compact<T>(arr: (T | null | undefined)[]): T[]`

Remove all `null` and `undefined` entries. `[1, null, 2, undefined, 3]` → `[1, 2, 3]`.

### 6. Implement `resolveAll<T>(values: (T | Promise<T>)[]): Promise<T[]>`

Resolve every entry in `values` — plain values pass through, promises are awaited — and return all results in order.

## Key Concepts

| Syntax | What it does |
|---|---|
| `T extends U ? A : B` | If `T` is assignable to `U`, use `A`; otherwise `B` |
| `infer U` | Capture a type variable from within a conditional |
| `T extends Promise<infer U>` | Extract the wrapped type from a Promise |
| `T extends (infer E)[]` | Extract the element type of an array |

## Verification

Type aliases (`IsArray`, `ElementType`, `UnwrapPromise`) are checked at compile time — run `npm run typecheck` in addition to `npm test`.
