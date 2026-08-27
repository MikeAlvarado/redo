import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useScrolledPast } from './useScrolledPast'

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value })
  window.dispatchEvent(new Event('scroll'))
}

describe('useScrolledPast', () => {
  it('is false at the top of the page', () => {
    act(() => setScrollY(0))
    const { result } = renderHook(() => useScrolledPast())
    expect(result.current).toBe(false)
  })

  it('flips true past 60% of the viewport height and back false at the top', () => {
    const { result } = renderHook(() => useScrolledPast())
    act(() => setScrollY(window.innerHeight * 0.6 + 1))
    expect(result.current).toBe(true)
    act(() => setScrollY(0))
    expect(result.current).toBe(false)
  })

  it('stops listening after unmount', () => {
    const { result, unmount } = renderHook(() => useScrolledPast())
    expect(result.current).toBe(false)
    unmount()
    act(() => setScrollY(window.innerHeight * 0.6 + 1))
    expect(result.current).toBe(false)
  })
})
