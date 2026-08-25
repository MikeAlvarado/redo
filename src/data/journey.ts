import type { LocalizedString } from '../i18n/types'

export interface JourneyCard {
  id: string
  tone: 'silver' | 'red' | 'charcoal'
  icon: 'trend' | 'orbit' | 'spark'
  title: LocalizedString
  body: LocalizedString
}

// TODO(mike): tune these three audience cards to the clients you want.
export const journeyCards: JourneyCard[] = [
  {
    id: 'zero-to-one',
    tone: 'silver',
    icon: 'trend',
    title: { en: 'Going\nZero to One', es: 'De cero\na uno' },
    body: {
      en: "If you're shaping a new idea and need a first version the world can touch",
      es: 'Si estás dando forma a una idea nueva y necesitas una primera versión tangible',
    },
  },
  {
    id: 'one-to-n',
    tone: 'red',
    icon: 'orbit',
    title: { en: 'Scaling from\nOne to N', es: 'Escalar de\nuno a N' },
    body: {
      en: "If you've found your fit and want design and code that keep up with growth",
      es: 'Si ya encontraste tu mercado y quieres diseño y código que crezcan contigo',
    },
  },
  {
    id: 'quick-help',
    tone: 'charcoal',
    icon: 'spark',
    title: { en: 'Need Quick\nSolutions', es: 'Soluciones\nrápidas' },
    body: {
      en: 'If you know exactly what you need and want a safe pair of hands to ship it',
      es: 'Si sabes exactamente qué necesitas y quieres manos expertas que lo entreguen',
    },
  },
]
