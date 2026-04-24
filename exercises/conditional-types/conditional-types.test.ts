import { flatten, compact, resolveAll } from './conditional-types';

describe('flatten', () => {
  it('flattens one level of nesting', () => {
    expect(flatten([[1, 2], [3, 4], [5]])).toEqual([1, 2, 3, 4, 5]);
  });

  it('returns an empty array for empty input', () => {
    expect(flatten([])).toEqual([]);
  });

  it('handles inner empty arrays', () => {
    expect(flatten([[1], [], [2, 3]])).toEqual([1, 2, 3]);
  });
});

describe('compact', () => {
  it('removes null and undefined entries', () => {
    expect(compact([1, null, 2, undefined, 3])).toEqual([1, 2, 3]);
  });

  it('returns an empty array when all entries are null or undefined', () => {
    expect(compact([null, undefined, null])).toEqual([]);
  });

  it('returns the original values when there is nothing to remove', () => {
    expect(compact(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
  });
});

describe('resolveAll', () => {
  it('passes plain values through', async () => {
    await expect(resolveAll([1, 2, 3])).resolves.toEqual([1, 2, 3]);
  });

  it('awaits promises', async () => {
    await expect(
      resolveAll([Promise.resolve(1), Promise.resolve(2)])
    ).resolves.toEqual([1, 2]);
  });

  it('handles a mix of plain values and promises', async () => {
    await expect(
      resolveAll([1, Promise.resolve(2), 3, Promise.resolve(4)])
    ).resolves.toEqual([1, 2, 3, 4]);
  });

  it('preserves order', async () => {
    const slow = new Promise<number>((r) => setTimeout(() => r(1), 50));
    const fast = Promise.resolve(2);
    await expect(resolveAll([slow, fast])).resolves.toEqual([1, 2]);
  });
});
