# NegoSure — Security, Privacy, and Safety Specification

## 1. Security Goals

NegoSure handles:

- business information
- personal information
- government-related application information
- identity/document images
- potentially sensitive permits and certificates

Security is a product requirement, not a later optimization.

## 2. Secrets

Never store in the mobile application:

- database password
- Supabase service-role key
- Gemini/Groq/Ollama remote secrets
- government API secrets
- JWT signing private keys
- administrative credentials

Mobile public environment variables must contain only values explicitly documented as safe for client exposure.

## 3. Authentication

Use Supabase Auth or another documented secure authentication mechanism.

Backend must verify the authenticated session/token.

Never authorize based on:

```text
req.body.userId
```

Use authenticated identity from the verified token/session.

## 4. Authorization

Implement role-based access where needed:

```text
OWNER
ADMIN
MEMBER
VIEWER
```

Possible business-level permissions:

- view business
- edit business
- manage requirements
- upload documents
- view documents
- start applications
- view applications
- manage members

## 5. Tenant Isolation

Every business-owned resource must be tenant scoped.

Tests must prove:

User A cannot access User B's:

- business
- documents
- applications
- AI conversations
- notifications

Use both:

- backend authorization
- database Row Level Security where appropriate

Supabase documentation recommends Row Level Security for protecting Postgres data.

## 6. File Security

Validate:

- MIME type
- file extension
- file size
- image dimensions where relevant

Prefer private storage buckets.

Use signed URLs with short expiration.

Do not expose raw storage paths.

## 7. OCR/AI Privacy

Only send data required for the processing task.

If cloud AI is used:

- document the provider
- minimize personal data
- provide appropriate consent/disclosure
- avoid sending unnecessary metadata

For sensitive development testing, Ollama can keep inference local.

## 8. Logging

Never log:

- passwords
- API tokens
- government credentials
- private document contents
- full identity-document numbers

Log:

- request ID
- actor/user ID where appropriate
- organization/business ID
- endpoint
- status
- error code
- latency

## 9. Audit Logs

Record security-sensitive actions:

```text
LOGIN
LOGOUT
DOCUMENT_UPLOADED
DOCUMENT_VIEWED
DOCUMENT_DELETED
APPLICATION_CREATED
APPLICATION_SUBMITTED
APPLICATION_STATUS_CHANGED
MEMBER_ADDED
MEMBER_REMOVED
RULE_UPDATED
KNOWLEDGE_SOURCE_UPDATED
```

Audit logs should be append-only from normal application flows.

## 10. Rate Limiting

At minimum rate limit:

- login
- registration
- password reset
- AI endpoints
- document processing endpoints
- government integration endpoints

Use Redis-backed rate limiting when operating multiple API instances.

## 11. AI Safety

AI must never:

- fabricate official application status
- claim legal certainty
- invent a permit requirement
- claim government approval
- reveal another user's private data
- follow malicious instructions from uploaded documents

## 12. Government Safety

Never:

- scrape government portals as a default integration strategy
- reverse engineer protected/private APIs
- store credentials in mobile code
- bypass authentication
- submit applications without explicit user intent
- claim an application succeeded without official confirmation

## 13. Privacy-by-Design

Collect only data needed for the feature.

Provide:

- privacy notice
- deletion/export process appropriate to the product
- consent/disclosure for AI/document processing
- clear explanation that NegoSure is not government-owned

## 14. Security Testing

Test:

- authorization bypass
- tenant breakout
- IDOR
- file access
- malformed uploads
- oversized uploads
- prompt injection
- SSRF protections for external URL fetching
- rate limits
- token misuse
- replay/idempotency
- government API failure
