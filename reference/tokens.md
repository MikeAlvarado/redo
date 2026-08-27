# Measured tokens — redomedia.co (captured 2026-08-24, Chrome, ~1440x900 window)

Note: the capture window rendered at CSS viewport 1322px (browser zoom), dpr 2.
Where a value scales with viewport, treat it as ~1322-relative; ratios were used
when converting to clamp() values. Screenshots in ./shots/ are 1439px wide.

## Typography (computed)

| Element | family | size | weight | style | line-height | letter-spacing | color |
|---|---|---|---|---|---|---|---|
| Logo "Redo." | Times Now SemiBold Italic | 26px | 600 | italic | 26px (1.0) | -0.52px (-0.02em) | rgb(234,231,224) |
| Nav link | Roboto | 14px | 400 | normal | 14px | 0 | rgb(234,231,224), dimmed ~60% inactive |
| CTA "Get In Touch" | Roboto | ~14px | 500 | normal | — | 0 | dark on cream #EAE7E0, radius 8px, h 34px |
| Hero h1 | Times Now SemiLight | ~64px visual (2 lines) | 400 | normal | ~1.0 | -0.06em | rgb(255,224,224) w/ soft glow |
| Section h2 ("With our services") | Times Now SemiLight | 64px | 400 | normal | 64px (1.0) | -3.84px (-0.06em) | rgb(234,231,224) |
| Scroll statement | Times Now SemiLight | ~58–64px | 400 | normal | ~1.0–1.1 | -0.06em | cream, dormant ~18–22% |
| Closing headline | Times Now SemiLight | 54.4px | 400 | normal | 51.1px (0.94) | -3.26px (-0.06em) | rgb(255,212,212) |
| Service number "(01)" | Roboto | 16px | 400 | normal | 17.6px | -0.02em | rgba(255,255,255,0.6) |
| Service title | Roboto | 32px | 400 | normal | 35.2px (1.1) | -0.02em | rgb(234,231,224) |
| Deliverables list | Roboto | ~16px | 400 | normal | ~1.7 (28px rows) | 0 | dim cream ~60% |
| Testimonial quote | Roboto | 19.2px | 400 | normal | 26.9px (1.4) | -0.01em | rgb(234,231,224) |
| Stats numeral "24+" | Times Now SemiLight Italic | 80px | 400 | italic | 96px (1.2) | -4.8px (-0.06em) | dim cream |
| Footer copyright | Roboto | 16px | 400 | normal | 19.2px | 0 | rgb(255,219,219) (pink tint over red card) |
| Footer email | Inter/Roboto | 16px | 400 | normal | 19.2px | 0 | rgb(255,242,242), underlined |
| Body copy (subheads) | Roboto | ~17–18px | 400 | normal | ~1.5 | 0 | dim cream ~65% |

Fonts loaded by the site: Times Now (SemiLight, SemiLight Italic, SemiBold Italic,
Light Italic) — commercial (JHA); Mona Sans Variable (open, OFL); Roboto; Inter.
Visible UI text computes to Roboto.

## Colors

- Page background: rgb(0,0,0) body; deep sections read #050505–#0a0a0a
- Cream (text high / cream surfaces): rgb(234,231,224) #EAE7E0
- Cream secondary: same hue at ~60% opacity
- Statement dormant: cream at ~18–22% opacity
- Hairline dividers: rgba(255,255,255,~0.08)
- Surface (logo tiles, journey charcoal cards): ~#161616 with subtle top-light
- Testimonial card: ~#101010, dot grid inside, hairline border
- Hero/footer text over red: pink-tinted whites rgb(255,224,224) / rgb(255,212,212)

## Hero gradient (measured exactly from computed backgroundImage)

radial-gradient(55% 94% at 48.7% 6.5%,
  rgb(250,104,0) 0%,        /* hot orange */
  rgb(204,0,0) 48.16%,      /* pure red   */
  rgb(15,15,15) ~100%)      /* near-black */

Layered over a photographic image ("Creation of Adam" hands), grain on top.
Inner glow card radius 16px. Closing CTA uses classical-statue photo with red
duotone + heavy grain, same family of reds.

## Radii

- Hero card / closing card: ~16–20px (measured 16px on inner gradient card)
- Nav pill: ~16px, translucent dark + backdrop blur, spans content width
- CTA button: 8px, cream bg, height 34px
- Service thumbnail: 6px, ~381x215 (16:9)
- Category pills (showcase): fully rounded, 1px outline, dim cream
- Client tiles / journey cards: ~10–16px

## Layout

- Page side inset: hero/footer card inset ~36px from viewport at 1440 (visual)
- Content width: ~1280px effective; services rows span content, title col left,
  list col starts ~33%, thumbnail col right ~29% wide
- Hero card height: ~92vh; nav floats over it, top ~24px, full content width
- Dot grid: ~1px dots, ~24px pitch, rgba(255,255,255,~0.05), visible in
  statement section and inside testimonial card
- Marquee: single row, logos desaturated dim, edge fade masks, slow linear loop
  (~40s), "Trusted by 60+ Organizations" lockup with laurel marks LEFT of track

## Scroll distances (document 12,764px tall at ~840px viewport)

