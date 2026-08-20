// Sari-sari ledger world — see /DESIGN.md at the repo root.
// Hex values are sRGB approximations of the mock's oklch tokens
// (design/mocks/home-ledger, design/mocks/requirements-ledger);
// React Native's style engine does not accept oklch().
export const colors = {
  paper: "#F7F5F1",
  paperRaised: "#FBFAF8",
  line: "#CBD0DD",
  lineStrong: "#9AA1B8",
  ink: "#232A45",
  inkSoft: "#4B5273",
  inkFaint: "#6C7292",
  // Reserved exclusively for unsettled/urgent entries — never decorative.
  red: "#C23B2A",
  redSoft: "#F6E4DF",
  // Verified/official mark ink — matches real PH office rubber-stamp ink color.
  stamp: "#4E3E70",
  stampSoft: "#ECE6F5",
} as const;

export type ColorToken = keyof typeof colors;
