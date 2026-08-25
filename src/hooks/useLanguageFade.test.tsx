import { act, renderHook } from '@testing-library/react'
import { useRef, type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { LanguageProvider } from '../i18n/LanguageProvider'
import { setMediaQuery } from '../test/fakes/dom'
import { useLanguage } from './useLanguage'
import { useLanguageFade } from './useLanguageFade'

const REDUCE = '(prefers-reduced-motion: reduce)'

const wrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
)

function renderFade() {
  const element = document.createElement('div')
  const animate = vi.fn()
  Object.defineProperty(element, 'animate', { value: animate })
  const { result } = renderHook(
    () => {
      const ref = useRef<HTMLDivElement | null>(element)
      useLanguageFade(ref)
      return useLanguage()
    },
    { wrapper },
  )
  return { result, animate }
}

describe('useLanguageFade', () => {
  it('does not animate on mount', () => {
    const { animate } = renderFade()
    expect(animate).not.toHaveBeenCalled()
  })

  it('runs a short crossfade when the language changes', () => {
    const { result, animate } = renderFade()
    act(() => result.current.setLang('es'))
    expect(animate).toHaveBeenCalledOnce()
  })

  it('skips the crossfade under reduced motion', () => {
    setMediaQuery(REDUCE, true)
    const { result, animate } = renderFade()
    act(() => result.current.setLang('es'))
    expect(animate).not.toHaveBeenCalled()
  })
})
