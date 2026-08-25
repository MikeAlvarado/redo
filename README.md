# Mike Alvarado — Portfolio

A single-page portfolio for Mike Alvarado. The site is a **design study
recreating the layout and motion design of [redomedia.co](https://redomedia.co/)**
— the typography system, the ember-red gradient world, the pinned word-by-word
scroll statement, the dealt card deck, the peek carousel — rebuilt from scratch
with original content and original assets. No Redo Media copy, imagery, or
fonts ship with this site.

Bilingual (EN/ES), fully keyboard-operable, `prefers-reduced-motion` aware.

## Architecture

```
index.html
└─ src/main.tsx            fonts (@fontsource) + styles/globals.css (Tailwind v4 @theme)
   └─ App.tsx
      └─ LanguageProvider  split value/setter contexts, localStorage-backed
         ├─ Nav            scroll-spy links, EN/ES toggle, mobile menu (<900px)
         └─ main
            ├─ Hero              gradient card, word-by-word intro, live clock
            ├─ ScrollStatement   pinned word wipe (≈30 words), marquee at its foot
            ├─ JourneyCards      pinned deck: stack-deal below 1440, flip-fan at 1440
            ├─ Services          6 numbered flex rows, divider draw, thumbnail lift
            ├─ Showcase          center-peek Embla carousel → ProjectOverlay (#project/<slug>)
            ├─ ClientGrid        flex-wrap logo tile wall, diagonal reveal
            ├─ Testimonials      Embla fade + autoplay, dot pagination
            ├─ Stats             italic serif numerals, count-up on enter
            ├─ Founders          tilted contact card(s), data-driven (1..n entries)
            └─ ClosingCta        parallax red card + footer bar (page ends here)

src/hooks/    18 hooks carry ALL animation/subscription/storage logic (each tested)
src/i18n/     Dictionary type + en/es dictionaries (missing keys = compile error)
src/data/     projects, services, journey, clients, testimonials, stats
e2e/          Playwright: overflow, language, keyboard, focus, reduced-motion, axe
```

## Quickstart

Requires Node **24.19.0** (see `.nvmrc`; `nvm use` picks it up).

```bash
npm install
npm run dev        # http://localhost:5173
npm run test       # unit + hook tests (Vitest)
npm run e2e        # Playwright suite (npx playwright install chromium once)
npm run verify     # the full gate: lint → typecheck → test → checks → build → e2e
npm run compare    # side-by-side fidelity check against redomedia.co (see reference/compare/report.md)
```

## Replacing placeholder content

Everything marked `TODO(mike)` is placeholder voice:

- **Copy**: `src/i18n/en.ts` and `src/i18n/es.ts` — both files share one type,
  so the compiler tells you if a translation is missing. Headings support
  `*word*` markers for the italic serif emphasis.
- **Projects**: `src/data/projects.ts` — add an entry (both locales), drop a
  cover + gallery images into `public/art/`, keep `featured: true`.
- **Services / journey cards / stats / testimonials / clients**: matching files
  in `src/data/`.
- **Art**: current covers are generated abstract SVGs (`scripts/gen-art.mjs`).
  Swap in real `.webp` screenshots at the same paths, keep explicit
  width/height.

## Stack

| Dependency | Role |
|---|---|
| React 19 + TypeScript (strict) | UI |
| Vite 8 | Build tool |
| Tailwind CSS v4 | Styling, CSS-first `@theme` tokens (no config file) |
| GSAP + ScrollTrigger (`@gsap/react`) | Every scroll-driven effect: pins, scrubs, reveals, count-ups |
| Lenis | Smooth scrolling, synced to the GSAP ticker |
| Motion (`motion`) | Mount intros, hover, overlay transitions, shared-element `layoutId` |
| Embla (`-react`, `-autoplay`, `-fade`) | Showcase + testimonial carousels |
| clsx + tailwind-merge | Class composition (merge extended for custom text sizes) |
| lucide-react | Icons |
| @fontsource: Instrument Serif, Mona Sans Variable | Self-hosted open fonts |
| Vitest + Testing Library + jsdom | Unit/hook tests (GSAP/Lenis faked) |
| Playwright + @axe-core/playwright | E2E, responsive, a11y |

**License note**: GSAP is not MIT — it ships under GreenSock's standard
"no charge" license, which covers a personal portfolio like this one. Instrument
Serif and Mona Sans are SIL OFL. Everything in `public/art/` is generated for
this repo.

## Credit

Design study of the layout and motion design of
[Redo Media](https://redomedia.co/) — all content, copy, and assets here are
original to Mike Alvarado. Reference measurements and screenshots live in
`/reference/` and are never bundled.
