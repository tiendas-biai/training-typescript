// Return the value unchanged, preserving its type.
export function identity<T>(value: T): T {
  return value;
}

// Return the first element of the array, or undefined if empty.
export function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Pair up elements from two arrays by index, stopping at the shorter length.
export function zip<A, B>(as: A[], bs: B[]): [A, B][] {
  const minLength = Math.min(as.length, bs.length);
  return Array.from({ length: minLength }, (_, i) => [as[i], bs[i]]);
}

// Return a new object with only the specified keys from obj.
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = Object.fromEntries(keys.map(key => [key, obj[key]]));
  return result as Pick<T, K>;
}
