import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { setMediaQuery } from '../test/fakes/dom'
import { scrollTriggers, tweens } from '../test/fakes/gsap'
import { useRevealOnScroll } from './useRevealOnScroll'

const REDUCE = '(prefers-reduced-motion: reduce)'

function Section({ selector }: { selector?: string }) {
  const ref = useRevealOnScroll<HTMLElement>({ selector })
  return (
    <section ref={ref}>
      <p data-reveal>alpha</p>
      <p data-reveal>beta</p>
    </section>
  )
}

describe('useRevealOnScroll', () => {
  it('registers a one-shot reveal tween for the section', () => {
    render(<Section />)
    expect(tweens).toHaveLength(1)
    expect(tweens[0]?.vars.scrollTrigger).toMatchObject({ once: true })
  })

  it('targets staggered children when a selector is given', () => {
    render(<Section selector="[data-reveal]" />)
    const targets = tweens[0]?.targets
    expect(Array.isArray(targets) ? targets : []).toHaveLength(2)
  })

  it('skips the animation entirely under reduced motion', () => {
    setMediaQuery(REDUCE, true)
    render(<Section />)
    expect(tweens).toHaveLength(0)
  })

  it('warns loudly when the selector matches nothing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<Section selector="[data-missing]" />)
    expect(tweens).toHaveLength(0)
    expect(
      warnSpy.mock.calls.some(([msg]) => String(msg).includes('useRevealOnScroll')),
    ).toBe(true)
  })

  it('kills its ScrollTrigger on unmount', () => {
    const { unmount } = render(<Section />)
    unmount()
    expect(scrollTriggers[0]?.killed).toBe(true)
  })
})
