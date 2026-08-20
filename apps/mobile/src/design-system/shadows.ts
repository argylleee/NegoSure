// Depth strategy for the ledger world: borders only, no shadows.
// This module exists so the design-system file list stays complete and any
// future world-change has a single place to add elevation — do not add ad
// hoc shadows to components while this world is committed. See /DESIGN.md.
export const shadows = {
  none: {},
} as const;

export type ShadowToken = keyof typeof shadows;
