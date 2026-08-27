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
| `useCardFan` | Journey deck, replicating the reference per tier (sticky stack <1440 / pinned flip-fan row ≥1440); pure math exported as `stackCardEntry`/`rowCardState`/`rowHeadingOpacity` |
| `useParallax` | Scrubbed background translate/scale for the closing card |
| `useRevealOnScroll` | Shared one-shot enter reveal (y/opacity, optional selector + fn stagger) |
| `useCountUp` | Stat number roll with fixed leading zero; final value under reduced motion |
| `useLiveClock` | Ticking clock, `America/Monterrey`, interval cleaned |
| `useMarquee` | Marquee pause on hover/focus; static flag under reduced motion (loop itself is CSS `animate-marquee`) |
| `useScrollSpy` | Active section id from IntersectionObserver, drives nav state |
| `useScrolledPast` | Boolean "scrolled past 60% of the viewport" flag (`useSyncExternalStore` on scroll), drives the nav shrink |
| `useHeroRecede` | Scrubbed hero exit: the hero card scales down, lifts and dims while the next section slides over it |
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
  ~~fan mode~~ (Fan mode removed 2026-08-26, see Visual polish pass below.)
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

### Visual polish pass (2026-08-26) — deck unification, photo treatment, grain, menu

- **REVERSED** the journey `fan` mode (2026-08-25). The flip-and-fan variant
  exists on the reference only at ≥1440 CSS px — a Framer breakpoint boundary
  that real desktop windows essentially never satisfy (browser chrome, visible
  scrollbars, or zoom put the viewport at 1439.x), so almost every desktop
  visitor sees the tilted pile. Worse, our implementation decided the mode in
  JS (`useMediaQuery('(min-width: 90rem)')`) while layout came from the CSS
  `deck:` variant: two sources of truth sitting on the exact width of a common
  screen. Whenever they disagreed (or before the first ScrollTrigger tick in
  fan mode) the section rendered a clipped row of `deck-back.svg` backs. Fix:
  fan mode, the back faces, `deck-back.svg`, and the JS media query are all
  deleted. One JSX tree, one pile, deal-in staircase everywhere; card width is
  continuous CSS — `min(72vw, max(320px, 22vw))` — so there is **no breakpoint
  at all** to disagree about. Verified structurally identical at
  1280/1380/1439/1440/1441/1600 (`reference/compare/deck/`). `--breakpoint-deck`
  survives only for the testimonial carousel, whose variants are CSS-only
  (single source of truth, no JS mirror).
- Hero + closing backdrops are now treated **photographs** (the reference's
  look is photographic texture under a red-orange wash, not a gradient):
  desaturated CC0 photo base (`grayscale(1) contrast(1.1) brightness(1.15)`),
  multiplied under the measured accent gradient, a `screen` radial to lift the
  hotspot, vignette, grain. Two-size `srcset` WebP, `fetchpriority="high"` on
  the hero only, lazy on the closing. Sources + licenses in NOTES.md; the
  layered SVG ridge backdrops (`HeroBackdrop`/`ClosingBackdrop`) are deleted.
- `GrainOverlay` now animates: 200px `feTurbulence` tile, 8 discrete
  `background-position` jumps over 0.8s with `steps(1)` (~10fps — reads as TV
  static; smooth translate reads as drift). Opacity 7% on hero/closing, 5% on
  journey cards, 4% on testimonial cards. Under reduced motion the grain stays
  visible but static (CSS media query kills the animation). No JS, no canvas,
  one keyframe on a composited layer.
