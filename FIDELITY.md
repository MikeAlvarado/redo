# Fidelity — this build vs. redomedia.co

What this site copies from the reference, what it deliberately does not, and how
to check. The site is a **design study of the layout and motion design** of
[redomedia.co](https://redomedia.co/); all content and assets are Mike's.

Two documents back this one up:

- `reference/compare/report.md` — generated, one row per viewport × section ×
  frame, each with a hand-assigned verdict. Regenerate with `npm run compare`.
- `CLAUDE.md` → *Decision log* — why each divergence exists, in the order the
  decisions were made.

**Last full run: 2026-08-27, post content-migration. 151/151 PASS** across 4
viewports (390, 430, 768, 1440), 11 sections, enter/mid/leave or pin p0–p100
frames, plus a 58-frame journey deck sweep at 1500/1200/430 stepped down and
back up.

## How to re-check

```bash
npm run dev                       # the build must be on :5173
npm run compare                   # captures both sites, builds contact sheets, gates
npm run compare -- --report-only  # re-gate without re-capturing
```

Verdicts live in `reference/compare/verdicts.json` and are assigned **by eye from
the contact sheets** (`reference/compare/<viewport>/sheet-<section>.png`), not
computed. A row with no verdict counts as FAIL, so a new section cannot slip
through unexamined. `reference/` is git-ignored except top-level `.md` files —
the screenshots never ship.

Two traps this run had to fix, worth knowing before you trust a green report:

- **Stale screenshots produce phantom PASS rows.** The report is driven by
  `existsSync`. When testimonials shipped empty, the `reviews` section stopped
  rendering, but the previous run's `reviews-*-mine-en.png` files were still on
  disk and kept generating PASS rows for a section that no longer exists. Delete
  captures for a section you remove.
- **A section absent from `SECTIONS` is simply not examined.** `credentials` was
  invisible to the report until it was added with an empty `ref` list, which
  makes its reference column read "missing" on purpose.

## Deliberate differences

These are decisions, not gaps. Each is logged in `CLAUDE.md` with its reasoning.

| | Reference | This build | Why |
|---|---|---|---|
| Display serif | Times Now | **Instrument Serif** | Times Now is commercial. Instrument is SIL OFL and a touch narrower. |
| Hero / closing photography | Redo's own | **CC0 photographs** | Not ours to ship. Same measured red-orange treatment; sources in `NOTES.md`. |
| Grain | completely static | **animated, `steps(1)` ~10fps** | Mike wants it to move. Intentional — do not "fix" back toward the reference. |
| Language | English only | **EN/ES throughout** | Adds a nav toggle and a Language row in the mobile menu with no reference equivalent. |
| Founders | 2 cards | **1 card, centred** | Solo portfolio. Section holds 1–3 entries. |
| Testimonials | peek carousel of quotes | **omitted entirely** | There is not one real quote in any source, and inventing one is worse than a gap. Section returns `null`, `reviews` drops out of the nav and footer. |
| Credentials strip | none | **added** | YC S21, PMP, Scrum, Six Sigma, degree. Build-only section. |
| Project detail | full pages at `/featured-work/<slug>` | **hash-routed overlay** (`#project/<slug>`) | No router by design. The overlay took the reference's `← Back` affordance. |
| Client wall | 7-up × ~5 rows, ~33 logo images | **6-up × 2 rows, 12 text wordmarks** | Real organizations from the CV; no transparent logo files exist. Tiles are uniform height on both (measured 80px @1440, 56px @390). |
| Closing card | eyebrow + heading + CTA | **+ reach-links row**, and a socials row in the footer | Required by the content spec. |
| Nav labels | Services / Featured Work / Reviews | **Services / Previous Work** | From the portfolio repo's own `Nav` strings; `Reviews` is gone with the section. |

## Structural difference, not yet reconciled

**The reference nests its stats inside the "Get In Touch" section**, in a
two-column row: founder cards on the left, the numerals on the right, under one
heading. This build has them as two separate stacked sections — a full-width
stats section, then founders below it. Visible at 1440 in
`reference/compare/1440/sheet-stats.png`, "mid" frame.

Everything else about the stats matches (numeral-left rows, italic serif,
count-up on enter). Merging them is a real layout change and has not been done.

## What matches

Verified frame by frame across the four viewports:

- **Journey deck** — both tiers, replicated from measurement: the sticky pile
  below 1440 and the joined-panel → gaps → flip-fan row at 1440. 58 sweep frames
  down and back up.
- **Scroll statement** — pinned word-by-word opacity wipe, dot grid, measure and
  type scale.
- **Services** — six numbered rows (the reference has six too; an earlier note
  claiming five was wrong), deliverables + thumbnail at desktop, `+`-toggle
  accordion below 810px, and the cream CTA centred under the list **at every
  width**.
- **Featured work** — ghost-zoom heading, 44% centre-peek carousel with dimmed
  neighbours and ghost arrows, caption beneath; vertical list below 810px.
- **Hero and closing** — photographic base under the measured multiply gradient,
  screen hotspot, vignette, grain, parallax on the closing card.
- **Nav** — wide bar over the hero shrinking to a centred pill past it; the
  mobile pill morphing into a dropdown with the page scrolling behind it.
- **Section reordering below 810px** and the `tab:` breakpoint placement.

## Still open

Three `TODO(mike)` markers, and nothing else, in `src/`:

1. **Hero headline** — `hero.line1` / `line2` / `sub`, in both `en.ts` and
   `es.ts`. The reference italicises a word in its second line; ours will want
   the same treatment once the copy exists.
2. **Stat marks** — the four rows take an optional `mark: { src, alt }` and ship
   without one, showing the source company as text instead.
3. **Portrait** — `/art/founder-mike.svg` is still the generated placeholder.

Plus the stats/founders merge above, if it is ever wanted.
