import type { LocalizedString } from '../i18n/types'

export interface Testimonial {
  id: string
  quote: LocalizedString
  name: string
  role: LocalizedString
  company: string
  portrait: string
  portraitAlt: LocalizedString
}

// TODO(mike): replace with real quotes, names, and permission-cleared portraits.
export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote: {
      en: '"TODO(mike): a real client quote about working with you goes here. Two or three sentences reads best in this card."',
      es: '"TODO(mike): aquí va una cita real de un cliente sobre trabajar contigo. Dos o tres oraciones se leen mejor en esta tarjeta."',
    },
    name: 'Laura R.',
    role: { en: 'Founder', es: 'Fundadora' },
    company: 'Atlas',
    portrait: '/art/portrait-0.svg',
    portraitAlt: { en: 'Portrait of Laura R.', es: 'Retrato de Laura R.' },
  },
  {
    id: 't2',
    quote: {
      en: '"TODO(mike): second placeholder quote. Swap this out with real words from a real collaborator."',
      es: '"TODO(mike): segunda cita provisional. Cámbiala por palabras reales de un colaborador real."',
    },
    name: 'Daniel M.',
    role: { en: 'Product Lead', es: 'Líder de producto' },
    company: 'Ledger',
    portrait: '/art/portrait-1.svg',
    portraitAlt: { en: 'Portrait of Daniel M.', es: 'Retrato de Daniel M.' },
  },
  {
    id: 't3',
    quote: {
      en: '"TODO(mike): third placeholder quote. Keep the strongest one last."',
      es: '"TODO(mike): tercera cita provisional. Deja la más fuerte al final."',
    },
    name: 'Sofía O.',
    role: { en: 'CEO', es: 'CEO' },
    company: 'Bloom',
    portrait: '/art/portrait-2.svg',
    portraitAlt: { en: 'Portrait of Sofía O.', es: 'Retrato de Sofía O.' },
  },
]
