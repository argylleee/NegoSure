# Design

Durable visual decisions for NegoSure's mobile UI. Read this before designing or implementing any screen; it records the built world, not intentions — update it when the world changes, not before.

**Process note:** this was recorded through Impeccable's `new-work` direction flow (domain exploration → `concept-seed.mjs --scope direction --mode operate` → user decision via structured question) on the Home screen mock. The full native finish-review ceremony (emulator screenshots, `impeccable-finish-reviewer`/`impeccable-documenter` subagents) did **not** run — there is no buildable RN app yet to screenshot from a simulator/emulator. This file is a manual documentation pass instead; re-run the real finish flow once there's an actual app to build and screenshot.

## Direction

**Sari-sari ledger world.** The compliance dashboard reads like the _listahan_ (utang/ledger notebook) every sari-sari store owner already keeps behind the counter — ruled rows, tally marks, ink corrections — not a generic SaaS progress-bar dashboard. Chosen over the dice-assigned "wallet/receipt" direction (safer, closer to default fintech-app appearance) specifically for higher audience identification and distinctiveness; see `design/mocks/home-ledger/Main.dc.html`'s header comment for the full direction contract.

Explicitly refused: parchment/deckle-edge texture, sepia/cream coloring, cursive or script type, any literal "aged paper" skeuomorphism. The metaphor is structural (rules, ink, tally marks, stamps) — not decorative nostalgia. See Section 1 of `.claude/MOBILE_UI_STITCH.md`: must never read as bureaucratic or old-fashioned.

## Color tokens (oklch)

| token            | value                  | use                                                                                                                                       |
| ---------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `--paper`        | `oklch(97% 0.008 85)`  | screen background — warm paper-gray, not cream/golden                                                                                     |
| `--paper-raised` | `oklch(99% 0.004 85)`  | slightly lifted surfaces (tab bar)                                                                                                        |
| `--line`         | `oklch(85% 0.02 250)`  | thin rule lines, faint blue-gray like ruled notebook paper                                                                                |
| `--line-strong`  | `oklch(72% 0.03 250)`  | emphasis rules (ledger total underline)                                                                                                   |
| `--ink`          | `oklch(28% 0.045 255)` | primary text and structural rules — ballpen blue-black                                                                                    |
| `--ink-soft`     | `oklch(46% 0.03 255)`  | secondary text                                                                                                                            |
| `--ink-faint`    | `oklch(58% 0.025 255)` | tertiary/meta text — darkened from an initial 66% for contrast safety on small labels                                                     |
| `--red`          | `oklch(46% 0.17 25)`   | **reserved exclusively** for unsettled/urgent ledger entries — never decorative                                                           |
| `--red-soft`     | `oklch(94% 0.03 25)`   | red-tinted fill, sparing use                                                                                                              |
| `--stamp`        | `oklch(38% 0.09 292)`  | verified/official mark ink — muted violet, matching real Philippine office rubber-stamp ink color (an authenticity detail, not arbitrary) |
| `--stamp-soft`   | `oklch(94% 0.025 292)` | stamp tint fill                                                                                                                           |

Rule: ink (blue-black) is the only structural color. Red is a semantic reservation, not a palette option — if a screen has nothing unsettled, red should not appear. Stamp-violet marks verified/official state only.

## Typography

- Font: **Schibsted Grotesk** (Google Fonts), weights 400–700. Chosen for its faint engineered/official-document character without becoming a costume (not a script/handwriting face — that was named and rejected as the direction's honest risk). Originally drafted with Space Grotesk; the design hook flagged it as overused (it's on the skill's own "distinctive face" list, which means the list itself has drifted stale) — swapped rather than suppressed.
- Tabular numerals (`font-variant-numeric: tabular-nums`) on all counts/percentages.
- No eyebrow/kicker labels above headings anywhere — this is a hard ban per Impeccable's craft floor, not a style preference. An earlier draft of the Home header used a "BUSINESS" eyebrow above the business name; removed.

## Depth strategy

**Borders only, no shadows.** This is a page-world, not a card-world — flat like paper. Deliberately different from any shadow-based system used elsewhere; do not mix strategies within this world. Structure comes from rule lines (1–2.5px, weight signals hierarchy: total lines get a double rule) and 1.4–1.6px borders, never soft elevation.

## Spacing / density

- Screen padding: 22px horizontal.
- Row rhythm: ruled list rows at 12px vertical padding, bottom-border only (`--line`).
- Ledger total block gets its own double-rule treatment (thin rule + heavier rule beneath) — an authentic ledger "total line" convention, reserved for the one number that matters most on the screen.

## Component patterns (established, reuse don't reinvent)

- **Ledger header row**: business name (21px/700) + location, sitting directly on a 2px `--ink` rule. No label above it.
- **Balance/total line**: label + value pair, followed by a double rule (`--line-strong` then `--ink`), then a meta line. Used once per screen, for the single most important number — not a repeatable "metric card" pattern.
- **Stamp tag**: small bordered rect, 3px radius, slight rotation (-2° to 1.4°, varied per instance so a row doesn't look mechanically tiled), used for verified/official marks and quick actions. Real touch targets stay 44px min-height even though the visual chip reads smaller — padding absorbs the difference, never the visible box alone.
- **Ledger alert row**: 20×20px tally box (empty = unsettled, check = settled) + title + colored subtitle (color carries meaning, paired with the box state so status is never color-only) + right-aligned source tag. Ruled bottom border, no card shell.
- **Tab bar**: active tab marked by a 16×2px ink underline beneath the label, not a color change or pill — consistent with "status/state is never color alone."
- Icons: inline stroke SVG only, 14–20px, 1.7–2px stroke — no emoji/dingbats, no monospace-as-costume.

## Superseded

The teal/Plus Jakarta Sans system used in the original Home and Requirements mocks (`design/mocks/home-dashboard/`, `design/mocks/requirements/`) is **superseded** by this direction, per explicit user choice — those mock files were deleted, not kept as history. Both screens have since been rebuilt in the ledger world (below); do not resurrect the teal system.

## Screens built so far

- `design/mocks/home-ledger/Main.dc.html` — Home dashboard in the ledger world (greeting, ledger header, balance/total line, Needs Attention ruled rows, quick-action stamp tags, tab bar). Published: https://claude.ai/code/artifact/66b020ef-4085-431f-bd6f-c8c1abbe3d14
- `design/mocks/requirements-ledger/Main.dc.html` — Requirements list in the ledger world (ledger totals line, plain-text status filters with underline-not-color active state, ruled requirement rows with tally box + status note + eLGU-sync stamp). Reuses the totals-line and stamp-tag patterns from Home rather than reinventing them. Published: https://claude.ai/code/artifact/2ac888e0-a7d1-4f2b-8584-13551a3b17ca
