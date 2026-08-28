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
            ├─ ClientGrid        flex-wrap wordmark tile wall, diagonal reveal
            ├─ Testimonials      Embla peek carousel + dots — renders null while empty
            ├─ Stats             italic serif numerals, count-up on enter, optional company mark
            ├─ Founders          tilted contact card(s), data-driven (1..n entries)
            ├─ Credentials       quiet hairline strip: YC, PMP, Scrum, Six Sigma, degree
            └─ ClosingCta        parallax red card + contact links + footer (page ends here)

src/hooks/    20 hooks carry ALL animation/subscription/storage logic (each tested)
src/i18n/     Dictionary type + en/es dictionaries (missing keys = compile error)
src/data/     projects (GENERATED), services, journey, clients, credentials,
              contact, founders, testimonials, stats
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

## Where the content comes from

Every word, number, name and image on this site is traceable to one of three
sources. **Nothing here is invented** — if a value is not in one of these, the
field keeps a `TODO(mike)` marker instead of a plausible-looking guess.

| Source | What it supplies |
|---|---|
| The `portfolio` repo (Next.js, `~/Developer/personal/portfolio/portfolio`) | All eleven projects (titles, descriptions, roles, tags, image alts, links, years) in both locales, the project screenshots, the meta/nav/statement/closing copy, and the full contact link set |
| `Mike_Alvarado_Tech.pdf` (CV v3.2, July 2026) | The stat numbers, the client organizations, every service deliverable, the credentials strip |
| `github.com/MikeAlvarado` | Which repositories are public, and therefore which projects may carry a `repo` link |

Three fields are deliberately unfinished and marked `TODO(mike)`:
the hero headline (`hero.line1`/`line2`/`sub` in **both** `src/i18n/en.ts` and
`es.ts`), the four stat company marks (`src/data/stats.ts`), and Mike's portrait
(`src/data/founders.ts`). `grep -rn "TODO(mike)" src/` should return exactly
those three lines and nothing else.

## Adding a project

`src/data/projects.ts` is **generated** — do not edit it by hand.

1. Add the project in the `portfolio` repo: an entry in `PROJECT_META`
   (`components/sections/Projects.tsx`) plus its content block in **both**
   `messages/en.json` and `messages/es.json`. Drop its screenshots in
   `portfolio/public/projects/`.
2. Write its one-line summary in `SUMMARIES` in
   `scripts/import-portfolio-content.mjs` (redo shows a summary; the portfolio
   does not have one).
3. To feature it in the carousel, add its `i18nKey` to `FEATURED` in the same
   script — that array *is* the carousel order.
4. If it has a public repository, add the URL to `PUBLIC_REPOS` there too. A
   repo not on that list ships with no `repo` link on purpose: a link to a
   private repo 404s for every visitor.
5. Run it:

```bash
npm run import:content                    # reads the default portfolio path
PORTFOLIO_DIR=/path/to/portfolio npm run import:content
```

The script fails loudly and writes nothing if a key or field exists in one
locale but not the other, if a `tags` array has different lengths across
locales, or if a featured key or summary is missing. On success it converts the
new screenshots to WebP into `public/projects/` and rewrites `projects.ts` with
each image's real dimensions.

## Editing everything else

- **Copy**: `src/i18n/en.ts` and `src/i18n/es.ts` — both files share one
  `Dictionary` type, so the compiler tells you if a translation is missing.
  Headings support `*word*` markers for the italic serif emphasis and `\n` for
  an explicit line break.
- **Services / journey cards / clients / credentials / stats / founders /
  contact links**: the matching file in `src/data/`. All localized fields are
  `{ en, es }` pairs.
- **Testimonials**: `src/data/testimonials.ts` ships as `[]` and the section
  renders nothing, which also removes the "Reviews" nav and footer links. Paste
  real quotes in and the whole section — carousel, dots, keyboard, nav link —
  comes back with no other change.
- **Stat marks**: give a row `mark: { src, alt }` and it renders a small muted
  logo beside the numeral; leave it off and the row shows the company name as
  text. Both are covered by tests.

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
| sharp (dev only) | WebP conversion + image sizing in `import:content` |
| clsx + tailwind-merge | Class composition (merge extended for custom text sizes) |
| lucide-react | Icons |
| @fontsource: Instrument Serif, Mona Sans Variable | Self-hosted open fonts |
| Vitest + Testing Library + jsdom | Unit/hook tests (GSAP/Lenis faked) |
| Playwright + @axe-core/playwright | E2E, responsive, a11y |

**License note**: GSAP is not MIT — it ships under GreenSock's standard
"no charge" license, which covers a personal portfolio like this one. Instrument
Serif and Mona Sans are SIL OFL. `public/projects/` holds Mike's own project
screenshots; `public/art/` holds CC0 photographs (sources in NOTES.md) and
generated placeholder art.

## Credit

Design study of the layout and motion design of
[Redo Media](https://redomedia.co/) — all content, copy, and assets here are
original to Mike Alvarado. Reference measurements and screenshots live in
`/reference/` and are never bundled.
