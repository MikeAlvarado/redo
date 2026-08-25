# PLAN — Redo Media design recreation (Mike Alvarado portfolio)

## Toolchain check (recorded per brief §3.1)

- Local: `node v22.21.1`, `npm 10.9.4`, `nvm 0.40.4` present.
- v22.21.1 satisfies Vite's `^20.19.0 || >=22.12.0` but NOT jsdom 30's
  `^22.22.2` → installed Node **24.19.0** (Latest LTS: Krypton, read from
  `nvm ls-remote --lts`), npm 11.17.0. `.nvmrc` = 24.19.0.
- Version resolution recorded in `reference/deps.md`.

## Architecture (chosen)

- Vite 8 + React 19 + TS 6 strict, Tailwind v4 CSS-first (`@theme` in
  `src/styles/globals.css`), no `tailwind.config.js`.
- Scroll-driven motion: GSAP ScrollTrigger via `useGSAP`; component-state
  motion: `motion`. Lenis for smooth scroll, synced to `gsap.ticker`.
- Split language contexts (value / setter), `localStorage` via
  `useSyncExternalStore`. No router: project overlay reflects state in the hash.
- All logic in `src/hooks/*` (one file, one responsibility, one test each);
  section components compose hooks + markup only. Flexbox-first.
- Content: Mike's copy in `src/i18n/en.ts` / `es.ts` with `TODO(mike)` markers;
  data-driven showcase in `src/data/projects.ts`. No Redo Media copy ships.
- Assets: `reference/` is quarantined (build fails if `src/` imports it);
  shipped art is generated/original (CSS gradients + grain + original photos).

## Tasks

- [x] 1. Reference pass at 1440 — screenshots in `reference/shots/`, measured
      tokens in `reference/tokens.md` (mobile shots via Playwright, task 12)
- [x] 2. Toolchain: Node 24.19.0, `.nvmrc`; hoisted nested `redo/redo` scaffold
      to repo root
- [x] 3. Dependency resolution → `reference/deps.md`
- [x] 4. Install deps; scripts; ESLint 9 flat config (jsx-a11y peer caps at 9);
      Prettier; Vitest setup (matchMedia/IO/RO mocks, GSAP/Lenis fakes);
      Playwright config; `check:layout` + `check:assets` scripts
- [x] 5. Foundation: `globals.css` tokens (@theme), fonts, `lib/` (cn, easing,
      format), i18n provider + dictionaries + heading-markup renderer, data
      files, core hooks (`useMediaQuery`, `usePrefersReducedMotion`,
      `useLocalStorage`, `useLanguage`, `useLenis`, `useRevealOnScroll`,
      `useBodyScrollLock`, `useFocusTrap`, `useScrollSpy`, `useCarousel`,
      `useLiveClock`, `useCountUp`, `useMarquee`, `useParallax`,
      `useScrollProgress`, `useWordReveal`, `useCardFan`) — each with tests
- [x] 6. Layout: Nav (content-width bar, blur, scroll-spy), MobileMenu
      (<900px overlay, focus trap, stagger), LanguageToggle, ui primitives
      (Pill, ArrowButton, DotGrid, GrainOverlay, LiveClock, Reveal)
- [x] 7. §9.1 Hero (gradient card, intro word reveal, clock) → gate
- [x] 8. §9.2 Scroll statement (pinned word wipe) → gate
- [x] 9. §9.3 Client marquee → gate
- [x] 10. §9.4 Journey deck (pinned deal-into-stack per live site; vertical
      stack on mobile) → gate
- [x] 11. §9.5 Services rows → gate
- [x] 12. §9.6 Showcase carousel + ProjectOverlay (+ capture live-site mobile
      reference shots via Playwright) → gate
- [x] 13. §9.7 Client grid → gate
- [x] 14. §9.8 Testimonials → gate
- [x] 15. §9.9 Stats count-up → gate
- [x] 16. §9.10 Closing CTA + footer card → gate
- [x] 17. E2E: overflow sweep, language persistence, keyboard carousels,
      overlay focus, reduced-motion, axe both languages, self-check shots
