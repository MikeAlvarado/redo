import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LanguageProvider } from '../../../i18n/LanguageProvider'
import { ClientMarquee } from './ClientMarquee'

vi.mock('../../../hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false,
}))

describe('ClientMarquee', () => {
  it('loads every mark eagerly so the off-screen clone measures the same as the row', () => {
    // The track scrolls by -50% of its own width. A lazy image in the clone
    // never enters the viewport, so the clone would be narrower and the loop
    // would overlap itself at the seam.
    render(
      <LanguageProvider>
        <ClientMarquee />
      </LanguageProvider>,
    )
    const marks = screen.getAllByRole('img', { hidden: true })
    expect(marks.length).toBeGreaterThan(0)
    for (const mark of marks) expect(mark).toHaveAttribute('loading', 'eager')
  })
})
