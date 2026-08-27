import { renderHook } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it } from 'vitest'
import { setMediaQuery } from '../test/fakes/dom'
import { scrollTriggers, tweens } from '../test/fakes/gsap'
import { HERO_END_SCALE, useHeroRecede } from './useHeroRecede'

const REDUCE = '(prefers-reduced-motion: reduce)'

function renderRecede() {
  const section = document.createElement('section')
  const card = document.createElement('div')
  section.appendChild(card)
  document.body.appendChild(section)
  return renderHook(() => {
    const sectionRef = useRef<HTMLElement | null>(section)
    const cardRef = useRef<HTMLDivElement | null>(card)
    useHeroRecede(sectionRef, cardRef)
  })
}

describe('useHeroRecede', () => {
  it('scrubs the card down to the measured end scale across the hero', () => {
    renderRecede()
    expect(tweens).toHaveLength(1)
    expect(tweens[0]?.vars.scale).toBe(HERO_END_SCALE)
    expect(scrollTriggers[0]?.vars.scrub).toBe(true)
    expect(scrollTriggers[0]?.vars.start).toBe(0)
  })

  it('does not animate under reduced motion', () => {
    setMediaQuery(REDUCE, true)
    renderRecede()
    expect(tweens).toHaveLength(0)
    expect(scrollTriggers).toHaveLength(0)
  })

  it('kills its ScrollTrigger on unmount', () => {
    const { unmount } = renderRecede()
    unmount()
    expect(scrollTriggers[0]?.killed).toBe(true)
  })
})
