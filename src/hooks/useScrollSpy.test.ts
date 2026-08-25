import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { describe, expect, it } from 'vitest'
import { intersectionObservers } from '../test/fakes/dom'
import { useScrollSpy } from './useScrollSpy'

const IDS = ['services', 'work', 'reviews'] as const

function mountSections() {
  IDS.forEach((id) => {
    const section = document.createElement('section')
    section.id = id
    document.body.appendChild(section)
  })
}

describe('useScrollSpy', () => {
  it('reports the most visible observed section', () => {
    mountSections()
    const { result } = renderHook(() => useScrollSpy(IDS))
    const observer = intersectionObservers[0]
    expect(observer?.observed).toHaveLength(3)

    act(() => {
      observer?.trigger([
        {
          target: document.getElementById('work') ?? undefined,
          isIntersecting: true,
          intersectionRatio: 0.6,
        },
      ])
    })
    expect(result.current).toBe('work')
  })

  it('keeps the last active section when everything scrolls out', () => {
    mountSections()
    const { result } = renderHook(() => useScrollSpy(IDS))
    const observer = intersectionObservers[0]

    act(() => {
      observer?.trigger([
        {
          target: document.getElementById('reviews') ?? undefined,
          isIntersecting: true,
          intersectionRatio: 0.5,
        },
      ])
    })
    act(() => {
      observer?.trigger([
        {
          target: document.getElementById('reviews') ?? undefined,
          isIntersecting: false,
        },
      ])
    })
    expect(result.current).toBe('reviews')
  })

  it('disconnects its observer on unmount', () => {
    mountSections()
    const { unmount } = renderHook(() => useScrollSpy(IDS))
    unmount()
    expect(intersectionObservers[0]?.disconnected).toBe(true)
  })
})
