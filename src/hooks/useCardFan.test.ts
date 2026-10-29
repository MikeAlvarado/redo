import { renderHook } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { setMediaQuery } from '../test/fakes/dom'
import { scrollTriggers } from '../test/fakes/gsap'
import {
  ROW_CARD_WIDTH,
  ROW_GAP,
  ROW_SETTLE_ROT,
  ROW_SETTLE_SPACING,
  ROW_RADIUS,
  ROW_START_SCALE,
  rowCardRadius,
  rowCardState,
  rowHeadingOpacity,
  STACK_OVER_ROT,
  STACK_SETTLE_ROT,
  stackCardEntry,
  useCardFan,
  type DeckTier,
} from './useCardFan'

const REDUCE = '(prefers-reduced-motion: reduce)'

function buildDeck(cardCount: number) {
  const container = document.createElement('section')
  for (let i = 0; i < cardCount; i += 1) {
    const slot = document.createElement('div')
    const card = document.createElement('article')
    card.setAttribute('data-deck-card', '')
    slot.appendChild(card)
    container.appendChild(slot)
  }
  document.body.appendChild(container)
  return container
}

function renderDeck(container: HTMLElement, tier: DeckTier = 'stack') {
  return renderHook(() => {
    const ref = useRef<HTMLElement | null>(container)
    useCardFan(ref, tier)
  })
}

describe('stackCardEntry math (measured: over-rotated entries easing to -4/+4/-4)', () => {
  it('starts each card at its measured over-rotated entry', () => {
    STACK_SETTLE_ROT.forEach((settle, i) => {
      const entry = stackCardEntry(0, i)
      expect(entry.rotation).toBeCloseTo(settle + (STACK_OVER_ROT[i] ?? 0), 5)
    })
    expect(stackCardEntry(0, 2).rotation).toBeCloseTo(-20, 5)
  })

  it('settles every card at the measured tilt with full opacity', () => {
    STACK_SETTLE_ROT.forEach((settle, i) => {
      const settled = stackCardEntry(1, i)
      expect(settled.rotation).toBeCloseTo(settle, 5)
      expect(settled.opacity).toBe(1)
    })
  })

  it('fades only the first card in (measured: cards 2 and 3 never fade)', () => {
    expect(stackCardEntry(0, 0).opacity).toBe(0)
    expect(stackCardEntry(0.5, 0).opacity).toBeGreaterThan(0)
    expect(stackCardEntry(0.5, 0).opacity).toBeLessThan(1)
    expect(stackCardEntry(0, 1).opacity).toBe(1)
    expect(stackCardEntry(0, 2).opacity).toBe(1)
  })
})

