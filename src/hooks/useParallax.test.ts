import { renderHook } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it } from 'vitest'
import { setMediaQuery } from '../test/fakes/dom'
import { scrollTriggers, tweens } from '../test/fakes/gsap'
import { useParallax } from './useParallax'

const REDUCE = '(prefers-reduced-motion: reduce)'

function renderParallax() {
  const section = document.createElement('section')
  const image = document.createElement('div')
  section.appendChild(image)
  document.body.appendChild(section)
  return renderHook(() => {
    const trigger = useRef<HTMLElement | null>(section)
    const target = useRef<HTMLDivElement | null>(image)
    useParallax(trigger, target)
  })
}

describe('useParallax', () => {
  it('creates a scrubbed tween across the trigger scroll range', () => {
    renderParallax()
    expect(tweens).toHaveLength(1)
    expect(tweens[0]?.vars.yPercent).toBe(-12)
    expect(scrollTriggers[0]?.vars.scrub).toBe(true)
  })

  it('leaves the target in its final state under reduced motion', () => {
    setMediaQuery(REDUCE, true)
    renderParallax()
    expect(tweens).toHaveLength(0)
    expect(scrollTriggers).toHaveLength(0)
  })

  it('kills its ScrollTrigger on unmount', () => {
    const { unmount } = renderParallax()
    unmount()
    expect(scrollTriggers[0]?.killed).toBe(true)
  })
})
