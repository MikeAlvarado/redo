# NOTES — deviations from the reference, and measured corrections

## Measured vs. the brief's estimated tokens (full data: reference/tokens.md)

| Token | Brief estimated | Measured on redomedia.co | Shipped |
|---|---|---|---|
| Cream (text high) | #EDE8E0 | rgb(234,231,224) #EAE7E0 | #EAE7E0 |
| Accent hot | #E2542C | rgb(250,104,0) #FA6800 (gradient stop) | #FA6800 (`--color-ember`) |
| Accent deep | #8C2416 | rgb(204,0,0) #CC0000 (gradient stop) | #CC0000 (`--color-blood`); #8C2416 kept as `--color-oxblood` for card duotones |
| Hero gradient | "radial hot orange → deep oxblood" | `radial-gradient(55% 94% at 48.7% 6.5%, #FA6800 0%, #CC0000 48.16%, #0F0F0F)` | exactly the measured gradient |
| Hero/footer card radius | ~24px | ~16–20px | 20px (`--radius-shell`) |
| Nav pill radius | ~18px | ~16px | 16px |
| CTA radius | ~10px | 8px, cream bg, 34px tall | 8px |
| Service thumbnail | ~10px radius, 16:10 | 6px radius, 16:9 (381×215) | 6px, 16:9 |
| Statement type | ~64px @1440 | 64px, -0.06em, lh ~1.0–1.1 (Times Now SemiLight) | clamp → 67px max, -0.04em (Instrument Serif metrics differ) |
| Statement dormant | cream 18% | ~18–22% | 18% (`DORMANT_OPACITY`) |
| Stats numerals | upright w/ leading zero | 80px Times Now SemiLight **Italic**, -0.06em; leading zero only during the roll | italic serif, 2-digit pad while rolling |
| Nav | "centered floating pill" | full-content-width bar: wordmark left / links center / CTA right | full-width bar per the live site |

## Structural deviations (all deliberate, per the brief's rules)

1. **Journey cards**: brief described a 3-card fan spreading apart; the live
   site pins the heading and DEALS the cards into a stack with alternating
   tilt (charcoal, red, charcoal). Followed the live site; hook keeps the
   `useCardFan` name from the brief. Mobile: vertical stack (chosen over an
   Embla swipe deck — simpler, nothing hidden).
2. **Marquee placement**: lives at the bottom of the pinned statement viewport
   (as on the live site), so it is composed into `ScrollStatement` via a
   `footer` prop rather than stacked after the pin.
3. **Founders section**: the live site has tilted founder profile cards between
   stats and footer. Omitted — this is a solo portfolio; the closing CTA
   carries the contact role.
4. **Fonts**: Times Now (commercial, JHA) → Instrument Serif. The site's own
   grotesque stack (Mona Sans Variable / Roboto) → Mona Sans Variable, which is
   SIL OFL. Letter-spacing loosened from the measured -0.06em to -0.04em
   because Instrument Serif is narrower than Times Now at display sizes.
5. **Imagery**: reference photography (Creation-of-Adam hands, classical
   statues) replaced with original layered SVG ridges/arcs + measured gradient
   + generated grain. Reference asset URLs were unreadable through the browser
   privacy layer anyway; nothing was downloaded.
6. **Stats "016+" style**: on the live site the leading zero appears only
   mid-roll. Kept the brief's fixed leading zero (2-digit pad) during the roll;
   the final value shows unpadded once digits settle (e.g. 24+), matching the
   live end state.
7. **Statement pin length**: reference consumes ~1013px (~120vh) of scroll at a
   ~840px viewport; brief said ~180vh. Shipped 180% on desktop (brief), 120% on
   mobile so nobody is trapped — both within what the reference reads like.
8. **Language crossfade** is a 280ms WAAPI opacity dip on the whole page
   (`useLanguageFade`) rather than per-node crossfades — no remounts, so GSAP
   pins survive the switch.

## Toolchain notes

- Node 22.21.1 → 24.19.0 (jsdom 30 requires ^22.22.2; 24.19.0 is latest LTS).
- TS 7.0.2 exists but typescript-eslint caps at <6.1.0 → TS 6.0.3.
- eslint 10 exists but eslint-plugin-jsx-a11y peers ≤9 → eslint 9.39.5.
- `npm outdated` therefore lists exactly those held packages (plus @types/node
  pinned to the Node 24 line); `npm ls` is clean, no --force/--legacy-peer-deps.

## Audit pass measurements (2026-08-25, headless Chromium against the live site)

### Journey deck — stack variant (measured at 430×932; same behavior at 768 and 1240)

- Section `#journey-1`: height 2185, pin ≈ 1253px (~134vh at 430; ~113vh at
  768; ~143vh at 1240). Shipped: `+=135%`.
- Cards 307×419 (~72vw, ratio 0.733), radius ~8–10px. Shipped
  `w-[min(320px,72vw)] aspect-[0.733] rounded-[10px]`.
- Settle: tilts −4/+4/−4; card tops 263/271/443 → staircase offsets ≈
  0 / +2% / +38% of card height. Shipped `STACK_SETTLE`.
- Deal-in: entering card observed at −20° (settle −4°) and y ≈ +130% → shipped
  over-rotation ±16° on top of settle, y from +130%.
- Card 1 is SILVER (light face, dark text) — confirmed at 430 and 1240.
- Card title 32px / lh 35.2, body 14px / lh 19.6 → shipped `text-[2rem]` +
  `text-sm` (card interior scales with the ~72vw card).

