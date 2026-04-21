# Type Narrowing - Solution

```typescript
export type Circle    = { kind: 'circle';    radius: number };
export type Rectangle = { kind: 'rectangle'; width: number; height: number };

export function formatId(id: string | number): string {
  if (typeof id === 'string') {
    return id.trim().toUpperCase();
  }
  return String(id).padStart(6, '0');
}

export function getLength(value: string | string[]): number {
  return value.length;
}

export function describeShape(shape: Circle | Rectangle): string {
  if (shape.kind === 'circle') {
    return `Circle with radius ${shape.radius}`;
  }
  return `Rectangle ${shape.width}x${shape.height}`;
}

export function processInput(input: string | null | undefined): string {
  if (typeof input === 'string') {
    input = input.trim();
  }
  if (!input) return '(empty)';
  return input;
}
```

## How each function works

### `formatId` — `typeof` guard on a primitive

```typescript
if (typeof id === 'string') {
  return id.trim().toUpperCase();
}
return String(id).padStart(6, '0');
```

`typeof` is the right tool for primitive unions (`string | number | boolean`). Inside the `if`, TypeScript narrows `id` to `string` and allows `.trim()` and `.toUpperCase()`. Below it, `id` is narrowed to `number`.

`padStart(6, '0')` pads the left side of the string with `'0'` characters until the total length is 6. It's the built-in version of a manual zero-padding loop.

### `getLength` — no narrowing needed

```typescript
return value.length;
```

Both `string` and `Array` have a `.length` property with the same semantics, so TypeScript permits it without any guard. This is worth noticing: narrowing is only necessary when the operation *differs* by branch. When both arms do the same thing, the guard is noise.

### `describeShape` — discriminated union

```typescript
if (shape.kind === 'circle') {
  return `Circle with radius ${shape.radius}`;
}
return `Rectangle ${shape.width}x${shape.height}`;
```

A discriminated union is an object union where every member carries a shared literal field (`kind` here) that uniquely identifies the variant. Checking `shape.kind === 'circle'` is enough for TypeScript to narrow the entire object — inside the branch, `shape.radius` is accessible; outside it, `shape.width` and `shape.height` are. No casts needed.

This pattern scales cleanly to many variants: add a `switch (shape.kind)` and TypeScript tracks which properties are available in each `case`. It also enables *exhaustiveness checking* — if you add a new variant and forget a branch, TypeScript will catch it.

### `processInput` — layered truthiness narrowing

```typescript
if (typeof input === 'string') {
  input = input.trim();
}
if (!input) return '(empty)';
return input;
```

This works in two passes:

1. **Trim first.** The `typeof` guard narrows `input` from `string | null | undefined` to `string`, allowing `.trim()`. After trimming, `input` is still typed `string` inside the block.
2. **Falsy check second.** `!input` catches `null`, `undefined`, and empty string `''` (the result of trimming a whitespace-only string) in one check. After the early return, TypeScript knows `input` is a non-empty `string`.

The key insight: trimming *before* the falsy check means `'   '` collapses to `''` and is correctly caught by `!input`. If you checked `!input` first, `'   '` would pass through as truthy and return without trimming.

## Narrowing techniques at a glance

| Technique | Used in | When to reach for it |
|---|---|---|
| `typeof x === 'string'` | `formatId`, `processInput` | Primitives: `string`, `number`, `boolean` |
| Discriminant field (`x.kind`) | `describeShape` | Object unions sharing a literal tag field |
| Truthiness (`!x`) | `processInput` | Ruling out `null`, `undefined`, or empty string together |
| No guard needed | `getLength` | Union members share the property or method being used |
