import type { LocalizedString } from '../i18n/types'

export interface ServiceRow {
  id: string
  index: string
  title: LocalizedString
  items: LocalizedString[]
  image: string
  imageAlt: LocalizedString
}

// TODO(mike): adjust the service list and deliverables to what you actually offer.
export const services: ServiceRow[] = [
  {
    id: 'product',
    index: '01',
    title: { en: 'Product Design', es: 'Diseño de producto' },
    items: [
      { en: 'User Research & Analysis', es: 'Investigación y análisis de usuarios' },
      { en: 'UX Audits', es: 'Auditorías de UX' },
      { en: 'MVP Planning & Design', es: 'Planeación y diseño de MVP' },
      { en: 'UI Design & Prototyping', es: 'Diseño de UI y prototipado' },
      { en: 'Design Systems', es: 'Sistemas de diseño' },
    ],
    image: '/art/service-product.svg',
    imageAlt: {
      en: 'Abstract preview artwork for product design',
      es: 'Arte abstracto para diseño de producto',
    },
  },
  {
    id: 'web',
    index: '02',
    title: { en: 'Websites', es: 'Sitios web' },
    items: [
      { en: 'Website Design & Development', es: 'Diseño y desarrollo de sitios' },
      { en: 'Web Apps & Platforms', es: 'Apps y plataformas web' },
      { en: 'Web Revamps', es: 'Rediseños web' },
      { en: 'Performance Optimisation', es: 'Optimización de rendimiento' },
      { en: 'SEO Foundations', es: 'Bases de SEO' },
    ],
    image: '/art/service-web.svg',
    imageAlt: {
      en: 'Abstract preview artwork for websites',
      es: 'Arte abstracto para sitios web',
    },
  },
  {
    id: 'brand',
    index: '03',
    title: { en: 'Brand & Identity', es: 'Marca e identidad' },
    items: [
      { en: 'Brand Positioning', es: 'Posicionamiento de marca' },
      { en: 'Logo & Visual Identity', es: 'Logotipo e identidad visual' },
      { en: 'Brand Guidelines', es: 'Manual de marca' },
      { en: 'Pitch Decks', es: 'Presentaciones de pitch' },
    ],
    image: '/art/service-brand.svg',
    imageAlt: {
      en: 'Abstract preview artwork for brand work',
      es: 'Arte abstracto para trabajo de marca',
    },
  },
  {
    id: 'ai',
    index: '04',
    title: { en: 'AI-Powered Solutions', es: 'Soluciones con IA' },
    items: [
      { en: 'AI Applications', es: 'Aplicaciones de IA' },
      { en: 'Agentic Workflows', es: 'Flujos agénticos' },
      { en: 'AI Chat Experiences', es: 'Experiencias de chat con IA' },
      { en: 'Intelligent Integrations', es: 'Integraciones inteligentes' },
    ],
    image: '/art/service-ai.svg',
    imageAlt: {
      en: 'Abstract preview artwork for AI solutions',
      es: 'Arte abstracto para soluciones de IA',
    },
  },
  {
    id: 'motion',
    index: '05',
    title: { en: 'Motion & Interaction', es: 'Motion e interacción' },
    items: [
      { en: 'Motion Graphics', es: 'Motion graphics' },
      { en: 'Micro-interactions', es: 'Micro-interacciones' },
      { en: 'Scroll Experiences', es: 'Experiencias de scroll' },
      { en: 'Interactive Presentations', es: 'Presentaciones interactivas' },
    ],
    image: '/art/service-motion.svg',
    imageAlt: {
      en: 'Abstract preview artwork for motion design',
      es: 'Arte abstracto para motion design',
    },
  },
  {
    id: 'consulting',
    index: '06',
    title: { en: 'Consulting & Audits', es: 'Consultoría y auditorías' },
    items: [
      { en: 'Product Strategy', es: 'Estrategia de producto' },
      { en: 'Technical Audits', es: 'Auditorías técnicas' },
      { en: 'Team Enablement', es: 'Capacitación de equipos' },
      { en: 'Roadmap Reviews', es: 'Revisión de roadmaps' },
    ],
    image: '/art/service-consulting.svg',
    imageAlt: {
      en: 'Abstract preview artwork for consulting',
      es: 'Arte abstracto para consultoría',
    },
  },
]
