# Utility Types

## The Problem

TypeScript ships with a set of built-in generic types that transform existing types into new ones. Instead of writing repetitive type definitions by hand, you compose these utilities to express exactly the shape you need.

## Real-World Context

You're building a user service. The same `User` record gets used in three different contexts: updating it (only some fields change at a time), sending it to the client (sensitive fields stripped), and rendering a config object (missing fields filled in with defaults). Rather than defining three separate types manually, you derive them from the canonical type using utility types.

## Your Task

The `User` and `Config` types are defined for you. Implement the following four functions.

### 1. `applyUpdate<T>(base: T, update: Partial<T>): T`

Merge `update` into `base` and return a new object. The original must not be mutated. Use `Partial<T>` to express that callers may pass any subset of fields.

### 2. `toPublicUser(user: User): Omit<User, 'email' | 'passwordHash'>`

Return a copy of `user` with `email` and `passwordHash` removed. Use `Omit` in the return type so TypeScript knows exactly which fields are present.

### 3. `withDefaults(config: Partial<Config>): Required<Config>`

Fill in any missing fields from `DEFAULTS` and return a complete config. The return type is `Required<Config>` — every field is guaranteed present.

### 4. `memoize<T extends (...args: unknown[]) => unknown>(fn: T): T`

Return a version of `fn` that caches results by serialized arguments. Repeated calls with the same arguments return the cached value without re-invoking `fn`. Use `Parameters<T>` and `ReturnType<T>` internally to preserve the original function's signature.

## Key Utility Types

| Utility | What it produces |
|---|---|
| `Partial<T>` | All properties of `T` become optional |
| `Required<T>` | All properties of `T` become required |
| `Omit<T, K>` | `T` without the keys listed in `K` |
| `Pick<T, K>` | Only the keys listed in `K` from `T` |
| `Parameters<T>` | Tuple of parameter types of function `T` |
| `ReturnType<T>` | Return type of function `T` |
