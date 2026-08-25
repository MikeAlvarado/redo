import { renderHook } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { setMediaQuery } from '../test/fakes/dom'
import { scrollTriggers } from '../test/fakes/gsap'
import {
  FAN_ROTATIONS,
  fanCardState,
  STACK_SETTLE,
  stackCardState,
  useCardFan,
  type DeckMode,
} from './useCardFan'

const REDUCE = '(prefers-reduced-motion: reduce)'

function buildDeck(cardCount: number) {
  const container = document.createElement('section')
  for (let i = 0; i < cardCount; i += 1) {
    const card = document.createElement('article')
    card.setAttribute('data-deck-card', '')
    container.appendChild(card)
  }
  document.body.appendChild(container)
  return container
}

function renderDeck(container: HTMLElement, mode: DeckMode = 'stack') {
  return renderHook(() => {
    const ref = useRef<HTMLElement | null>(container)
    useCardFan(ref, { mode })
  })
}

describe('stackCardState math', () => {
  it('hides undealt cards below the deck and deals strictly in order', () => {
    expect(stackCardState(0, 1, 3).opacity).toBe(0)
    expect(stackCardState(0.2, 0, 3).yPercent).toBeLessThan(130)
    expect(stackCardState(0.2, 2, 3).opacity).toBe(0)
  })

  it('settles every card into the measured staircase', () => {
    for (let i = 0; i < 3; i += 1) {
      const settled = stackCardState(1, i, 3)
      const expected = STACK_SETTLE[i]
      expect(settled.rotation).toBe(expected?.rotation)
      expect(settled.xPercent).toBe(expected?.xPercent)
      expect(settled.yPercent).toBe(expected?.yPercent)
      expect(settled.opacity).toBe(1)
    }
  })

  it('over-rotates the entering card beyond its settled tilt', () => {
    const entering = stackCardState(2.05 / 3.4, 2, 3)
    const settledRotation = STACK_SETTLE[2]?.rotation ?? 0
    expect(entering.rotation).toBeLessThan(settledRotation)
  })
})

describe('fanCardState math', () => {
  it('shows the card backs before the flip begins', () => {
    for (let i = 0; i < 3; i += 1) {
      expect(fanCardState(0, i).rotationY).toBe(180)
      expect(fanCardState(0.2, i).rotation).toBeCloseTo(0, 5)
    }
  })

  it('flips every card face-up and fans to the measured tilts by the end', () => {
    for (let i = 0; i < 3; i += 1) {
      const settled = fanCardState(1, i)
      expect(settled.rotationY).toBe(0)
      expect(settled.rotation).toBeCloseTo(FAN_ROTATIONS[i] ?? 0, 5)
    }
  })

  it('staggers the flips in card order', () => {
    const mid = 0.42
    expect(fanCardState(mid, 0).rotationY).toBeLessThan(fanCardState(mid, 1).rotationY)
    expect(fanCardState(mid, 1).rotationY).toBeLessThan(fanCardState(mid, 2).rotationY)
  })
})

describe('useCardFan', () => {
  it('pins the deck and scrubs in stack mode', () => {
    renderDeck(buildDeck(3), 'stack')
    expect(scrollTriggers).toHaveLength(1)
    expect(scrollTriggers[0]?.vars.pin).toBe(true)
    expect(scrollTriggers[0]?.vars.scrub).toBe(true)
    scrollTriggers[0]?.setProgress(1)
  })

  it('pins with the longer fan distance in fan mode', () => {
    renderDeck(buildDeck(3), 'fan')
    expect(scrollTriggers[0]?.vars.end).toBe('+=240%')
    scrollTriggers[0]?.setProgress(0.5)
  })

  it('warns loudly and creates nothing when the deck query is empty', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const container = document.createElement('section')
    document.body.appendChild(container)
    renderDeck(container)
    expect(scrollTriggers).toHaveLength(0)
    expect(warnSpy.mock.calls.some(([msg]) => String(msg).includes('useCardFan'))).toBe(
      true,
    )
  })

  it('renders the settled state without a trigger under reduced motion', () => {
    setMediaQuery(REDUCE, true)
    renderDeck(buildDeck(3), 'fan')
    expect(scrollTriggers).toHaveLength(0)
  })

  it('kills its ScrollTrigger on unmount', () => {
    const { unmount } = renderDeck(buildDeck(3))
    unmount()
    expect(scrollTriggers[0]?.killed).toBe(true)
  })
})
