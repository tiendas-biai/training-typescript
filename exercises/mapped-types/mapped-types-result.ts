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
