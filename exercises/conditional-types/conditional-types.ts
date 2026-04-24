// true if T is an array, false otherwise.
// TODO: replace `any` with your conditional type
export type IsArray<T> =  T extends any[]?true:false;

// The element type of array T, or never if T is not an array.
// Hint: use `infer`
// TODO: replace `any` with your conditional type
export type ElementType<T> = T extends (infer U)[]? U:never;

// If T is Promise<U>, resolve to U. Otherwise resolve to T.
// Hint: use `infer`
// TODO: replace `any` with your conditional type
export type UnwrapPromise<T> = T extends Promise<infer U>?U:T

// Flatten one level of nesting: T[][] → T[]
export function flatten<T>(arr: T[][]): T[] {
  return arr.flat()
}

// Remove null and undefined entries from the array.
export function compact<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter(value=>value) as T[];
}

// Resolve every entry: plain values pass through, promises are awaited.
export async function resolveAll<T>(values: (T | Promise<T>)[]): Promise<T[]> {
  let promises = [];
  for (let i=0; i<values.length; i++){
   let promise = await values[i];
   promises.push(promise);
  }
  return promises;
}