- [x] 18. Docs current: CLAUDE.md / README.md / NOTES.md; acceptance checklist
      run and pasted into final message

Gate after each section: `npm run lint && npm run typecheck && npm run test`.

## Phase 2 — Audit & fix pass (2026-08-25)

Reference truth re-measured headlessly from the live site (see
`reference/measure-live*.json`, `reference/shots/*journey-p*.jpg`):

- Journey below ~1440: pinned STACK-DEAL — cards ~307×419 (~72vw capped), deal
  from below with ~−20° over-rotation, settle −4/+4/−4 in a staircase
  (card 2 ≈ +2%, card 3 ≈ +38% lower); card 1 is SILVER, 2 red, 3 charcoal;
  pin ≈ 115–145vh. At 1440: FLIP-FAN — three 334×464 cards in a row (32px gap)
  whose face-down backs compose one mountain triptych; they flip (rotateY) and
  fan to −15/0/+10, center on top; pin ≈ 240vh.
- Mobile showcase is a VERTICAL LIST (no carousel/arrows/dots), title+pills
  under each card. Mobile testimonial card: small portrait top-left with
  name/role beside it, quote below, wordmark bottom-left.
- Mobile nav trigger: ~36px circle, 4-dot diamond glyph.
- Founders section exists (stats → closing): serif heading + sub, tilted
  overlapping cards (−6/+4), ~305×380, disc ~121–130px, name 40px serif italic
  white, role 16px cream, 14px link row with divider.

- [x] P2.1 Re-measure live site (deck both modes, founders, nav, showcase,
      reviews, headings)
- [x] P2.2 Fix journey: one JSX tree, stack+fan modes in useCardFan, silver
      card, mountain card backs, mobile pin, deck-not-empty test
- [x] P2.3 Nav trigger: 36px circle + 4-dot diamond SVG
- [x] P2.4 Journey heading: forced break + larger mobile clamp; check all
      MixedHeadings in ES
- [x] P2.5 Card interior scale (title 32px, body 14px at card scale)
- [x] P2.6 Founders section + data/founders.ts + 1/2/3-entry tests
- [x] P2.7 Fonts: verify loading; italic shootout Instrument vs Newsreader;
      record choice
- [x] P2.8 Token re-sample (@theme) and NOTES diff
- [x] P2.9 Showcase mobile = vertical list (embla active:false breakpoint);
      testimonials mobile header row
- [x] P2.10 Hunt: classify every media-query branch; DOM-querying hooks warn
      loudly on empty results + tests
- [x] P2.11 Compare harness (npm run compare): 4 viewports × frames ×
      ref/mine-en/mine-es, contact sheets, verdicts → report.md, non-zero on FAIL
- [x] P2.12 Review every pair, assign PASS/FAIL, fix FAILs, re-run
- [x] P2.13 Docs: decision-log reversals, NOTES measurements; npm run verify

## Decisions made on Mike's behalf (rationale in CLAUDE.md decision log)

- Node 24.19.0; TS 6.0.3 (typescript-eslint peer `<6.1.0`).
- Fonts: Instrument Serif ≈ Times Now (commercial), Mona Sans Variable for UI
  (the live site itself loads Mona Sans; it is SIL OFL). Self-hosted via
  @fontsource.
- Journey section follows the live site at every breakpoint: stack-deal <90rem, flip-fan ≥90rem (corrected in Phase 2).
- ~~Founders section omitted~~ → built in Phase 2 as a data-driven contact card (1..n entries).
- Clock: `America/Monterrey`, location code "MTY, MX".
- ~~Mobile journey: vertical stack~~ → reversed in Phase 2; the deck pins at every width.
- Overlay state in `location.hash` (`#project/<slug>`), survives refresh.
