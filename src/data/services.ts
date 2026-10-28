import type { LocalizedString } from '../i18n/types'

export interface ServiceRow {
  id: string
  index: string
  title: LocalizedString
  items: LocalizedString[]
  image: string
  imageAlt: LocalizedString
}

// Six layers Mike ships end to end. Every item is evidenced by a repository
// under ~/Developer/personal or by a line in the CV (v3.2).
export const services: ServiceRow[] = [
  {
    id: 'native',
    index: '01',
    title: { en: 'Native Apps', es: 'Apps nativas' },
    items: [
      { en: 'Swift & SwiftUI', es: 'Swift y SwiftUI' },
      { en: 'WidgetKit, Live Activities, watchOS', es: 'WidgetKit, Live Activities, watchOS' },
      { en: 'React Native', es: 'React Native' },
      { en: 'Keychain, no-server architectures', es: 'Keychain, arquitecturas sin servidor' },
      { en: 'App Store delivery, 8 languages', es: 'Publicación en la App Store, 8 idiomas' },
    ],
    image: '/projects/aimeter-hero.webp',
    imageAlt: {
      en: "AIMeter header graphic reading 'All your AI limits, one glance' next to an iPhone with usage bars and Home Screen widgets",
      es: "Gráfico de AIMeter que dice 'All your AI limits, one glance' junto a un iPhone con barras de uso y widgets de pantalla de inicio",
    },
  },
  {
    id: 'web',
    index: '02',
    title: { en: 'Web & Frontend', es: 'Web y frontend' },
    items: [
      { en: 'React 19, TypeScript, Vite', es: 'React 19, TypeScript, Vite' },
      { en: 'Astro, React Router, prerendering', es: 'Astro, React Router, prerenderizado' },
      { en: 'GSAP and three.js motion', es: 'Motion con GSAP y three.js' },
      { en: 'Design systems and tokens', es: 'Sistemas de diseño y tokens' },
      { en: 'Accessibility, axe-clean', es: 'Accesibilidad, limpio en axe' },
    ],
    image: '/projects/mediterra-hero.webp',
    imageAlt: {
      en: "Mediterra homepage hero in cream and deep green with the headline 'Preventive medicine, with time to listen'",
      es: "Hero de la página principal de Mediterra en crema y verde profundo con el titular 'Preventive medicine, with time to listen'",
    },
  },
  {
    id: 'backend',
    index: '03',
    title: { en: 'Backend & Cloud', es: 'Backend y nube' },
    items: [
      { en: 'Node, Express, Firebase Functions', es: 'Node, Express, Firebase Functions' },
      { en: 'Firestore, Firebase Auth, Cloud Run', es: 'Firestore, Firebase Auth, Cloud Run' },
      { en: 'Stripe, REST APIs', es: 'Stripe, APIs REST' },
      { en: 'Rate limits, read caps, abuse controls', es: 'Límites de tasa, topes de lectura, control de abuso' },
      { en: 'SQLite local-first stores', es: 'Stores local-first en SQLite' },
    ],
    image: '/projects/midflight-item.webp',
    imageAlt: {
      en: 'A midflight item page in dark mode with its checkpoints, prompts and linked sessions',
      es: 'Una página de item de midflight en modo oscuro con sus checkpoints, prompts y sesiones ligadas',
    },
  },
  {
    id: 'engines',
    index: '04',
    title: { en: 'Engines & Math', es: 'Motores y matemáticas' },
    items: [
      { en: 'Rust no_std, UniFFI, WebAssembly', es: 'Rust no_std, UniFFI, WebAssembly' },
      { en: 'Physics models from the literature', es: 'Modelos físicos de la literatura' },
      { en: 'Audited formulas, cited sources', es: 'Fórmulas auditadas, fuentes citadas' },
      { en: 'Validation against real data', es: 'Validación contra datos reales' },
    ],
    image: '/projects/preride-route.webp',
    imageAlt: {
      en: 'preride route page: the Chipinque climb on a terrain map with the weather window and the time estimate',
      es: 'Página de ruta de preride: la subida a Chipinque sobre un mapa de terreno con la ventana de clima y la estimación de tiempo',
    },
  },
  {
    id: 'ai',
    index: '05',
    title: { en: 'AI & Agents', es: 'IA y agentes' },
    items: [
      { en: 'Claude Code plugins, hooks, MCP servers', es: 'Plugins de Claude Code, hooks, servidores MCP' },
      { en: 'Agent-directed delivery, several sessions in parallel', es: 'Entrega dirigida por agentes, varias sesiones en paralelo' },
      { en: 'ML Kit OCR, on-device inference', es: 'OCR con ML Kit, inferencia en el dispositivo' },
      { en: 'Pinecone', es: 'Pinecone' },
    ],
    image: '/projects/midflight-graph.webp',
    imageAlt: {
      en: "midflight's graph view: tickets grouped by repository, with the Now panel listing live sessions",
      es: 'Vista de grafo de midflight: tickets agrupados por repositorio, con el panel Now listando sesiones vivas',
    },
  },
  {
    id: 'leadership',
    index: '06',
    title: { en: 'Engineering Leadership', es: 'Liderazgo técnico' },
    items: [
      { en: 'Built and led a 6-person team', es: 'Armé y lideré un equipo de 6' },
      { en: 'Code review standards', es: 'Estándares de code review' },
      { en: 'CI/CD with GitHub Actions', es: 'CI/CD con GitHub Actions' },
      { en: 'PostHog-informed roadmaps', es: 'Roadmaps informados con PostHog' },
      { en: 'CTO to CEO at a YC company', es: 'De CTO a CEO en una empresa de YC' },
    ],
    image: '/projects/y-combinator-kodda.webp',
    imageAlt: {
      en: 'Kodda company profile on Y Combinator listing the Summer 2021 batch and founders',
      es: 'Perfil de Kodda en Y Combinator mostrando el batch de verano 2021 y los fundadores',
    },
  },
]