- **REVERSED** the original brief's full-screen mobile menu overlay. The
  reference expands the nav pill itself into a dropdown (measured at 430×932:
  panel inset 24, links 18px/500 cream on a 54px pitch at 20px inset, 1px
  white/12% dividers, full-width cream CTA 40px tall with 16px margins, page
  visible and blurred behind). Rebuilt as a Motion height-auto morph of the
  pill's own container with staggered content fade; trigger toggles with
  `aria-expanded`/`aria-controls`, focus trapped across the whole nav
  (`useFocusTrap` learned to skip `display:none` elements — the desktop links),
  Escape and outside-tap close, focus returns to the trigger. **Body scroll is
  NOT locked** — measured on the reference: the page scrolls behind the open
  dropdown, so `useBodyScrollLock` is no longer used by the menu (the project
  overlay still locks). The language toggle lives as a quiet labeled row above
  the CTA (no reference equivalent — deviation logged in NOTES.md).
- `npm run compare` extended: `nav-open` rows at every viewport (menu opened at
  <900px on both sites; the plain desktop bar at 1440 where no menu exists) and
  a build-only deck acceptance sweep at 1280/1380/1439/1440/1441/1600 ×
  p0/p50/p100, gated by verdicts like every other row.

### Journey deck (2026-08-26, FINAL) — replicate the reference exactly, per tier

- **Journey deck replicates the reference exactly per tier; all invented deck
  choreography withdrawn. Measurements recorded with their viewport widths.**
  The fan-spread and split-with-beat designs from earlier the same day are
  gone — they descended from a measurement taken in a zoomed browser (window
  1760px, `innerWidth` 1322, i.e. the sub-1440 tier misread as "the" desktop
  behavior). New rule: **before recording any measurement of the reference,
  assert `window.innerWidth` in the measured page and write it into the
  notes** (tables + widths: `reference/tokens.md`).
- Two tiers, both scroll-scrubbed (spring probes negative), boundary 1440px:
  - **<1440 ("stack")**: the section is NOT pinned. Three ~281×383 cards sit
    in flow ~595px apart, each CSS `position: sticky` at 263px from the
    viewport top, so later cards slide over earlier ones into a covered pile
    (settle tilts −4/+4/−4 on the cards, z = arrival order) that releases as
    a whole and scrolls away. Approaching cards ease from over-rotated
    entries (−9/+10/−20) over their last ~500px ('top 85%' → 'top 263px'
    scrub triggers, no pin); card 1 also fades in. The heading is sticky at
    ~120px and rides above the pile.
  - **≥1440 ("row")**: a pinned (+=240%) viewport block. The three card
    backs (deck-back.svg triptych, restored) start joined as one landscape at
    scale 1.2, shrink to scale 1 by p0.32 (the 32px gaps open at the 366px
    slot width), hold face-down to p0.6, then flip rotateY 180→0 (slight
    stagger) while tilting to −15/0/+10 and pulling spacing in to 335px;
    settled fan holds and scrolls away. Heading fades in over p0.03–0.18.
- One JSX tree; the tier is decided by a single `useMediaQuery('(min-width:
  90rem)')` value that drives BOTH the layout classes and the hook — the JS/CSS
  two-sources-of-truth mismatch that broke the old fan cannot recur. Pure
  math exported and unit-tested per tier (`stackCardEntry`, `rowCardState`,
  `rowHeadingOpacity`). Reduced motion renders each tier's settled state with
  no triggers (sticky stacking still happens — that is scrolling, not
  animation). Card hover lift removed: not present in the measurements, and
  invented choreography is out.
- `npm run compare` deck sweep replaced: reference-vs-build columns at 1500,
  1200 and 430 (one width per tier, `innerWidth` asserted), stepped through
  the section going down (d0–d100) and back up (u70–u0).

### Animation review (2026-08-26, same day) — fixes from a full motion audit

- **Motion (the library) never respected reduced motion**: only the GSAP hooks
  gated on `usePrefersReducedMotion`. Added `<MotionConfig
  reducedMotion="user">` at the app root (kills transform/layout animations —
  hover springs, overlay slide, `layoutId` — for RM users while keeping safe
  opacity fades) and manually zeroed the mobile menu's height morph + stagger
  under RM, since a height animation is neither transform nor layout and the
  config alone would not stop it.
