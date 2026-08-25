import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

type Flavor = 'vanilla' | 'mocha'
const isFlavor = (value: string): value is Flavor =>
  value === 'vanilla' || value === 'mocha'

describe('useLocalStorage', () => {
  it('returns the fallback when storage is empty or invalid', () => {
    const { result } = renderHook(() => useLocalStorage('flavor', 'vanilla', isFlavor))
    expect(result.current[0]).toBe('vanilla')

    window.localStorage.setItem('flavor', 'stracciatella')
    const { result: second } = renderHook(() =>
      useLocalStorage('flavor', 'vanilla', isFlavor),
    )
    expect(second.current[0]).toBe('vanilla')
  })

  it('persists writes and notifies the hook', () => {
    const { result } = renderHook(() => useLocalStorage('flavor', 'vanilla', isFlavor))
    act(() => result.current[1]('mocha'))
    expect(result.current[0]).toBe('mocha')
    expect(window.localStorage.getItem('flavor')).toBe('mocha')
  })

  it('reflects changes arriving from another tab via the storage event', () => {
    const { result } = renderHook(() => useLocalStorage('flavor', 'vanilla', isFlavor))
    act(() => {
      window.localStorage.setItem('flavor', 'mocha')
      window.dispatchEvent(new StorageEvent('storage', { key: 'flavor' }))
    })
    expect(result.current[0]).toBe('mocha')
  })

  it('removes its storage listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useLocalStorage('flavor', 'vanilla', isFlavor))
    unmount()
    expect(removeSpy.mock.calls.some(([type]) => type === 'storage')).toBe(true)
  })
})
