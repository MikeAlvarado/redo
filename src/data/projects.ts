import type { Locale, LocalizedString } from '../i18n/types'

export type { Locale, LocalizedString }

export interface Project {
  id: string
  slug: string
  title: LocalizedString
  summary: LocalizedString
  description: LocalizedString
  categories: LocalizedString[]
  year: number
  client?: string
  role: LocalizedString
  cover: string
  coverAlt: LocalizedString
  gallery: string[]
  links?: { live?: string; repo?: string; caseStudy?: string }
  featured: boolean
}

// TODO(mike): all five projects are placeholders — swap in your real work.
export const projects: Project[] = [
  {
    id: 'atlas',
    slug: 'atlas',
    title: { en: 'Atlas — Logistics Dashboard', es: 'Atlas — Panel logístico' },
    summary: {
      en: 'Realtime fleet visibility for a regional carrier',
      es: 'Visibilidad de flota en tiempo real para una transportista regional',
    },
    description: {
      en: 'TODO(mike): a paragraph on the problem, the constraints, and what shipped.',
      es: 'TODO(mike): un párrafo sobre el problema, las restricciones y lo que se entregó.',
    },
    categories: [
      { en: 'Product Design', es: 'Diseño de producto' },
      { en: 'Web App', es: 'App web' },
    ],
    year: 2025,
    client: 'TODO Client',
    role: { en: 'Design & Frontend', es: 'Diseño y frontend' },
    cover: '/art/project-atlas.svg',
    coverAlt: {
      en: 'Abstract red gradient artwork for Atlas',
      es: 'Arte abstracto en degradado rojo para Atlas',
    },
    gallery: ['/art/project-atlas-1.svg', '/art/project-atlas-2.svg'],
    links: { live: 'https://example.com' },
    featured: true,
  },
  {
    id: 'ledger',
    slug: 'ledger',
    title: { en: 'Ledger — Fintech Onboarding', es: 'Ledger — Alta fintech' },
    summary: {
      en: 'A five-minute account opening flow',
      es: 'Un flujo de apertura de cuenta en cinco minutos',
    },
    description: {
      en: 'TODO(mike): a paragraph on the problem, the constraints, and what shipped.',
      es: 'TODO(mike): un párrafo sobre el problema, las restricciones y lo que se entregó.',
    },
    categories: [
      { en: 'Product Design', es: 'Diseño de producto' },
      { en: 'Design System', es: 'Sistema de diseño' },
    ],
    year: 2025,
    role: { en: 'Lead Designer', es: 'Diseñador líder' },
    cover: '/art/project-ledger.svg',
    coverAlt: {
      en: 'Abstract red gradient artwork for Ledger',
      es: 'Arte abstracto en degradado rojo para Ledger',
    },
    gallery: ['/art/project-ledger-1.svg', '/art/project-ledger-2.svg'],
    featured: true,
  },
  {
    id: 'pulse',
    slug: 'pulse',
    title: { en: 'Pulse — Health Tracker', es: 'Pulse — Monitor de salud' },
    summary: {
      en: 'Wearable companion app with live metrics',
      es: 'App complementaria de wearable con métricas en vivo',
    },
    description: {
      en: 'TODO(mike): a paragraph on the problem, the constraints, and what shipped.',
      es: 'TODO(mike): un párrafo sobre el problema, las restricciones y lo que se entregó.',
    },
    categories: [
      { en: 'Mobile', es: 'Móvil' },
      { en: 'Motion', es: 'Motion' },
    ],
    year: 2024,
    role: { en: 'Design & Prototyping', es: 'Diseño y prototipado' },
    cover: '/art/project-pulse.svg',
    coverAlt: {
      en: 'Abstract red gradient artwork for Pulse',
      es: 'Arte abstracto en degradado rojo para Pulse',
    },
    gallery: ['/art/project-pulse-1.svg', '/art/project-pulse-2.svg'],
    featured: true,
  },
  {
    id: 'bloom',
    slug: 'bloom',
    title: { en: 'Bloom — DTC Storefront', es: 'Bloom — Tienda DTC' },
    summary: {
      en: 'Headless commerce with editorial pacing',
      es: 'Comercio headless con ritmo editorial',
    },
    description: {
      en: 'TODO(mike): a paragraph on the problem, the constraints, and what shipped.',
      es: 'TODO(mike): un párrafo sobre el problema, las restricciones y lo que se entregó.',
    },
    categories: [
      { en: 'Web', es: 'Web' },
      { en: 'Brand', es: 'Marca' },
    ],
    year: 2024,
    role: { en: 'Design & Build', es: 'Diseño y desarrollo' },
    cover: '/art/project-bloom.svg',
    coverAlt: {
      en: 'Abstract red gradient artwork for Bloom',
      es: 'Arte abstracto en degradado rojo para Bloom',
    },
    gallery: ['/art/project-bloom-1.svg', '/art/project-bloom-2.svg'],
    featured: true,
  },
  {
    id: 'forge',
    slug: 'forge',
    title: { en: 'Forge — Internal Tooling', es: 'Forge — Herramientas internas' },
    summary: {
      en: 'Ops console that cut ticket time in half',
      es: 'Consola de operaciones que redujo tiempos a la mitad',
    },
    description: {
      en: 'TODO(mike): a paragraph on the problem, the constraints, and what shipped.',
      es: 'TODO(mike): un párrafo sobre el problema, las restricciones y lo que se entregó.',
    },
    categories: [
      { en: 'Web App', es: 'App web' },
      { en: 'AI', es: 'IA' },
    ],
    year: 2023,
    role: { en: 'Full-stack', es: 'Full-stack' },
    cover: '/art/project-forge.svg',
    coverAlt: {
      en: 'Abstract red gradient artwork for Forge',
      es: 'Arte abstracto en degradado rojo para Forge',
    },
    gallery: ['/art/project-forge-1.svg', '/art/project-forge-2.svg'],
    featured: true,
  },
]
