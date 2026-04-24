# Exhaustive Discriminated Unions

## The Problem

Discriminated unions let TypeScript narrow an object to the right variant by checking a shared literal field. But narrowing alone doesn't protect you when the union *grows*. If you add a new variant and forget to handle it in a function, the code silently falls through to a default. Exhaustiveness checking fixes this: by routing unhandled cases to a `never` parameter, TypeScript turns the missing branch into a compile error.

## Real-World Context

You're adding a `Triangle` to an existing `Shape` union that already has `Circle` and `Rectangle`. Every function that pattern-matches on `Shape` must be updated — `area`, `perimeter`, and `describeShape`. Without exhaustiveness checking, TypeScript won't warn you about the gap. With it, each function becomes a compile-time guarantee that all variants are handled.

## Your Task

The `Shape` union and its three variants are defined for you.

### 1. `assertNever(value: never): never`

The exhaustiveness sentinel. Call it in the `default` branch of a `switch` (or the final `else`). If every variant is handled, `value` is correctly typed `never` and the call compiles. If a variant is missing, TypeScript will error here with "Argument of type 'X' is not assignable to parameter of type 'never'".

At runtime, `assertNever` should throw — it's evidence that a new variant was added without updating the function.

### 2. `area(shape: Shape): number`

Return the area of the shape:
- Circle: `π × r²`
- Rectangle: `width × height`
- Triangle: `0.5 × base × height`

Use `assertNever` in the default case.

### 3. `perimeter(shape: Shape): number`

Return the perimeter:
- Circle: `2 × π × r`
- Rectangle: `2 × (width + height)`
- Triangle: `a + b + c` (all three sides are provided)

Use `assertNever` in the default case.

### 4. `describeShape(shape: Shape): string`

Return a human-readable description:
- Circle: `"Circle with radius <r>"`
- Rectangle: `"Rectangle <w>x<h>"`
- Triangle: `"Triangle with sides <a>, <b>, <c>"`

Use `assertNever` in the default case.

## Key Concepts

| Concept | What it gives you |
|---|---|
| `switch (shape.kind)` | Narrows `shape` to the correct variant in each `case` |
| `assertNever(value: never)` | Compile error when a variant is unhandled |
| `never` return type | Signals a code path that must not be reached |
| Exhaustiveness | Adding a new union variant breaks the build until all functions are updated |

## The `never` trick explained

After a `switch` handles every variant:

```ts
switch (shape.kind) {
  case 'circle':     return ...;
  case 'rectangle':  return ...;
  case 'triangle':   return ...;
  default:           return assertNever(shape); // shape: never here
}
```

TypeScript knows `shape` can only be `Circle | Rectangle | Triangle`. Once all three are handled, the `default` branch is unreachable — `shape` is `never`. If you add `type Ellipse` to `Shape` but forget the `case 'ellipse'` branch, `shape` in `default` is `Ellipse`, not `never`, and TypeScript errors on `assertNever(shape)`.
