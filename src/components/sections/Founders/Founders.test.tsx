import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Founder } from '../../../data/founders'
import { LanguageProvider } from '../../../i18n/LanguageProvider'
import { Founders } from './Founders'

const mockFounders: Founder[] = []

vi.mock('../../../data/founders', () => ({
  get founders() {
    return mockFounders
  },
}))

function makeFounder(id: string): Founder {
  return {
    id,
    name: `Person ${id}`,
    role: { en: `Role ${id}`, es: `Rol ${id}` },
    portrait: '/art/founder-mike.svg',
    portraitAlt: { en: `Portrait ${id}`, es: `Retrato ${id}` },
    links: [
      { label: 'LinkedIn', href: 'https://example.com', icon: 'linkedin' },
      { label: 'GitHub', href: 'https://example.com', icon: 'github' },
    ],
  }
}

function renderWith(count: number) {
  mockFounders.length = 0
  for (let i = 1; i <= count; i += 1) mockFounders.push(makeFounder(String(i)))
  return render(
    <LanguageProvider>
      <Founders />
    </LanguageProvider>,
  )
}

describe('Founders', () => {
  it('renders a single centered card without overlap offsets', () => {
    renderWith(1)
    const cards = document.querySelectorAll('article')
    expect(cards).toHaveLength(1)
    expect(screen.getByText('Person 1')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /LinkedIn/ })).toHaveLength(1)
  })

  it('renders two tilted overlapping cards', () => {
    renderWith(2)
    expect(document.querySelectorAll('article')).toHaveLength(2)
    const wrappers = document.querySelectorAll('article')
    const secondWrapper = wrappers[1]?.parentElement
    expect(secondWrapper?.className).toContain('-mt-6')
  })

  it('holds up with three entries', () => {
    renderWith(3)
    expect(document.querySelectorAll('article')).toHaveLength(3)
    expect(screen.getByText('Person 3')).toBeInTheDocument()
  })
})
