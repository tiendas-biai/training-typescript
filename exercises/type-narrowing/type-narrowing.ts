export type Circle    = { kind: 'circle';    radius: number };
export type Rectangle = { kind: 'rectangle'; width: number; height: number };

// Return id zero-padded to 6 digits if number, or trimmed+uppercased if string.
export function formatId(id: string | number): string {
  // TODO
  throw new Error('Not implemented');
}

// Return character count for a string, element count for an array.
export function getLength(value: string | string[]): number {
  // TODO
  throw new Error('Not implemented');
}

// Use the `kind` discriminant to describe the shape.
export function describeShape(shape: Circle | Rectangle): string {
  // TODO
  throw new Error('Not implemented');
}

// Return the trimmed string, or "(empty)" for null/undefined/blank.
export function processInput(input: string | null | undefined): string {
  // TODO
  throw new Error('Not implemented');
}
