import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { setMediaQuery } from '../test/fakes/dom'
import { completeTween, scrollTriggers } from '../test/fakes/gsap'
import { useCountUp } from './useCountUp'

const REDUCE = '(prefers-reduced-motion: reduce)'

function Stat({ value }: { value: number }) {
  const ref = useCountUp<HTMLSpanElement>(value)
  return <span ref={ref} data-testid="stat" />
}

describe('useCountUp', () => {
  it('starts from a padded zero and rolls to the padded final value', () => {
    render(<Stat value={24} />)
    const stat = screen.getByTestId('stat')
    expect(stat.textContent).toBe('00')

    const trigger = scrollTriggers[0]
    expect(trigger).toBeDefined()
    completeTween(trigger)
    expect(stat.textContent).toBe('24')
  })

  it('keeps the leading zero fixed for single-digit values', () => {
    render(<Stat value={6} />)
    completeTween(scrollTriggers[0])
    expect(screen.getByTestId('stat').textContent).toBe('06')
  })

  it('renders the final value immediately under reduced motion', () => {
    setMediaQuery(REDUCE, true)
    render(<Stat value={24} />)
    expect(screen.getByTestId('stat').textContent).toBe('24')
    expect(scrollTriggers).toHaveLength(0)
  })

  it('kills its ScrollTrigger on unmount', () => {
    const { unmount } = render(<Stat value={24} />)
    unmount()
    expect(scrollTriggers[0]?.killed).toBe(true)
  })
})
