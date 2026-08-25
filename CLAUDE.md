# CLAUDE.md — Mike Alvarado portfolio (Redo Media design study)

A pixel/motion-faithful recreation of the layout and interaction design of
redomedia.co, rebuilt as Mike Alvarado's portfolio. All content is Mike's
(placeholders marked `TODO(mike)`); all shipped assets are original. The
reference material lives in `/reference/` and is quarantined — `npm run
check:assets` fails the pipeline if `src/` ever references it.

## Architecture

- **Entry**: `index.html` → `src/main.tsx` (fonts + globals.css) → `App.tsx`.
- **Providers**: `LanguageProvider` wraps the site. It exposes two SPLIT
  contexts (`LanguageValueContext`, `LanguageSetterContext` in `src/i18n/context.ts`)
  so a setter identity can never re-render value consumers. Language persists to
  `localStorage["portfolio.lang"]` through `useLocalStorage`
  (`useSyncExternalStore`-backed, cross-tab safe). Default is `en`, never
  sniffed from the browser. Language never appears in the URL.
- **Motion split** (never duplicated across libraries):
  - *Scroll-driven* work (pins, scrubs, one-shot scroll reveals, count-ups)
    lives in GSAP + ScrollTrigger, always through `useGSAP` from `@gsap/react`
    (StrictMode-safe cleanup), always inside a hook — never in a section body.
  - *Component-state* work (mount intros, hover, overlay enter/exit, shared
    element `layoutId`) lives in `motion`.
  - Lenis provides smooth scrolling; `useLenis` syncs it to `gsap.ticker` and
    `ScrollTrigger.update`. Lenis ≥1.x animates native window scroll, so
    `scrollerProxy` is unnecessary for pinning (see Decision log).
- **Sections** compose hooks + markup only. If a section needs bespoke motion
  math it gets a colocated hook (`Services/useServiceRow.ts`,
  `Showcase/useShowcaseSlides.ts`).
- **Data layer** (`src/data/`): projects, services, journey cards, clients,
  testimonials, stats. Localized fields are `LocalizedString`
  (`Record<'en'|'es', string>`), picked with `l()` from `useLanguage`. Chrome/UI
  strings live in the dictionaries (`src/i18n/en.ts` / `es.ts`), which share the
  `Dictionary` type — a missing key in either language is a compile error.
- **Overlay state** lives in `location.hash` (`#project/<slug>`), read via
  `useSyncExternalStore` on `hashchange`, so an open project survives refresh
  without a router.

## Hook inventory (`src/hooks/`, one file + one test each)

| Hook | Owns |
|---|---|
| `useLenis` | Lenis instance, gsap.ticker sync, `scrollToAnchor`/`pauseLenis`/`resumeLenis` module registry |
| `useScrollProgress` | 0..1 ScrollTrigger progress for a ref'd element (ref + callback, no per-frame setState) |
| `useWordReveal` | Statement pin + per-word opacity wipe; pure math exported as `wordProgress`/`wordOpacity` |
| `useCardFan` | Journey deck pin; `stack` (deal-in staircase) and `fan` (flip + fan) modes; math exported as `stackCardState`/`fanCardState` |
| `useParallax` | Scrubbed background translate/scale for the closing card |
| `useRevealOnScroll` | Shared one-shot enter reveal (y/opacity, optional selector + fn stagger) |
| `useCountUp` | Stat number roll with fixed leading zero; final value under reduced motion |
| `useLiveClock` | Ticking clock, `America/Monterrey`, interval cleaned |
| `useMarquee` | Marquee pause on hover/focus; static flag under reduced motion (loop itself is CSS `animate-marquee`) |
| `useScrollSpy` | Active section id from IntersectionObserver, drives nav state |
| `useMediaQuery` | `matchMedia` via `useSyncExternalStore` |
| `usePrefersReducedMotion` | Single source of truth, built on `useMediaQuery` |
| `useLocalStorage` | Typed, validated, `useSyncExternalStore`-backed storage with cross-tab sync |
| `useLanguage` | `{ lang, setLang, t, l }` from the split contexts |
| `useLanguageFade` | Short WAAPI crossfade on language change (skipped under reduced motion) |
| `useBodyScrollLock` | Locks scroll (overlay/menu), pauses Lenis, restores exactly |
| `useFocusTrap` | Focus containment + restore for overlay and mobile menu |
| `useCarousel` | Embla wrapper: `viewportRef`, selected index, scroll fns, can-scroll state |

