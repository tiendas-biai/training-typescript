# Generics - Solution

```typescript
export function identity<T>(value: T): T {
  return value;
}

export function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

export function zip<A, B>(as: A[], bs: B[]): [A, B][] {
  const minLength = Math.min(as.length, bs.length);
  return Array.from({ length: minLength }, (_, i) => [as[i], bs[i]]);
}

export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = Object.fromEntries(keys.map(key => [key, obj[key]]));
  return result as Pick<T, K>;
}
```

## How each function works

### `identity` — the simplest generic

```typescript
function identity<T>(value: T): T {
  return value;
}
```

`<T>` is a type parameter — a placeholder that TypeScript fills in at the call site. When you write `identity(42)`, TypeScript infers `T = number` and the return type becomes `number`. No `any`, no cast. The function's contract is expressed entirely in its signature: whatever type goes in comes out unchanged.

### `first` — generic over array element type

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

`T[]` captures the element type of the array. Accessing `arr[0]` on an empty array returns `undefined` in JavaScript, and TypeScript models this with the `| undefined` in the return type. The caller gets back `T | undefined` — not `unknown`, not `any` — so downstream code can still use the type.

### `zip` — two independent type parameters

```typescript
function zip<A, B>(as: A[], bs: B[]): [A, B][] {
  const minLength = Math.min(as.length, bs.length);
  return Array.from({ length: minLength }, (_, i) => [as[i], bs[i]]);
}
```

`<A, B>` declares two independent type parameters — one per array. The return type `[A, B][]` is an array of tuples, not `(A | B)[][]`. This matters: `[A, B]` tells TypeScript that position 0 is always `A` and position 1 is always `B`, so destructuring `const [a, b] = pair` gives correctly typed `a: A` and `b: B`.

`Array.from({ length: n }, mapper)` is the idiomatic way to build an array of a known length by index — cleaner than a push loop, and it produces the result directly without an intermediate accumulator.

### `pick` — constrained generics and `keyof`

```typescript
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = Object.fromEntries(keys.map(key => [key, obj[key]]));
  return result as Pick<T, K>;
}
```

`K extends keyof T` is a *constraint*: `K` must be a subset of the keys of `T`. This prevents passing a key that doesn't exist on `obj` — TypeScript will reject the call at the use site.

The return type `Pick<T, K>` is a built-in mapped type that keeps only the keys listed in `K`. This means the caller knows exactly which properties are present on the result.

The `as Pick<T, K>` cast is necessary because `Object.fromEntries` returns `{ [k: string]: T[keyof T] }` — TypeScript doesn't track which specific keys went in. The cast is safe here because the runtime code is building exactly those keys; the type system just can't infer it automatically.

## Key patterns

- **One type parameter** when the input and output share a type (`identity`, `first`)
- **Multiple type parameters** when two inputs are independently typed (`zip`)
- **`K extends keyof T`** to constrain a type to the keys of another type (`pick`)
- **`as SomeType` cast** is acceptable when the runtime logic is correct but the type system can't follow it — document why the cast is safe
