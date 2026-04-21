export type Circle = { kind: 'circle'; radius: number };
export type Rectangle = { kind: 'rectangle'; width: number; height: number };

// Return id zero-padded to 6 digits if number, or trimmed+uppercased if string.
export function formatId(id: string | number): string {
  if (typeof id === 'string') {
    return id.trim().toUpperCase()
  }
  return String(id).padStart(6, '0');
}

// Return character count for a string, element count for an array.
export function getLength(value: string | string[]): number {
  return value.length;
}

// Use the `kind` discriminant to describe the shape.
export function describeShape(shape: Circle | Rectangle): string {
  if (shape.kind === 'circle') {
    return `Circle with radius ${shape.radius}`
  }
  return `Rectangle ${shape.width}x${shape.height}`
}

// Return the trimmed string, or "(empty)" for null/undefined/blank.
export function processInput(input: string | null | undefined): string {
  if (typeof input === "string") {
    input = input.trim();
  }
  if (!input) return '(empty)'
  return input;
}
