import { identity, first, zip, pick } from './generics';

describe('identity', () => {
  it('returns the value unchanged', () => {
    expect(identity(42)).toBe(42);
    expect(identity('hello')).toBe('hello');
    expect(identity(true)).toBe(true);
  });

  it('preserves object reference', () => {
    const obj = { a: 1 };
    expect(identity(obj)).toBe(obj);
  });
});

describe('first', () => {
  it('returns the first element of a non-empty array', () => {
    expect(first([1, 2, 3])).toBe(1);
    expect(first(['a', 'b'])).toBe('a');
  });

  it('returns undefined for an empty array', () => {
    expect(first([])).toBeUndefined();
  });
});

describe('zip', () => {
  it('pairs elements from two equal-length arrays', () => {
    expect(zip([1, 2, 3], ['a', 'b', 'c'])).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  });

  it('stops at the shorter array', () => {
    expect(zip([1, 2], ['a', 'b', 'c'])).toEqual([[1, 'a'], [2, 'b']]);
    expect(zip([1, 2, 3], ['a'])).toEqual([[1, 'a']]);
  });

  it('returns an empty array when either input is empty', () => {
    expect(zip([], [1, 2, 3])).toEqual([]);
    expect(zip([1, 2, 3], [])).toEqual([]);
  });
});

describe('pick', () => {
  const user = { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 };

  it('returns an object with only the specified keys', () => {
    expect(pick(user, ['id', 'name'])).toEqual({ id: 1, name: 'Alice' });
  });

  it('works with a single key', () => {
    expect(pick(user, ['email'])).toEqual({ email: 'alice@example.com' });
  });

  it('returns an empty object when no keys are specified', () => {
    expect(pick(user, [])).toEqual({});
  });

  it('does not include keys that were not picked', () => {
    const result = pick(user, ['id', 'name']);
    expect(result).not.toHaveProperty('email');
    expect(result).not.toHaveProperty('age');
  });
});
