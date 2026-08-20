# NegoSure — Master Project Instructions

> **Project name:** NegoSure  
> **Platform:** iOS + Android mobile application  
> **Purpose:** AI-assisted government/compliance intelligence for Philippine MSMEs  
> **Primary engineering goal:** A portfolio-grade full-stack mobile system that demonstrates production-minded architecture, secure API design, document intelligence, RAG, AI-provider abstraction, government-service integration readiness, offline-aware mobile UX, and maintainable TypeScript code.

## 0. Important Product Positioning

NegoSure is **not** a government application and must never imply that it is an official Philippine government product.

NegoSure is a third-party mobile application that helps Philippine business owners:

- understand business/government requirements
- build a personalized compliance roadmap
- organize business and permit documents
- analyze uploaded documents
- track requirements, applications, and expiration dates
- ask AI questions grounded in verified sources
- connect to official government services **when an authorized/documented integration is actually available**

### Core distinction

- **AI explains and assists.**
- **Deterministic rules calculate known requirements.**
- **Official government systems remain authoritative for government records, application status, fees, approvals, and official transactions.**
- NegoSure must never invent an official status or claim an application was submitted unless the underlying official integration confirms it.

## 1. Non-Negotiable Architecture

### Mobile

- React Native
- Expo
- TypeScript
- Expo Router
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Expo SDK current stable compatible with the project's React Native version

### Backend

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- pgvector
- Redis
- BullMQ

### Managed/free-tier infrastructure for development

Prefer:

- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage

Use the free/available tier during development where possible.

### AI

No paid AI API is required for the project.

Primary provider strategy:

1. Ollama for fully local development
2. Gemini API free tier where the selected model/account currently has a free allowance
3. Groq free plan for fast inference and fallback

Never hard-code the application to a single provider.

### Government integration

Mandatory architectural capability:

- eGovPH/eLGU integration layer
- government service adapters
- normalized government-service model
- application/status synchronization model

However, do **not** assume that a public, unrestricted third-party eGov/eLGU API exists.

Before implementing a live integration:

1. verify the official API/documentation
2. verify the specific service/endpoint
3. verify authentication and authorization
4. verify whether third-party access is permitted
5. verify rate limits
6. verify data-sharing/usage restrictions
7. obtain credentials/approval where required

If no authorized API is available, NegoSure must use an official portal/deep link or another officially permitted workflow rather than scraping or impersonating the government system.

## 2. High-Level System Architecture

```text
                        iOS / Android
                    React Native + Expo
                              |
                         HTTPS / JSON
                              |
                              v
                  +------------------------+
                  |      NegoSure API       |
                  | Node + TS + Express    |
                  +-----------+------------+
                              |
          +-------------------+-------------------+
          |                   |                   |
          v                   v                   v
     PostgreSQL             Redis             Storage
     + pgvector             BullMQ         Private docs/files
          |                   |                   |
          +-------------------+-------------------+
                              |
                    +---------v---------+
                    |   AI Orchestrator |
                    +---------+---------+
                              |
              +---------------+---------------+
              |               |               |
              v               v               v
           Ollama          Gemini           Groq
           local           free*            free*
              |
              v
         RAG / embeddings / extraction

                              |
                    +---------v---------+
                    | Government Layer |
                    +---------+---------+
                              |
               +--------------+--------------+
               |              |              |
             eGovPH          eLGU       Other official
                                           APIs
```

`*` Free availability is subject to current provider quotas, terms, and model availability. The app must remain functional without a cloud AI provider by supporting local inference for development/testing.

## 3. Separation of Concerns

### Mobile

```text
Screen
  -> Feature UI
  -> Hooks
  -> API client / Query layer
  -> Backend
```

### Backend

```text
Route
  -> Controller
  -> Service
  -> Repository
  -> Database
```

### AI

```text
AI endpoint
  -> AI orchestration service
  -> deterministic rules / retrieval
  -> AI provider abstraction
  -> output schema validation
  -> domain response
```

### Government

```text
Government service
  -> integration service
  -> provider adapter
  -> official API
```

Never put business logic directly inside React components or Express route handlers.

## 4. Core Product Modules

1. Authentication and account management
2. Business profile/onboarding
3. Requirement engine
4. Compliance roadmap
5. Government service discovery
6. Government application tracking
7. Document vault
8. Document OCR/extraction
9. Document validation
10. AI/RAG assistant
11. Notifications/reminders
12. Offline/cache/synchronization
13. Audit logging
14. Government integration adapters
15. Admin/content management for verified regulatory sources

