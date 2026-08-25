import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { setMediaQuery } from '../test/fakes/dom'
import { tickerCallbacks } from '../test/fakes/gsap'
import { FakeLenis } from '../test/fakes/lenis'
import { scrollToAnchor, useLenis } from './useLenis'

const REDUCE = '(prefers-reduced-motion: reduce)'

describe('useLenis', () => {
  it('creates a Lenis instance wired into the gsap ticker', () => {
    renderHook(() => useLenis())
    expect(FakeLenis.instances).toHaveLength(1)
    const lenis = FakeLenis.instances[0]
    expect(lenis?.options.lerp).toBe(0.1)
    expect(lenis?.listeners.get('scroll')?.size).toBe(1)
    expect(tickerCallbacks.size).toBe(1)
  })

  it('routes anchor scrolling through the active instance', () => {
    renderHook(() => useLenis())
    scrollToAnchor('#services', -80)
    expect(FakeLenis.instances[0]?.scrollCalls).toEqual([
      { target: '#services', options: { offset: -80 } },
    ])
  })

  it('destroys the instance and detaches the ticker on unmount', () => {
    const { unmount } = renderHook(() => useLenis())
    unmount()
    expect(FakeLenis.instances[0]?.destroyed).toBe(true)
    expect(tickerCallbacks.size).toBe(0)
  })

  it('creates nothing under prefers-reduced-motion', () => {
    setMediaQuery(REDUCE, true)
    renderHook(() => useLenis())
    expect(FakeLenis.instances).toHaveLength(0)
  })
})