- (Two deck-specific findings from this audit — a z-order flip timing and a
  deal-in opacity pop — applied to since-withdrawn invented deck designs and
  are moot under the final replicate-the-reference deck.)
- Audited and left as-is: `useWordReveal` (quickSetter, no per-frame React),
  `useRevealOnScroll`/`useServiceRow` (one-shot `once: true` reveals),
  `useGhostZoom`/`useParallax` (scrubbed, RM-gated), `useCountUp` (RM shows
  final value), marquee (CSS keyframe, static branch under RM), grain
  (steps(1) background-position, CSS-stopped under RM), Embla autoplay
  (disabled under RM), `useLanguageFade` (280ms WAAPI dip, RM-gated).
  `useScrollProgress` is currently consumed by no component — kept because
  the brief's hook inventory specifies it.

### Definitive fixes (2026-08-27) — deck parameters, hero exit, nav shrink, back grain

Verified against the reference at Mike's real viewport (~2000px CSS). The row
deck choreography (joined panel → gaps → flip fan) was correct; these are
parameter and missing-piece fixes only.

- **Deck card width is responsive, not frozen at the 1500px measurement.**
  `ROW_CARD_WIDTH = 334` stays only as the unit-test default; the hook now
  measures `cardW = clamp(300, containerWidth * 0.223, 470)` (334 at 1500,
  ~446 at 2000), sets it with `gsap.set`, re-measures on `onRefreshInit`, and
  threads it through `rowCardState(progress, index, cardW)` — every spacing
  (joined `cardW*scale`, gapped `cardW+32`, settle `cardW*(335/334)`) scales
  with it. The `w-[334px]` class is gone.
- **Back art slices proportionally**: `backgroundSize: '300% 100%'` +
  `backgroundPosition: index * 50%` replaced the fixed `1066px 464px` /
  `-366px` slicing that mis-cropped the triptych at any non-334px card width
  (the "seams and cut bands" defect). `BACK_STEP` deleted.
- **No vertical clipping at start scale**: row cards center in the pinned area
  (`top-1/2` + `yPercent: -50`) instead of anchoring `top-6`, so the 1.2×
  panel no longer pokes out. Verified at 2000×1000/1100/1200: card AABBs stay
  inside the viewport at p0.
- **Flip slowed to a readable turn**: `ROW_FLIP_START/END` 0.6/0.7 → 0.45/0.82
  with stagger 0.02 → 0.05, pin `+=240%` → `+=280%` so the gapped hold beat
  survives. Test sample points moved (not weakened) to match.
- **Hero recede added** (`useHeroRecede`): scrubbed over the hero exit
  ('top top' → 'bottom top'), the card goes scale 1 → 0.94, y −3vh,
  brightness 1 → 0.8 from `center top`; skipped under reduced motion.
- **Nav shrinks after the hero** (`useScrolledPast`, `useSyncExternalStore`
  over scroll, flips at `scrollY > innerHeight * 0.6`): wide `bg-black/20`
  bar over the hero → centered `max-w-[62.5rem] bg-black/45` pill past it,
  500ms max-width/background transition.
- **Grain on the deck back faces**: `<GrainOverlay className="opacity-[0.06]">`
  inside the back-face div — the big red joined panel now carries the same
  animated grain as the hero instead of reading flat.

- **Journey card corner radius follows the flip** (`rowCardRadius` in
  `useCardFan`): measured 12px on the reference, and while joined it rounds
  only the outer corners (left card reports `12px 0px 0px 12px`) so the three
  panels read as one rectangle with no notches at the seams. Both faces use
  `rounded-[inherit]` so they follow the GSAP-driven value on `[data-deck-card]`.
- **Nav shrink now actually animates**: it toggled `max-w-none` against a
  length, and CSS cannot interpolate the `none` keyword, so the transition was
  skipped and the pill snapped. Both endpoints are lengths now
  (`max-w-[120rem]` → `max-w-[62.5rem]`).
