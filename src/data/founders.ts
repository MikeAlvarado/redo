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

export const founders: Founder[] = [
  {
    id: 'mike',
    name: 'Mike\nAlvarado',
    role: {
      en: 'Engineer & founder\nYC Alumni',
      es: 'Ingeniero y fundador\nYC Alumni',
    },
    portrait: '/art/portrait-mike.webp',
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
