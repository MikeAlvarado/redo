import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { mediaListenerCount, setMediaQuery } from '../test/fakes/dom'
import { useMediaQuery } from './useMediaQuery'

const QUERY = '(min-width: 900px)'

describe('useMediaQuery', () => {
  it('returns the current match state and tracks changes', () => {
    const { result } = renderHook(() => useMediaQuery(QUERY))
    expect(result.current).toBe(false)

    act(() => setMediaQuery(QUERY, true))
    expect(result.current).toBe(true)

    act(() => setMediaQuery(QUERY, false))
    expect(result.current).toBe(false)
  })

  it('removes its change listener on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery(QUERY))
    expect(mediaListenerCount(QUERY)).toBeGreaterThan(0)
    unmount()
    expect(mediaListenerCount(QUERY)).toBe(0)
  })
})
