# Conditional Types - Solution

```typescript
export type IsArray<T> = T extends any[] ? true : false;

export type ElementType<T> = T extends (infer E)[] ? E : never;

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export function flatten<T>(arr: T[][]): T[] {
  return arr.flat();
}

export function compact<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter((v): v is T => v != null);
}

export async function resolveAll<T>(values: (T | Promise<T>)[]): Promise<T[]> {
  return Promise.all(values.map(v => Promise.resolve(v)));
}
```

## How conditional types work

`T extends U ? A : B` is TypeScript's type-level `if/else`. At compile time, TypeScript evaluates whether `T` is assignable to `U` and resolves to either `A` or `B`. The `infer` keyword lets you capture a type that TypeScript discovers during that check — writing it down as a named variable you can use on the right-hand side.

### `IsArray<T>` — the simplest conditional type

```typescript
type IsArray<T> = T extends any[] ? true : false;
```

`any[]` matches any array regardless of element type. If `T` is assignable to it, the type resolves to the literal `true`; otherwise the literal `false`. No `infer` needed here because we don't care what's inside the array — only whether it is one.

### `ElementType<T>` — extracting a type with `infer`

```typescript
type ElementType<T> = T extends (infer E)[] ? E : never;
```

The key insight: `infer E` tells TypeScript "if `T` matches this array shape, capture whatever the element type is and call it `E`". TypeScript fills in `E` automatically — you don't provide it. Once captured, `E` is available on the right-hand side of `?`. If `T` is not an array, the condition fails and the type resolves to `never` (the standard way to express "this type makes no sense here").

`(infer E)[]` is how you write "an array of something" with the element type captured. Compare with `Promise<infer U>` below — the pattern is always `OuterWrapper<infer Captured>`.

### `UnwrapPromise<T>` — `infer` applied to a generic wrapper

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
```

Same `infer` pattern, different wrapper. If `T` is a `Promise<U>`, TypeScript extracts `U` and the type resolves to `U` (one layer unwrapped). If `T` is not a Promise, it resolves to `T` itself — a passthrough. This is exactly how the built-in `Awaited<T>` utility type works under the hood (though `Awaited` also handles nested promises recursively).

### `flatten` — why `arr.flat()` is enough

```typescript
export function flatten<T>(arr: T[][]): T[] {
  return arr.flat();
}
```

`Array.prototype.flat()` with no argument flattens exactly one level — which matches the function's contract (`T[][]` → `T[]`). No manual loop needed. The type parameter `T` ensures the element type flows through correctly: `flatten([[1, 2], [3]])` infers `T = number` and returns `number[]`.

### `compact` — why the filter needs a type predicate

```typescript
export function compact<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter((v): v is T => v != null);
}
```

Two things are happening here that matter:

**`v != null` (loose inequality)** catches both `null` and `undefined` in a single check. Loose equality treats `null` and `undefined` as equal to each other, so `v != null` is equivalent to `v !== null && v !== undefined`. This is one of the few cases where loose equality is the right choice.

**`(v): v is T` (type predicate)** is the important part. A plain `arr.filter(v => v != null)` would return `(T | null | undefined)[]` — TypeScript doesn't know that the filter removed the nullish values. The predicate `v is T` explicitly tells the type system: "after this filter, the elements are `T`, not `T | null | undefined`". Without it, the `as T[]` cast would be required.

A truthiness filter (`v => v`) is a common mistake here. It works for the tests but silently removes falsy values like `0`, `false`, and `''`. The `!= null` check is precise: it removes only `null` and `undefined`.

### `resolveAll` — why `Promise.all` instead of awaiting one by one

```typescript
export async function resolveAll<T>(values: (T | Promise<T>)[]): Promise<T[]> {
  return Promise.all(values.map(v => Promise.resolve(v)));
}
```

The starter approach of `await`ing inside a `for` loop works but is sequential — each value waits for the previous one to settle before starting. `Promise.all` starts all of them concurrently and waits for all to settle, which is faster when multiple promises are in flight.

`Promise.resolve(v)` normalizes each entry: if `v` is already a `Promise<T>`, it returns it as-is; if `v` is a plain `T`, it wraps it in an already-settled promise. This is what makes the function accept a mixed array of values and promises.

`Promise.all` preserves input order regardless of settlement order — the result at index `i` always corresponds to `values[i]`. The "preserves order" test verifies exactly this.

### Step-by-step trace

```
// Compile-time type evaluation

IsArray<string[]>
  string[] extends any[]  → true  ✓

IsArray<string>
  string extends any[]    → false ✓

ElementType<number[]>
  number[] extends (infer E)[]  → TypeScript captures E = number  → number ✓

ElementType<string>
  string extends (infer E)[]    → no match                        → never  ✓

UnwrapPromise<Promise<string>>
  Promise<string> extends Promise<infer U>  → TypeScript captures U = string  → string ✓

UnwrapPromise<number>
  number extends Promise<infer U>           → no match                        → number ✓

// Runtime: resolveAll — "preserves order" test
// slow = Promise resolving to 1 at t=50ms, fast = Promise resolving to 2 immediately

resolveAll([slow, fast])
  step 1: values.map(v => Promise.resolve(v))
          → [Promise<slow>, Promise<fast>]  // both already promises, returned as-is
  step 2: Promise.all([Promise<slow>, Promise<fast>])
          → t~0ms: fast settles → result[1] = 2
          → t=50ms: slow settles → result[0] = 1
          → all settled → [1, 2]  // input order, not settlement order ✓
```

## Mental model

Think of conditional types as a customs officer inspecting each incoming type at the border. Every type `T` that arrives is checked against a template (`U`). If it matches, the officer stamps it `A` and waves it through; if not, it gets stamped `B`. The `infer` keyword is the officer writing down what they found inside a package — "this box contains an item of type `E`" — so they can use that label in the decision.

- `T extends U ? A : B` → the inspection question
- `infer E` → the officer's notepad: captures what's inside
- `true / false` → the two possible stamps for `IsArray`
- `E` / `never` → "contents found" vs. "nothing valid here" for `ElementType`
- `U` / `T` → "unwrapped contents" vs. "passed through as-is" for `UnwrapPromise`
