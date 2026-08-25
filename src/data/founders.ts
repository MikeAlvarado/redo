import type { LocalizedString } from '../i18n/types'

export type FounderLinkIcon = 'linkedin' | 'github' | 'instagram' | 'mail'

export interface FounderLink {
  label: string
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

// TODO(mike): real portrait, real profile links; add collaborators as extra entries.
export const founders: Founder[] = [
  {
    id: 'mike',
    name: 'Mike\nAlvarado',
    role: { en: 'Product Designer & Engineer', es: 'Diseñador de producto e ingeniero' },
    portrait: '/art/founder-mike.svg',
    portraitAlt: { en: 'Portrait of Mike Alvarado', es: 'Retrato de Mike Alvarado' },
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
      { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
    ],
  },
]
