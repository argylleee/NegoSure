// Placeholder data — replace with the government-integration service's
// application/status synchronization model (per .claude/CLAUDE.md §8).
// Never invent a status here in production; this shape is what a real
// synced application record must satisfy.
export type ApplicationEvent = {
  label: string;
  dateLabel: string;
  done: boolean;
};

export type Application = {
  requirementId: string;
  provider: string;
  referenceNumber: string;
  events: ApplicationEvent[];
};

export const applications: Record<string, Application> = {
  "business-permit": {
    requirementId: "business-permit",
    provider: "eLGU",
    referenceNumber: "ELG-2026-004821",
    events: [
      { label: "Application submitted", dateLabel: "Aug 18", done: true },
      { label: "Received by LGU Dasmariñas", dateLabel: "Aug 18", done: true },
      { label: "Under review", dateLabel: "Aug 19", done: true },
      { label: "Approved", dateLabel: "Pending", done: false },
      { label: "Permit released", dateLabel: "Pending", done: false },
    ],
  },
};

export function getApplicationByRequirementId(id: string): Application | undefined {
  return applications[id];
}