## Conventions

- Function components only; React 19 `ref` as prop; no `forwardRef`, no classes.
- No `useEffect` for derived state; `useSyncExternalStore` for anything outside
  React (storage, media queries, hash).
- **Flexbox first.** `npm run check:layout` reports every grid utility in `src/`.
- Comments: only (1) non-obvious formulas, (2) license/legal constraints,
  (3) browser/library workarounds with a link — plus `TODO(owner): reason`.
  `no-inline-comments` is enforced by ESLint; the rest is reviewed by grep.
- Colocation: each section folder holds its component, optional hook, and
  barrel `index.ts` exposing one symbol. No deep imports across sections.
- All user-facing strings (aria-labels and alt text included) come from the
  dictionaries or localized data fields.

## Layout exceptions

None. `npm run check:layout` reports zero grid usage. (Deliberate overlaps —
journey deck cards, carousel arrows over peeking slides, layered card
backgrounds, founder-card overlap — use absolute positioning or negative
margins, which flex cannot express; that list is overlap-only, not grid.)

## Decision log

- 2026-08-24 — Hoisted the nested `redo/redo` Vite scaffold to the repo root:
  single-app repo, paths match the brief.
- 2026-08-24 — Node 24.19.0 (latest LTS via nvm): local 22.21.1 failed jsdom
  30's `^22.22.2` floor; 24 satisfies every engine range.
- 2026-08-24 — TypeScript held at 6.0.3: typescript-eslint 8.68 peers
  `>=4.8.4 <6.1.0` (TS 7.0.2 is the Go-based compiler, unsupported there).
- 2026-08-24 — ESLint held at 9.39.5: eslint-plugin-jsx-a11y 6.10.2 peers
  eslint ^3–^9. Both holds keep runtime deps newest; this is why
  `npm outdated` lists eslint/@eslint/js/typescript (and @types/node, pinned to
  the Node 24 line).
- 2026-08-24 — Fonts: site loads commercial Times Now → substituted
  **Instrument Serif** (open); UI face is **Mona Sans Variable**, which the live
  site itself loads and is SIL OFL. Self-hosted via @fontsource (no external
  requests, deterministic e2e).
- 2026-08-24 — Journey section follows the LIVE SITE (cards deal into a pinned
  stack with alternating tilt), not the brief's "fan spread" description; the
  hook keeps the brief's `useCardFan` name. ~~Mobile flattens to a vertical
  stack.~~ (Reversed 2026-08-25, see Audit pass below.)
- 2026-08-24 — Marquee loop is a CSS keyframe animation (translate -50% on a
  duplicated track); the hook only manages pause/reduced-motion. Cheaper than a
  JS rAF loop, same visual.
- 2026-08-24 — Lenis wired per its official GSAP recipe (scroll → ScrollTrigger.update,
  raf → gsap.ticker). `scrollerProxy` omitted: Lenis 1.x scrolls the real
  window, so ScrollTrigger pinning works natively.
- 2026-08-24 — ~~Live-site "founders" section omitted: solo portfolio.~~
  (Reversed 2026-08-25: built as a data-driven contact-card section, see Audit
  pass below.)
- 2026-08-24 — Clock timezone `America/Monterrey`, location code "MTY, MX".
- 2026-08-24 — Testimonials crossfade uses the official `embla-carousel-fade`
  plugin (same 8.6.0 major as core) instead of hand-rolled stacked slides.
- 2026-08-24 — `tailwind-merge` extended with the custom font-size utilities
  (`text-hero/section/statement/numeral`) — stock config classifies unknown
  `text-*` as colors and silently drops them.
- 2026-08-25 — Language toggle renders `EN`/`ES` as DOM text (not CSS
  `uppercase`): accessible names must match what tests and AT users see.
