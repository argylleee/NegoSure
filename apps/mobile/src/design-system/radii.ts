export const radii = {
  sm: 3,
  md: 4,
} as const;

export type RadiusToken = keyof typeof radii;