describe('rowCardState math (measured: joined backs shrink, gap, flip, fan)', () => {
  it('starts as one joined landscape: backs up, scale 1.2, cards touching', () => {
    for (let i = 0; i < 3; i += 1) {
      const state = rowCardState(0, i)
      expect(state.rotationY).toBe(180)
      expect(state.scale).toBeCloseTo(ROW_START_SCALE, 5)
      expect(state.rotation).toBeCloseTo(0, 5)
      expect(Math.abs(state.x)).toBeCloseTo(
        Math.abs(i - 1) * ROW_CARD_WIDTH * ROW_START_SCALE,
        5,
      )
    }
  })

  it('opens the measured 32px gaps once the shrink completes, still face-down', () => {
    for (const progress of [0.35, 0.4, 0.44]) {
      for (let i = 0; i < 3; i += 1) {
        const state = rowCardState(progress, i)
        expect(state.scale).toBeCloseTo(1, 2)
        expect(state.rotationY).toBe(180)
        expect(Math.abs(state.x)).toBeCloseTo(
          Math.abs(i - 1) * (ROW_CARD_WIDTH + ROW_GAP),
          0,
        )
      }
    }
  })

  it('flips face-up and settles at the measured fan tilts and pulled-in spacing', () => {
    ROW_SETTLE_ROT.forEach((tilt, i) => {
      const state = rowCardState(1, i)
      expect(state.rotationY).toBe(0)
      expect(state.rotation).toBeCloseTo(tilt, 5)
      expect(state.x).toBeCloseTo((i - 1) * ROW_SETTLE_SPACING, 5)
    })
  })

  it('staggers the flip slightly in card order', () => {
    const mid = 0.66
    expect(rowCardState(mid, 0).rotationY).toBeLessThan(rowCardState(mid, 1).rotationY)
    expect(rowCardState(mid, 1).rotationY).toBeLessThan(rowCardState(mid, 2).rotationY)
  })

  it('scales every spacing proportionally with the responsive card width', () => {
    const cardW = 470
    const ratio = cardW / ROW_CARD_WIDTH
    for (let i = 0; i < 3; i += 1) {
      expect(rowCardState(0, i, cardW).x).toBeCloseTo(
        (i - 1) * cardW * ROW_START_SCALE,
        5,
      )
      expect(rowCardState(0.4, i, cardW).x).toBeCloseTo((i - 1) * (cardW + ROW_GAP), 0)
      expect(rowCardState(1, i, cardW).x).toBeCloseTo(
        (i - 1) * ROW_SETTLE_SPACING * ratio,
        5,
      )
    }
  })

  it('rounds only the outer corners while the panels are joined', () => {
    // Measured on the reference: the left card reports '12px 0px 0px 12px'
    // while joined, so the three read as one rectangle with no seam notches.
    // The visible face always paints in identity orientation (the back
    // face's own rotateY(180) cancels the card's), so element-space corners
    // are visual corners.
    expect(rowCardRadius(0, 0)).toBe(`${ROW_RADIUS}px 0px 0px ${ROW_RADIUS}px`)
    expect(rowCardRadius(0, 1)).toBe('0px 0px 0px 0px')
    expect(rowCardRadius(0, 2)).toBe(`0px ${ROW_RADIUS}px ${ROW_RADIUS}px 0px`)
  })

  it('rounds every corner uniformly once the cards have separated', () => {
    for (let i = 0; i < 3; i += 1) {
      expect(rowCardRadius(1, i)).toBe(
        `${ROW_RADIUS}px ${ROW_RADIUS}px ${ROW_RADIUS}px ${ROW_RADIUS}px`,
      )
    }
  })

  it('fades the heading in over the measured early window', () => {
    expect(rowHeadingOpacity(0)).toBe(0)
    expect(rowHeadingOpacity(0.1)).toBeGreaterThan(0)
    expect(rowHeadingOpacity(0.1)).toBeLessThan(1)
    expect(rowHeadingOpacity(0.2)).toBe(1)
    expect(rowHeadingOpacity(1)).toBe(1)
  })
})

describe('useCardFan', () => {
  it('stack tier: three unpinned scrub triggers (the reference does not pin this tier)', () => {
    renderDeck(buildDeck(3), 'stack')
    expect(scrollTriggers).toHaveLength(3)
    for (const trigger of scrollTriggers) {
      expect(trigger.vars.pin).toBeUndefined()
      expect(trigger.vars.scrub).toBe(true)
    }
    scrollTriggers[0]?.setProgress(1)
  })

  it('row tier: one pinned 280% scrubbed timeline', () => {
    renderDeck(buildDeck(3), 'row')
    expect(scrollTriggers).toHaveLength(1)
    expect(scrollTriggers[0]?.vars.pin).toBe(true)
    expect(scrollTriggers[0]?.vars.end).toBe('+=280%')
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

  it('renders settled states without triggers under reduced motion', () => {
    setMediaQuery(REDUCE, true)
    renderDeck(buildDeck(3), 'row')
    expect(scrollTriggers).toHaveLength(0)
  })

  it('kills its ScrollTriggers on unmount', () => {
    const { unmount } = renderDeck(buildDeck(3), 'stack')
    unmount()
    expect(scrollTriggers.every((trigger) => trigger.killed)).toBe(true)
  })
})