## 5. Core User Journey

```text
Sign up
  -> create business
  -> identify business type/location
  -> answer only missing questions
  -> calculate applicable requirements
  -> build compliance roadmap
  -> identify official digital government services
  -> upload/scan documents
  -> validate documents against profile/requirements
  -> connect to official service where authorized
  -> track application/status
  -> receive reminders
  -> ask grounded AI questions
```

## 6. Business Onboarding

The user should be able to describe the business naturally, for example:

> "I'm opening a small coffee shop in Dasmariñas."

AI may extract candidate facts, but facts used for regulatory decisions must be confirmed or represented as uncertain until confirmed.

Example profile:

```text
businessType
businessName
location
cityMunicipality
province
physicalStore
onlineSelling
foodPreparation
usesLPG
employeeCount
businessActivities[]
```

Do not ask unnecessary questions. Use progressive disclosure.

## 7. Requirement Engine

Use deterministic rules for known requirements.

Example conceptual rule:

```text
IF businessCategory = FOOD_AND_BEVERAGE
AND physicalStore = true
THEN sanitaryRequirement = APPLICABLE
```

Rules must have source metadata:

- source agency
- source document
- effective date if known
- last verified date
- jurisdiction
- rule version

Never silently change regulatory rules.

## 8. Government Integration Principles

NegoSure must treat eGovPH/eLGU as an integration ecosystem, not as a generic REST endpoint that can be assumed to exist.

The government layer must support:

- service catalog
- eligibility/discovery
- application initiation
- application submission where officially supported
- application status where officially supported
- appointment where officially supported
- payment redirect/status where officially supported
- official portal links
- provider-specific authentication
- retries
- rate limiting
- audit logs

The architecture must work even if a particular government service is unavailable through API.

## 9. AI Principles

AI is an assistant, not the authority.

Regulatory answers must be grounded in:

- official government sources
- verified curated sources
- deterministic rule outputs

The AI should explain retrieved evidence rather than invent requirements.

Every regulatory answer should carry:

- source references when available
- confidence category
- verification warning where necessary

Never claim "legal certainty" from an LLM response.

## 10. AI Provider Abstraction

Use an interface such as:

```ts
interface AIProvider {
  generateText(input: GenerateTextInput): Promise<GenerateTextOutput>;
  generateStructured<T>(input: StructuredGenerationInput<T>): Promise<T>;
  embed(input: EmbeddingInput): Promise<number[]>;
}
```

Implement:

```text
providers/
  ollama/
  gemini/
  groq/
```

Feature code should call `AIService`, not provider SDKs directly.

## 11. RAG

Pipeline:

```text
User question
 -> normalize query
 -> determine business context
 -> retrieve relevant sources
 -> metadata/jurisdiction filter
 -> optional reranking
 -> construct context
 -> LLM
 -> structured output validation
 -> source/citation attachment
```

Use PostgreSQL + pgvector instead of requiring a paid vector database.

## 12. Document Intelligence

Mobile:

```text
Camera / document picker
 -> local validation
 -> compression when appropriate
 -> secure upload
```

Backend:

```text
upload
 -> virus/security checks where possible
 -> OCR
 -> extraction
 -> normalization
 -> Zod validation
 -> business-rule validation
 -> persistence
 -> audit record
```

Preserve original extracted values.

Do not let AI silently overwrite extracted facts.

## 13. Security

Never place private secrets in the mobile app.

Never expose:

- AI provider secret keys
- Supabase service-role key
- database credentials
- government API secrets
- private signing keys
- administrative credentials

The mobile app may use public/publishable client credentials that are explicitly documented as safe for public use.

Backend must enforce:

- authentication
- authorization
- tenant isolation
- input validation
- rate limiting
- secure file access

Never trust a `userId` supplied by the mobile client as proof of identity.

## 14. Multi-Tenancy

Model ownership around:

```text
User
 -> Organization/Business
 -> Resource
```

All business-owned data must be tenant scoped.

Tenant isolation must be tested.

Do not rely only on client-side filtering.

## 15. Mobile UX Requirements

The app must support:

- iOS and Android
- safe areas
- small and large screens
- keyboard handling
- pull-to-refresh where appropriate
- loading states
- empty states
- error states
- offline states
- accessibility labels
- touch-friendly targets
- document camera flows
- push notifications

