import type { LocalizedString } from '../i18n/types'

export interface ServiceRow {
  id: string
  index: string
  title: LocalizedString
  items: LocalizedString[]
  image: string
  imageAlt: LocalizedString
}

// Four rows in Mike's own words (founder, leader, engineer, lifelong
// learner). The first item of each row is the belief; the rest is the
// evidence, every line backed by the CV (v3.2) or a repository under
// ~/Developer/personal.
export const services: ServiceRow[] = [
  {
    id: 'founder',
    index: '01',
    title: { en: 'As a founder', es: 'Como fundador' },
    items: [
      {
        en: 'Great products come from asking the right questions, listening to users, and creating with intention.',
        es: 'Los grandes productos nacen de hacer las preguntas correctas, escuchar a los usuarios y crear con intención.',
      },
      {
        en: 'Co-founded Kodda and took it through Y Combinator (S21).',
        es: 'Cofundé Kodda y la llevé por Y Combinator (S21).',
      },
      {
        en: 'Steered its evolution from pet insurance into a wellness and lifestyle platform, from 30 to 8,000+ users.',
        es: 'Guié su evolución de seguros para mascotas a una plataforma de bienestar y estilo de vida, de 30 a más de 8,000 usuarios.',
      },
      {
        en: 'Now building midflight and preride with the same intention.',
        es: 'Hoy construyo midflight y preride con la misma intención.',
      },
    ],
    image: '/projects/y-combinator-kodda.webp',
    imageAlt: {
      en: 'Kodda company profile on Y Combinator listing the Summer 2021 batch and founders',
      es: 'Perfil de Kodda en Y Combinator mostrando el batch de verano 2021 y los fundadores',
    },
  },
  {
    id: 'leader',
    index: '02',
    title: { en: 'As a leader', es: 'Como líder' },
    items: [
      {
        en: 'My goal is to give people the tools and clarity to do their best work.',
        es: 'Mi meta es darle a la gente las herramientas y la claridad para hacer su mejor trabajo.',
      },
      {
        en: 'Worked alongside more than 30 people at once at Kodda, and learned from them every single day.',
        es: 'Trabajé con más de 30 personas a la vez en Kodda, y aprendí de ellas todos los días.',
      },
      {
        en: 'Helping each of them grow in their careers was an honor, and the part I am proudest of.',
        es: 'Ayudar a cada una a crecer en su carrera fue un honor, y de lo que más orgulloso estoy.',
      },
      {
        en: 'CTO, then CEO, of a Y Combinator company.',
        es: 'CTO y después CEO de una empresa de Y Combinator.',
      },
    ],
    image: '/projects/kodda-app.webp',
    imageAlt: {
      en: 'Kodda mobile app screens showing the wellness and lifestyle experience',
      es: 'Pantallas de la app móvil de Kodda mostrando la experiencia de bienestar y estilo de vida',
    },
  },
  {
    id: 'engineer',
    index: '03',
    title: { en: 'As an engineer', es: 'Como ingeniero' },
    items: [
      {
        en: 'Use technology with purpose and empathy.',
        es: 'Usar la tecnología con propósito y empatía.',
      },
      {
        en: 'Swift and SwiftUI, React and TypeScript, Node and Firebase, Rust.',
        es: 'Swift y SwiftUI, React y TypeScript, Node y Firebase, Rust.',
      },
      {
        en: 'OCR at the register for 70+ supermarkets at Softtek; +37% payment completion at Moneypool.',
        es: 'OCR en caja para más de 70 supermercados en Softtek; +37% de pagos completados en Moneypool.',
      },
      {
        en: 'Accessibility and performance treated as features, not polish.',
        es: 'Accesibilidad y rendimiento tratados como funciones, no como acabado.',
      },
    ],
    image: '/projects/aimeter-hero.webp',
    imageAlt: {
      en: "AIMeter header graphic reading 'All your AI limits, one glance' next to an iPhone with usage bars and Home Screen widgets",
      es: "Gráfico de AIMeter que dice 'All your AI limits, one glance' junto a un iPhone con barras de uso y widgets de pantalla de inicio",
    },
  },
  {
    id: 'learner',
    index: '04',
    title: { en: 'As a lifelong learner', es: 'Como eterno aprendiz' },
    items: [
      {
        en: 'Keep growing in order to keep building.',
        es: 'Seguir creciendo para seguir construyendo.',
      },
      {
        en: 'PMI-PMP training in 2025; Scrum Master and Lean Six Sigma before that.',
        es: 'Formación PMI-PMP en 2025; Scrum Master y Lean Six Sigma antes.',
      },
      {
        en: 'Learned Rust and WidgetKit this year by shipping with them.',
        es: 'Aprendí Rust y WidgetKit este año publicando con ellos.',
      },
      {
        en: 'Four products shipped in 2026, built with coding agents.',
        es: 'Cuatro productos publicados en 2026, construidos con agentes de código.',
      },
    ],
    image: '/projects/preride-route.webp',
    imageAlt: {
      en: 'preride route page: the Chipinque climb on a terrain map with the weather window and the time estimate',
      es: 'Página de ruta de preride: la subida a Chipinque sobre un mapa de terreno con la ventana de clima y la estimación de tiempo',
    },
  },
]
