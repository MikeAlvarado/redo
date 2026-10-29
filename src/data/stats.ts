import type { LocalizedString } from '../i18n/types'

export interface StatMark {
  src: string
  alt: LocalizedString
}

export interface StatRow {
  id: string
  value: number
  prefix?: string
  suffix?: string
  group?: boolean
  source: string
  label: LocalizedString
  body: LocalizedString
  mark?: StatMark
}

// Five numbers about people and community, in Mike's voice. 8,000+ and the
// Kodda dates (Aug 2020 to Jan 2026) come from the CV (v3.2); the FIRST,
// VantTec and Women in Technology mentoring is listed there too; 30+ is
// Mike's own account; the four products are read from git.
export const stats: StatRow[] = [
  {
    id: 'kodda-users',
    value: 8000,
    suffix: '+',
    group: true,
    source: 'Kodda',
    label: { en: 'People who used Kodda', es: 'Personas que usaron Kodda' },
    body: {
      en: 'We started with 30. They came for pet insurance and stayed for their own wellbeing, and every step of that change came from listening to them.',
      es: 'Empezamos con 30. Llegaron por un seguro para su mascota y se quedaron por su propio bienestar, y cada paso de ese cambio salió de escucharlas.',
    },
    mark: {
      src: '/art/marks/kodda-wordmark-cream.svg',
      alt: { en: 'Kodda wordmark', es: 'Logotipo de Kodda' },
    },
  },
  {
    id: 'kodda-people',
    value: 30,
    suffix: '+',
    source: 'Kodda',
    label: { en: 'People I worked alongside', es: 'Personas con las que trabajé' },
    body: {
      en: 'At Kodda I worked with more than 30 people at once and learned from them constantly. Helping them grow in their careers was an honor.',
      es: 'En Kodda trabajé con más de 30 personas a la vez y aprendí de ellas constantemente. Ayudarlas a crecer en su carrera fue un honor.',
    },
    mark: {
      src: '/art/marks/kodda-wordmark-cream.svg',
      alt: { en: 'Kodda wordmark', es: 'Logotipo de Kodda' },
    },
  },
  {
    id: 'kodda-years',
    value: 5,
    source: '2020 – 2026',
    label: { en: 'Years building Kodda', es: 'Años construyendo Kodda' },
    body: {
      en: 'From the first version to Y Combinator, from CTO to CEO. Long enough to be wrong, change course, and keep going.',
      es: 'De la primera versión a Y Combinator, de CTO a CEO. Lo suficiente para equivocarme, cambiar de rumbo y seguir.',
    },
    mark: {
      src: '/art/marks/kodda-wordmark-cream.svg',
      alt: { en: 'Kodda wordmark', es: 'Logotipo de Kodda' },
    },
  },
  {
    id: 'communities',
    value: 3,
    source: 'FIRST · VantTec · WIT',
    label: { en: 'Communities I mentored in', es: 'Comunidades donde fui mentor' },
    body: {
      en: 'FIRST Robotics team 5133, regional champions in 2020; the VantTec RoboBoat team; Women in Technology. Giving back is where I keep learning.',
      es: 'El equipo 5133 de FIRST Robotics, campeón regional en 2020; el equipo RoboBoat de VantTec; Women in Technology. Devolver es donde sigo aprendiendo.',
    },
  },
  {
    id: 'shipped-2026',
    value: 4,
    source: '2026',
    label: { en: 'Products shipped this year', es: 'Productos publicados este año' },
    body: {
      en: 'AIMeter, Vitrina, Mediterra and hazlofacil.co, built on my own with coding agents, each one for someone specific who needed it.',
      es: 'AIMeter, Vitrina, Mediterra y hazlofacil.co, construidos por mi cuenta con agentes de código, cada uno para alguien concreto que lo necesitaba.',
    },
  },
]
