import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Founder } from '../../../data/founders'
import { LanguageProvider } from '../../../i18n/LanguageProvider'
import { Founders } from './Founders'

const mockFounders: Founder[] = [
  {
    id: 'mike',
    name: 'Mike\nAlvarado',
    role: { en: 'Engineer', es: 'Ingeniero' },
    portrait: '/art/portrait-mike.webp',
    portraitAlt: { en: 'Portrait', es: 'Retrato' },
    links: [
      { label: { en: 'LinkedIn', es: 'LinkedIn' }, href: 'https://example.com/in', icon: 'linkedin' },
      { label: { en: 'GitHub', es: 'GitHub' }, href: 'https://example.com/gh', icon: 'github' },
      { label: { en: 'Email', es: 'Correo' }, href: 'mailto:x@y.z', icon: 'mail' },
    ],
  },
]

vi.mock('../../../data/founders', () => ({
  get founders() {
    return mockFounders
  },
}))

describe('Founders', () => {
  it('renders the lanyard badge stage and nothing else under the heading', () => {
    render(
      <LanguageProvider>
        <Founders />
      </LanguageProvider>,
    )
    expect(screen.getByRole('img', { name: /Y Combinator badge/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Turn the badge over/ })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByRole('link')).toBeNull()
  })
})
