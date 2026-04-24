export type Circle = { kind: 'circle'; radius: number };
export type Rectangle = { kind: 'rectangle'; width: number; height: number };
export type Triangle = { kind: 'triangle'; a: number; b: number; c: number; base: number; height: number };

export type Shape = Circle | Rectangle | Triangle;

export function assertNever(value: never): never {
  throw new Error(`Unhandled variant: ${JSON.stringify(value)}`);
}

export function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':    return Math.PI * shape.radius ** 2;
    case 'rectangle': return shape.width * shape.height;
    case 'triangle':  return 0.5 * shape.base * shape.height;
    default:          return assertNever(shape);
  }
}

export function perimeter(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':    return 2 * Math.PI * shape.radius;
    case 'rectangle': return 2 * (shape.width + shape.height);
    case 'triangle':  return shape.a + shape.b + shape.c;
    default:          return assertNever(shape);
  }
}

export function describeShape(shape: Shape): string {
  switch (shape.kind) {
    case 'circle':    return `Circle with radius ${shape.radius}`;
    case 'rectangle': return `Rectangle ${shape.width}x${shape.height}`;
    case 'triangle':  return `Triangle with sides ${shape.a}, ${shape.b}, ${shape.c}`;
    default:          return assertNever(shape);
  }
}
