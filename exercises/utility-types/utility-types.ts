export type User = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
};

export type Config = {
  host: string;
  port: number;
  timeout: number;
  retries: number;
};

export const DEFAULTS: Required<Config> = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
  retries: 3,
};

// Merge update into base and return a new object without mutating base.
export function applyUpdate<T>(base: T, update: Partial<T>): T {
  // TODO
  throw new Error('Not implemented');
}

// Return user without email and passwordHash.
export function toPublicUser(user: User): Omit<User, 'email' | 'passwordHash'> {
  // TODO
  throw new Error('Not implemented');
}

// Return config with any missing fields filled in from DEFAULTS.
export function withDefaults(config: Partial<Config>): Required<Config> {
  // TODO
  throw new Error('Not implemented');
}

// Return a memoized version of fn: cache results by serialized arguments.
export function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  // TODO
  throw new Error('Not implemented');
}
