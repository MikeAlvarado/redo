import { renderHook } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { setMediaQuery } from '../test/fakes/dom'
import { scrollTriggers } from '../test/fakes/gsap'
import {
  DORMANT_OPACITY,
  useWordReveal,
  wordOpacity,
  wordProgress,
} from './useWordReveal'

const REDUCE = '(prefers-reduced-motion: reduce)'

function buildContainer(wordCount: number) {
  const container = document.createElement('div')
  for (let i = 0; i < wordCount; i += 1) {
    const span = document.createElement('span')
    span.setAttribute('data-word', '')
    span.textContent = `word${i}`
    container.appendChild(span)
  }
  document.body.appendChild(container)
  return container
}

function renderReveal(container: HTMLElement) {
  return renderHook(() => {
    const ref = useRef<HTMLElement | null>(container)
    useWordReveal(ref)
  })
}

describe('wordProgress math', () => {
  it('starts at 0 and lands every word exactly at progress 1', () => {
    const n = 30
    for (let i = 0; i < n; i += 1) {
      expect(wordProgress(0, i, n)).toBe(0)
      expect(wordProgress(1, i, n)).toBe(1)
    }
  })

  it('reveals words in reading order with overlapping windows', () => {
    const n = 30
    const lateInWord5 = (5 + 1.3) / (n - 1 + 1.6)
    const p5 = wordProgress(lateInWord5, 5, n)
    const p6 = wordProgress(lateInWord5, 6, n)
    const p7 = wordProgress(lateInWord5, 7, n)
    expect(p5).toBeGreaterThan(0.4)
    expect(p6).toBeGreaterThan(0)
    expect(p6).toBeLessThan(p5)
    expect(p7).toBe(0)
  })

  it('is monotonic in progress so slow scrolling never jitters backwards', () => {
    const n = 30
    for (let i = 0; i < n; i += 5) {
      let last = -1
      for (let p = 0; p <= 1.001; p += 0.01) {
        const value = wordProgress(p, i, n)
        expect(value).toBeGreaterThanOrEqual(last)
        last = value
      }
    }
  })

  it('maps progress onto opacity from the dormant floor to full', () => {
    expect(wordOpacity(0, 0, 30)).toBeCloseTo(DORMANT_OPACITY)
    expect(wordOpacity(1, 29, 30)).toBe(1)
  })
})

describe('useWordReveal', () => {
  it('pins the container and drives per-word opacity from scroll progress', () => {
    const container = buildContainer(10)
    renderReveal(container)

    expect(scrollTriggers).toHaveLength(1)
    expect(scrollTriggers[0]?.vars.pin).toBe(true)
    expect(scrollTriggers[0]?.vars.scrub).toBe(true)

    scrollTriggers[0]?.setProgress(0.5)
    const opacities = Array.from(
      container.querySelectorAll<HTMLElement>('[data-word]'),
    ).map((span) => Number(span.style.opacity))
    expect(opacities[0]).toBe(1)
    const last = opacities[opacities.length - 1]
    expect(last).toBeLessThan(1)
    for (let i = 1; i < opacities.length; i += 1) {
      const prev = opacities[i - 1]
      const current = opacities[i]
      if (prev !== undefined && current !== undefined) {
        expect(current).toBeLessThanOrEqual(prev)
      }
    }
  })

  it('renders every word fully lit with no pinning under reduced motion', () => {
    setMediaQuery(REDUCE, true)
    const container = buildContainer(6)
    renderReveal(container)

    expect(scrollTriggers).toHaveLength(0)
    container.querySelectorAll<HTMLElement>('[data-word]').forEach((span) => {
      expect(span.style.opacity).toBe('1')
    })
  })

  it('warns loudly when the container holds no words', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const empty = document.createElement('div')
    document.body.appendChild(empty)
    renderReveal(empty)
    expect(scrollTriggers).toHaveLength(0)
    expect(
      warnSpy.mock.calls.some(([msg]) => String(msg).includes('useWordReveal')),
    ).toBe(true)
  })

  it('kills its ScrollTrigger on unmount', () => {
    const container = buildContainer(4)
    const { unmount } = renderReveal(container)
    unmount()
    expect(scrollTriggers[0]?.killed).toBe(true)
  })
})
