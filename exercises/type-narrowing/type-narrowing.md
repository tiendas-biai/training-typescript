# Type Narrowing

## The Problem

TypeScript knows the *declared* type of a variable, but inside conditional branches it can narrow that type to something more specific. Narrowing lets you write code that is both safe and precise — no unnecessary casts, no runtime surprises.

## Real-World Context

You receive data from an external source (an API, user input, a config file). The value might be a string, a number, `null`, or a custom object. Before you operate on it you need to tell TypeScript which branch you're in, so it allows only the operations valid for that specific type.

## Your Task

Implement the following four functions. Each one accepts a union type and must return a result that requires narrowing to the correct branch.

### 1. `formatId(id: string | number): string`

- If `id` is a number, return it zero-padded to 6 digits (e.g. `42` → `"000042"`).
- If `id` is a string, return it trimmed and uppercased.

### 2. `getLength(value: string | string[]): number`

- If `value` is a string, return its character count.
- If `value` is an array, return its element count.

### 3. `describeShape(shape: Circle | Rectangle): string`

Use the discriminated-union pattern. The types are already defined for you:

```ts
type Circle    = { kind: 'circle';    radius: number };
type Rectangle = { kind: 'rectangle'; width: number; height: number };
```

- For a circle, return `"Circle with radius <r>"`.
- For a rectangle, return `"Rectangle <w>x<h>"`.

### 4. `processInput(input: string | null | undefined): string`

- If `input` is a non-empty string, return it trimmed.
- Otherwise (null, undefined, or empty/whitespace-only string), return `"(empty)"`.

## Key Concepts

| Technique | When to use |
|---|---|
| `typeof` guard | Primitives: `string`, `number`, `boolean`, … |
| `Array.isArray()` | Distinguish arrays from other objects/strings |
| Discriminated union (`shape.kind`) | Objects that share a literal `kind` / `type` field |
| Truthiness / nullish check | Ruling out `null`, `undefined`, or empty values |
