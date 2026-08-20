// Placeholder data — replace with the requirements-engine service
// (deterministic rules + source metadata, per .claude/CLAUDE.md §7).
// Shared by the Requirements list and the requirement/gov-service detail
// screens so there's one source of truth instead of duplicated arrays.
export type RequirementStatus =
  "NOT_STARTED" | "IN_PROGRESS" | "READY" | "SUBMITTED" | "COMPLETED" | "ACTION_REQUIRED";

export type GovService = {
  available: boolean;
  provider?: string;
  statusSyncedLabel?: string;
  portalOnly?: boolean;
};

export type Requirement = {
  id: string;
  title: string;
  reason: string;
  source: string;
  status: RequirementStatus;
  documentRequirement: string;
  govService: GovService;
  /** Shown on Home's Needs Attention row for ACTION_REQUIRED items only —
   * urgency, not applicability (that's `reason`). */
  urgencyNote?: string;
};

export const requirements: Requirement[] = [
  {
    id: "fire-safety",
    title: "Fire Safety Inspection Certificate",
    reason: "Applies — you prepare food on-site",
    source: "BFP",
    status: "ACTION_REQUIRED",
    urgencyNote: "Expires in 12 days",
    documentRequirement: "Valid Fire Safety Inspection Certificate (FSIC), renewed annually",
    govService: {
      available: true,
      provider: "eLGU",
      statusSyncedLabel: "2 hours ago",
    },
  },
  {
    id: "sanitary-permit",
    title: "Sanitary Permit",
    reason: "Applies — food & beverage business",
    source: "City Health Office",
    status: "IN_PROGRESS",
    documentRequirement: "Sanitary permit application + health certificates for food handlers",
    govService: {
      available: false,
      portalOnly: true,
    },
  },
  {
    id: "business-permit",
    title: "Business Permit Renewal",
    reason: "Applies — annual requirement",
    source: "LGU Dasmariñas",
    status: "SUBMITTED",
    documentRequirement: "Renewed Mayor's Permit / Business Permit",
    govService: {
      available: true,
      provider: "eLGU",
      statusSyncedLabel: "45 minutes ago",
    },
  },
  {
    id: "bir-registration",
    title: "BIR Certificate of Registration",
    reason: "Applies — all registered businesses",
    source: "BIR",
    status: "COMPLETED",
    documentRequirement: "BIR Form 2303, posted on-site",
    govService: {
      available: false,
      portalOnly: true,
    },
  },
];

export function getRequirementById(id: string): Requirement | undefined {
  return requirements.find((r) => r.id === id);
}
