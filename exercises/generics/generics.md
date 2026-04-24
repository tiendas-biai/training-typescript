# Generics

## The Problem

TypeScript lets you write functions that work across many types while still preserving type information. Without generics you're forced to choose between flexibility (use `any`, lose the type) and precision (hardcode the type, lose the reuse). Generics give you both.

## Real-World Context

You're building a small utility library — the kind that ends up in a `utils/` folder used across an entire codebase. These helpers need to work with any data shape the caller provides, and callers expect TypeScript to track the types through each call so their editor can autocomplete and catch mistakes downstream.

## Your Task

Implement the following four functions.

### 1. `identity<T>(value: T): T`

Return the value unchanged. TypeScript should infer the return type from the argument — not widen it to `unknown` or `any`.

### 2. `first<T>(arr: T[]): T | undefined`

Return the first element of the array, or `undefined` if the array is empty. The element type must be preserved — `first(['a', 'b'])` should return `string | undefined`, not `unknown`.

### 3. `zip<A, B>(as: A[], bs: B[]): [A, B][]`

Pair up elements from two arrays by index. Stop at the shorter array's length. For example:

```
zip([1, 2, 3], ['a', 'b', 'c']) → [[1, 'a'], [2, 'b'], [3, 'c']]
zip([1, 2],    ['a', 'b', 'c']) → [[1, 'a'], [2, 'b']]
```

The return type must be `[A, B][]` — a typed tuple array, not `(A | B)[][]`.

### 4. `pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>`

Return a new object containing only the specified keys from `obj`. The return type must be exactly `Pick<T, K>` — TypeScript should know which properties are present and what their types are.

## Key Concepts

| Concept | What it gives you |
|---|---|
| `<T>` type parameter | Captures the caller's type and threads it through the function |
| `T[]` / `Array<T>` | Generic over the element type of an array |
| Multiple parameters `<A, B>` | Track two independent types through one function |
| `K extends keyof T` | Constrain a type parameter to the keys of another type |
| `Pick<T, K>` | Built-in utility type — subset of `T` containing only keys `K` |
