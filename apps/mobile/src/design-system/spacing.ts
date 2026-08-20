// Base unit 4px, multiples only. See /DESIGN.md.
export const spacing = {
  screenX: 22,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  xxl: 26,
} as const;

export type SpacingToken = keyof typeof spacing;
