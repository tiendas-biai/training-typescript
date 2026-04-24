import { nullify, stringifyValues, mapValues } from './mapped-types';

describe('nullify', () => {
  it('sets every value to null', () => {
    expect(nullify({ id: 1, name: 'Alice', active: true })).toEqual({
      id: null,
      name: null,
      active: null,
    });
  });

  it('preserves all keys', () => {
    const result = nullify({ a: 1, b: 2, c: 3 });
    expect(Object.keys(result)).toEqual(['a', 'b', 'c']);
  });

  it('does not mutate the original object', () => {
    const obj = { x: 42 };
    nullify(obj);
    expect(obj.x).toBe(42);
  });
});

describe('stringifyValues', () => {
  it('converts every value to a string', () => {
    expect(stringifyValues({ id: 1, active: true, score: 9.5 })).toEqual({
      id: '1',
      active: 'true',
      score: '9.5',
    });
  });

  it('preserves all keys', () => {
    const result = stringifyValues({ a: 1, b: 2 });
    expect(Object.keys(result)).toEqual(['a', 'b']);
  });
});

describe('mapValues', () => {
  it('transforms each value with the provided function', () => {
    expect(mapValues({ a: 1, b: 2, c: 3 }, (v) => v * 10)).toEqual({
      a: 10,
      b: 20,
      c: 30,
    });
  });

  it('passes the key as the second argument to fn', () => {
    const keys: string[] = [];
    mapValues({ x: 1, y: 2 }, (_v, k) => { keys.push(k as string); return k; });
    expect(keys).toEqual(['x', 'y']);
  });

  it('does not mutate the original object', () => {
    const obj = { a: 1, b: 2 };
    mapValues(obj, (v) => v + 100);
    expect(obj).toEqual({ a: 1, b: 2 });
  });
});
