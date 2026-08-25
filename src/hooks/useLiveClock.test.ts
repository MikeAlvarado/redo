import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLiveClock } from './useLiveClock'

describe('useLiveClock', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-24T18:30:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('formats the current time in the requested timezone', () => {
    const { result } = renderHook(() => useLiveClock('America/Monterrey', 'en'))
    expect(result.current).toBe('12:30 PM')
  })

  it('ticks forward once per second', () => {
    const { result } = renderHook(() => useLiveClock('America/Monterrey', 'en'))
    act(() => {
      vi.advanceTimersByTime(61_000)
    })
    expect(result.current).toBe('12:31 PM')
  })

  it('clears its interval on unmount', () => {
    const { unmount } = renderHook(() => useLiveClock('America/Monterrey', 'en'))
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
