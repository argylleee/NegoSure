export type BusinessFact = {
  key: string;
  label: string;
  value: string;
  confirmed: boolean;
};

// PLACEHOLDER heuristic — not real extraction. Must be replaced by the AI
// orchestration service (AIService.generateStructured, per
// .claude/CLAUDE.md §10). Every fact it produces is unconfirmed by
// default; nothing here may feed the requirement engine until the user
// confirms it. See §6: "facts used for regulatory decisions must be
// confirmed or represented as uncertain until confirmed."
export function extractBusinessFacts(description: string): BusinessFact[] {
  const lower = description.toLowerCase();

  const businessType = lower.includes("coffee")
    ? "Coffee shop"
    : lower.includes("sari-sari") || lower.includes("sari sari")
      ? "Sari-sari store"
      : lower.includes("restaurant") || lower.includes("resto")
        ? "Restaurant"
        : lower.includes("online")
          ? "Online seller"
          : "General retail";

  const locationMatch = description.match(/in ([A-Za-zÀ-ÿ,\s]+?)[.!]?$/i);
  const location = locationMatch ? locationMatch[1].trim() : "Not specified";

  return [
    { key: "businessType", label: "Business type", value: businessType, confirmed: false },
    { key: "location", label: "Location", value: location, confirmed: false },
  ];
}
