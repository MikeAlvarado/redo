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

export const testimonials: Testimonial[] = []
