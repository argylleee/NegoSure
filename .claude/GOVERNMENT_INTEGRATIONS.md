# NegoSure — eGovPH/eLGU and Government Integration Specification

## 1. Goal

NegoSure must be architected to integrate with the Philippine digital-government ecosystem.

Primary integration targets:

- eGovPH ecosystem
- eLGU
- officially authorized government/agency APIs
- official government portals

## 2. Current Verification Caveat

Official government sources confirm that:

- eGovPH is a government digital platform/ecosystem
- eLGU supports online LGU services including business permits and other transactions
- eLGU-BPLS is actively used and expanded across Philippine LGUs

However, this project specification must **not claim that an unrestricted public developer API exists for every eGovPH/eLGU service**.

Before implementation of any real endpoint:

- locate the official API/integration documentation
- confirm third-party developer access
- confirm endpoint/service availability
- confirm authentication method
- obtain credentials if required
- confirm terms and permitted use

If official API documentation cannot be verified, do not invent endpoints.

## 3. Why eGov/eLGU Is Still a First-Class Architecture Component

Government integration is part of the product concept even if individual endpoints are unavailable to third parties.

The system must support three service modes:

### MODE A — API CONNECTED

```text
NegoSure
 -> official authorized API
 -> live application/status/payment data
```

### MODE B — OFFICIAL PORTAL

```text
NegoSure
 -> prepares user
 -> provides requirement/document checklist
 -> deep links to official portal
 -> user completes government transaction there
 -> user may return status manually where API is unavailable
```

### MODE C — INFORMATION ONLY

```text
NegoSure
 -> grounded official requirements
 -> source citations
 -> no application submission
```

The mobile UI must clearly distinguish these modes.

## 4. eLGU Use Cases

Potential service categories include:

- business permit/licensing
- building-related services
- civil registry
- community tax/cédula
- other local transactions supported by the relevant LGU

Do not assume every service is available in every LGU.

NegoSure must model service availability by:

- provider
- LGU
- municipality/city
- service
- date

## 5. Government Service Discovery

The user's business location is critical.

Example:

```text
Business:
Coffee shop

Location:
Dasmariñas, Cavite

        |
        v

Locate jurisdiction
        |
        v

Determine available official services
        |
        +--> eLGU available
        |
        +--> official LGU portal
        |
        +--> no digital integration known
```

Do not present a service as available simply because it exists somewhere in the Philippines.

## 6. Government Provider Adapter

Use an adapter interface.

```ts
interface GovernmentProvider {
  listServices(context: GovernmentContext): Promise<GovernmentService[]>;
  getService(id: string): Promise<GovernmentService>;
  createApplication?(input: CreateGovernmentApplicationInput): Promise<GovernmentApplication>;
  getApplicationStatus?(applicationId: string): Promise<GovernmentApplicationStatus>;
  syncApplication?(applicationId: string): Promise<GovernmentApplication>;
}
```

Optional methods are intentional because not all providers expose all capabilities.

## 7. eGov/eLGU Adapter

Conceptual only until official documentation is verified:

```text
EgovProvider
ElguProvider
```

Do not invent:

- base URLs
- endpoint paths
- OAuth scopes
- API keys
- request payloads
- response formats

The implementation must be based on actual official documentation/credentials.

## 8. Canonical Government Model

Normalize all providers into one domain model.

```ts
type GovernmentService = {
  id: string;
  provider: "EGOVPH" | "ELGU" | "OTHER";
  agency: string;
  jurisdiction?: string;
  name: string;
  category: string;
  availability: "AVAILABLE" | "UNAVAILABLE" | "UNKNOWN";
  supportsOnlineApplication: boolean;
  supportsStatusTracking: boolean;
  supportsPayment: boolean;
  officialUrl?: string;
};
```

## 9. Government Application State

```text
DRAFT
READY
SUBMITTED
PROCESSING
ACTION_REQUIRED
APPROVED
REJECTED
CANCELLED
UNKNOWN
```

Only set `SUBMITTED` if the official system confirms submission.

Never infer `APPROVED` from an AI response.

## 10. Status Synchronization

Where supported:

```text
BullMQ scheduled job
  -> government adapter
  -> fetch official status
  -> map to NegoSure state
  -> store application event
  -> notify user
```

Handle:

- timeout
- API unavailable
- rate limit
- authentication expiration
- schema changes
- unknown external status

## 11. Payments

If an official integration supports payment:

- never store raw card credentials
- use the authorized official/payment flow
- redirect/deep link where required
- store only permitted transaction references

If the government/payment system does not provide a permitted API flow, do not attempt to reproduce it.

## 12. Government Credentials

Government integration secrets belong only on the backend.

Never put them in:

- React Native bundle
- `.env` variables prefixed for public mobile exposure
- Git
- logs
- screenshots
- client-side code

## 13. Portal Fallback

When no API is available:

Display:

```text
Online integration unavailable

Requirements prepared
Documents prepared
Official portal available

[Open Official Government Portal]
```

Never use unauthorized scraping or reverse engineering as a default workaround.

## 14. Source Governance

The knowledge base must record:

- agency
- source URL
- jurisdiction
- publication date
- effective date
- retrieval date
- version
- source status

When a source is superseded:

- mark old source `SUPERSEDED`
- preserve historical record
- prevent new retrieval from using it unless historical context is requested

## 15. Change Monitoring

A future system may periodically monitor official sources for changes.

Until automated change detection is implemented, source refresh should be an explicit admin/content workflow.

Do not silently overwrite regulatory data.

## 16. Government UX Principles

Always show:

- government provider
- official source/service
- whether integration is live
- last synchronization time
- official portal link
- status source

The user should never be confused about whether information came from NegoSure or the government.

## 17. Legal/Privacy Principle

NegoSure must not claim to be an official government system.

Provide clear disclosures:

- third-party application
- AI-assisted information
- official verification may be required

Handle personal data according to applicable Philippine privacy requirements and the project's privacy/security design.
