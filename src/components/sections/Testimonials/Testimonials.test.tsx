import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Testimonial } from '../../../data/testimonials'
import { LanguageProvider } from '../../../i18n/LanguageProvider'
import { Testimonials } from './Testimonials'

const mockTestimonials: Testimonial[] = []

vi.mock('../../../data/testimonials', () => ({
  get testimonials() {
    return mockTestimonials
  },
}))

function makeTestimonial(id: string): Testimonial {
  return {
    id,
    quote: { en: `Quote ${id}`, es: `Cita ${id}` },
    name: `Person ${id}`,
    role: { en: `Role ${id}`, es: `Rol ${id}` },
    company: `Company ${id}`,
    portrait: '/art/portrait.svg',
    portraitAlt: { en: `Portrait ${id}`, es: `Retrato ${id}` },
  }
}

function renderWith(count: number) {
  mockTestimonials.length = 0
  for (let i = 1; i <= count; i += 1) mockTestimonials.push(makeTestimonial(String(i)))
  return render(
    <LanguageProvider>
      <Testimonials />
    </LanguageProvider>,
  )
}

describe('Testimonials', () => {
  it('renders nothing at all when there are no testimonials', () => {
    const { container } = renderWith(0)
    expect(container).toBeEmptyDOMElement()
    expect(document.querySelector('[data-section="reviews"]')).toBeNull()
  })

  it('renders a single quote with its attribution', () => {
    renderWith(1)
    expect(document.querySelectorAll('figure')).toHaveLength(1)
    expect(screen.getAllByText('Quote 1').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Person 1')).toHaveLength(2)
  })

  it('renders two quotes with a dot per quote', () => {
    renderWith(2)
    expect(document.querySelectorAll('figure')).toHaveLength(2)
    expect(screen.getAllByRole('tab')).toHaveLength(2)
  })

  it('holds up with eleven quotes', () => {
    renderWith(11)
    expect(document.querySelectorAll('figure')).toHaveLength(11)
    expect(screen.getAllByRole('tab')).toHaveLength(11)
    expect(screen.getAllByText('Quote 11').length).toBeGreaterThan(0)
  })
})
