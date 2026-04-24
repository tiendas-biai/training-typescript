import { applyUpdate, toPublicUser, withDefaults, memoize, User } from './utility-types';

describe('applyUpdate', () => {
  it('merges partial fields into the base object', () => {
    const user = { id: 1, name: 'Alice', age: 30 };
    expect(applyUpdate(user, { name: 'Bob' })).toEqual({ id: 1, name: 'Bob', age: 30 });
  });

  it('does not mutate the original object', () => {
    const user = { id: 1, name: 'Alice', age: 30 };
    applyUpdate(user, { name: 'Bob' });
    expect(user.name).toBe('Alice');
  });

  it('applies multiple fields at once', () => {
    const cfg = { host: 'localhost', port: 3000 };
    expect(applyUpdate(cfg, { host: 'example.com', port: 8080 })).toEqual({
      host: 'example.com',
      port: 8080,
    });
  });
});

describe('toPublicUser', () => {
  const user: User = {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    passwordHash: 'abc123',
    role: 'admin',
  };

  it('includes safe fields', () => {
    expect(toPublicUser(user)).toMatchObject({ id: 1, name: 'Alice', role: 'admin' });
  });

  it('strips email and passwordHash', () => {
    const result = toPublicUser(user);
    expect(result).not.toHaveProperty('email');
    expect(result).not.toHaveProperty('passwordHash');
  });
});

describe('withDefaults', () => {
  it('fills in all missing fields with defaults', () => {
    expect(withDefaults({})).toEqual({ host: 'localhost', port: 3000, timeout: 5000, retries: 3 });
  });

  it('preserves fields that are provided', () => {
    expect(withDefaults({ host: 'example.com', port: 8080 })).toEqual({
      host: 'example.com',
      port: 8080,
      timeout: 5000,
      retries: 3,
    });
  });
});

describe('memoize', () => {
  it('returns the correct result', () => {
    const double = memoize((n: number) => n * 2);
    expect(double(5)).toBe(10);
  });

  it('calls the original function only once for the same arguments', () => {
    const fn = jest.fn((a: number, b: number) => a + b);
    const memoized = memoize(fn);
    memoized(1, 2);
    memoized(1, 2);
    memoized(1, 2);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('calls the original function again for different arguments', () => {
    const fn = jest.fn((n: number) => n * 2);
    const memoized = memoize(fn);
    memoized(1);
    memoized(2);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
