# Exhaustive Discriminated Unions - Solution

```typescript
export type Circle    = { kind: 'circle';    radius: number };
export type Rectangle = { kind: 'rectangle'; width: number; height: number };
export type Triangle  = { kind: 'triangle';  a: number; b: number; c: number; base: number; height: number };

export type Shape = Circle | Rectangle | Triangle;

export function assertNever(value: never): never {
  throw new Error(`Unhandled variant: ${JSON.stringify(value)}`);
}

export function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':    return Math.PI * shape.radius ** 2;
    case 'rectangle': return shape.width * shape.height;
    case 'triangle':  return 0.5 * shape.base * shape.height;
    default:          return assertNever(shape);
  }
}

export function perimeter(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':    return 2 * Math.PI * shape.radius;
    case 'rectangle': return 2 * (shape.width + shape.height);
    case 'triangle':  return shape.a + shape.b + shape.c;
    default:          return assertNever(shape);
  }
}

export function describeShape(shape: Shape): string {
  switch (shape.kind) {
    case 'circle':    return `Circle with radius ${shape.radius}`;
    case 'rectangle': return `Rectangle ${shape.width}x${shape.height}`;
    case 'triangle':  return `Triangle with sides ${shape.a}, ${shape.b}, ${shape.c}`;
    default:          return assertNever(shape);
  }
}
```

## How exhaustive unions work

A discriminated union is an object union where every member has a shared literal field (`kind`) that uniquely identifies its variant. TypeScript narrows the entire object by checking that field. Exhaustiveness checking goes one step further: it turns a *missing branch* into a compile error, so the type system enforces that every variant is handled.

### `assertNever` — the exhaustiveness sentinel

```typescript
export function assertNever(value: never): never {
  throw new Error(`Unhandled variant: ${JSON.stringify(value)}`);
}
```

The function accepts `value: never`. `never` is TypeScript's way of saying "this value cannot exist". After a `switch` handles every variant of a union, the `default` branch is unreachable — TypeScript narrows `shape` to `never` there because all possibilities are exhausted. Passing `shape` to `assertNever` is valid precisely because `shape` is `never` at that point.

The error message includes the actual value via `JSON.stringify`. This matters at runtime: if a new variant slips through (e.g. data from an API), the error immediately tells you which value was unhandled instead of failing silently somewhere downstream.

### Why `return assertNever(shape)` and not just `throw new Error(...)`

Both have identical runtime behavior — `assertNever` always throws and the `return` is never reached. The difference is compile-time:

```typescript
// BROKEN — TypeScript checks nothing, always compiles
default: throw new Error('Unhandled shape');

// CORRECT — TypeScript verifies shape is never here
default: return assertNever(shape);
```

`throw new Error(...)` is a valid statement in any branch regardless of types — TypeScript doesn't check what you're throwing or whether the current value is `never`. Passing `shape` to `assertNever(value: never)` forces TypeScript to verify that `shape` is actually `never` at that point. If it isn't, the build fails.

### What happens when a new variant is added

This is the whole point of the pattern. Say you add `Square` to the union:

```typescript
type Square = { kind: 'square'; size: number };
type Shape = Circle | Rectangle | Triangle | Square;
```

Every function that uses `assertNever` now fails to compile until you add the missing case:

```typescript
export function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':    return Math.PI * shape.radius ** 2;
    case 'rectangle': return shape.width * shape.height;
    case 'triangle':  return 0.5 * shape.base * shape.height;
    default:          return assertNever(shape);
    // ✘ Argument of type 'Square' is not assignable to parameter of type 'never'
  }
}
```

TypeScript's reasoning: after handling `circle`, `rectangle`, and `triangle`, the remaining type in `default` is `Square` — not `never`. Passing a `Square` to a parameter typed `never` is a type error. The build refuses to compile until you handle it:

```typescript
case 'square': return shape.size ** 2;  // add this → default is never again ✓
```

The same error fires in `perimeter` and `describeShape` independently. You can't forget one.

With a plain `throw`, none of this happens — `Square` silently falls into the default at runtime and throws a generic error with no indication of what went wrong or where to fix it.

### Step-by-step trace

```
// Compile-time: all variants handled

switch (shape.kind) {        shape type at each point
  case 'circle':    ...  →   Circle  | Rectangle | Triangle   (entering switch)
  case 'rectangle': ...  →   Rectangle | Triangle             (after circle case)
  case 'triangle':  ...  →   Triangle                         (after rectangle case)
  default:                →   never ✓                         (all variants consumed)
    return assertNever(shape)  // shape: never → compiles ✓
}

// Compile-time: Square added, case missing

switch (shape.kind) {        shape type at each point
  case 'circle':    ...  →   Circle | Rectangle | Triangle | Square
  case 'rectangle': ...  →   Rectangle | Triangle | Square
  case 'triangle':  ...  →   Triangle | Square
  default:                →   Square  ← NOT never ✗
    return assertNever(shape)
    // ✘ Argument of type 'Square' is not assignable to parameter of type 'never'
}

// Runtime: assertNever reached (e.g. unexpected API data)
assertNever({ kind: 'square', size: 10 })
  → throws Error: 'Unhandled variant: {"kind":"square","size":10}'
```

## Mental model

Think of `assertNever` as a tripwire placed at the end of every corridor. When all corridors (variants) are covered, the tripwire sits in a corridor that TypeScript has sealed off — nothing can reach it, so it compiles fine. The moment you add a new corridor (variant) without covering it, TypeScript sees that something *can* reach the tripwire and refuses to let the code run. The tripwire doesn't do the checking — it's just positioned so that any gap makes it reachable.

- `Shape` union → the set of corridors
- `switch (shape.kind)` → covering each corridor
- `default: return assertNever(shape)` → the tripwire at the end
- `shape: never` → TypeScript confirming the corridor is sealed
- `shape: Square` → TypeScript warning the corridor is open
- `throw new Error(...)` without `assertNever` → a tripwire with no sensor — still dangerous at runtime, invisible at compile time
