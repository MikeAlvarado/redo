import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useBodyScrollLock } from './useBodyScrollLock'

describe('useBodyScrollLock', () => {
  it('locks scrolling while active and restores the previous styles exactly', () => {
    document.documentElement.style.overflow = 'visible'
    const { rerender } = renderHook(({ locked }) => useBodyScrollLock(locked), {
      initialProps: { locked: false },
    })
    expect(document.documentElement.style.overflow).toBe('visible')

    rerender({ locked: true })
    expect(document.documentElement.style.overflow).toBe('hidden')

    rerender({ locked: false })
    expect(document.documentElement.style.overflow).toBe('visible')
  })

  it('restores styles when unmounted while locked', () => {
    document.documentElement.style.overflow = ''
    const { unmount } = renderHook(() => useBodyScrollLock(true))
    expect(document.documentElement.style.overflow).toBe('hidden')
    unmount()
    expect(document.documentElement.style.overflow).toBe('')
  })
})
