// Schibsted Grotesk — chosen over Space Grotesk after the impeccable design
// hook flagged the latter as overused. See /DESIGN.md.
export const fontFamily = {
  regular: "SchibstedGrotesk_400Regular",
  medium: "SchibstedGrotesk_500Medium",
  semibold: "SchibstedGrotesk_600SemiBold",
  bold: "SchibstedGrotesk_700Bold",
} as const;

export const fontSize = {
  xs: 10,
  sm: 11,
  base: 12.5,
  md: 13.5,
  lg: 14,
  xl: 18,
  xxl: 21,
  display: 26,
} as const;

export type FontFamilyToken = keyof typeof fontFamily;
export type FontSizeToken = keyof typeof fontSize;