| Section | top | height | notes |
|---|---|---|---|
| header/hero | 0 | 772 (100vh) | intro anim on load, not scroll-driven |
| scroll-text (statement+marquee) | 772 | 1853 | statement pinned ~1000px (~120vh); word wipe maps to pin progress |
| journey-1 | 2625 | 2184 | pinned deck: heading fixed, 3 cards deal in atop each other (~160vh of scroll) |
| services | 4809 | 2347 | 6 rows, reveal on enter, not pinned |
| work (showcase) | 7156 | 1544 | giant "Featured work" fades in from oversized ghost, then carousel |
| client grid | 8700 | 958 | 6-col tile wall |
| reviews | 9658 | 813 | single card + dot pagination (11 dots) |
| stats | 10471 | 786 | 3 rows, italic serif numerals count up |
| founders | 11257 | 774 | two tilted cards (NOT recreated — solo portfolio) |
| footer/closing | 12031 | 733 | inset card, eyebrow + headline + CTA + footer bar |

## Motion notes (observed)

- Statement wipe: word-by-word opacity lift, left-to-right in reading order,
  overlapping windows (reads continuous), no filter animation per word.
- Journey deck: cards enter rotated (~±8deg) and stack; red card is card 2.
  Each card has line icon top-left, 2-line title, description bottom.
- Journey card content (reference): "Going Zero to One" (trend icon, charcoal),
  "Scaling from One to N" (circles icon, red gradient), "Need Quick Solutions"
  (sparkle icon, charcoal).
- "Featured work": italic "Featured" + upright "work"; enters as huge ghost
  (~2.5x, low opacity) shrinking/fading into place.
- Showcase: active slide ~44vw, neighbors peek at ~0.3 opacity / ~0.94 scale,
  ghost circular arrow buttons overlap neighbors, title + outlined pills below.
- Stats numerals show leading-zero style ("016+") mid-roll → final "16+".
- Closing card: statue photo parallax, content fades up late; footer bar inside
  card below a hairline: copyright left, underlined email right.
- Live clock bottom-left of hero ("11:27 PM"), location code bottom-right
  ("PNQ, IND"), "Scroll to Explore" centered bottom.

## Corrections vs the build brief (brief said → measured)

- Journey cards: brief described a 3-card fan spreading on scroll; live site
  deals cards INTO a stack with alternating rotation under a pinned heading.
  → Following the live site.
- Nav pill: brief said "centered pill ~24px from top"; live nav spans the full
  content width (wordmark left / links center / CTA right in one bar).
  → Following the live site.
- CTA radius: brief ~10px → measured 8px. Hero card radius: brief ~24px →
  measured ~16px. Service thumb radius: brief ~10px → measured 6px; ratio 16:9
  not 16:10.
- Statement dormant: brief cream 18% → reads ~18–22%; keeping 18%.
- Stats: numerals are ITALIC serif with trailing "+"; leading zero appears
  only during the roll on the live site ("016+" → "16+").
- Site has a "founders" section (two tilted profile cards) the brief omits —
  omitted deliberately (solo portfolio); noted in NOTES.md.

## Journey deck — per-tier keyframes (measured 2026-08-26, headless Chromium, `window.innerWidth` asserted in-page before every table)

Measurement rule (after the zoom incident): a measurement without its viewport
width is invalid. Every table below states the asserted `innerWidth`.

### Tier ≥1440 — `#journey` (measured at innerWidth **1500**, viewport 1500×900)

Section 3060px tall; the card row stays fixed on screen (CSS sticky) through
~2160px of scroll (~240vh). Everything scroll-scrubbed — a held scroll
position never moves (spring probe negative). Base card 334×464. z left→right
ascending (right card on top). p = scroll into the fixed range / 2160.

| p | card AABB w | spacing (centers) | rotZ | rotY (faces) | note |
|---|---|---|---|---|---|
| 0.00 | 401 | 395 (touching) | 0 | 180 (backs) | joined landscape, scale 1.2 |
| 0.18 | 365 | 364 (touching) | 0 | 180 | shrinking as one unit |
| 0.32 | 334 | 366 → 32px gaps | 0 | 180 | shrink done, gaps open |
| 0.32–0.60 | 334 | 366 | 0 | 180 | hold, face-down |
| 0.60–0.67 | — | 366 → 335 | 0 → −15/0/+10 | 180 → 0 | flip + tilt + pull-in |
| 0.67–1.00 | 443/334/409 | 335 | −15/0/+10 | 0 (faces) | settled fan, scrolls away in it |

Heading: absent at p0, fully in by ~p0.2. Settled AABB math confirms base
334×464 (334·cos15 + 464·sin15 = 443 ✓).

### Tier <1440 — `#journey-1` (measured at innerWidth **1200** and **430**; identical behavior and geometry at both, only x-centering differs)

Section ~2190px tall, **not pinned** — no section-level fixing; instead each
card sits in flow ~595px below the previous and is `position: sticky` at
**263px** from the viewport top, so later cards slide over earlier ones into
a covered pile. All cards release together at the section end and the pile
scrolls away whole. Base card ≈ 281×383 (AABB 307 at settle tilt 4°:
281·cos4 + 383·sin4 = 306 ✓; AABB 400 at −20°: ✓). Rotation lives on the
card element (matrix3d, rotZ); the rotY 180 back-face children exist but the
container never flips in this tier. z = arrival order (last card on top).

| card | entry rotZ (far) | settle rotZ | opacity | note |
|---|---|---|---|---|
| 1 | ~−9 | −4.0 | fades 0→1 over the last ~500px of approach | sticks first |
| 2 | ~+10 | +4.0 | always 1 | slides over card 1 |
| 3 | −20 | −4.1 → −4.0 | always 1 | slides over both, tops the pile |

Rotation easing observed over the last ~500px before the sticky stop
(≈ from 'top 85%' to 'top 263px' at a 900px viewport). Settled container
tops 263/271/~263 (near-identical); heading is sticky ~120px from the
viewport top and stays above the pile through the sequence.
