# Dependency resolution — verified against the npm registry on 2026-08-24

Toolchain: Node **24.19.0** (latest LTS "Krypton", installed via nvm; local
22.21.1 failed jsdom 30's floor of `^22.22.2`), npm **11.17.0**, `.nvmrc`
committed.

## Runtime

| Package | Resolved | engines.node | Peers |
|---|---|---|---|
| react | 19.2.8 | >=0.10.0 | — |
| react-dom | 19.2.8 | — | react 19.2.8 |
| gsap | 3.15.0 | — | — (standard no-charge license, not MIT) |
| @gsap/react | 2.1.2 | — | gsap ^3.12.5, react >=17 |
| lenis | 1.3.26 | — | — |
| motion | 13.1.1 | — | react ^18\|\|^19, react-dom ^18\|\|^19 |
| embla-carousel-react | 8.6.0 | — | react ^16.8–^19 |
| embla-carousel-autoplay | 8.6.0 | — | embla-carousel 8.6.0 (exact) |
| clsx | 2.1.1 | >=6 | — |
| tailwind-merge | 3.6.0 | — | — (v3 line targets Tailwind v4) |
| lucide-react | 1.34.0 | — | react |
| @fontsource-variable/mona-sans | 5.3.0 | — | — |
| @fontsource/instrument-serif | 5.3.0 | — | — |

## Dev

| Package | Resolved | engines.node | Peers / notes |
|---|---|---|---|
| vite | 8.2.2 | ^20.19.0 \|\| >=22.12.0 | — |
| @vitejs/plugin-react | 6.1.0 | ^20.19.0 \|\| >=22.12.0 | vite ^8.0.0 (oxc/rolldown/compiler peers optional) |
| typescript | **6.0.3** | >=16.20.0 | stepped down from 7.0.2: typescript-eslint peers `>=4.8.4 <6.1.0` |
| tailwindcss | 4.3.3 | — | — |
| @tailwindcss/vite | 4.3.3 | — | vite ^5.2 \|\| ^6 \|\| ^7 \|\| ^8 |
| @types/react | 19.2.x | — | — |
| @types/react-dom | 19.2.x | — | — |
| vitest | 4.1.11 | ^20 \|\| ^22 \|\| >=24 | — |
| @vitest/coverage-v8 | 4.1.11 | — | vitest 4.1.11 |
| @testing-library/react | 16.3.2 | >=18 | react/react-dom/@types 18\|\|19, **@testing-library/dom ^10** |
| @testing-library/dom | 10.4.1 | >=18 | — |
| @testing-library/user-event | 14.6.6 | >=12 | @testing-library/dom |
| @testing-library/jest-dom | 7.0.1 | >=22 | — |
| jsdom | 30.0.1 | **^22.22.2 \|\| ^24.15.0 \|\| >=26** | ← forced the Node 24 upgrade |
| @playwright/test | 1.62.1 | >=20 | — |
| @axe-core/playwright | 4.13.0 | — | playwright-core |
| eslint | 10.9.1 | ^20.19 \|\| ^22.13 \|\| >=24 | — |
| typescript-eslint | 8.68.0 | ^18.18 \|\| ^20.9 \|\| >=21.1 | eslint ^8.57\|\|^9\|\|^10, ts >=4.8.4 <6.1.0 |
| eslint-plugin-react-hooks | 7.1.1 | >=18 | eslint 3–10 |
| eslint-plugin-jsx-a11y | 6.10.2 | >=4 | eslint |
| eslint-plugin-react-refresh | 0.5.4 | — | eslint |
| eslint-config-prettier | 10.1.8 | — | eslint |
| prettier | 3.9.6 | >=14 | — |
| prettier-plugin-tailwindcss | 0.8.1 | >=20.19 | prettier ^3 (other plugin peers optional) |

No `--force`, no `--legacy-peer-deps`. Fonts self-hosted via @fontsource
(chosen over a Google Fonts `<link>`: bundled, no external request, deterministic
in e2e).
