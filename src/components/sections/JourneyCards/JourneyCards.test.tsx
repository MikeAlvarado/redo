import { render } from '@testing-library/react'
import { act } from 'react'
import { describe, expect, it } from 'vitest'
import { LanguageProvider } from '../../../i18n/LanguageProvider'
import { setMediaQuery } from '../../../test/fakes/dom'
import { JourneyCards } from './JourneyCards'

const FAN_QUERY = '(min-width: 90rem)'

function renderSection() {
  return render(
    <LanguageProvider>
      <JourneyCards />
    </LanguageProvider>,
  )
}

describe('JourneyCards', () => {
  it('renders every deck card at mobile width (stack mode)', () => {
    renderSection()
    expect(document.querySelectorAll('[data-deck-card]')).toHaveLength(3)
  })

  it('renders every deck card at desktop width (fan mode) — same tree', () => {
    renderSection()
    const before = Array.from(document.querySelectorAll('[data-deck-card]'))
    act(() => setMediaQuery(FAN_QUERY, true))
    const after = Array.from(document.querySelectorAll('[data-deck-card]'))
    expect(after).toHaveLength(3)
    after.forEach((card, index) => expect(card).toBe(before[index]))
  })

  it('every deck card carries a face and a back for the flip', () => {
    renderSection()
    document.querySelectorAll('[data-deck-card]').forEach((card) => {
      expect(card.querySelector('article')).not.toBeNull()
      expect(card.querySelector('[aria-hidden]')).not.toBeNull()
    })
  })
})
