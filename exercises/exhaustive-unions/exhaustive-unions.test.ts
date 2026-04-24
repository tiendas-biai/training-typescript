import { area, perimeter, describeShape, assertNever, Shape } from './exhaustive-unions';

describe('assertNever', () => {
  it('throws an Error instance', () => {
    expect(() => assertNever('unexpected' as never)).toThrow(Error);
  });

  it('includes the unhandled value in the error message', () => {
    expect(() => assertNever('unexpected' as never)).toThrow('unexpected');
  });
});

describe('area', () => {
  it('computes the area of a circle', () => {
    expect(area({ kind: 'circle', radius: 5 })).toBeCloseTo(Math.PI * 25);
  });

  it('computes the area of a rectangle', () => {
    expect(area({ kind: 'rectangle', width: 4, height: 6 })).toBe(24);
  });

  it('computes the area of a triangle', () => {
    expect(area({ kind: 'triangle', a: 3, b: 4, c: 5, base: 4, height: 3 })).toBe(6);
  });
});

describe('perimeter', () => {
  it('computes the perimeter of a circle', () => {
    expect(perimeter({ kind: 'circle', radius: 5 })).toBeCloseTo(2 * Math.PI * 5);
  });

  it('computes the perimeter of a rectangle', () => {
    expect(perimeter({ kind: 'rectangle', width: 4, height: 6 })).toBe(20);
  });

  it('computes the perimeter of a triangle', () => {
    expect(perimeter({ kind: 'triangle', a: 3, b: 4, c: 5, base: 4, height: 3 })).toBe(12);
  });
});

describe('describe', () => {
  it('describes a circle', () => {
    expect(describeShape({ kind: 'circle', radius: 7 })).toBe('Circle with radius 7');
  });

  it('describes a rectangle', () => {
    expect(describeShape({ kind: 'rectangle', width: 3, height: 9 })).toBe('Rectangle 3x9');
  });

  it('describes a triangle', () => {
    expect(describeShape({ kind: 'triangle', a: 3, b: 4, c: 5, base: 4, height: 3 })).toBe(
      'Triangle with sides 3, 4, 5'
    );
  });
});