- 2026-08-25 — Reference assets could not be downloaded (browser privacy layer
  blocks reading Framer CDN URLs); measurement done via computed styles and
  screenshots instead, which the brief's rules made sufficient.

### Audit pass (2026-08-25) — reversals and new decisions

- **REVERSED** "Mobile journey flattens to a vertical stack" (2026-08-24). The
  live site keeps the pinned tilted deck at every width. The flatten was a
  permission the original brief offered that the reference contradicts. The
  section now renders ONE JSX tree at all widths; `useCardFan` drives a
  `stack` mode (<90rem: deal-in staircase, measured −4/+4/−4, card 3 ~38%
  lower, ~72vw cards, pin 135%) and a `fan` mode (≥90rem: the live desktop
  behavior — three 334×464 cards whose backs form a mountain triptych, rotateY
  flip, then fan to −15/0/+10 over a 240% pin). Evidence:
  `reference/shots/{430,1240,1440}-journey-p*.jpg`, `reference/measure-live*.json`.
- **CORRECTED** the pass-1 "deal-into-stack is the desktop behavior" reading:
  that was the sub-1440 breakpoint variant (verified at 1240 and 1322); at 1440
  the reference flips and fans. Card 1 is SILVER (light face, dark text), not
  charcoal — retoned.
- **REVERSED** the invented mobile showcase carousel (86% slides + dots). The
  live mobile showcase is a vertical list with per-card captions
  (`reference/shots/430-showcase.jpg`). Embla now deactivates below 768px via
  its `breakpoints: {active:false}` option — same tree, arrows and the
  desktop caption hidden by CSS, per-slide captions shown, dots removed.
- **REVERSED** the mobile testimonial layout: live mobile puts a small portrait
  + name/role header row above the quote, wordmark bottom-left
  (`reference/shots/430-reviews.jpg`). Rebuilt with CSS-swapped header/footer
  blocks in one tree.
- **REVERSED** "founders section omitted." This pass's spec includes it as a
  contact card section; built `Founders` (stats → closing) driven by
  `src/data/founders.ts`, valid with 1–3 entries (Mike ships alone).
- Nav mobile trigger corrected: 36px circle, hairline border, 4-dot diamond
  glyph drawn inline (was a 40px rounded square with a lucide hamburger).
- Journey heading now carries an explicit `\n` break (two lines below 90rem,
  matching the reference's mobile/tablet variants; hidden via `deck:hidden` at
  1440 where the reference sets one line). Kept italic on "you" everywhere even
  though the reference's 1440 variant italicizes "in" instead — the reference
  is internally inconsistent between its own breakpoints; one dictionary
  string cannot vary its emphasis per viewport, and "you" is the emphasis the
  stack variants use.
- DOM-querying hooks (`useCardFan`, `useWordReveal`, `useRevealOnScroll`,
  `useServiceRow`) now warn loudly in dev when their query matches nothing —
  the silent empty query is how the deck defect survived — each covered by a
  test, plus a JourneyCards test asserting `[data-deck-card]` exists at every
  width.
- `npm run compare` added: captures reference + build at 4 viewports (en+es for
  the build) across enter/mid/leave frames (pin progress 0/33/66/100 for pinned
  sections), builds side-by-side contact sheets, and gates on hand-assigned
  verdicts in `reference/compare/verdicts.json` → `reference/compare/report.md`.
  Exits non-zero on any FAIL or missing verdict.

### Findings from the first full compare run (2026-08-25, all fixed)

- Mobile services on the live site are an ACCORDION (collapsed numbered rows
  with a + toggle; the deliverables + thumbnail expand) and a cream CTA sits
  under the list on mobile. Rebuilt `ServiceRow` as one tree: the panel is a
  max-height/opacity collapsible below `md`, always open at `md+`; toggle is
  `md:hidden` with `aria-expanded`/`aria-controls`. Mobile-only CTA added.
- The live site REORDERS sections on mobile: reviews follow the showcase, the
  client wall follows stats. Implemented with flex `order-*` wrappers on
  `main`'s children (`md:order-none` restores source order) — DOM order stays
  the desktop order, so no tree changes.
- The client wall heading is small dim UI text (not a display heading) and its
  tiles are compact (3-up mobile, ~64px tall; denser on desktop). Restyled;
  headings' `*` markers removed from the grid dictionary strings.
