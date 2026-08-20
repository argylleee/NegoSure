# NegoSure — Verification Notes (Checked 2026-08-19)

These notes are included so Claude Code knows which external assumptions were verified and which must remain conditional.

## Government

Official Philippine government/public-sector sources currently confirm:

- eGovPH/eLGU are active digital-government initiatives.
- eLGU supports services including business permits/licensing and other LGU transactions.
- More than 1,000 LGUs were reported as having adopted eLGU by July 2026.
- eLGU-BPLS is actively used and updated.

Sources to verify directly during implementation:

- DICT / eGovPH official documentation
- DILG official eLGU documentation
- the specific LGU's official service/API documentation

Important:
No unrestricted, general-purpose third-party eGovPH/eLGU developer API covering all services was verified in the research used for this specification. Therefore the codebase must not invent endpoints or assume public API access.

## AI

Google's current Gemini API pricing documentation was checked. Free availability is model-specific; not every Gemini model/API capability is free.

Groq's current rate-limit documentation was checked. The free plan has model-specific RPM/RPD/TPM/TPD limits.

Ollama is the preferred local no-paid-API development option.

## Mobile

Current Expo documentation was checked:

- Expo is the chosen React Native toolchain.
- Expo SDK versions map to supported React Native versions.
- Current Expo SDKs use React Native New Architecture.
- Expo supports iOS and Android.

## Backend

Supabase's current Expo/React Native documentation confirms:

- Expo + React Native integration
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Row Level Security guidance

## Brand

The selected project name is NegoSure.

Current web search shows unrelated products/services already using NegoSure. This is not a blocker for a school/portfolio repository, but a public launch should verify trademark, domain, App Store, Google Play, and social-name availability first.
