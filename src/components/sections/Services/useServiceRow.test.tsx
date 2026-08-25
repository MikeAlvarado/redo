import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { scrollTriggers } from '../../../test/fakes/gsap'
import { useServiceRow } from './useServiceRow'

function BareRow() {
  const ref = useServiceRow<HTMLDivElement>()
  return <div ref={ref} />
}

function FullRow() {
  const ref = useServiceRow<HTMLDivElement>()
  return (
    <div ref={ref}>
      <div data-divider />
      <p data-reveal>content</p>
      <img data-thumb alt="" />
    </div>
  )
}

describe('useServiceRow', () => {
  it('animates divider, children, and thumbnail when the contract is met', () => {
    render(<FullRow />)
    expect(scrollTriggers.length).toBeGreaterThanOrEqual(3)
  })

  it('warns loudly when the reveal children are missing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<BareRow />)
    expect(
      warnSpy.mock.calls.some(([msg]) => String(msg).includes('useServiceRow')),
    ).toBe(true)
  })
})
