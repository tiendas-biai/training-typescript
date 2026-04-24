// Every property of T becomes T[K] | null.
// TODO: replace `any` with your mapped type
export type Nullable<T> = { [K in keyof T]: T[K] | null }

// Every property value of T becomes string.
// TODO: replace `any` with your mapped type
export type Stringified<T> = { [K in keyof T]: string };

// Return a new object with every value set to null.
export function nullify<T extends object>(obj: T): Nullable<T> {
  let result = {} as Nullable<T>;
  for (const key in obj) {
    result[key] = null
  }
  return result;
}

// Return a new object with every value converted to string via String().
export function stringifyValues<T extends object>(obj: T): Stringified<T> {
  let result = {} as Stringified<T>;
  for (const key in obj) {
    result[key] = String(obj[key]);
  }
  return result;
}

// Return a new object with the same keys, each value transformed by fn.
export function mapValues<T extends object, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => U
): { [K in keyof T]: U } {
  let result = {} as { [K in keyof T]: U };
  for (const key in obj) {
    result[key] = fn(obj[key], key);
  }
  return result;
}
