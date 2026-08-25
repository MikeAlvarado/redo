import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { setMediaQuery } from '../test/fakes/dom'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const QUERY = '(prefers-reduced-motion: reduce)'

describe('usePrefersReducedMotion', () => {
  it('is false by default and true when the user opts out of motion', () => {
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)

    act(() => setMediaQuery(QUERY, true))
    expect(result.current).toBe(true)
  })
})
