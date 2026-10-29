import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { StatRow } from '../../../data/stats'
import { completeTween, scrollTriggers } from '../../../test/fakes/gsap'
import { LanguageProvider } from '../../../i18n/LanguageProvider'
import { Stats } from './Stats'

const mockStats: StatRow[] = []

vi.mock('../../../data/stats', () => ({
  get stats() {
    return mockStats
  },
}))

const UNMARKED: StatRow = {
  id: 'unmarked',
  value: 8000,
  suffix: '+',
  group: true,
  source: 'Kodda',
  label: { en: 'Users on Kodda', es: 'Usuarios en Kodda' },
  body: { en: 'Body copy.', es: 'Texto.' },
}

const MARKED: StatRow = {
  id: 'marked',
  value: 37,
  prefix: '+',
  suffix: '%',
  source: 'Moneypool',
  label: { en: 'Payment completion', es: 'Finalización de pagos' },
  body: { en: 'Body copy.', es: 'Texto.' },
  mark: {
    src: '/art/mark-moneypool.svg',
    alt: { en: 'Moneypool wordmark', es: 'Logotipo de Moneypool' },
  },
}

function renderWith(rows: StatRow[]) {
  mockStats.length = 0
  mockStats.push(...rows)
  return render(
    <LanguageProvider>
      <Stats />
    </LanguageProvider>,
  )
}

describe('Stats', () => {
  it('renders a row without a mark, naming its source in text', () => {
    renderWith([UNMARKED])
    expect(screen.getByText('Users on Kodda')).toBeInTheDocument()
    expect(screen.getByText('Kodda')).toBeInTheDocument()
    expect(document.querySelectorAll('img')).toHaveLength(0)
  })

  it('renders a row with a mark as an image beside the source', () => {
    renderWith([MARKED])
    const mark = screen.getByRole('img', { name: 'Moneypool wordmark' })
    expect(mark).toHaveAttribute('src', '/art/mark-moneypool.svg')
    expect(screen.getByText('Moneypool')).toBeInTheDocument()
  })

  it('keeps both kinds of row in one list', () => {
    renderWith([UNMARKED, MARKED])
    expect(document.querySelectorAll('li')).toHaveLength(2)
    expect(document.querySelectorAll('img')).toHaveLength(1)
  })

  it('rolls a grouped numeral to its thousands-separated value with its affixes', () => {
    renderWith([UNMARKED])
    completeTween(scrollTriggers[0])
    const numeral = document.querySelector('.text-numeral')
    expect(numeral?.textContent).toBe('8,000+')
  })

  it('renders a prefix and suffix around an ungrouped numeral', () => {
    renderWith([MARKED])
    completeTween(scrollTriggers[0])
    const numeral = document.querySelector('.text-numeral')
    expect(numeral?.textContent).toBe('+37%')
  })
})
