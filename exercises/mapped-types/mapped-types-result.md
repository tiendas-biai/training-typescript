# Mapped Types - Solution

```typescript
export type Nullable<T>    = { [K in keyof T]: T[K] | null };
export type Stringified<T> = { [K in keyof T]: string };

export function nullify<T extends object>(obj: T): Nullable<T> {
  const result = {} as Nullable<T>;
  for (const key in obj) {
    result[key] = null;
  }
  return result;
}

export function stringifyValues<T extends object>(obj: T): Stringified<T> {
  return mapValues(obj, (value) => String(value));
}

export function mapValues<T extends object, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => U
): { [K in keyof T]: U } {
  const result = {} as { [K in keyof T]: U };
  for (const key in obj) {
    result[key] = fn(obj[key], key);
  }
  return result;
}
```

## How mapped types work

A mapped type iterates over the keys of an existing type and produces a new type — transforming the values, modifying optionality, or adding modifiers. The syntax `{ [K in keyof T]: ... }` is the type-level equivalent of a `for...in` loop: `K` takes on each key of `T` one at a time, and the right-hand side describes what type that key should have in the result.

### `Nullable<T>` — transforming value types

```typescript
type Nullable<T> = { [K in keyof T]: T[K] | null };
```

`K in keyof T` iterates over every key of `T`. `T[K]` is the original value type at that key (an *indexed access type*). Adding `| null` makes every property accept `null` in addition to its original type. The result is a new type with the same shape as `T` but every value widened to include `null`.

### `Stringified<T>` — replacing value types entirely

```typescript
type Stringified<T> = { [K in keyof T]: string };
```

The right-hand side doesn't need to reference `T[K]` at all. When every value should become the same type regardless of what it was before, just write that type directly. All keys of `T` are preserved; all values become `string`.

### `mapValues` — the general-purpose transformer

```typescript
export function mapValues<T extends object, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => U
): { [K in keyof T]: U } {
  const result = {} as { [K in keyof T]: U };
  for (const key in obj) {
    result[key] = fn(obj[key], key);
  }
  return result;
}
```

The return type `{ [K in keyof T]: U }` is an inline mapped type — every key of `T` is preserved, but the value type is replaced with `U` (whatever `fn` returns). This keeps the key set identical to the input while letting the values be anything.

`T[keyof T]` in the `fn` parameter is the union of all possible value types in `T`. For `{ a: number; b: string }`, that would be `number | string`. It's a deliberate widening — since `fn` receives values from different keys, TypeScript can't know at the call site which specific key is being processed.

The `as { [K in keyof T]: U }` cast on `result` is necessary because `{}` doesn't start with the right shape. The runtime logic is correct — the loop fills in exactly those keys — but the type system can't infer that from an empty object literal.

### `stringifyValues` — implementing it in terms of `mapValues`

```typescript
export function stringifyValues<T extends object>(obj: T): Stringified<T> {
  return mapValues(obj, (value) => String(value));
}
```

`stringifyValues` is a specialisation of `mapValues` where `U = string` and `fn = String`. Implementing it this way avoids duplicating the `for...in` loop and keeps the logic in one place.

The key insight: use `String(value)`, not `JSON.stringify(value)`. They produce the same output for numbers and booleans, but diverge for strings:

```typescript
String('hello')         // → 'hello'    ✓
JSON.stringify('hello') // → '"hello"'  ✗  adds surrounding quotes
```

### Step-by-step trace

```
// Compile-time: type evaluation

Nullable<{ id: number; name: string }>
  K = 'id'   → id:   number | null
  K = 'name' → name: string | null
  result: { id: number | null; name: string | null } ✓

Stringified<{ id: number; active: boolean }>
  K = 'id'     → id:     string
  K = 'active' → active: string
  result: { id: string; active: string } ✓

// Runtime: nullify({ id: 1, name: 'Alice', active: true })
  result = {}
  key = 'id'     → result.id     = null
  key = 'name'   → result.name   = null
  key = 'active' → result.active = null
  return { id: null, name: null, active: null } ✓

// Runtime: stringifyValues({ id: 1, active: true, score: 9.5 })
  → mapValues(obj, value => String(value))
  key = 'id'     → String(1)    = '1'
  key = 'active' → String(true) = 'true'
  key = 'score'  → String(9.5)  = '9.5'
  return { id: '1', active: 'true', score: '9.5' } ✓
```

## Mental model

A mapped type is a stencil. You hand it an existing type (`T`) as a template, and it stamps out a new type with the same keys but with values reshaped by a rule. `Nullable<T>` applies the rule "add `| null` to every slot"; `Stringified<T>` applies "replace every slot with `string`"; `mapValues` applies whatever rule you give it at runtime.

- `keyof T` → the list of key names on the stencil
- `[K in keyof T]` → the loop that visits each slot
- `T[K]` → the original value type at that slot
- `T[K] | null` → the new rule for that slot
- `{ [K in keyof T]: U }` → the finished stamp with all slots replaced