## 16. Offline Strategy

Cache read-heavy data:

- business profile
- compliance roadmap
- requirements
- document metadata
- recent assistant messages

Never show an operation as completed if it only exists in a local queue.

Show synchronization state explicitly.

## 17. Design Workflow (Impeccable)

There is no external visual-spec tool in this project. Screens are designed directly using the `impeccable` skill (`.claude/skills/impeccable`) and mocked with Claude's `design` skill before implementation.

Workflow:

```text
PRODUCT.md (product truth)
 -> DESIGN.md (durable visual world, written at finish from the built mock)
 -> new screen: mock via design skill, following the committed DESIGN.md system
 -> self-check against impeccable's craft-floor bans (kickers, card-grid defaults,
    overused fonts, contrast, touch targets, color-only status, etc.)
 -> map to NegoSure design-system tokens
 -> implement with React Native
 -> verify on iOS/Android-sized screens
```

`PRODUCT.md` and `DESIGN.md` live at the project root and are the source of truth for product facts and the committed visual world, respectively — read them before mocking or implementing any screen. Do not re-derive the visual direction per screen; extend the committed world instead.

Claude must preserve NegoSure architecture and reusable components regardless of how a mock was produced.

## 18. Repository Structure

Recommended monorepo:

```text
NegoSure/
├── CLAUDE.md
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── apps/
│   └── mobile/
│       ├── app/
│       ├── src/
│       │   ├── components/
│       │   ├── features/
│       │   ├── hooks/
│       │   ├── lib/
│       │   ├── services/
│       │   ├── store/
│       │   ├── design-system/
│       │   └── types/
│       └── app.json
├── services/
│   └── api/
│       ├── src/
│       │   ├── config/
│       │   ├── middleware/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── businesses/
│       │   │   ├── requirements/
│       │   │   ├── documents/
│       │   │   ├── applications/
│       │   │   ├── notifications/
│       │   │   └── assistant/
│       │   ├── ai/
│       │   ├── integrations/
│       │   │   └── government/
│       │   ├── jobs/
│       │   └── utils/
│       └── prisma/
├── packages/
│   ├── types/
│   ├── validation/
│   └── config/
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   └── product/
└── .claude/
    └── skills/
```

## 19. Testing

At minimum:

### Backend

- unit tests
- service tests
- API integration tests
- authorization tests
- tenant-isolation tests

### Mobile

- component tests
- hook tests
- critical screen tests

### AI

- grounded-answer tests
- no-context tests
- conflicting-source tests
- malformed-document tests
- provider-failure tests

### Government integrations

- contract tests using mocks
- authentication failure
- rate-limit failure
- timeout
- malformed official response
- unsupported service

Never call a real government production API from automated tests unless explicitly authorized.

## 20. Development Rules for Claude Code

Before changing code:

1. inspect the repository
2. identify related existing patterns
3. avoid duplicate functionality
4. plan the smallest coherent change
5. implement
6. run typecheck
7. run lint
8. run tests
9. inspect diff
10. verify behavior

Do not make large architecture changes without explaining the trade-off.

Do not add a dependency if the existing stack can solve the problem cleanly.

Do not use `any` as a shortcut.

Do not disable TypeScript errors to force compilation.

Do not claim something works without verification.

## 21. Free-First Constraint

The project must be designed so that the portfolio MVP can be developed without paid AI APIs.

Preferred AI:

- Ollama local
- Gemini free allowance
- Groq free plan

Preferred development infrastructure:

- Supabase free/available tier
- local PostgreSQL if necessary
- local Redis if necessary
- local object storage or Supabase free storage where available

Important: "free" does not mean production will always have zero cost. App-store developer accounts, production hosting, high-volume storage, government API access, email/SMS, and provider quotas may have costs or eligibility requirements outside the portfolio MVP.

Do not introduce a paid dependency without documenting a free/local alternative.

## 22. Branding Note

The chosen project name is **NegoSure**.

Public web search currently shows other unrelated products using the NegoSure name. Before any public commercial launch, verify:

- Philippine trademark availability
- domain availability
- App Store/Google Play name availability
- package/bundle identifier availability
- social handles

Do not change the internal project name because of this note.

## 23. Definition of Done

A feature is done only when:

- implemented
- typed
- validated
- tested
- error handled
- loading/empty/offline states handled where appropriate
- authorization considered
- tenant isolation considered
- secrets protected
- documentation updated
- no unnecessary duplication introduced
