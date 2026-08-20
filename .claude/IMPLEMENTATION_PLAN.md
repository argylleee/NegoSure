# NegoSure — Implementation Roadmap

## Phase 0 — Product and Architecture

Deliver:

- repository initialized — done (`git init`; no commit made yet, that's a separate explicit ask)
- CLAUDE.md installed — done
- `.claude/skills/` configured — done (`impeccable`)
- monorepo structure — done (pnpm workspace: `apps/mobile`, `services/api`, `packages/*` — the latter two are still empty stubs)
- architecture document — done (`.claude/ARCHITECTURE.md`)
- environment-variable template — done (`apps/mobile/.env.example` — client-safe `EXPO_PUBLIC_*` only; `services/api/.env.example` — forward-looking, no backend code yet)
- linting — done (`expo lint` / `eslint-config-expo` in `apps/mobile`, root `pnpm lint`)
- formatting — done (Prettier at the root, `.prettierrc.json` / `.prettierignore`, root `pnpm format` / `format:check`)
- TypeScript — done (`apps/mobile/tsconfig.json`, root `pnpm typecheck`)
- CI checks — done (`.github/workflows/ci.yml`: format check, lint, typecheck on push/PR to `main`; no test step yet — no tests exist)

Phase 0 is now complete except that no commit/remote exists yet, and there is still no test suite for CI to run.

## Phase 1 — Design System + Direct Mocks

Create:

- color tokens
- typography
- spacing
- radii
- shadows
- shared components

Mock each screen directly via the `impeccable` + `design` skills, inside the world committed in `DESIGN.md` (currently: sari-sari ledger world — see `DESIGN.md`). As of the real RN build starting (`apps/mobile`), new screens are implemented directly in code against the design-system tokens rather than mocked first — see `apps/mobile`'s screens for the current reference implementation instead of `design/mocks/`.

1. welcome — done, implemented (`apps/mobile/app/(auth)/welcome.tsx`)
2. authentication — done, implemented (`apps/mobile/app/(auth)/sign-in.tsx`, `sign-up.tsx`), RHF + Zod validated, backed by a placeholder in-memory Zustand session — no real Supabase Auth yet
3. onboarding — done, implemented (`apps/mobile/app/(onboarding)/describe.tsx`, `confirm.tsx`, `summary.tsx`), fact extraction is a placeholder string-matching heuristic (`src/lib/extractBusinessFacts.ts`), not real AI — every extracted fact is unconfirmed until the user taps to confirm it, per §6
4. home dashboard — done, implemented (`apps/mobile/app/(tabs)/index.tsx`)
5. requirements — done, implemented (`apps/mobile/app/(tabs)/requirements.tsx`)
6. documents — done, implemented (`apps/mobile/app/(tabs)/documents.tsx`), placeholder data only
7. assistant — done, implemented (`apps/mobile/app/(tabs)/assistant.tsx`), placeholder data only, not wired to AIService yet
8. profile/settings — done, implemented (`apps/mobile/app/(tabs)/profile.tsx`), placeholder data, no real settings screens behind it
9. application tracking — done, implemented (`apps/mobile/app/applications/[id].tsx`), placeholder timeline data (`src/data/applications.ts`), reached from the requirement detail screen when an application record exists
10. government service detail — done, implemented (`apps/mobile/app/requirements/[id].tsx`), labeling follows §5 exactly ("Official government service" + provider/sync time, or "Official portal / No direct NegoSure integration")

All 10 Phase 1 screens now have a UI implementation. Every screen still runs on placeholder data — see `src/data/requirements.ts` and `src/data/applications.ts`, the shared placeholder sources Home/Requirements/detail screens all read from instead of each keeping its own copy. None of these are backed by a real service yet (Phase 2+).

Claude Code should build the designs using the NegoSure design system, not carry mock markup into production code verbatim.

## Phase 2 — Authentication

Implement:

- sign up
- sign in
- sign out
- session restoration
- password reset
- Google/Apple auth where practical
- protected routes

Tests:

- valid login
- invalid login
- expired session
- unauthorized API request

## Phase 3 — Business Onboarding

Implement:

- business creation
- business profile
- location/jurisdiction
- onboarding questions
- confirmation of AI-extracted facts

Do not let AI write final regulatory attributes without validation/confirmation.

## Phase 4 — Requirement Engine

Implement:

- requirement definitions
- business requirement records
- deterministic rules
- source metadata
- requirement statuses
- progress calculation

Start with a limited, well-verified set of business scenarios instead of pretending to cover every Philippine business.

Suggested initial scenario:

- small food/beverage establishment

Initial jurisdiction:

- one selected LGU/city/municipality

Expand only after the rules are verified.

## Phase 5 — Government Service Catalog

Build the abstraction first:

```text
GovernmentProvider
GovernmentService
GovernmentApplication
```

Implement:

- service discovery
- official portal links
- integration availability indicator
- provider metadata

Do not implement undocumented live endpoints.

## Phase 6 — eGovPH/eLGU Integration

Only after official integration access is verified:

Implement one high-value authorized workflow first, such as:

- business permit service discovery
- application initiation
- status tracking

Prefer one complete integration over many fake/partial integrations.

Add:

- credentials
- secure secrets
- adapter
- normalization
- retries
- rate limits
- status mapping
- audit events
- user-facing synchronization time

If API access cannot be obtained:

- keep the adapter interface
- implement portal fallback
- document the blocker honestly

## Phase 7 — Document Vault

Implement:

- camera scanning
- file picker
- image/PDF upload
- private storage
- metadata
- categories
- preview
- delete/archive
- expiration date

## Phase 8 — OCR + Extraction

Implement:

- local/open-source OCR
- extraction pipeline
- Zod schema validation
- document types
- confidence markers
- manual correction

## Phase 9 — AI/RAG

Implement:

- AIProvider interface
- Ollama provider
- Gemini provider
- Groq provider
- provider fallback
- pgvector
- knowledge source ingestion
- retrieval
- grounded answer
- citations

Start with a small verified corpus.

## Phase 10 — Document Intelligence

Implement:

- compare extracted document fields with profile
- detect mismatches
- detect missing fields
- expiration warnings
- needs-review state

Never call this "legal validation."

Call it:

- document consistency check
- information check
- potential mismatch detection

## Phase 11 — Notifications

Implement:

- document expiration reminders
- application status changes
- required user action
- document-processing completion

Use push notifications first.

Email is optional and must have a free-development path.

## Phase 12 — Offline Support

Implement:

- cached dashboard
- cached requirements
- cached document metadata
- offline indicators

Only then add queued writes if genuinely required.

## Phase 13 — Security Hardening

Run:

- authorization review
- tenant isolation tests
- file access review
- secret scan
- rate-limit tests
- prompt injection tests
- SSRF review
- dependency audit

## Phase 14 — Testing

Minimum:

- unit tests
- integration tests
- component tests
- critical E2E/mobile flows
- API contract tests
- mocked government-provider tests

## Phase 15 — Portfolio Polish

Create:

- architecture diagram
- ERD
- API documentation
- screenshots
- short demo video
- README
- trade-off documentation
- security decisions
- AI evaluation results
- government integration explanation

README should clearly state:

- this is a third-party project
- which government integration capabilities are real
- which are mock/portal fallback
- which AI providers were used
- how to run locally for free

## Recommended MVP Cut Line

A strong portfolio MVP is:

```text
Auth
+
Business onboarding
+
Requirement engine
+
Government service catalog
+
Document vault
+
Document OCR/extraction
+
RAG assistant
+
Official source citations
+
Government integration adapter
+
One verified government workflow OR official portal fallback
+
Push reminders
+
Testing/security
```

Do not build:

- complex billing
- multi-country support
- dozens of LGUs
- dozens of agencies
- social features
- generic chatbot modes
- unnecessary admin dashboards

until the core workflow is stable.

## "Done" Means

A feature is complete only when:

- code exists
- types pass
- lint passes
- tests pass
- mobile behavior verified
- error/loading/empty states exist
- security reviewed
- tenant isolation reviewed
- docs updated
- no fake government integration claims remain