### Journey deck — fan variant (measured at 1440×900, section id `#journey`)

- Pin 2160px (240vh). Shipped `+=240%`.
- Three 334×464 cards in a row, 32px gaps; face-down until ~28% of the pin
  (backs form one continuous mountain image), flip rotateY 180→0, then tilt to
  −15/0/+10 (AABBs 443×535 and 409×515 confirm the cards stay 334×464 and
  rotate in place). Center card stacks on top (z 1/3/2).
- The mountain triptych is an original SVG (`public/art/deck-back.svg`,
  1066×464); backs use `background-position: -366px * index`.
- The reference's own breakpoints disagree about the heading: two lines with
  italic "you" below ~1440, one line with italic "in" at 1440. Shipped: italic
  "you" everywhere, `\n` break hidden at ≥90rem (deliberate difference, logged).

### Founders (audit-supplied mobile numbers + own desktop measurement)

- Cards ~305×380, radius 10px, tilts −6/+4 (right card measured +4.0 at both
  430 and 1440; left card per audit −6), overlap ≈24px vertical on mobile,
  ≈16px horizontal on desktop. Disc measured 121px (audit ~142 at 314vw) →
  shipped 130px. Name: display serif italic, pure white, ~40px (shipped
  2.5rem); role 16px cream; links 14px with a hairline vertical divider.

### Mobile structure corrections (evidence in reference/shots/)

- `430-showcase.jpg`: mobile showcase is a vertical list — full-width cards,
  left-aligned title + pills per card, NO arrows/dots/peek.
- `430-reviews.jpg`: mobile testimonial card = small portrait (~84px) top-left
  with name/role beside it, quote below, wordmark bottom-left, dots below card.
- Mobile nav trigger: ~36px circle, hairline border, four-dot diamond glyph.

### Font shootout (3.6) — reference/self-check/font-shootout.png

Times Now (SemiLight + italics) is commercial and cannot ship. Candidates set
side by side at 64px with the same tracking against the reference headings:

- **Instrument Serif (kept)** — condensed, high-contrast roman matches Times
  Now's tight display setting; its italic keeps the same compact rhythm the
  reference headings have.
- Newsreader — warmer, closer italic *in isolation*, but its roman is wider and
  bookish at display sizes; headings lose the reference's compactness.
- Bodoni Moda — contrast far too extreme, geometric rather than Times-like.

Mona Sans Variable is the UI face on the live site itself and is SIL OFL —
shipped exactly (verified loading via `document.fonts`: both faces `loaded`).

### @theme tokens after re-sampling (which moved)

- `--color-ink` #050505 → **#000000** (live body is pure black).
- `--color-surface` #141414 → **#161616** (tile/journey charcoal sampling).
- Journey/founder card radius → **10px** (was rounded-2xl 16px).
- `--text-section` min 2.4rem → **2.75rem** (mobile section headings ~44–48px).
- Unchanged after re-check: cream #EAE7E0 (measured value already shipped),
  hero gradient stops (#FA6800/#CC0000/#0F0F0F, measured exactly in pass 1),
  CTA radius 8px, thumb radius 6px, hairline white/8%, shell radius 20px.

### Second compare run — additional measured corrections (2026-08-25)

- Mobile services: accordion (collapsed rows + circular + toggle, ~20px titles,
  12px numbers) with a cream CTA below the list. Desktop rows unchanged.
- Mobile section order on the live site: … showcase → reviews → stats → client
  wall → founders → closing (desktop: … showcase → client wall → reviews →
  stats → founders). Reproduced with flex order wrappers below `md`.
- Client wall: heading is ~14–16px dim UI text; tiles 3-up (~64px) on mobile,
  compact on desktop (live shows 8-up at 1440 with ~30 logos; shipped 6-up with
  the 12 placeholder wordmarks — density parity returns when Mike adds real
  logos).
- Stats mobile: numeral left ~44px italic serif, label 16px, body 13–14px,
  row layout (not stacked).
- Statement measure ~78rem at 1440 (66rem was breaking lines early); mobile
  statement ≈36px.
- Journey heading is smaller than other section headings at 1440 (~40px) —
  `deck:text-[2.5rem]`.
- "Featured work" ghost entrance: ~2.7x scale scrub settling over ~65vh.
- Deck stack: card 1 settled at pin start; deal windows re-mapped to cards 2-3;
  settle x-offsets −3/+4/−1 (silver tucks behind red).
- Deck fan: backs start JOINED (one wide landscape), split 22–40% of pin, flip
  28–60% staggered, tilt 50–85%.

### Third compare run (final) — remaining corrections

- Phone patterns hold to ~810px on the live site (Framer tablet boundary):
  introduced `--breakpoint-tab: 50.625rem` and moved services/showcase/
  testimonials/stats/grid/founders/order switches from 768 to 810.
- 1440 testimonials on the live site are a sliding peek carousel (72–76%
  center slide, dimmed neighbors, circular arrows) — not the crossfading
  full-width card of the sub-1440 variant. Converted; crossfade removed.
- Desktop closing footer has quick links right of the email — added.
- Final verdicts: reference/compare/report.md — 120/120 PASS. Remaining
  deliberate differences (noted per row): original art instead of the
  reference's photography; placeholder client/testimonial/project content;
  one founder card instead of two; italic emphasis word in the journey
  heading; deck deal timing runs slightly ahead of the reference.
