# NegoSure — Architecture and Technical Specification

## 1. Architecture Decision Record

### Decision

Build NegoSure as a cross-platform mobile application backed by a TypeScript Node.js API.

### Final stack

| Layer             | Technology                                                          | Reason                                        |
| ----------------- | ------------------------------------------------------------------- | --------------------------------------------- |
| Mobile            | React Native                                                        | iOS + Android                                 |
| Mobile tooling    | Expo                                                                | Cross-platform development and native modules |
| Language          | TypeScript                                                          | Shared type safety                            |
| Navigation        | Expo Router                                                         | File-based navigation                         |
| Server state      | TanStack Query                                                      | Caching/synchronization                       |
| Client state      | Zustand                                                             | Lightweight local state                       |
| Forms             | React Hook Form                                                     | Mobile forms                                  |
| Validation        | Zod                                                                 | Runtime validation + inferred TS types        |
| API               | Node.js + Express                                                   | Clear backend/full-stack portfolio signal     |
| ORM               | Prisma                                                              | Typed database access/migrations              |
| DB                | PostgreSQL                                                          | Reliable relational core                      |
| Vector search     | pgvector                                                            | RAG without a paid vector DB                  |
| Cache/queue       | Redis + BullMQ                                                      | Background processing                         |
| Auth              | Supabase Auth                                                       | Free-tier-friendly managed auth               |
| Storage           | Supabase Storage                                                    | Secure document storage                       |
| AI local          | Ollama                                                              | No API cost                                   |
| AI cloud          | Gemini free tier                                                    | Free allowance subject to current terms       |
| AI fast fallback  | Groq free plan                                                      | Free allowance subject to current limits      |
| OCR               | Tesseract or another open-source/local OCR option                   | Avoid paid OCR dependency                     |
| Testing           | Vitest/Jest, Supertest, React Native Testing Library                | Free/open-source                              |
| API documentation | OpenAPI/Swagger                                                     | Clear backend contract                        |
| Design            | Impeccable skill + Claude `design` skill (`PRODUCT.md`/`DESIGN.md`) | UI/prototype source                           |
| Coding agent      | Claude Code                                                         | Implementation/verification                   |

## 2. Client-Server Boundary

The mobile app is a client, not the system of record.

The backend owns:

- authorization
- business rules
- government integrations
- AI orchestration
- document processing
- audit logs
- tenant isolation
- application status synchronization

The mobile client owns:

- presentation
- local UI state
- local cache
- camera/document picker interaction
- user experience

## 3. Network

Use:

```text
HTTPS
JSON
REST
JWT/session-based authentication
```

Use idempotency keys for operations where duplicate submissions could be harmful, especially government application initiation/submission.

## 4. Recommended Backend Modules

```text
src/modules/
├── auth/
├── users/
├── organizations/
├── businesses/
├── requirements/
├── compliance/
├── documents/
├── government-services/
├── applications/
├── notifications/
├── assistant/
└── audit/
```

### Each module should follow

```text
routes/
controllers/
services/
repositories/
schemas/
types/
```

Avoid creating every folder until it is needed; keep boundaries clear without overengineering.

## 5. Government Integration Boundary

```text
src/integrations/government/

providers/
  egov/
  elgu/
  other/

adapters/
  EgovServiceAdapter.ts
  ElguServiceAdapter.ts

common/
  auth/
  errors/
  rate-limit/
  mapping/
```

The adapter converts provider-specific data to NegoSure's canonical domain model.

### Canonical service

```ts
type GovernmentService = {
  id: string;
  provider: string;
  agency: string;
  jurisdiction?: string;
  name: string;
  category: string;
  description?: string;
  supportsOnlineApplication: boolean;
  supportsStatusTracking: boolean;
  supportsPayment: boolean;
  officialUrl?: string;
  availability: "AVAILABLE" | "UNAVAILABLE" | "UNKNOWN";
};
```

### Canonical application

```ts
type GovernmentApplication = {
  id: string;
  businessId: string;
  serviceId: string;
  externalApplicationId?: string;
  status:
    | "DRAFT"
    | "READY"
    | "SUBMITTED"
    | "PROCESSING"
    | "ACTION_REQUIRED"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLED"
    | "UNKNOWN";
  submittedAt?: string;
  lastSyncedAt?: string;
};
```

## 6. Why the Backend Must Mediate eGov/eLGU

Never do:

```text
Mobile -> Government API
```

Prefer:

```text
Mobile
  -> NegoSure API
  -> Government integration service
  -> authorized government API
```

This keeps government credentials private, normalizes provider-specific schemas, provides retry/error handling, and lets the mobile app remain stable if a government API changes.

## 7. API Surface

Illustrative MVP endpoints:

