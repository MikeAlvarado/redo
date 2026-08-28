import { testimonials } from '../data/testimonials'

const ALL_SECTION_IDS = ['services', 'work', 'reviews'] as const

export type SectionId = (typeof ALL_SECTION_IDS)[number]

// `reviews` only renders when there is a testimonial to show, so the nav and
// footer must not offer an anchor that resolves to nothing.
export const SECTION_IDS: readonly SectionId[] = ALL_SECTION_IDS.filter(
  (id) => id !== 'reviews' || testimonials.length > 0,
)

export const NAV_OFFSET = -96

export const CONTACT_EMAIL = 'miguel_l06@hotmail.com'
