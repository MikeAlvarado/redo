import { renderHook } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { scrollTriggers } from '../test/fakes/gsap'
import { useScrollProgress } from './useScrollProgress'

function renderWithElement(onUpdate?: (progress: number) => void) {
  const element = document.createElement('div')
  document.body.appendChild(element)
  return renderHook(() => {
    const ref = useRef<HTMLDivElement | null>(element)
    return useScrollProgress(ref, { onUpdate })
  })
}

describe('useScrollProgress', () => {
  it('tracks 0..1 progress into the returned ref and callback', () => {
    const onUpdate = vi.fn()
    const { result } = renderWithElement(onUpdate)
    expect(scrollTriggers).toHaveLength(1)

    scrollTriggers[0]?.setProgress(0.42)
    expect(result.current.current).toBe(0.42)
    expect(onUpdate).toHaveBeenCalledWith(0.42)
  })

  it('kills its ScrollTrigger on unmount', () => {
    const { unmount } = renderWithElement()
    unmount()
    expect(scrollTriggers[0]?.killed).toBe(true)
  })
})
