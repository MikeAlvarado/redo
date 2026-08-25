import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCarousel } from './useCarousel'

const listeners = new Map<string, Set<() => void>>()
let selectedSnap = 0
const scrollTo = vi.fn((index: number) => {
  selectedSnap = index
  listeners.get('select')?.forEach((listener) => listener())
})

vi.mock('embla-carousel-react', () => ({
  default: () => [
    vi.fn(),
    {
      selectedScrollSnap: () => selectedSnap,
      canScrollPrev: () => selectedSnap > 0,
      canScrollNext: () => selectedSnap < 2,
      scrollTo,
      scrollPrev: () => scrollTo(selectedSnap - 1),
      scrollNext: () => scrollTo(selectedSnap + 1),
      on: (event: string, listener: () => void) => {
        const set = listeners.get(event) ?? new Set()
        set.add(listener)
        listeners.set(event, set)
      },
      off: (event: string, listener: () => void) => {
        listeners.get(event)?.delete(listener)
      },
    },
  ],
}))

describe('useCarousel', () => {
  it('exposes the selected index and navigation state', () => {
    selectedSnap = 0
    const { result } = renderHook(() => useCarousel())
    expect(result.current.selectedIndex).toBe(0)
    expect(result.current.canPrev).toBe(false)
    expect(result.current.canNext).toBe(true)
  })

  it('updates state when the carousel selects a new snap', () => {
    selectedSnap = 0
    const { result } = renderHook(() => useCarousel())
    act(() => result.current.scrollNext())
    expect(result.current.selectedIndex).toBe(1)
    expect(result.current.canPrev).toBe(true)
  })

  it('unsubscribes from embla events on unmount', () => {
    const { unmount } = renderHook(() => useCarousel())
    const before = listeners.get('select')?.size ?? 0
    expect(before).toBeGreaterThan(0)
    unmount()
    expect(listeners.get('select')?.size ?? 0).toBe(before - 1)
  })
})
