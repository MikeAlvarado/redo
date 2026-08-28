import type { LocalizedString } from '../i18n/types'

export interface Credential {
  id: string
  label: LocalizedString
  href?: string
}

export const credentials: Credential[] = [
  {
    id: 'yc',
    label: { en: 'Y Combinator S21', es: 'Y Combinator S21' },
    href: 'https://www.ycombinator.com/companies/kodda',
  },
  {
    id: 'pmp',
    label: { en: 'PMI-PMP Training, 2025', es: 'Formación PMI-PMP, 2025' },
  },
  {
    id: 'psm',
    label: {
      en: 'Professional Scrum Master I, 2017',
      es: 'Professional Scrum Master I, 2017',
    },
  },
  {
    id: 'six-sigma',
    label: {
      en: 'Lean Six Sigma Green Belt, 2019',
      es: 'Lean Six Sigma Green Belt, 2019',
    },
  },
  {
    id: 'itesm',
    label: {
      en: 'B.E. Computer Science, ITESM, 2014-2019',
      es: 'Ing. en Ciencias Computacionales, ITESM, 2014-2019',
    },
  },
]
