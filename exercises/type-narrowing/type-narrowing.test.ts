import { formatId, getLength, describeShape, processInput } from './type-narrowing';

describe('formatId', () => {
  it('zero-pads a number to 6 digits', () => {
    expect(formatId(42)).toBe('000042');
    expect(formatId(1000)).toBe('001000');
    expect(formatId(123456)).toBe('123456');
  });

  it('trims and uppercases a string', () => {
    expect(formatId('  hello  ')).toBe('HELLO');
    expect(formatId('abc')).toBe('ABC');
  });
});

describe('getLength', () => {
  it('returns character count for a string', () => {
    expect(getLength('hello')).toBe(5);
    expect(getLength('')).toBe(0);
  });

  it('returns element count for an array', () => {
    expect(getLength(['a', 'b', 'c'])).toBe(3);
    expect(getLength([])).toBe(0);
  });
});

describe('describeShape', () => {
  it('describes a circle', () => {
    expect(describeShape({ kind: 'circle', radius: 5 })).toBe('Circle with radius 5');
  });

  it('describes a rectangle', () => {
    expect(describeShape({ kind: 'rectangle', width: 4, height: 7 })).toBe('Rectangle 4x7');
  });
});

describe('processInput', () => {
  it('returns trimmed string for valid input', () => {
    expect(processInput('  hello  ')).toBe('hello');
    expect(processInput('world')).toBe('world');
  });

  it('returns "(empty)" for null, undefined, or blank strings', () => {
    expect(processInput(null)).toBe('(empty)');
    expect(processInput(undefined)).toBe('(empty)');
    expect(processInput('')).toBe('(empty)');
    expect(processInput('   ')).toBe('(empty)');
  });
});
