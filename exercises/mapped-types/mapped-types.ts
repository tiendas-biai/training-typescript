// Every property of T becomes T[K] | null.
// TODO: replace `any` with your mapped type
export type Nullable<T> = any;

// Every property value of T becomes string.
// TODO: replace `any` with your mapped type
export type Stringified<T> = any;

// Return a new object with every value set to null.
export function nullify<T extends object>(obj: T): Nullable<T> {
  // TODO
  throw new Error('Not implemented');
}

// Return a new object with every value converted to string via String().
export function stringifyValues<T extends object>(obj: T): Stringified<T> {
  // TODO
  throw new Error('Not implemented');
}

// Return a new object with the same keys, each value transformed by fn.
export function mapValues<T extends object, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => U
): { [K in keyof T]: U } {
  // TODO
  throw new Error('Not implemented');
}
