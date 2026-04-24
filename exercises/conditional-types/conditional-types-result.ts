export type IsArray<T> = T extends any[] ? true : false;

export type ElementType<T> = T extends (infer E)[] ? E : never;

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export function flatten<T>(arr: T[][]): T[] {
  return arr.flat();
}

export function compact<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter((v): v is T => v != null);
}

export async function resolveAll<T>(values: (T | Promise<T>)[]): Promise<T[]> {
  return Promise.all(values.map(v => Promise.resolve(v)));
}
