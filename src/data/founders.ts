import type { LocalizedString } from '../i18n/types'

export type FounderLinkIcon = 'linkedin' | 'github' | 'instagram' | 'mail'

export interface FounderLink {
  label: LocalizedString
  href: string
  icon: FounderLinkIcon
}

export interface Founder {
  id: string
  name: string
  role: LocalizedString
  portrait: string
  portraitAlt: LocalizedString
  links: FounderLink[]
}

// TODO(mike): swap `portrait` for a real photograph — nothing in the portfolio
// repo held one, so this stays the generated placeholder.
export const founders: Founder[] = [
  {
    id: 'mike',
    name: 'Mike\nAlvarado',
    role: {
      en: 'Technical Founder & Software Engineer',
      es: 'Technical Founder e Ingeniero de Software',
    },
    portrait: '/art/founder-mike.svg',
    portraitAlt: { en: 'Portrait of Mike Alvarado', es: 'Retrato de Mike Alvarado' },
    links: [
      {
        label: { en: 'LinkedIn', es: 'LinkedIn' },
        href: 'https://www.linkedin.com/in/mikealvaradol/',
        icon: 'linkedin',
      },
      {
        label: { en: 'GitHub', es: 'GitHub' },
        href: 'https://github.com/MikeAlvarado/',
        icon: 'github',
      },
      {
        label: { en: 'Email', es: 'Correo' },
        href: 'mailto:miguel_l06@hotmail.com',
        icon: 'mail',
      },
    ],
  },
]
