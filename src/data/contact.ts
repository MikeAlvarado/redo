import type { LocalizedString } from '../i18n/types'

export interface ContactLink {
  id: string
  label: LocalizedString
  value: string
  href: string
}

// Phone and WhatsApp stay in the CV; the public page carries email, LinkedIn
// and the CV itself.
export const reachLinks: ContactLink[] = [
  {
    id: 'email',
    label: { en: 'Email', es: 'Correo' },
    value: 'miguel_l06@hotmail.com',
    href: 'mailto:miguel_l06@hotmail.com',
  },
  {
    id: 'linkedin',
    label: { en: 'LinkedIn', es: 'LinkedIn' },
    value: 'in/mikealvaradol',
    href: 'https://www.linkedin.com/in/mikealvaradol/',
  },
  {
    id: 'cv',
    label: { en: 'Resume (CV)', es: 'Curriculum (CV)' },
    value: 'PDF',
    href: 'https://drive.google.com/file/d/1hrQCrZO_fqdq8BpdKSS-u5Go_9XMDV3-/view?usp=drive_link',
  },
]

export interface SocialLink {
  id: string
  label: LocalizedString
  href: string
}

export const socialLinks: SocialLink[] = [
  {
    id: 'linkedin',
    label: { en: 'LinkedIn', es: 'LinkedIn' },
    href: 'https://www.linkedin.com/in/mikealvaradol/',
  },
  {
    id: 'github',
    label: { en: 'GitHub', es: 'GitHub' },
    href: 'https://github.com/MikeAlvarado/',
  },
  { id: 'x', label: { en: 'X', es: 'X' }, href: 'http://x.com/mikealvaradol' },
  {
    id: 'strava',
    label: { en: 'Strava', es: 'Strava' },
    href: 'https://www.strava.com/athletes/140776739',
  },
  {
    id: 'instagram',
    label: { en: 'Instagram', es: 'Instagram' },
    href: 'https://www.instagram.com/mikealvaradol',
  },
]
