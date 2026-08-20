# NegoSure — Mobile UI and React Native Implementation Rules

## 1. Product UI Direction

The UI should feel:

- trustworthy
- modern
- Filipino-friendly
- professional
- calm rather than bureaucratic
- easy for first-time business owners

Do not imitate a government website.

NegoSure should feel like a modern private productivity/compliance app.

## 2. Core Mobile Screens

### Authentication

- Welcome
- Sign in
- Sign up
- Forgot password
- Optional Google/Apple authentication

### Onboarding

- Welcome
- Business type
- Business location
- Business details
- Smart follow-up questions
- Completion summary

### Main tabs

Recommended:

- Home
- Requirements
- Documents
- Assistant
- Profile

Applications may live within Requirements or Home depending on the final UX.

## 3. Home Dashboard

Possible sections:

```text
Good morning, <name>

Business:
Juan's Coffee Shop

Compliance progress
████████░░ 80%

Needs attention
- Fire Safety document expiring soon
- Business permit application pending

Quick actions
[Scan Document]
[Check Requirements]
[Government Services]
[Ask NegoSure]
```

Do not overload the home screen.

## 4. Requirement Screen

Show:

- requirement name
- reason it applies
- source
- status
- document requirement
- government service availability
- application state

Statuses:

```text
NOT_STARTED
IN_PROGRESS
READY
SUBMITTED
COMPLETED
ACTION_REQUIRED
```

## 5. Government Service UX

Clearly label:

```text
Official government service
Provider: eLGU
Status synced: 2 hours ago
```

If only a portal is available:

```text
Official portal
No direct NegoSure integration
```

## 6. Document Vault

Features:

- camera scan
- image/PDF selection
- document category
- upload progress
- analysis progress
- result
- expiration
- delete/archive
- secure preview

Never show private documents in public/shared URLs.

## 7. Document Scan UX

Flow:

```text
Scan
 -> frame document
 -> capture
 -> preview
 -> retake/use
 -> upload
 -> analyzing
 -> results
```

Do not automatically send every photo to AI.

Allow user confirmation.

## 8. Assistant UX

The assistant should show:

- answer
- source references
- confidence category
- warning/verification message when needed

Example:

```text
Based on the official sources retrieved for
your business location, this requirement appears
applicable.

Confidence: High

Sources:
DTI ...
eLGU ...
LGU ordinance ...

[View source]
```

## 9. Design System

Create centralized tokens:

```text
design-system/
  colors.ts
  typography.ts
  spacing.ts
  radii.ts
  shadows.ts
  motion.ts
```

No arbitrary repeated values throughout the application.

## 10. Shared Components

Build reusable components such as:

```text
Button
Card
Input
Select
Badge
StatusBadge
RequirementCard
DocumentCard
GovernmentServiceCard
ProgressIndicator
EmptyState
ErrorState
LoadingState
BottomSheet
Modal
Toast
```

Do not create one-off versions for every screen.

## 11. Direct Design Process (Impeccable)

Claude is the visual design source, via the `impeccable` skill and Claude's `design` skill — no external design tool. `PRODUCT.md` and `DESIGN.md` at the project root hold product truth and the committed visual world; read both before starting a new screen.

Workflow:

```text
Screen requirement
 -> mock via design skill, inside the committed DESIGN.md world
   (new visual world only for a genuine redesign — extend, don't reinvent, per screen)
 -> inspect visual hierarchy
 -> identify reusable components
 -> self-check against impeccable's craft-floor bans and hook findings
 -> compare with NegoSure tokens
 -> implement using existing components
 -> verify rendered output on iOS/Android-sized screens
```

Do not carry a mock's raw markup into production code if it conflicts with the project's architecture — the mock establishes visual intent, not implementation.

## 12. React Native Constraints

Every screen must consider:

- SafeAreaView/useSafeAreaInsets
- Android back behavior
- keyboard avoidance
- scroll containers
- screen dimensions
- platform-specific differences
- accessibility
- touch targets

Do not assume iOS-only behavior.

## 13. Navigation

Use Expo Router.

Suggested conceptual route structure:

```text
app/
├── (auth)/
├── (onboarding)/
├── (tabs)/
├── requirements/
├── documents/
├── applications/
├── assistant/
└── settings/
```

## 14. State

TanStack Query:

- API/server state
- remote cache
- synchronization

Zustand:

- UI/application state
- onboarding draft state
- non-server ephemeral state

Do not duplicate the same server state across both.

## 15. Loading / Empty / Error / Offline

Every network-driven screen must define all four.

Example:

```text
Loading
Empty
Success
Error
Offline/Stale
```

Never leave a blank area with no explanation.

## 16. Accessibility

Use:

- accessible labels
- semantic roles
- sufficient contrast
- readable text
- appropriate touch targets
- not color alone for status

## 17. Performance

Avoid:

- giant lists rendered without virtualization
- unnecessary re-renders
- uncompressed large images
- blocking heavy processing on the UI thread
- repeated network calls

Use:

- memoization where justified
- pagination
- image compression
- query caching
- background jobs for heavy server work
