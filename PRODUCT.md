# Product

<!-- impeccable:product-schema 1 -->

## Platform

android

<!-- Material-everywhere cross-platform app (React Native + Expo, shipping to iOS and Android from one component set) — user chose ONE unified visual language across both OSes rather than per-OS adaptation. Material is the structural reference because it accommodates custom theming most readily; iOS still receives its own OS-level guarantees (safe-area insets, edge-swipe back, Reduce Motion, Dynamic Type scaling) per android.md's "Material-everywhere cross-platform app that also ships to iPhone still owes iOS its OS guarantees" rule. Load both ios.md and android.md before native design work. -->

## Stack

React Native + Expo + TypeScript + Expo Router (navigation), TanStack Query (server state), Zustand (UI/app state), React Hook Form + Zod (forms/validation). Mandated by the project's `.claude/CLAUDE.md` architecture rules, not an open decision — no framework interview needed.

## Users

Philippine MSME (micro/small/medium enterprise) owners — a coffee shop owner, a sari-sari store operator, a small online seller — most without legal or compliance staff. They open the app between running their business, not at a desk: short sessions, interruption-tolerant, often on a mid-range Android phone with inconsistent connectivity. Their job: understand what government/compliance requirements apply to their specific business, get documents organized, and track deadlines — without reading regulation text or hiring a consultant.

## Product Purpose

NegoSure explains and organizes Philippine government/compliance requirements for MSMEs, builds a personalized roadmap, and helps track documents, applications, and expiration dates. It exists because the requirement landscape is fragmented across agencies/LGUs and hard for a non-specialist owner to assemble alone. Success = the owner knows what applies to them, why, and what's next — without guessing.

## Positioning

NegoSure is explicitly **not** a government product and must never imply official status. Its mechanism: AI explains and assists, deterministic rules calculate known requirements (with source metadata — agency, document, effective date, last verified), and official government systems remain authoritative for actual records/status/approvals. A competing product that skips the deterministic-rules layer and lets an LLM freely assert regulatory outcomes could not truthfully make the same trust claim.

## Operating Context

Onboarding via natural-language business description ("I'm opening a small coffee shop in Dasmariñas") with progressive disclosure — only asking follow-up questions the AI couldn't already infer, and treating AI-extracted facts as unconfirmed until the user confirms them. Core loop: sign up → describe business → compliance roadmap → discover government services → scan/upload documents → validate against requirements → connect to official service where an authorized integration exists → track status → reminders → ask grounded AI questions with sources. Government integration is treated as a real ecosystem with per-service variability, not a generic REST API assumed to exist everywhere — some requirements route to an official portal link instead of an in-app status sync. App must work fully offline for read-heavy data (profile, roadmap, requirements, document metadata, recent assistant messages), with synchronization state always shown explicitly, never implied.

## Capabilities and Constraints

- LGU-agnostic by design: no specific city/province is a special case in rules or design (confirmed — no pilot-city scoping). Requirement rules carry jurisdiction metadata instead of being hardcoded to one locality.
- Unified visual language across iOS/Android (confirmed) — not adaptive per-OS, per Platform note above.
- No paid AI API required; must remain functional with local inference (Ollama) for development, Gemini/Groq free tiers as optional cloud paths — AI provider must stay swappable, never hard-coded to one vendor.
- Never invent an official application status, fee, or approval — those come only from a confirmed official integration or portal link.
- Never trust a client-supplied `userId` as identity proof; all business-owned data is tenant-scoped.

## Brand Commitments

Project name is **NegoSure**. No logo, color system, or visual identity confirmed yet — visual world is undecided going into design work (public search shows unrelated third-party uses of the name; no action needed for internal development, but no name change either — noted per `.claude/CLAUDE.md` §22).

## Evidence on Hand

None yet (confirmed fully greenfield) — no gathered regulatory source documents, permit checklists, real business content, testimonials, or brand assets exist. Any factual content used during design (fees, agency names, form numbers, requirement text) must be visibly placeholder-marked, never fabricated as real.

## Product Principles

1. AI explains; deterministic rules decide known requirements; official government systems remain the sole authority for records/status/approvals.
2. Never read as a government product — private, modern, calm, not bureaucratic (per `.claude/MOBILE_UI_STITCH.md` §1).
3. Progressive disclosure over exhaustive forms — ask only what isn't already known or inferable.
4. Offline-first for read-heavy data, with synchronization state always visible, never assumed complete.
5. LGU/jurisdiction variability is a first-class design constraint, not an edge case.

## Accessibility & Inclusion

No specific standard mandated beyond the project's own baseline mobile-accessibility rules: accessible labels, semantic roles, sufficient contrast, readable text, touch-friendly targets, and never color alone for status (`.claude/MOBILE_UI_STITCH.md` §16).
