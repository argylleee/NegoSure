# NegoSure Claude Code Setup

## Recommended file placement

Copy these into the repository root:

- `CLAUDE.md`

Copy the remaining `.md` files into:

```text
docs/
```

Recommended Claude Code skills:

```text
.claude/
└── skills/
    ├── mobile-ui/
    │   └── SKILL.md
    ├── ai-engineering/
    │   └── SKILL.md
    ├── backend/
    │   └── SKILL.md
    ├── government-integrations/
    │   └── SKILL.md
    ├── document-processing/
    │   └── SKILL.md
    ├── testing/
    │   └── SKILL.md
    └── security/
        └── SKILL.md
```

The master `CLAUDE.md` is intentionally the source of truth. The documentation files contain deeper references and should not contradict it.

## First Claude Code session

Do NOT ask Claude to build the whole app.

Start with:

```text
Read CLAUDE.md and the docs/ architecture files.

Do not write application features yet.

First inspect the repository and produce:
1. proposed monorepo structure
2. package manager choice
3. initial dependency list
4. environment variable schema
5. PostgreSQL/Prisma data model
6. API module boundaries
7. React Native navigation map
8. design-system structure
9. test strategy
10. implementation risks

Do not create code until the architecture proposal is internally consistent.
```

After reviewing the architecture, proceed one phase at a time from `IMPLEMENTATION_PLAN.md`.

## Important

Do not ask Claude to invent a government API.

When implementing eGovPH/eLGU integration, require Claude to use actual official documentation and credentials. If no public/authorized API details are available, Claude must implement the adapter boundary and official-portal fallback rather than fabricate endpoints.