```text
POST   /api/v1/auth/session
GET    /api/v1/me

POST   /api/v1/businesses
GET    /api/v1/businesses
GET    /api/v1/businesses/:id
PATCH  /api/v1/businesses/:id

POST   /api/v1/businesses/:id/onboarding/analyze

GET    /api/v1/businesses/:id/requirements
GET    /api/v1/requirements/:id
PATCH  /api/v1/requirements/:id

GET    /api/v1/government/services
GET    /api/v1/government/services/:id
POST   /api/v1/government/applications
GET    /api/v1/government/applications
GET    /api/v1/government/applications/:id
POST   /api/v1/government/applications/:id/sync

POST   /api/v1/documents
GET    /api/v1/documents
GET    /api/v1/documents/:id
POST   /api/v1/documents/:id/analyze

POST   /api/v1/assistant/messages
GET    /api/v1/assistant/conversations/:id

GET    /api/v1/notifications
POST   /api/v1/notifications/:id/read
```

Do not freeze endpoint details before implementing the actual domain model.

## 8. Idempotency

For potentially repeatable external transactions:

```text
POST /government/applications
Idempotency-Key: <uuid>
```

The server must return the original result for a repeated idempotency key rather than creating a duplicate application.

## 9. Error Model

Use structured errors:

```json
{
  "error": {
    "code": "GOVERNMENT_SERVICE_UNAVAILABLE",
    "message": "This government service is currently unavailable.",
    "requestId": "..."
  }
}
```

Never return internal stack traces.

## 10. Authentication and Authorization

Authentication establishes identity.

Authorization determines:

- which business the user belongs to
- which resources they may access
- whether they can perform owner/admin actions

Do not merge these concepts.

## 11. Tenant Model

Recommended conceptual data hierarchy:

```text
users
organizations
organization_members
business_profiles
requirements
business_requirements
documents
document_extractions
government_services
government_applications
application_events
ai_conversations
ai_messages
knowledge_sources
knowledge_chunks
notifications
audit_logs
```

A user can belong to one or more organizations.

An organization can have one or more business profiles.

All business data must be tenant scoped.

## 12. Key Data Relationships

```text
User
  |
  +-- OrganizationMember -- Organization
                               |
                               +-- BusinessProfile
                                      |
                 +--------------------+------------------+
                 |                    |                  |
           BusinessRequirement      Document      GovernmentApplication
                 |                    |                  |
        RequirementDefinition   DocumentExtraction   GovernmentService
```

AI:

```text
BusinessProfile
   |
AIConversation
   |
AIMessage
   |
KnowledgeChunk -> KnowledgeSource
```

## 13. Database Notes

Use PostgreSQL.

Use UUIDs for externally exposed identifiers.

Use timestamps in UTC.

Prefer enums for stable state values.

Use soft-delete only where recovery/audit requirements justify it.

Add indexes for:

- tenant/business ID
- status
- expiration date
- external application ID
- createdAt
- government service provider
- vector columns

## 14. pgvector

Use pgvector for:

- government document chunks
- FAQ chunks
- policy/requirement chunks

Each chunk should carry metadata so retrieval can filter by:

- agency
- jurisdiction
- service
- effective date
- document version
- source status

## 15. Background Jobs

BullMQ jobs should handle:

- OCR
- document extraction
- embedding generation
- application status synchronization
- reminders
- source refresh
- notification dispatch

Do not block the mobile HTTP response while doing expensive document/OCR/embedding work.

## 16. Caching

Cache:

- government service catalog
- non-user-specific source metadata
- stable regulatory retrieval data
- rate-limited external responses where allowed

Never cache sensitive user-specific data without a documented security policy.

## 17. Mobile Data Strategy

Use TanStack Query for:

- business data
- requirements
- documents
- government services
- application status
- notifications

Use Zustand for:

- UI state
- current onboarding step
- temporary selections
- local feature flags/settings

Do not use Zustand as a replacement database/server-state cache.

## 18. Offline

MVP:

- cache recent read data
- show stale/offline indicator
- queue only explicitly safe local actions

Later:

- robust mutation queue
- conflict resolution
- background synchronization

Do not add complex offline sync before core online workflows are stable.

## 19. Push Notifications

Use Expo notifications as the mobile delivery mechanism.

Examples:

- permit/document expiring soon
- application status changed
- government application needs user action
- document analysis completed
- source/rule update affecting a tracked requirement

Do not send sensitive document contents inside notification payloads.

## 20. Deployment Strategy

Development can stay free/local as much as practical.

Possible:

- mobile: Expo/EAS development tooling
- API: local Node process
- DB: local PostgreSQL or Supabase free/available tier
- Redis: local Redis
- AI: Ollama
- optional cloud AI: Gemini/Groq free allowances

Production costs are not guaranteed to remain zero.

App stores, hosting, domains, production email/SMS, high-volume storage, and government integrations may involve fees or approvals.

## 21. Current Expo Consideration

Use the current stable Expo SDK at project initialization rather than pinning an outdated SDK from this document.

Expo SDK 55+ uses React Native's New Architecture; current Expo documentation lists SDK 57 as a current stable version at the time this specification was verified.

Use Expo's supported packages with `npx expo install`.