- **Dot grid retuned to the measured pitch**: reference tiles at 48px; ours was
  24px at 5.5% white, which read as haze rather than a grid. Now 48px with a
  1.2px dot at 10% white.
- **Grain coarsened and made global**: noise tile 200px → 128px to match the
  reference's card tile, plus a fixed full-viewport grain layer at 3.5% (the
  reference carries a page-level grain layer at 0.5 opacity over ~4x the
  viewport; we had grain only on individual cards).
- **DEVIATION, moving grain**: the reference's grain is completely static
  (sampled `background-position` held at `0% 0%` over two seconds, with
  `animation-name: none` and no transform on every grain layer). Mike wants it
  to move, so ours keeps the `grain 0.8s steps(1, end)` animation. Intentional;
  do not "fix" this back toward the reference.

- **Hero is pinned with `position: sticky`, not a scroll transform**: measured
  on the reference, the hero wrapper is `sticky top:0` at full viewport height
  inside the full-page parent, and the hero card itself never scales, fades or
  translates (transform stayed identity and top stayed 0 across a 900px scroll
  sample). The "image recedes" reading comes entirely from the next opaque
  section sliding up over the pinned hero. Implemented in `App.tsx`: hero
  wrapper `sticky top-0 z-0`, every later section wrapper `relative z-10 bg-ink`.
- **Stack-tier cards each get their own sticky containing block**: sharing one
  container made all three release at the same instant, so the last card had
  only the container's bottom padding (160px) of runway against 1350px and
  755px for the first two, and never held at its 263px stop. Each card now sits
  in its own `h-[880px]` slot. The slot must clear the 263px offset plus the
  card's real 402px height before any hold is possible, so 880px gives all
  three an equal ~215px hold.
- **Dot grid tuned brighter again**: 1.2px/10% still read faint against the
  reference; now 1.6px at 14% white on the measured 48px pitch.

- **Stack-tier heading is NOT pinned**: measured on the reference at vw=1189,
  every ancestor of "Where are you in your journey?" is `position: relative`,
  none sticky. Ours pinned it at `sticky top-[120px]` inside an absolutely
  placed container, so the cards slid up through the heading text on their way
  out. The heading is now a normal-flow `mb-14` block for both tiers, and the
  `pt-[390px]` that only existed to clear the absolute heading is gone.

- **Hero also scales down as it recedes** (`useHeroRecede`): comparing the
  reference's own captures at scroll 0 and one viewport down, the hero card
  loses ~25-30px per side on a ~1900px card and its top edge drops ~28px, so
  it scales to ~0.97 while the next section covers it. An earlier pass claimed
  the card never transforms; that measurement had targeted a duplicate hero
  element with opacity 0.001 and was wrong. The recede keys off a numeric
  scroll range (0 to one viewport) because the sticky pin freezes the section's
  own rect, so element-relative start/end would never advance.

## Blockers

- Times Now (display serif) is commercial → shipped Instrument Serif and logged
  the substitution; metrics differ slightly (Instrument is a touch narrower).
- Original photography (hero hands, closing statues) is Redo Media's → shipped
  CC0 photographs (StockSnap, recorded in NOTES.md) under the same measured
  red-orange treatment; nothing is copied or hotlinked from the reference.
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
| `npm run e2e` | Playwright: overflow sweep, language persistence, keyboard carousels, overlay focus, mobile menu (trap/Escape/outside-tap/no scroll lock), reduced motion, axe (en+es), self-check screenshots |
| `npm run check:layout` | Reports every grid utility in `src/` (must match the exception list above) |
| `npm run check:assets` | FAILS if `src/` imports from `/reference/` |
| `npm run verify` | lint → typecheck → test → check:layout → check:assets → build → e2e |

Node version: `.nvmrc` (24.19.0). GSAP ships under its standard no-charge
license (not MIT) — fine for this personal portfolio, noted in README.
