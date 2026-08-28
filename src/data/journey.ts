import type { LocalizedString } from '../i18n/types'

export interface JourneyCard {
  id: string
  tone: 'silver' | 'red' | 'charcoal'
  icon: 'trend' | 'orbit' | 'spark'
  title: LocalizedString
  body: LocalizedString
}

export const journeyCards: JourneyCard[] = [
  {
    id: 'zero-to-one',
    tone: 'silver',
    icon: 'trend',
    title: { en: 'Zero to one', es: 'De cero a uno' },
    body: {
      en: "You have an idea and need a first version people can actually use. Let's build it.",
      es: 'Tienes una idea y necesitas una primera versión que la gente pueda usar. Construyámosla.',
    },
  },
  {
    id: 'one-to-many',
    tone: 'red',
    icon: 'orbit',
    title: { en: 'One to many', es: 'De uno a muchos' },
    body: {
      en: 'Something works and now it has to hold. I have taken a product past 8,000 users and built the team that kept it shipping.',
      es: 'Algo ya funciona y ahora tiene que sostenerse. Llevé un producto más allá de 8,000 usuarios y armé el equipo que lo mantuvo entregando.',
    },
  },
  {
    id: 'hands-on-the-tools',
    tone: 'charcoal',
    icon: 'spark',
    title: { en: 'Hands on the tools', es: 'Manos a la obra' },
    body: {
      en: 'You know what you need and want someone who ships it. Design, code, and the judgement in between.',
      es: 'Sabes lo que necesitas y quieres a alguien que lo entregue. Diseño, código, y el criterio que va en medio.',
    },
  },
]