- Mobile stats keep the numeral-left row layout (I had stacked them);
  `--text-numeral` re-clamped to ~44px mobile / 80px desktop (measured).
- "Featured work" enters as a scrubbed GHOST (~2.7x, fading in) on the live
  site → `Showcase/useGhostZoom.ts`. Its from-opacity is 0 (not the visual
  ~0.12) so axe doesn't flag the resting state; the fade-in reads the same.
- Deck stack timing corrected: card 1 is already settled at pin start on the
  live site (cards 2 and 3 deal during the pin); settle x-offsets tightened
  (silver tucks behind red). Deck fan starts with the three backs JOINED as one
  wide landscape that splits before the flip. `useCardFan` now applies its
  progress-0 state at mount — before this, cards rendered untransformed until
  the first scroll tick (the p0 frames caught it).
- The statement column was too narrow (66rem vs the reference's ~78rem measure)
  and its mobile floor too small → `max-w-[77rem]`, min 2.25rem.
- Journey section gets `overflow-x-clip`: the over-rotated entering card's
  AABB exceeds a 320px viewport (the reference overflows there too; our gate
  doesn't allow it).
- Footer stacks email-above-copyright on mobile (matches reference).
- The reference's PHONE patterns extend to ~810px (Framer tablet boundary): at
  768 the live site still shows the accordion/list/mobile order. Added a
  `tab:` breakpoint (50.625rem) and moved every pattern switch that the
  compare run proved belongs there from `md:` to `tab:` (services, showcase,
  testimonials, stats, grid columns, founders row, section order).
- At true 1440 the live testimonials are a SLIDING peek carousel with ghost
  arrows (the full-width crossfade card I measured in pass 1 was the sub-1440
  variant seen through the browser extension at 1322 CSS px). Converted:
  Embla fade plugin removed, 72% center slides with dimmed peeking neighbors
  and arrows at `deck:`, dots kept. The original brief's "crossfade" call is
  another spec-vs-site conflict resolved in the site's favor.
- The desktop closing footer carries quick links (Services / Featured Work /
  Reviews) right of the email — added at `nav:`.

## Blockers

- Times Now (display serif) is commercial → shipped Instrument Serif and logged
  the substitution; metrics differ slightly (Instrument is a touch narrower).
- Original photography (hero hands, closing statues) is Redo Media's → shipped
  original layered SVG/gradient backdrops that preserve the palette and mood.
- `npm outdated` cannot come back fully empty while eslint 9 / TS 6 holds stand
  (see Decision log); this is the documented §3.2 conflict-resolution outcome.

## Adding content

- **New project**: append to `src/data/projects.ts` (both locales for every
  `LocalizedString`), drop cover/gallery files in `public/art/`, set
  `featured: true` to show it in the carousel. The overlay, hash-routing, pills,
  and captions pick it up automatically.
- **New UI string**: add the key to `src/i18n/types.ts`, then to BOTH `en.ts`
  and `es.ts` (the compiler enforces the second half), and read it via
  `useLanguage().t`.

## Scripts

| Script | What it gates |
|---|---|
| `npm run dev` / `build` / `preview` | Vite dev server / production build (`tsc -b` first) / serve build |
| `npm run lint` | ESLint flat config, `--max-warnings 0` |
| `npm run typecheck` | `tsc --noEmit` on the app project |
| `npm run test` / `test:watch` / `test:cov` | Vitest (jsdom, GSAP/Lenis fakes); cov enforces 80% statements on hooks+lib |
| `npm run e2e` | Playwright: overflow sweep, language persistence, keyboard carousels, overlay focus, reduced motion, axe (en+es), self-check screenshots |
| `npm run check:layout` | Reports every grid utility in `src/` (must match the exception list above) |
| `npm run check:assets` | FAILS if `src/` imports from `/reference/` |
| `npm run verify` | lint → typecheck → test → check:layout → check:assets → build → e2e |

Node version: `.nvmrc` (24.19.0). GSAP ships under its standard no-charge
license (not MIT) — fine for this personal portfolio, noted in README.
