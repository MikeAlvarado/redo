import { render } from '@testing-library/react'
import { act } from 'react'
import { describe, expect, it } from 'vitest'
import { LanguageProvider } from '../../../i18n/LanguageProvider'
import { setMediaQuery } from '../../../test/fakes/dom'
import { JourneyCards } from './JourneyCards'

const ROW_QUERY = '(min-width: 90rem)'

function renderSection() {
  return render(
    <LanguageProvider>
      <JourneyCards />
    </LanguageProvider>,
  )
}

describe('JourneyCards', () => {
  it('renders every deck card in the stack tier', () => {
    renderSection()
    expect(document.querySelectorAll('[data-deck-card]')).toHaveLength(3)
    expect(document.querySelector('[data-deck="stack"]')).not.toBeNull()
  })

  it('keeps the identical card nodes when the tier flips to row', () => {
    renderSection()
    const before = Array.from(document.querySelectorAll('[data-deck-card]'))
    act(() => setMediaQuery(ROW_QUERY, true))
    expect(document.querySelector('[data-deck="row"]')).not.toBeNull()
    const after = Array.from(document.querySelectorAll('[data-deck-card]'))
    expect(after).toHaveLength(3)
    after.forEach((card, index) => expect(card).toBe(before[index]))
  })

  it('every deck card carries a front face and a back for the row-tier flip', () => {
    renderSection()
    document.querySelectorAll('[data-deck-card]').forEach((card) => {
      expect(card.querySelector('article')).not.toBeNull()
      expect(card.querySelector('[aria-hidden]')).not.toBeNull()
    })
  })
})
